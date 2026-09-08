import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  aiKeysSchema,
  DEFAULT_ENABLED,
  DEFAULT_ORDER,
  getProvider,
  type AiKeysPayload,
  type ProviderDef,
  type ProviderId,
} from "./providers";

export type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

export type ChatOk = {
  ok: true;
  text: string;
  provider: string;
  model: string;
  fallback: boolean;
};

export type ChatErr = { ok: false; error: string; tried: string[] };

export type ChatResult = ChatOk | ChatErr;

export function aiMeta(result: ChatOk) {
  return {
    provider: result.provider,
    model: result.model,
    fallback: result.fallback,
  };
}

function envGrokKey() {
  return process.env.XAI_API_KEY?.trim() || "";
}

function keyFor(id: ProviderId, keys?: AiKeysPayload) {
  const pasted = keys?.[id]?.trim() ?? "";
  if (pasted) return pasted;
  if (id === "grok") return envGrokKey();
  return "";
}

function modelFor(def: ProviderDef, keys?: AiKeysPayload) {
  const chosen = keys?.models?.[def.id]?.trim();
  if (chosen && def.models.includes(chosen)) return chosen;
  return def.defaultModel;
}

function shouldFallback(status: number, body: string) {
  if ([401, 402, 403, 429, 500, 502, 503, 529].includes(status)) return true;
  const t = body.toLowerCase();
  return (
    t.includes("quota") ||
    t.includes("resource_exhausted") ||
    t.includes("resource exhausted") ||
    t.includes("rate limit") ||
    t.includes("insufficient") ||
    t.includes("billing") ||
    t.includes("usage") ||
    t.includes("credits") ||
    t.includes("overloaded")
  );
}

function queue(keys?: AiKeysPayload, force?: string): ProviderId[] {
  if (force && getProvider(force)) return [force as ProviderId];
  const enabled = new Set(
    (keys?.enabled?.length ? keys.enabled : DEFAULT_ENABLED).filter((id) =>
      getProvider(id),
    ),
  );
  const order = (keys?.order?.length ? keys.order : DEFAULT_ORDER).filter((id) =>
    getProvider(id),
  ) as ProviderId[];
  const listed = order.filter((id) => enabled.has(id));
  for (const id of DEFAULT_ORDER) {
    if (enabled.has(id) && !listed.includes(id)) listed.push(id);
  }
  return listed;
}

async function callOpenAi(
  def: ProviderDef,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<{ ok: true; text: string } | { ok: false; error: string; retry: boolean }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
  };
  if (def.id === "openrouter") {
    headers["HTTP-Referer"] = "https://nyayadraft.app";
    headers["X-Title"] = "NyayaDraft";
  }
  const res = await fetch(def.url ?? "", {
    method: "POST",
    headers,
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      temperature,
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      error: `${def.name} returned ${res.status}.`,
      retry: shouldFallback(res.status, raw),
    };
  }
  const body = JSON.parse(raw) as {
    choices?: { message?: { content?: string } }[];
  };
  return { ok: true, text: body.choices?.[0]?.message?.content ?? "" };
}

async function callAnthropic(
  def: ProviderDef,
  apiKey: string,
  model: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<{ ok: true; text: string } | { ok: false; error: string; retry: boolean }> {
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const rest = messages.filter((m) => m.role !== "system");
  const res = await fetch(def.url ?? "", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature,
      system: system || undefined,
      messages: rest.map((m) => ({ role: m.role, content: m.content })),
    }),
  });
  const raw = await res.text();
  if (!res.ok) {
    return {
      ok: false,
      error: `${def.name} returned ${res.status}.`,
      retry: shouldFallback(res.status, raw),
    };
  }
  const body = JSON.parse(raw) as {
    content?: { type?: string; text?: string }[];
  };
  const text = (body.content ?? [])
    .filter((p) => p.type === "text")
    .map((p) => p.text ?? "")
    .join("");
  return { ok: true, text };
}

