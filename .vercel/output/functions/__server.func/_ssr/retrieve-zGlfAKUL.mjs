//#region node_modules/.nitro/vite/services/ssr/assets/retrieve-zGlfAKUL.js
/** Query expansion: everyday / old-code labels → current Indian law vocabulary. */
var QUERY_ALIASES = {
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
	"store audit": "e-commerce rules DPDP unfair contract grievance officer"
};
function expandQuery(query) {
	const lower = query.toLowerCase();
	const extras = [];
	for (const [alias, expansion] of Object.entries(QUERY_ALIASES)) if (lower.includes(alias)) extras.push(expansion);
	return extras.length ? `${query} ${extras.join(" ")}` : query;
}
var CORPUS = [
	{
		id: "const-preamble",
		title: "Preamble — Constitution of India",
		statute: "Constitution of India",
		citation: "Preamble",
		category: "constitutional",
		tags: [
			"preamble",
			"sovereign",
			"socialist",
			"secular",
			"democratic",
			"republic",
			"justice"
		],
		text: "The Preamble to the Constitution of India declares India to be a sovereign, socialist, secular, democratic republic, and secures to all its citizens justice (social, economic and political), liberty of thought, expression, belief, faith and worship, equality of status and of opportunity, and fraternity assuring the dignity of the individual and the unity and integrity of the Nation. It is a key to the minds of the makers and a legitimate aid in construction, though not independently justiciable.",
		note: "Use in recitals of public-law pleadings and in constitutional challenges to frame the values at stake."
	},
	{
		id: "const-12",
		title: "Definition of State",
		statute: "Constitution of India",
		citation: "Article 12",
		category: "constitutional",
		tags: [
			"state",
			"fundamental rights",
			"instrumentality",
			"writ"
		],
		text: "In Part III, unless the context otherwise requires, 'the State' includes the Government and Parliament of India, the Government and Legislature of each State, and all local or other authorities within the territory of India or under the control of the Government of India. Authorities that are instrumentalities or agencies of government fall within Article 12 and are amenable to fundamental-rights discipline and writ jurisdiction."
	},
	{
		id: "const-14",
		title: "Equality before law",
		statute: "Constitution of India",
		citation: "Article 14",
		category: "constitutional",
		tags: [
			"equality",
			"arbitrariness",
			"reasonable classification",
			"article 14"
		],
		text: "The State shall not deny to any person equality before the law or the equal protection of the laws within the territory of India. Classification is permissible if it is founded on an intelligible differentia having a rational nexus with the object sought to be achieved. Arbitrary State action is the antithesis of equality. Article 14 applies to 'any person', including non-citizens and juristic persons, and is a staple ground in writ petitions challenging discriminatory policy, tenders, and disciplinary action."
	},
	{
		id: "const-19",
		title: "Protection of certain rights regarding freedom of speech etc.",
		statute: "Constitution of India",
		citation: "Article 19",
		category: "constitutional",
		tags: [
			"speech",
			"profession",
			"trade",
			"assembly",
			"movement",
			"reasonable restrictions"
		],
		text: "Article 19(1) guarantees to citizens freedom of speech and expression; assembly; association; movement; residence; and the right to practise any profession or to carry on any occupation, trade or business. Clauses (2) to (6) permit reasonable restrictions in the interests of, inter alia, sovereignty and integrity of India, security of the State, public order, decency or morality, contempt of court, defamation, and (for 19(1)(g)) professional or technical qualifications and State monopoly. Restrictions must be reasonable, not excessive, and have a proximate nexus with the permitted head."
	},
	{
		id: "const-21",
		title: "Protection of life and personal liberty",
		statute: "Constitution of India",
		citation: "Article 21",
		category: "constitutional",
		tags: [
			"life",
			"liberty",
			"due process",
			"privacy",
			"speedy trial",
			"livelihood"
		],
		text: "No person shall be deprived of his life or personal liberty except according to procedure established by law. After Maneka Gandhi v. Union of India (1978), the procedure must be fair, just and reasonable — not arbitrary, fanciful or oppressive. Article 21 has been read to include dignity, privacy, livelihood, health, shelter, a clean environment, and a reasonably speedy trial. Illegal detention, custodial violence, and denial of medical care engage Article 21 and may sound in public-law compensation."
	},
	{
		id: "const-22",
		title: "Protection against arrest and detention",
		statute: "Constitution of India",
		citation: "Article 22",
		category: "constitutional",
		tags: [
			"arrest",
			"detention",
			"legal counsel",
			"produced magistrate",
			"preventive detention"
		],
		text: "No person who is arrested shall be detained in custody without being informed, as soon as may be, of the grounds of arrest, nor shall he be denied the right to consult and to be defended by a legal practitioner of his choice. Every arrested person must be produced before the nearest magistrate within 24 hours of arrest, excluding journey time. Preventive detention is separately regulated: grounds must be communicated, and an Advisory Board reviews detention. These guarantees overlay BNSS arrest and production provisions."
	},
	{
		id: "const-32",
		title: "Remedies for enforcement of fundamental rights",
		statute: "Constitution of India",
		citation: "Article 32",
		category: "constitutional",
		tags: [
			"writ",
			"supreme court",
			"habeas corpus",
			"mandamus",
			"certiorari",
			"prohibition",
			"quo warranto"
		],
		text: "The right to move the Supreme Court by appropriate proceedings for the enforcement of the rights conferred by Part III is itself a fundamental right. The Court may issue directions or orders or writs including habeas corpus, mandamus, prohibition, quo warranto and certiorari. Article 32 is the heart and soul of the Constitution (as described in the Constituent Assembly). It is invoked for fundamental-rights violations of a pan-India or grave character; High Courts under Article 226 have a wider canvas including legal rights."
	},
	{
		id: "const-226",
		title: "Power of High Courts to issue certain writs",
		statute: "Constitution of India",
		citation: "Article 226",
		category: "constitutional",
		tags: [
			"high court",
			"writ petition",
			"certiorari",
			"mandamus",
			"territorial jurisdiction"
		],
		text: "Every High Court has power throughout the territories in relation to which it exercises jurisdiction to issue to any person or authority, including in appropriate cases any Government, directions, orders or writs for the enforcement of any of the rights conferred by Part III and for any other purpose. Cause of action in part arising within the territory may found jurisdiction even if the authority sits elsewhere. Alternative remedy is a rule of self-restraint, not a bar, and yields to lack of jurisdiction, breach of natural justice, or a vires challenge."
	},
	{
		id: "const-300a",
		title: "Persons not to be deprived of property save by authority of law",
		statute: "Constitution of India",
		citation: "Article 300A",
		category: "constitutional",
		tags: [
			"property",
			"acquisition",
			"authority of law",
			"compensation"
		],
		text: "No person shall be deprived of his property save by authority of law. After the deletion of Article 31, 300A is a constitutional right (not a fundamental right) requiring a valid law, public purpose in acquisition contexts, and a process that is not a fraud on power. Executive deprivation without statutory authority is unconstitutional. Drafts challenging acquisition, demolition, or seizure should plead absence of authority of law and disproportionality."
	},
	{
		id: "const-141",
		title: "Law declared by Supreme Court to be binding",
		statute: "Constitution of India",
		citation: "Article 141",
		category: "constitutional",
		tags: [
			"precedent",
			"stare decisis",
			"supreme court",
			"binding"
		],
		text: "The law declared by the Supreme Court shall be binding on all courts within the territory of India. Ratio decidendi binds; obiter may be persuasive. High Courts bind courts within their territory. When citing authorities in a draft, distinguish ratio from observations, note later clarification, and do not invent reporter citations."
	},
	{
		id: "bns-3-5",
		title: "Acts done by several persons in furtherance of common intention",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 3(5)",
		category: "criminal",
		tags: [
			"common intention",
			"ipc 34",
			"joint liability"
		],
		text: "BNS § 3(5) (corresponding to IPC § 34) provides that when a criminal act is done by several persons in furtherance of the common intention of all, each of such persons is liable for that act in the same manner as if it were done by him alone. Common intention requires a pre-arranged plan, which may develop on the spur of the moment, and participation. It is a rule of evidence creating joint liability, not a distinct offence.",
		note: "Plead common intention when multiple accused acted together; distinguish from conspiracy (BNS 61) and common object in unlawful assembly."
	},
	{
		id: "bns-61",
		title: "Criminal conspiracy",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 61",
		category: "criminal",
		tags: [
			"conspiracy",
			"ipc 120b",
			"agreement",
			"illegal act"
		],
		text: "When two or more persons agree to do, or cause to be done, an illegal act, or an act which is not illegal by illegal means, such an agreement is designated a criminal conspiracy. Except where the agreement is to commit an offence, some act besides the agreement must be done. Punishment is calibrated to the object offence. An agreement is the gist; meeting of minds may be inferred from concerted action."
	},
	{
		id: "bns-62",
		title: "Punishment for attempting to commit offences",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 62",
		category: "criminal",
		tags: [
			"attempt",
			"ipc 511",
			"preparation"
		],
		text: "Whoever attempts to commit an offence punishable by the Sanhita with imprisonment, or to cause such an offence to be committed, and in such attempt does any act towards the commission of the offence, shall, where no express provision is made, be punished with imprisonment of any description provided for the offence, for a term which may extend to one-half of the imprisonment for life or of the longest term provided for that offence, or with such fine as is provided, or with both. Mere preparation is not attempt; the act must be towards commission."
	},
	{
		id: "bns-85",
		title: "Cruelty by husband or relatives of husband",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 85",
		category: "criminal",
		tags: [
			"cruelty",
			"498a",
			"dowry",
			"husband",
			"relatives",
			"woman"
		],
		text: "BNS § 85 (corresponding to IPC § 498A) punishes a husband or relative of the husband of a woman who subjects her to cruelty. Cruelty means wilful conduct of such a nature as is likely to drive the woman to suicide or to cause grave injury or danger to life, limb or health (mental or physical), or harassment with a view to coercing her or any person related to her to meet any unlawful demand for any property or valuable security, or on account of failure to meet such demand. The offence is cognizable, non-bailable and non-compoundable in the ordinary course. Complaints should particularise dates, instances, and the role of each relative — omnibus allegations are routinely truncated.",
		note: "Pair with BNS 86 (definition of cruelty) and, where facts fit, Dowry Prohibition Act and BNSS 144 maintenance."
	},
	{
		id: "bns-103",
		title: "Punishment for murder",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 103",
		category: "criminal",
		tags: [
			"murder",
			"ipc 302",
			"death",
			"life imprisonment",
			"culpable homicide"
		],
		text: "BNS § 103 (corresponding to IPC § 302) punishes murder with death or imprisonment for life, and also fine. Murder is culpable homicide with one of the special mental elements in BNS § 101 (intention to cause death; intention to cause bodily injury known to be likely to cause death; injury sufficient in the ordinary course of nature to cause death; or knowledge that the act is so imminently dangerous that it must in all probability cause death). Exceptions (grave and sudden provocation, private defence exceeding in good faith, sudden fight, consent in limited cases, etc.) reduce the offence to culpable homicide not amounting to murder (BNS § 105)."
	},
	{
		id: "bns-106",
		title: "Causing death by negligence",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 106",
		category: "criminal",
		tags: [
			"negligence",
			"rash driving",
			"ipc 304a",
			"medical negligence"
		],
		text: "Whoever causes death of any person by doing any rash or negligent act not amounting to culpable homicide is punished under BNS § 106 (corresponding to IPC § 304A), with enhanced terms in specified aggravated settings such as hit-and-run after the 2023 reform. The provision captures motor accidents and certain medical cases where rashness or negligence, not intention or knowledge of the murder variety, is proved. Civil damages and MACT claims run on a different standard and may proceed in parallel."
	},
	{
		id: "bns-115",
		title: "Voluntarily causing hurt",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 115",
		category: "criminal",
		tags: [
			"hurt",
			"ipc 323",
			"assault",
			"simple hurt"
		],
		text: "Whoever, except in the case provided for by BNS § 122 (voluntarily causing hurt on provocation), voluntarily causes hurt, shall be punished with imprisonment which may extend to one year, or with fine which may extend to ten thousand rupees, or with both (BNS § 115, corresponding to IPC § 323). Hurt is causing bodily pain, disease or infirmity. Grievous hurt is separately defined and more severely punished. Police complaints should describe injuries, medical treatment, and weapon if any."
	},
	{
		id: "bns-303",
		title: "Theft",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 303",
		category: "criminal",
		tags: [
			"theft",
			"ipc 378 379",
			"movable property",
			"dishonest intention"
		],
		text: "Whoever, intending to take dishonestly any movable property out of the possession of any person without that person's consent, moves that property in order to such taking, is said to commit theft (BNS § 303, corresponding to IPC §§ 378–379). Punishment is imprisonment which may extend to three years, or fine, or both, with higher punishment for second and subsequent convictions in the 2023 text. Snatching and theft in dwelling house are aggravated forms."
	},
	{
		id: "bns-316",
		title: "Criminal breach of trust",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 316",
		category: "criminal",
		tags: [
			"criminal breach of trust",
			"ipc 406 409",
			"entrustment",
			"dishonest"
		],
		text: "Whoever, being in any manner entrusted with property, or with any dominion over property, dishonestly misappropriates or converts it to his own use, or dishonestly uses or disposes of that property in violation of any direction of law or of any legal contract, commits criminal breach of trust (BNS § 316, corresponding to IPC §§ 405–409). Entrustment is the gist. Aggravated forms apply to carriers, clerks, public servants and bankers. Civil recovery and criminal complaint may co-exist; drafts should narrate the trust, the dishonest diversion, and the demand for accounts."
	},
	{
		id: "bns-318",
		title: "Cheating",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 318",
		category: "criminal",
		tags: [
			"cheating",
			"ipc 415 420",
			"dishonest inducement",
			"fraud",
			"delivery of property"
		],
		text: "BNS § 318 consolidates cheating (erstwhile IPC §§ 415–420). A person cheats if he deceives someone, fraudulently or dishonestly inducing that person to deliver property or to consent that any person shall retain property, or intentionally inducing the person to do or omit anything which he would not do or omit if not so deceived, and which causes or is likely to cause damage or harm to that person in body, mind, reputation or property. Cheating and thereby dishonestly inducing delivery of property (the old 420) is the aggravated form in § 318(4), punishable with imprisonment which may extend to seven years and fine. Mens rea at inception distinguishes cheating from mere breach of contract.",
		note: "Do not convert every civil dispute into 318. Plead deception at inception, false representation, and delivery of property."
	},
	{
		id: "bns-336",
		title: "Forgery",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 336",
		category: "criminal",
		tags: [
			"forgery",
			"ipc 463 465",
			"false document",
			"electronic"
		],
		text: "Whoever makes any false document or false electronic record or part of a document or electronic record, with intent to cause damage or injury, to commit fraud, or that fraud may be committed, or to dishonestly or fraudulently conceal a crime, commits forgery (BNS § 336, corresponding to IPC §§ 463, 465). Using as genuine a forged document is separately punishable. Attach the questioned instrument and, for electronic records, comply with the electronic-evidence regime under the Bharatiya Sakshya Adhiniyam."
	},
	{
		id: "bns-351",
		title: "Criminal intimidation",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 351",
		category: "criminal",
		tags: [
			"intimidation",
			"ipc 506",
			"threat",
			"injury"
		],
		text: "Whoever threatens another with any injury to his person, reputation or property, or to the person or reputation of anyone in whom that person is interested, with intent to cause alarm, or to cause the person to do any act which he is not legally bound to do, or to omit any act which that person is legally entitled to do, commits criminal intimidation (BNS § 351, corresponding to IPC §§ 503, 506). Threat of death or grievous hurt attracts enhanced punishment. Words used, date, place, and witnesses should be particularised."
	},
	{
		id: "bns-356",
		title: "Defamation",
		statute: "Bharatiya Nyaya Sanhita, 2023",
		citation: "BNS § 356",
		category: "criminal",
		tags: [
			"defamation",
			"ipc 499 500",
			"imputation",
			"reputation",
			"exceptions"
		],
		text: "Whoever, by words either spoken or intended to be read, or by signs or visible representations, makes or publishes any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person, is said (except in cases of the statutory exceptions) to defame that person (BNS § 356, corresponding to IPC §§ 499–500). Exceptions include truth for public good, fair comment on public conduct, and reports of court proceedings. Civil damages and injunction under the Specific Relief Act may be more effective than a criminal complaint in many commercial settings."
	},
	{
		id: "bnss-35",
		title: "When police may arrest without warrant",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 35",
		category: "procedure",
		tags: [
			"arrest",
			"without warrant",
			"crpc 41",
			"cognizable",
			"notice of appearance"
		],
		text: "BNSS § 35 (corresponding to CrPC § 41) regulates arrest without warrant in cognizable cases. Arrest is not automatic: the officer must be satisfied that arrest is necessary (to prevent further offence, for proper investigation, to prevent evidence being destroyed, to prevent absconding, or because the person is a habitual offender, etc.) and must record reasons. For offences punishable with less than 7 years, a notice of appearance may be issued instead of arrest in specified situations. Article 22 and DK Basu safeguards (memo of arrest, medical examination, informing a relative, production within 24 hours) continue to apply."
	},
	{
		id: "bnss-173",
		title: "Information in cognizable cases (FIR, e-FIR, Zero FIR)",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 173",
		category: "procedure",
		tags: [
			"FIR",
			"e-FIR",
			"zero FIR",
			"crpc 154",
			"cognizable",
			"police"
		],
		text: "BNSS § 173 (corresponding to CrPC § 154) requires that every information relating to the commission of a cognizable offence, if given orally, be reduced to writing, read over, signed, and entered in the prescribed book. Information may be given by electronic communication and shall be taken on record after signature within three days. The informant is entitled to a free copy. Zero FIR — registration irrespective of territorial jurisdiction, followed by transfer — is now statutory. For certain offences punishable with 3 years or more but less than 7 years, a preliminary inquiry may be conducted within 14 days in the situations contemplated by § 173(3). Refusal to register a cognizable FIR can be escalated to the Superintendent of Police and thereafter to the Magistrate.",
		note: "Draft police complaints with date, time, place, named accused if known, ingredients of the offence, and a prayer for registration under BNSS 173 and investigation."
	},
	{
		id: "bnss-187",
		title: "Procedure when investigation cannot be completed in twenty-four hours",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 187",
		category: "procedure",
		tags: [
			"remand",
			"police custody",
			"default bail",
			"crpc 167"
		],
		text: "BNSS § 187 (corresponding to CrPC § 167) governs remand when investigation cannot be completed within 24 hours. The Magistrate may authorise detention, including limited police custody in the manner now provided. Default / statutory bail arises if the charge-sheet is not filed within the prescribed period (generally 60 or 90 days depending on the offence). The 2023 text adjusts police-custody windows; drafts should compute the period from the date of first remand and plead indefeasible right to default bail if the report is not filed in time."
	},
	{
		id: "bnss-480",
		title: "When bail may be taken in case of non-bailable offence",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 480",
		category: "procedure",
		tags: [
			"bail",
			"non-bailable",
			"crpc 437",
			"magistrate"
		],
		text: "BNSS § 480 (corresponding to CrPC § 437) empowers a Magistrate, other than in cases punishable with death or life imprisonment (subject to specified exceptions), to release an accused on bail in a non-bailable offence. Factors include the nature of accusation, severity of punishment, danger of absconding or tampering, character of the accused, and the health or age of the accused. Women, children, and sick or infirm persons receive particular consideration. Bail is the rule and jail the exception in the ordinary criminal process, as repeatedly affirmed by the Supreme Court."
	},
	{
		id: "bnss-482",
		title: "Direction for grant of bail to person apprehending arrest",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 482",
		category: "procedure",
		tags: [
			"anticipatory bail",
			"crpc 438",
			"apprehending arrest"
		],
		text: "BNSS § 482 (corresponding to CrPC § 438) permits a person having reason to believe that he may be arrested on an accusation of a non-bailable offence to apply to the High Court or the Court of Session for a direction that in the event of arrest he shall be released on bail. The Court considers the nature and gravity of the accusation, antecedents, possibility of fleeing justice, and whether the accusation is made to injure or humiliate. Conditions as to cooperation, not leaving the country, and not tampering with evidence are routine. Presence of the applicant may be required."
	},
	{
		id: "bnss-483",
		title: "Special powers of High Court or Court of Session regarding bail",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 483",
		category: "procedure",
		tags: [
			"bail",
			"high court",
			"sessions",
			"crpc 439"
		],
		text: "BNSS § 483 (corresponding to CrPC § 439) confers special powers on the High Court and Court of Session to direct release on bail of a person accused of an offence and in custody, and to impose or set aside conditions. These courts may also cause any person released by a Magistrate to be arrested and committed to custody. Regular bail applications after arrest are ordinarily moved here when the Magistrate's power is constrained or has been declined."
	},
	{
		id: "bnss-528",
		title: "Saving of inherent powers of High Court",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 528",
		category: "procedure",
		tags: [
			"inherent powers",
			"quash",
			"crpc 482",
			"abuse of process"
		],
		text: "Nothing in the BNSS shall be deemed to limit or affect the inherent powers of the High Court to make such orders as may be necessary to give effect to any order under the Sanhita, or to prevent abuse of the process of any Court, or otherwise to secure the ends of justice (BNSS § 528, corresponding to CrPC § 482). Petitions to quash an FIR or complaint invoke this power. The Bhajan Lal categories remain the classic guide: where allegations even if taken at face value do not disclose an offence, where they are absurd or inherently improbable, or where the proceeding is maliciously instituted with an ulterior motive."
	},
	{
		id: "bnss-144",
		title: "Order for maintenance of wives, children and parents",
		statute: "Bharatiya Nagarik Suraksha Sanhita, 2023",
		citation: "BNSS § 144",
		category: "family",
		tags: [
			"maintenance",
			"crpc 125",
			"wife",
			"children",
			"parents",
			"magistrate"
		],
		text: "BNSS § 144 (corresponding to CrPC § 125) is a secular, summary remedy. If any person having sufficient means neglects or refuses to maintain his wife (unable to maintain herself), his legitimate or illegitimate minor child, his legitimate or illegitimate child (not a married daughter) who has attained majority but is unable by reason of physical or mental abnormality or injury to maintain itself, or his father or mother unable to maintain himself or herself, a Magistrate of the first class may order a monthly allowance. Wife includes a divorced wife who has not remarried. Living in adultery, refusal to live without sufficient reason, or living separately by mutual consent may disentitle the wife. This remedy is concurrent with personal-law maintenance."
	},
	{
		id: "bsa-electronic",
		title: "Admissibility of electronic records",
		statute: "Bharatiya Sakshya Adhiniyam, 2023",
		citation: "BSA (electronic records)",
		category: "evidence",
		tags: [
			"electronic evidence",
			"65b",
			"certificate",
			"computer output",
			"whatsapp"
		],
		text: "The Bharatiya Sakshya Adhiniyam, 2023 replaces the Indian Evidence Act, 1872. Electronic records are documents. Secondary electronic evidence (computer output) is admissible on the conditions corresponding to the former § 65B — including a certificate identifying the record, describing the manner of production, and the particulars of the device, signed by the person in charge of the computer or communication device. Hash value and the integrity of the record are emphasised in the 2023 scheme. WhatsApp chats, emails, CCTV and server logs must be exhibited with the statutory certificate; mere printouts without the certificate risk exclusion.",
		note: "In every draft relying on electronic material, schedule a BSA-compliant certificate as an annexure."
	},
	{
		id: "cpc-9",
		title: "Courts to try all civil suits unless barred",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 9",
		category: "procedure",
		tags: [
			"jurisdiction",
			"civil court",
			"bar",
			"suit"
		],
		text: "The courts shall (subject to the provisions herein contained) have jurisdiction to try all suits of a civil nature excepting suits of which their cognizance is either expressly or impliedly barred. A suit is of a civil nature if the principal question relates to a civil right. Special statutes (consumer, rent control, industrial disputes, company law, SARFAESI) often create exclusive forums; a plaint must address why the civil court is not barred."
	},
	{
		id: "cpc-11",
		title: "Res judicata",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 11",
		category: "procedure",
		tags: [
			"res judicata",
			"former suit",
			"same parties",
			"issue"
		],
		text: "No Court shall try any suit or issue in which the matter directly and substantially in issue has been directly and substantially in issue in a former suit between the same parties, or between parties under whom they or any of them claim, litigating under the same title, in a Court competent to try such subsequent suit or the suit in which such issue has been subsequently raised, and has been heard and finally decided. Constructive res judicata (Explanation IV) bars matters which might and ought to have been made ground of attack or defence. Drafts of written statements should raise this as a preliminary objection with particulars of the former suit."
	},
	{
		id: "cpc-20",
		title: "Other suits to be instituted where defendants reside or cause of action arises",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 20",
		category: "procedure",
		tags: [
			"territorial jurisdiction",
			"cause of action",
			"defendant resides",
			"place of suing"
		],
		text: "Subject to limitations in the preceding sections, every suit shall be instituted in a Court within the local limits of whose jurisdiction the defendant actually and voluntarily resides, or carries on business, or personally works for gain, or where any of two or more defendants resides (with leave or acquiescence), or where the cause of action, wholly or in part, arises. A corporation is deemed to carry on business at its sole or principal office, or at a subordinate office in respect of a cause of action arising there. Every plaint must plead jurisdictional facts."
	},
	{
		id: "cpc-26-order7",
		title: "Institution of suits and particulars of plaint",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 26; Order VII",
		category: "procedure",
		tags: [
			"plaint",
			"cause of action",
			"valuation",
			"relief",
			"institution"
		],
		text: "Every suit shall be instituted by presenting a plaint. Order VII requires the name of the court, names, description and places of residence of parties, facts constituting the cause of action and when it arose, facts showing jurisdiction, the value of the subject-matter for jurisdiction and court-fees, the relief claimed, and a statement of the interest of a minor if any. Documents relied on are to be produced. A plaint which does not disclose a cause of action, is undervalued, or is insufficiently stamped may be rejected under Order VII rule 11. Verification is under Order VI rule 15.",
		note: "Draft numbered paragraphs: parties, jurisdiction, facts in chronological order, cause of action, limitation, valuation, and a distinct prayer."
	},
	{
		id: "cpc-order8",
		title: "Written statement, set-off and counter-claim",
		statute: "Code of Civil Procedure, 1908",
		citation: "Order VIII CPC",
		category: "procedure",
		tags: [
			"written statement",
			"denial",
			"set-off",
			"counter-claim",
			"limitation"
		],
		text: "The defendant shall, within thirty days from the date of service of summons (extendable as the Code now provides, with an outer limit), present a written statement of his defence. Denials must be specific; evasive denials are taken as admissions. New facts, such as fraud or limitation, must be pleaded. Set-off and counter-claim are available on the conditions in Order VIII. Failure to file in time may lead to the court pronouncing judgment or making such order as it thinks fit. Preliminary objections (jurisdiction, valuation, misjoinder, non-joinder of necessary parties, Order VII rule 11) should lead the draft."
	},
	{
		id: "cpc-80",
		title: "Notice to government and public officers",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 80",
		category: "procedure",
		tags: [
			"section 80",
			"notice",
			"government",
			"public officer",
			"two months"
		],
		text: "No suit shall be instituted against the Government or against a public officer in respect of any act purporting to be done by such public officer in his official capacity until the expiration of two months next after notice in writing has been delivered. The notice must state the cause of action, the name, description and place of residence of the plaintiff, and the relief claimed. Urgent relief may be sought with leave of court without serving notice, on conditions. Non-compliance is fatal unless waived. The notice itself is a formal instrument and should be sent by registered post with acknowledgement and by email where available."
	},
	{
		id: "cpc-39-injunction",
		title: "Temporary injunctions and interlocutory orders",
		statute: "Code of Civil Procedure, 1908",
		citation: "Order XXXIX CPC",
		category: "procedure",
		tags: [
			"injunction",
			"interim",
			"prima facie",
			"balance of convenience",
			"irreparable injury"
		],
		text: "Where in any suit it is proved by affidavit or otherwise that any property in dispute is in danger of being wasted, damaged or alienated, or that the defendant threatens to dispose of his property with a view to defrauding creditors, or threatens to interrupt the plaintiff's enjoyment of property, the Court may grant a temporary injunction. The trinity test is: (i) a prima facie case; (ii) balance of convenience; (iii) irreparable injury not compensable in damages. Ex parte injunctions are exceptional and attract Order XXXIX rule 3 notice requirements. Breach is punishable under rule 2A. Permanent injunctions at trial rest on the Specific Relief Act."
	},
	{
		id: "cpc-37-summary",
		title: "Summary procedure",
		statute: "Code of Civil Procedure, 1908",
		citation: "Order XXXVII CPC",
		category: "procedure",
		tags: [
			"summary suit",
			"negotiable instrument",
			"written contract",
			"leave to defend"
		],
		text: "Order XXXVII applies to suits upon bills of exchange, hundies and promissory notes, and to suits in which the plaintiff seeks only to recover a debt or liquidated demand in money payable by the defendant, with or without interest, arising on a written contract, or on an enactment, or on a guarantee. The defendant cannot defend unless he enters appearance and obtains leave to defend. Leave is granted if a substantial defence is shown; it may be conditional. Cheque and loan recoveries on writings are frequently brought in this form where the High Court has applied the Order."
	},
	{
		id: "cpc-151",
		title: "Saving of inherent powers of Court",
		statute: "Code of Civil Procedure, 1908",
		citation: "CPC § 151",
		category: "procedure",
		tags: [
			"inherent powers",
			"ends of justice",
			"abuse of process"
		],
		text: "Nothing in the Code shall be deemed to limit or otherwise affect the inherent power of the Court to make such orders as may be necessary for the ends of justice or to prevent abuse of the process of the Court. Section 151 does not confer jurisdiction where none exists and cannot be used to override express provisions. It is invoked for procedural gaps — restoration in appropriate cases, correction of accidental slips (alongside § 152), and anti-abuse directions."
	},
	{
		id: "ica-10",
		title: "What agreements are contracts",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act § 10",
		category: "contract",
		tags: [
			"essentials",
			"free consent",
			"competent",
			"lawful consideration",
			"agreement"
		],
		text: "All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void. Competency is in §§ 11–12 (age of majority, sound mind, not disqualified). Consent is free when not caused by coercion, undue influence, fraud, misrepresentation or mistake (§§ 13–22). Unlawful consideration or object is void under § 23. This is the spine of every commercial draft: recitals should map offer, acceptance, consideration, and capacity."
	},
	{
		id: "ica-13-19",
		title: "Consent, coercion, undue influence, fraud, misrepresentation",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act §§ 13–19",
		category: "contract",
		tags: [
			"free consent",
			"fraud",
			"undue influence",
			"misrepresentation",
			"voidable"
		],
		text: "Two or more persons are said to consent when they agree upon the same thing in the same sense (consensus ad idem). Consent is not free if caused by coercion (§ 15), undue influence (§ 16 — a relationship of dominance used to obtain an unfair advantage), fraud (§ 17 — suggestion of a false fact, active concealment, a promise without intention to perform, or any other act fitted to deceive), misrepresentation (§ 18), or mistake. When consent is caused by coercion, fraud, misrepresentation or undue influence, the agreement is a contract voidable at the option of the party whose consent was so caused (§ 19, § 19A). Silence is not fraud unless there is a duty to speak."
	},
	{
		id: "ica-23",
		title: "What considerations and objects are lawful",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act § 23",
		category: "contract",
		tags: [
			"lawful object",
			"public policy",
			"void",
			"unlawful consideration"
		],
		text: "The consideration or object of an agreement is lawful unless it is forbidden by law; or is of such a nature that, if permitted, it would defeat the provisions of any law; or is fraudulent; or involves or implies injury to the person or property of another; or the court regards it as immoral or opposed to public policy. In each of these cases the agreement is void. Wagering, trafficking in public offices, and agreements to stifle prosecution are classic illustrations. Stamp, registration, and foreign-exchange restrictions may independently affect enforceability."
	},
	{
		id: "ica-27",
		title: "Agreement in restraint of trade void",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act § 27",
		category: "contract",
		tags: [
			"restraint of trade",
			"non-compete",
			"nda",
			"employment",
			"goodwill"
		],
		text: "Every agreement by which anyone is restrained from exercising a lawful profession, trade or business of any kind, is to that extent void. The sole statutory exception is a sale of goodwill of a business, where the seller may agree to refrain from carrying on a similar business within specified local limits, provided the limits appear to the court reasonable. Indian law is stricter than English common law: a bare post-employment non-compete is generally void, though confidentiality, non-solicit of employees/customers during employment, and garden leave need careful, narrower drafting. NDAs protecting trade secrets are not, without more, restraints of trade.",
		note: "Do not draft a blanket post-termination non-compete for employees in India; use confidentiality, IP assignment, and limited non-solicit instead."
	},
	{
		id: "ica-56",
		title: "Agreement to do impossible act; frustration",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act § 56",
		category: "contract",
		tags: [
			"frustration",
			"impossibility",
			"force majeure",
			"void"
		],
		text: "An agreement to do an act impossible in itself is void. A contract to do an act which, after the contract is made, becomes impossible, or by reason of some event which the promisor could not prevent, unlawful, becomes void when the act becomes impossible or unlawful. This is the Indian doctrine of frustration. Force-majeure clauses allocate risk contractually and should specify events, notice, mitigation, and a long-stop termination right. Self-induced impossibility does not frustrate. COVID-era authority emphasises that mere commercial hardship is not frustration."
	},
	{
		id: "ica-73-74",
		title: "Compensation for loss or breach; liquidated damages",
		statute: "Indian Contract Act, 1872",
		citation: "Contract Act §§ 73–74",
		category: "contract",
		tags: [
			"damages",
			"compensation",
			"liquidated damages",
			"penalty",
			"remoteness"
		],
		text: "Section 73: when a contract has been broken, the party who suffers is entitled to compensation for any loss or damage caused which naturally arose in the usual course of things from such breach, or which the parties knew when they made the contract to be likely to result from the breach. Compensation is not awarded for remote or indirect loss. The injured party must mitigate. Section 74: when a contract names a sum to be paid in case of breach, or contains any other stipulation by way of penalty, the party complaining is entitled, whether or not actual damage is proved, to reasonable compensation not exceeding the amount so named. Indian law does not distinguish penalty and liquidated damages as English law does; the named sum is a ceiling on reasonable compensation. Earnest money and deposits follow the same principle, subject to forfeiture being reasonable."
	},
	{
		id: "ni-138",
		title: "Dishonour of cheque for insufficiency of funds",
		statute: "Negotiable Instruments Act, 1881",
		citation: "NI Act § 138",
		category: "commercial",
		tags: [
			"cheque bounce",
			"dishonour",
			"138",
			"demand notice",
			"15 days",
			"30 days"
		],
		text: "Where any cheque drawn by a person on an account maintained by him for the discharge, in whole or in part, of any legally enforceable debt or other liability, is returned unpaid for insufficiency of funds or because it exceeds the amount arranged to be paid, such person is deemed to have committed an offence, provided: (a) the cheque is presented within the period of its validity (generally three months); (b) the payee or holder in due course makes a demand for the payment by giving a notice in writing, within thirty days of receiving information from the bank regarding the return; and (c) the drawer fails to make payment within fifteen days of the receipt of the said notice. The complaint must be filed within one month of the date on which the cause of action arises under clause (c) (see § 142). Punishment may extend to two years' imprisonment, or fine up to twice the amount of the cheque, or both. The offence is compoundable.",
		note: "The statutory notice is jurisdictional. Compute 30 days from bank memo, then 15 days for payment, then 30 days (one month) to complain. Send notice to the drawer's recorded address by registered post."
	},
	{
		id: "ni-139-142",
		title: "Presumption, companies, and cognizance of 138 offences",
		statute: "Negotiable Instruments Act, 1881",
		citation: "NI Act §§ 139–142",
		category: "commercial",
		tags: [
			"presumption",
			"141",
			"company",
			"director",
			"cognizance",
			"jurisdiction"
		],
		text: "Section 139 raises a presumption that the holder received the cheque for the discharge of a legally enforceable debt or liability; the accused may rebut on a preponderance of probabilities. Section 140 excludes certain defences. Section 141: if the person committing the offence is a company, every person who at the time was in charge of and responsible to the company for the conduct of its business, as well as the company, is deemed guilty; independent directors and those who prove due diligence have a defence. A specific averment of being in charge is essential. Section 142: courts take cognizance only on a written complaint by the payee or holder in due course, within the limitation, and jurisdiction lies where the cheque is delivered for collection through the account of the payee, or where it is presented (as amended in 2015, reversing the Dashrath Rupsingh Rathod restriction to the drawer's bank)."
	},
	{
		id: "cpa-consumer",
		title: "Consumer, deficiency and unfair trade practice",
		statute: "Consumer Protection Act, 2019",
		citation: "CPA 2019 §§ 2(7), 2(11), 2(47)",
		category: "consumer",
		tags: [
			"consumer",
			"deficiency",
			"unfair trade",
			"service",
			"goods",
			"product liability"
		],
		text: "A consumer is a person who buys goods or hires or avails services for a consideration, including the user of such goods or beneficiary of such services, but excluding a person who obtains goods for resale or goods or services for a commercial purpose (with a livelihood-by-self-employment carve-out). Deficiency means any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance. Unfair trade practice includes false or misleading representation, bait advertising, and not issuing a bill. The 2019 Act adds product liability, mediation, and unfair contracts. Pecuniary jurisdiction of District, State and National Commissions is based on consideration paid, not compensation claimed. Territorial jurisdiction includes where the complainant resides or personally works for gain."
	},
	{
		id: "cpa-complaint",
		title: "Manner of filing a consumer complaint and reliefs",
		statute: "Consumer Protection Act, 2019",
		citation: "CPA 2019 §§ 35, 38, 39",
		category: "consumer",
		tags: [
			"complaint",
			"commission",
			"compensation",
			"refund",
			"e-daakhil"
		],
		text: "A complaint may be filed by the consumer, a recognised consumer association, a group of consumers, or the government, and may be filed electronically. The Commission may admit or reject after hearing; rejection requires notice. Procedure is summary. Reliefs include removal of defect, replacement, refund, compensation for loss or injury including for negligence, discontinuation of unfair practice, withdrawal of hazardous goods, and punitive damages in appropriate cases. Limitation is two years from the cause of action, condonable with reasons. Annex tax invoices, warranty, correspondence, and a computation of loss."
	},
	{
		id: "rti-6-7",
		title: "Request for obtaining information and disposal",
		statute: "Right to Information Act, 2005",
		citation: "RTI Act §§ 6–7",
		category: "public",
		tags: [
			"RTI",
			"information",
			"CPIO",
			"30 days",
			"fee"
		],
		text: "A person seeking information under the Act shall make a request in writing or through electronic means in English or Hindi or the official language of the area, specifying the particulars of the information sought, to the Central or State Public Information Officer. The applicant is not required to give any reason. The CPIO shall render reasonable assistance. Section 7: the information shall ordinarily be provided within thirty days of the request (forty-eight hours where the information concerns life or liberty), on payment of the prescribed fee. If the request is rejected, reasons, the period of appeal, and particulars of the appellate authority must be stated. Deemed refusal on silence. First appeal under § 19(1) in 30 days; second appeal to the Information Commission."
	},
	{
		id: "rti-8",
		title: "Exemption from disclosure of information",
		statute: "Right to Information Act, 2005",
		citation: "RTI Act § 8",
		category: "public",
		tags: [
			"exemption",
			"fiduciary",
			"privacy",
			"cabinet",
			"commercial confidence"
		],
		text: "Section 8 exempts, among others, information that would prejudicially affect sovereignty, security, strategic, scientific or economic interests, or relations with a foreign State; information which has been expressly forbidden by a court; information the disclosure of which would cause a breach of privilege of Parliament or State Legislature; commercial confidence, trade secrets or intellectual property where disclosure harms a competitive position (unless larger public interest); information available to a person in a fiduciary relationship; information received in confidence from a foreign government; information that would endanger life or physical safety; cabinet papers (with conditions); and personal information the disclosure of which has no relationship to any public activity or interest and would cause unwarranted invasion of privacy, unless larger public interest justifies disclosure. Information that cannot be denied to Parliament cannot be denied to a citizen. Severability under § 10 applies."
	},
	{
		id: "tpa-105-108",
		title: "Lease defined; how made; rights and liabilities",
		statute: "Transfer of Property Act, 1882",
		citation: "TPA §§ 105, 107, 108",
		category: "property",
		tags: [
			"lease",
			"rent",
			"lessor",
			"lessee",
			"registration",
			"duration"
		],
		text: "A lease of immovable property is a transfer of a right to enjoy such property, made for a certain time, express or implied, or in perpetuity, in consideration of a price paid or promised, or of money, a share of crops, service or any other thing of value, to be rendered periodically or on specified occasions to the transferor by the transferee (§ 105). A lease of immovable property from year to year, or for any term exceeding one year, or reserving a yearly rent, can be made only by a registered instrument (§ 107). Section 108 sets default rights and liabilities: the lessor is bound to disclose material defects in title, to give possession, and to leave the lessee in quiet enjoyment; the lessee is bound to pay rent, to keep the property in reasonable repair (subject to contract), not to use for a purpose other than that for which it was leased, and to restore possession on determination. State rent-control statutes may overlay.",
		note: "Residential leases of 11 months are commonly left unregistered; advise on stamp duty, police verification where required, and inventory of fittings."
	},
	{
		id: "tpa-54",
		title: "Sale of immovable property",
		statute: "Transfer of Property Act, 1882",
		citation: "TPA § 54",
		category: "property",
		tags: [
			"sale",
			"immovable",
			"registration",
			"conveyance",
			"title"
		],
		text: "Sale is a transfer of ownership in exchange for a price paid or promised or part-paid and part-promised. Such transfer, in the case of tangible immovable property of the value of one hundred rupees and upwards, can be made only by a registered instrument. A contract for sale does not, of itself, create any interest in or charge on such property. Title due diligence (mother deeds, encumbrance certificate, khata/mutation, tax receipts, RERA where applicable, and capacity of the vendor) precedes drafting. Part performance under § 53A may protect a transferee in possession under an unregistered writing who has performed or is willing to perform his part."
	},
	{
		id: "sra-10-14",
		title: "Specific performance of contracts",
		statute: "Specific Relief Act, 1963",
		citation: "SRA §§ 10, 14, 16",
		category: "contract",
		tags: [
			"specific performance",
			"ready and willing",
			"discretion",
			"immovable"
		],
		text: "After the 2018 amendments, specific performance is a general rule, not a distant discretionary remedy, subject to the bars in § 14 (contracts where compensation is adequate in specified senses, contracts depending on personal qualifications, contracts of a determinable nature, and contracts the performance of which involves the performance of a continuous duty which the court cannot supervise). Section 16: specific performance cannot be enforced in favour of a person who has not performed or is not ready and willing to perform the essential terms, or who has become incapable, or who fails to prove that he has performed or been ready and willing from the date of the contract. Averment and proof of readiness and willingness remain indispensable in a suit for specific performance of a sale of immovable property."
	},
	{
		id: "sra-injunction",
		title: "Preventive relief — injunctions",
		statute: "Specific Relief Act, 1963",
		citation: "SRA §§ 36–42",
		category: "procedure",
		tags: [
			"injunction",
			"perpetual",
			"negative agreement",
			"preventive relief"
		],
		text: "Preventive relief is granted at the discretion of the court by injunction, temporary or perpetual. A perpetual injunction may be granted to prevent the breach of an obligation existing in favour of the applicant, whether express or implied. Section 41 lists bars, including where equally efficacious relief can certainly be obtained by any other usual mode of proceeding (except in breach of trust), to restrain prosecution of a judicial proceeding pending in a court not subordinate, to prevent a continuing breach in which the applicant has acquiesced, and when the conduct of the applicant disenables him. Section 42: a negative agreement may be enforced by injunction even if specific performance of the affirmative cannot be granted, subject to conditions."
	},
	{
		id: "limitation-3-5",
		title: "Bar of limitation and condonation of delay",
		statute: "Limitation Act, 1963",
		citation: "Limitation Act §§ 3, 5",
		category: "procedure",
		tags: [
			"limitation",
			"condonation",
			"sufficient cause",
			"bar"
		],
		text: "Subject to sections 4 to 24, every suit instituted, appeal preferred, and application made after the prescribed period shall be dismissed, although limitation has not been set up as a defence (§ 3). The court has no option. Section 5 permits condonation of delay in appeals and certain applications (not suits) if the appellant or applicant satisfies the court that he had sufficient cause for not preferring the appeal or making the application within the period. 'Sufficient cause' is elastic but does not reward negligence. Periods: many simple money suits — 3 years from when the loan is repayable or the account is stated; specific performance — 3 years from the date fixed for performance or from refusal; possession of immovable property based on title — 12 years; tort — 1 or 3 years depending on the article. Always plead the starting point of limitation in the plaint."
	},
	{
		id: "hma-13-13b",
		title: "Divorce and divorce by mutual consent",
		statute: "Hindu Marriage Act, 1955",
		citation: "HMA §§ 13, 13B",
		category: "family",
		tags: [
			"divorce",
			"mutual consent",
			"cruelty",
			"desertion",
			"13B",
			"hindu"
		],
		text: "Section 13 provides grounds for divorce for a Hindu marriage, including adultery, cruelty, desertion for a continuous period of not less than two years, conversion, unsoundness of mind, virulent and incurable leprosy (as historically worded; later reforms and reading down apply), venereal disease in a communicable form, renunciation, and presumption of death. Cruelty is both physical and mental. Section 13B: a petition for dissolution by mutual consent may be presented by both parties on the ground that they have been living separately for a period of one year or more, that they have not been able to live together, and that they have mutually agreed that the marriage should be dissolved. After motion (first and second), the court passes a decree if the petition is not withdrawn. The statutory cooling period of six months has been held to be directory and waivable in appropriate cases by the Supreme Court. Settlement on alimony, custody and property should be recorded."
	},
	{
		id: "hma-24-25",
		title: "Maintenance pendente lite and permanent alimony",
		statute: "Hindu Marriage Act, 1955",
		citation: "HMA §§ 24–25",
		category: "family",
		tags: [
			"maintenance",
			"alimony",
			"pendente lite",
			"expenses of proceedings"
		],
		text: "Section 24: where it appears that either the wife or the husband has no independent income sufficient for her or his support and the necessary expenses of the proceeding, the court may order the other party to pay the expenses of the proceeding and monthly support during the proceeding having regard to the petitioner's and respondent's income. Section 25: the court may, at the time of passing any decree or at any time subsequent thereto, order permanent alimony and maintenance, gross or monthly, having regard to the income and property of the parties, their conduct, and other circumstances. The order may be varied on change of circumstances and may be cancelled if the recipient remarries or does not remain chaste (as the section provides, subject to later judicial reading)."
	},
	{
		id: "will-succession",
		title: "Wills under the Indian Succession Act",
		statute: "Indian Succession Act, 1925",
		citation: "ISA §§ 59, 63, 74",
		category: "family",
		tags: [
			"will",
			"testament",
			"attestation",
			"executor",
			"probate"
		],
		text: "Every person of sound mind not being a minor may dispose of his property by will (§ 59). Execution of unprivileged wills (§ 63): the testator shall sign or affix his mark, or it shall be signed by some other person in his presence and by his direction, so that it appears that it was intended to give effect to the writing as a will; it shall be attested by two or more witnesses, each of whom has seen the testator sign or affix his mark (or received from the testator a personal acknowledgment of his signature), and each of whom signs in the presence of the testator. Section 74: the intention of the testator is to be effectuated from the words of the will. Hindus, Buddhists, Sikhs and Jains are covered in part; Muslims generally make wills under their personal law (with the one-third restriction for bequests to non-heirs without heir consent). Registration is optional but prudent. Probate is compulsory in the erstwhile presidency towns for wills of persons leaving property there."
	},
	{
		id: "poa-act",
		title: "Powers of attorney",
		statute: "Powers-of-Attorney Act, 1882",
		citation: "Powers-of-Attorney Act §§ 1A, 2",
		category: "drafting",
		tags: [
			"power of attorney",
			"attorney",
			"authentication",
			"notary",
			"registration"
		],
		text: "A power of attorney includes any instrument empowering a specified person to act for and in the name of the person executing it. The donee of a power of attorney may, if he thinks fit, execute or do any assurance, instrument or thing in and with his own name and signature, and his own seal (where sealing is required), by the authority of the donor. Authentication by a notary public, or any court, Judge, Magistrate, Indian Consul or Vice-Consul, or representative of the Central Government, attracts a statutory presumption. Registration is required when the power authorises transfer of immovable property in the manner attracted by the Registration Act. Stamp duty is a State subject. Special vs general, and revocable vs coupled with interest, must be explicit. NRI donors often execute before a consulate and send for adjudication of stamp in India."
	},
	{
		id: "affidavit-oaths",
		title: "Affidavits and oaths",
		statute: "Code of Civil Procedure, 1908; Oaths Act, 1969",
		citation: "Order XIX CPC; Oaths Act",
		category: "drafting",
		tags: [
			"affidavit",
			"notary",
			"oath",
			"verification",
			"deponent"
		],
		text: "An affidavit is a declaration of facts made in writing, sworn or affirmed before a person authorised to administer oaths (notary, oaths commissioner, or magistrate). Order XIX CPC permits the court to order that any particular fact may be proved by affidavit. The deponent must speak to facts within his own knowledge, and where statements are on information, the source must be disclosed. Verification, place, date, and identification (Aadhaar or other ID) are essential. False affidavit attracts BNS offences relating to false evidence. Annexures should be marked and initialled. Stamp as per State law."
	},
	{
		id: "ca-166-179",
		title: "Duties of directors and powers of the Board",
		statute: "Companies Act, 2013",
		citation: "Companies Act §§ 166, 179",
		category: "corporate",
		tags: [
			"director duties",
			"board",
			"fiduciary",
			"resolution",
			"company"
		],
		text: "Section 166: a director shall act in accordance with the articles; act in good faith in order to promote the objects of the company for the benefit of its members as a whole, and in the best interests of the company, its employees, the shareholders, the community and for the protection of environment; exercise duties with due and reasonable care, skill and diligence and independent judgment; not be involved in a situation of direct or indirect conflict; not achieve or attempt to achieve any undue gain; and not assign his office. Section 179: the Board is entitled to exercise all such powers as the company is authorised to exercise, subject to the Act, memorandum, articles and regulations. Specified powers (to issue securities, borrow, invest, grant loans, approve financial statements, diversify, etc.) are to be exercised by means of resolutions at meetings of the Board. Minutes and the common seal / authorised signatory clause should be consistent with the articles."
	},
	{
		id: "ca-241",
		title: "Oppression and mismanagement",
		statute: "Companies Act, 2013",
		citation: "Companies Act § 241",
		category: "corporate",
		tags: [
			"oppression",
			"mismanagement",
			"nclt",
			"minority"
		],
		text: "Any member (with the shareholding thresholds in § 244) may apply to the NCLT if the affairs of the company are being conducted in a manner prejudicial to public interest or oppressive to any member or members or prejudicial to the interests of the company, or if a material change (including change in control) has taken place not in the interest of members or the company. The Tribunal has a wide remedial palette under § 242 (regulation of conduct, purchase of shares, termination of agreements, removal of directors). This is the Indian analogue of unfair-prejudice petitions and is frequently pleaded alongside breach of a shareholders' agreement."
	},
	{
		id: "arb-7-8-9",
		title: "Arbitration agreement, reference, and interim measures",
		statute: "Arbitration and Conciliation Act, 1996",
		citation: "A&C Act §§ 7, 8, 9, 11",
		category: "commercial",
		tags: [
			"arbitration",
			"agreement",
			"section 8",
			"interim",
			"appointment"
		],
		text: "An arbitration agreement is an agreement by the parties to submit to arbitration all or certain disputes which have arisen or which may arise between them in respect of a defined legal relationship, whether contractual or not. It must be in writing (including electronic communication and an exchange of statements of claim and defence in which the existence of the agreement is alleged by one and not denied by the other) (§ 7). A judicial authority before which an action is brought shall, if a party so applies not later than the date of submitting the first statement on the substance of the dispute, refer the parties to arbitration unless it finds that prima facie no valid arbitration agreement exists (§ 8). Section 9 permits the court to grant interim measures before or during arbitration or after the award but before enforcement. Section 11 governs appointment when the agreed procedure fails; the Supreme Court / High Court examines existence of the agreement at a prima facie level after the 2015/2019 amendments."
	},
	{
		id: "arb-34-36",
		title: "Setting aside and enforcement of arbitral awards",
		statute: "Arbitration and Conciliation Act, 1996",
		citation: "A&C Act §§ 34, 36",
		category: "commercial",
		tags: [
			"award",
			"set aside",
			"public policy",
			"enforcement",
			"stay"
		],
		text: "An application for setting aside an award may be made on the limited grounds in § 34: incapacity, invalid agreement, lack of notice, award beyond the scope of submission, illegal composition or procedure, non-arbitrability, or conflict with the public policy of India (fraud, corruption, contravention of fundamental policy of Indian law, or most basic notions of morality or justice). Patent illegality appearing on the face of the award is a ground for domestic awards. The application must be made within three months (extendable by 30 days on sufficient cause, not thereafter). An award is enforced as a decree under § 36, subject to a stay on separate application showing grounds akin to CPC Order XLI rule 5, often on deposit. Unreasoned awards and those ignoring vital evidence are vulnerable."
	},
	{
		id: "it-66-66d",
		title: "Computer-related offences and cheating by personation using computer resource",
		statute: "Information Technology Act, 2000",
		citation: "IT Act §§ 43, 66, 66C, 66D",
		category: "criminal",
		tags: [
			"cyber",
			"phishing",
			"otp",
			"identity theft",
			"computer",
			"intermediary"
		],
		text: "Section 43 provides civil damages for unauthorised access, downloading, introducing viruses, denying access, and destroying information in a computer resource. Section 66 criminalises the same if done dishonestly or fraudulently. Section 66C: identity theft — fraudulent or dishonest use of another person's electronic signature, password or other unique identification feature. Section 66D: cheating by personation by using a computer resource. Phishing, fake KYC, and OTP fraud are commonly charged under 66C/66D together with BNS cheating and, where a bank account is used, money-laundering provisions. Intermediary safe harbour is in § 79, subject to due diligence and the 2021 IT Rules. Preserve server logs, bank entries, and a BSA electronic-evidence certificate."
	},
	{
		id: "dpdp-consent",
		title: "Digital Personal Data Protection — consent and rights",
		statute: "Digital Personal Data Protection Act, 2023",
		citation: "DPDP Act 2023",
		category: "corporate",
		tags: [
			"privacy",
			"personal data",
			"consent",
			"data principal",
			"fiduciary"
		],
		text: "The DPDP Act, 2023 regulates processing of digital personal data. Processing is permitted for a lawful purpose with the free, specific, informed, unconditional and unambiguous consent of the data principal, or on certain legitimate uses. Notice must describe the personal data and the purpose. Consent can be withdrawn. Data principals have rights of access, correction, erasure, and grievance redressal. Data fiduciaries must implement reasonable security safeguards; significant data fiduciaries have extra obligations (DPO, audit, DPIA). Cross-border transfer is permitted except to countries restricted by the Central Government. Privacy notices and HR/customer consent clauses should be redrawn to this standard rather than a copied GDPR recitation."
	},
	{
		id: "ida-retrenchment",
		title: "Workman, retrenchment and conditions precedent",
		statute: "Industrial Disputes Act, 1947",
		citation: "IDA §§ 2(s), 2(oo), 25F",
		category: "labour",
		tags: [
			"workman",
			"retrenchment",
			"compensation",
			"notice",
			"industrial dispute"
		],
		text: "A workman is any person employed in any industry to do any manual, unskilled, skilled, technical, operational, clerical or supervisory work for hire or reward, excluding those mainly in a managerial or administrative capacity and supervisors drawing wages above the notified ceiling. Retrenchment is termination by the employer for any reason whatsoever otherwise than as a punishment inflicted by way of disciplinary action, but excluding voluntary retirement, superannuation, non-renewal of contract, and termination on continued ill-health. Section 25F: no workman employed in any industry who has been in continuous service for not less than one year shall be retrenched until (a) one month's notice or pay in lieu, (b) retrenchment compensation equivalent to fifteen days' average pay for every completed year of continuous service or any part thereof in excess of six months, and (c) notice in the prescribed manner to the appropriate government. Last-come-first-go and re-employment preferences apply. State Shops and Establishments Acts and the new labour codes (as notified) must be checked."
	},
	{
		id: "posh-2013",
		title: "Sexual harassment at workplace",
		statute: "Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013",
		citation: "POSH Act 2013",
		category: "labour",
		tags: [
			"POSH",
			"sexual harassment",
			"ICC",
			"workplace",
			"vishaka"
		],
		text: "The POSH Act gives statutory shape to Vishaka. Sexual harassment includes unwelcome sexually determined behaviour, whether directly or by implication: physical contact and advances, a demand or request for sexual favours, sexually coloured remarks, showing pornography, or any other unwelcome physical, verbal or non-verbal conduct of a sexual nature. Workplace is widely defined, including dwelling places in the nature of a dwelling-cum-office and transportation provided by the employer. Every employer of a workplace with 10 or more workers shall constitute an Internal Committee. A complaint is generally to be made within three months (extendable by three). During inquiry the Committee may recommend leave or transfer. The inquiry is to be completed in 90 days. Conciliation is possible before inquiry, but not on a monetary basis. Employment contracts and standing orders should cross-refer to the POSH policy."
	},
	{
		id: "stamp-registration",
		title: "Stamping and registration of instruments",
		statute: "Indian Stamp Act, 1899; Registration Act, 1908",
		citation: "Stamp Act; Registration Act §§ 17, 49",
		category: "drafting",
		tags: [
			"stamp duty",
			"registration",
			"admissibility",
			"instrument",
			"immovable"
		],
		text: "Instruments chargeable with stamp duty must be stamped before or at the time of execution. An insufficiently stamped instrument is inadmissible in evidence and cannot be acted upon by a public officer, subject to the deficit-plus-penalty path of impounding. Stamp is largely a State subject; duty on a lease, conveyance, or power of attorney varies by State. Registration Act § 17 lists documents of which registration is compulsory, including non-testamentary instruments which purport to create, declare, assign, limit or extinguish any right, title or interest of the value of one hundred rupees and upwards in immovable property, and leases of immovable property from year to year or for any term exceeding one year. Section 49: a compulsorily registrable document which is not registered shall not affect immovable property or be received as evidence of any transaction affecting such property, except as evidence of a contract in a suit for specific performance, as evidence of part performance under TPA § 53A, or as evidence of any collateral transaction. Always specify who bears stamp and registration cost in the draft."
	},
	{
		id: "draft-cause-title",
		title: "Cause title, parties, and verification",
		statute: "Code of Civil Procedure, 1908; drafting practice",
		citation: "Order VI rr. 14–15; Order I CPC",
		category: "drafting",
		tags: [
			"cause title",
			"verification",
			"parties",
			"pleadings",
			"prayer"
		],
		text: "Indian pleadings follow a stable architecture: (1) forum line — 'IN THE COURT OF …'; (2) cause title with appellant/petitioner/plaintiff versus respondent/defendant, with parentage, age, occupation and address; (3) the nature of the proceeding (suit for recovery; petition under Article 226; complaint under NI Act § 142); (4) an index of dates and events in substantial matters; (5) numbered paragraphs of facts in chronological order, each confined to a distinct allegation; (6) grounds (in writs and appeals); (7) a distinct 'PRAYER' clause with alternative reliefs, costs, and 'any other order as this Hon'ble Court may deem fit'; (8) place, date, and signature of the party and the advocate; (9) verification under Order VI rule 15 identifying which paragraphs are true to knowledge and which on information received and believed to be true, signed and dated. Affidavits supporting writs and applications are annexed. Vakalatnama authorises appearance. Never omit limitation, jurisdiction, and valuation paragraphs in a plaint."
	},
	{
		id: "draft-legal-notice",
		title: "Form and function of a legal notice",
		statute: "Drafting practice; Contract Act; NI Act; CPC § 80",
		citation: "Practice — legal notice",
		category: "drafting",
		tags: [
			"legal notice",
			"without prejudice",
			"demand",
			"limitation",
			"reply"
		],
		text: "A legal notice is a formal written demand sent before action. It interrupts nothing by itself except where a statute so provides (NI Act § 138; CPC § 80; certain tenancy and municipal statutes). A well-drawn notice: identifies the sender and advocate; narrates material facts without argumentative surplus; states the legal character of the claim (debt, breach, defamation, statutory notice); specifies a clear demand and a reasonable time to comply (15 days is common; 15 days is mandatory for NI 138 after receipt; two months for CPC 80); reserves rights; and is dispatched to every necessary address by registered post AD, courier, email and WhatsApp as a belt-and-suspenders record. 'Without prejudice' is used when the notice contains a settlement offer that should not be treated as an admission. A reply should meet each allegation, avoid new admissions, and keep the door to without-prejudice talks open. Preserve postal receipts, tracking, and returned envelopes."
	},
	{
		id: "draft-jurisdiction-limitation",
		title: "Pleading jurisdiction and limitation",
		statute: "CPC; Limitation Act; practice",
		citation: "Practice — jurisdiction and limitation",
		category: "drafting",
		tags: [
			"jurisdiction",
			"limitation",
			"cause of action",
			"valuation",
			"court fee"
		],
		text: "Every originating process should contain dedicated paragraphs: (a) how the forum has territorial, pecuniary and subject-matter jurisdiction, mapping CPC §§ 15–20, the relevant special statute, or Article 226 cause of action; (b) when the cause of action arose, the article of the Limitation Act (or special period), and why the claim is in time, including acknowledgements under Limitation Act § 18 and exclusion under §§ 12–14; (c) valuation for jurisdiction and court-fee, and the court-fee paid. Misvaluation and limitation are favourite Order VII rule 11 and written-statement defences. In criminal complaints, plead the date of offence, continuing cause if any, and the special period (for example NI Act § 142). In consumer complaints, plead consideration paid to fix pecuniary jurisdiction under the 2019 Act."
	},
	{
		id: "const-basic-structure",
		title: "Basic structure and constitutional review",
		statute: "Constitution of India (judicial doctrine)",
		citation: "Kesavananda Bharati principle",
		category: "constitutional",
		tags: [
			"basic structure",
			"amendment",
			"judicial review",
			"kesavananda"
		],
		text: "The Supreme Court in Kesavananda Bharati v. State of Kerala held that the power of Parliament to amend the Constitution under Article 368 does not extend to damaging or destroying its basic structure. Elements commonly treated as basic include supremacy of the Constitution, rule of law, separation of powers, judicial review, federalism, secularism, and free and fair elections. The doctrine is invoked sparingly in challenges to constitutional amendments, not as a roving ground against ordinary legislation (ordinary laws are tested on Part III and legislative competence). When drafting a writ against an amendment or a law that hollows out judicial review, plead the precise basic feature and the manner of its alleged abrogation."
	},
	{
		id: "evidence-burden",
		title: "Burden of proof and standard",
		statute: "Bharatiya Sakshya Adhiniyam, 2023",
		citation: "BSA — burden of proof",
		category: "evidence",
		tags: [
			"burden of proof",
			"preponderance",
			"beyond reasonable doubt",
			"presumption"
		],
		text: "Whoever desires any court to give judgment as to any legal right or liability dependent on the existence of facts which he asserts, must prove that those facts exist. In civil cases the standard is preponderance of probabilities; in criminal cases the prosecution must prove guilt beyond reasonable doubt, and the accused may discharge certain statutory burdens (for example NI Act § 139) on a preponderance. Facts especially within the knowledge of a person must be proved by him. Presumptions — of regularity of official acts, of legitimacy, of death after seven years' unexplained absence — structure many pleadings. An affidavit in support should not confuse knowledge with belief."
	},
	{
		id: "cpa-ecommerce-rules",
		title: "Duties of e-commerce entities",
		statute: "Consumer Protection (E-Commerce) Rules, 2020",
		citation: "E-Commerce Rules, 2020",
		category: "consumer",
		tags: [
			"e-commerce",
			"marketplace",
			"inventory",
			"online store",
			"terms of service",
			"grievance officer"
		],
		text: "The Consumer Protection (E-Commerce) Rules, 2020 apply to e-commerce entities offering goods or services over a digital or electronic network, including inventory and marketplace models, but not to a natural person carrying on a profession in a personal capacity. Every e-commerce entity must not adopt any unfair trade practice, must display the total price of goods or services including all compulsory charges, and must appoint a grievance officer whose name, contact details and designation are published on the platform. The officer is to acknowledge a complaint within forty-eight hours and dispose of it within one month. Entities must not manipulate the price of goods or services to gain unreasonable profit, or discriminate among consumers of the same class. Ranking parameters that influence search results are to be included in a description available to consumers. Country of origin of goods, and the usual terms of payment, return, exchange, refund, delivery, shipment and grievance redressal, must be displayed.",
		note: "Website policies should name a resident grievance officer, publish timelines, and match the refund/shipping text actually displayed at checkout."
	},
	{
		id: "cpa-ecommerce-inventory",
		title: "Inventory e-commerce — refunds and cancellation charges",
		statute: "Consumer Protection (E-Commerce) Rules, 2020",
		citation: "E-Commerce Rules r. 7",
		category: "consumer",
		tags: [
			"inventory",
			"refund",
			"cancellation",
			"defective",
			"late delivery",
			"shipping"
		],
		text: "An inventory e-commerce entity (one that sells goods or services it owns) shall not falsely represent itself as a consumer and post reviews, and shall not refuse to take back goods or withdraw services and to refund consideration if such goods or services are defective, deficient, delivered late, or not as advertised. Cancellation charges may be imposed on the consumer only if similar charges are borne by the e-commerce entity. Displayed refund, return, exchange, warranty, delivery and shipment terms form part of the bargain. A clause that the store never refunds, or that displayed delivery dates are purely illustrative and create no obligation, is at risk as an unfair trade practice and as an unfair contract.",
		note: "Preserve a defect / late / not-as-described refund even if the store wants a short change-of-mind window."
	},
	{
		id: "cpa-ecommerce-marketplace",
		title: "Marketplace e-commerce — seller transparency",
		statute: "Consumer Protection (E-Commerce) Rules, 2020",
		citation: "E-Commerce Rules r. 6",
		category: "consumer",
		tags: [
			"marketplace",
			"seller",
			"platform",
			"endorsement",
			"nodal officer"
		],
		text: "A marketplace e-commerce entity must require sellers to provide details (legal name, principal geographic address, customer-care number, GSTIN where applicable) and shall not list goods or services of a seller who does not have the prior written contract with the marketplace. It shall not implicitly or explicitly convey that it endorses the seller's goods, shall maintain a record of sellers, and shall distinguish advertised listings from others. It shall provide a ticket number for every complaint. A nodal officer / contact person resident in India is to be appointed for 24×7 coordination with law-enforcement agencies. The marketplace remains responsible for the due-diligence duties in the Rules even where the contract of sale is between seller and buyer."
	},
	{
		id: "cpa-unfair-contract",
		title: "Unfair contracts with consumers",
		statute: "Consumer Protection Act, 2019",
		citation: "CPA 2019 §§ 2(46), 49",
		category: "consumer",
		tags: [
			"unfair contract",
			"terms of service",
			"all sales final",
			"penalty",
			"jurisdiction ouster"
		],
		text: "An unfair contract is a contract between a manufacturer, trader or service provider and a consumer which causes a significant change in the rights of such consumer, including requiring excessive security deposits, imposing a disproportionate penalty, refusing to accept early repayment, entitling the trader to assign the contract to the consumer's detriment, or imposing an unreasonable charge or obligation for termination. The Central Authority may, after inquiry, declare any such terms void. Consumer Commissions can strike unfair terms and award refund and compensation. Clauses that oust the jurisdiction of Consumer Commissions, that waive statutory liability for defective goods, that impose one-sided cancellation fees, or that deem acceptance of every future policy change without notice, are the usual targets in Indian website terms.",
		note: "Never draft a term that waives CPA remedies or sends every dispute exclusively to a foreign seat or to arbitration without an option for the consumer forum."
	},
	{
		id: "sale-of-goods-quality",
		title: "Implied conditions as to quality and title",
		statute: "Sale of Goods Act, 1930",
		citation: "Sale of Goods Act §§ 14–16",
		category: "commercial",
		tags: [
			"merchantable quality",
			"fitness",
			"title",
			"refund",
			"defective goods"
		],
		text: "In a contract of sale there is an implied condition that the seller has the right to sell, and implied warranties of quiet possession and freedom from encumbrance (§ 14). Where the buyer makes known a particular purpose, there is an implied condition of reasonable fitness; and where goods are bought by description from a seller who deals in such goods, there is an implied condition of merchantable quality, except as to defects which examination ought to have revealed (§ 16). Online retail is typically a sale by description. Exclusion of these conditions as against a consumer is read down by the Consumer Protection Act. Refund and replacement policies should rest on these implied conditions rather than treat quality as a matter of grace."
	},
	{
		id: "dpdp-notice-children",
		title: "DPDP notice, withdrawal of consent, and children",
		statute: "Digital Personal Data Protection Act, 2023",
		citation: "DPDP Act §§ 5–9",
		category: "corporate",
		tags: [
			"consent policy",
			"privacy",
			"notice",
			"withdrawal",
			"children",
			"cookie"
		],
		text: "Before or at the time of requesting consent, the data fiduciary must give a notice describing the personal data and the purpose, in clear and plain language. Consent must be free, specific, informed, unconditional and unambiguous, capable of being withdrawn with ease comparable to that with which it was given. The request for consent must not be bundled with a request that is not reasonably necessary for the purpose (so a store cannot hide marketing consent inside checkout T&Cs). Processing of personal data of a child (under 18) requires verifiable parental consent; tracking, behavioural monitoring and targeted advertising directed at children are prohibited. Certain legitimate uses (for example voluntary provision of data for a specified purpose, or employment-related processing) sit beside consent and should not be recast as GDPR 'legitimate interests'. A privacy and consent policy for an Indian store should therefore itemise purposes, name processors, explain withdrawal, and keep analytics cookies behind a separate opt-in."
	},
	{
		id: "it-rules-grievance",
		title: "Intermediary grievance officer and due diligence",
		statute: "Information Technology Act, 2000; IT Rules, 2021",
		citation: "IT Act § 79; IT Rules 2021",
		category: "corporate",
		tags: [
			"intermediary",
			"grievance officer",
			"IT rules",
			"safe harbour",
			"terms of service"
		],
		text: "Section 79 of the IT Act confers conditional safe harbour on an intermediary who observes due diligence and does not initiate, select or modify the transmission. The Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 require publication of a privacy policy and user agreement, a grievance officer resident in India, acknowledgement of a complaint within 24 hours and disposal within 15 days, and a resident grievance / nodal contact for significant social media intermediaries. An inventory e-commerce store that sells its own goods is primarily a trader, not an intermediary, for those goods; a marketplace or a site hosting reviews and user content is an intermediary for that layer. Store terms should still publish a grievance channel that meets the stricter of the E-Commerce Rules (48 hours / one month) and, where intermediary duties apply, the IT Rules clock."
	},
	{
		id: "legal-metrology-mrp",
		title: "Declarations on packaged commodities sold online",
		statute: "Legal Metrology (Packaged Commodities) Rules, 2011",
		citation: "Packaged Commodities Rules r. 6, r. 32A",
		category: "consumer",
		tags: [
			"MRP",
			"packaged commodities",
			"e-commerce",
			"country of origin",
			"shipping"
		],
		text: "Pre-packaged commodities sold in India must bear declarations including name and address of the manufacturer/packer/importer, net quantity, month and year of manufacture, retail sale price (MRP inclusive of all taxes), and consumer-care details. For e-commerce, rule 32A requires that the marketplace or seller display these declarations (other than the date of manufacture, where impractical before dispatch) on the digital network before the consumer completes the purchase, and must not charge above MRP. Country of origin is also an e-commerce-rules display duty. Shipping and product pages should not hide MRP in a post-checkout invoice. Under-delivery of net quantity is a Legal Metrology offence as well as a consumer deficiency."
	},
	{
		id: "draft-store-policies",
		title: "Drafting Indian website and store policies",
		statute: "Drafting practice; CPA; DPDP; E-Commerce Rules",
		citation: "Practice — online store policies",
		category: "drafting",
		tags: [
			"terms of service",
			"privacy",
			"consent",
			"refund",
			"shipping",
			"clickwrap"
		],
		text: "Indian store policies are consumer-facing instruments, not US website legalese. A workable set is: (1) Terms of Service — identity of the entity, inventory vs marketplace, formation of the online contract, price inclusive of compulsory charges, IP, acceptable use, a liability cap that does not exclude CPA, death or personal injury, or fraud, and non-exclusive Indian forum language that does not oust Consumer Commissions; (2) Privacy and consent — DPDP notice, itemised purposes, withdrawal, children, processors, cookies as a separate opt-in; (3) Refund, return and cancellation — a change-of-mind window if offered, plus an unwaivable path for defect, late delivery and misdescription, and cancellation charges only if similarly borne by the store; (4) Shipping and delivery — serviceable PIN codes, dispatch SLA, displayed estimates, COD, and risk in transit until delivery. Clickwrap (an unticked box that must be ticked) is safer than browsewrap. Publish the grievance officer on every policy. Keep the four texts consistent with each other and with checkout.",
		note: "Cross-refer the four policies. Do not paste California CCPA, GDPR legitimate-interest, or 'all sales final' clauses into an Indian store."
	}
];
var K1 = 1.5;
var B = .75;
function tokenize(input) {
	return input.toLowerCase().replace(/[–—]/g, " ").split(/[^a-z0-9\u0900-\u097f]+/u).filter((t) => t.length > 1);
}
function indexedText(chunk) {
	return [
		chunk.title,
		chunk.title,
		chunk.citation,
		chunk.citation,
		chunk.statute,
		chunk.tags.join(" "),
		chunk.tags.join(" "),
		chunk.text,
		chunk.note ?? ""
	].join(" ");
}
var DOCS = CORPUS.map((chunk) => {
	const tokens = tokenize(indexedText(chunk));
	const tf = /* @__PURE__ */ new Map();
	for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
	return {
		chunk,
		tokens,
		tf
	};
});
var AVG_DL = DOCS.reduce((s, d) => s + d.tokens.length, 0) / Math.max(DOCS.length, 1);
var DF = /* @__PURE__ */ new Map();
for (const d of DOCS) for (const term of d.tf.keys()) DF.set(term, (DF.get(term) ?? 0) + 1);
var N = DOCS.length;
function idf(term) {
	const df = DF.get(term) ?? 0;
	return Math.log(1 + (N - df + .5) / (df + .5));
}
function bm25(queryTokens, doc) {
	const dl = doc.tokens.length;
	let score = 0;
	const seen = /* @__PURE__ */ new Set();
	for (const term of queryTokens) {
		if (seen.has(term)) continue;
		seen.add(term);
		const tf = doc.tf.get(term);
		if (!tf) continue;
		const denom = tf + K1 * (.25 + B * (dl / AVG_DL));
		score += idf(term) * (tf * 2.5 / denom);
	}
	return score;
}
function retrieve(options) {
	const { query, k = 8, categories } = options;
	const tokens = tokenize(expandQuery(query));
	if (!tokens.length) return [];
	const scored = [];
	for (const doc of DOCS) {
		if (categories?.length && !categories.includes(doc.chunk.category)) continue;
		const score = bm25(tokens, doc);
		if (score <= 0) continue;
		scored.push({
			...doc.chunk,
			score
		});
	}
	scored.sort((a, b) => b.score - a.score);
	return scored.slice(0, k);
}
function getChunk(id) {
	return CORPUS.find((c) => c.id === id);
}
function listCorpus(category) {
	if (!category) return CORPUS;
	return CORPUS.filter((c) => c.category === category);
}
function corpusStats() {
	const byCategory = {};
	for (const c of CORPUS) byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
	return {
		total: CORPUS.length,
		byCategory
	};
}
//#endregion
export { corpusStats, getChunk, listCorpus, retrieve, CORPUS as t };
