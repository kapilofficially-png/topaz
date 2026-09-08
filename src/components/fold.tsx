import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export function Fold({
  title,
  hint,
  badge,
  open,
  onToggle,
  children,
}: {
  title: string;
  hint?: string;
  badge?: ReactNode;
  open: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <section className="mt-8">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-3 rounded-[var(--radius-lg)] border border-border bg-surface px-4 py-3 text-left shadow-[var(--shadow-border)] transition-colors hover:bg-surface-2"
      >
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted transition-transform duration-[var(--motion-quick)]",
            open && "rotate-180",
          )}
        />
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg font-medium tracking-tight">
            {title}
          </span>
          {hint ? (
            <span className="mt-0.5 block text-[13px] text-muted">{hint}</span>
          ) : null}
        </span>
        {badge}
        <span className="shrink-0 text-[12px] tracking-wide text-muted uppercase">
          {open ? "Hide" : "Show"}
        </span>
      </button>
      {open ? <div className="mt-3">{children}</div> : null}
    </section>
  );
}
