import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Bb-iFcXR.js
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-8 text-primary", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 12h5.2c.9 0 1.6.4 2.2 1.1L16 13.5l-.4.4C15.1 14.6 14.3 15 13.4 15H9V12Zm8.6 0H23v3h-4.4c-.9 0-1.7-.4-2.2-1.1l.4-.4c.6-.7 1.3-1.1 2.2-1.1Z",
				fill: "#f6f1e8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 16h5.2c.9 0 1.7.4 2.2 1.1l.6.7.6-.7c.5-.7 1.3-1.1 2.2-1.1H23v6.4h-4.4c-.9 0-1.7.3-2.2.9L16 23.2l-.6-.9c-.5-.6-1.3-.9-2.2-.9H9V16Z",
				fill: "none",
				stroke: "#f6f1e8",
				strokeWidth: "1.3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "16",
				cy: "9",
				r: "2",
				fill: "none",
				stroke: "#f6f1e8",
				strokeWidth: "1.3"
			})
		]
	});
}
var NAV = [
	{
		to: "/",
		label: "Draft"
	},
	{
		to: "/library",
		label: "Library"
	},
	{
		to: "/ask",
		label: "Ask the law"
	},
	{
		to: "/audit",
		label: "Audit store"
	},
	{
		to: "/history",
		label: "History"
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "flex min-w-0 items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-lg leading-none font-medium tracking-tight",
								children: "NyayaDraft"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 hidden text-[11px] tracking-[0.14em] text-muted uppercase sm:block",
								children: "Indian legal drafting"
							})]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "ml-auto flex items-center gap-1 overflow-x-auto",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" || pathname.startsWith("/draft") : pathname === item.to || pathname.startsWith(`${item.to}/`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: item.to,
								className: cn("rounded-[var(--radius-sm)] px-3 py-2 text-sm whitespace-nowrap transition-colors duration-[var(--motion-quick)]", active ? "bg-primary text-primary-fg" : "text-muted hover:bg-surface-2 hover:text-ink"),
								children: item.label
							}, item.to);
						})
					})]
				})
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-3xl text-[13px] leading-relaxed text-muted",
						children: "NyayaDraft is an AI drafting aid grounded in a curated corpus of Indian statute. It is not a law firm, does not create an advocate–client relationship, and is not a substitute for advice from an advocate enrolled under the Advocates Act, 1961. Statutory excerpts are abridged for retrieval. Always review, stamp, and verify a draft before it leaves chambers."
					})
				})
			})
		]
	});
}
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-fg",
		outline: "border-border text-muted bg-surface",
		muted: "border-transparent bg-surface-2 text-muted"
	} },
	defaultVariants: { variant: "outline" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as n, cn as r, AppShell as t };
