import { expandQuery } from "./aliases";
import { CORPUS } from "./corpus";
import type { LawCategory, LawChunk, RetrievedChunk } from "./types";

const K1 = 1.5;
const B = 0.75;

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[–—]/g, " ")
    .split(/[^a-z0-9\u0900-\u097f]+/u)
    .filter((t) => t.length > 1);
}

function indexedText(chunk: LawChunk): string {
  return [
    chunk.title,
    chunk.title,
    chunk.citation,
    chunk.citation,
    chunk.statute,
    chunk.tags.join(" "),
    chunk.tags.join(" "),
    chunk.text,
    chunk.note ?? "",
  ].join(" ");
}

const DOCS: { chunk: LawChunk; tokens: string[]; tf: Map<string, number> }[] =
  CORPUS.map((chunk) => {
    const tokens = tokenize(indexedText(chunk));
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tokens, tf };
  });

const AVG_DL = DOCS.reduce((s, d) => s + d.tokens.length, 0) / Math.max(DOCS.length, 1);

const DF = new Map<string, number>();
for (const d of DOCS) {
  for (const term of d.tf.keys()) DF.set(term, (DF.get(term) ?? 0) + 1);
}

const N = DOCS.length;

function idf(term: string): number {
  const df = DF.get(term) ?? 0;
  return Math.log(1 + (N - df + 0.5) / (df + 0.5));
}

function bm25(queryTokens: string[], doc: (typeof DOCS)[number]): number {
  const dl = doc.tokens.length;
  let score = 0;
  const seen = new Set<string>();
  for (const term of queryTokens) {
    if (seen.has(term)) continue;
    seen.add(term);
    const tf = doc.tf.get(term);
    if (!tf) continue;
    const denom = tf + K1 * (1 - B + B * (dl / AVG_DL));
    score += idf(term) * ((tf * (K1 + 1)) / denom);
  }
  return score;
}

export function retrieve(options: {
  query: string;
  k?: number;
  categories?: LawCategory[];
}): RetrievedChunk[] {
  const { query, k = 8, categories } = options;
  const tokens = tokenize(expandQuery(query));
  if (!tokens.length) return [];

  const scored: RetrievedChunk[] = [];
  for (const doc of DOCS) {
    if (categories?.length && !categories.includes(doc.chunk.category)) continue;
    const score = bm25(tokens, doc);
    if (score <= 0) continue;
    scored.push({ ...doc.chunk, score });
  }
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, k);
}

export function getChunk(id: string): LawChunk | undefined {
  return CORPUS.find((c) => c.id === id);
}

export function listCorpus(category?: LawCategory): LawChunk[] {
  if (!category) return CORPUS;
  return CORPUS.filter((c) => c.category === category);
}

export function corpusStats() {
  const byCategory: Record<string, number> = {};
  for (const c of CORPUS) {
    byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
  }
  return { total: CORPUS.length, byCategory };
}
