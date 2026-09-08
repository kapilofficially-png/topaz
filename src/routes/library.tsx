import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CORPUS } from "@/lib/rag/corpus";
import { retrieve } from "@/lib/rag/retrieve";
import { LAW_CATEGORIES, type LawCategory, type LawChunk } from "@/lib/rag/types";

export const Route = createFileRoute("/library")({ component: LibraryPage });

const LABELS: Record<LawCategory, string> = {
  constitutional: "Constitutional",
  criminal: "Criminal",
  procedure: "Procedure",
  contract: "Contract",
  commercial: "Commercial",
  consumer: "Consumer",
  property: "Property",
  family: "Family",
  labour: "Labour",
  corporate: "Corporate",
  evidence: "Evidence",
  public: "Public law",
  drafting: "Drafting",
};

function LibraryPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<LawCategory | "all">("all");
  const [activeId, setActiveId] = useState<string>(CORPUS[0]?.id ?? "");

  const list = useMemo(() => {
    if (q.trim().length >= 2) {
      return retrieve({
        query: q,
        k: 30,
        categories: category === "all" ? undefined : [category],
      });
    }
    return category === "all"
      ? CORPUS
      : CORPUS.filter((c) => c.category === category);
  }, [q, category]);

  const active: LawChunk | undefined =
    list.find((c) => c.id === activeId) ?? list[0] ?? CORPUS.find((c) => c.id === activeId);

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-[12px] tracking-[0.18em] text-muted uppercase">
          Retrieval corpus
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          Library of authorities
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          {CORPUS.length} abridged heads of Indian statute and drafting practice.
          This is the index the drafter searches before it writes.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search 138, refund, DPDP, Article 21…"
            className="sm:max-w-md"
          />
        </div>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
          <Chip
            active={category === "all"}
            onClick={() => setCategory("all")}
            label="All"
          />
          {LAW_CATEGORIES.map((c) => (
            <Chip
              key={c}
              active={category === c}
              onClick={() => setCategory(c)}
              label={LABELS[c]}
            />
          ))}
        </div>
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
          <div className="overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-border)]">
            <ScrollArea className="h-[32rem]">
              <ul>
                {list.map((c) => (
                  <li key={c.id} className="border-b border-border last:border-0">
                    <button
                      type="button"
                      onClick={() => setActiveId(c.id)}
                      className={
                        c.id === active?.id
                          ? "w-full px-4 py-3 text-left bg-surface-2"
                          : "w-full px-4 py-3 text-left hover:bg-surface-2"
                      }
                    >
                      <p className="text-sm font-medium">{c.citation}</p>
                      <p className="text-[13px] text-muted">{c.title}</p>
                    </button>
                  </li>
                ))}
              </ul>
            </ScrollArea>
          </div>
          {active ? (
            <article className="rounded-[var(--radius-lg)] border border-border bg-paper p-6 shadow-[var(--shadow-border)] sm:p-8">
              <Badge variant="muted">{LABELS[active.category]}</Badge>
              <h2 className="mt-3 font-display text-2xl font-medium tracking-tight">
                {active.citation}
              </h2>
              <p className="mt-1 text-sm text-muted">{active.title}</p>
              <p className="mt-1 text-[13px] text-subtle">{active.statute}</p>
              <div className="mt-6 font-serif text-[16px] leading-[1.7]">{active.text}</div>
              {active.note ? (
                <p className="mt-6 border-t border-border pt-4 text-[13px] leading-relaxed text-muted">
                  {active.note}
                </p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-1.5">
                {active.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </article>
          ) : (
            <p className="py-16 text-sm text-muted">No head matches.</p>
          )}
        </div>
      </main>
    </AppShell>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-primary px-3 py-2 text-[13px] text-primary-fg whitespace-nowrap"
          : "rounded-full bg-surface-2 px-3 py-2 text-[13px] text-muted whitespace-nowrap hover:text-ink"
      }
    >
      {label}
    </button>
  );
}
