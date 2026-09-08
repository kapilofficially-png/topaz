import {
  auditStoreFn,
  findPolicyGapsFn,
  refineStorePolicyFn,
  researchStoreFn,
  writeClientBriefFn,
  writeColdEmailFn,
  writeForwardEmailFn,
  writeImplementationsFn,
  writeQuestionnaireFn,
  writeSellingPointsFn,
} from "@/lib/ai/store-audit";
import { aiKeysPayload, rememberProvider } from "@/lib/ai/keys-store";
import { useAuditStore, type RefinedPolicy } from "@/lib/drafts/audit-store";
import { parseDraftOutput } from "@/lib/drafts/parse";
import { usePipelineStore } from "@/lib/drafts/pipeline-store";
import { senderPayload, useSenderStore } from "@/lib/drafts/sender-store";
import { useDraftStore } from "@/lib/drafts/store";
import { POLICY_LABELS, type PolicyKind } from "@/lib/web/types";

const PAYLOAD_CLIP = 8000;

export type SequenceProgress = {
  step: number;
  total: number;
  title: string;
  rewrite?: { current: number; total: number; title: string };
};

export type SequenceReport = {
  url: string;
  host: string;
  origin: string;
  ok: boolean;
  failed: string[];
  rewriteOk: number;
  rewriteTotal: number;
  pages: number;
  saved: number;
};

function pause(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) {
    const err = new Error("Batch stopped.");
    err.name = "AbortError";
    throw err;
  }
}

export function improvedPayload() {
  const s = useAuditStore.getState();
  const send = useSenderStore.getState();
  return {
    origin: s.origin,
    host: s.host,
    homeTitle: s.homeTitle,
    hints: s.hints ?? undefined,
    pages: s.pages.map((p) => ({
      kind: p.kind,
      label: p.label,
      url: p.url,
      title: p.title,
      text: p.text.slice(0, 9000),
      hidden: Boolean(p.hidden),
      added: Boolean(p.added),
    })),
    missing: s.missing,
    findings: s.findings?.slice(0, 8000) || undefined,
    gapsPaper: s.gapsPaper?.slice(0, 8000) || undefined,
    questionnairePaper: s.questionsPaper?.slice(0, 8000) || undefined,
    clientBrief: s.briefPaper?.slice(0, 8000) || undefined,
    implementPaper: s.implementPaper?.slice(0, 8000) || undefined,
    answers: [
      ...Object.entries(s.briefAnswers),
      ...Object.entries(s.answers),
    ]
      .filter(([, v]) => v.trim())
      .slice(0, 24)
      .map(([id, answer]) => ({
        id: id.slice(0, 40),
        title: id.slice(0, 200),
        answer: answer.slice(0, 800),
      })),
    refined: s.refined.slice(0, 12).map((r) => ({
      kind: r.kind,
      title: r.title.slice(0, 200),
      text: (parseDraftOutput(r.raw).draft || r.raw).slice(0, PAYLOAD_CLIP),
    })),
    sender: senderPayload(send),
    aiKeys: aiKeysPayload(),
  };
}

function rewriteCards() {
  const s = useAuditStore.getState();
  const live = s.pages.map((p) => ({ ...p, missing: false as const }));
  const missing = s.missing
    .filter((m) => !s.pages.some((p) => p.kind === m.kind))
    .map((m) => ({
      kind: m.kind,
      label: m.label,
      url: "",
      title: m.label,
      text: "",
      chars: 0,
      status: 0,
      hidden: false,
      added: false,
      missing: true as const,
    }));
  return [...live, ...missing];
}

