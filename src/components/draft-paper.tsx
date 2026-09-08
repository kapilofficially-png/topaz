import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

function inline(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, j) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={j} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      <span key={j}>{part}</span>
    ),
  );
}

function cells(row: string) {
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

function renderTable(rows: string[], key: number) {
  const bodyRows = rows.filter((r) => !isDivider(r));
  if (!bodyRows.length) return null;
  const head = cells(bodyRows[0]);
  const rest = bodyRows.slice(1);
  return (
    <div key={key} className="my-4 overflow-x-auto">
      <table className="w-full min-w-[28rem] border-collapse text-left text-[13px] leading-relaxed">
        <thead>
          <tr>
            {head.map((c, i) => (
              <th
                key={i}
                className="border-b border-border px-2 py-2 font-sans text-[11px] font-medium tracking-wide text-muted uppercase"
              >
                {inline(c)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rest.map((r, i) => (
            <tr key={i}>
              {cells(r).map((c, j) => (
                <td key={j} className="border-b border-border/70 px-2 py-2 align-top">
                  {inline(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function renderLine(line: string, i: number) {
  if (!line.trim()) return <div key={i} className="h-3" />;
  if (/^#{1,3}\s/.test(line)) {
    return (
      <h3
        key={i}
        className="mt-6 mb-2 text-center font-display text-lg font-medium tracking-tight first:mt-0"
      >
        {line.replace(/^#{1,3}\s/, "")}
      </h3>
    );
  }
  if (/^\s*[-*•]\s+/.test(line) || /^✔/.test(line)) {
    const rest = line.replace(/^\s*[-*•]\s+/, "").replace(/^✔\s*/, "");
    return (
      <p key={i} className="flex gap-2 pl-1 text-[15px] leading-[1.7]">
        <span aria-hidden className="mt-1 text-primary">
          •
        </span>
        <span>{inline(rest)}</span>
      </p>
    );
  }
  return (
    <p key={i} className="text-[15px] leading-[1.7]">
      {inline(line)}
    </p>
  );
}

function renderBody(body: string) {
  const lines = body.split("\n");
  const nodes: ReactNode[] = [];
  let i = 0;
  while (i < lines.length) {
    if (lines[i].trim().startsWith("|")) {
      const rows: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(lines[i]);
        i += 1;
      }
      nodes.push(renderTable(rows, nodes.length));
      continue;
    }
    nodes.push(renderLine(lines[i], i));
    i += 1;
  }
  return nodes;
}

export function DraftPaper({
  title,
  body,
  emptyHint,
  className,
}: {
  title?: string;
  body: string;
  emptyHint?: string;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-lg)] bg-paper text-ink shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-2 bg-primary/80"
      />
      <div className="border-b border-border/80 px-8 py-4 sm:px-12">
        <p className="text-[11px] tracking-[0.18em] text-muted uppercase">
          Draft for review
        </p>
        {title ? (
          <h2 className="mt-1 font-display text-xl font-medium tracking-tight">
            {title}
          </h2>
        ) : null}
      </div>
      <div className="px-8 py-8 sm:px-12">
        {body ? (
          <div className="font-serif">{renderBody(body)}</div>
        ) : (
          <p className="font-serif text-muted italic">{emptyHint}</p>
        )}
      </div>
    </article>
  );
}
