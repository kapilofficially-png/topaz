import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  Check,
  ExternalLink,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  providerStatusFn,
  testProviderFn,
} from "@/lib/ai/chat";
import { useKeysStore } from "@/lib/ai/keys-store";
import {
  PROVIDERS,
  getProvider,
  type ProviderId,
} from "@/lib/ai/providers";

export const Route = createFileRoute("/models")({ component: ModelsPage });

function ModelsPage() {
  const store = useKeysStore();
  const [reveal, setReveal] = useState<Partial<Record<ProviderId, boolean>>>({});
  const [testing, setTesting] = useState<string>("");

  useEffect(() => {
    void providerStatusFn({ data: {} }).then((s) => {
      useKeysStore.getState().setGrokEnv(s.grokEnv);
    });
  }, []);

  const ready = PROVIDERS.filter((p) => {
    if (!store.enabled.includes(p.id)) return false;
    if (p.id === "grok") return Boolean(store.keys.grok?.trim() || store.grokEnv);
    return Boolean(store.keys[p.id]?.trim());
  });
  const readyLabel = ready.length
    ? ready.map((p) => p.name).join(" → ")
    : "Add a Gemini key so drafting continues when Grok is exhausted.";

  async function test(id: ProviderId) {
    setTesting(id);
    try {
      const result = await testProviderFn({
        data: { provider: id, aiKeys: store.toPayload() },
      });
      if (!result.ok) {
        store.setLastError(result.error);
        toast.error(result.error);
        return;
      }
      store.setLastUsed(result.provider, result.model, false);
      toast.success(`${getProvider(id)?.name ?? id} replied.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Test failed.";
      store.setLastError(msg);
      toast.error(msg);
    } finally {
      setTesting("");
    }
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-[12px] tracking-[0.18em] text-muted uppercase">
          Drafting models
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          Models and API keys
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Grok is the primary drafter. When its usage is exhausted, NyayaDraft
          falls through this list to the next enabled key. Gemini is the
          recommended free fallback. Keys stay on this device and are sent only
          to the matching provider for that run — they are not saved in History.
        </p>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              Primary
            </p>
            <p className="mt-1 font-display text-xl">Grok (xAI)</p>
            <p className="mt-1 text-sm text-muted">
              {store.grokEnv ? "App key is available." : "No app key detected."}
            </p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              Ready now
            </p>
            <p className="mt-1 font-display text-xl">{ready.length}</p>
            <p className="mt-1 text-sm text-muted">{readyLabel}</p>
          </div>
          <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-4">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              Last used
            </p>
            <p className="mt-1 font-display text-xl">
              {store.lastProvider
                ? getProvider(store.lastProvider)?.name ?? store.lastProvider
                : "—"}
            </p>
            <p className="mt-1 text-sm text-muted">
              {store.lastModel
                ? `${store.lastModel}${store.lastFallback ? " (fallback)" : ""}`
                : store.lastError || "No drafting run yet."}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-paper px-4 py-3">
          <Shield className="size-4 text-muted" />
          <p className="text-sm text-ink">
            Fall back when Grok is exhausted or errors
          </p>
          <Button
            type="button"
            size="sm"
            variant={store.fallback ? "default" : "outline"}
            className="ml-auto"
            onClick={() => store.setFallback(!store.fallback)}
          >
            {store.fallback ? "On" : "Off"}
          </Button>
        </div>

        <ol className="mt-8 space-y-4">
          {store.order.map((id, index) => {
            const def = getProvider(id);
            if (!def) return null;
            const on = store.enabled.includes(id);
            const key = store.keys[id] ?? "";
            const shown = reveal[id];
            const grokReady = id === "grok" && (Boolean(key.trim()) || store.grokEnv);
            const readyNow = id === "grok" ? grokReady : Boolean(key.trim());
            return (
              <li
                key={id}
                className="rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <span className="flex size-8 items-center justify-center rounded-full bg-surface-2 font-display text-sm">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="font-display text-xl font-medium tracking-tight">
                        {def.name}
                      </h2>
                      {def.primary ? <Badge>Primary</Badge> : null}
                      {def.recommended ? (
                        <Badge variant="muted">Recommended fallback</Badge>
                      ) : null}
                      {on && readyNow ? (
                        <Badge variant="muted">Ready</Badge>
                      ) : on ? (
                        <Badge variant="outline">Needs key</Badge>
                      ) : (
                        <Badge variant="outline">Off</Badge>
                      )}
                    </div>
                    <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                      {def.note}
                    </p>
                    <a
                      href={def.docs}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1 text-sm text-primary underline-offset-4 hover:underline"
                    >
                      Get a key — {def.docsLabel}
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Move up"
                      disabled={index === 0}
                      onClick={() => store.move(id, -1)}
                    >
                      <ArrowUp />
                    </Button>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      aria-label="Move down"
                      disabled={index === store.order.length - 1}
                      onClick={() => store.move(id, 1)}
                    >
                      <ArrowDown />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={on ? "default" : "outline"}
                      onClick={() => store.setEnabled(id, !on)}
                    >
                      {on ? "Enabled" : "Disabled"}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`key-${id}`}>API key</Label>
                    <div className="mt-1.5 flex gap-2">
                      <Input
                        id={`key-${id}`}
                        type={shown ? "text" : "password"}
                        autoComplete="off"
                        spellCheck={false}
                        value={key}
                        placeholder={
                          id === "grok"
                            ? store.grokEnv
                              ? "Optional — app key will be used"
                              : "xai-…"
                            : id === "gemini"
                              ? "AIza…"
                              : "Paste key"
                        }
                        onChange={(e) => store.setKey(id, e.target.value)}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="outline"
                        aria-label={shown ? "Hide key" : "Show key"}
                        onClick={() =>
                          setReveal((r) => ({ ...r, [id]: !r[id] }))
                        }
                      >
                        {shown ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    {id === "grok" && store.grokEnv && !key.trim() ? (
                      <p className="mt-1.5 text-[12px] text-muted">
                        Using the app’s xAI key until you paste your own.
                      </p>
                    ) : null}
                  </div>
                  <div>
                    <Label htmlFor={`model-${id}`}>Model</Label>
                    <select
                      id={`model-${id}`}
                      className="mt-1.5 flex h-11 w-full rounded-[var(--radius-sm)] border border-border bg-paper px-3 text-sm text-ink shadow-[var(--shadow-border)]"
                      value={store.models[id] || def.defaultModel}
                      onChange={(e) => store.setModel(id, e.target.value)}
                    >
                      {def.models.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    disabled={!readyNow || testing === id}
                    onClick={() => void test(id)}
                  >
                    {testing === id ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      <Check />
                    )}
                    Test connection
                  </Button>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-8 rounded-[var(--radius-lg)] border border-border bg-paper px-5 py-4">
          <p className="flex items-center gap-2 font-medium">
            <KeyRound className="size-4" />
            How fallback works
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm leading-relaxed text-muted">
            <li>Every draft, audit, rewrite, email or ask tries Grok first (if enabled).</li>
            <li>
              If Grok is rate-limited, out of quota, or missing, the next enabled
              key in this list is used — Gemini if you pasted one.
            </li>
            <li>
              Get a free Gemini key at{" "}
              <a
                href="https://aistudio.google.com/apikey"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-4 hover:underline"
              >
                Google AI Studio
              </a>
              , paste it above, leave Gemini enabled, and keep fallback on.
            </li>
            <li>
              Your keys never go into History, Word, PDF, or the store papers.
            </li>
          </ol>
        </div>
      </main>
    </AppShell>
  );
}
