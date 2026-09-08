import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as Badge, r as cn, t as AppShell } from "./badge-Bb-iFcXR.mjs";
import { n as createServerFn } from "./ssr.mjs";
import { t as ScrollArea } from "./scroll-area-v3ajb5cr.mjs";
import { C as Bookmark, _ as FileDown, b as ClipboardPen, d as Mail, f as LoaderCircle, g as Globe, h as Handshake, n as WandSparkles, o as ScanSearch, p as ListChecks, t as Wrench, u as Megaphone, v as Download, y as Copy } from "../_libs/lucide-react.mjs";
import { n as Textarea, r as createSsrRpc, t as CitationPanel } from "./createSsrRpc-BwqePK-a.mjs";
import { t as Button } from "./button-CHFc7sYZ.mjs";
import { a as object, n as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as POLICY_LABELS } from "./types-Blq5imDZ.mjs";
import { a as mailtoHref, c as parseStoreQuestions, i as downloadDraftDocx, n as Label, o as parseDraftOutput, r as applyQuestionnaireAnswers, s as parseForwardEmails, t as DraftPaper } from "./parse-CYKzCF3o.mjs";
import { t as Input } from "./input-Cu4Cu_xT.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as useDraftStore } from "./store-MoEgvrDN.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
import { t as require_jspdf_node_min } from "../_libs/jspdf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-qTybprr5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_jspdf_node_min = require_jspdf_node_min();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("inline-flex h-11 items-center justify-center rounded-[var(--radius-md)] bg-surface-2 p-1 text-muted", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-[background-color,color,box-shadow] duration-[var(--motion-quick)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-ink data-[state=active]:shadow-[var(--shadow-border)]", className),
		...props
	});
}
function TabsContent({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		className: cn("mt-4 focus-visible:outline-none", className),
		...props
	});
}
var researchInput = object({ url: string().min(4).max(500) });
var auditInput = object({
	origin: string().min(8).max(300),
	host: string().min(3).max(200),
	homeTitle: string().max(200).optional(),
	hints: object({
		emails: array(string()).optional(),
		phones: array(string()).optional(),
		gstins: array(string()).optional(),
		legalName: string().optional()
	}).optional(),
	pages: array(object({
		kind: string(),
		label: string(),
		url: string(),
		title: string(),
		text: string().max(12e3)
	})).min(1).max(8),
	missing: array(object({
		kind: string(),
		label: string()
	})).optional()
});
var refineInput = object({
	kind: _enum([
		"terms",
		"privacy",
		"consent",
		"refund",
		"shipping"
	]),
	origin: string().min(8).max(300),
	host: string().min(3).max(200),
	findings: string().max(14e3).optional(),
	currentPolicy: string().max(14e3).optional(),
	extraInstruction: string().max(1500).optional()
});
var improvedInput = object({
	origin: string().min(8).max(300),
	host: string().min(3).max(200),
	homeTitle: string().max(200).optional(),
	hints: auditInput.shape.hints,
	pages: auditInput.shape.pages,
	missing: auditInput.shape.missing,
	findings: string().max(14e3).optional(),
	gapsPaper: string().max(14e3).optional(),
	questionnairePaper: string().max(16e3).optional(),
	clientBrief: string().max(16e3).optional(),
	implementPaper: string().max(16e3).optional(),
	answers: array(object({
		id: string().max(40),
		title: string().max(200),
		answer: string().max(800)
	})).max(24).optional(),
	refined: array(object({
		kind: string(),
		title: string().max(200),
		text: string().max(2e4)
	})).max(6).optional()
});
var researchStoreFn = createServerFn({ method: "POST" }).validator((input) => researchInput.parse(input)).handler(createSsrRpc("4f7155dd2f550a8b28c4ab89c1fed1b1f906a61b4602753361f7341ef2dbd6e6"));
var auditStoreFn = createServerFn({ method: "POST" }).validator((input) => auditInput.parse(input)).handler(createSsrRpc("7c381e5591386a541903c168e3accc2fa3b43d121ce5b60117a283708d0edc2a"));
var refineStorePolicyFn = createServerFn({ method: "POST" }).validator((input) => refineInput.parse(input)).handler(createSsrRpc("9349d6ebb66212266cbf9e0875c42504b4643a32eadc1fef1e8ee8b143e707ad"));
var findPolicyGapsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("b4e6719e87b0c179f560cf803195605155147dca549f3145d09eb556dddddbb7"));
var writeSellingPointsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("a5fc8baeafad675aa0de68feea6f84486de09fb2a0583d9ffe6942d609e3475c"));
var writeQuestionnaireFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("9db5fa05632ccac9d2a4639a77f21e9ce6c24fc80e99090991f9e816357d8836"));
var writeClientBriefFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("f509c245be4050eefe37fe33937ce7a367c07ab44c186efccb21254f96d6c5b4"));
var writeImplementationsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("3fb2668851f685aa37a4a76a99d75c1721981a5fdf0111b283560dd62977bb47"));
var writeForwardEmailFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(createSsrRpc("cf9b87416e91d277d94e20cefba312bdcda9778d4ccc075b5e4bdd6c6ddfaad1"));
var empty = {
	urlInput: "",
	origin: "",
	host: "",
	homeTitle: "",
	pages: [],
	missing: [],
	hints: null,
	findings: "",
	citations: [],
	refined: [],
	gapsPaper: "",
	sellingPaper: "",
	questionsPaper: "",
	answers: {},
	briefPaper: "",
	briefAnswers: {},
	implementPaper: "",
	emailPaper: ""
};
var useAuditStore = create()(persist((set) => ({
	...empty,
	setUrlInput: (urlInput) => set({ urlInput }),
	setResearch: (data) => set({
		origin: data.origin,
		host: data.host,
		homeTitle: data.homeTitle,
		pages: data.pages,
		missing: data.missing,
		hints: data.hints,
		findings: "",
		citations: [],
		refined: [],
		gapsPaper: "",
		sellingPaper: "",
		questionsPaper: "",
		answers: {},
		briefPaper: "",
		briefAnswers: {},
		implementPaper: "",
		emailPaper: ""
	}),
	setFindings: (findings, citations) => set({
		findings,
		citations
	}),
	setGapsPaper: (gapsPaper, citations) => set((s) => ({
		gapsPaper,
		citations: citations.length ? citations : s.citations
	})),
	setSellingPaper: (sellingPaper, citations) => set((s) => ({
		sellingPaper,
		citations: citations.length ? citations : s.citations
	})),
	setQuestionsPaper: (questionsPaper, citations) => set((s) => ({
		questionsPaper,
		citations: citations.length ? citations : s.citations
	})),
	setAnswer: (id, value) => set((s) => ({ answers: {
		...s.answers,
		[id]: value
	} })),
	setBriefPaper: (briefPaper, citations) => set((s) => ({
		briefPaper,
		citations: citations.length ? citations : s.citations
	})),
	setBriefAnswer: (id, value) => set((s) => ({ briefAnswers: {
		...s.briefAnswers,
		[id]: value
	} })),
	setImplementPaper: (implementPaper, citations) => set((s) => ({
		implementPaper,
		citations: citations.length ? citations : s.citations
	})),
	setEmailPaper: (emailPaper, citations) => set((s) => ({
		emailPaper,
		citations: citations.length ? citations : s.citations
	})),
	setRefined: (item) => set((s) => ({ refined: [item, ...s.refined.filter((r) => r.kind !== item.kind)] })),
	reset: () => set({ ...empty })
}), { name: "nyayadraft-audit" }));
var PAGE_W = 210;
var MARGIN_X = 18;
var MARGIN_TOP = 22;
var CONTENT_W = 174;
var NAVY = [
	31,
	58,
	77
];
var STAMP = [
	122,
	46,
	36
];
var MUTED = [
	92,
	86,
	76
];
var RULE = [
	196,
	184,
	164
];
var INK = [
	26,
	26,
	26
];
var CHAR_MAP = {
	"₹": "Rs. ",
	"—": "-",
	"–": "-",
	"“": "\"",
	"”": "\"",
	"‘": "'",
	"’": "'",
	"…": "...",
	"•": "-",
	"✔": "[x]",
	"×": "x",
	"\xA0": " ",
	" ": " "
};
function pdfSafe(raw) {
	return raw.replace(/[\u2018\u2019\u201A]/g, "'").replace(/[\u201C\u201D\u201E]/g, "\"").replace(/./gu, (ch) => {
		if (CHAR_MAP[ch]) return CHAR_MAP[ch];
		const code = ch.charCodeAt(0);
		if (code === 9 || code === 10 || code === 13) return ch;
		if (code >= 32 && code <= 126) return ch;
		if (code >= 160 && code <= 255) return ch;
		return "";
	}).replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n");
}
function stripMd(line) {
	return pdfSafe(line.replace(/\*\*/g, "").replace(/^#{1,3}\s+/, ""));
}
async function downloadMasterPdf(input) {
	const doc = new import_jspdf_node_min.jsPDF({
		unit: "mm",
		format: "a4",
		compress: true
	});
	const dateLine = (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "long",
		year: "numeric"
	});
	const filled = input.sections.filter((s) => s.body.trim());
	drawCover(doc, input, dateLine, ["Store profile", ...filled.map((s) => s.title)]);
	addProfile(doc, input.profile, dateLine, input.host);
	for (const section of filled) addSection(doc, section.title, section.body, dateLine, input.host);
	stampFooters(doc, input.host, dateLine);
	const filename = `NyayaDraft-${input.host.replace(/[^\w.-]+/g, "-")}-master.pdf`;
	doc.save(filename);
}
function drawCover(doc, input, dateLine, contents) {
	doc.setFillColor(...NAVY);
	doc.rect(0, 0, PAGE_W, 48, "F");
	doc.setFillColor(...STAMP);
	doc.rect(0, 48, PAGE_W, 2.2, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("times", "bold");
	doc.setFontSize(11);
	doc.text("NYAYADRAFT", MARGIN_X, 18);
	doc.setFont("times", "italic");
	doc.setFontSize(10);
	doc.text("India-law drafting", MARGIN_X, 24);
	doc.setFont("times", "bold");
	doc.setFontSize(9);
	doc.text("CONFIDENTIAL  ·  MASTER FILE", 192, 18, { align: "right" });
	doc.setFont("times", "normal");
	doc.text(dateLine, 192, 24, { align: "right" });
	doc.setTextColor(...INK);
	doc.setFont("times", "bold");
	doc.setFontSize(22);
	const title = pdfSafe(input.homeTitle || input.host);
	const titleLines = doc.splitTextToSize(title, CONTENT_W);
	doc.text(titleLines, MARGIN_X, 72);
	const afterTitle = 72 + titleLines.length * 9;
	doc.setFont("times", "normal");
	doc.setFontSize(12);
	doc.setTextColor(...NAVY);
	doc.text(pdfSafe(input.host), MARGIN_X, afterTitle + 6);
	doc.setTextColor(...MUTED);
	doc.setFontSize(10);
	doc.text(pdfSafe(input.origin), MARGIN_X, afterTitle + 12);
	doc.setDrawColor(...RULE);
	doc.setLineWidth(.3);
	doc.line(MARGIN_X, afterTitle + 18, 192, afterTitle + 18);
	doc.setTextColor(...STAMP);
	doc.setFont("times", "bold");
	doc.setFontSize(9);
	doc.text("CONTENTS", MARGIN_X, afterTitle + 28);
	doc.setTextColor(...INK);
	doc.setFont("times", "normal");
	doc.setFontSize(11);
	let y = afterTitle + 36;
	contents.forEach((item, i) => {
		if (y > 257) return;
		doc.text(`${i + 1}.  ${pdfSafe(item)}`, MARGIN_X, y);
		y += 7;
	});
	doc.setFont("times", "italic");
	doc.setFontSize(9);
	doc.setTextColor(...MUTED);
	doc.text(doc.splitTextToSize("Working draft compiled from this session. Not a solicitor-client opinion. Review before publication or filing.", CONTENT_W), MARGIN_X, 269);
}
function addProfile(doc, profile, dateLine, host) {
	addSection(doc, "Store profile", profile, dateLine, host);
}
function addSection(doc, title, body, _dateLine, _host) {
	doc.addPage();
	let y = MARGIN_TOP;
	doc.setFillColor(...NAVY);
	doc.rect(MARGIN_X, y - 6, CONTENT_W, 10, "F");
	doc.setTextColor(255, 255, 255);
	doc.setFont("times", "bold");
	doc.setFontSize(11);
	doc.text(pdfSafe(title).toUpperCase(), 21, y + 1);
	y += 12;
	y = writeBody(doc, body, y);
}
function ensureSpace(doc, y, need) {
	if (y + need <= 279) return y;
	doc.addPage();
	return MARGIN_TOP;
}
function writeBody(doc, markdown, startY) {
	const lines = markdown.replace(/\r\n/g, "\n").split("\n");
	let y = startY;
	let i = 0;
	while (i < lines.length) {
		const raw = lines[i];
		if (!raw.trim()) {
			y += 3;
			i += 1;
			continue;
		}
		if (raw.trim().startsWith("|")) {
			const rows = [];
			while (i < lines.length && lines[i].trim().startsWith("|")) {
				if (!/^\s*\|?\s*:?-{3,}/.test(lines[i])) rows.push(lines[i]);
				i += 1;
			}
			y = writeTable(doc, rows, y);
			continue;
		}
		if (/^#{1,3}\s/.test(raw)) {
			y = ensureSpace(doc, y, 10);
			const level = raw.startsWith("###") ? 3 : 2;
			doc.setFont("times", "bold");
			doc.setFontSize(level === 2 ? 12 : 11);
			doc.setTextColor(...level === 2 ? NAVY : STAMP);
			const wrapped = doc.splitTextToSize(stripMd(raw), CONTENT_W);
			doc.text(wrapped, MARGIN_X, y);
			y += wrapped.length * 5.4 + 3;
			i += 1;
			continue;
		}
		if (/^\s*[-*•]\s+/.test(raw) || /^✔/.test(raw)) {
			const text = stripMd(raw.replace(/^\s*[-*•]\s+/, "").replace(/^✔\s*/, ""));
			y = ensureSpace(doc, y, 8);
			doc.setFont("times", "normal");
			doc.setFontSize(10.5);
			doc.setTextColor(...INK);
			const wrapped = doc.splitTextToSize(text, 168);
			doc.setTextColor(...STAMP);
			doc.text("-", MARGIN_X, y);
			doc.setTextColor(...INK);
			doc.text(wrapped, 23, y);
			y += wrapped.length * 5 + 1.5;
			i += 1;
			continue;
		}
		if (/^\s*\d+[.)]\s+/.test(raw)) {
			const m = raw.match(/^\s*(\d+)[.)]\s+(.*)$/);
			const n = m?.[1] ?? "1";
			const text = stripMd(m?.[2] ?? raw);
			y = ensureSpace(doc, y, 8);
			doc.setFont("times", "bold");
			doc.setFontSize(10.5);
			doc.setTextColor(...NAVY);
			doc.text(`${n}.`, MARGIN_X, y);
			doc.setFont("times", "normal");
			doc.setTextColor(...INK);
			const wrapped = doc.splitTextToSize(text, 166);
			doc.text(wrapped, 26, y);
			y += wrapped.length * 5 + 1.8;
			i += 1;
			continue;
		}
		y = ensureSpace(doc, y, 8);
		doc.setFont("times", "normal");
		doc.setFontSize(10.5);
		doc.setTextColor(...INK);
		const wrapped = doc.splitTextToSize(stripMd(raw), CONTENT_W);
		for (const line of wrapped) {
			y = ensureSpace(doc, y, 6);
			doc.text(line, MARGIN_X, y);
			y += 5;
		}
		y += 1.5;
		i += 1;
	}
	return y;
}
function writeTable(doc, rows, startY) {
	let y = startY + 2;
	doc.setFontSize(9);
	for (let r = 0; r < rows.length; r++) {
		const line = rows[r].trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => stripMd(c.trim())).join("  |  ");
		const wrapped = doc.splitTextToSize(line, CONTENT_W);
		y = ensureSpace(doc, y, wrapped.length * 4.5 + 2);
		doc.setFont("times", r === 0 ? "bold" : "normal");
		doc.setTextColor(...r === 0 ? MUTED : INK);
		doc.text(wrapped, MARGIN_X, y);
		y += wrapped.length * 4.5 + 1.5;
	}
	return y + 3;
}
function stampFooters(doc, host, dateLine) {
	const total = doc.getNumberOfPages();
	for (let p = 1; p <= total; p++) {
		doc.setPage(p);
		doc.setDrawColor(...RULE);
		doc.setLineWidth(.25);
		doc.line(MARGIN_X, 285, 192, 285);
		doc.setFont("times", "italic");
		doc.setFontSize(8);
		doc.setTextColor(...MUTED);
		const left = pdfSafe(`NyayaDraft  ·  ${host}  ·  ${dateLine}`);
		doc.text(left, MARGIN_X, 290);
		doc.text(`Page ${p} of ${total}`, 192, 290, { align: "right" });
	}
}
var EXAMPLES = ["dakshis.com"];
function actionError(err, fallback) {
	const raw = err instanceof Error ? err.message : String(err ?? "");
	if (/too_big|Too big/i.test(raw)) return "A policy in this session was too long to send in one request. Tap the button again.";
	if (!raw || raw.length > 180 || raw.trim().startsWith("[") || raw.trim().startsWith("{")) return fallback;
	return raw;
}
var REFINEABLE = [
	{
		kind: "terms",
		hint: "CPA, no as-is waiver, Indian forum"
	},
	{
		kind: "privacy",
		hint: "DPDP notice, withdrawal, children"
	},
	{
		kind: "refund",
		hint: "Defect path + cancellation before dispatch"
	},
	{
		kind: "shipping",
		hint: "Dispatch SLA, risk, displayed estimates"
	}
];
function AuditPage() {
	const session = useAuditStore();
	const saveHistory = useDraftStore((s) => s.save);
	const [busy, setBusy] = (0, import_react.useState)("idle");
	const [pageTab, setPageTab] = (0, import_react.useState)("");
	const [refineTab, setRefineTab] = (0, import_react.useState)("terms");
	const working = busy !== "idle";
	async function research(url = session.urlInput) {
		const target = url.trim();
		if (target.length < 4) {
			toast.error("Paste a store address — for example dakshis.com");
			return;
		}
		session.setUrlInput(target);
		setBusy("research");
		try {
			const result = await researchStoreFn({ data: { url: target } });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setResearch({
				origin: result.origin,
				host: result.host,
				homeTitle: result.homeTitle,
				pages: result.pages,
				missing: result.missing,
				hints: result.hints
			});
			setPageTab(result.pages[0]?.kind ?? "");
			if (result.pages.length === 0) toast.error("No policy pages were readable. The store may block fetches.");
			else toast.success(`Read ${result.pages.length} legal page${result.pages.length === 1 ? "" : "s"} on ${result.host}`);
		} finally {
			setBusy("idle");
		}
	}
	async function audit() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("audit");
		try {
			const result = await auditStoreFn({ data: {
				origin: session.origin,
				host: session.host,
				homeTitle: session.homeTitle,
				hints: session.hints ?? void 0,
				pages: session.pages.map((p) => ({
					kind: p.kind,
					label: p.label,
					url: p.url,
					title: p.title,
					text: p.text
				})),
				missing: session.missing
			} });
			if (!result.ok) {
				toast.error(result.error);
				session.setFindings("", result.citations);
				return;
			}
			session.setFindings(result.text, result.citations);
			toast.success("Audit complete. Review the gaps, then rewrite a policy.");
		} finally {
			setBusy("idle");
		}
	}
	async function refine(kind) {
		if (!session.findings) {
			toast.error("Run the Indian-law audit first so the rewrite has findings to use.");
			return;
		}
		const page = session.pages.find((p) => p.kind === kind || kind === "privacy" && p.kind === "consent");
		setBusy(kind);
		try {
			const answered = [...Object.entries(session.briefAnswers), ...Object.entries(session.answers)].filter(([, v]) => v.trim()).map(([id, answer]) => `${id}: ${answer}`).join("\n");
			const result = await refineStorePolicyFn({ data: {
				kind,
				origin: session.origin,
				host: session.host,
				findings: session.findings,
				currentPolicy: page?.text ?? "",
				extraInstruction: answered ? `Merchant questionnaire answers (use these instead of [TO BE COMPLETED] where they fit):\n${answered}` : void 0
			} });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setRefined({
				kind,
				slug: result.slug,
				title: result.title,
				raw: result.text
			});
			setRefineTab(kind);
			toast.success(`Revised ${POLICY_LABELS[kind]} drafted.`);
		} finally {
			setBusy("idle");
		}
	}
	function improvedPayload() {
		return {
			origin: session.origin,
			host: session.host,
			homeTitle: session.homeTitle,
			hints: session.hints ?? void 0,
			pages: session.pages.map((p) => ({
				kind: p.kind,
				label: p.label,
				url: p.url,
				title: p.title,
				text: p.text.slice(0, 9e3)
			})),
			missing: session.missing,
			findings: session.findings?.slice(0, 8e3) || void 0,
			gapsPaper: session.gapsPaper?.slice(0, 8e3) || void 0,
			questionnairePaper: session.questionsPaper?.slice(0, 8e3) || void 0,
			clientBrief: session.briefPaper?.slice(0, 8e3) || void 0,
			implementPaper: session.implementPaper?.slice(0, 8e3) || void 0,
			answers: [...Object.entries(session.briefAnswers), ...Object.entries(session.answers)].filter(([, v]) => v.trim()).slice(0, 24).map(([id, answer]) => ({
				id: id.slice(0, 40),
				title: id.slice(0, 200),
				answer: answer.slice(0, 800)
			})),
			refined: session.refined.slice(0, 6).map((r) => ({
				kind: r.kind,
				title: r.title.slice(0, 200),
				text: (parseDraftOutput(r.raw).draft || r.raw).slice(0, 8e3)
			}))
		};
	}
	async function findGaps() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("gaps");
		try {
			const result = await findPolicyGapsFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setGapsPaper(result.text, result.citations);
			toast.success(session.refined.length ? "Gap register updated against the live pages and your rewrites." : "Gap register ready. Rewrite a policy, then run this again to see what closed.");
		} catch (err) {
			toast.error(actionError(err, "Could not score remaining gaps."));
		} finally {
			setBusy("idle");
		}
	}
	async function writeSelling() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("selling");
		try {
			const result = await writeSellingPointsFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setSellingPaper(result.text, result.citations);
			toast.success("Selling points drafted from the improved (or live) text.");
		} catch (err) {
			toast.error(actionError(err, "Could not write selling points."));
		} finally {
			setBusy("idle");
		}
	}
	async function writeQuestions() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("questions");
		try {
			const result = await writeQuestionnaireFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setQuestionsPaper(result.text, result.citations);
			toast.success("Legal-facts questionnaire ready.");
		} catch (err) {
			toast.error(actionError(err, "Could not build the legal-facts questionnaire."));
		} finally {
			setBusy("idle");
		}
	}
	async function writeBrief() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("brief");
		try {
			const result = await writeClientBriefFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setBriefPaper(result.text, result.citations);
			toast.success("Client-needs brief ready. Send it, or fill it on the call.");
		} catch (err) {
			toast.error(actionError(err, "Could not draft the client brief."));
		} finally {
			setBusy("idle");
		}
	}
	async function writeImplement() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("implement");
		try {
			const result = await writeImplementationsFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setImplementPaper(result.text, result.citations);
			toast.success("Implementation playbook drafted for this store.");
		} catch (err) {
			toast.error(actionError(err, "Could not draft the playbook."));
		} finally {
			setBusy("idle");
		}
	}
	async function writeEmail() {
		if (!session.pages.length) {
			toast.error("Research the store first.");
			return;
		}
		setBusy("email");
		try {
			const result = await writeForwardEmailFn({ data: improvedPayload() });
			if (!result.ok) {
				toast.error(result.error);
				return;
			}
			session.setEmailPaper(result.text, result.citations);
			toast.success("Forward-ready emails drafted. Copy or open in your mail app.");
		} catch (err) {
			toast.error(actionError(err, "Could not draft the emails."));
		} finally {
			setBusy("idle");
		}
	}
	async function saveWord(opts) {
		if (!opts.body.trim()) return;
		try {
			await downloadDraftDocx({
				title: opts.title,
				subtitle: opts.subtitle ?? session.host,
				host: session.host,
				body: opts.body,
				filename: `NyayaDraft-${session.host.replace(/[^\w.-]+/g, "-")}-${opts.stem}.docx`
			});
			toast.success("Word file downloaded — you can edit it in Word or Google Docs.");
		} catch {
			toast.error("Could not build the Word file.");
		}
	}
	async function saveMasterPdf() {
		if (!session.origin) {
			toast.error("Research a store first.");
			return;
		}
		setBusy("pdf");
		try {
			const profile = [
				`Store: ${session.homeTitle || session.host}`,
				`Host: ${session.host}`,
				`URL: ${session.origin}`,
				session.hints?.legalName ? `Legal name: ${session.hints.legalName}` : "",
				session.hints?.gstins?.[0] ? `GSTIN: ${session.hints.gstins.join(", ")}` : "",
				session.hints?.emails?.length ? `Emails: ${session.hints.emails.join(", ")}` : "",
				session.hints?.phones?.length ? `Phones: ${session.hints.phones.join(", ")}` : "",
				`Pages read: ${session.pages.length}`,
				session.missing.length ? `Missing from crawl: ${session.missing.map((m) => m.label).join(", ")}` : "Required policy pages were all found.",
				"",
				"Pages",
				...session.pages.map((p) => `- ${p.label} — ${p.title}\n  ${p.url} (${p.chars.toLocaleString("en-IN")} characters)`)
			].filter((line) => line !== "").join("\n");
			const sections = [
				session.briefPaper ? {
					title: "Client needs brief",
					body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers)
				} : null,
				session.questionsPaper ? {
					title: "Legal facts questionnaire",
					body: applyQuestionnaireAnswers(session.questionsPaper, session.answers)
				} : null,
				session.findings ? {
					title: "Indian-law audit",
					body: session.findings
				} : null,
				...session.refined.map((r) => {
					const parsed = parseDraftOutput(r.raw);
					const notes = parsed.notes ? `\n\n## Drafting notes\n${parsed.notes}` : "";
					const auth = parsed.authorities ? `\n\n## Authorities relied on\n${parsed.authorities}` : "";
					return {
						title: `Revised policy — ${r.title}`,
						body: `${parsed.draft}${notes}${auth}`
					};
				}),
				session.gapsPaper ? {
					title: "Gap register",
					body: session.gapsPaper
				} : null,
				session.sellingPaper ? {
					title: "Selling points",
					body: session.sellingPaper
				} : null,
				session.implementPaper ? {
					title: "Implementation playbook",
					body: session.implementPaper
				} : null,
				session.emailPaper ? {
					title: "Forwarding emails",
					body: session.emailPaper
				} : null,
				session.citations.length ? {
					title: "Authorities retrieved",
					body: session.citations.map((c, i) => `### ${i + 1}. ${c.citation} — ${c.title}\n${c.statute}\n${c.text}`).join("\n\n")
				} : null,
				session.pages.length ? {
					title: "Appendix — live pages as crawled",
					body: session.pages.map((p) => `## ${p.label}\n${p.title}\n${p.url}\n\n${p.text}`).join("\n\n")
				} : null
			].filter((s) => Boolean(s));
			await downloadMasterPdf({
				host: session.host,
				homeTitle: session.homeTitle || session.host,
				origin: session.origin,
				profile,
				sections
			});
			toast.success("Master PDF downloaded — every paper from this store in one file.");
		} catch {
			toast.error("Could not build the master PDF.");
		} finally {
			setBusy("idle");
		}
	}
	function saveFindings() {
		if (!session.findings) return;
		saveHistory({
			id: crypto.randomUUID(),
			slug: "store-audit",
			title: `Store audit — ${session.host}`,
			createdAt: Date.now(),
			facts: { website: session.origin },
			draftText: session.findings,
			notes: session.missing.map((m) => m.label).join(", "),
			citations: session.citations
		});
		toast.success("Audit saved on this device.");
	}
	function saveRefined(kind) {
		const item = session.refined.find((r) => r.kind === kind);
		if (!item) return;
		const parsed = parseDraftOutput(item.raw);
		saveHistory({
			id: crypto.randomUUID(),
			slug: item.slug,
			title: `${item.title} — ${session.host}`,
			createdAt: Date.now(),
			facts: { website: session.origin },
			draftText: parsed.draft,
			notes: parsed.notes,
			citations: session.citations
		});
		toast.success("Revised policy saved on this device.");
	}
	function savePaper(slug, title, body) {
		if (!body) return;
		saveHistory({
			id: crypto.randomUUID(),
			slug,
			title: `${title} — ${session.host}`,
			createdAt: Date.now(),
			facts: { website: session.origin },
			draftText: body,
			notes: "",
			citations: session.citations
		});
		toast.success("Saved on this device.");
	}
	const activePage = session.pages.find((p) => p.kind === pageTab) ?? session.pages[0];
	const activeRefined = session.refined.find((r) => r.kind === refineTab);
	const parsedRefined = (0, import_react.useMemo)(() => activeRefined ? parseDraftOutput(activeRefined.raw) : null, [activeRefined]);
	const questions = (0, import_react.useMemo)(() => parseStoreQuestions(session.questionsPaper), [session.questionsPaper]);
	const briefQuestions = (0, import_react.useMemo)(() => parseStoreQuestions(session.briefPaper), [session.briefPaper]);
	const emails = (0, import_react.useMemo)(() => parseForwardEmails(session.emailPaper), [session.emailPaper]);
	const briefEmails = (0, import_react.useMemo)(() => parseForwardEmails(session.briefPaper), [session.briefPaper]);
	const answeredCount = questions.filter((q) => session.answers[q.id]?.trim()).length;
	const briefAnswered = briefQuestions.filter((q) => session.briefAnswers[q.id]?.trim()).length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-4 py-10 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[12px] tracking-[0.2em] text-muted uppercase",
					children: "Live store · retrieve · rewrite"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-medium tracking-tight",
					children: "Audit a store’s policies"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 max-w-2xl text-[15px] leading-relaxed text-muted",
					children: "Paste a store URL. First NyayaDraft writes a client-needs brief you can email to the merchant — what they want the work to achieve, which promises they will honour, what “done” looks like. Then it scores the live pages, fills legal facts, rewrites policies, and packs every paper into one master PDF."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-6 flex flex-col gap-3 sm:flex-row",
					onSubmit: (e) => {
						e.preventDefault();
						research();
					},
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: session.urlInput,
							onChange: (e) => session.setUrlInput(e.target.value),
							placeholder: "dakshis.com",
							className: "pl-10",
							autoCapitalize: "none",
							autoCorrect: "off",
							spellCheck: false
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "submit",
						disabled: working,
						className: "sm:w-44",
						children: [busy === "research" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { className: "size-4" }), "Research site"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-3 flex flex-wrap items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] text-muted",
						children: "Try"
					}), EXAMPLES.map((ex) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "rounded-full bg-surface-2 px-3 py-1 text-[12px] text-muted hover:text-ink",
						onClick: () => {
							session.setUrlInput(ex);
							research(ex);
						},
						children: ex
					}, ex))]
				})
			]
		})
	}), !session.origin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "mx-auto max-w-6xl px-4 py-16 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display text-xl text-muted",
			children: "No store loaded yet. Research a URL to see the live policies."
		})
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "muted",
						children: session.host
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-medium tracking-tight",
						children: session.homeTitle || session.host
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							session.pages.length,
							" page",
							session.pages.length === 1 ? "" : "s",
							" read",
							session.missing.length ? ` · missing ${session.missing.map((m) => m.label).join(", ")}` : ""
						]
					}),
					session.hints ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-2xl text-[13px] text-muted",
						children: [
							session.hints.legalName ? `${session.hints.legalName}. ` : "",
							session.hints.gstins?.[0] ? `GSTIN ${session.hints.gstins[0]}. ` : "",
							session.hints.emails?.[0] ?? "",
							session.hints.phones?.[0] ? ` · ${session.hints.phones[0]}` : ""
						]
					}) : null
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void saveMasterPdf(),
							disabled: working,
							children: [busy === "pdf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileDown, { className: "size-4" }), "Download master PDF"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void audit(),
							disabled: working || !session.pages.length,
							children: [busy === "audit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), "Audit against Indian law"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void findGaps(),
							disabled: working || !session.pages.length,
							children: [busy === "gaps" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4" }), "Find remaining gaps"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void writeBrief(),
							disabled: working || !session.pages.length,
							children: [busy === "brief" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-4" }), "Client brief"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void writeSelling(),
							disabled: working || !session.pages.length,
							children: [busy === "selling" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4" }), "Write selling points"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void writeQuestions(),
							disabled: working || !session.pages.length,
							children: [busy === "questions" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPen, { className: "size-4" }), "Legal facts"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void writeImplement(),
							disabled: working || !session.pages.length,
							children: [busy === "implement" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }), "Better implementations"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: () => void writeEmail(),
							disabled: working || !session.pages.length,
							children: [busy === "email" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), "Forwarding emails"]
						}),
						session.findings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							onClick: saveFindings,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Save audit"]
						}) : null
					]
				})]
			}),
			session.pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				value: pageTab || session.pages[0].kind,
				onValueChange: setPageTab,
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
					className: "h-auto w-full flex-wrap justify-start gap-1",
					children: session.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: p.kind,
						children: POLICY_LABELS[p.kind] ?? p.label
					}, p.kind + p.url))
				}), session.pages.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: p.kind,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-medium",
								children: p.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: p.url,
								target: "_blank",
								rel: "noreferrer",
								className: "text-[12px] break-all text-primary hover:underline",
								children: p.url
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "outline",
								children: [p.chars.toLocaleString("en-IN"), " chars"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
							className: "mt-4 max-h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
								className: "font-serif text-[14px] leading-relaxed whitespace-pre-wrap text-ink",
								children: p.text
							})
						})]
					})
				}, p.url))]
			}) : null,
			session.pages.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Client brief",
						ready: Boolean(session.briefPaper),
						readyLabel: briefAnswered ? `${briefAnswered} answered` : "Ready",
						idleLabel: "Send to the merchant",
						body: "What this client wants the work to achieve — deliverables, promises they will honour, claims they will kill, support model, what “done” looks like. Email it as Word, or fill it on the call.",
						busy: busy === "brief",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Handshake, { className: "size-4" }),
						cta: session.briefPaper ? "Refresh client brief" : "Build client brief",
						onClick: () => void writeBrief()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Legal facts",
						ready: Boolean(session.questionsPaper),
						readyLabel: answeredCount ? `${answeredCount} answered` : "Ready",
						idleLabel: "Officer, GST, unboxing",
						body: "The blanks a policy cannot invent — named grievance officer, who reads support@, unboxing as evidence, COD fee. Use after the client brief.",
						busy: busy === "questions",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardPen, { className: "size-4" }),
						cta: session.questionsPaper ? "Refresh legal facts" : "Build legal facts",
						onClick: () => void writeQuestions()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Find remaining gaps",
						ready: Boolean(session.gapsPaper),
						readyLabel: "Ready",
						idleLabel: "After research",
						body: "Scores live pages against any rewrite in this session. Severity, the Indian-law hook, and a paste-ready sentence for each hole — including banner-versus-policy contradictions.",
						busy: busy === "gaps",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "size-4" }),
						cta: session.gapsPaper ? "Re-score gaps" : "Find remaining gaps",
						onClick: () => void findGaps()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Better implementations",
						ready: Boolean(session.implementPaper),
						readyLabel: "Ready",
						idleLabel: "Shopify playbook",
						body: "Where to put the text: Settings → Policies, footer imprint, PDP Legal Metrology, DPDP notice at collection, checkout lines that match the refund page.",
						busy: busy === "implement",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Wrench, { className: "size-4" }),
						cta: session.implementPaper ? "Refresh playbook" : "Suggest implementations",
						onClick: () => void writeImplement()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Write selling points",
						ready: Boolean(session.sellingPaper),
						readyLabel: "Ready",
						idleLabel: "From improved text",
						body: "Checkout, PDP, WhatsApp and ad lines that match a clause you actually have. Unsafe claims go on a do-not-publish list.",
						busy: busy === "selling",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Megaphone, { className: "size-4" }),
						cta: session.sellingPaper ? "Rewrite selling points" : "Write selling points",
						onClick: () => void writeSelling()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ActionCard, {
						title: "Forwarding emails",
						ready: Boolean(session.emailPaper),
						readyLabel: "Ready",
						idleLabel: "Copy and send",
						body: "Three letters in your name: one to the developer, one to your advocate, one customer notice to send only after the new pages are live.",
						busy: busy === "email",
						working,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }),
						cta: session.emailPaper ? "Rewrite emails" : "Write forwarding emails",
						onClick: () => void writeEmail()
					})
				]
			}) : null,
			briefQuestions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] tracking-[0.16em] text-muted uppercase",
							children: ["Client needs · ", session.host]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl font-medium tracking-tight",
							children: "Client brief"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted",
							children: "Send this to the merchant, or fill it while you are on the call. HIGH answers drive the rewrites, selling points and the developer email — not a generic D2C checklist."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								variant: "muted",
								children: [
									briefAnswered,
									"/",
									briefQuestions.length,
									" answered"
								]
							}),
							briefEmails[0] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: mailtoHref(briefEmails[0].to, briefEmails[0].subject, briefEmails[0].body),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), "Email brief to client"]
								})
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								size: "sm",
								onClick: () => void saveWord({
									title: `Client needs brief — ${session.host}`,
									subtitle: "For the merchant to complete",
									body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers),
									stem: "client-brief"
								}),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Word"]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-5",
					children: briefQuestions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-border pt-4 first:border-t-0 first:pt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[12px] text-muted",
										children: q.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: q.severity === "HIGH" ? "default" : "muted",
										children: q.severity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-medium",
										children: q.title
									})
								]
							}),
							q.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[13px] leading-relaxed text-muted",
								children: q.why
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `c-${q.id}`,
								className: "sr-only",
								children: q.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `c-${q.id}`,
								className: "mt-3",
								value: session.briefAnswers[q.id] ?? "",
								onChange: (e) => session.setBriefAnswer(q.id, e.target.value),
								placeholder: q.hint || "What does this client want — in their words."
							})
						]
					}, q.id))
				})]
			}) : null,
			questions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[12px] tracking-[0.16em] text-muted uppercase",
							children: ["Legal facts · ", session.host]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-1 font-display text-2xl font-medium tracking-tight",
							children: "Legal facts"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 max-w-2xl text-sm text-muted",
							children: "Blanks a policy cannot invent. Fill after the client brief."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "muted",
						children: [
							answeredCount,
							"/",
							questions.length,
							" answered"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-5",
					children: questions.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-t border-border pt-4 first:border-t-0 first:pt-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono text-[12px] text-muted",
										children: q.id
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
										variant: q.severity === "HIGH" ? "default" : "muted",
										children: q.severity
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-display text-lg font-medium",
										children: q.title
									})
								]
							}),
							q.why ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[13px] leading-relaxed text-muted",
								children: q.why
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: `q-${q.id}`,
								className: "sr-only",
								children: q.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: `q-${q.id}`,
								className: "mt-3",
								value: session.answers[q.id] ?? "",
								onChange: (e) => session.setAnswer(q.id, e.target.value),
								placeholder: q.hint || "Type the answer this store can stand behind."
							})
						]
					}, q.id))
				})]
			}) : null,
			session.findings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Audit — ${session.host}`,
					body: session.findings
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitationPanel, {
						citations: session.citations,
						title: "Authorities retrieved"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						onClick: () => void saveWord({
							title: `Store policy audit — ${session.host}`,
							subtitle: "Indian-law gap analysis",
							body: session.findings,
							stem: "audit"
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Word"]
					})]
				})]
			}) : null,
			session.findings ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-medium tracking-tight",
						children: "Rewrite a policy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-2xl text-sm text-muted",
						children: "Each rewrite is grounded in the audit and the live page. We keep lawful commercial terms and strip unfair-contract residue."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 grid gap-3 sm:grid-cols-2",
						children: REFINEABLE.map((item) => {
							const have = session.refined.some((r) => r.kind === item.kind);
							const live = session.pages.some((p) => p.kind === item.kind || item.kind === "privacy" && p.kind === "consent");
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-border)]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-start justify-between gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-display text-lg font-medium",
											children: POLICY_LABELS[item.kind]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
											variant: have ? "default" : "muted",
											children: have ? "Drafted" : live ? "Live page" : "Missing"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 flex-1 text-[13px] text-muted",
										children: item.hint
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										className: "mt-4",
										variant: have ? "outline" : "default",
										disabled: working,
										onClick: () => void refine(item.kind),
										children: [busy === item.kind ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WandSparkles, { className: "size-4" }), have ? "Redraft" : live ? "Revise this page" : "Draft from profile"]
									})
								]
							}, item.kind);
						})
					}),
					session.refined.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
						value: refineTab,
						onValueChange: setRefineTab,
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList, {
							className: "h-auto flex-wrap justify-start gap-1",
							children: session.refined.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
								value: r.kind,
								children: r.title
							}, r.kind))
						}), session.refined.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
							value: r.kind,
							children: parsedRefined && r.kind === refineTab ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
									title: r.title,
									body: parsedRefined.draft
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col gap-2 xl:w-52",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => {
												navigator.clipboard.writeText(parsedRefined.draft);
												toast.success("Copied.");
											},
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => void saveWord({
												title: r.title,
												subtitle: `${session.host} — customer-facing policy`,
												body: parsedRefined.draft,
												stem: r.kind
											}),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Word"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											onClick: () => saveRefined(r.kind),
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Save"]
										})
									]
								})]
							}) : null
						}, r.kind))]
					}) : null
				]
			}) : null,
			session.gapsPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Gap register — ${session.host}`,
					body: session.gapsPaper
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
					title: `Gap register — ${session.host}`,
					body: session.gapsPaper,
					stem: "gaps",
					host: session.host,
					onWord: () => void saveWord({
						title: `Gap register — ${session.host}`,
						subtitle: "Remaining holes after live pages and rewrites",
						body: session.gapsPaper,
						stem: "gaps"
					}),
					onSave: () => savePaper("store-gaps", "Gap register", session.gapsPaper)
				})]
			}) : null,
			session.sellingPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Selling points — ${session.host}`,
					body: session.sellingPaper
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
					title: `Selling points — ${session.host}`,
					body: session.sellingPaper,
					stem: "selling-points",
					host: session.host,
					onWord: () => void saveWord({
						title: `Selling points — ${session.host}`,
						subtitle: "Checkout, PDP and ad lines tied to a clause",
						body: session.sellingPaper,
						stem: "selling-points"
					}),
					onSave: () => savePaper("store-selling", "Selling points", session.sellingPaper)
				})]
			}) : null,
			session.briefPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Client brief — ${session.host}`,
					body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
					title: `Client needs brief — ${session.host}`,
					body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers),
					stem: "client-brief",
					host: session.host,
					onWord: () => void saveWord({
						title: `Client needs brief — ${session.host}`,
						subtitle: "What this merchant wants the work to achieve",
						body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers),
						stem: "client-brief"
					}),
					onSave: () => savePaper("store-brief", "Client brief", applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers))
				})]
			}) : null,
			session.questionsPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Legal facts — ${session.host}`,
					body: applyQuestionnaireAnswers(session.questionsPaper, session.answers)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
					title: `Legal facts — ${session.host}`,
					body: applyQuestionnaireAnswers(session.questionsPaper, session.answers),
					stem: "legal-facts",
					host: session.host,
					onWord: () => void saveWord({
						title: `Legal facts — ${session.host}`,
						subtitle: "Blanks a policy cannot invent",
						body: applyQuestionnaireAnswers(session.questionsPaper, session.answers),
						stem: "legal-facts"
					}),
					onSave: () => savePaper("store-questions", "Legal facts", applyQuestionnaireAnswers(session.questionsPaper, session.answers))
				})]
			}) : null,
			session.implementPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Implementations — ${session.host}`,
					body: session.implementPaper
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
					title: `Implementation playbook — ${session.host}`,
					body: session.implementPaper,
					stem: "implementations",
					host: session.host,
					onWord: () => void saveWord({
						title: `Implementation playbook — ${session.host}`,
						subtitle: "Where the improved text goes on the live site",
						body: session.implementPaper,
						stem: "implementations"
					}),
					onSave: () => savePaper("store-implement", "Implementations", session.implementPaper)
				})]
			}) : null,
			session.emailPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftPaper, {
					title: `Forwarding emails — ${session.host}`,
					body: session.emailPaper
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2 xl:w-52",
					children: [emails.slice(0, 3).map((em) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: mailtoHref(em.to, em.subject, em.body),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" }), /developer/i.test(em.heading) ? "Open developer mail" : /advocate|ca/i.test(em.heading) ? "Open advocate mail" : "Open customer notice"]
						})
					}, em.heading)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PaperTools, {
						title: `Forwarding emails — ${session.host}`,
						body: session.emailPaper,
						stem: "emails",
						host: session.host,
						stacked: false,
						onWord: () => void saveWord({
							title: `Forwarding emails — ${session.host}`,
							subtitle: "Copy into Gmail, Outlook or WhatsApp",
							body: session.emailPaper,
							stem: "emails"
						}),
						onSave: () => savePaper("store-email", "Forwarding emails", session.emailPaper)
					})]
				})]
			}) : null,
			activePage && !session.findings && !session.gapsPaper && !session.questionsPaper && !session.briefPaper ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-sm text-muted",
				children: "Next: build the client brief and email it to the merchant. Then legal facts, audit, and Word downloads."
			}) : null
		]
	})] }) });
}
function ActionCard({ title, ready, readyLabel, idleLabel, body, busy, working, icon, cta, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-border)]",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-lg font-medium",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: ready ? "default" : "muted",
					children: ready ? readyLabel : idleLabel
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 flex-1 text-[13px] text-muted",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				className: "mt-4",
				variant: ready ? "outline" : "default",
				disabled: working,
				onClick,
				children: [busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }) : icon, cta]
			})
		]
	});
}
function PaperTools({ body, onSave, onWord, stacked = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: stacked ? "flex flex-col gap-2 xl:w-52" : "flex flex-col gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: () => {
					navigator.clipboard.writeText(body);
					toast.success("Copied.");
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), "Copy"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: onWord,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download Word"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				onClick: onSave,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: "size-4" }), "Save"]
			})
		]
	});
}
//#endregion
export { AuditPage as component };
