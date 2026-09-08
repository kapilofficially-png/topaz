import { create } from "zustand";
import { persist } from "zustand/middleware";

export type PipelineStage =
  | "not_started"
  | "sequence"
  | "talking"
  | "scoped"
  | "onboarded"
  | "parked";

export type TouchDef = {
  id: string;
  day: number;
  label: string;
  clock: "A" | "B";
  hint: string;
};

export const CLOCK_A: TouchDef[] = [
  {
    id: "e1",
    day: 0,
    label: "Email 1 — one-pager",
    clock: "A",
    hint: "Observation + layman so-what. Ask them to reply send.",
  },
  {
    id: "e2",
    day: 3,
    label: "Email 2 — bump",
    clock: "A",
    hint: "Same thread. One new line. Same ask.",
  },
  {
    id: "e3",
    day: 7,
    label: "Email 3 — second gap",
    clock: "A",
    hint: "A different live-page mismatch. Still not a meeting.",
  },
  {
    id: "e4",
    day: 14,
    label: "Email 4 — pack and fee",
    clock: "A",
    hint: "Page list + fee. Reply pack.",
  },
  {
    id: "e5",
    day: 21,
    label: "Break-up",
    clock: "A",
    hint: "They keep the sample sentence. Park for 60 days.",
  },
];

export const CLOCK_B: TouchDef[] = [
  {
    id: "sample",
    day: 0,
    label: "Sample in their inbox",
    clock: "B",
    hint: "Same working day they said send. Watermark SAMPLE.",
  },
  {
    id: "call",
    day: 3,
    label: "Call or WhatsApp yes",
    clock: "B",
    hint: "15 minutes. Two time options. Agenda: live page vs sample vs fee.",
  },
  {
    id: "scope",
    day: 5,
    label: "Fee and page list agreed",
    clock: "B",
    hint: "One number. WhatsApp is enough. Then send the service agreement.",
  },
  {
    id: "questions",
    day: 10,
    label: "Questionnaire back",
    clock: "B",
    hint: "Clock for the full pack starts the next working day.",
  },
  {
    id: "draft",
    day: 17,
    label: "First pack delivered",
    clock: "B",
    hint: "Do not start the full pack before fee + answers.",
  },
];

export type StorePipeline = {
  host: string;
  origin: string;
  startedAt: number | null;
  repliedAt: number | null;
  parkedAt: number | null;
  sent: Record<string, number>;
  flags: {
    sampleSent: boolean;
    replied: boolean;
    feeAgreed: boolean;
    questionsIn: boolean;
    agreementSent: boolean;
  };
  notes: string;
};

const emptyFlags: StorePipeline["flags"] = {
  sampleSent: false,
  replied: false,
  feeAgreed: false,
  questionsIn: false,
  agreementSent: false,
};

function blank(host: string, origin: string): StorePipeline {
  return {
    host,
    origin,
    startedAt: null,
    repliedAt: null,
    parkedAt: null,
    sent: {},
    flags: { ...emptyFlags },
    notes: "",
  };
}

type PipelineState = {
  stores: Record<string, StorePipeline>;
  ensure: (host: string, origin: string) => void;
  startSequence: (host: string, origin: string) => void;
  markSent: (host: string, touchId: string) => void;
  unmarkSent: (host: string, touchId: string) => void;
  setFlag: (host: string, key: keyof StorePipeline["flags"], value: boolean) => void;
  setNotes: (host: string, notes: string) => void;
  park: (host: string) => void;
  unpark: (host: string) => void;
  resetHost: (host: string) => void;
};

