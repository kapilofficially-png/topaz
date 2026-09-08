export const POLICY_KINDS = [
  "terms",
  "privacy",
  "consent",
  "return",
  "refund",
  "cancellation",
  "shipping",
  "delivery",
  "contact",
  "other",
] as const;

export type PolicyKind = (typeof POLICY_KINDS)[number];

export const POLICY_LABELS: Record<PolicyKind, string> = {
  terms: "Terms of service / T&C",
  privacy: "Privacy policy",
  consent: "Consent / cookies",
  return: "Return policy",
  refund: "Refund policy",
  cancellation: "Cancellation policy",
  shipping: "Shipping policy",
  delivery: "Delivery policy",
  contact: "Contact / legal entity",
  other: "Other legal page",
};

export const REQUIRED_STORE_POLICIES: PolicyKind[] = [
  "terms",
  "privacy",
  "return",
  "refund",
  "shipping",
];

/** Kinds that are the same commercial subject if the store split them across URLs. */
export const POLICY_PAIRS: PolicyKind[][] = [
  ["return", "refund", "cancellation"],
  ["shipping", "delivery"],
  ["privacy", "consent"],
  ["terms"],
];

export function relatedPolicyKinds(kind: PolicyKind): PolicyKind[] {
  return POLICY_PAIRS.find((g) => g.includes(kind)) ?? [kind];
}

export function missingFromPages(pages: { kind: PolicyKind; url?: string; title?: string }[]) {
  return REQUIRED_STORE_POLICIES.filter((kind) => !pairSatisfied(pages, kind)).map((kind) => ({
    kind,
    label: POLICY_LABELS[kind],
  }));
}

function pairSatisfied(
  pages: { kind: PolicyKind; url?: string; title?: string }[],
  kind: PolicyKind,
) {
  if (pages.some((p) => p.kind === kind)) return true;
  const group = POLICY_PAIRS.find((g) => g.includes(kind));
  if (!group) return false;
  return group.some((other) => {
    if (other === kind) return false;
    return pages.some((p) => {
      const blob = `${p.url ?? ""} ${p.title ?? ""}`.toLowerCase();
      if (kind === "refund" && other === "return" && /refund/.test(blob) && /return/.test(blob)) {
        return true;
      }
      if (kind === "return" && other === "refund" && /refund/.test(blob) && /return/.test(blob)) {
        return true;
      }
      if (
        (kind === "shipping" || kind === "delivery") &&
        /shipping/.test(blob) &&
        /delivery/.test(blob)
      ) {
        return true;
      }
      if ((kind === "privacy" || kind === "consent") && /privacy/.test(blob) && /cookie|consent/.test(blob)) {
        return true;
      }
      return false;
    });
  });
}

export type FetchedPage = {
  kind: PolicyKind;
  label: string;
  url: string;
  title: string;
  text: string;
  chars: number;
  status: number;
  /** Live URL that is not linked from the store homepage. */
  hidden: boolean;
  /** Fetched because the drafter pasted the URL, not the crawler. */
  added: boolean;
};

export function pageUrlKey(url: string) {
  return url.replace(/\/+$/, "").toLowerCase();
}

export type ExtractedHints = {
  emails: string[];
  phones: string[];
  gstins: string[];
  legalName?: string;
};

export type ResearchResult = {
  origin: string;
  host: string;
  homeTitle: string;
  pages: FetchedPage[];
  missing: { kind: PolicyKind; label: string }[];
  hints: ExtractedHints;
};