async function callGemini(
  def: ProviderDef,
  apiKey: string,
  preferred: string,
  messages: ChatMessage[],
  maxTokens: number,
  temperature: number,
): Promise<{ ok: true; text: string; model: string } | { ok: false; error: string; retry: boolean }> {
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n\n");
  const contents: { role: "user" | "model"; parts: { text: string }[] }[] = [];
  for (const m of messages) {
    if (m.role === "system") continue;
    const role = m.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts[0].text += `\n\n${m.content}`;
    } else {
      contents.push({ role, parts: [{ text: m.content }] });
    }
  }
  if (!contents.length) {
    contents.push({ role: "user", parts: [{ text: "Continue." }] });
  }

  const tryModels = [
    preferred,
    def.defaultModel,
    "gemini-2.5-flash",
    "gemini-2.0-flash",
  ].filter((m, i, arr) => arr.indexOf(m) === i);

  let lastError = `${def.name} returned an error.`;
  let lastRetry = true;
  for (const model of tryModels) {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: system ? { parts: [{ text: system }] } : undefined,
          contents,
          generationConfig: {
            maxOutputTokens: maxTokens,
            temperature,
          },
        }),
      },
    );
    const raw = await res.text();
    if (res.status === 404) {
      lastError = `${def.name} model ${model} was not found.`;
      lastRetry = true;
      continue;
    }
    if (!res.ok) {
      lastError = `${def.name} returned ${res.status}.`;
      lastRetry = shouldFallback(res.status, raw);
      if (!lastRetry) return { ok: false, error: lastError, retry: false };
      continue;
    }
    const body = JSON.parse(raw) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
      promptFeedback?: { blockReason?: string };
    };
    const text = (body.candidates?.[0]?.content?.parts ?? [])
      .map((p) => p.text ?? "")
      .join("");
    if (!text.trim()) {
      lastError = body.promptFeedback?.blockReason
        ? `${def.name} blocked the prompt.`
        : `${def.name} returned an empty reply.`;
      lastRetry = true;
      continue;
    }
    return { ok: true, text, model };
  }
  return { ok: false, error: lastError, retry: lastRetry };
}

export async function chat(options: {
  messages: ChatMessage[];
  maxTokens: number;
  temperature?: number;
  keys?: AiKeysPayload;
  forceProvider?: string;
}): Promise<ChatResult> {
  const keys = options.keys;
  const allowFallback = keys?.fallback !== false && !options.forceProvider;
  const ids = queue(keys, options.forceProvider);
  const tried: string[] = [];
  const temperature = options.temperature ?? 0.2;
  let lastError = "No drafting model is available.";

  for (let i = 0; i < ids.length; i += 1) {
    const id = ids[i];
    const def = getProvider(id);
    if (!def) continue;
    const apiKey = keyFor(id, keys);
    if (!apiKey) {
      if (id === "grok") {
        lastError =
          "Grok is not available. Add a Gemini API key under Models to keep drafting.";
      }
      continue;
    }
    const model = modelFor(def, keys);
    tried.push(def.name);
    try {
      let outcome:
        | { ok: true; text: string; model?: string }
        | { ok: false; error: string; retry: boolean };
      if (def.kind === "gemini") {
        outcome = await callGemini(
          def,
          apiKey,
          model,
          options.messages,
          options.maxTokens,
          temperature,
        );
      } else if (def.kind === "anthropic") {
        outcome = await callAnthropic(
          def,
          apiKey,
          model,
          options.messages,
          options.maxTokens,
          temperature,
        );
      } else {
        outcome = await callOpenAi(
          def,
          apiKey,
          model,
          options.messages,
          options.maxTokens,
          temperature,
        );
      }
      if (outcome.ok && outcome.text.trim()) {
        return {
          ok: true,
          text: outcome.text,
          provider: id,
          model: "model" in outcome && outcome.model ? outcome.model : model,
          fallback: i > 0,
        };
      }
      if (outcome.ok) {
        lastError = `${def.name} returned an empty reply.`;
      } else {
        lastError = outcome.error;
        if (!outcome.retry || !allowFallback) {
          return { ok: false, error: lastError, tried };
        }
      }
    } catch (err) {
      lastError = err instanceof Error ? err.message : `${def.name} failed.`;
      if (!allowFallback) return { ok: false, error: lastError, tried };
    }
  }

  if (!tried.length) {
    return {
      ok: false,
      error:
        "No drafting model is ready. Grok usage may be exhausted — add a Gemini API key under Models.",
      tried,
    };
  }
  return {
    ok: false,
    error: `${lastError} Tried: ${tried.join(", ")}. Add or enable another key under Models.`,
    tried,
  };
}

export const providerStatusFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    input && typeof input === "object" ? input : {},
  )
  .handler(async () => ({
    grokEnv: Boolean(envGrokKey()),
  }));

export const testProviderFn = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        provider: z.string().min(2).max(32),
        aiKeys: aiKeysSchema,
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    return chat({
      messages: [
        { role: "system", content: "Reply with the single word OK." },
        { role: "user", content: "Ping." },
      ],
      maxTokens: 16,
      temperature: 0,
      keys: data.aiKeys,
      forceProvider: data.provider,
    });
  });
