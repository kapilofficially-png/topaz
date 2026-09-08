import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { aiMeta, chat } from "./chat";
import { aiKeysSchema } from "./providers";

const retrieveInput = z.object({
  query: z.string().min(3).max(4000),
  k: z.number().int().min(1).max(12).optional(),
  categories: z.array(z.string()).optional(),
});

const draftInput = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  instructions: z.string().min(1).max(4000),
  facts: z.record(z.string(), z.string()),
  ragQuery: z.string().min(1).max(4000),
  aiKeys: aiKeysSchema,
});

const refineInput = z.object({
  slug: z.string().min(1).max(80),
  title: z.string().min(1).max(200),
  currentDraft: z.string().min(20).max(24000),
  instruction: z.string().min(3).max(2000),
  ragQuery: z.string().min(1).max(4000),
  aiKeys: aiKeysSchema,
});

const askInput = z.object({
  question: z.string().min(8).max(2500),
  aiKeys: aiKeysSchema,
});

function formatAuthorities(
  chunks: {
    citation: string;
    title: string;
    statute: string;
    text: string;
    note?: string;
  }[],
) {
  return chunks
    .map((c, i) => {
      const note = c.note ? `\nDrafting note: ${c.note}` : "";
      return `[${i + 1}] ${c.citation} — ${c.title} (${c.statute})\n${c.text}${note}`;
    })
    .join("\n\n");
}

const SYSTEM_DRAFTER = `You are NyayaDraft, an Indian legal drafting aid. You write court-ready and chambers-ready instruments grounded in the RETRIEVED AUTHORITIES supplied with each request.

Hard rules:
- Ground every legal proposition in the retrieved statute or case rows. Never invent AIR, SCC, SCR, or unreported citations. If a holding is not in the retrieved set, do not name the case.
- Prefer BNS / BNSS / BSA (from 1 July 2024) over repealed IPC / CrPC / IEA, and map old section numbers when the facts use them.
- Do not invent facts, dates, amounts, GSTIN, CIN, or party names. Use [TO BE COMPLETED] for blanks.
- Indian English. Numbered clauses. No US/UK boilerplate (as-is waivers, Delaware forum, GDPR legitimate interest) unless the instrument is a store policy and the facts demand an India-law rewrite of that residue.
- This is not a solicitor-client opinion and does not create an advocate–client relationship.

Return EXACTLY three markdown sections, in this order:

## DRAFT
The full instrument.

## AUTHORITIES RELIED ON
Bullets matching the retrieved set only (statute heads and any case rows actually retrieved). If no case was retrieved, write "No case on this point in the local corpus."

## DRAFTING NOTES
Filing/stamping caveats, missing facts, and what an enrolled advocate must verify before the paper leaves chambers.`;

const SYSTEM_ASK = `You are NyayaDraft's library counsel. Answer questions of Indian law using ONLY the retrieved authorities plus uncontroversial procedure. Prefer BNS/BNSS/BSA over repealed IPC/CrPC/IEA. Never invent case citations. If the corpus is thin, say so and answer at a high level.

Structure:
1. Short answer (plain English).
2. Governing provisions (cited).
3. How it plays out in drafting or procedure.
4. Caveats.

Close with: "This is not legal advice. Instruct an enrolled advocate on the facts."`;

export const searchAuthorities = createServerFn({ method: "POST" })
  .validator((input: unknown) => retrieveInput.parse(input))
  .handler(async ({ data }) => {
    const { retrieve } = await import("@/lib/rag/retrieve");
    const hits = retrieve({
      query: data.query,
      k: data.k ?? 8,
      categories: data.categories as
        | import("@/lib/rag/types").LawCategory[]
        | undefined,
    });
    return {
      hits: hits.map(({ score: _s, ...rest }) => rest),
    };
  });

export const getAuthority = createServerFn({ method: "POST" })
  .validator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data }) => {
    const { getChunk } = await import("@/lib/rag/retrieve");
    const chunk = getChunk(data.id);
    return { chunk: chunk ?? null };
  });

export const listAuthorities = createServerFn({ method: "POST" })
  .validator((input: unknown) =>
    z
      .object({
        category: z.string().optional(),
        q: z.string().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    const { listCorpus, retrieve, corpusStats } = await import(
      "@/lib/rag/retrieve"
    );
    const stats = corpusStats();
    if (data.q && data.q.trim().length >= 2) {
      const hits = retrieve({
        query: data.q,
        k: 24,
        categories: data.category
          ? [data.category as import("@/lib/rag/types").LawCategory]
          : undefined,
      });
      return { stats, chunks: hits.map(({ score: _s, ...c }) => c) };
    }
    const chunks = listCorpus(
      data.category as import("@/lib/rag/types").LawCategory | undefined,
    );
    return { stats, chunks };
  });

export const generateDraft = createServerFn({ method: "POST" })
  .validator((input: unknown) => draftInput.parse(input))
  .handler(async ({ data }) => {
    const { retrieve } = await import("@/lib/rag/retrieve");
    const factBlob = Object.entries(data.facts)
      .filter(([, v]) => v && v.trim())
      .map(([k, v]) => `${k}: ${v}`)
      .join("\n");
    const hits = retrieve({
      query: `${data.ragQuery}\n${data.title}\n${factBlob}`,
      k: 8,
    });

    const result = await chat({
      keys: data.aiKeys,
      maxTokens: 3200,
      messages: [
        { role: "system", content: SYSTEM_DRAFTER },
        {
          role: "user",
          content: `Instrument: ${data.title} (${data.slug})

Drafting instructions:
${data.instructions}

Facts supplied by the user:
${factBlob || "(none)"}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`,
        },
      ],
    });

    if (!result.ok) {
      return {
        ok: false as const,
        error: result.error,
        citations: hits,
      };
    }

    return {
      ok: true as const,
      text: result.text,
      citations: hits,
      ...aiMeta(result),
    };
  });

export const refineDraft = createServerFn({ method: "POST" })
  .validator((input: unknown) => refineInput.parse(input))
  .handler(async ({ data }) => {
    const { retrieve } = await import("@/lib/rag/retrieve");
    const hits = retrieve({ query: `${data.ragQuery}\n${data.instruction}`, k: 6 });
    const result = await chat({
      keys: data.aiKeys,
      maxTokens: 3200,
      messages: [
        { role: "system", content: SYSTEM_DRAFTER },
        {
          role: "user",
          content: `Revise the following Indian legal draft (${data.title}).
Revision instruction: ${data.instruction}

Return the full revised document in the same three-section format.

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}

CURRENT DRAFT:
${data.currentDraft}`,
        },
      ],
    });
    if (!result.ok) {
      return { ok: false as const, error: result.error, citations: hits };
    }
    return { ok: true as const, text: result.text, citations: hits, ...aiMeta(result) };
  });

export const askTheLaw = createServerFn({ method: "POST" })
  .validator((input: unknown) => askInput.parse(input))
  .handler(async ({ data }) => {
    const { retrieve } = await import("@/lib/rag/retrieve");
    const hits = retrieve({ query: data.question, k: 8 });
    const result = await chat({
      keys: data.aiKeys,
      maxTokens: 1400,
      temperature: 0.2,
      messages: [
        { role: "system", content: SYSTEM_ASK },
        {
          role: "user",
          content: `Question: ${data.question}

RETRIEVED AUTHORITIES:
${formatAuthorities(hits)}`,
        },
      ],
    });
    if (!result.ok) {
      return { ok: false as const, error: result.error, citations: hits };
    }
    return { ok: true as const, text: result.text, citations: hits, ...aiMeta(result) };
  });
