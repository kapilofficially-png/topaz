import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { BrandMark } from "@/components/brand-mark";
import { cn } from "@/lib/utils";
import { getProvider } from "@/lib/ai/providers";
import { useKeysStore } from "@/lib/ai/keys-store";

const NAV = [
  { to: "/", label: "Draft" },
  { to: "/library", label: "Library" },
  { to: "/ask", label: "Ask the law" },
  { to: "/audit", label: "Audit store" },
  { to: "/batch", label: "Batch" },
  { to: "/outreach", label: "Cold email" },
  { to: "/history", label: "History" },
  { to: "/models", label: "Models" },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lastProvider = useKeysStore((s) => s.lastProvider);
  const lastFallback = useKeysStore((s) => s.lastFallback);
  const lastLabel = lastProvider
    ? getProvider(lastProvider)?.name ?? lastProvider
    : "";

  return (
    <div className="min-h-dvh bg-bg text-ink">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 sm:px-6">
          <Link to="/" className="flex min-w-0 items-center gap-2.5">
            <BrandMark />
            <span className="min-w-0">
              <span className="block font-display text-lg leading-none font-medium tracking-tight">
                NyayaDraft
              </span>
              <span className="mt-0.5 hidden text-[11px] tracking-[0.14em] text-muted uppercase sm:block">
                Indian legal drafting
              </span>
            </span>
          </Link>
          <nav className="ml-auto flex items-center gap-1 overflow-x-auto">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/" || pathname.startsWith("/draft")
                  : pathname === item.to || pathname.startsWith(`${item.to}/`);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-sm)] px-3 py-2 text-sm whitespace-nowrap transition-colors duration-[var(--motion-quick)]",
                    active
                      ? "bg-primary text-primary-fg"
                      : "text-muted hover:bg-surface-2 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        {lastLabel ? (
          <div className="border-t border-border/60">
            <div className="mx-auto flex max-w-6xl items-center justify-end px-4 py-1.5 sm:px-6">
              <Link
                to="/models"
                className="text-[11px] tracking-wide text-muted uppercase hover:text-ink"
              >
                Last model: {lastLabel}
                {lastFallback ? " · fallback" : ""}
              </Link>
            </div>
          </div>
        ) : null}
      </header>
      {children}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <p className="max-w-3xl text-[13px] leading-relaxed text-muted">
            NyayaDraft is an AI drafting aid grounded in a curated corpus of
            Indian statute. It is not a law firm, does not create an
            advocate–client relationship, and is not a substitute for advice
            from an advocate enrolled under the Advocates Act, 1961. Statutory
            excerpts are abridged for retrieval. Always review, stamp, and
            verify a draft before it leaves chambers.
          </p>
        </div>
      </footer>
    </div>
  );
}
