import { useEffect } from "react";
import { Check, RotateCcw, Timer } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  CLOCK_A,
  CLOCK_B,
  STAGE_LABEL,
  daysSince,
  nextClockA,
  nextClockB,
  pipelineStage,
  usePipelineStore,
  type TouchDef,
} from "@/lib/drafts/pipeline-store";

export function PipelineBoard({ host, origin }: { host: string; origin: string }) {
  const ensure = usePipelineStore((s) => s.ensure);
  const startSequence = usePipelineStore((s) => s.startSequence);
  const markSent = usePipelineStore((s) => s.markSent);
  const unmarkSent = usePipelineStore((s) => s.unmarkSent);
  const setFlag = usePipelineStore((s) => s.setFlag);
  const setNotes = usePipelineStore((s) => s.setNotes);
  const park = usePipelineStore((s) => s.park);
  const unpark = usePipelineStore((s) => s.unpark);
  const resetHost = usePipelineStore((s) => s.resetHost);
  const pipe = usePipelineStore((s) => s.stores[host]);

  useEffect(() => {
    if (host) ensure(host, origin);
  }, [host, origin, ensure]);
  const p = pipe ?? {
    host,
    origin,
    startedAt: null,
    repliedAt: null,
    parkedAt: null,
    sent: {},
    flags: {
      sampleSent: false,
      replied: false,
      feeAgreed: false,
      questionsIn: false,
      agreementSent: false,
    },
    notes: "",
  };
  if (!host) return null;
  const stage = pipelineStage(p);
  const nextA = nextClockA(p);
  const nextB = nextClockB(p);
  const next = nextB ?? nextA;

  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
            Onboard timeline · {host}
          </p>
          <h2 className="mt-1 font-display text-2xl font-medium">
            {STAGE_LABEL[stage]}
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted">
            Clock A is the 21-day sequence until they reply. Clock B starts the
            day they ask for the sample. They are a client only when fee and
            questionnaire are both in.
          </p>
        </div>
        <Badge variant={stage === "onboarded" ? "default" : "muted"}>
          {p.startedAt ? `Day ${daysSince(p.startedAt)} of sequence` : "Not started"}
        </Badge>
      </div>

      {next ? (
        <p className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2 px-3 py-2 text-sm">
          <Timer className="mr-1 inline size-3.5 text-muted" />
          Next: <span className="text-ink">{next.label}</span>
          <span className="text-muted"> — {next.hint}</span>
        </p>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <ClockColumn
          title="Clock A — until they reply"
          items={CLOCK_A}
          sent={p.sent}
          startedAt={p.startedAt}
          onToggle={(id, done) =>
            done ? unmarkSent(host, id) : markSent(host, id)
          }
        />
        <ClockColumn
          title="Clock B — after they reply"
          items={CLOCK_B}
          sent={p.sent}
          startedAt={p.repliedAt}
          onToggle={(id, done) =>
            done ? unmarkSent(host, id) : markSent(host, id)
          }
        />
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {(
          [
            ["sampleSent", "Sample sent"],
            ["replied", "They replied"],
            ["feeAgreed", "Fee agreed"],
            ["questionsIn", "Questionnaire in"],
            ["agreementSent", "Agreement sent"],
          ] as const
        ).map(([key, label]) => (
          <label
            key={key}
            className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              checked={p.flags[key]}
              onChange={(e) => setFlag(host, key, e.target.checked)}
            />
            {label}
          </label>
        ))}
      </div>

      <Textarea
        className="mt-4"
        value={p.notes}
        onChange={(e) => setNotes(host, e.target.value)}
        placeholder="Call notes, who you spoke to, fee they accepted…"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          variant="outline"
          onClick={() => startSequence(host, origin)}
          disabled={Boolean(p.startedAt) && !p.parkedAt}
        >
          Start 21-day sequence today
        </Button>
        {p.parkedAt ? (
          <Button variant="outline" onClick={() => unpark(host)}>
            Unpark
          </Button>
        ) : (
          <Button variant="outline" onClick={() => park(host)}>
            Park 60 days
          </Button>
        )}
        <Button variant="outline" onClick={() => resetHost(host)}>
          <RotateCcw className="size-4" />
          Reset this store
        </Button>
      </div>
    </div>
  );
}

function ClockColumn({
  title,
  items,
  sent,
  startedAt,
  onToggle,
}: {
  title: string;
  items: TouchDef[];
  sent: Record<string, number>;
  startedAt: number | null;
  onToggle: (id: string, currentlyDone: boolean) => void;
}) {
  const elapsed = daysSince(startedAt);
  return (
    <div>
      <p className="text-[12px] tracking-[0.14em] text-muted uppercase">{title}</p>
      <ol className="mt-2 grid gap-2">
        {items.map((t) => {
          const done = Boolean(sent[t.id]);
          const due = startedAt != null && elapsed >= t.day && !done;
          return (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => onToggle(t.id, done)}
                className={cn(
                  "flex w-full items-start gap-3 rounded-[var(--radius-md)] border px-3 py-2 text-left text-sm transition-colors",
                  done
                    ? "border-border bg-surface-2 text-muted"
                    : due
                      ? "border-primary bg-primary/5"
                      : "border-border",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border",
                    done ? "border-primary bg-primary text-primary-fg" : "border-border",
                  )}
                >
                  {done ? <Check className="size-3" /> : null}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-medium text-ink">
                    Day {t.day} · {t.label}
                  </span>
                  <span className="block text-[13px] text-muted">{t.hint}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
