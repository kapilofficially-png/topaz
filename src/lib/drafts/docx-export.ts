import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  Header,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  VerticalAlign,
  WidthType,
  convertInchesToTwip,
} from "docx";

const NAVY = "1F3A4D";
const STAMP = "7A2E24";
const INK = "1A1A1A";
const MUTED = "5C564C";
const RULE = "C4B8A4";
const PAPER = "F7F3EA";

export type DocxMatter = {
  title: string;
  subtitle?: string;
  host?: string;
  body: string;
  filename: string;
};

function runs(text: string, opts?: { bold?: boolean; italics?: boolean; size?: number; color?: string; font?: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g).filter((p) => p.length);
  if (!parts.length) {
    return [
      new TextRun({
        text: "",
        font: opts?.font ?? "Cambria",
        size: opts?.size ?? 22,
        color: opts?.color ?? INK,
      }),
    ];
  }
  return parts.map((part) => {
    const bold = opts?.bold || (part.startsWith("**") && part.endsWith("**"));
    const clean = bold && part.startsWith("**") ? part.slice(2, -2) : part;
    return new TextRun({
      text: clean,
      bold,
      italics: opts?.italics,
      font: opts?.font ?? "Cambria",
      size: opts?.size ?? 22,
      color: opts?.color ?? INK,
    });
  });
}

function cellsOf(row: string) {
  return row
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((c) => c.trim());
}

function isDivider(row: string) {
  return /^\s*\|?\s*:?-{3,}/.test(row);
}

function hairline() {
  return {
    style: BorderStyle.SINGLE,
    size: 6,
    color: RULE,
  };
}

function letterhead(subtitle: string, dateLine: string) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      bottom: { style: BorderStyle.SINGLE, size: 12, color: STAMP },
      insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
      insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 62, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            margins: { bottom: 80, top: 40 },
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: "NYAYADRAFT",
                    bold: true,
                    font: "Calibri",
                    size: 22,
                    color: NAVY,
                    characterSpacing: 240,
                  }),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({
                    text: "India-law drafting  ·  working draft",
                    font: "Calibri",
                    size: 16,
                    color: MUTED,
                    italics: true,
                  }),
                ],
              }),
            ],
          }),
          new TableCell({
            width: { size: 38, type: WidthType.PERCENTAGE },
            verticalAlign: VerticalAlign.CENTER,
            margins: { bottom: 80, top: 40 },
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "CONFIDENTIAL",
                    bold: true,
                    font: "Calibri",
                    size: 16,
                    color: STAMP,
                    characterSpacing: 120,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: dateLine,
                    font: "Calibri",
                    size: 16,
                    color: MUTED,
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: subtitle,
                    font: "Calibri",
                    size: 16,
                    color: MUTED,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  });
}

function tableFrom(rows: string[]) {
  const bodyRows = rows.filter((r) => !isDivider(r));
  if (!bodyRows.length) return null;
  const head = cellsOf(bodyRows[0]);
  const rest = bodyRows.slice(1);
  const colW = Math.floor(100 / Math.max(head.length, 1));
  const border = hairline();
  const makeCell = (text: string, header: boolean) =>
    new TableCell({
      width: { size: colW, type: WidthType.PERCENTAGE },
      shading: header ? { type: "clear", fill: PAPER, color: "auto" } : undefined,
      margins: { top: 60, bottom: 60, left: 80, right: 80 },
      borders: { top: border, bottom: border, left: border, right: border },
      children: [
        new Paragraph({
          children: runs(text, {
            bold: header,
            size: header ? 16 : 18,
            font: "Calibri",
            color: header ? MUTED : INK,
          }),
        }),
      ],
    });
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        tableHeader: true,
        children: head.map((c) => makeCell(c, true)),
      }),
      ...rest.map(
        (r) =>
          new TableRow({
            children: cellsOf(r).map((c) => makeCell(c, false)),
          }),
      ),
    ],
  });
}