async function refinePage(page: {
  kind: PolicyKind;
  url: string;
  title: string;
  text: string;
  label: string;
}): Promise<RefinedPolicy | null> {
  const s = useAuditStore.getState();
  const answered = [
    ...Object.entries(s.briefAnswers),
    ...Object.entries(s.answers),
  ]
    .filter(([, v]) => v.trim())
    .map(([id, answer]) => `${id}: ${answer}`)
    .join("\n");
  try {
    const result = await refineStorePolicyFn({
      data: {
        kind: page.kind,
        origin: s.origin,
        host: s.host,
        pageUrl: page.url || undefined,
        pageTitle: page.title || page.label,
        findings: s.findings,
        currentPolicy: page.text.slice(0, 12000),
        extraInstruction: answered
          ? `Merchant questionnaire answers (use these instead of [TO BE COMPLETED] where they fit):\n${answered}`
          : undefined,
        aiKeys: aiKeysPayload(),
      },
    });
    if (!result.ok) return null;
    rememberProvider(result);
    const item: RefinedPolicy = {
      kind: page.kind,
      url: page.url,
      slug: result.slug,
      title: result.title,
      raw: result.text,
    };
    s.setRefined(item);
    return item;
  } catch {
    return null;
  }
}

export async function rewriteAllPolicies(opts?: {
  onProgress?: (p: { current: number; total: number; title: string }) => void;
  signal?: AbortSignal;
}) {
  const s = useAuditStore.getState();
  const cards = rewriteCards();
  if (!s.findings || !cards.length) {
    return { ok: false, rewriteOk: 0, rewriteTotal: cards.length, failed: ["Revise policies"] };
  }
  const written: RefinedPolicy[] = [];
  const failed: string[] = [];
  for (let i = 0; i < cards.length; i += 1) {
    throwIfAborted(opts?.signal);
    const page = cards[i];
    opts?.onProgress?.({
      current: i + 1,
      total: cards.length,
      title: page.title || POLICY_LABELS[page.kind],
    });
    let item = await refinePage(page);
    if (!item) {
      await pause(800);
      item = await refinePage(page);
    }
    if (item) written.push(item);
    else failed.push(page.title || POLICY_LABELS[page.kind]);
    if (i < cards.length - 1) await pause(400);
  }
  useAuditStore.getState().replaceRefined(written);
  return {
    ok: failed.length === 0,
    rewriteOk: written.length,
    rewriteTotal: cards.length,
    failed,
  };
}

export function saveSessionPapers() {
  const s = useAuditStore.getState();
  const save = useDraftStore.getState().save;
  if (!s.host) return 0;
  const facts = { website: s.origin, host: s.host };
  let n = 0;
  if (s.pages.length) {
    save({
      id: `store-research::${s.host}`,
      slug: "store-research",
      title: `Research — ${s.host}`,
      createdAt: Date.now(),
      facts,
      draftText: s.pages
        .map(
          (p) =>
            `## ${p.label}\n${p.title}\n${p.url}\n(${p.chars.toLocaleString("en-IN")} characters)${p.hidden ? " · hidden" : ""}\n\n${p.text.slice(0, 12_000)}`,
        )
        .join("\n\n"),
      notes: s.missing.map((m) => m.label).join(", "),
      citations: s.citations,
    });
    n += 1;
  }
  if (s.findings) {
    save({
      id: `store-audit::${s.host}`,
      slug: "store-audit",
      title: `Store audit — ${s.host}`,
      createdAt: Date.now(),
      facts,
      draftText: s.findings,
      notes: s.missing.map((m) => m.label).join(", "),
      citations: s.citations,
    });
    n += 1;
  }
  for (const item of s.refined) {
    const parsed = parseDraftOutput(item.raw);
    save({
      id: `${item.slug}::${s.host}::${item.url || item.kind}`,
      slug: item.slug,
      title: `${item.title} — ${s.host}`,
      createdAt: Date.now(),
      facts: {
        ...facts,
        url: item.url,
        kind: item.kind,
        pageTitle: item.title,
      },
      draftText: parsed.draft,
      notes: parsed.notes,
      citations: s.citations,
    });
    n += 1;
  }
  const papers: [string, string, string][] = [
    ["store-gaps", "Gap register", s.gapsPaper],
    ["store-brief", "Client brief", s.briefPaper],
    ["store-questions", "Legal facts", s.questionsPaper],
    ["store-implement", "Implementations", s.implementPaper],
    ["store-selling", "Selling points", s.sellingPaper],
    ["store-email", "Forwarding emails", s.emailPaper],
    ["store-cold", "Cold email", s.coldPaper],
    ["store-agreement", "Service agreement", s.agreementPaper],
  ];
  for (const [slug, title, body] of papers) {
    if (!body) continue;
    save({
      id: `${slug}::${s.host}`,
      slug,
      title: `${title} — ${s.host}`,
      createdAt: Date.now(),
      facts,
      draftText: body,
      notes: "",
      citations: s.citations,
    });
    n += 1;
  }
  return n;
}

