import {
  POLICY_LABELS,
  missingFromPages,
  pageUrlKey,
  type ExtractedHints,
  type FetchedPage,
  type PolicyKind,
  type ResearchResult,
} from "./types";

const MAX_BYTES = 280_000;
const MAX_TEXT = 80_000;
const FETCH_MS = 12_000;
const MAX_PAGES = 12;
const USER_AGENT =
  "Mozilla/5.0 (compatible; NyayaDraft/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/126.0.0.0";

const PRIVATE_HOST =
  /^(localhost|127\.|0\.0\.0\.0|10\.|192\.168\.|169\.254\.|::1$|\[::1\])/i;

const KIND_RULES: { kind: PolicyKind; re: RegExp }[] = [
  {
    kind: "terms",
    re: /terms[\s/_&-]*(?:and|&|%26|&)?[\s/_&-]*conditions|terms[\s/_-]*(of[\s/_-]*)?(service|use|sale)|conditions[\s/_-]*of[\s/_-]*(use|sale|service)|\/t(?:and)?c\b|\bt\s*&\s*c\b|\btncs?\b|\/tos\b|user[\s/_-]*agreement/i,
  },
  { kind: "privacy", re: /privacy|data[\s/_-]*protection|dpdp|personal[\s/_-]*data/i },
  { kind: "consent", re: /consent[\s/_-]*policy|cookie[\s/_-]*(policy|notice)/i },
  {
    kind: "return",
    re: /return[\s/_-]*policy|\/return-policy\b|exchange[\s/_-]*policy|\/faqs-exchange/i,
  },
  { kind: "cancellation", re: /cancellation[\s/_-]*policy|\/cancellation-policy\b/i },
  { kind: "refund", re: /refund|\/faqs-refund/i },
  { kind: "delivery", re: /delivery[\s/_-]*policy|\/delivery-policy\b/i },
  { kind: "shipping", re: /shipping|dispatch/i },
  { kind: "contact", re: /contact[\s/_-]*(information|us)|imprint|legal[\s/_-]*notice|grievance/i },
];

const CANDIDATE_PATHS: { path: string; kind: PolicyKind }[] = [
  { path: "/policies/terms-of-service", kind: "terms" },
  { path: "/policies/terms-and-conditions", kind: "terms" },
  { path: "/policies/terms-of-use", kind: "terms" },
  { path: "/policies/privacy-policy", kind: "privacy" },
  { path: "/policies/refund-policy", kind: "refund" },
  { path: "/policies/shipping-policy", kind: "shipping" },
  { path: "/policies/delivery-policy", kind: "delivery" },
  { path: "/policies/cookie-policy", kind: "consent" },
  { path: "/policies/cancellation-policy", kind: "cancellation" },
  { path: "/policies/contact-information", kind: "contact" },
  { path: "/pages/privacy-policy", kind: "privacy" },
  { path: "/pages/refund-policy", kind: "refund" },
  { path: "/pages/return-policy", kind: "return" },
  { path: "/pages/terms-of-service", kind: "terms" },
  { path: "/pages/terms-and-conditions", kind: "terms" },
  { path: "/pages/terms-conditions", kind: "terms" },
  { path: "/pages/shipping-policy", kind: "shipping" },
  { path: "/pages/delivery-policy", kind: "delivery" },
  { path: "/pages/cookie-policy", kind: "consent" },
  { path: "/pages/cancellation-policy", kind: "cancellation" },
  { path: "/pages/contact", kind: "contact" },
  { path: "/privacy-policy", kind: "privacy" },
  { path: "/refund-policy", kind: "refund" },
  { path: "/terms-of-service", kind: "terms" },
  { path: "/terms-and-conditions", kind: "terms" },
  { path: "/terms-conditions", kind: "terms" },
  { path: "/terms-of-use", kind: "terms" },
  { path: "/tnc", kind: "terms" },
  { path: "/shipping-policy", kind: "shipping" },
  { path: "/shippingpolicy", kind: "shipping" },
  { path: "/delivery-policy", kind: "delivery" },
  { path: "/cookie-policy", kind: "consent" },
  { path: "/cancellation-policy", kind: "cancellation" },
  { path: "/return-policy", kind: "return" },
  { path: "/termsconditions", kind: "terms" },
  { path: "/faqs-refund", kind: "refund" },
  { path: "/faqs-exchange", kind: "return" },
];

