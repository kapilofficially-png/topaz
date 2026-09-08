import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SequenceProgress } from "@/lib/drafts/run-sequence";

export type BatchJob = {
  url: string;
  host: string;
  status: "queued" | "running" | "done" | "error" | "stopped";
  failed: string[];
  rewriteOk: number;
  rewriteTotal: number;
  pages: number;
  saved: number;
  error?: string;
  finishedAt?: number;
  pass?: "first" | "retry";
};

type BatchState = {
  listText: string;
  jobs: BatchJob[];
  running: boolean;
  stopAfterCurrent: boolean;
  currentIndex: number;
  startedAt: number | null;
  progress: SequenceProgress | null;
  setListText: (v: string) => void;
  setJobs: (jobs: BatchJob[]) => void;
  patchJob: (index: number, patch: Partial<BatchJob>) => void;
  setRunning: (v: boolean) => void;
  setStopAfterCurrent: (v: boolean) => void;
  setCurrentIndex: (i: number) => void;
  setStartedAt: (v: number | null) => void;
  setProgress: (p: SequenceProgress | null) => void;
  clearResults: () => void;
};

export const useBatchStore = create<BatchState>()(
  persist(
    (set) => ({
      listText: "",
      jobs: [],
      running: false,
      stopAfterCurrent: false,
      currentIndex: -1,
      startedAt: null,
      progress: null,
      setListText: (listText) => set({ listText }),
      setJobs: (jobs) => set({ jobs, currentIndex: -1, stopAfterCurrent: false }),
      patchJob: (index, patch) =>
        set((s) => ({
          jobs: s.jobs.map((j, i) => (i === index ? { ...j, ...patch } : j)),
        })),
      setRunning: (running) => set({ running }),
      setStopAfterCurrent: (stopAfterCurrent) => set({ stopAfterCurrent }),
      setCurrentIndex: (currentIndex) => set({ currentIndex }),
      setStartedAt: (startedAt) => set({ startedAt }),
      setProgress: (progress) => set({ progress }),
      clearResults: () =>
        set({
          jobs: [],
          running: false,
          stopAfterCurrent: false,
          currentIndex: -1,
          startedAt: null,
          progress: null,
        }),
    }),
    {
      name: "nyayadraft-batch",
      partialize: (s) => ({ listText: s.listText, jobs: s.jobs }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        state.jobs = state.jobs.map((j) =>
          j.status === "running"
            ? { ...j, status: "error", error: "Interrupted. Run the remaining URLs again." }
            : j,
        );
      },
    },
  ),
);

export function jobNeedsRetry(job: BatchJob) {
  if (job.status === "stopped") return false;
  if (job.status === "error") return true;
  if (!job.pages) return true;
  if (!job.saved) return true;
  if (job.failed.some((f) => f === "Research live pages" || f === "Audit" || f.startsWith("Revise policies"))) {
    return true;
  }
  return false;
}