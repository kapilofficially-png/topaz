import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("size-8 text-primary", className)}
      aria-hidden="true"
    >
      <rect width="32" height="32" rx="8" fill="currentColor" />
      <path
        d="M9 12h5.2c.9 0 1.6.4 2.2 1.1L16 13.5l-.4.4C15.1 14.6 14.3 15 13.4 15H9V12Zm8.6 0H23v3h-4.4c-.9 0-1.7-.4-2.2-1.1l.4-.4c.6-.7 1.3-1.1 2.2-1.1Z"
        fill="#f6f1e8"
      />
      <path
        d="M9 16h5.2c.9 0 1.7.4 2.2 1.1l.6.7.6-.7c.5-.7 1.3-1.1 2.2-1.1H23v6.4h-4.4c-.9 0-1.7.3-2.2.9L16 23.2l-.6-.9c-.5-.6-1.3-.9-2.2-.9H9V16Z"
        fill="none"
        stroke="#f6f1e8"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <circle
        cx="16"
        cy="9"
        r="2"
        fill="none"
        stroke="#f6f1e8"
        strokeWidth="1.3"
      />
    </svg>
  );
}
