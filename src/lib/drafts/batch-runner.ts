import { jobNeedsRetry, useBatchStore, type BatchJob } from "@/lib/drafts/batch-store";
import { parseStoreList, runStoreSequence } from "@/lib/drafts/run-sequence";
import { notifyBatchComplete } from "@/lib/notify";

let abort: AbortController | null = null;
let loop: Promise<void> | null = null;

function applyReport(index: number, report: Awaited<ReturnType<typeof runStoreSequence>>, pass: BatchJob["pass"]) {
  useBatchStore.getState().patchJob(index, {
    status: report.pages ? "done" : "error",
    host: report.host,
    failed: report.failed,
    rewriteOk: report.rewriteOk,
    rewriteTotal: report.rewriteTotal,
    pages: report.pages,
    saved: report.saved,
    finishedAt: Date.now(),
    pass,
    error: report.pages
      ? report.failed.length
        ? report.failed.join(", ")
        : undefined
      : report.failed.join(", ") || "No live pages",
  });
}

async function runOne(index: number, url: string, pass: BatchJob["pass"]) {
  const store = useBatchStore.getState();
  store.setCurrentIndex(index);
  store.patchJob(index, { status: "running", pass, error: undefined });
  store.setProgress({ step: 1, total: 10, title: "Starting…" });
  const report = await runStoreSequence(url, {
    signal: abort?.signal,
    onProgress: (p) => useBatchStore.getState().setProgress(p),
  });
  applyReport(index, report, pass);
  return report;
}

export async function startBatch() {
  if (loop) return;
  const urls = parseStoreList(useBatchStore.getState().listText, 50);
  if (!urls.length) return { ok: false as const, error: "Paste store URLs — new lines or commas, up to 50." };

  const jobs: BatchJob[] = urls.map((url) => ({
    url,
    host: "",
    status: "queued",
    failed: [],
    rewriteOk: 0,
    rewriteTotal: 0,
    pages: 0,
    saved: 0,
  }));
  const store = useBatchStore.getState();
  store.setJobs(jobs);
  store.setRunning(true);
  store.setStopAfterCurrent(false);
  store.setStartedAt(Date.now());
  abort = new AbortController();

  loop = (async () => {
    try {
      for (let i = 0; i < jobs.length; i += 1) {
        if (useBatchStore.getState().stopAfterCurrent) {
          for (let j = i; j < jobs.length; j += 1) {
            useBatchStore.getState().patchJob(j, { status: "stopped" });
          }
          break;
        }
        try {
          await runOne(i, jobs[i].url, "first");
        } catch (err) {
          if ((err as Error).name === "AbortError") {
            useBatchStore.getState().patchJob(i, { status: "stopped" });
            break;
          }
          useBatchStore.getState().patchJob(i, {
            status: "error",
            error: err instanceof Error ? err.message : "Sequence failed",
            finishedAt: Date.now(),
            pass: "first",
          });
        }
        if (i < jobs.length - 1 && !useBatchStore.getState().stopAfterCurrent) {
          const last = useBatchStore.getState().jobs[i];
          const wait = last && (last.status === "error" || last.failed.length) ? 3200 : 1400;
          await new Promise((r) => window.setTimeout(r, wait));
        }
      }

      if (!useBatchStore.getState().stopAfterCurrent) {
        const snapshot = useBatchStore.getState().jobs;
        const retryIdx = snapshot
          .map((job, i) => (jobNeedsRetry(job) && job.pass !== "retry" ? i : -1))
          .filter((i) => i >= 0);
        for (const i of retryIdx) {
          if (useBatchStore.getState().stopAfterCurrent) break;
          useBatchStore.getState().setProgress({
            step: 1,
            total: 10,
            title: `Retry ${snapshot[i].url}`,
          });
          try {
            await runOne(i, snapshot[i].url, "retry");
          } catch (err) {
            if ((err as Error).name === "AbortError") break;
            useBatchStore.getState().patchJob(i, {
              status: "error",
              error: err instanceof Error ? err.message : "Retry failed",
              finishedAt: Date.now(),
              pass: "retry",
            });
          }
          await new Promise((r) => window.setTimeout(r, 2000));
        }
      }

      const final = useBatchStore.getState().jobs;
      notifyBatchComplete({
        done: final.filter((j) => j.status === "done").length,
        total: final.length,
        errors: final.filter((j) => j.status === "error").length,
      });
    } finally {
      useBatchStore.getState().setRunning(false);
      useBatchStore.getState().setCurrentIndex(-1);
      useBatchStore.getState().setStopAfterCurrent(false);
      useBatchStore.getState().setProgress(null);
      abort = null;
      loop = null;
    }
  })();

  return { ok: true as const };
}

export function stopBatch() {
  useBatchStore.getState().setStopAfterCurrent(true);
}

export function isBatchRunning() {
  return useBatchStore.getState().running || Boolean(loop);
}