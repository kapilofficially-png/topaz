import { n as REQUIRED_STORE_POLICIES, t as POLICY_LABELS } from "./types-Blq5imDZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/scrape-rGH4cbh_.js
var MAX_BYTES = 28e4;
var MAX_TEXT = 9e3;
var FETCH_MS = 12e3;
var USER_AGENT = "Mozilla/5.0 (compatible; NyayaDraft/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/126.0.0.0";
var PRIVATE_HOST = /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|::1$|\[::1\])/i;
var KIND_RULES = [
	{
		kind: "terms",
		re: /terms[\s/_&-]*(?:and|&|%26|&)?[\s/_&-]*conditions|terms[\s/_-]*(of[\s/_-]*)?(service|use|sale)|conditions[\s/_-]*of[\s/_-]*(use|sale|service)|\/t(?:and)?c\b|\bt\s*&\s*c\b|\btncs?\b|\/tos\b|user[\s/_-]*agreement/i
	},
	{
		kind: "privacy",
		re: /privacy|data[\s/_-]*protection|dpdp|personal[\s/_-]*data/i
	},
	{
		kind: "consent",
		re: /consent[\s/_-]*policy|cookie[\s/_-]*(policy|notice)/i
	},
	{
		kind: "refund",
		re: /refund|return[\s/_-]*(policy|and)|exchange[\s/_-]*policy|cancellation[\s/_-]*policy/i
	},
	{
		kind: "shipping",
		re: /shipping|delivery[\s/_-]*policy|dispatch/i
	},
	{
		kind: "contact",
		re: /contact[\s/_-]*(information|us)|imprint|legal[\s/_-]*notice|grievance/i
	}
];
var CANDIDATE_PATHS = [
	{
		path: "/policies/terms-of-service",
		kind: "terms"
	},
	{
		path: "/policies/terms-and-conditions",
		kind: "terms"
	},
	{
		path: "/policies/terms-of-use",
		kind: "terms"
	},
	{
		path: "/policies/privacy-policy",
		kind: "privacy"
	},
	{
		path: "/policies/refund-policy",
		kind: "refund"
	},
	{
		path: "/policies/shipping-policy",
		kind: "shipping"
	},
	{
		path: "/policies/contact-information",
		kind: "contact"
	},
	{
		path: "/pages/privacy-policy",
		kind: "privacy"
	},
	{
		path: "/pages/refund-policy",
		kind: "refund"
	},
	{
		path: "/pages/terms-of-service",
		kind: "terms"
	},
	{
		path: "/pages/terms-and-conditions",
		kind: "terms"
	},
	{
		path: "/pages/terms-conditions",
		kind: "terms"
	},
	{
		path: "/pages/shipping-policy",
		kind: "shipping"
	},
	{
		path: "/pages/contact",
		kind: "contact"
	},
	{
		path: "/privacy-policy",
		kind: "privacy"
	},
	{
		path: "/refund-policy",
		kind: "refund"
	},
	{
		path: "/terms-of-service",
		kind: "terms"
	},
	{
		path: "/terms-and-conditions",
		kind: "terms"
	},
	{
		path: "/terms-conditions",
		kind: "terms"
	},
	{
		path: "/terms-of-use",
		kind: "terms"
	},
	{
		path: "/tnc",
		kind: "terms"
	},
	{
		path: "/shipping-policy",
		kind: "shipping"
	}
];
function isPrivateHost(host) {
	const h = host.replace(/^\[|\]$/g, "").toLowerCase();
	if (PRIVATE_HOST.test(h) || h.endsWith(".local") || h.endsWith(".internal")) return true;
	const m = h.match(/^172\.(\d+)\./);
	if (m) {
		const n = Number(m[1]);
		if (n >= 16 && n <= 31) return true;
	}
	return false;
}
function parsePublicHttpUrl(raw) {
	const trimmed = raw.trim();
	if (!trimmed) throw new Error("Enter a website URL.");
	const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
	let url;
	try {
		url = new URL(withProto);
	} catch {
		throw new Error("That does not look like a website address.");
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("Only public http(s) websites can be read.");
	if (url.username || url.password) throw new Error("URLs with credentials are not allowed.");
	if (isPrivateHost(url.hostname)) throw new Error("That address is not a public website.");
	return url;
}
function classify(url, title = "", linkText = "") {
	const blob = `${url} ${title} ${linkText}`;
	for (const rule of KIND_RULES) if (rule.re.test(blob)) return rule.kind;
	return null;
}
function decodeEntities(s) {
	let out = s;
	for (let i = 0; i < 2; i++) out = out.replace(/&nbsp;/gi, " ").replace(/&/gi, "&").replace(/"/gi, "\"").replace(/&#39;|'/gi, "'").replace(/</gi, "<").replace(/>/gi, ">").replace(/&#(\d+);/g, (_, n) => {
		const code = Number(n);
		return code > 0 && code < 1114111 ? String.fromCodePoint(code) : "";
	});
	return out;
}
function htmlToText(html) {
	const stripped = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<noscript[\s\S]*?<\/noscript>/gi, " ").replace(/<svg[\s\S]*?<\/svg>/gi, " ").replace(/<!--[\s\S]*?-->/g, " ");
	return decodeEntities((stripped.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ?? stripped.match(/id=["']MainContent["'][\s\S]*?<\/div>/i)?.[0] ?? stripped.match(/shopify-policy__body[\s\S]*?<\/div>/i)?.[0] ?? stripped.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ?? stripped).replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|h[1-6]|li|tr|div|section)>/gi, "\n").replace(/<li\b[^>]*>/gi, "• ").replace(/<[^>]+>/g, " ")).replace(/\{[^{}]{0,400}\}/g, " ").replace(/!important/gi, " ").replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").replace(/[ \t]{2,}/g, " ").trim().slice(0, MAX_TEXT);
}
function pageTitle(html) {
	const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
	const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
	return decodeEntities((h1 || t || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim().slice(0, 160);
}
function extractLinks(html, base) {
	const out = [];
	const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
	let m;
	while (m = re.exec(html)) {
		const raw = m[1];
		if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) continue;
		try {
			const abs = new URL(raw, base);
			if (abs.protocol !== "http:" && abs.protocol !== "https:") continue;
			if (abs.hostname !== base.hostname) continue;
			const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
			out.push({
				href: abs.toString(),
				text
			});
		} catch {}
	}
	return out;
}
async function fetchHtml(url) {
	const ac = new AbortController();
	const timer = setTimeout(() => ac.abort(), FETCH_MS);
	try {
		const res = await fetch(url.toString(), {
			method: "GET",
			redirect: "follow",
			signal: ac.signal,
			headers: {
				Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
				"User-Agent": USER_AGENT
			}
		});
		const finalUrl = res.url || url.toString();
		const finalHost = new URL(finalUrl).hostname;
		if (isPrivateHost(finalHost)) return {
			status: 0,
			html: "",
			finalUrl
		};
		const ctype = res.headers.get("content-type") ?? "";
		if (ctype && !/html|xml|text\/plain/i.test(ctype)) return {
			status: res.status,
			html: "",
			finalUrl
		};
		const buf = await res.arrayBuffer();
		const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
		const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);
		return {
			status: res.status,
			html,
			finalUrl
		};
	} finally {
		clearTimeout(timer);
	}
}
function extractHints(pages, homeTitle) {
	const blob = pages.map((p) => p.text).join("\n");
	return {
		emails: [...new Set((blob.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? []).map((e) => e.toLowerCase()).filter((e) => !/example\.|sentry|schema|wixpress|myshopify/.test(e)))].slice(0, 6),
		phones: [...new Set(blob.match(/\+91[\s-]?[6-9]\d{9}|\b[6-9]\d{9}\b/g) ?? [])].slice(0, 4),
		gstins: [...new Set(blob.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b/g) ?? [])].slice(0, 3),
		legalName: (blob.match(/\b([A-Z][A-Za-z0-9&.\- ]{2,60}\s(?:Pvt\.?\s*Ltd\.?|Private Limited|LLP|Enterprises|Traders|Stores))\b/)?.[1])?.trim() || homeTitle.split(/[-|–]/)[0]?.trim() || void 0
	};
}
function pickPages(found) {
	const seen = /* @__PURE__ */ new Set();
	const buckets = /* @__PURE__ */ new Map();
	for (const item of found) {
		const key = item.url.replace(/\/+$/, "").toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		const list = buckets.get(item.kind) ?? [];
		list.push(item);
		buckets.set(item.kind, list);
	}
	const order = [
		"contact",
		"terms",
		"privacy",
		"refund",
		"shipping",
		"consent",
		"other"
	];
	const maxPerKind = { terms: 2 };
	const out = [];
	for (const k of order) {
		const list = buckets.get(k);
		if (!list?.length) continue;
		list.sort((a, b) => {
			const home = Number(b.fromHome) - Number(a.fromHome);
			if (home) return home;
			return Number(b.url.includes("/policies/")) - Number(a.url.includes("/policies/"));
		});
		for (const item of list.slice(0, maxPerKind[k] ?? 1)) out.push({
			url: item.url,
			kind: item.kind
		});
	}
	return out.slice(0, 9);
}
async function researchStore(rawUrl) {
	const start = parsePublicHttpUrl(rawUrl);
	const origin = `${start.protocol}//${start.host}`;
	const homeUrl = new URL("/", origin);
	let home;
	try {
		home = await fetchHtml(homeUrl);
	} catch {
		throw new Error("The website did not respond. Check the address and try again.");
	}
	if (home.status === 0 || !home.html) throw new Error("Could not read that website. It may block automated fetches.");
	if (home.status >= 400) throw new Error(`The website returned ${home.status} for its homepage.`);
	const homeTitle = pageTitle(home.html);
	const links = extractLinks(home.html, new URL(home.finalUrl || origin));
	const discovered = [];
	for (const link of links) {
		const kind = classify(link.href, "", link.text);
		if (!kind) continue;
		discovered.push({
			url: stripHash(link.href),
			kind,
			fromHome: true
		});
	}
	for (const c of CANDIDATE_PATHS) discovered.push({
		url: stripHash(new URL(c.path, origin).toString()),
		kind: c.kind,
		fromHome: false
	});
	const chosen = pickPages(discovered);
	const pages = [];
	await Promise.all(chosen.map(async (item) => {
		try {
			const got = await fetchHtml(new URL(item.url));
			if (got.status >= 400 || !got.html) return;
			const text = htmlToText(got.html);
			if (text.length < 80) return;
			const title = pageTitle(got.html) || POLICY_LABELS[item.kind];
			const kind = classify(got.finalUrl || item.url, title, "") ?? item.kind;
			pages.push({
				kind,
				label: POLICY_LABELS[kind],
				url: got.finalUrl || item.url,
				title,
				text,
				chars: text.length,
				status: got.status
			});
		} catch {}
	}));
	const bestByKind = /* @__PURE__ */ new Map();
	for (const p of pages) {
		const existing = bestByKind.get(p.kind);
		if (!existing || p.chars > existing.chars) bestByKind.set(p.kind, p);
	}
	const uniquePages = [...bestByKind.values()];
	const kindsFound = new Set(uniquePages.map((p) => p.kind));
	const missing = REQUIRED_STORE_POLICIES.filter((k) => !kindsFound.has(k)).map((kind) => ({
		kind,
		label: POLICY_LABELS[kind]
	}));
	uniquePages.sort((a, b) => a.label.localeCompare(b.label));
	return {
		origin,
		host: new URL(origin).host,
		homeTitle,
		pages: uniquePages,
		missing,
		hints: extractHints(pages, homeTitle)
	};
}
function stripHash(url) {
	try {
		const u = new URL(url);
		u.hash = "";
		return u.toString();
	} catch {
		return url;
	}
}
//#endregion
export { researchStore };