function isPrivateHost(host: string): boolean {
  const h = host.replace(/^\[|\]$/g, "").toLowerCase();
  if (PRIVATE_HOST.test(h) || h.endsWith(".local") || h.endsWith(".internal")) {
    return true;
  }
  const m = h.match(/^172\.(\d+)\./);
  if (m) {
    const n = Number(m[1]);
    if (n >= 16 && n <= 31) return true;
  }
  return false;
}

export function parsePublicHttpUrl(raw: string): URL {
  const trimmed = raw.trim();
  if (!trimmed) throw new Error("Enter a website URL.");
  const withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  let url: URL;
  try {
    url = new URL(withProto);
  } catch {
    throw new Error("That does not look like a website address.");
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("Only public http(s) websites can be read.");
  }
  if (url.username || url.password) {
    throw new Error("URLs with credentials are not allowed.");
  }
  if (isPrivateHost(url.hostname)) {
    throw new Error("That address is not a public website.");
  }
  return url;
}

function classify(url: string, title = "", linkText = ""): PolicyKind | null {
  const blob = `${url} ${title} ${linkText}`;
  for (const rule of KIND_RULES) {
    if (rule.re.test(blob)) return rule.kind;
  }
  return null;
}

function decodeEntities(s: string): string {
  const named: Record<string, string> = {
    nbsp: " ",
    amp: "&",
    quot: '"',
    apos: "'",
    lt: "<",
    gt: ">",
    ldquo: '"',
    rdquo: '"',
    lsquo: "'",
    rsquo: "'",
    ndash: "-",
    mdash: "-",
    hellip: "...",
    bull: "-",
    middot: "-",
    copy: "(c)",
    reg: "(R)",
    trade: "TM",
    times: "x",
    minus: "-",
    nbhy: "-",
  };
  let out = s;
  for (let i = 0; i < 2; i++) {
    out = out
      .replace(/&([a-z]+);/gi, (full, name: string) => named[name.toLowerCase()] ?? full)
      .replace(/&#(\d+);/g, (_, n) => {
        const code = Number(n);
        return code > 0 && code < 1114111 ? String.fromCodePoint(code) : "";
      })
      .replace(/&#x([0-9a-f]+);/gi, (_, h) => {
        const code = parseInt(h, 16);
        return code > 0 && code < 1114111 ? String.fromCodePoint(code) : "";
      });
  }
  return out;
}

