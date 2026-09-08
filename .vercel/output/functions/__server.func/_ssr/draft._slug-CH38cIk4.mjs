import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { C as Bookmark, E as ArrowLeft, S as Check, c as Printer, f as LoaderCircle, l as PenLine, n as WandSparkles, v as Download, x as ChevronDown, y as Copy } from "../_libs/lucide-react.mjs";
import { n as Textarea, t as CitationPanel } from "./createSsrRpc-BwqePK-a.mjs";
import { t as Button } from "./button-CHFc7sYZ.mjs";
import { i as searchAuthorities, n as generateDraft, r as refineDraft } from "./legal-Ctpezxqw.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as downloadDraftDocx, n as Label, o as parseDraftOutput, t as DraftPaper } from "./parse-CYKzCF3o.mjs";
import { t as Input } from "./input-Cu4Cu_xT.mjs";
import { t as useDraftStore } from "./store-MoEgvrDN.mjs";
import { r as getTemplate } from "./templates-7fivPM6Q.mjs";
import { a as SelectItemIndicator, c as SelectTrigger$1, i as SelectItem$1, l as SelectValue$1, n as SelectContent$1, o as SelectItemText, r as SelectIcon, s as SelectPortal, t as Select$1, u as SelectViewport } from "../_libs/@radix-ui/react-select+[...].mjs";
import { n as Route } from "./router-DCUOXfE1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/draft._slug-CH38cIk4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
function SelectTrigger({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
		className: cn("flex h-11 w-full items-center justify-between rounded-[var(--radius-sm)] border border-border bg-paper px-3 text-sm text-ink shadow-[var(--shadow-border)] focus:outline-none focus:ring-2 focus:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "size-4 text-muted" })
		})]
	});
}
function SelectContent({ className, children, position = "popper", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent$1, {
		className: cn("relative z-50 max-h-72 min-w-32 overflow-hidden rounded-[var(--radius-md)] border border-border bg-surface text-ink shadow-[var(--shadow-border-hover)]", className),
		position,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: "p-1",
			children
		})
	}) });
}
function SelectItem({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
		className: cn("relative flex w-full cursor-pointer select-none items-center rounded-[var(--radius-xs)] py-2 pl-8 pr-2 text-sm outline-none focus:bg-surface-2 data-disabled:pointer-events-none data-disabled:opacity-50", className),
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute left-2 flex size-3.5 items-center justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
	});
}
function StudioForm({ template, values, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-4",
		children: template.fields.map((field) => {
			const id = `field-${field.key}`;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Label, {
						htmlFor: id,
						children: [field.label, field.required ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-1 text-danger",
							children: "*"
						}) : null]
					}),
					field.type === "textarea" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id,
						value: values[field.key] ?? "",
						placeholder: field.placeholder,
						onChange: (e) => onChange(field.key, e.target.value),
						rows: 4
					}) : field.type === "select" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: values[field.key] || field.options?.[0]?.value,
						onValueChange: (v) => onChange(field.key, v),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							id,
							className: "w-full",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: (field.options ?? []).map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: opt.value,
							children: opt.label
						}, opt.value)) })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id,
						type: field.type === "date" ? "date" : "text",
						value: values[field.key] ?? "",
						placeholder: field.placeholder,
						onChange: (e) => onChange(field.key, e.target.value)
					}),
					field.hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[12px] text-muted",
						children: field.hint
					}) : null
				]
			}, field.key);
		})
	});
}
function DraftStudio({ template }) {
	const [values, setValues] = (0, import_react.useState)(() => {
		const init = {};
		for (const field of template.fields) if (field.type === "select" && field.options?.[0]) init[field.key] = field.options[0].value;
		return init;
	});
	const [stage, setStage] = (0, import_react.useState)("idle");
	const [raw, setRaw] = (0, import_react.useState)("");
	const [citations, setCitations] = (0, import_react.useState)([]);
	const [refine, setRefine] = (0, import_react.useState)("");
	const save = useDraftStore((s) => s.save);
	const parsed = (0, import_react.useMemo)(() => raw ? parseDraftOutput(raw) : null, [raw]);
	const busy = stage === "retrieving" || stage === "drafting" || stage === "refining";
	function setField(key, value) {
		setValues((v) => ({
			...v,
			[key]: value
		}));
	}
	function fillSample() {
		setValues({ ...template.sample });
		toast.message("Sample matter loaded. Review the facts, then draft.");
	}
	async function runDraft() {
		const missing = template.fields.filter((f) => f.required && !(values[f.key] ?? "").trim());
		if (missing.length) {
			toast.error(`Please complete: ${missing.map((f) => f.label).join(", ")}`);
			return;
		}
		const factBlob = Object.values(values).join(" ");
		setStage("retrieving");
		try {
			const found = await searchAuthorities({ data: {
				query: `${template.ragQuery}\n${factBlob}`,
				k: 8
			} });
			setCitations(found.hits);
			setStage("drafting");
			const result = await generateDraft({ data: {
				slug: template.slug,
				title: template.title,
				instructions: template.instructions,
				facts: values,
				ragQuery: template.ragQuery
			} });
			if (!result.ok) {
				toast.error(result.error);
				setCitations(result.citations);
				setStage(raw ? "ready" : "idle");
				return;
			}
			setRaw(result.text);
			setCitations(result.citations);
			setStage("ready");
			toast.success("Draft prepared. Review authorities before you copy it.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Drafting failed.");
			setStage(raw ? "ready" : "idle");
		}
	}
	async function runRefine() {
		if (!raw || !refine.trim()) return;
		setStage("refining");
		try {
			const result = await refineDraft({ data: {
				slug: template.slug,
				title: template.title,
				currentDraft: raw,
				instruction: refine.trim(),
				ragQuery: template.ragQuery
			} });
			if (!result.ok) {
				toast.error(result.error);
				setStage("ready");
				return;
			}
			setRaw(result.text);
			setCitations(result.citations);
			setRefine("");
			setStage("ready");
			toast.success("Revision applied.");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Revision failed.");
			setStage("ready");
		}
	}
	function copyDraft() {
		const text = parsed?.draft || raw;
		if (!text) return;
		navigator.clipboard.writeText(text);
		toast.success("Draft copied.");
	}
	function saveDraft() {
		if (!parsed?.draft) return;
		save({
			id: `${template.slug}-${Date.now()}`,
			slug: template.slug,
			title: template.title,
			createdAt: Date.now(),
			facts: values,
			draftText: parsed.draft,
			notes: parsed.notes,
			citations
		});
		toast.success("Saved to history on this device.");
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All instruments"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "muted",
						children: template.forum
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl",
						children: template.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted",
						children: template.blurb
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					"data-print-hide": true,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: fillSample,
						disabled: busy,
						children: "Load sample matter"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => void runDraft(),
						disabled: busy,
						children: [busy && stage !== "refining" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PenLine, { className: "size-4" }), stage === "retrieving" ? "Retrieving authorities" : stage === "drafting" ? "Drafting" : "Draft with RAG"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,18rem)]",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)] lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:p-6",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-lg font-medium",
								children: "Facts of the matter"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 mb-5 text-[13px] text-muted",
								children: "These particulars are the only facts the model may use."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StudioForm, {
								template,
								values,
								onChange: setField
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
								title: template.title,
								body: parsed?.draft ?? "",
								emptyHint: stage === "drafting" || stage === "retrieving" ? "Retrieving statute and composing the instrument…" : "Fill the facts — or load a sample matter — then draft. The page will set here as a pleading."
							}),
							parsed?.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2 p-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-[0.14em] text-muted uppercase",
									children: "Drafting notes"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink",
									children: parsed.notes
								})]
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 flex flex-wrap gap-2",
								"data-print-hide": true,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										onClick: copyDraft,
										disabled: !raw,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: !raw,
										onClick: () => {
											downloadDraftDocx({
												title: template.title,
												subtitle: "NyayaDraft working draft — review before use",
												body: parsed?.draft || raw,
												filename: `NyayaDraft-${template.slug}.docx`
											}).then(() => toast.success("Word file downloaded.")).catch(() => toast.error("Could not build the Word file."));
										},
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Word"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: !raw,
										onClick: () => window.print(),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), "Print"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										variant: "outline",
										size: "sm",
										disabled: !parsed?.draft,
										onClick: saveDraft,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Save"]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex gap-2",
								"data-print-hide": true,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: refine,
									placeholder: "Revise: shorten the prayer, add limitation, more formal…",
									onChange: (e) => setRefine(e.target.value),
									disabled: !raw || busy,
									onKeyDown: (e) => {
										if (e.key === "Enter") runRefine();
									}
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "secondary",
									disabled: !raw || busy || !refine.trim(),
									onClick: () => void runRefine(),
									children: [stage === "refining" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), "Revise"]
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationPanel, {
						citations,
						className: "lg:col-span-2 xl:col-span-1 xl:sticky xl:top-20"
					})
				]
			})
		]
	});
}
function DraftPage() {
	const { slug } = Route.useParams();
	const template = getTemplate(slug);
	if (!template) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-lg px-4 py-24 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium",
				children: "No such instrument"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "That draft type is not in the chambers list."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-6",
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					children: "Back to drafts"
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftStudio, { template }) }) });
}
//#endregion
export { DraftPage as component };
