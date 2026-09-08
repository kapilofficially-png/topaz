import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import {
  DEFAULT_ENABLED,
  DEFAULT_ORDER,
  getProvider,
  type AiKeysPayload,
  type ProviderId,
} from "./providers";

type KeysState = {
  keys: Partial<Record<ProviderId, string>>;
  models: Partial<Record<ProviderId, string>>;
  enabled: ProviderId[];
  order: ProviderId[];
  fallback: boolean;
  lastProvider: string;
  lastModel: string;
  lastFallback: boolean;
  lastError: string;
  grokEnv: boolean | null;
  setKey: (id: ProviderId, value: string) => void;
  setModel: (id: ProviderId, value: string) => void;
  setEnabled: (id: ProviderId, on: boolean) => void;
  move: (id: ProviderId, dir: -1 | 1) => void;
  setFallback: (on: boolean) => void;
  setLastUsed: (provider: string, model: string, fallback: boolean) => void;
  setLastError: (error: string) => void;
  setGrokEnv: (on: boolean) => void;
  toPayload: () => AiKeysPayload;
};

export const useKeysStore = create<KeysState>()(
  persist(
    (set, get) => ({
      keys: {},
      models: {},
      enabled: [...DEFAULT_ENABLED],
      order: [...DEFAULT_ORDER],
      fallback: true,
      lastProvider: "",
      lastModel: "",
      lastFallback: false,
      lastError: "",
      grokEnv: null,
      setKey: (id, value) =>
        set((s) => ({ keys: { ...s.keys, [id]: value } })),
      setModel: (id, value) =>
        set((s) => ({ models: { ...s.models, [id]: value } })),
      setEnabled: (id, on) =>
        set((s) => {
          const enabled = s.enabled.filter((x) => x !== id);
          if (on) enabled.push(id);
          return { enabled };
        }),
      move: (id, dir) =>
        set((s) => {
          const order = [...s.order];
          const i = order.indexOf(id);
          if (i < 0) return s;
          const j = i + dir;
          if (j < 0 || j >= order.length) return s;
          const tmp = order[i];
          order[i] = order[j];
          order[j] = tmp;
          return { order };
        }),
      setFallback: (on) => set({ fallback: on }),
      setLastUsed: (provider, model, fallback) =>
        set({
          lastProvider: provider,
          lastModel: model,
          lastFallback: fallback,
          lastError: "",
        }),
      setLastError: (error) => set({ lastError: error }),
      setGrokEnv: (on) => set({ grokEnv: on }),
      toPayload: () => {
        const s = get();
        const payload: AiKeysPayload = {
          order: s.order,
          enabled: s.enabled,
          models: Object.fromEntries(
            Object.entries(s.models).filter(([, v]) => v),
          ),
          fallback: s.fallback,
        };
        for (const [id, key] of Object.entries(s.keys)) {
          const trimmed = key?.trim();
          if (trimmed) payload[id as ProviderId] = trimmed;
        }
        return payload;
      },
    }),
    {
      name: "nyayadraft-ai-keys",
      partialize: (s) => ({
        keys: s.keys,
        models: s.models,
        enabled: s.enabled,
        order: s.order,
        fallback: s.fallback,
        lastProvider: s.lastProvider,
        lastModel: s.lastModel,
        lastFallback: s.lastFallback,
      }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<KeysState>;
        return {
          ...current,
          ...p,
          enabled: p.enabled?.length ? p.enabled : current.enabled,
          order: p.order?.length ? p.order : current.order,
          keys: p.keys ?? current.keys,
          models: p.models ?? current.models,
          grokEnv: current.grokEnv,
          lastError: "",
        };
      },
    },
  ),
);

export function aiKeysPayload(): AiKeysPayload {
  return useKeysStore.getState().toPayload();
}

export function rememberProvider(result: {
  ok?: boolean;
  provider?: string;
  model?: string;
  fallback?: boolean;
  error?: string;
}) {
  if (typeof window === "undefined") return;
  if (result.ok && result.provider) {
    const prev = useKeysStore.getState().lastProvider;
    useKeysStore
      .getState()
      .setLastUsed(result.provider, result.model ?? "", Boolean(result.fallback));
    if (result.fallback && result.provider !== prev) {
      const name = getProvider(result.provider)?.name ?? result.provider;
      toast.message(`Grok was unavailable. This run used ${name}.`);
    }
    return;
  }
  if (result.error) useKeysStore.getState().setLastError(result.error);
}