export function htmlToText(html: string): string {
  const stripped = stripHiddenBlocks(html)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ");
  const main =
    extractBlock(stripped, /<main\b[^>]*>/i) ??
    extractBlock(stripped, /<div\b[^>]*id=["']MainContent["'][^>]*>/i) ??
    extractBlock(stripped, /<div\b[^>]*class=["'][^"']*shopify-policy__body[^"']*["'][^>]*>/i) ??
    extractBlock(stripped, /<div\b[^>]*class=["'][^"']*faqordr[^"']*["'][^>]*>/i) ??
    extractBlock(stripped, /<article\b[^>]*>/i) ??
    stripped;
  const text = decodeEntities(
    convertLists(nestOrphanLists(main))
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|h[1-6]|tr|div|section)>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  );
  return startFromPolicy(
    dropDummyLatin(text)
      .replace(/^\s*0\.\s+Other Terms\s*$/gim, "")
      .replace(/\{[^{}]{0,400}\}/g, " ")
      .replace(/!important/gi, " ")
      .replace(/[ \t]+\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/[ \t]{2,}/g, " ")
      .trim(),
  ).slice(0, MAX_TEXT);
}

function nestOrphanLists(html: string): string {
  let out = html;
  for (let pass = 0; pass < 4; pass++) {
    const next = attachSiblingLists(out);
    if (next === out) break;
    out = next;
  }
  return out;
}

function attachSiblingLists(html: string): string {
  let i = 0;
  let out = "";
  const openLi = /<li\b[^>]*>/i;
  while (i < html.length) {
    const slice = html.slice(i);
    const m = openLi.exec(slice);
    if (!m || m.index === undefined) {
      out += slice;
      break;
    }
    out += slice.slice(0, m.index);
    const liStart = i + m.index;
    const liBlock = extractBlock(html.slice(liStart), /<li\b[^>]*>/i);
    if (!liBlock) {
      out += m[0];
      i = liStart + m[0].length;
      continue;
    }
    const rawAfter = html.slice(liStart + liBlock.length);
    const ws = rawAfter.match(/^\s*/)?.[0] ?? "";
    const after = rawAfter.slice(ws.length);
    const innerText = liBlock
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (/^<(ol|ul)\b/i.test(after) && innerText.length > 0 && innerText.length <= 90) {
      const listBlock = extractBlock(after, /<(ol|ul)\b[^>]*>/i);
      if (listBlock) {
        out += `${liBlock.replace(/<\/li\s*>$/i, "")}${listBlock}</li>`;
        i = liStart + liBlock.length + ws.length + listBlock.length;
        continue;
      }
    }
    out += liBlock;
    i = liStart + liBlock.length;
  }
  return out;
}

function convertLists(html: string, prefix = ""): string {
  let i = 0;
  let out = "";
  const open = /<(ol|ul)\b[^>]*>/i;
  while (i < html.length) {
    const slice = html.slice(i);
    const m = open.exec(slice);
    if (!m || m.index === undefined) {
      out += slice;
      break;
    }
    out += slice.slice(0, m.index);
    const abs = i + m.index;
    const block = extractBlock(html.slice(abs), /<(ol|ul)\b[^>]*>/i);
    if (!block) {
      out += m[0];
      i = abs + m[0].length;
      continue;
    }
    const isOl = /^<ol/i.test(block);
    const inner = block.replace(/^<(ol|ul)\b[^>]*>/i, "").replace(/<\/(ol|ul)\s*>$/i, "");
    const items = splitListItems(inner);
    const lines = items
      .map((item, idx) => {
        const n = idx + 1;
        const label = isOl ? (prefix ? `${prefix}${n}` : `${n}`) : "";
        const childPrefix = isOl ? `${label}.` : prefix;
        const body = convertLists(item, childPrefix)
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<\/(p|h[1-6]|div)>/gi, "\n")
          .replace(/<[^>]+>/g, " ")
          .replace(/[ \t]+\n/g, "\n")
          .replace(/[ \t]{2,}/g, " ")
          .trim();
        if (!body) return "";
        if (isOl) {
          if (/^\d+(?:\.\d+)*[.)]\s/.test(body)) return body;
          return `${label}. ${body}`;
        }
        if (/^\d+(?:\.\d+)*[.)]\s/.test(body) || /^\(\d+/.test(body)) return body;
        return `- ${body}`;
      })
      .filter(Boolean);
    out += `\n${lines.join("\n")}\n`;
    i = abs + block.length;
  }
  return out;
}

function splitListItems(inner: string): string[] {
  const items: string[] = [];
  const open = /<li\b[^>]*>/i;
  let i = 0;
  while (i < inner.length) {
    const slice = inner.slice(i);
    const m = open.exec(slice);
    if (!m || m.index === undefined) break;
    const start = i + m.index;
    const block = extractBlock(inner.slice(start), /<li\b[^>]*>/i);
    if (!block) break;
    items.push(block.replace(/^<li\b[^>]*>/i, "").replace(/<\/li\s*>$/i, ""));
    i = start + block.length;
  }
  return items;
}

function extractBlock(html: string, openRe: RegExp): string | null {
  const flags = openRe.flags.replace("g", "");
  const re = new RegExp(openRe.source, flags);
  const m = re.exec(html);
  if (!m || m.index === undefined) return null;
  const start = m.index;
  const tag = m[0].match(/^<([a-z0-9]+)/i)?.[1];
  if (!tag) return html.slice(start, Math.min(html.length, start + 250_000));
  const pair = new RegExp(`</?${tag}\\b[^>]*>`, "gi");
  pair.lastIndex = start + m[0].length;
  let depth = 1;
  let t: RegExpExecArray | null;
  while ((t = pair.exec(html))) {
    if (/^<\//.test(t[0])) depth -= 1;
    else depth += 1;
    if (depth === 0) return html.slice(start, t.index + t[0].length);
  }
  return html.slice(start, Math.min(html.length, start + 250_000));
}

function startFromPolicy(text: string): string {
  const heading = text.search(
    /(?:^|\n)\s*(privacy policy|terms\s*(?:and|&)\s*conditions|terms of (?:service|use)|return policy|refund policy|cancellation policy|shipping policy|delivery policy|cookie policy|consent policy)\b/i,
  );
  if (heading >= 0 && heading < 2500) {
    return text.slice(heading).trim();
  }
  const general = text.search(/(?:^|\n)\s*1\.\s+General\b/i);
  if (general > 80) return text.slice(general).trim();
  return text;
}

function isFullyHiddenAttrs(attrs: string): boolean {
  const a = attrs.toLowerCase();
  if (/display\s*:\s*none/.test(a)) return true;
  if (/\b(?:sr-only|visually-hidden|d-none)\b/.test(a)) return true;
  if (
    a.includes("hidden-xs") &&
    a.includes("hidden-sm") &&
    a.includes("hidden-md") &&
    a.includes("hidden-lg")
  ) {
    return true;
  }
  if (/(?:^|\s)hidden(?:\s|=|$)/.test(a) && !/hidden-(?:xs|sm|md|lg)/.test(a)) {
    return true;
  }
  return false;
}

function stripHiddenBlocks(html: string): string {
  const re =
    /<(p|div|span|section|aside|li|h[1-6])\b([^>]*)>([\s\S]*?)<\/\1>/gi;
  let out = html;
  for (let i = 0; i < 4; i++) {
    const next = out.replace(re, (full, _tag: string, attrs: string) =>
      isFullyHiddenAttrs(attrs) ? " " : full,
    );
    if (next === out) break;
    out = next;
  }
  return out;
}

function dropDummyLatin(text: string): string {
  return text.replace(
    /\bLorem ipsum\b[\s\S]{0,900}?(?=\n\S|\n{2,}|$)/gi,
    " ",
  );
}

function cleanHtmlText(raw: string): string {
  return decodeEntities(raw.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function policyHeading(html: string): string {
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const text = cleanHtmlText(m[2]);
    if (text.length < 4 || text.length > 90) continue;
    if (/^\s*0\./.test(text)) continue;
    if (
      /privacy\s*policy|terms\s*(and|&)\s*conditions|terms of (?:service|use)|refund|return policy|cancellation policy|shipping policy|delivery policy|cookie policy|consent policy/i.test(
        text,
      )
    ) {
      return text;
    }
  }
  return "";
}

function pageTitle(html: string, isHome = false): string {
  const policy = policyHeading(html);
  if (policy) return policy;
  const t = cleanHtmlText(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  if (!t) return "";
  const stripped = t.replace(/^FAQ\s+/i, "");
  if (isHome) {
    const parts = stripped.split(/\s*[|–]\s*/).map((s) => s.trim()).filter(Boolean);
    const last = parts[parts.length - 1];
    if (last && last.length <= 32 && parts.length > 1) return last;
    return (parts[0] ?? stripped).slice(0, 80);
  }
  const dropBrand = stripped.replace(/\s*[-|–]\s*[A-Za-z0-9 .]{1,32}$/, "").trim();
  if (dropBrand && /privacy|terms|refund|return|shipping|cookie|consent/i.test(dropBrand)) {
    return dropBrand.slice(0, 160);
  }
  return stripped.slice(0, 160);
}

function extractLinks(html: string, base: URL): { href: string; text: string }[] {
  const out: { href: string; text: string }[] = [];
  const re = /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) {
    const raw = m[1];
    if (!raw || raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:")) {
      continue;
    }
    try {
      const abs = new URL(raw, base);
      if (abs.protocol !== "http:" && abs.protocol !== "https:") continue;
      if (abs.hostname !== base.hostname) continue;
      const text = decodeEntities(m[2].replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
      out.push({ href: abs.toString(), text });
    } catch {
      /* skip */
    }
  }
  return out;
}

async function fetchHtml(url: URL): Promise<{ status: number; html: string; finalUrl: string }> {
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), FETCH_MS);
  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      redirect: "follow",
      signal: ac.signal,
      headers: {
        Accept: "text/html,application/xhtml+xml;q=0.9,*/*;q=0.1",
        "User-Agent": USER_AGENT,
      },
    });
    const finalUrl = res.url || url.toString();
    const finalHost = new URL(finalUrl).hostname;
    if (isPrivateHost(finalHost)) {
      return { status: 0, html: "", finalUrl };
    }
    const ctype = res.headers.get("content-type") ?? "";
    if (ctype && !/html|xml|text\/plain/i.test(ctype)) {
      return { status: res.status, html: "", finalUrl };
    }
    const buf = await res.arrayBuffer();
    const slice = buf.byteLength > MAX_BYTES ? buf.slice(0, MAX_BYTES) : buf;
    const html = new TextDecoder("utf-8", { fatal: false }).decode(slice);
    return { status: res.status, html, finalUrl };
  } finally {
    clearTimeout(timer);
  }
}

function extractHints(pages: FetchedPage[], homeTitle: string): ExtractedHints {
  const blob = pages.map((p) => p.text).join("\n");
  const emails = [
    ...new Set(
      (blob.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) ?? [])
        .map((e) => e.toLowerCase())
        .filter((e) => !/example\.|sentry|schema|wixpress|myshopify/.test(e)),
    ),
  ].slice(0, 6);
  const phones = [
    ...new Set(blob.match(/\+91[\s-]?[6-9]\d{9}|\b[6-9]\d{9}\b/g) ?? []),
  ].slice(0, 4);
  const gstins = [...new Set(blob.match(/\b[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]\b/g) ?? [])].slice(
    0,
    3,
  );
  const legal =
    blob.match(
      /\b([A-Z][A-Za-z0-9&.\- ]{2,60}\s(?:Pvt\.?\s*Ltd\.?|Private Limited|LLP|Enterprises|Traders|Stores))\b/,
    )?.[1];
  return {
    emails,
    phones,
    gstins,
    legalName: legal?.trim() || homeTitle.split(/[-|–]/)[0]?.trim() || undefined,
  };
}