function researchAttempts(url: string) {
  const raw = url.trim();
  const out: string[] = [];
  const add = (u: string) => {
    const t = u.trim();
    if (t && !out.includes(t)) out.push(t);
  };
  add(raw);
  const stripped = raw.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
  add(stripped);
  add(`https://${stripped.replace(/^www\./i, "")}`);
  add(`https://www.${stripped.replace(/^www\./i, "")}`);
  return out;
}

async function researchWithRetry(url: string, signal?: AbortSignal) {
  let last:
    | Awaited<ReturnType<typeof researchStoreFn>>
    | { ok: false; error: string }
    | null = null;
  for (const candidate of researchAttempts(url)) {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      throwIfAborted(signal);
      try {
        const result = await researchStoreFn({ data: { url: candidate } });
        last = result;
        if (result.ok && result.pages.length) return result;
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        last = {
          ok: false,
          error: err instanceof Error ? err.message : "Could not read that website.",
        };
      }
      await pause(1400 * (attempt + 1));
    }
  }
  return last ?? { ok: false as const, error: "Could not read that website." };
}

async function paper(
  name: string,
  write: () => Promise<boolean>,
  failed: string[],
  signal?: AbortSignal,
) {
  throwIfAborted(signal);
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      if (await write()) return;
    } catch (err) {
      if ((err as Error).name === "AbortError") throw err;
    }
    await pause(1200 * (attempt + 1));
  }
  failed.push(name);
}

