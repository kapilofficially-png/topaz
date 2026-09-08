import { n as createServerFn } from "./ssr.mjs";
import { a as object, i as number, n as array, o as record, s as string } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-A6pJPYTF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/legal-CIPaljvg.js
var retrieveInput = object({
	query: string().min(3).max(4e3),
	k: number().int().min(1).max(12).optional(),
	categories: array(string()).optional()
});
var draftInput = object({
	slug: string().min(1).max(80),
	title: string().min(1).max(200),
	instructions: string().min(1).max(4e3),
	facts: record(string(), string()),
	ragQuery: string().min(1).max(4e3)
});
var refineInput = object({
	slug: string().min(1).max(80),
	title: string().min(1).max(200),
	currentDraft: string().min(20).max(24e3),
	instruction: string().min(3).max(2e3),
	ragQuery: string().min(1).max(4e3)
});
var askInput = object({ question: string().min(8).max(2500) });
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
			temperature: options.temperature ?? .25
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
var SYSTEM_DRAFTER = `You are NyayaDraft, an Indian legal drafting assistant used by advocates and litigants as a first-cut drafting aid.

Hard rules:
- You draft under the law of India as it stands now. Criminal law: Bharatiya Nyaya Sanhita, 2023; procedure: Bharatiya Nagarik Suraksha Sanhita, 2023; evidence: Bharatiya Sakshya Adhiniyam, 2023 (in force 1 July 2024). Do not cite IPC/CrPC/IEA as current charging or procedural sections except to map old to new.
- Ground every legal proposition in the RETRIEVED AUTHORITIES. If a point is not in the authorities, keep it to uncontroversial drafting practice and say so in DRAFTING NOTES. Never invent AIR / SCC / reporter citations.
- Use Indian chambers style for pleadings and notices: cause title, numbered paragraphs, a distinct PRAYER, place/date, advocate signature block, verification where a pleading requires it.
- If the instrument is a website or store policy (terms of service, privacy/consent, refund, shipping), draft a customer-facing policy with numbered clauses — not a court pleading. No PRAYER, no vakalatnama. Do not import US 'as-is / all sales final / exclusive foreign forum' language. Do not waive Consumer Protection Act, 2019 remedies or DPDP rights. Name the grievance officer. Governing law is India; Consumer Commissions remain available.
- Names, amounts, dates and addresses come only from the user's facts. Do not fabricate parties, URNs, or facts.
- Flag stamp duty, registration, limitation, and territorial jurisdiction in DRAFTING NOTES when they matter.
- English is the drafting language unless the user writes facts in Hindi; then you may mix headings in English with body in formal Hindi.
- This is not a solicitor-client opinion and not a substitute for an advocate enrolled under the Advocates Act, 1961.

Return EXACTLY three markdown sections, in this order, with these headings:

## DRAFT
(the instrument / pleading / notice, ready to copy)

## AUTHORITIES RELIED ON
(bullet list of citations actually used, matching the retrieved set)

## DRAFTING NOTES
(gaps, risks, annexures, stamp/registration, limitation, next procedural step)`;
var SYSTEM_ASK = `You are NyayaDraft's library counsel. Answer questions of Indian law using ONLY the retrieved authorities plus uncontroversial procedure. Prefer BNS/BNSS/BSA over repealed IPC/CrPC/IEA. Never invent case citations. If the corpus is thin, say so and answer at a high level.

Structure:
1. Short answer (plain English).
2. Governing provisions (cited).
3. How it plays out in drafting or procedure.
4. Caveats.

Close with: "This is not legal advice. Instruct an enrolled advocate on the facts."`;
var searchAuthorities_createServerFn_handler = createServerRpc({
	id: "fef6b9a14abf3390243bc546041f329f7f4c34640b19142602d5e7dd06359caf",
	name: "searchAuthorities",
	filename: "src/lib/ai/legal.ts"
}, (opts) => searchAuthorities.__executeServer(opts));
var searchAuthorities = createServerFn({ method: "POST" }).validator((input) => retrieveInput.parse(input)).handler(searchAuthorities_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	return { hits: retrieve({
		query: data.query,
		k: data.k ?? 8,
		categories: data.categories
	}).map(({ score: _s, ...rest }) => rest) };
});
var getAuthority_createServerFn_handler = createServerRpc({
	id: "533a8b4c32c06ab444ff7725d6a054040af35976a717f7f732605d9168e68d1f",
	name: "getAuthority",
	filename: "src/lib/ai/legal.ts"
}, (opts) => getAuthority.__executeServer(opts));
var getAuthority = createServerFn({ method: "POST" }).validator((input) => object({ id: string() }).parse(input)).handler(getAuthority_createServerFn_handler, async ({ data }) => {
	const { getChunk } = await import("./retrieve-zGlfAKUL.mjs");
	return { chunk: getChunk(data.id) ?? null };
});
var listAuthorities_createServerFn_handler = createServerRpc({
	id: "f7e22f2d46bf71f69fff264ae438baf4e0bed29457c15d42a697414a7f8a921a",
	name: "listAuthorities",
	filename: "src/lib/ai/legal.ts"
}, (opts) => listAuthorities.__executeServer(opts));
var listAuthorities = createServerFn({ method: "POST" }).validator((input) => object({
	category: string().optional(),
	q: string().optional()
}).parse(input)).handler(listAuthorities_createServerFn_handler, async ({ data }) => {
	const { listCorpus, retrieve, corpusStats } = await import("./retrieve-zGlfAKUL.mjs");
	const stats = corpusStats();
	if (data.q && data.q.trim().length >= 2) return {
		stats,
		chunks: retrieve({
			query: data.q,
			k: 24,
			categories: data.category ? [data.category] : void 0
		}).map(({ score: _s, ...c }) => c)
	};
	return {
		stats,
		chunks: listCorpus(data.category)
	};
});
var generateDraft_createServerFn_handler = createServerRpc({
	id: "e01f2916e08d10faea50b5e328a52de250fe16b797113148bf07781efa299c1b",
	name: "generateDraft",
	filename: "src/lib/ai/legal.ts"
}, (opts) => generateDraft.__executeServer(opts));
var generateDraft = createServerFn({ method: "POST" }).validator((input) => draftInput.parse(input)).handler(generateDraft_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const factBlob = Object.entries(data.facts).filter(([, v]) => v && v.trim()).map(([k, v]) => `${k}: ${v}`).join("\n");
	const hits = retrieve({
		query: `${data.ragQuery}\n${data.title}\n${factBlob}`,
		k: 8
	});
	const result = await chat({
		maxTokens: 3200,
		messages: [{
			role: "system",
			content: SYSTEM_DRAFTER
		}, {
			role: "user",
			content: `Instrument: ${data.title} (${data.slug})

Drafting instructions:
${data.instructions}

Facts supplied by the user:
${factBlob || "(none)"}

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
var refineDraft_createServerFn_handler = createServerRpc({
	id: "87860d3d820f6f38f39d1c2f753d6ec6dc7f2142fefac3920dc68b3adc357ebb",
	name: "refineDraft",
	filename: "src/lib/ai/legal.ts"
}, (opts) => refineDraft.__executeServer(opts));
var refineDraft = createServerFn({ method: "POST" }).validator((input) => refineInput.parse(input)).handler(refineDraft_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: `${data.ragQuery}\n${data.instruction}`,
		k: 6
	});
	const result = await chat({
		maxTokens: 3200,
		messages: [{
			role: "system",
			content: SYSTEM_DRAFTER
		}, {
			role: "user",
			content: `Revise the following Indian legal draft (${data.title}).
Revision instruction: ${data.instruction}

Return the full revised document in the same three-section format.

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}

CURRENT DRAFT:
${data.currentDraft}`
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
var askTheLaw_createServerFn_handler = createServerRpc({
	id: "946f65fb0f70125389cf9076bce1d39727c79c824f29ab692fae036bb8dc46d7",
	name: "askTheLaw",
	filename: "src/lib/ai/legal.ts"
}, (opts) => askTheLaw.__executeServer(opts));
var askTheLaw = createServerFn({ method: "POST" }).validator((input) => askInput.parse(input)).handler(askTheLaw_createServerFn_handler, async ({ data }) => {
	const { retrieve } = await import("./retrieve-zGlfAKUL.mjs");
	const hits = retrieve({
		query: data.question,
		k: 8
	});
	const result = await chat({
		maxTokens: 1400,
		temperature: .2,
		messages: [{
			role: "system",
			content: SYSTEM_ASK
		}, {
			role: "user",
			content: `Question: ${data.question}

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
export { askTheLaw_createServerFn_handler, generateDraft_createServerFn_handler, getAuthority_createServerFn_handler, listAuthorities_createServerFn_handler, refineDraft_createServerFn_handler, searchAuthorities_createServerFn_handler };