function pickPages(
  found: { url: string; kind: PolicyKind; fromHome: boolean }[],
): { url: string; kind: PolicyKind; fromHome: boolean }[] {
  const seen = new Set<string>();
  const buckets = new Map<PolicyKind, { url: string; kind: PolicyKind; fromHome: boolean }[]>();
  for (const item of found) {
    const key = pageUrlKey(item.url);
    if (seen.has(key)) continue;
    seen.add(key);
    const list = buckets.get(item.kind) ?? [];
    list.push(item);
    buckets.set(item.kind, list);
  }
  const order: PolicyKind[] = [
    "contact",
    "terms",
    "privacy",
    "consent",
    "return",
    "refund",
    "cancellation",
    "shipping",
    "delivery",
    "other",
  ];
  const maxPerKind: Partial<Record<PolicyKind, number>> = {
    terms: 3,
    return: 3,
    refund: 2,
    cancellation: 2,
    shipping: 2,
    delivery: 2,
    privacy: 2,
    consent: 2,
    contact: 2,
  };
  const out: { url: string; kind: PolicyKind; fromHome: boolean }[] = [];
  for (const k of order) {
    const list = buckets.get(k);
    if (!list?.length) continue;
    list.sort((a, b) => {
      const home = Number(b.fromHome) - Number(a.fromHome);
      if (home) return home;
      return Number(b.url.includes("/policies/")) - Number(a.url.includes("/policies/"));
    });
    for (const item of list.slice(0, maxPerKind[k] ?? 2)) {
      out.push(item);
    }
  }
  return out.slice(0, MAX_PAGES + 4);
}

