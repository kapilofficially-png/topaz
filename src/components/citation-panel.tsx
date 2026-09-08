import { Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type Citation = {
  id: string;
  title: string;
  citation: string;
  statute: string;
  text: string;
  note?: string;
};

export function CitationPanel({
  citations,
  title = "Authorities retrieved",
  className,
}: {
  citations: Citation[];
  title?: string;
  className?: string;
}) {
  return (
    <aside
      className={cn(
        "flex min-h-0 flex-col rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <Scale className="size-4 text-primary" />
        <h3 className="text-sm font-medium">{title}</h3>
        <span className="ml-auto text-xs tabular-nums text-muted">
          {citations.length}
        </span>
      </div>
      <ScrollArea className="max-h-[28rem]">
        {citations.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted">
            Retrieved sections will appear here and be sent to the model as
            grounding context.
          </p>
        ) : (
          <ol className="divide-y divide-border">
            {citations.map((c, i) => (
              <li key={c.id} className="px-4 py-3">
                <div className="flex items-start gap-2">
                  <span className="mt-0.5 font-mono text-[11px] text-muted tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium">{c.citation}</p>
                    <p className="text-[13px] text-muted">{c.title}</p>
                    <Badge className="mt-1.5" variant="muted">
                      {c.statute}
                    </Badge>
                    <p className="mt-2 line-clamp-4 text-[13px] leading-relaxed text-muted">
                      {c.text}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </ScrollArea>
    </aside>
  );
}
