import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-MoEgvrDN.js
var useDraftStore = create()(persist((set, get) => ({
	drafts: [],
	save: (draft) => set((s) => ({ drafts: [draft, ...s.drafts.filter((d) => d.id !== draft.id)].slice(0, 40) })),
	remove: (id) => set((s) => ({ drafts: s.drafts.filter((d) => d.id !== id) })),
	get: (id) => get().drafts.find((d) => d.id === id)
}), { name: "nyayadraft-history" }));
//#endregion
export { useDraftStore as t };
