import { jsPDF } from "jspdf";

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_X = 18;
const MARGIN_TOP = 22;
const MARGIN_BOTTOM = 18;
const CONTENT_W = PAGE_W - MARGIN_X * 2;
const NAVY: [number, number, number] = [31, 58, 77];
const STAMP: [number, number, number] = [122, 46, 36];
const MUTED: [number, number, number] = [92, 86, 76];
const RULE: [number, number, number] = [196, 184, 164];
const INK: [number, number, number] = [26, 26, 26];

export type MasterSection = {
  title: string;
  body: string;
};

export type MasterPdfInput = {
  host: string;
  homeTitle: string;
  origin: string;
  profile: string;
  sections: MasterSection[];
  filename?: string;
  kicker?: string;
};

const CHAR_MAP: Record<string, string> = {
  "₹": "Rs. ",
  "—": "-",
  "–": "-",
  "“": '"',
  "”": '"',
  "‘": "'",
  "’": "'",
  "…": "...",
  "•": "-",
  "✔": "[x]",
  "×": "x",
  "\u00a0": " ",
  "\u202f": " ",
};

function pdfSafe(raw: string) {
  return raw
    .replace(/[\u2018\u2019\u201A]/g, "'")
    .replace(/[\u201C\u201D\u201E]/g, '"')
    .replace(/./gu, (ch) => {
      if (CHAR_MAP[ch]) return CHAR_MAP[ch];
      const code = ch.charCodeAt(0);
      if (code === 9 || code === 10 || code === 13) return ch;
      if (code >= 32 && code <= 126) return ch;
      if (code >= 160 && code <= 255) return ch;
      return "";
    })
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n");
}

