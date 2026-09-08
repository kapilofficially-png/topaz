import { z } from "zod";

export const PROVIDER_IDS = [
  "grok",
  "gemini",
  "groq",
  "openai",
  "anthropic",
  "openrouter",
  "mistral",
  "deepseek",
] as const;

export type ProviderId = (typeof PROVIDER_IDS)[number];

export type ProviderKind = "openai" | "gemini" | "anthropic";

export type ProviderDef = {
  id: ProviderId;
  name: string;
  kind: ProviderKind;
  url?: string;
  models: string[];
  defaultModel: string;
  docs: string;
  docsLabel: string;
  note: string;
  primary?: boolean;
  recommended?: boolean;
  envKey?: string;
};

export const PROVIDERS: readonly ProviderDef[] = [
  {
    id: "grok",
    name: "Grok (xAI)",
    kind: "openai",
    url: "https://api.x.ai/v1/chat/completions",
    models: ["grok-4.5", "grok-4-fast-non-reasoning", "grok-3-mini"],
    defaultModel: "grok-4.5",
    docs: "https://console.x.ai",
    docsLabel: "xAI console",
    note: "Primary. NyayaDraft uses the app’s xAI key first. Paste your own only if you have a separate xAI key.",
    primary: true,
    envKey: "XAI_API_KEY",
  },
  {
    id: "gemini",
    name: "Gemini (Google)",
    kind: "gemini",
    models: [
      "gemini-2.5-flash",
      "gemini-2.0-flash",
      "gemini-2.5-pro",
      "gemini-3.8-flash",
    ],
    defaultModel: "gemini-2.5-flash",
    docs: "https://aistudio.google.com/apikey",
    docsLabel: "Google AI Studio",
    note: "Free Google AI Studio key. Use this when Grok usage is exhausted. No credit card required for the free tier.",
    recommended: true,
  },
  {
    id: "groq",
    name: "Groq",
    kind: "openai",
    url: "https://api.groq.com/openai/v1/chat/completions",
    models: ["llama-3.3-70b-versatile", "llama-3.1-8b-instant"],
    defaultModel: "llama-3.3-70b-versatile",
    docs: "https://console.groq.com/keys",
    docsLabel: "Groq console",
    note: "Fast free-tier OpenAI-compatible API. Good second fallback.",
  },
  {
    id: "openai",
    name: "OpenAI",
    kind: "openai",
    url: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-4o-mini", "gpt-4.1-mini", "gpt-4o"],
    defaultModel: "gpt-4o-mini",
    docs: "https://platform.openai.com/api-keys",
    docsLabel: "OpenAI platform",
    note: "Paid. gpt-4o-mini is the cheapest drafting model.",
  },
  {
    id: "anthropic",
    name: "Claude (Anthropic)",
    kind: "anthropic",
    url: "https://api.anthropic.com/v1/messages",
    models: ["claude-3-5-haiku-latest", "claude-sonnet-4-5"],
    defaultModel: "claude-3-5-haiku-latest",
    docs: "https://console.anthropic.com/settings/keys",
    docsLabel: "Anthropic console",
    note: "Paid. Haiku is enough for policy drafts.",
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    kind: "openai",
    url: "https://openrouter.ai/api/v1/chat/completions",
    models: [
      "google/gemini-2.0-flash-exp:free",
      "openai/gpt-4o-mini",
      "anthropic/claude-3.5-haiku",
    ],
    defaultModel: "google/gemini-2.0-flash-exp:free",
    docs: "https://openrouter.ai/keys",
    docsLabel: "OpenRouter keys",
    note: "One key, many models. Free Gemini route is a spare fallback.",
  },
  {
    id: "mistral",
    name: "Mistral",
    kind: "openai",
    url: "https://api.mistral.ai/v1/chat/completions",
    models: ["mistral-small-latest", "mistral-large-latest"],
    defaultModel: "mistral-small-latest",
    docs: "https://console.mistral.ai/api-keys",
    docsLabel: "Mistral console",
    note: "EU-hosted. Small is the free/cheap drafting model.",
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    kind: "openai",
    url: "https://api.deepseek.com/chat/completions",
    models: ["deepseek-chat"],
    defaultModel: "deepseek-chat",
    docs: "https://platform.deepseek.com/api_keys",
    docsLabel: "DeepSeek platform",
    note: "Low-cost OpenAI-compatible chat model.",
  },
] as const;

export const DEFAULT_ORDER: ProviderId[] = [
  "grok",
  "gemini",
  "groq",
  "openai",
  "anthropic",
  "openrouter",
  "mistral",
  "deepseek",
];

export const DEFAULT_ENABLED: ProviderId[] = ["grok", "gemini"];

export function getProvider(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

export const aiKeysSchema = z
  .object({
    grok: z.string().max(240).optional(),
    gemini: z.string().max(240).optional(),
    openai: z.string().max(240).optional(),
    anthropic: z.string().max(240).optional(),
    groq: z.string().max(240).optional(),
    openrouter: z.string().max(240).optional(),
    mistral: z.string().max(240).optional(),
    deepseek: z.string().max(240).optional(),
    order: z.array(z.string().max(32)).max(12).optional(),
    enabled: z.array(z.string().max(32)).max(12).optional(),
    models: z.record(z.string(), z.string().max(80)).optional(),
    fallback: z.boolean().optional(),
  })
  .optional();

export type AiKeysPayload = NonNullable<z.infer<typeof aiKeysSchema>>;
