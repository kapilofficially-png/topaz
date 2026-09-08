import "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as cn } from "./badge-Bb-iFcXR.mjs";
import { t as Root } from "../_libs/radix-ui__react-label.mjs";
import { a as Header, c as Paragraph, d as TableRow, f as TextRun, h as convertInchesToTwip, i as Footer, l as Table, m as WidthType, n as BorderStyle, o as Packer, p as VerticalAlign, r as File, s as PageNumber, t as AlignmentType, u as TableCell } from "../_libs/docx.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function inline(line) {
	return line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => part.startsWith("**") && part.endsWith("**") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
		className: "font-semibold",
		children: part.slice(2, -2)
	}, j) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, j));
}
function cells(row) {
	return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}
function isDivider$1(row) {
	return /^\s*\|?\s*:?-{3,}/.test(row);
}
function renderTable(rows, key) {
	const bodyRows = rows.filter((r) => !isDivider$1(r));
	if (!bodyRows.length) return null;
	const head = cells(bodyRows[0]);
	const rest = bodyRows.slice(1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "my-4 overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full min-w-[28rem] border-collapse text-left text-[13px] leading-relaxed",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: head.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
				className: "border-b border-border px-2 py-2 font-sans text-[11px] font-medium tracking-wide text-muted uppercase",
				children: inline(c)
			}, i)) }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rest.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: cells(r).map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "border-b border-border/70 px-2 py-2 align-top",
				children: inline(c)
			}, j)) }, i)) })]
		})
	}, key);
}
function renderLine(line, i) {
	if (!line.trim()) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-3" }, i);
	if (/^#{1,3}\s/.test(line)) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "mt-6 mb-2 text-center font-display text-lg font-medium tracking-tight first:mt-0",
		children: line.replace(/^#{1,3}\s/, "")
	}, i);
	if (/^\s*[-*•]\s+/.test(line) || /^✔/.test(line)) {
		const rest = line.replace(/^\s*[-*•]\s+/, "").replace(/^✔\s*/, "");
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "flex gap-2 pl-1 text-[15px] leading-[1.7]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": true,
				className: "mt-1 text-primary",
				children: "•"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: inline(rest) })]
		}, i);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-[15px] leading-[1.7]",
		children: inline(line)
	}, i);
}
function renderBody(body) {
	const lines = body.split("\n");
	const nodes = [];
	let i = 0;
	while (i < lines.length) {
		if (lines[i].trim().startsWith("|")) {
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				rows.push(lines[i]);
				i += 1;
			}
			nodes.push(renderTable(rows, nodes.length));
			continue;
		}
		nodes.push(renderLine(lines[i], i));
		i += 1;
	}
	return nodes;
}
function DraftPaper({ title, body, emptyHint, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: cn("relative overflow-hidden rounded-[var(--radius-lg)] bg-paper text-ink shadow-[var(--shadow-border)]", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"aria-hidden": true,
				className: "pointer-events-none absolute inset-y-0 left-0 w-2 bg-primary/80"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border/80 px-8 py-4 sm:px-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.18em] text-muted uppercase",
					children: "Draft for review"
				}), title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-xl font-medium tracking-tight",
					children: title
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-8 py-8 sm:px-12",
				children: body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-serif",
					children: renderBody(body)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-serif text-muted italic",
					children: emptyHint
				})
			})
		]
	});
}
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
		className: cn("text-[13px] font-medium leading-none text-ink peer-disabled:cursor-not-allowed peer-disabled:opacity-50", className),
		...props
	});
}
var NAVY = "1F3A4D";
var STAMP = "7A2E24";
var INK = "1A1A1A";
var MUTED = "5C564C";
var RULE = "C4B8A4";
var PAPER = "F7F3EA";
function runs(text, opts) {
	const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p.length);
	if (!parts.length) return [new TextRun({
		text: "",
		font: opts?.font ?? "Cambria",
		size: opts?.size ?? 22,
		color: opts?.color ?? INK
	})];
	return parts.map((part) => {
		const bold = opts?.bold || part.startsWith("**") && part.endsWith("**");
		const clean = bold && part.startsWith("**") ? part.slice(2, -2) : part;
		return new TextRun({
			text: clean,
			bold,
			italics: opts?.italics,
			font: opts?.font ?? "Cambria",
			size: opts?.size ?? 22,
			color: opts?.color ?? INK
		});
	});
}
function cellsOf(row) {
	return row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
}
function isDivider(row) {
	return /^\s*\|?\s*:?-{3,}/.test(row);
}
function hairline() {
	return {
		style: BorderStyle.SINGLE,
		size: 6,
		color: RULE
	};
}
function letterhead(subtitle, dateLine) {
	return new Table({
		width: {
			size: 100,
			type: WidthType.PERCENTAGE
		},
		borders: {
			top: {
				style: BorderStyle.NONE,
				size: 0,
				color: "FFFFFF"
			},
			left: {
				style: BorderStyle.NONE,
				size: 0,
				color: "FFFFFF"
			},
			right: {
				style: BorderStyle.NONE,
				size: 0,
				color: "FFFFFF"
			},
			bottom: {
				style: BorderStyle.SINGLE,
				size: 12,
				color: STAMP
			},
			insideHorizontal: {
				style: BorderStyle.NONE,
				size: 0,
				color: "FFFFFF"
			},
			insideVertical: {
				style: BorderStyle.NONE,
				size: 0,
				color: "FFFFFF"
			}
		},
		rows: [new TableRow({ children: [new TableCell({
			width: {
				size: 62,
				type: WidthType.PERCENTAGE
			},
			verticalAlign: VerticalAlign.CENTER,
			margins: {
				bottom: 80,
				top: 40
			},
			children: [new Paragraph({ children: [new TextRun({
				text: "NYAYADRAFT",
				bold: true,
				font: "Calibri",
				size: 22,
				color: NAVY,
				characterSpacing: 240
			})] }), new Paragraph({ children: [new TextRun({
				text: "India-law drafting  ·  working draft",
				font: "Calibri",
				size: 16,
				color: MUTED,
				italics: true
			})] })]
		}), new TableCell({
			width: {
				size: 38,
				type: WidthType.PERCENTAGE
			},
			verticalAlign: VerticalAlign.CENTER,
			margins: {
				bottom: 80,
				top: 40
			},
			children: [
				new Paragraph({
					alignment: AlignmentType.RIGHT,
					children: [new TextRun({
						text: "CONFIDENTIAL",
						bold: true,
						font: "Calibri",
						size: 16,
						color: STAMP,
						characterSpacing: 120
					})]
				}),
				new Paragraph({
					alignment: AlignmentType.RIGHT,
					children: [new TextRun({
						text: dateLine,
						font: "Calibri",
						size: 16,
						color: MUTED
					})]
				}),
				new Paragraph({
					alignment: AlignmentType.RIGHT,
					children: [new TextRun({
						text: subtitle,
						font: "Calibri",
						size: 16,
						color: MUTED
					})]
				})
			]
		})] })]
	});
}
function tableFrom(rows) {
	const bodyRows = rows.filter((r) => !isDivider(r));
	if (!bodyRows.length) return null;
	const head = cellsOf(bodyRows[0]);
	const rest = bodyRows.slice(1);
	const colW = Math.floor(100 / Math.max(head.length, 1));
	const border = hairline();
	const makeCell = (text, header) => new TableCell({
		width: {
			size: colW,
			type: WidthType.PERCENTAGE
		},
		shading: header ? {
			type: "clear",
			fill: PAPER,
			color: "auto"
		} : void 0,
		margins: {
			top: 60,
			bottom: 60,
			left: 80,
			right: 80
		},
		borders: {
			top: border,
			bottom: border,
			left: border,
			right: border
		},
		children: [new Paragraph({ children: runs(text, {
			bold: header,
			size: header ? 16 : 18,
			font: "Calibri",
			color: header ? MUTED : INK
		}) })]
	});
	return new Table({
		width: {
			size: 100,
			type: WidthType.PERCENTAGE
		},
		rows: [new TableRow({
			tableHeader: true,
			children: head.map((c) => makeCell(c, true))
		}), ...rest.map((r) => new TableRow({ children: cellsOf(r).map((c) => makeCell(c, false)) }))]
	});
}
function bodyChildren(markdown) {
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	const out = [];
	let i = 0;
	while (i < lines.length) {
		const line = lines[i];
		if (!line.trim()) {
			out.push(new Paragraph({
				spacing: { after: 80 },
				children: []
			}));
			i += 1;
			continue;
		}
		if (line.trim().startsWith("|")) {
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				rows.push(lines[i]);
				i += 1;
			}
			const table = tableFrom(rows);
			if (table) out.push(table);
			out.push(new Paragraph({
				spacing: { after: 120 },
				children: []
			}));
			continue;
		}
		if (/^#{1,3}\s/.test(line)) {
			const level = line.startsWith("###") ? 3 : 2;
			const text = line.replace(/^#{1,3}\s+/, "").replace(/\*+/g, "");
			out.push(new Paragraph({
				spacing: {
					before: level === 2 ? 280 : 200,
					after: 80
				},
				border: level === 2 ? { bottom: {
					style: BorderStyle.SINGLE,
					size: 6,
					color: RULE,
					space: 4
				} } : void 0,
				children: [new TextRun({
					text: text.toUpperCase(),
					bold: true,
					font: "Calibri",
					size: level === 2 ? 22 : 20,
					color: level === 2 ? NAVY : STAMP,
					characterSpacing: level === 2 ? 80 : 40
				})]
			}));
			i += 1;
			continue;
		}
		if (/^\s*[-*•]\s+/.test(line) || /^✔/.test(line)) {
			const text = line.replace(/^\s*[-*•]\s+/, "").replace(/^✔\s*/, "");
			out.push(new Paragraph({
				indent: {
					left: convertInchesToTwip(.25),
					hanging: convertInchesToTwip(.18)
				},
				spacing: {
					after: 60,
					line: 276
				},
				children: [new TextRun({
					text: "•  ",
					font: "Calibri",
					size: 22,
					color: STAMP
				}), ...runs(text)]
			}));
			i += 1;
			continue;
		}
		if (/^\s*\d+[.)]\s+/.test(line)) {
			const m = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
			const n = m?.[1] ?? "1";
			const text = m?.[2] ?? line;
			out.push(new Paragraph({
				indent: {
					left: convertInchesToTwip(.32),
					hanging: convertInchesToTwip(.28)
				},
				spacing: {
					after: 80,
					line: 288
				},
				children: [new TextRun({
					text: `${n}.  `,
					bold: true,
					font: "Cambria",
					size: 22,
					color: NAVY
				}), ...runs(text)]
			}));
			i += 1;
			continue;
		}
		out.push(new Paragraph({
			spacing: {
				after: 120,
				line: 288
			},
			alignment: AlignmentType.JUSTIFIED,
			children: runs(line)
		}));
		i += 1;
	}
	return out;
}
function footerPara() {
	return new Paragraph({
		border: { top: {
			style: BorderStyle.SINGLE,
			size: 6,
			color: RULE,
			space: 8
		} },
		spacing: { before: 80 },
		children: [
			new TextRun({
				text: "NyayaDraft working draft — not a solicitor-client opinion. Review before publication.   ",
				font: "Calibri",
				size: 14,
				italics: true,
				color: MUTED
			}),
			new TextRun({
				text: "Page ",
				font: "Calibri",
				size: 14,
				color: MUTED
			}),
			new TextRun({
				children: [PageNumber.CURRENT],
				font: "Calibri",
				size: 14,
				color: MUTED
			}),
			new TextRun({
				text: " of ",
				font: "Calibri",
				size: 14,
				color: MUTED
			}),
			new TextRun({
				children: [PageNumber.TOTAL_PAGES],
				font: "Calibri",
				size: 14,
				color: MUTED
			})
		]
	});
}
async function downloadDraftDocx(matter) {
	const dateLine = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
	const matterLine = [matter.host, "internal use only"].filter(Boolean).join("  ·  ");
	const doc = new File({
		styles: { default: { document: { run: {
			font: "Cambria",
			size: 22,
			color: INK
		} } } },
		sections: [{
			properties: { page: {
				size: {
					width: convertInchesToTwip(8.27),
					height: convertInchesToTwip(11.69)
				},
				margin: {
					top: convertInchesToTwip(.85),
					bottom: convertInchesToTwip(.9),
					left: convertInchesToTwip(.95),
					right: convertInchesToTwip(.95)
				}
			} },
			headers: { default: new Header({ children: [letterhead(matter.subtitle || matterLine, dateLine)] }) },
			footers: { default: new Footer({ children: [footerPara()] }) },
			children: [
				new Paragraph({
					spacing: { after: 80 },
					children: []
				}),
				new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 60 },
					children: [new TextRun({
						text: matter.title,
						bold: true,
						font: "Cambria",
						size: 36,
						color: NAVY
					})]
				}),
				matter.subtitle ? new Paragraph({
					alignment: AlignmentType.CENTER,
					spacing: { after: 200 },
					children: [new TextRun({
						text: matter.subtitle,
						italics: true,
						font: "Calibri",
						size: 20,
						color: MUTED
					})]
				}) : new Paragraph({
					spacing: { after: 160 },
					children: []
				}),
				...bodyChildren(matter.body.trim() || " ")
			]
		}]
	});
	const blob = await Packer.toBlob(doc);
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = matter.filename.endsWith(".docx") ? matter.filename : `${matter.filename}.docx`;
	a.click();
	URL.revokeObjectURL(url);
}
function sliceSection(source, heading, next) {
	const match = new RegExp(`^##\\s*${heading}\\s*$`, "im").exec(source);
	if (!match || match.index === void 0) return "";
	const start = match.index + match[0].length;
	let end = source.length;
	if (next) {
		const n = new RegExp(`^##\\s*${next}\\s*$`, "im").exec(source.slice(start));
		if (n && n.index !== void 0) end = start + n.index;
	}
	return source.slice(start, end).trim();
}
function parseDraftOutput(text) {
	return {
		draft: sliceSection(text, "DRAFT", "AUTHORITIES RELIED ON") || sliceSection(text, "DRAFT") || text.trim(),
		authorities: sliceSection(text, "AUTHORITIES RELIED ON", "DRAFTING NOTES"),
		notes: sliceSection(text, "DRAFTING NOTES"),
		raw: text
	};
}
function parseStoreQuestions(md) {
	const chunks = md.split(/^###\s+/m).slice(1);
	const out = [];
	for (const chunk of chunks) {
		const [first, ...rest] = chunk.split("\n");
		const head = (first ?? "").trim();
		if (!/^[QC]\d+/i.test(head) && !/HIGH|MEDIUM|LOW/i.test(head)) continue;
		const m = head.match(/^([QC]\d+)\s*[—–-]\s*(HIGH|MEDIUM|LOW)\s*[—–-]\s*(.+)$/i);
		const id = (m?.[1] ?? `C${out.length + 1}`).toUpperCase();
		const severity = (m?.[2] ?? "MEDIUM").toUpperCase();
		const title = (m?.[3] ?? head.replace(/^[QC]\d+\s*[—–-]\s*/i, "")).trim();
		const body = rest.join("\n");
		const why = body.match(/\*\*Why[^*]*:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)?.[1]?.trim() ?? "";
		const hint = body.match(/\*\*(?:Good answer looks like|Hint|Placeholder)[^*]*:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)?.[1]?.trim() ?? "";
		out.push({
			id,
			severity,
			title,
			why,
			hint
		});
	}
	return out.slice(0, 12);
}
function applyQuestionnaireAnswers(md, answers) {
	return md.split(/^(?=###\s+)/m).map((chunk) => {
		const head = chunk.match(/^###\s+([QC]\d+)/i)?.[1]?.toUpperCase();
		if (!head) return chunk;
		const answer = answers[head]?.trim();
		if (!answer) return chunk;
		if (/\*\*Your answer:\*\*/i.test(chunk)) return chunk.replace(/\*\*Your answer:\*\*[\s\S]*?(?=\n###|\n##|$)/i, `**Your answer:** ${answer}\n\n`);
		return `${chunk.trimEnd()}\n\n**Your answer:** ${answer}\n\n`;
	}).join("");
}
function parseForwardEmails(md) {
	const chunks = md.split(/^##\s+/m).slice(1);
	const out = [];
	for (const chunk of chunks) {
		const [first, ...rest] = chunk.split("\n");
		const heading = (first ?? "").trim();
		if (!/email|notice|developer|advocate|customer/i.test(heading)) continue;
		const bodyMd = rest.join("\n");
		const field = (label) => bodyMd.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, "i"))?.[1]?.trim() ?? "";
		let body = sliceLoose(bodyMd, "Body") || sliceLoose(bodyMd, "Email body");
		if (!body) body = bodyMd.replace(/\*\*To:\*\*[^\n]*\n?/i, "").replace(/\*\*Subject:\*\*[^\n]*\n?/i, "").trim();
		out.push({
			heading,
			to: field("To").replace(/^mailto:/i, ""),
			subject: field("Subject"),
			body: body.trim()
		});
	}
	return out;
}
function sliceLoose(source, heading) {
	const match = new RegExp(`\\*\\*${heading}:\\*\\*\\s*`, "i").exec(source);
	if (!match || match.index === void 0) return "";
	const start = match.index + match[0].length;
	const next = source.slice(start).search(/\n\*\*[A-Za-z].{0,24}:\*\*/);
	return source.slice(start, next === -1 ? void 0 : start + next).trim();
}
function mailtoHref(to, subject, body) {
	const addr = to && !/\[|placeholder|to be/i.test(to) ? to : "";
	const params = new URLSearchParams();
	if (subject) params.set("subject", subject.slice(0, 180));
	if (body) params.set("body", body.slice(0, 1600));
	const q = params.toString();
	return `mailto:${addr}${q ? `?${q}` : ""}`;
}
//#endregion
export { mailtoHref as a, parseStoreQuestions as c, downloadDraftDocx as i, Label as n, parseDraftOutput as o, applyQuestionnaireAnswers as r, parseForwardEmails as s, DraftPaper as t };