function bodyChildren(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const out: (Paragraph | Table)[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      out.push(new Paragraph({ spacing: { after: 80 }, children: [] }));
      i += 1;
      continue;
    }
    if (line.trim().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i]);
        i += 1;
      }
      const table = tableFrom(rows);
      if (table) out.push(table);
      out.push(new Paragraph({ spacing: { after: 120 }, children: [] }));
      continue;
    }
    if (/^#{1,3}\s/.test(line)) {
      const level = line.startsWith("###") ? 3 : 2;
      const text = line.replace(/^#{1,3}\s+/, "").replace(/\*+/g, "");
      out.push(
        new Paragraph({
          spacing: { before: level === 2 ? 280 : 200, after: 80 },
          border:
            level === 2
              ? { bottom: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 4 } }
              : undefined,
          children: [
            new TextRun({
              text: text.toUpperCase(),
              bold: true,
              font: "Calibri",
              size: level === 2 ? 22 : 20,
              color: level === 2 ? NAVY : STAMP,
              characterSpacing: level === 2 ? 80 : 40,
            }),
          ],
        }),
      );
      i += 1;
      continue;
    }
    if (/^\s*[-*•]\s+/.test(line) || /^✔/.test(line)) {
      const text = line.replace(/^\s*[-*•]\s+/, "").replace(/^✔\s*/, "");
      out.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) },
          spacing: { after: 60, line: 276 },
          children: [
            new TextRun({ text: "•  ", font: "Calibri", size: 22, color: STAMP }),
            ...runs(text),
          ],
        }),
      );
      i += 1;
      continue;
    }
    if (/^\s*\d+[.)]\s+/.test(line)) {
      const m = line.match(/^\s*(\d+)[.)]\s+(.*)$/);
      const n = m?.[1] ?? "1";
      const text = m?.[2] ?? line;
      out.push(
        new Paragraph({
          indent: { left: convertInchesToTwip(0.32), hanging: convertInchesToTwip(0.28) },
          spacing: { after: 80, line: 288 },
          children: [
            new TextRun({ text: `${n}.  `, bold: true, font: "Cambria", size: 22, color: NAVY }),
            ...runs(text),
          ],
        }),
      );
      i += 1;
      continue;
    }
    out.push(
      new Paragraph({
        spacing: { after: 120, line: 288 },
        alignment: AlignmentType.JUSTIFIED,
        children: runs(line),
      }),
    );
    i += 1;
  }
  return out;
}

function footerPara() {
  return new Paragraph({
    border: { top: { style: BorderStyle.SINGLE, size: 6, color: RULE, space: 8 } },
    spacing: { before: 80 },
    children: [
      new TextRun({
        text: "NyayaDraft working draft — not a solicitor-client opinion. Review before publication.   ",
        font: "Calibri",
        size: 14,
        italics: true,
        color: MUTED,
      }),
      new TextRun({
        text: "Page ",
        font: "Calibri",
        size: 14,
        color: MUTED,
      }),
      new TextRun({
        children: [PageNumber.CURRENT],
        font: "Calibri",
        size: 14,
        color: MUTED,
      }),
      new TextRun({
        text: " of ",
        font: "Calibri",
        size: 14,
        color: MUTED,
      }),
      new TextRun({
        children: [PageNumber.TOTAL_PAGES],
        font: "Calibri",
        size: 14,
        color: MUTED,
      }),
    ],
  });
}

export async function downloadDraftDocx(matter: DocxMatter) {
  const dateLine = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const matterLine = [matter.host, "internal use only"].filter(Boolean).join("  ·  ");
  const doc = new Document({
    styles: {
      default: {
        document: {
          run: { font: "Cambria", size: 22, color: INK },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertInchesToTwip(8.27),
              height: convertInchesToTwip(11.69),
            },
            margin: {
              top: convertInchesToTwip(0.85),
              bottom: convertInchesToTwip(0.9),
              left: convertInchesToTwip(0.95),
              right: convertInchesToTwip(0.95),
            },
          },
        },
        headers: {
          default: new Header({
            children: [letterhead(matter.subtitle || matterLine, dateLine)],
          }),
        },
        footers: {
          default: new Footer({ children: [footerPara()] }),
        },
        children: [
          new Paragraph({ spacing: { after: 80 }, children: [] }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { after: 60 },
            children: [
              new TextRun({
                text: matter.title,
                bold: true,
                font: "Cambria",
                size: 36,
                color: NAVY,
              }),
            ],
          }),
          matter.subtitle
            ? new Paragraph({
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                children: [
                  new TextRun({
                    text: matter.subtitle,
                    italics: true,
                    font: "Calibri",
                    size: 20,
                    color: MUTED,
                  }),
                ],
              })
            : new Paragraph({ spacing: { after: 160 }, children: [] }),
          ...bodyChildren(matter.body.trim() || " "),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = matter.filename.endsWith(".docx") ? matter.filename : `${matter.filename}.docx`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadMasterDocx(input: {
  host: string;
  homeTitle: string;
  profile: string;
  sections: { title: string; body: string }[];
  filename?: string;
  title?: string;
}) {
  const filled = input.sections.filter((s) => s.body.trim());
  const body = [
    "## Store profile",
    input.profile,
    ...filled.flatMap((s) => [`## ${s.title}`, s.body]),
  ].join("\n\n");
  await downloadDraftDocx({
    title: input.title ?? `${input.homeTitle || input.host} — master file`,
    subtitle: "CONFIDENTIAL  ·  every paper from this store",
    host: input.host,
    body,
    filename:
      input.filename ??
      `NyayaDraft-${input.host.replace(/[^\w.-]+/g, "-")}-master.docx`,
  });
}
