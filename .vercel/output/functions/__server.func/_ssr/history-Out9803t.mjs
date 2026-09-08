import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge, t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { i as Trash2 } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CHFc7sYZ.mjs";
import { t as useDraftStore } from "./store-MoEgvrDN.mjs";
import { r as getTemplate } from "./templates-7fivPM6Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/history-Out9803t.js
var import_jsx_runtime = require_jsx_runtime();
var AUDIT_SLUGS = {
	"store-audit": "Store audit",
	"store-gaps": "Gap register",
	"store-selling": "Selling points",
	"store-questions": "Legal facts",
	"store-brief": "Client brief",
	"store-implement": "Implementations",
	"store-email": "Forwarding emails"
};
function HistoryPage() {
	const drafts = useDraftStore((s) => s.drafts);
	const remove = useDraftStore((s) => s.remove);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] tracking-[0.18em] text-muted uppercase",
				children: "This device"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: "Saved drafts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted",
				children: "History stays in your browser. Nothing is uploaded except when you ask the model to draft."
			}),
			drafts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-12 rounded-[var(--radius-xl)] border border-dashed border-border px-6 py-16 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl",
						children: "No drafts on this device yet."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Generate an instrument and tap Save."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							children: "Choose an instrument"
						})
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: drafts.map((d) => {
					const tpl = getTemplate(d.slug);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col rounded-[var(--radius-xl)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: "muted",
										children: tpl?.forum ?? AUDIT_SLUGS[d.slug] ?? d.slug
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-2 font-display text-xl font-medium",
										children: d.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-[12px] text-muted tabular-nums",
										children: new Date(d.createdAt).toLocaleString("en-IN")
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									"aria-label": "Delete draft",
									onClick: () => remove(d.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 line-clamp-4 flex-1 font-serif text-sm leading-relaxed text-muted",
								children: d.draftText
							}),
							d.slug in AUDIT_SLUGS ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/audit",
									children: "Open audit"
								})
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/draft/$slug",
									params: { slug: d.slug },
									children: "Open instrument"
								})
							})
						]
					}, d.id);
				})
			})
		]
	}) });
}
//#endregion
export { HistoryPage as component };
