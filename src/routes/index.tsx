import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Globe, Landmark, Scale, Send } from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  PRACTICE_AREAS,
  TEMPLATES,
  type PracticeArea,
} from "@/lib/drafts/templates";
import { corpusStats } from "@/lib/rag/retrieve";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [area, setArea] = useState<PracticeArea | "all">("all");
  const [q, setQ] = useState("");
  const stats = corpusStats();

  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return TEMPLATES.filter((t) => {
      if (area !== "all" && t.area !== area) return false;
      if (!needle) return true;
      return (
        t.title.toLowerCase().includes(needle) ||
        t.blurb.toLowerCase().includes(needle) ||
        t.forum.toLowerCase().includes(needle)
      );
    });
  }, [area, q]);

  return (
    <AppShell>
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:py-16">
            <div>
              <p className="text-[12px] tracking-[0.2em] text-muted uppercase">
                Chambers drafting · RAG over Indian statute
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.12] font-medium tracking-tight sm:text-5xl">
                Draft Indian legal
                <br />
                instruments on the Act,
                <br />
                not on a guess.
              </h1>
              <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-muted">
                NyayaDraft retrieves the governing sections — BNS, BNSS, Contract
                Act, NI Act, CPA 2019, DPDP, e-commerce rules — then asks Grok
                to compose the notice, plaint, deed, or store policy from your
                facts.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4 max-w-lg">
                <Stat label="Instruments" value={String(TEMPLATES.length)} />
                <Stat label="Corpus heads" value={String(stats.total)} />
                <Stat label="Codes in force" value="2023+" />
              </dl>
              <Link
                to="/audit"
                className="mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-4 py-3 text-sm font-medium text-primary shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]"
              >
                <Globe className="size-4" />
                Audit a live store’s policies
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/batch"
                className="mt-3 ml-0 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-4 py-3 text-sm font-medium text-primary shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)] sm:ml-3"
              >
                <Globe className="size-4" />
                Batch 50 stores
              </Link>
              <Link
                to="/outreach"
                className="mt-3 ml-0 inline-flex items-center gap-2 rounded-[var(--radius-md)] bg-primary px-4 py-3 text-sm font-medium text-primary-fg sm:ml-3"
              >
                <Send className="size-4" />
                Cold-email a store
              </Link>
            </div>
            <aside className="flex flex-col justify-end gap-3">
              <Note
                icon={<Scale className="size-4" />}
                title="Retrieval first"
                body="Every draft is grounded in a BM25 pass over an India-law corpus. Citations sit beside the page."
              />
              <Note
                icon={<Landmark className="size-4" />}
                title="Current criminal codes"
                body="BNS, BNSS and BSA from 1 July 2024 — with mappings from the old IPC / CrPC numbers you still type."
              />
              <Note
                icon={<BookOpen className="size-4" />}
                title="For review, not filing"
                body="A first cut for chambers. Stamp, limitation and a human advocate still have the last word."
              />
            </aside>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-2xl font-medium tracking-tight">
                Choose an instrument
              </h2>
              <p className="mt-1 text-sm text-muted">
                Load a sample matter if you want to see a full draft immediately.
              </p>
            </div>
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search notices, store policies, RTI…"
              className="sm:max-w-xs"
            />
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {PRACTICE_AREAS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setArea(item.id)}
                className={
                  area === item.id
                    ? "rounded-full bg-primary px-3 py-2 text-[13px] text-primary-fg whitespace-nowrap"
                    : "rounded-full bg-surface-2 px-3 py-2 text-[13px] text-muted whitespace-nowrap hover:text-ink"
                }
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((t) => (
              <Link
                key={t.slug}
                to="/draft/$slug"
                params={{ slug: t.slug }}
                className="group flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)]"
              >
                <Badge variant="muted">{t.forum}</Badge>
                <h3 className="mt-3 font-display text-xl font-medium tracking-tight group-hover:text-primary">
                  {t.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {t.blurb}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Open the matter
                  <ArrowRight className="size-4 transition-transform duration-[var(--motion-quick)] group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          {list.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted">
              No instrument matches that search.
            </p>
          ) : null}
        </section>
      </main>
    </AppShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[11px] tracking-[0.14em] text-muted uppercase">
        {label}
      </dt>
      <dd className="font-display text-3xl font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function Note({
  icon,
  title,
  body,
}: {
  icon: ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-[var(--radius-lg)] border border-border bg-bg p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <p className="text-sm font-medium text-ink">{title}</p>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{body}</p>
    </div>
  );
}