export async function runStoreSequence(
  url: string,
  opts?: {
    onProgress?: (p: SequenceProgress) => void;
    signal?: AbortSignal;
  },
): Promise<SequenceReport> {
  const mark = (step: number, title: string, rewrite?: SequenceProgress["rewrite"]) => {
    opts?.onProgress?.({ step, total: 10, title, rewrite });
  };
  const empty = (): SequenceReport => ({
    url,
    host: "",
    origin: "",
    ok: false,
    failed: ["Research live pages"],
    rewriteOk: 0,
    rewriteTotal: 0,
    pages: 0,
    saved: 0,
  });
  const failed: string[] = [];
  let rewriteOk = 0;
  let rewriteTotal = 0;

  try {
    mark(1, "Research live pages");
    throwIfAborted(opts?.signal);
    useAuditStore.getState().reset();
    useAuditStore.getState().setUrlInput(url);
    const researched = await researchWithRetry(url, opts?.signal);
    if (!researched.ok || !("pages" in researched) || !researched.pages.length) {
      return {
        ...empty(),
        host: researched.ok ? researched.host : "",
        origin: researched.ok ? researched.origin : "",
      };
    }
    useAuditStore.getState().setResearch({
      origin: researched.origin,
      host: researched.host,
      homeTitle: researched.homeTitle,
      pages: researched.pages,
      missing: researched.missing,
      hints: researched.hints,
    });
    usePipelineStore.getState().ensure(researched.host, researched.origin);

    mark(2, "Audit against Indian law");
    throwIfAborted(opts?.signal);
    let auditOk = false;
    for (let attempt = 0; attempt < 2 && !auditOk; attempt += 1) {
      try {
        const s0 = useAuditStore.getState();
        const audited = await auditStoreFn({
          data: {
            origin: s0.origin,
            host: s0.host,
            homeTitle: s0.homeTitle,
            hints: s0.hints ?? undefined,
            pages: s0.pages.map((p) => ({
              kind: p.kind,
              label: p.label,
              url: p.url,
              title: p.title,
              text: p.text.slice(0, 9000),
              hidden: Boolean(p.hidden),
              added: Boolean(p.added),
            })),
            missing: s0.missing,
            aiKeys: aiKeysPayload(),
          },
        });
        if (audited.ok) {
          rememberProvider(audited);
          useAuditStore.getState().setFindings(audited.text, audited.citations);
          auditOk = true;
        } else if (attempt === 1) {
          useAuditStore.getState().setFindings("", audited.citations);
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
      }
      if (!auditOk) await pause(1400 * (attempt + 1));
    }
    if (!auditOk) failed.push("Audit");

    mark(3, "Revise policies");
    if (useAuditStore.getState().findings) {
      try {
        const rewritten = await rewriteAllPolicies({
          signal: opts?.signal,
          onProgress: (rewrite) => mark(3, "Revise policies", rewrite),
        });
        rewriteOk = rewritten.rewriteOk;
        rewriteTotal = rewritten.rewriteTotal;
        if (!rewritten.ok) {
          failed.push(
            `Revise policies (${rewritten.rewriteOk}/${rewritten.rewriteTotal}${
              rewritten.failed.length ? ` — ${rewritten.failed.join(", ")}` : ""
            })`,
          );
        }
      } catch (err) {
        if ((err as Error).name === "AbortError") throw err;
        failed.push("Revise policies");
      }
    } else {
      failed.push("Revise policies");
    }

    mark(4, "Gaps");
    await paper(
      "Gaps",
      async () => {
        const result = await findPolicyGapsFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setGapsPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(5, "Client brief");
    await paper(
      "Client brief",
      async () => {
        const result = await writeClientBriefFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setBriefPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(6, "Legal facts");
    await paper(
      "Legal facts",
      async () => {
        const result = await writeQuestionnaireFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setQuestionsPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(7, "Implementations");
    await paper(
      "Implementations",
      async () => {
        const result = await writeImplementationsFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setImplementPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(8, "Selling points");
    await paper(
      "Selling points",
      async () => {
        const result = await writeSellingPointsFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setSellingPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(9, "Forwarding emails");
    await paper(
      "Forwarding emails",
      async () => {
        const result = await writeForwardEmailFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        useAuditStore.getState().setEmailPaper(result.text, result.citations);
        return true;
      },
      failed,
      opts?.signal,
    );

    mark(10, "Cold email");
    await paper(
      "Cold email",
      async () => {
        const result = await writeColdEmailFn({ data: improvedPayload() });
        if (!result.ok) return false;
        rememberProvider(result);
        const st = useAuditStore.getState();
        st.setColdPaper(result.text, result.citations);
        usePipelineStore.getState().startSequence(st.host, st.origin);
        return true;
      },
      failed,
      opts?.signal,
    );

    const saved = saveSessionPapers();
    const st = useAuditStore.getState();
    return {
      url,
      host: st.host,
      origin: st.origin,
      ok: failed.length === 0,
      failed,
      rewriteOk,
      rewriteTotal,
      pages: st.pages.length,
      saved,
    };
  } catch (err) {
    if ((err as Error).name === "AbortError") throw err;
    const st = useAuditStore.getState();
    const saved = st.host ? saveSessionPapers() : 0;
    return {
      url,
      host: st.host,
      origin: st.origin,
      ok: false,
      failed: failed.length ? failed : [err instanceof Error ? err.message : "Sequence failed"],
      rewriteOk,
      rewriteTotal,
      pages: st.pages.length,
      saved,
    };
  }
}

export function parseStoreList(text: string, limit = 50) {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/[\n\r,;|]+/)) {
    const line = raw.trim().replace(/^<|>$/g, "");
    if (!line || line.startsWith("#")) continue;
    const key = line
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/+$/, "")
      .toLowerCase();
    if (key.length < 4 || seen.has(key)) continue;
    seen.add(key);
    out.push(line);
    if (out.length >= limit) break;
  }
  return out;
}

export function mergeStoreLists(current: string, extra: string, limit = 50) {
  return parseStoreList(`${current}\n${extra}`, limit).join("\n");
}
