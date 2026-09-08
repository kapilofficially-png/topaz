import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Copy, Download, FileDown, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Fold } from "@/components/fold";
import { DraftPaper } from "@/components/draft-paper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuditStore } from "@/lib/drafts/audit-store";
import { downloadDraftDocx } from "@/lib/drafts/docx-export";
import { downloadPaperPdf } from "@/lib/drafts/pdf-export";
import {
  STORE_PAPER_LABEL,
  isStorePaper,
  paperHost,
  useDraftStore,
  type SavedDraft,
} from "@/lib/drafts/store";
import { getTemplate } from "@/lib/drafts/templates";

export const Route = createFileRoute("/history")({ component: HistoryPage });

function labelOf(d: SavedDraft) {
  return STORE_PAPER_LABEL[d.slug] ?? getTemplate(d.slug)?.forum ?? d.slug;
}

function preview(text: string) {
  return text
    .replace(/^#+\s+/gm, "")
    .replace(/\*\*/g, "")
    .replace(/\n{2,}/g, " ")
    .trim();
}

function stem(d: SavedDraft) {
  const host = paperHost(d) || "draft";
  const kind = (STORE_PAPER_LABEL[d.slug] ?? d.slug).toLowerCase().replace(/\s+/g, "-");
  return `NyayaDraft-${host.replace(/[^\w.-]+/g, "-")}-${kind}`;
}

function HistoryPage() {
  const drafts = useDraftStore((s) => s.drafts);
  const hydrated = useDraftStore((s) => s.hydrated);
  const setHydrated = useDraftStore((s) => s.setHydrated);
  const remove = useDraftStore((s) => s.remove);
  const hydratePaper = useAuditStore((s) => s.hydratePaper);
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);
  const [openHosts, setOpenHosts] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (useDraftStore.persist.hasHydrated()) setHydrated(true);
    const unsub = useDraftStore.persist.onFinishHydration(() => setHydrated(true));
    const t = window.setTimeout(() => setHydrated(true), 900);
    return () => {
      unsub();
      window.clearTimeout(t);
    };
  }, [setHydrated]);

  const open = drafts.find((d) => d.id === openId) ?? null;

  const groups = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const filtered = needle
      ? drafts.filter((d) =>
          `${d.title} ${d.slug} ${paperHost(d)} ${d.draftText}`
            .toLowerCase()
            .includes(needle),
        )
      : drafts;
    const map = new Map<string, SavedDraft[]>();
    for (const d of filtered) {
      const key = paperHost(d) || (isStorePaper(d.slug) ? "Store work" : "Library drafts");
      const list = map.get(key) ?? [];
      list.push(d);
      map.set(key, list);
    }
    return [...map.entries()];
  }, [drafts, q]);

  async function saveWord(d: SavedDraft) {
    try {
      await downloadDraftDocx({
        title: d.title,
        subtitle: labelOf(d),
        host: paperHost(d),
        body: d.draftText,
        filename: `${stem(d)}.docx`,
      });
      toast.success("Word file downloaded.");
    } catch {
      toast.error("Could not build the Word file.");
    }
  }

  async function savePdf(d: SavedDraft) {
    try {
      await downloadPaperPdf({
        host: paperHost(d) || "draft",
        title: d.title,
        body: d.draftText,
        filename: `${stem(d)}.pdf`,
      });
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Could not build the PDF.");
    }
  }

  function openInAudit(d: SavedDraft) {
    hydratePaper({
      slug: d.slug,
      title: d.title,
      body: d.draftText,
      notes: d.notes,
      citations: d.citations,
      facts: d.facts,
    });
    toast.success("Loaded into Audit store.");
    void navigate({ to: "/audit" });
  }

  function hostOpen(host: string) {
    if (q.trim() && openHosts[host] === undefined) return true;
    return Boolean(openHosts[host]);
  }
  function toggleHost(host: string) {
    setOpenHosts((s) => ({ ...s, [host]: !hostOpen(host) }));
  }
  function setAllHosts(open: boolean) {
    const next: Record<string, boolean> = {};
    for (const [host] of groups) next[host] = open;
    setOpenHosts(next);
  }

  return (
    <AppShell>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <p className="text-[12px] tracking-[0.18em] text-muted uppercase">
          This device
        </p>
        <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
          Saved drafts
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Audits are grouped by store. Tap Show on a website to open its
          papers. Open a card to read, download, or load it back into Audit
          store. Re-saving the same paper updates it — it does not duplicate.
        </p>

        <Input
          className="mt-6 max-w-md"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a store or paper…"
          aria-label="Search saved drafts"
        />

        {!hydrated ? (
          <p className="mt-12 text-sm text-muted">Loading saved work on this device…</p>
        ) : drafts.length === 0 ? (
          <div className="mt-12 rounded-[var(--radius-xl)] border border-dashed border-border px-6 py-16 text-center">
            <p className="font-display text-xl">No drafts on this device yet.</p>
            <p className="mt-2 text-sm text-muted">
              On Audit store, tap Save on a paper. The same paper for the same
              store overwrites the last copy.
            </p>
            <Button asChild className="mt-6">
              <Link to="/audit">Audit a store</Link>
            </Button>
          </div>
        ) : groups.length === 0 ? (
          <p className="mt-12 text-sm text-muted">Nothing matches that search.</p>
        ) : (
          <div className="mt-4">
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={() => setAllHosts(true)}>
                Expand all
              </Button>
              <Button variant="outline" size="sm" onClick={() => setAllHosts(false)}>
                Collapse all
              </Button>
            </div>
            <div className="mt-2">
            {groups.map(([host, items]) => (
              <Fold
                key={host}
                title={host}
                hint={`${items.length} paper${items.length === 1 ? "" : "s"} · ${isStorePaper(items[0]?.slug ?? "") ? "Store" : "Library"}`}
                open={hostOpen(host)}
                onToggle={() => toggleHost(host)}
              >
                <ul className="grid gap-4 md:grid-cols-2">
                  {items.map((d) => (
                    <li
                      key={d.id}
                      className="flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <Badge variant="muted">{labelOf(d)}</Badge>
                          <h3 className="mt-2 font-display text-xl font-medium">
                            {d.title}
                          </h3>
                          <p className="mt-1 text-[12px] text-muted tabular-nums">
                            {new Date(d.createdAt).toLocaleString("en-IN")}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Delete draft"
                          onClick={() => {
                            remove(d.id);
                            if (openId === d.id) setOpenId(null);
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                      <p className="mt-3 line-clamp-4 flex-1 font-serif text-sm leading-relaxed text-muted">
                        {preview(d.draftText) || "Empty paper."}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button variant="outline" onClick={() => setOpenId(d.id)}>
                          View
                        </Button>
                        {isStorePaper(d.slug) ? (
                          <Button variant="outline" onClick={() => openInAudit(d)}>
                            Open in audit
                          </Button>
                        ) : (
                          <Button asChild variant="outline">
                            <Link to="/draft/$slug" params={{ slug: d.slug }}>
                              Open instrument
                            </Link>
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </Fold>
            ))}
            </div>
          </div>
        )}
      </main>

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-h-[88vh] max-w-4xl overflow-y-auto">
          {open ? (
            <>
              <DialogHeader>
                <DialogTitle>{open.title}</DialogTitle>
                <DialogDescription>
                  {labelOf(open)}
                  {paperHost(open) ? ` · ${paperHost(open)}` : ""} ·{" "}
                  {new Date(open.createdAt).toLocaleString("en-IN")}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    void navigator.clipboard.writeText(open.draftText);
                    toast.success("Copied.");
                  }}
                >
                  <Copy className="size-4" />
                  Copy
                </Button>
                <Button variant="outline" onClick={() => void saveWord(open)}>
                  <Download className="size-4" />
                  Word
                </Button>
                <Button variant="outline" onClick={() => void savePdf(open)}>
                  <FileDown className="size-4" />
                  PDF
                </Button>
                {isStorePaper(open.slug) ? (
                  <Button
                    onClick={() => {
                      openInAudit(open);
                      setOpenId(null);
                    }}
                  >
                    Open in audit
                  </Button>
                ) : null}
              </div>
              <DraftPaper title={open.title} body={open.draftText} />
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </AppShell>
  );
}
