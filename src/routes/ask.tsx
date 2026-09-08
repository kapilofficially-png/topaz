import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { CitationPanel, type Citation } from "@/components/citation-panel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { askTheLaw } from "@/lib/ai/legal";
import { aiKeysPayload, rememberProvider } from "@/lib/ai/keys-store";

export const Route = createFileRoute("/ask")({ component: AskPage });

const STARTERS = [
  "When is a post-employment non-compete void in India?",
  "Walk me through the 30–15–30 timeline for a section 138 notice.",
  "Can an Indian web store write 'all sales final' in its refund policy?",
  "What must a DPDP consent notice tell the customer?",
];

function AskPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [busy, setBusy] = useState(false);

  async function run(q: string) {
    const text = q.trim();
    if (text.length < 8) {
      toast.error("Ask a complete question of Indian law.");
      return;
    }
    setQuestion(text);
    setBusy(true);
    try {
      const result = await askTheLaw({ data: { question: text, aiKeys: aiKeysPayload() } });
      if (!result.ok) {
        toast.error(result.error);
        setCitations(result.citations);
        return;
      }
      rememberProvider(result);
      setAnswer(result.text);
      setCitations(result.citations);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The library could not answer.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-[12px] tracking-[0.18em] text-muted uppercase">
          Grounded Q&A
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          Ask the law
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Questions are answered from the same corpus that grounds drafts — not
          from an uncited model memory.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {STARTERS.map((s) => (
            <button
              key={s}
              type="button"
              disabled={busy}
              onClick={() => void run(s)}
              className="rounded-full border border-border bg-surface px-3 py-2 text-left text-[13px] text-ink hover:bg-surface-2"
            >
              {s}
            </button>
          ))}
        </div>
        <form
          className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            void run(question);
          }}
        >
          <Textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Can I file a Zero FIR if the offence took place in another State?"
            className="min-h-24 sm:min-h-20"
            disabled={busy}
          />
          <Button type="submit" disabled={busy} className="sm:h-11">
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            Ask
          </Button>
        </form>
        <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]">
          <article className="rounded-[var(--radius-lg)] border border-border bg-paper p-6 shadow-[var(--shadow-border)] sm:p-8">
            {busy && !answer ? (
              <p className="font-serif text-muted italic">
                Retrieving authorities and composing an answer…
              </p>
            ) : answer ? (
              <div className="font-serif text-[16px] leading-[1.7] whitespace-pre-wrap">
                {answer}
              </div>
            ) : (
              <p className="font-serif text-muted italic">
                Put a question of Indian law. The answer will cite the retrieved
                heads.
              </p>
            )}
          </article>
          <CitationPanel citations={citations} title="Retrieved for this question" />
        </div>
      </main>
    </AppShell>
  );
}