function dedupeByUrl(pages: FetchedPage[]): FetchedPage[] {
  const byUrl = new Map<string, FetchedPage>();
  for (const p of pages) {
    const key = pageUrlKey(p.url);
    const existing = byUrl.get(key);
    if (!existing || p.chars > existing.chars) byUrl.set(key, p);
  }
  return [...byUrl.values()];
}

async function fetchPolicyPage(item: {
  url: string;
  kind: PolicyKind;
  hidden?: boolean;
  added?: boolean;
}): Promise<{ page: FetchedPage; html: string } | null> {
  try {
    const got = await fetchHtml(new URL(item.url));
    if (got.status >= 400 || !got.html) return null;
    const title = pageTitle(got.html) || POLICY_LABELS[item.kind];
    if (/^\s*404\b|page not found/i.test(title)) return null;
    const text = htmlToText(got.html);
    if (text.length < 80) return null;
    if (/\blorem ipsum\b/i.test(text) && text.length < 400) return null;
    const kind = classify(got.finalUrl || item.url, title, "") ?? item.kind;
    return {
      html: got.html,
      page: {
        kind,
        label: POLICY_LABELS[kind],
        url: got.finalUrl || item.url,
        title,
        text,
        chars: text.length,
        status: got.status,
        hidden: Boolean(item.hidden),
        added: Boolean(item.added),
      },
    };
  } catch {
    return null;
  }
}

