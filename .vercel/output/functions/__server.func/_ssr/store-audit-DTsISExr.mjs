import { n as createServerFn } from "./ssr.mjs";
import { a as object, n as array, s as string, t as _enum } from "../_libs/zod.mjs";
import { r as getTemplate } from "./templates-7fivPM6Q.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-audit-DTsISExr.js
async function chat(options) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI drafting is not available in this environment."
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			messages: options.messages,
			max_tokens: options.maxTokens,
			temperature: options.temperature ?? .2
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `The drafting model returned an error (${res.status}).`
	};
	return {
		ok: true,
		text: (await res.json()).choices?.[0]?.message?.content ?? ""
	};
}
function formatAuthorities(chunks) {
	return chunks.map((c, i) => {
		const note = c.note ? `\nDrafting note: ${c.note}` : "";
		return `[${i + 1}] ${c.citation} — ${c.title} (${c.statute})\n${c.text}${note}`;
	}).join("\n\n");
}
var SYSTEM_AUDIT = `You are NyayaDraft's store-policy counsel. You read the live pages of an Indian (or India-selling) online store and audit them against current Indian law: Consumer Protection Act 2019, Consumer Protection (E-Commerce) Rules 2020, Digital Personal Data Protection Act 2023, Sale of Goods Act implied conditions, IT Act § 79 / IT Rules 2021, Legal Metrology packaged-commodities display, and uncontroversial drafting practice.

Hard rules:
- Ground every legal point in the RETRIEVED AUTHORITIES. Never invent AIR/SCC citations.
- Do not invent facts, GSTIN, addresses, or a grievance officer name that is not in the pages.
- Distinguish (a) what the policy text says, (b) what the marketing chrome on the same page says, (c) what is missing.
- Flag Shopify/US template residue: 'as-is' warranties, exclusive foreign law, 'all sales final', GDPR legitimate interest, CCPA, SPDI Rules 2011 as if they were still the primary privacy statute.
- This is not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## STORE PROFILE
Bullet list of legal name, brand, address, GSTIN, email, phone, payments, shipping promises, return window, COD, territory — only where found. Write "not stated" otherwise.

## GAPS
Subheads for Terms, Privacy/consent, Refund/cancellation, Shipping, Grievance officer. Bullet the defects vs Indian law. Quote a short phrase from the live page when you criticise it.

## WHAT TO KEEP
Commercial terms that are lawful and should survive a rewrite (free shipping, COD, a 7-day window, Cashfree, etc.).

## AUTHORITIES RELIED ON
Bullets matching the retrieved set.

## DRAFTING NOTES
What a human advocate still needs (named grievance officer, address alignment with GST, unboxing-video as evidence not a condition precedent, etc.).`;
var KIND_TO_SLUG = {
	terms: "store-terms-of-service",
	privacy: "store-consent-policy",
	consent: "store-consent-policy",
	refund: "store-refund-policy",
	shipping: "store-shipping-policy"
};
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
function packStoreContext(data) {
	return {
		pagesBlock: data.pages.map((p) => `### ${p.label} — ${p.url}\nTitle: ${p.title}\n${p.text.slice(0, 6e3)}`).join("\n\n"),
		missing: data.missing?.length ? data.missing.map((m) => m.label).join(", ") : "none detected",
		hints: data.hints ? `Extracted hints (regex, verify): legalName=${data.hints.legalName ?? "—"} GSTIN=${(data.hints.gstins ?? []).join(", ") || "—"} email=${(data.hints.emails ?? []).join(", ") || "—"} phone=${(data.hints.phones ?? []).join(", ") || "—"}` : "",
		refinedBlock: data.refined?.length ? data.refined.map((r) => `### REVISED ${r.title} (${r.kind})\n${r.text.slice(0, 7e3)}`).join("\n\n") : "(no rewrite in this session yet — score the live pages only)",
		answersBlock: data.answers?.length ? data.answers.map((a) => `- ${a.id} ${a.title}: ${a.answer || "(blank)"}`).join("\n") : "(no client-brief or legal-fact answers yet)",
		briefBlock: data.clientBrief?.trim() ? data.clientBrief.slice(0, 6e3) : "(no client-needs brief in this session yet)"
	};
}
var SYSTEM_GAPS = `You are NyayaDraft's gap register for an Indian online store. Compare LIVE pages with any REVISED drafts the merchant has already generated in this session. The merchant is iterating — mark what the rewrite closed, and what is still open.

Hard rules:
- Ground every legal point in the RETRIEVED AUTHORITIES. Never invent AIR/SCC citations or case names.
- Do not invent GSTIN, officer names, addresses, or customer counts.
- Quote a short phrase from the live page when you criticise it.
- Flag banner-vs-policy contradictions (e.g. footer "Free return for 7 days" vs a ₹100 fee; "express worldwide" vs a domestic-only SLA; "100% authentic / energized / No.1 / X lakh customers" vs no proof).
- Unboxing video may be preferred evidence; it must not be a condition precedent that blocks a statutory defect claim.
- TOS "as-is", exclusive foreign forum, all-sales-final, GDPR/CCPA residue, SPDI Rules 2011 as the primary privacy statute: treat as open gaps unless a revised draft already removed them.
- This is not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## GAP REGISTER
Numbered items. Each item MUST use this shape:
### G1 — HIGH — Refund / return
**Live page says:** quoted phrase or "not stated"
**Improved draft says:** quoted clause, or "not yet rewritten"
**Problem:** one or two sentences naming the Indian-law hook (CPA 2019, E-Commerce Rules 2020, DPDP 2023, Legal Metrology, ASCI/misleading ads).
**Insert this sentence:** a paste-ready English sentence for the policy or banner.
Severity is HIGH, MEDIUM or LOW. Cover Terms, Privacy/consent, Refund/cancellation, Shipping, Grievance officer, Advertising/PDP claims, Cookies if relevant.

## CONTRADICTIONS
Banner, footer, FAQ or PDP vs the legal page. If none, write "None found in the crawled text."

## CLOSED BY REWRITE
What the revised drafts already fixed. If none, say so.

## STILL OPEN
Prioritised remaining work for the merchant, one line each.

## AUTHORITIES RELIED ON
Bullets matching the retrieved set only.

## DRAFTING NOTES
Named officer, GST alignment, proof needed before "No.1 / X lakh" claims, etc.`;
var SYSTEM_SELLING = `You are NyayaDraft's commercial editor for an Indian D2C store. Write selling points the merchant may put on checkout, product pages, WhatsApp and ads — but only where a live or REVISED policy clause actually supports the line.

Hard rules:
- A selling line is allowed only if a supporting clause exists in a REVISED draft, or (if that policy was not rewritten) in the live page AND it is not an open HIGH gap.
- If the claim is not supported, or is contradicted by a banner/fee/disclaimer gap, put it under DO NOT CLAIM UNTIL PROVEN — never under the publishable lists.
- Do not invent GSTIN, counts ("12 lakh customers"), rank ("India's No.1"), medical/spiritual results, "free returns" next to a handling fee, or "worldwide express" without an export SLA.
- Prefer precise, calm Indian-English. No emoji. No invented case law.
- Ground any legal colour in RETRIEVED AUTHORITIES. Never invent AIR/SCC citations.
- This is marketing copy, not a legal opinion.

Return EXACTLY these markdown sections:

## CHECKOUT / HEADER
3–6 short lines (max 18 words each) the merchant can paste under the logo, cart or checkout.

## PDP / WHATSAPP
5–8 lines for product FAQs and the first WhatsApp reply after an order question.

## ADS / REELS
4–6 safer alternatives to rank/volume/miracle claims.

## DO NOT CLAIM UNTIL PROVEN
Each bullet: the unsafe live claim → why it fails (CPA misleading / E-Commerce Rules / DPDP / no proof) → the condition that would make it usable.

## MATCH TABLE
Markdown table with columns: Selling line | Supporting clause (quote) | Source (Revised TOS / Live refund / etc.)

## AUTHORITIES RELIED ON
Retrieved set only.

## DRAFTING NOTES
What the merchant should publish first (imprint, named officer) before using the strongest trust lines.`;
var researchStoreFn_createServerFn_handler = createServerRpc({
	id: "4f7155dd2f550a8b28c4ab89c1fed1b1f906a61b4602753361f7341ef2dbd6e6",
	name: "researchStoreFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => researchStoreFn.__executeServer(opts));
var researchStoreFn = createServerFn({ method: "POST" }).validator((input) => researchInput.parse(input)).handler(researchStoreFn_createServerFn_handler, async ({ data }) => {
	try {
		const { researchStore } = await import("./scrape-rGH4cbh_.mjs");
		return {
			ok: true,
			...await researchStore(data.url)
		};
	} catch (err) {
		return {
			ok: false,
			error: err instanceof Error ? err.message : "Could not read that website."
		};
	}
});
var auditStoreFn_createServerFn_handler = createServerRpc({
	id: "7c381e5591386a541903c168e3accc2fa3b43d121ce5b60117a283708d0edc2a",
	name: "auditStoreFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => auditStoreFn.__executeServer(opts));
var auditStoreFn = createServerFn({ method: "POST" }).validator((input) => auditInput.parse(input)).handler(auditStoreFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `e-commerce rules 2020 unfair contract DPDP consent refund cancellation shipping grievance officer inventory ${data.pages.map((p) => `${p.label} ${p.title} ${p.text.slice(0, 400)}`).join("\n")}`,
		k: 10
	});
	const pagesBlock = data.pages.map((p) => `### ${p.label} — ${p.url}\nTitle: ${p.title}\n${p.text.slice(0, 7e3)}`).join("\n\n");
	const missing = data.missing?.length ? data.missing.map((m) => m.label).join(", ") : "none detected";
	const hints = data.hints ? `Extracted hints (regex, verify): legalName=${data.hints.legalName ?? "—"} GSTIN=${(data.hints.gstins ?? []).join(", ") || "—"} email=${(data.hints.emails ?? []).join(", ") || "—"} phone=${(data.hints.phones ?? []).join(", ") || "—"}` : "";
	const result = await chat({
		maxTokens: 2200,
		messages: [{
			role: "system",
			content: SYSTEM_AUDIT
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing from the crawl: ${missing}
${hints}

LIVE PAGE TEXT:
${pagesBlock}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var refineStorePolicyFn_createServerFn_handler = createServerRpc({
	id: "9349d6ebb66212266cbf9e0875c42504b4643a32eadc1fef1e8ee8b143e707ad",
	name: "refineStorePolicyFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => refineStorePolicyFn.__executeServer(opts));
var refineStorePolicyFn = createServerFn({ method: "POST" }).validator((input) => refineInput.parse(input)).handler(refineStorePolicyFn_createServerFn_handler, async ({ data }) => {
	const slug = KIND_TO_SLUG[data.kind];
	const template = getTemplate(slug);
	if (!template) return {
		ok: false,
		error: "Unknown policy type.",
		citations: []
	};
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `${template.ragQuery}\n${data.origin}\n${data.currentPolicy?.slice(0, 500) ?? ""}`,
		k: 8
	});
	const extra = data.extraInstruction?.trim() ? `\nAdditional instruction from the user: ${data.extraInstruction.trim()}` : "";
	const result = await chat({
		maxTokens: 3400,
		messages: [{
			role: "system",
			content: `You are NyayaDraft, rewriting a live Indian store policy so it can stand under the Consumer Protection Act 2019, E-Commerce Rules 2020, DPDP Act 2023 and related drafting practice.

Hard rules:
- Ground legal propositions in the RETRIEVED AUTHORITIES. Never invent case citations.
- This is a customer-facing policy with numbered clauses — not a pleading. No PRAYER.
- Preserve lawful commercial terms from the live page and the audit (windows, COD, free shipping, payment gateway, brand voice) unless they are unfair.
- Do not waive CPA remedies or DPDP rights. Do not use US 'as-is / all sales final / exclusive foreign forum' language. Consumer Commissions remain available. Governing law is India.
- Do not invent a grievance-officer name, GSTIN, CIN or address. If missing, insert a clearly marked [TO BE COMPLETED] placeholder.
- Do not copy large passages of the defective live policy; rewrite.

Instrument instructions:
${template.instructions}

Return EXACTLY three markdown sections:
## DRAFT
## AUTHORITIES RELIED ON
## DRAFTING NOTES`
		}, {
			role: "user",
			content: `Rewrite: ${template.title}
Store: ${data.host} (${data.origin})
${extra}

AUDIT FINDINGS (use STORE PROFILE and WHAT TO KEEP):
${(data.findings ?? "").slice(0, 8e3) || "(none)"}

CURRENT LIVE POLICY TEXT (to fix, not to clone):
${(data.currentPolicy ?? "").slice(0, 8e3) || "(this page was missing — draft a compliant policy from the profile)"}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits,
		slug: template.slug,
		title: template.title
	};
});
var findPolicyGapsFn_createServerFn_handler = createServerRpc({
	id: "b4e6719e87b0c179f560cf803195605155147dca549f3145d09eb556dddddbb7",
	name: "findPolicyGapsFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => findPolicyGapsFn.__executeServer(opts));
var findPolicyGapsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(findPolicyGapsFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `e-commerce rules grievance officer unfair contract DPDP consent refund cancellation unboxing shipping estimate misleading advertisement legal metrology ${data.pages.map((p) => `${p.label} ${p.text.slice(0, 280)}`).join("\n")}`,
		k: 10
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2400,
		messages: [{
			role: "system",
			content: SYSTEM_GAPS
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing from the crawl: ${ctx.missing}
${ctx.hints}

LIVE PAGE TEXT:
${ctx.pagesBlock}

REVISED DRAFTS IN THIS SESSION:
${ctx.refinedBlock}

PRIOR AUDIT (optional, may be empty):
${(data.findings ?? "").slice(0, 6e3) || "(none)"}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var writeSellingPointsFn_createServerFn_handler = createServerRpc({
	id: "a5fc8baeafad675aa0de68feea6f84486de09fb2a0583d9ffe6942d609e3475c",
	name: "writeSellingPointsFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => writeSellingPointsFn.__executeServer(opts));
var writeSellingPointsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(writeSellingPointsFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `consumer protection unfair trade practice misleading advertisement e-commerce rules refund shipping GSTIN grievance DPDP consent ${data.host} ${data.homeTitle ?? ""}`,
		k: 8
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2200,
		temperature: .3,
		messages: [{
			role: "system",
			content: SYSTEM_SELLING
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing: ${ctx.missing}
${ctx.hints}

LIVE PAGE TEXT:
${ctx.pagesBlock}

REVISED DRAFTS (prefer these as the "improved" source):
${ctx.refinedBlock}

CLIENT NEEDS BRIEF:
${ctx.briefBlock}

GAP REGISTER (optional):
${(data.gapsPaper ?? data.findings ?? "").slice(0, 7e3) || "(none — infer from live pages)"}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var SYSTEM_QUESTIONS = `You are NyayaDraft's intake counsel. Write a PERSONAL questionnaire for the human who owns or operates THIS store. The answers will complete [TO BE COMPLETED] blanks in policies, emails and Shopify implementation.

Hard rules:
- Ground legal "why" lines in RETRIEVED AUTHORITIES. Never invent AIR/SCC citations or case names.
- Do not invent GSTIN, officer names, addresses, FSSAI numbers or customer counts.
- Skip facts already fully stated on the live pages (if support@ is present, do not ask for an email — ask whether that inbox is the grievance channel and who reads it).
- Tailor to THIS catalogue and crawl: jewellery/spiritual claims, apparel sizes, food, electronics, COD, Shopify /policies/ URLs, WhatsApp, unboxing video, export, marketplace vs own checkout.
- Max 10 questions. Each must unlock a drafting or implementation need.
- This is not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## STORE READ
One short paragraph: what this business appears to sell, platform (Shopify if /policies/), and the two facts still blocking a publishable pack.

## QUESTIONS
Use this heading shape, nothing else:
### Q1 — HIGH — Named grievance officer
**Why we ask:** one sentence with the Indian-law hook.
**Good answer looks like:** the format you need (name, designation, email, phone, hours IST).
Cover, where relevant: grievance officer, GST legal-name match, children's data, WhatsApp/SMS consent, COD vs prepaid, export, unboxing video as evidence not a condition, size/exchange, FSSAI or Legal Metrology if the catalogue suggests it, miracle/rank claims, cookie banner vs privacy notice, return pickup vs customer-ship.

## HOW ANSWERS GET USED
Bullets: which policy clause, footer line, or email each answer will fill.

## AUTHORITIES RELIED ON
Retrieved set only.

## DRAFTING NOTES
What you will still have to mark [TO BE COMPLETED] if they skip a HIGH question.`;
var SYSTEM_BRIEF = `You are NyayaDraft writing a CLIENT-NEEDS questionnaire for a consultant who drafts Indian e-commerce policies FOR this merchant. The consultant will email this form to the store owner, or fill it on a discovery call.

This is NOT the legal-facts form. Do not ask for grievance-officer name, GSTIN, CIN, or registered address — those belong on the other questionnaire.

Ask what the CLIENT wants the work to achieve, which promises they will actually honour, and what "done" looks like for them. Every question must be specific to THIS live store (catalogue, banners, fees, claims, COD, unboxing, spiritual/rank language, Shopify /policies/ URLs). A generic D2C checklist fails.

Hard rules:
- Ground any legal "why" in RETRIEVED AUTHORITIES. Never invent AIR/SCC citations.
- Do not invent facts, officer names, or customer counts.
- Write questions in the second person to the store owner ("What do you want…").
- Max 10 questions. HIGH = blocks a useful draft this week.
- This is not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## STORE READ
4–6 lines: what they sell, who the buyer appears to be, the commercial fights visible on the live pages (fees vs banners, claims, COD, returns), and what a consultant still cannot know without asking them.

## QUESTIONS
Use this heading shape only:
### C1 — HIGH — What this engagement must deliver
**Why we ask:** one sentence (business + Indian-law hook where relevant).
**Good answer looks like:** the format you need.
Cover, tailored to THIS store:
- Deliverable this week (full pack vs refund-only vs ads cleanup vs developer instructions)
- Who the customer is and what they must feel at checkout
- Promises they will actually honour (return window, pickup vs customer-ship, COD, free shipping) vs live banners
- Which live claims must survive and which they will kill (rank, volume, wellness/spiritual, "free return")
- Support model: WhatsApp vs email vs phone; hours; Hindi / English / Gujarati
- Return / RTO pain they want the policy to reduce
- Catalogue risk they accept (kids, food, jewellery, wellness)
- Marketplaces vs own site; export
- Brand voice (calm / premium / devout / playful) and words they forbid
- What "done" looks like in 7 days

## EMAIL TO THE CLIENT
**To:** extracted support/info email, or [client@…]
**Subject:**
**Body:** a complete email the consultant can forward today. First person as the consultant. Name the live store. Mention 2–3 concrete issues you already saw on their pages so they know this is not a generic form. Ask them to answer the HIGH items in the attached Word questionnaire (or reply under each heading). No emoji. No invented legal result.

## HOW I WILL USE YOUR ANSWERS
One bullet per question: which policy, selling line, or Shopify change it will drive.

## AUTHORITIES RELIED ON
Retrieved set only.

## DRAFTING NOTES
What the consultant can still draft if the client only answers the HIGH items.`;
var SYSTEM_IMPLEMENT = `You are NyayaDraft's implementation counsel for an Indian D2C / Shopify store. Do not rewrite the policies again. Tell the merchant WHERE to put the improved text and which live chrome to change so the site matches the law.

Hard rules:
- Infer the platform from URLs. "/policies/" means Shopify admin → Settings → Policies. Give that path. If not Shopify, give generic CMS steps.
- Ground the "why" in RETRIEVED AUTHORITIES. Never invent case law.
- Use questionnaire answers when present. If a HIGH fact is still blank, keep [TO BE COMPLETED] — do not invent a name.
- Flag better implementations than the live site: named officer on every footer (not buried in TOS), DPDP notice at collection not only in a policy URL, cookie banner that matches the privacy page, Legal Metrology on the PDP not a PDF, unboxing video as preferred evidence not a condition precedent, checkout lines that match the refund page (no "free return" next to a ₹100 fee).
- Paste-ready snippets in English the merchant can drop into Shopify.
- This is an operations playbook, not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## BETTER IMPLEMENTATIONS
Numbered items in this shape:
### I1 — HIGH — Homepage imprint
**Where on the site:** footer of every template / checkout / PDP
**Shopify / admin path:** Settings → Policies, or Online Store → Themes → Edit footer, as applicable
**Do this:** concrete steps, 2–6 lines
**Paste this:** a short snippet, or "use the revised [policy] clause X"
**Why:** Indian-law hook from the retrieved set
**Done when:** a test the merchant can perform in an incognito window
Cover imprint, grievance officer, DPDP notice + withdrawal, cookies, refund/checkout contradiction, shipping estimate display, Legal Metrology on PDP, WhatsApp consent, ads/PDP claims, replacing Shopify US residue.

## SEQUENCE
The order to publish so the store is never more exposed than today (usually: imprint + officer → refund/shipping match banners → privacy/DPDP → TOS last).

## AUTHORITIES RELIED ON
Retrieved set only.

## DRAFTING NOTES
Theme-app-extension vs policy URL, and what still needs a human advocate.`;
var SYSTEM_EMAIL = `You are NyayaDraft's correspondence clerk. Write emails the merchant can copy and forward today. Write in the first person as the store owner/operator (use the legal name if extracted; otherwise the brand/host). Indian English, calm, specific. No emoji. No invented case law, GSTIN, or officer names — use questionnaire answers, or [TO BE COMPLETED].

Hard rules:
- Ground any legal colour in RETRIEVED AUTHORITIES.
- **To:** prefer a real extracted email if it looks like support/info/hello; otherwise a labelled placeholder such as [developer@…]
- Email 1 is to the web developer / Shopify partner: replace live policy pages with the attached Word drafts, then follow the implementation sequence.
- Email 2 is to the merchant's advocate or CA: review before publish, list HIGH gaps still open.
- Email 3 is an optional customer notice to send ONLY after the new pages are live — no overclaim, no "now 100% compliant".
- This is not a solicitor-client opinion.

Return EXACTLY these markdown sections:

## EMAIL 1 — TO YOUR DEVELOPER
**To:**
**Subject:**
**Body:** a complete email, ready to forward, referring to attached Word files (terms, privacy, refund, shipping, gap register, implementation playbook). List the three changes they must not skip.

## EMAIL 2 — TO YOUR ADVOCATE / CA
**To:**
**Subject:**
**Body:** covering note asking for review of the HIGH items before the developer publishes.

## EMAIL 3 — CUSTOMER NOTICE (send after you publish)
**To:** customers / WhatsApp broadcast (optional)
**Subject:**
**Body:** short, honest notice that policies were updated; point to the live URLs; do not claim a legal result.

## AUTHORITIES RELIED ON
Retrieved set only.

## DRAFTING NOTES
Who still has to sign, and not to send Email 3 before the pages are live.`;
var writeQuestionnaireFn_createServerFn_handler = createServerRpc({
	id: "9db5fa05632ccac9d2a4639a77f21e9ce6c24fc80e99090991f9e816357d8836",
	name: "writeQuestionnaireFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => writeQuestionnaireFn.__executeServer(opts));
var writeQuestionnaireFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(writeQuestionnaireFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `e-commerce rules grievance officer DPDP consent children legal metrology unboxing refund shipping GSTIN packaged commodity ${data.host} ${data.homeTitle ?? ""}`,
		k: 8
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2e3,
		messages: [{
			role: "system",
			content: SYSTEM_QUESTIONS
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing: ${ctx.missing}
${ctx.hints}

LIVE PAGE TEXT:
${ctx.pagesBlock}

PRIOR AUDIT (optional):
${(data.findings ?? "").slice(0, 5e3) || "(none yet — still write the questionnaire from the live pages)"}

EXISTING ANSWERS:
${ctx.answersBlock}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var writeClientBriefFn_createServerFn_handler = createServerRpc({
	id: "f509c245be4050eefe37fe33937ce7a367c07ab44c186efccb21254f96d6c5b4",
	name: "writeClientBriefFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => writeClientBriefFn.__executeServer(opts));
var writeClientBriefFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(writeClientBriefFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `consumer protection unfair trade practice e-commerce rules refund shipping misleading advertisement DPDP consent ${data.host} ${data.homeTitle ?? ""}`,
		k: 8
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2200,
		temperature: .3,
		messages: [{
			role: "system",
			content: SYSTEM_BRIEF
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing: ${ctx.missing}
${ctx.hints}

LIVE PAGE TEXT:
${ctx.pagesBlock}

PRIOR AUDIT (optional):
${(data.findings ?? "").slice(0, 4e3) || "(none yet)"}

EXISTING CLIENT ANSWERS:
${ctx.answersBlock}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var writeImplementationsFn_createServerFn_handler = createServerRpc({
	id: "3fb2668851f685aa37a4a76a99d75c1721981a5fdf0111b283560dd62977bb47",
	name: "writeImplementationsFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => writeImplementationsFn.__executeServer(opts));
var writeImplementationsFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(writeImplementationsFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `e-commerce rules 2020 grievance officer DPDP notice consent cookie refund cancellation shipping estimate legal metrology misleading advertisement ${data.host}`,
		k: 8
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2800,
		messages: [{
			role: "system",
			content: SYSTEM_IMPLEMENT
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
Pages missing: ${ctx.missing}
${ctx.hints}

LIVE PAGE TEXT:
${ctx.pagesBlock}

REVISED DRAFTS:
${ctx.refinedBlock}

CLIENT NEEDS BRIEF:
${ctx.briefBlock}

QUESTIONNAIRE ANSWERS:
${ctx.answersBlock}

GAP REGISTER / AUDIT:
${(data.gapsPaper ?? data.findings ?? "").slice(0, 7e3) || "(none)"}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
var writeForwardEmailFn_createServerFn_handler = createServerRpc({
	id: "cf9b87416e91d277d94e20cefba312bdcda9778d4ccc075b5e4bdd6c6ddfaad1",
	name: "writeForwardEmailFn",
	filename: "src/lib/ai/store-audit.ts"
}, (opts) => writeForwardEmailFn.__executeServer(opts));
var writeForwardEmailFn = createServerFn({ method: "POST" }).validator((input) => improvedInput.parse(input)).handler(writeForwardEmailFn_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `e-commerce rules grievance officer DPDP consent unfair contract refund ${data.host}`,
		k: 6
	});
	const ctx = packStoreContext(data);
	const result = await chat({
		maxTokens: 2e3,
		temperature: .3,
		messages: [{
			role: "system",
			content: SYSTEM_EMAIL
		}, {
			role: "user",
			content: `Store origin: ${data.origin}
Homepage title: ${data.homeTitle ?? ""}
${ctx.hints}
Pages missing: ${ctx.missing}

LIVE PAGE TEXT (short):
${data.pages.map((p) => `${p.label}: ${p.text.slice(0, 900)}`).join("\n\n")}

REVISED DRAFTS PRESENT: ${data.refined?.map((r) => r.title).join(", ") || "none yet"}

CLIENT NEEDS BRIEF:
${ctx.briefBlock}

QUESTIONNAIRE ANSWERS:
${ctx.answersBlock}

GAP / IMPLEMENTATION NOTES:
${(data.gapsPaper ?? "").slice(0, 3500)}
${(data.implementPaper ?? data.findings ?? "").slice(0, 3500)}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`
		}]
	});
	if (!result.ok) return {
		ok: false,
		error: result.error,
		citations: hits
	};
	return {
		ok: true,
		text: result.text,
		citations: hits
	};
});
//#endregion
export { auditStoreFn_createServerFn_handler, findPolicyGapsFn_createServerFn_handler, refineStorePolicyFn_createServerFn_handler, researchStoreFn_createServerFn_handler, writeClientBriefFn_createServerFn_handler, writeForwardEmailFn_createServerFn_handler, writeImplementationsFn_createServerFn_handler, writeQuestionnaireFn_createServerFn_handler, writeSellingPointsFn_createServerFn_handler };