function stripMd(line: string) {
  return pdfSafe(line.replace(/\*\*/g, "").replace(/^#{1,3}\s+/, ""));
}

export async function downloadMasterPdf(input: MasterPdfInput) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const dateLine = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const filled = input.sections.filter((s) => s.body.trim());
  const contents = [
    "Store profile",
    ...filled.map((s) => s.title),
  ];

  drawCover(doc, input, dateLine, contents);
  addProfile(doc, input.profile, dateLine, input.host);
  for (const section of filled) {
    addSection(doc, section.title, section.body, dateLine, input.host);
  }
  stampFooters(doc, input.host, dateLine);

  const filename =
    input.filename ??
    `NyayaDraft-${input.host.replace(/[^\w.-]+/g, "-")}-master.pdf`;
  doc.save(filename);
}

function drawCover(
  doc: jsPDF,
  input: MasterPdfInput,
  dateLine: string,
  contents: string[],
) {
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
  doc.text(input.kicker ?? "CONFIDENTIAL  ·  MASTER FILE", PAGE_W - MARGIN_X, 18, { align: "right" });
  doc.setFont("times", "normal");
  doc.text(dateLine, PAGE_W - MARGIN_X, 24, { align: "right" });

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
  doc.setLineWidth(0.3);
  doc.line(MARGIN_X, afterTitle + 18, PAGE_W - MARGIN_X, afterTitle + 18);

  doc.setTextColor(...STAMP);
  doc.setFont("times", "bold");
  doc.setFontSize(9);
  doc.text("CONTENTS", MARGIN_X, afterTitle + 28);

  doc.setTextColor(...INK);
  doc.setFont("times", "normal");
  doc.setFontSize(11);
  let y = afterTitle + 36;
  contents.forEach((item, i) => {
    if (y > PAGE_H - 40) return;
    doc.text(`${i + 1}.  ${pdfSafe(item)}`, MARGIN_X, y);
    y += 7;
  });

  doc.setFont("times", "italic");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  const disclaimer =
    "Working draft compiled from this session. Not a solicitor-client opinion. Review before publication or filing.";
  doc.text(doc.splitTextToSize(disclaimer, CONTENT_W), MARGIN_X, PAGE_H - 28);
}

function addProfile(doc: jsPDF, profile: string, dateLine: string, host: string) {
  addSection(doc, "Store profile", profile, dateLine, host);
}

function addSection(
  doc: jsPDF,
  title: string,
  body: string,
  _dateLine: string,
  _host: string,
) {
  doc.addPage();
  writeSectionHeading(doc, title, body);
  void _dateLine;
  void _host;
}

function writeSectionHeading(doc: jsPDF, title: string, body: string, yStart?: number) {
  let y = yStart ?? MARGIN_TOP;

  doc.setFillColor(...NAVY);
  doc.rect(MARGIN_X, y - 6, CONTENT_W, 10, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");
  doc.setFontSize(11);
  doc.text(pdfSafe(title).toUpperCase(), MARGIN_X + 3, y + 1);
  y += 12;

  writeBody(doc, body, y);
}

export async function downloadPaperPdf(opts: {
  host: string;
  title: string;
  body: string;
  filename: string;
}) {
  const doc = new jsPDF({ unit: "mm", format: "a4", compress: true });
  const dateLine = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  writeSectionHeading(doc, opts.title, opts.body);
  stampFooters(doc, opts.host, dateLine);
  doc.save(opts.filename);
}

function ensureSpace(doc: jsPDF, y: number, need: number) {
  if (y + need <= PAGE_H - MARGIN_BOTTOM) return y;
  doc.addPage();
  return MARGIN_TOP;
}

function writeBody(doc: jsPDF, markdown: string, startY: number) {
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
      const rows: string[] = [];
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
      doc.setTextColor(...(level === 2 ? NAVY : STAMP));
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
      const wrapped = doc.splitTextToSize(text, CONTENT_W - 6);
      doc.setTextColor(...STAMP);
      doc.text("-", MARGIN_X, y);
      doc.setTextColor(...INK);
      doc.text(wrapped, MARGIN_X + 5, y);
      y += wrapped.length * 5 + 1.5;
      i += 1;
      continue;
    }
    if (/^\s*\d+(?:\.\d+)*[.)]\s+/.test(raw)) {
      const m = raw.match(/^\s*(\d+(?:\.\d+)*)[.)]\s+(.*)$/);
      const n = m?.[1] ?? "1";
      const text = stripMd(m?.[2] ?? raw);
      const nested = n.includes(".");
      y = ensureSpace(doc, y, 8);
      doc.setFont("times", nested ? "normal" : "bold");
      doc.setFontSize(nested ? 10.5 : 11);
      doc.setTextColor(...(nested ? INK : NAVY));
      const mark = `${n}.`;
      const indent = nested ? 6 : 0;
      doc.text(mark, MARGIN_X + indent, y);
      doc.setFont("times", "normal");
      doc.setTextColor(...INK);
      const wrapped = doc.splitTextToSize(text, CONTENT_W - 10 - indent);
      doc.text(wrapped, MARGIN_X + 8 + indent + (n.length > 2 ? n.length : 0), y);
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

function writeTable(doc: jsPDF, rows: string[], startY: number) {
  let y = startY + 2;
  doc.setFontSize(9);
  for (let r = 0; r < rows.length; r++) {
    const cells = rows[r]
      .trim()
      .replace(/^\|/, "")
      .replace(/\|$/, "")
      .split("|")
      .map((c) => stripMd(c.trim()));
    const line = cells.join("  |  ");
    const wrapped = doc.splitTextToSize(line, CONTENT_W);
    y = ensureSpace(doc, y, wrapped.length * 4.5 + 2);
    doc.setFont("times", r === 0 ? "bold" : "normal");
    doc.setTextColor(...(r === 0 ? MUTED : INK));
    doc.text(wrapped, MARGIN_X, y);
    y += wrapped.length * 4.5 + 1.5;
  }
  return y + 3;
}

function stampFooters(doc: jsPDF, host: string, dateLine: string) {
  const total = doc.getNumberOfPages();
  for (let p = 1; p <= total; p++) {
    doc.setPage(p);
    doc.setDrawColor(...RULE);
    doc.setLineWidth(0.25);
    doc.line(MARGIN_X, PAGE_H - 12, PAGE_W - MARGIN_X, PAGE_H - 12);
    doc.setFont("times", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...MUTED);
    const left = pdfSafe(`NyayaDraft  ·  ${host}  ·  ${dateLine}`);
    doc.text(left, MARGIN_X, PAGE_H - 7);
    doc.text(`Page ${p} of ${total}`, PAGE_W - MARGIN_X, PAGE_H - 7, { align: "right" });
  }
}

export type OriginalPolicyPage = {
  label: string;
  title: string;
  url: string;
  text: string;
  chars: number;
};

export async function downloadOriginalPoliciesPdf(input: {
  host: string;
  homeTitle: string;
  origin: string;
  pages: OriginalPolicyPage[];
  filename?: string;
}) {
  const pages = input.pages.filter((p) => p.text.trim());
  if (!pages.length) {
    throw new Error("No original policy text to export.");
  }
  const profile = [
    `Store: ${input.homeTitle || input.host}`,
    `Host: ${input.host}`,
    `URL: ${input.origin}`,
    `Captured: ${new Date().toLocaleString("en-IN")}`,
    "",
    "These are the live pages as NyayaDraft crawled them — not a rewrite.",
    "",
    "Pages in this file",
    ...pages.map(
      (p) =>
        `- ${p.label} — ${p.title}\n  ${p.url} (${p.chars.toLocaleString("en-IN")} characters)`,
    ),
  ].join("\n");

  await downloadMasterPdf({
    host: input.host,
    homeTitle: `${input.homeTitle || input.host} — original policies`,
    origin: input.origin,
    profile,
    kicker: "ORIGINAL POLICIES  ·  AS CRAWLED",
    filename:
      input.filename ??
      `NyayaDraft-${input.host.replace(/[^\w.-]+/g, "-")}-original-policies.pdf`,
    sections: pages.map((p) => ({
      title: policySectionTitle(p),
      body: `${p.title}\n${p.url}\n\nAs crawled. Not a NyayaDraft rewrite.\n\n${p.text}`,
    })),
  });
}

function policySectionTitle(p: OriginalPolicyPage) {
  const t = p.title.replace(/\s+/g, " ").trim();
  if (
    t &&
    t.length <= 80 &&
    /policy|terms|privacy|refund|return|shipping|delivery|consent|cancellation|conditions|cookies/i.test(t) &&
    !/refer\s*&\s*earn|superpower|lorem/i.test(t)
  ) {
    return t;
  }
  return p.label;
}
