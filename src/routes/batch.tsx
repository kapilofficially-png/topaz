import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader2, Play, Plus, Square } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { startBatch, stopBatch } from "@/lib/drafts/batch-runner";
import { useBatchStore } from "@/lib/drafts/batch-store";
import { mergeStoreLists, parseStoreList } from "@/lib/drafts/run-sequence";

export const Route = createFileRoute("/batch")({ component: BatchPage });

function BatchPage() {
  const batch = useBatchStore();
  const [commaInput, setCommaInput] = useState("");

  const queued = batch.jobs.filter((j) => j.status === "queued").length;
  const done = batch.jobs.filter((j) => j.status === "done").length;
  const errors = batch.jobs.filter((j) => j.status === "error").length;
  const parsed = parseStoreList(batch.listText, 50);
  const progress = batch.progress;

  async function start() {
    try {
      if ("Notification" in window && Notification.permission === "default") {
        void Notification.requestPermission();
      }
    } catch {
      /* ignore */
    }
    const result = await startBatch();
    if (result && result.ok === false) {
      toast.error(result.error);
    }
  }

  function addCommaLinks() {
    const extra = commaInput.trim();
    if (!extra) {
      toast.error("Paste links separated by commas.");
      return;
    }
    const merged = mergeStoreLists(batch.listText, extra, 50);
    const before = parseStoreList(batch.listText, 50).length;
    const after = parseStoreList(merged, 50).length;
    if (after === before) {
      toast.error("No new unique stores in that list (duplicates or already queued).");
      return;
    }
    batch.setListText(merged);
    setCommaInput("");
    toast.success(`Added ${after - before} store${after - before === 1 ? "" : "s"}. ${after} in the queue.`);
  }

  function stop() {
    stopBatch();
    toast.message("Stopping after this store finishes. Skipped stores will be retried if you run again.");
  }

  return (
    <AppShell>
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-[12px] tracking-[0.2em] text-muted uppercase">
              Queue · one store at a time · save to History
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Batch audit
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              Paste up to 50 store URLs — one per line, or separated by commas.
              NyayaDraft runs the full sequence on each one in order and saves
              every paper to History before the next store. Stay on this page
              while it runs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <label className="block text-sm font-medium" htmlFor="batch-list">
            Store URLs
          </label>
          <Textarea
            id="batch-list"
            value={batch.listText}
            onChange={(e) => batch.setListText(e.target.value)}
            disabled={batch.running}
            className="mt-2 min-h-48 font-mono text-[13px]"
            placeholder={"dakshis.com\nclovia.com\nhttps://www.example.in"}
          />
          <p className="mt-2 text-[13px] text-muted">
            {parsed.length} unique store{parsed.length === 1 ? "" : "s"} ready
            {parsed.length >= 50 ? " (capped at 50)" : ""}. New lines or commas.
          </p>
          <form
            className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              addCommaLinks();
            }}
          >
            <div className="min-w-0 flex-1">
              <label className="block text-sm font-medium" htmlFor="comma-links">
                Add links separated by a comma
              </label>
              <Input
                id="comma-links"
                value={commaInput}
                onChange={(e) => setCommaInput(e.target.value)}
                disabled={batch.running}
                className="mt-1 font-mono text-[13px]"
                placeholder="dakshis.com, clovia.com, https://www.example.in"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>
            <Button type="submit" variant="outline" disabled={batch.running || !commaInput.trim()}>
              <Plus className="size-4" />
              Add to queue
            </Button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {batch.running ? (
              <Button variant="outline" onClick={stop}>
                <Square className="size-4" />
                {batch.stopAfterCurrent ? "Stopping after this store" : "Stop after this store"}
              </Button>
            ) : (
              <Button onClick={() => void start()} disabled={!parsed.length}>
                <Play className="size-4" />
                Run {parsed.length || ""} store{parsed.length === 1 ? "" : "s"}
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => batch.clearResults()}
              disabled={batch.running || !batch.jobs.length}
            >
              Clear results
            </Button>
            <Button variant="outline" asChild>
              <Link to="/history">Open History</Link>
            </Button>
          </div>

          {batch.running && progress ? (
            <div className="mt-6 rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <Loader2 className="size-4 animate-spin" />
                Store {(batch.currentIndex < 0 ? 0 : batch.currentIndex) + 1} of{" "}
                {batch.jobs.length} — step {progress.step}/{progress.total}{" "}
                {progress.title}
              </p>
              {progress.rewrite ? (
                <p className="mt-1 text-muted">
                  Rewriting {progress.rewrite.current}/{progress.rewrite.total}:{" "}
                  {progress.rewrite.title}
                </p>
              ) : (
                <p className="mt-1 text-muted">
                  Each store is saved before the next one starts. Stores that
                skip research, audit, or rewrites are retried once at the end.
                </p>
              )}
            </div>
          ) : null}

          {batch.jobs.length ? (
            <div className="mt-8">
              <div className="flex flex-wrap gap-2 text-[13px] text-muted">
                <Badge variant="muted">{batch.jobs.length} queued</Badge>
                <Badge variant="outline">{done} done</Badge>
                {errors ? <Badge variant="outline">{errors} failed</Badge> : null}
                {queued && batch.running ? (
                  <Badge variant="outline">{queued} waiting</Badge>
                ) : null}
              </div>
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-[12px] tracking-wide text-muted uppercase">
                      <th className="py-2 pr-3 font-medium">#</th>
                      <th className="py-2 pr-3 font-medium">Store</th>
                      <th className="py-2 pr-3 font-medium">Status</th>
                      <th className="py-2 pr-3 font-medium">Rewrites</th>
                      <th className="py-2 pr-3 font-medium">Saved</th>
                      <th className="py-2 font-medium">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batch.jobs.map((job, i) => (
                      <tr key={`${job.url}-${i}`} className="border-b border-border/70">
                        <td className="py-2 pr-3 text-muted">{i + 1}</td>
                        <td className="py-2 pr-3">
                          <div className="font-medium">{job.host || job.url}</div>
                          {job.host ? (
                            <div className="text-[12px] text-muted">{job.url}</div>
                          ) : null}
                        </td>
                        <td className="py-2 pr-3">
                          <Badge
                            variant={
                              job.status === "done"
                                ? "default"
                                : job.status === "running"
                                  ? "outline"
                                  : "muted"
                            }
                          >
                            {job.status === "running" && (
                              <Loader2 className="size-3 animate-spin" />
                            )}
                            {job.status}
                            {job.pass === "retry" ? " · retry" : ""}
                          </Badge>
                        </td>
                        <td className="py-2 pr-3 text-muted">
                          {job.rewriteTotal
                            ? `${job.rewriteOk}/${job.rewriteTotal}`
                            : "—"}
                        </td>
                        <td className="py-2 pr-3 text-muted">
                          {job.saved ? `${job.saved} papers` : "—"}
                        </td>
                        <td className="py-2 text-[13px] text-muted">
                          {job.error ||
                            (job.failed.length ? job.failed.join(", ") : "")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : null}
        </section>
      </main>
    </AppShell>
  );
}
