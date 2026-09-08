import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge, t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { T as ArrowRight, g as Globe, m as Landmark, s as Scale, w as BookOpen } from "../_libs/lucide-react.mjs";
import { t as Input } from "./input-Cu4Cu_xT.mjs";
import { n as TEMPLATES, t as PRACTICE_AREAS } from "./templates-7fivPM6Q.mjs";
import { corpusStats } from "./retrieve-zGlfAKUL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-lOE4bXRf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const [area, setArea] = (0, import_react.useState)("all");
	const [q, setQ] = (0, import_react.useState)("");
	const stats = corpusStats();
	const list = (0, import_react.useMemo)(() => {
		const needle = q.trim().toLowerCase();
		return TEMPLATES.filter((t) => {
			if (area !== "all" && t.area !== area) return false;
			if (!needle) return true;
			return t.title.toLowerCase().includes(needle) || t.blurb.toLowerCase().includes(needle) || t.forum.toLowerCase().includes(needle);
		});
	}, [area, q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,0.9fr)] lg:py-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] tracking-[0.2em] text-muted uppercase",
					children: "Chambers drafting · RAG over Indian statute"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-3 font-display text-4xl leading-[1.12] font-medium tracking-tight sm:text-5xl",
					children: [
						"Draft Indian legal",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"instruments on the Act,",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						"not on a guess."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-xl text-[16px] leading-relaxed text-muted",
					children: "NyayaDraft retrieves the governing sections — BNS, BNSS, Contract Act, NI Act, CPA 2019, DPDP, e-commerce rules — then asks Grok to compose the notice, plaint, deed, or store policy from your facts."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "mt-8 grid grid-cols-3 gap-4 max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Instruments",
							value: String(TEMPLATES.length)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Corpus heads",
							value: String(stats.total)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
							label: "Codes in force",
							value: "2023+"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/audit",
					className: "mt-8 inline-flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-bg px-4 py-3 text-sm font-medium text-primary shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "size-4" }),
						"Audit a live store’s policies",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "flex flex-col justify-end gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scale, { className: "size-4" }),
						title: "Retrieval first",
						body: "Every draft is grounded in a BM25 pass over an India-law corpus. Citations sit beside the page."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Landmark, { className: "size-4" }),
						title: "Current criminal codes",
						body: "BNS, BNSS and BSA from 1 July 2024 — with mappings from the old IPC / CrPC numbers you still type."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Note, {
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-4" }),
						title: "For review, not filing",
						body: "A first cut for chambers. Stamp, limitation and a human advocate still have the last word."
					})
				]
			})]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-10 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl font-medium tracking-tight",
					children: "Choose an instrument"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: "Load a sample matter if you want to see a full draft immediately."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search notices, store policies, RTI…",
					className: "sm:max-w-xs"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 flex gap-2 overflow-x-auto pb-1",
				children: PRACTICE_AREAS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setArea(item.id),
					className: area === item.id ? "rounded-full bg-primary px-3 py-2 text-[13px] text-primary-fg whitespace-nowrap" : "rounded-full bg-surface-2 px-3 py-2 text-[13px] text-muted whitespace-nowrap hover:text-ink",
					children: item.label
				}, item.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: list.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/draft/$slug",
					params: { slug: t.slug },
					className: "group flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-[var(--motion-fast)] ease-[var(--ease-out)] hover:shadow-[var(--shadow-border-hover)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: t.forum
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 font-display text-xl font-medium tracking-tight group-hover:text-primary",
							children: t.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 flex-1 text-sm leading-relaxed text-muted",
							children: t.blurb
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary",
							children: ["Open the matter", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-[var(--motion-quick)] group-hover:translate-x-0.5" })]
						})
					]
				}, t.slug))
			}),
			list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-16 text-center text-sm text-muted",
				children: "No instrument matches that search."
			}) : null
		]
	})] }) });
}
function Stat({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
		className: "text-[11px] tracking-[0.14em] text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
		className: "font-display text-3xl font-medium tabular-nums",
		children: value
	})] });
}
function Note({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-[var(--radius-lg)] border border-border bg-bg p-4 shadow-[var(--shadow-border)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-primary",
			children: [icon, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-medium text-ink",
				children: title
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-[13px] leading-relaxed text-muted",
			children: body
		})]
	});
}
//#endregion
export { Home as component };
