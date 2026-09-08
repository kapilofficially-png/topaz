import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SavedCitation = {
  id: string;
  title: string;
  citation: string;
  statute: string;
  text: string;
};

export type SavedDraft = {
  id: string;
  slug: string;
  title: string;
  createdAt: number;
  facts: Record<string, string>;
  draftText: string;
  notes: string;
  citations: SavedCitation[];
};

type DraftStore = {
  drafts: SavedDraft[];
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  save: (draft: SavedDraft) => { ok: boolean; error?: string };
  remove: (id: string) => void;
  get: (id: string) => SavedDraft | undefined;
};

function hostOfFacts(facts: Record<string, string>) {
  return (facts.website || facts.host || "").trim();
}

function samePaper(a: SavedDraft, b: SavedDraft) {
  const hostA = hostOfFacts(a.facts);
  const hostB = hostOfFacts(b.facts);
  if (a.slug !== b.slug) return false;
  if (hostA && hostB && hostA === hostB) {
    const urlA = (a.facts.url || "").trim();
    const urlB = (b.facts.url || "").trim();
    if (urlA || urlB) return urlA === urlB;
    return true;
  }
  return a.id === b.id;
}

function slimCitations(list: SavedCitation[]) {
  return list.slice(0, 8).map((c) => ({
    ...c,
    text: (c.text || "").slice(0, 600),
  }));
}

function trimDraft(text: string) {
  if (text.length <= 80_000) return text;
  return `${text.slice(0, 80_000)}\n\n[truncated to fit this device]`;
}

const memory = new Map<string, string>();

const safeStorage = createJSONStorage(() => ({
  getItem: (name) => {
    try {
      return localStorage.getItem(name) ?? memory.get(name) ?? null;
    } catch {
      return memory.get(name) ?? null;
    }
  },
  setItem: (name, value) => {
    memory.set(name, value);
    try {
      localStorage.setItem(name, value);
    } catch {
      try {
        const parsed = JSON.parse(value) as { state?: { drafts?: SavedDraft[] } };
        const drafts = parsed.state?.drafts ?? [];
        const reduced = {
          ...parsed,
          state: { ...parsed.state, drafts: drafts.slice(0, 12) },
        };
        localStorage.setItem(name, JSON.stringify(reduced));
      } catch {
        /* device full — keep the in-memory copy */
      }
    }
  },
  removeItem: (name) => {
    memory.delete(name);
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
  },
}));

export const useDraftStore = create<DraftStore>()(
  persist(
    (set, get) => ({
      drafts: [],
      hydrated: false,
      setHydrated: (hydrated) => set({ hydrated }),
      save: (draft) => {
        const next: SavedDraft = {
          ...draft,
          draftText: trimDraft(draft.draftText || ""),
          citations: slimCitations(draft.citations ?? []),
          createdAt: Date.now(),
        };
        set((s) => ({
          drafts: [next, ...s.drafts.filter((d) => !samePaper(d, next))].slice(
            0,
            500,
          ),
        }));
        return { ok: true as const };
      },
      remove: (id) => set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),
      get: (id) => get().drafts.find((d) => d.id === id),
    }),
    {
      name: "nyayadraft-history",
      storage: safeStorage,
      version: 2,
      partialize: (s) => ({ drafts: s.drafts }),
      migrate: (persisted) => {
        const p = persisted as { drafts?: SavedDraft[] };
        const drafts = Array.isArray(p?.drafts) ? p.drafts : [];
        const seen = new Set<string>();
        const collapsed: SavedDraft[] = [];
        for (const d of drafts) {
          const host = (d.facts?.website || d.facts?.host || "").trim();
          const key = host
            ? `${d.slug}::${host}::${d.facts?.url || ""}`
            : d.id;
          if (seen.has(key)) continue;
          seen.add(key);
          collapsed.push(d);
        }
        return { drafts: collapsed };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);

export function isStorePaper(slug: string) {
  return slug.startsWith("store-");
}

export function paperHost(d: SavedDraft) {
  const raw = hostOfFacts(d.facts);
  if (!raw) return "";
  try {
    return new URL(raw.startsWith("http") ? raw : `https://${raw}`).host;
  } catch {
    return raw.replace(/^https?:\/\//, "").split("/")[0] ?? raw;
  }
}

export const STORE_PAPER_LABEL: Record<string, string> = {
  "store-research": "Live pages",
  "store-audit": "Store audit",
  "store-gaps": "Gap register",
  "store-selling": "Selling points",
  "store-questions": "Legal facts",
  "store-brief": "Client brief",
  "store-implement": "Implementations",
  "store-email": "Forwarding emails",
  "store-cold": "Cold email",
  "store-agreement": "Service agreement",
  "store-terms-of-service": "Revised terms",
  "store-consent-policy": "Revised consent",
  "store-refund-policy": "Revised refund",
  "store-shipping-policy": "Revised shipping",
  "store-live-policy": "Revised live page",
};
