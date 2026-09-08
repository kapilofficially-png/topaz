import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge, t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { t as ScrollArea } from "./scroll-area-v3ajb5cr.mjs";
import { t as Input } from "./input-Cu4Cu_xT.mjs";
import { retrieve, t as CORPUS } from "./retrieve-zGlfAKUL.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-DuFngZ6V.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LAW_CATEGORIES = [
	"constitutional",
	"criminal",
	"procedure",
	"contract",
	"commercial",
	"consumer",
	"property",
	"family",
	"labour",
	"corporate",
	"evidence",
	"public",
	"drafting"
];
var LABELS = {
	constitutional: "Constitutional",
	criminal: "Criminal",
	procedure: "Procedure",
	contract: "Contract",
	commercial: "Commercial",
	consumer: "Consumer",
	property: "Property",
	family: "Family",
	labour: "Labour",
	corporate: "Corporate",
	evidence: "Evidence",
	public: "Public law",
	drafting: "Drafting"
};
function LibraryPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("all");
	const [activeId, setActiveId] = (0, import_react.useState)(CORPUS[0]?.id ?? "");
	const list = (0, import_react.useMemo)(() => {
		if (q.trim().length >= 2) return retrieve({
			query: q,
			k: 30,
			categories: category === "all" ? void 0 : [category]
		});
		return category === "all" ? CORPUS : CORPUS.filter((c) => c.category === category);
	}, [q, category]);
	const active = list.find((c) => c.id === activeId) ?? list[0] ?? CORPUS.find((c) => c.id === activeId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] tracking-[0.18em] text-muted uppercase",
				children: "Retrieval corpus"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: "Library of authorities"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
				children: [CORPUS.length, " abridged heads of Indian statute and drafting practice. This is the index the drafter searches before it writes."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: q,
					onChange: (e) => setQ(e.target.value),
					placeholder: "Search 138, refund, DPDP, Article 21…",
					className: "sm:max-w-md"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex gap-2 overflow-x-auto pb-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: category === "all",
					onClick: () => setCategory("all"),
					label: "All"
				}), LAW_CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
					active: category === c,
					onClick: () => setCategory(c),
					label: LABELS[c]
				}, c))]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-border)]",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
						className: "h-[32rem]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: list.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "border-b border-border last:border-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveId(c.id),
								className: c.id === active?.id ? "w-full px-4 py-3 text-left bg-surface-2" : "w-full px-4 py-3 text-left hover:bg-surface-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-medium",
									children: c.citation
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[13px] text-muted",
									children: c.title
								})]
							})
						}, c.id)) })
					})
				}), active ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-[var(--radius-lg)] border border-border bg-paper p-6 shadow-[var(--shadow-border)] sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "muted",
							children: LABELS[active.category]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-3 font-display text-2xl font-medium tracking-tight",
							children: active.citation
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: active.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[13px] text-subtle",
							children: active.statute
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 font-serif text-[16px] leading-[1.7]",
							children: active.text
						}),
						active.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6 border-t border-border pt-4 text-[13px] leading-relaxed text-muted",
							children: active.note
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 flex flex-wrap gap-1.5",
							children: active.tags.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: tag
							}, tag))
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-16 text-sm text-muted",
					children: "No head matches."
				})]
			})
		]
	}) });
}
function Chip({ active, onClick, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: active ? "rounded-full bg-primary px-3 py-2 text-[13px] text-primary-fg whitespace-nowrap" : "rounded-full bg-surface-2 px-3 py-2 text-[13px] text-muted whitespace-nowrap hover:text-ink",
		children: label
	});
}
//#endregion
export { LibraryPage as component };
