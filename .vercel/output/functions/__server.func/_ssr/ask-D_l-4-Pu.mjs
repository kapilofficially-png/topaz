import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { a as Send, f as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as Textarea, t as CitationPanel } from "./createSsrRpc-BwqePK-a.mjs";
import { t as Button } from "./button-CHFc7sYZ.mjs";
import { t as askTheLaw } from "./legal-Ctpezxqw.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-D_l-4-Pu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STARTERS = [
	"When is a post-employment non-compete void in India?",
	"Walk me through the 30–15–30 timeline for a section 138 notice.",
	"Can an Indian web store write 'all sales final' in its refund policy?",
	"What must a DPDP consent notice tell the customer?"
];
function AskPage() {
	const [question, setQuestion] = (0, import_react.useState)("");
	const [answer, setAnswer] = (0, import_react.useState)("");
	const [citations, setCitations] = (0, import_react.useState)([]);
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run(q) {
		const text = q.trim();
		if (text.length < 8) {
			toast.error("Ask a complete question of Indian law.");
			return;
		}
		setQuestion(text);
		setBusy(true);
		try {
			const result = await askTheLaw({ data: { question: text } });
			if (!result.ok) {
				toast.error(result.error);
				setCitations(result.citations);
				return;
			}
			setAnswer(result.text);
			setCitations(result.citations);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "The library could not answer.");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] tracking-[0.18em] text-muted uppercase",
				children: "Grounded Q&A"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-medium tracking-tight",
				children: "Ask the law"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm leading-relaxed text-muted",
				children: "Questions are answered from the same corpus that grounds drafts — not from an uncited model memory."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 flex flex-wrap gap-2",
				children: STARTERS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: busy,
					onClick: () => void run(s),
					className: "rounded-full border border-border bg-surface px-3 py-2 text-left text-[13px] text-ink hover:bg-surface-2",
					children: s
				}, s))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 flex flex-col gap-3 sm:flex-row sm:items-end",
				onSubmit: (e) => {
					e.preventDefault();
					run(question);
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					value: question,
					onChange: (e) => setQuestion(e.target.value),
					placeholder: "e.g. Can I file a Zero FIR if the offence took place in another State?",
					className: "min-h-24 sm:min-h-20",
					disabled: busy
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					disabled: busy,
					className: "sm:h-11",
					children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "Ask"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,18rem)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "rounded-[var(--radius-lg)] border border-border bg-paper p-6 shadow-[var(--shadow-border)] sm:p-8",
					children: busy && !answer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-muted italic",
						children: "Retrieving authorities and composing an answer…"
					}) : answer ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-[16px] leading-[1.7] whitespace-pre-wrap",
						children: answer
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-serif text-muted italic",
						children: "Put a question of Indian law. The answer will cite the retrieved heads."
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationPanel, {
					citations,
					title: "Retrieved for this question"
				})]
			})
		]
	}) });
}
//#endregion
export { AskPage as component };
