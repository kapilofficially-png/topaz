export type ParsedDraft = {
  draft: string;
  authorities: string;
  notes: string;
  raw: string;
};

function sliceSection(source: string, heading: string, next?: string | null) {
  const re = new RegExp(`^##\\s*${heading}\\s*$`, "im");
  const match = re.exec(source);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  let end = source.length;
  if (next) {
    const nextRe = new RegExp(`^##\\s*${next}\\s*$`, "im");
    const n = nextRe.exec(source.slice(start));
    if (n && n.index !== undefined) end = start + n.index;
  }
  return source.slice(start, end).trim();
}

export function parseDraftOutput(text: string): ParsedDraft {
  const draft =
    sliceSection(text, "DRAFT", "AUTHORITIES RELIED ON") ||
    sliceSection(text, "DRAFT") ||
    text.trim();
  return {
    draft,
    authorities: sliceSection(text, "AUTHORITIES RELIED ON", "DRAFTING NOTES"),
    notes: sliceSection(text, "DRAFTING NOTES"),
    raw: text,
  };
}

export function downloadText(filename: string, contents: string) {
  const blob = new Blob([contents], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export type StoreQuestion = {
  id: string;
  severity: string;
  title: string;
  why: string;
  hint: string;
};

export function parseStoreQuestions(md: string): StoreQuestion[] {
  const chunks = md.split(/^###\s+/m).slice(1);
  const out: StoreQuestion[] = [];
  for (const chunk of chunks) {
    const [first, ...rest] = chunk.split("\n");
    const head = (first ?? "").trim();
    if (!/^[QC]\d+/i.test(head) && !/HIGH|MEDIUM|LOW/i.test(head)) continue;
    const m = head.match(/^([QC]\d+)\s*[—–-]\s*(HIGH|MEDIUM|LOW)\s*[—–-]\s*(.+)$/i);
    const id = (m?.[1] ?? `C${out.length + 1}`).toUpperCase();
    const severity = (m?.[2] ?? "MEDIUM").toUpperCase();
    const title = (m?.[3] ?? head.replace(/^[QC]\d+\s*[—–-]\s*/i, "")).trim();
    const body = rest.join("\n");
    const why =
      body.match(/\*\*Why[^*]*:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i)?.[1]?.trim() ?? "";
    const hint =
      body.match(
        /\*\*(?:Good answer looks like|Hint|Placeholder)[^*]*:\*\*\s*([\s\S]*?)(?=\n\*\*|$)/i,
      )?.[1]?.trim() ?? "";
    out.push({ id, severity, title, why, hint });
  }
  return out.slice(0, 12);
}

export function applyQuestionnaireAnswers(
  md: string,
  answers: Record<string, string>,
): string {
  const chunks = md.split(/^(?=###\s+)/m);
  return chunks
    .map((chunk) => {
      const head = chunk.match(/^###\s+([QC]\d+)/i)?.[1]?.toUpperCase();
      if (!head) return chunk;
      const answer = answers[head]?.trim();
      if (!answer) return chunk;
      if (/\*\*Your answer:\*\*/i.test(chunk)) {
        return chunk.replace(
          /\*\*Your answer:\*\*[\s\S]*?(?=\n###|\n##|$)/i,
          `**Your answer:** ${answer}\n\n`,
        );
      }
      return `${chunk.trimEnd()}\n\n**Your answer:** ${answer}\n\n`;
    })
    .join("");
}

export type ForwardEmail = {
  heading: string;
  to: string;
  subject: string;
  body: string;
};

export function parseForwardEmails(md: string): ForwardEmail[] {
  const chunks = md.split(/^##\s+/m).slice(1);
  const out: ForwardEmail[] = [];
  for (const chunk of chunks) {
    const [first, ...rest] = chunk.split("\n");
    const heading = (first ?? "").trim();
    if (
      !/email|notice|developer|advocate|customer|whatsapp|follow|pitch|outreach|dm|bump|break|pack|one-pager|day \d+/i.test(
        heading,
      )
    )
      continue;
    if (
      /call script|sample clause|hooks|layman|authorities|drafting notes|sequence|do not claim|cover|schedule/i.test(
        heading,
      )
    )
      continue;
    const bodyMd = rest.join("\n");
    const field = (label: string) =>
      bodyMd.match(new RegExp(`\\*\\*${label}:\\*\\*\\s*([^\\n]+)`, "i"))?.[1]?.trim() ?? "";
    let body = sliceLoose(bodyMd, "Body") || sliceLoose(bodyMd, "Email body");
    if (!body) {
      body = bodyMd
        .replace(/\*\*To:\*\*[^\n]*\n?/i, "")
        .replace(/\*\*Subject:\*\*[^\n]*\n?/i, "")
        .trim();
    }
    out.push({
      heading,
      to: field("To").replace(/^mailto:/i, ""),
      subject: field("Subject"),
      body: body.trim(),
    });
  }
  return out;
}

function sliceLoose(source: string, heading: string) {
  const re = new RegExp(`\\*\\*${heading}:\\*\\*\\s*`, "i");
  const match = re.exec(source);
  if (!match || match.index === undefined) return "";
  const start = match.index + match[0].length;
  const next = source.slice(start).search(/\n\*\*[A-Za-z].{0,24}:\*\*/);
  return source.slice(start, next === -1 ? undefined : start + next).trim();
}

export function mailtoHref(to: string, subject: string, body: string) {
  const addr = to && !/\[|placeholder|to be/i.test(to) ? to : "";
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject.slice(0, 180));
  if (body) params.set("body", body.slice(0, 1600));
  const q = params.toString();
  return `mailto:${addr}${q ? `?${q}` : ""}`;
}

export function parseNamedBlock(md: string, heading: string) {
  return sliceSection(md, heading) || sliceSection(md, heading.replace(/[—–].*$/, "").trim());
}

export function sampleClauseText(md: string) {
  const block =
    sliceSection(md, "SAMPLE CLAUSE — NOT FOR PUBLICATION", "EMAIL 1") ||
    sliceSection(md, "SAMPLE CLAUSE — NOT FOR PUBLICATION") ||
    sliceSection(md, "SAMPLE CLAUSE", "EMAIL 1") ||
    "";
  return block.trim();
}

export function callScriptText(md: string) {
  return (
    sliceSection(md, "CALL SCRIPT", "DO NOT CLAIM") ||
    sliceSection(md, "CALL SCRIPT") ||
    ""
  ).trim();
}

export function emailCta(heading: string) {
  const h = heading.toLowerCase();
  if (/whatsapp|dm/.test(h)) return "Open WhatsApp";
  if (/day 21|break/.test(h)) return "Open break-up";
  if (/day 14|pack|fee/.test(h)) return "Open pack email";
  if (/day 7|second gap/.test(h)) return "Open day 7";
  if (/day 3|bump/.test(h)) return "Open bump";
  if (/day 0|one-pager|short pitch|email 1/.test(h)) return "Open day 0";
  return "Open mail";
}
