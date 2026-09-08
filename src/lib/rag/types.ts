export const LAW_CATEGORIES = [
  "constitutional",
  "criminal",
  "procedure",
  "contract",
  "commercial",
  "consumer",
  "property",
  "family",
  "labour",
  "corporate",
  "evidence",
  "public",
  "drafting",
] as const;

export type LawCategory = (typeof LAW_CATEGORIES)[number];

export type LawChunk = {
  id: string;
  title: string;
  statute: string;
  citation: string;
  category: LawCategory;
  tags: string[];
  text: string;
  note?: string;
};

export type RetrievedChunk = LawChunk & {
  score: number;
};