export async function researchStore(rawUrl: string): Promise<ResearchResult> {
  const start = parsePublicHttpUrl(rawUrl);
  const origin = `${start.protocol}//${start.host}`;
  const homeUrl = new URL("/", origin);

  let home: { status: number; html: string; finalUrl: string };
  try {
    home = await fetchHtml(homeUrl);
  } catch {
    throw new Error("The website did not respond. Check the address and try again.");
  }
  if (home.status === 0 || !home.html) {
    throw new Error("Could not read that website. It may block automated fetches.");
  }
  if (home.status >= 400) {
    throw new Error(`The website returned ${home.status} for its homepage.`);
  }

  const homeTitle = pageTitle(home.html, true);
  const links = extractLinks(home.html, new URL(home.finalUrl || origin));
  const discovered: { url: string; kind: PolicyKind; fromHome: boolean }[] = [];
  const homePolicyKeys = new Set<string>();

  for (const link of links) {
    const kind = classify(link.href, "", link.text);
    if (!kind) continue;
    const url = stripHash(link.href);
    discovered.push({ url, kind, fromHome: true });
    homePolicyKeys.add(pageUrlKey(url));
  }
  for (const c of CANDIDATE_PATHS) {
    discovered.push({
      url: stripHash(new URL(c.path, origin).toString()),
      kind: c.kind,
      fromHome: false,
    });
  }

  const chosen = pickPages(discovered);
  const pages: FetchedPage[] = [];
  const htmlByUrl = new Map<string, string>();

  async function take(item: { url: string; kind: PolicyKind; fromHome?: boolean }) {
    if (pages.some((p) => pageUrlKey(p.url) === pageUrlKey(item.url))) return;
    const got = await fetchPolicyPage({
      url: item.url,
      kind: item.kind,
      hidden: false,
      added: false,
    });
    if (!got) return;
    if (pages.some((p) => pageUrlKey(p.url) === pageUrlKey(got.page.url))) return;
    pages.push({ ...got.page, hidden: false });
    htmlByUrl.set(pageUrlKey(got.page.url), got.html);
  }

  await Promise.all(chosen.map((item) => take(item)));

  const harvested: { url: string; kind: PolicyKind; fromHome: boolean }[] = [];
  for (const p of pages) {
    const html = htmlByUrl.get(pageUrlKey(p.url));
    if (!html) continue;
    for (const link of extractLinks(html, new URL(p.url))) {
      const kind = classify(link.href, "", link.text);
      if (!kind) continue;
      const url = stripHash(link.href);
      harvested.push({
        url,
        kind,
        fromHome: homePolicyKeys.has(pageUrlKey(url)),
      });
    }
  }
  const more = pickPages(
    harvested.filter((h) => !pages.some((p) => pageUrlKey(p.url) === pageUrlKey(h.url))),
  );
  await Promise.all(more.map((item) => take(item)));

  const uniquePages = dedupeByUrl(pages);
  uniquePages.sort((a, b) => a.label.localeCompare(b.label));

  return {
    origin,
    host: new URL(origin).host,
    homeTitle,
    pages: uniquePages,
    missing: missingFromPages(uniquePages),
    hints: extractHints(pages, homeTitle),
  };
}

export async function fetchStorePage(opts: {
  url: string;
  kind?: PolicyKind;
  hidden?: boolean;
}): Promise<FetchedPage> {
  const parsed = parsePublicHttpUrl(opts.url);
  const guessed = classify(parsed.toString()) ?? "other";
  const kind = opts.kind ?? guessed;
  const got = await fetchPolicyPage({
    url: parsed.toString(),
    kind,
    hidden: Boolean(opts.hidden),
    added: true,
  });
  if (!got) {
    throw new Error("Could not read that page. Check the URL, or the store may block fetches.");
  }
  return {
    ...got.page,
    kind: opts.kind ?? got.page.kind,
    label: POLICY_LABELS[opts.kind ?? got.page.kind],
    hidden: Boolean(opts.hidden),
    added: true,
  };
}

function stripHash(url: string): string {
  try {
    const u = new URL(url);
    u.hash = "";
    return u.toString();
  } catch {
    return url;
  }
}