export const usePipelineStore = create<PipelineState>()(
  persist(
    (set, get) => ({
      stores: {},
      ensure: (host, origin) => {
        if (!host) return;
        if (get().stores[host]) return;
        set((s) => ({ stores: { ...s.stores, [host]: blank(host, origin) } }));
      },
      startSequence: (host, origin) => {
        if (!host) return;
        set((s) => {
          const prev = s.stores[host] ?? blank(host, origin);
          return {
            stores: {
              ...s.stores,
              [host]: {
                ...prev,
                origin: origin || prev.origin,
                startedAt: prev.startedAt ?? Date.now(),
                parkedAt: null,
              },
            },
          };
        });
      },
      markSent: (host, touchId) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          return {
            stores: {
              ...s.stores,
              [host]: {
                ...prev,
                startedAt: prev.startedAt ?? Date.now(),
                sent: { ...prev.sent, [touchId]: Date.now() },
                flags: {
                  ...prev.flags,
                  sampleSent: touchId === "sample" ? true : prev.flags.sampleSent,
                },
              },
            },
          };
        });
      },
      unmarkSent: (host, touchId) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          const sent = { ...prev.sent };
          delete sent[touchId];
          return { stores: { ...s.stores, [host]: { ...prev, sent } } };
        });
      },
      setFlag: (host, key, value) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          const flags = { ...prev.flags, [key]: value };
          return {
            stores: {
              ...s.stores,
              [host]: {
                ...prev,
                flags,
                repliedAt:
                  key === "replied" && value
                    ? (prev.repliedAt ?? Date.now())
                    : key === "replied" && !value
                      ? null
                      : prev.repliedAt,
                startedAt: prev.startedAt ?? Date.now(),
              },
            },
          };
        });
      },
      setNotes: (host, notes) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          return { stores: { ...s.stores, [host]: { ...prev, notes } } };
        });
      },
      park: (host) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          return {
            stores: {
              ...s.stores,
              [host]: { ...prev, parkedAt: Date.now() },
            },
          };
        });
      },
      unpark: (host) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          return {
            stores: { ...s.stores, [host]: { ...prev, parkedAt: null } },
          };
        });
      },
      resetHost: (host) => {
        set((s) => {
          const prev = s.stores[host];
          if (!prev) return s;
          return {
            stores: { ...s.stores, [host]: blank(host, prev.origin) },
          };
        });
      },
    }),
    { name: "nyayadraft-pipeline" },
  ),
);

export function pipelineStage(p: StorePipeline | undefined): PipelineStage {
  if (!p || !p.startedAt) return "not_started";
  if (p.parkedAt) return "parked";
  if (p.flags.feeAgreed && p.flags.questionsIn) return "onboarded";
  if (p.flags.feeAgreed) return "scoped";
  if (p.flags.replied) return "talking";
  return "sequence";
}

export function daysSince(ts: number | null) {
  if (!ts) return 0;
  return Math.floor((Date.now() - ts) / 86_400_000);
}

export function nextClockA(p: StorePipeline | undefined): TouchDef | null {
  if (!p || p.parkedAt || !p.startedAt || p.flags.replied) return null;
  const elapsed = daysSince(p.startedAt);
  return CLOCK_A.find((t) => !p.sent[t.id] && elapsed >= t.day) ?? null;
}

export function nextClockB(p: StorePipeline | undefined): TouchDef | null {
  if (!p || p.parkedAt || !p.repliedAt) return null;
  if (p.flags.feeAgreed && p.flags.questionsIn && p.sent.draft) return null;
  const elapsed = daysSince(p.repliedAt);
  return CLOCK_B.find((t) => !p.sent[t.id] && elapsed >= t.day) ?? null;
}

export function emailTouchId(heading: string): string | null {
  const h = heading.toLowerCase();
  if (/break/.test(h) || /day 21/.test(h)) return "e5";
  if (/pack|fee|day 14/.test(h)) return "e4";
  if (/whatsapp|dm/.test(h)) return "wa";
  if (/second gap|day 7/.test(h)) return "e3";
  if (/bump|day 3/.test(h)) return "e2";
  if (/one-pager|day 0|short pitch|email 1/.test(h)) return "e1";
  return null;
}

export const STAGE_LABEL: Record<PipelineStage, string> = {
  not_started: "Not started",
  sequence: "In the 21-day sequence",
  talking: "They replied — Clock B",
  scoped: "Fee agreed — waiting on facts",
  onboarded: "Onboarded",
  parked: "Parked (60 days)",
};
