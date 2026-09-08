import { toast } from "sonner";

export function notifySequenceComplete(opts: {
  host: string;
  rewriteOk: number;
  rewriteTotal: number;
  failed: string[];
}) {
  const ok = opts.failed.length === 0;
  const title = ok
    ? `Sequence complete — ${opts.host}`
    : `Sequence finished with gaps — ${opts.host}`;
  const body = [
    opts.rewriteTotal
      ? `Policies rewritten: ${opts.rewriteOk} of ${opts.rewriteTotal}.`
      : "No policy pages to rewrite.",
    opts.failed.length ? `Still open: ${opts.failed.join(", ")}.` : "All ten steps finished.",
  ].join(" ");

  toast[ok ? "success" : "error"](title, {
    description: body,
    duration: 20_000,
  });

  try {
    if (typeof document !== "undefined") {
      document.title = `NyayaDraft · ${title}`;
    }
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const show = () =>
      new Notification(title, {
        body,
        tag: `nyayadraft-sequence-${opts.host}`,
      });
    if (Notification.permission === "granted") {
      show();
    } else if (Notification.permission !== "denied") {
      void Notification.requestPermission().then((perm) => {
        if (perm === "granted") show();
      });
    }
  } catch {
    /* preview iframe may block notifications */
  }
}

export function notifyBatchComplete(opts: {
  done: number;
  total: number;
  errors: number;
}) {
  const title =
    opts.errors === 0
      ? `Batch complete — ${opts.done} stores`
      : `Batch finished — ${opts.done} of ${opts.total} saved`;
  const body =
    opts.errors === 0
      ? "Every store in the queue finished and was saved to History."
      : `${opts.errors} store${opts.errors === 1 ? "" : "s"} failed. Open Batch for the list.`;
  toast[opts.errors ? "error" : "success"](title, {
    description: body,
    duration: 20_000,
  });
  try {
    if (typeof document !== "undefined") {
      document.title = `NyayaDraft · ${title}`;
    }
    if (typeof window === "undefined" || !("Notification" in window)) return;
    const show = () =>
      new Notification(title, { body, tag: "nyayadraft-batch" });
    if (Notification.permission === "granted") show();
    else if (Notification.permission !== "denied") {
      void Notification.requestPermission().then((perm) => {
        if (perm === "granted") show();
      });
    }
  } catch {
    /* ignore */
  }
}
