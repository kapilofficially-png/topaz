/** Query expansion: everyday / old-code labels → current Indian law vocabulary. */
export const QUERY_ALIASES: Record<string, string> = {
  "498a": "cruelty husband relatives BNS 85 86 dowry",
  "498-a": "cruelty husband relatives BNS 85",
  ipc420: "cheating dishonest inducement BNS 318",
  "420": "cheating BNS 318 ipc 420",
  "406": "criminal breach of trust BNS 316",
  "302": "murder BNS 103",
  "307": "attempt to murder BNS 109",
  "376": "rape BNS 64 63",
  "354": "outraging modesty BNS 74",
  "506": "criminal intimidation BNS 351",
  "323": "voluntarily causing hurt BNS 115",
  "324": "hurt dangerous weapon BNS 118",
  "34": "common intention BNS 3(5)",
  "120b": "criminal conspiracy BNS 61",
  "154": "FIR information cognizable BNSS 173 zero FIR e-FIR",
  crpc154: "FIR BNSS 173",
  "41 crpc": "arrest without warrant BNSS 35",
  "437": "bail non-bailable BNSS 480",
  "438": "anticipatory bail BNSS 482",
  "439": "high court sessions bail BNSS 483",
  "482 crpc": "inherent powers high court BNSS 528",
  "125": "maintenance wife children parents BNSS 144",
  "138": "cheque dishonour negotiable instruments act 138 141 142",
  ni138: "cheque bounce dishonour section 138 negotiable instruments",
  "65b": "electronic record certificate Bharatiya Sakshya Adhiniyam",
  "80 cpc": "notice government public officer CPC 80",
  "13b": "mutual consent divorce hindu marriage act 13B",
  "13(1)(ia)": "divorce cruelty hindu marriage act",
  rti: "right to information application section 6 7 8",
  fir: "first information report BNSS 173 cognizable",
  anticipatory: "anticipatory bail BNSS 482",
  nda: "confidentiality non-disclosure contract 27 73",
  "rent agreement": "lease transfer of property 105 107 108 stamp registration",
  poa: "power of attorney powers-of-attorney act stamp",
  posh: "sexual harassment workplace 2013 vishaka",
  dpdp: "digital personal data protection 2023 consent",
  tos: "terms of service e-commerce unfair contract consumer",
  "terms of service": "terms of service e-commerce rules clickwrap unfair contract",
  "terms of use": "terms of service e-commerce consumer protection",
  "refund policy": "refund return cancellation e-commerce rules defective goods",
  "return policy": "refund return cancellation consumer protection",
  "shipping policy": "shipping delivery e-commerce deficiency of service COD",
  "delivery policy": "shipping delivery late delivery risk in transit",
  "consent policy": "DPDP consent privacy notice data principal cookie",
  "privacy policy": "DPDP consent personal data notice withdrawal",
  "cancellation policy": "cancellation charges refund e-commerce rules",
  ecommerce: "e-commerce rules 2020 inventory marketplace grievance officer",
  "online store": "e-commerce inventory terms refund shipping privacy",
  shopify: "e-commerce terms of service privacy refund shipping",
  "store audit": "e-commerce rules DPDP unfair contract grievance officer",
};

export function expandQuery(query: string): string {
  const lower = query.toLowerCase();
  const extras: string[] = [];
  for (const [alias, expansion] of Object.entries(QUERY_ALIASES)) {
    if (lower.includes(alias)) extras.push(expansion);
  }
  return extras.length ? `${query} ${extras.join(" ")}` : query;
}
