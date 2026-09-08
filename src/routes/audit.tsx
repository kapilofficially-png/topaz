import { useMemo, useState, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bookmark,
  ClipboardPen,
  Copy,
  Download,
  Eye,
  EyeOff,
  FileDown,
  Globe,
  Handshake,
  ListChecks,
  Loader2,
  Mail,
  Megaphone,
  Plus,
  ScanSearch,
  ScrollText,
  Send,
  Play,
  Wand2,
  Wrench,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Fold } from "@/components/fold";
import { PipelineBoard } from "@/components/pipeline-board";
import { CitationPanel, type Citation } from "@/components/citation-panel";
import { DraftPaper } from "@/components/draft-paper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  auditStoreFn,
  findPolicyGapsFn,
  fetchStorePageFn,
  refineStorePolicyFn,
  researchStoreFn,
  writeClientBriefFn,
  writeColdEmailFn,
  writeForwardEmailFn,
  writeImplementationsFn,
  writeQuestionnaireFn,
  writeSellingPointsFn,
  writeServiceAgreementFn,
} from "@/lib/ai/store-audit";
import { aiKeysPayload, rememberProvider } from "@/lib/ai/keys-store";
import { useAuditStore } from "@/lib/drafts/audit-store";
import { downloadDraftDocx, downloadMasterDocx } from "@/lib/drafts/docx-export";
import {
  downloadMasterPdf,
  downloadOriginalPoliciesPdf,
  downloadPaperPdf,
} from "@/lib/drafts/pdf-export";
import {
  applyQuestionnaireAnswers,
  callScriptText,
  emailCta,
  mailtoHref,
  parseDraftOutput,
  parseForwardEmails,
  parseStoreQuestions,
  sampleClauseText,
} from "@/lib/drafts/parse";
import { emailTouchId, usePipelineStore } from "@/lib/drafts/pipeline-store";
import { senderPayload, useSenderStore } from "@/lib/drafts/sender-store";
import { useDraftStore } from "@/lib/drafts/store";
import { notifySequenceComplete } from "@/lib/notify";
import { runStoreSequence, saveSessionPapers } from "@/lib/drafts/run-sequence";
import { isBatchRunning } from "@/lib/drafts/batch-runner";
import { POLICY_KINDS, POLICY_LABELS, type PolicyKind } from "@/lib/web/types";

export const Route = createFileRoute("/audit")({ component: AuditPage });

const EXAMPLES = ["dakshis.com"];
const PAYLOAD_CLIP = 8000;

function actionError(err: unknown, fallback: string) {
  const raw = err instanceof Error ? err.message : String(err ?? "");
  if (/too_big|Too big/i.test(raw)) {
    return "A policy in this session was too long to send in one request. Tap the button again.";
  }
  if (!raw || raw.length > 180 || raw.trim().startsWith("[") || raw.trim().startsWith("{")) {
    return fallback;
  }
  return raw;
}

const KIND_HINTS: Record<PolicyKind, string> = {
  terms: "CPA, no as-is waiver, Indian forum",
  privacy: "DPDP notice, withdrawal, children",
  consent: "Cookie/consent — as easy to withdraw as to give",
  return: "Return/exchange only; keep refund on its own page",
  refund: "Money-back and COD NEFT; keep return on its own page",
  cancellation: "Cancel before dispatch; no one-sided fee",
  shipping: "Dispatch SLA, risk, displayed estimates",
  delivery: "Delivery windows and failed attempts; cross-refer shipping",
  contact: "Legal entity, grievance officer, hours, emails",
  other: "Rewrite this live page as a standalone Indian-law document",
};

function AuditPage() {
  const session = useAuditStore();
  const sender = useSenderStore();
  const startSequence = usePipelineStore((s) => s.startSequence);
  const ensurePipeline = usePipelineStore((s) => s.ensure);
  const markSent = usePipelineStore((s) => s.markSent);
  const saveHistory = useDraftStore((s) => s.save);
  const [busy, setBusy] = useState<
    | "idle"
    | "research"
    | "audit"
    | "gaps"
    | "selling"
    | "questions"
    | "brief"
    | "implement"
    | "email"
    | "cold"
    | "agreement"
    | "pdf"
    | "docx"
    | "orig-pdf"
    | "rewrite-all"
    | "flow"
    | "fetch-page"
    | PolicyKind
  >("idle");
  const [pageTab, setPageTab] = useState<string>("");
  const [refineTab, setRefineTab] = useState<string>("");
  const [rewriteUrl, setRewriteUrl] = useState<string>("");
  const [rewriteProgress, setRewriteProgress] = useState<{
    current: number;
    total: number;
    title: string;
  } | null>(null);
  const [flowProgress, setFlowProgress] = useState<{
    current: number;
    total: number;
    title: string;
  } | null>(null);
  const [sequenceNotice, setSequenceNotice] = useState<{
    host: string;
    finishedAt: number;
    rewriteOk: number;
    rewriteTotal: number;
    failed: string[];
  } | null>(null);
  const [extraUrl, setExtraUrl] = useState("");
  const [extraKind, setExtraKind] = useState<"auto" | PolicyKind>("auto");
  const [extraHidden, setExtraHidden] = useState(false);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  function isOpen(id: string) {
    return Boolean(open[id]);
  }
  function toggleFold(id: string) {
    setOpen((s) => ({ ...s, [id]: !s[id] }));
  }
  function reveal(id: string) {
    setOpen((s) => ({ ...s, [id]: true }));
  }

  const working = busy !== "idle";

  async function research(url = session.urlInput, nested = false) {
    const target = url.trim();
    if (target.length < 4) {
      toast.error("Paste a store address — for example dakshis.com");
      return false;
    }
    session.setUrlInput(target);
    if (!nested) setBusy("research");
    try {
      const result = await researchStoreFn({ data: { url: target } });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      session.setResearch({
        origin: result.origin,
        host: result.host,
        homeTitle: result.homeTitle,
        pages: result.pages,
        missing: result.missing,
        hints: result.hints,
      });
      ensurePipeline(result.host, result.origin);
      setPageTab(result.pages[0]?.url ?? "");
      if (result.pages.length === 0) {
        toast.error("No policy pages were readable. The store may block fetches.");
        return false;
      }
      if (!nested) {
        toast.success(
          `Read ${result.pages.length} legal page${result.pages.length === 1 ? "" : "s"} on ${result.host}`,
        );
        reveal("pages");
      }
      return true;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function addLivePage() {
    const origin = useAuditStore.getState().origin;
    if (!origin) {
      toast.error("Research the store first, then add extra policy URLs.");
      return;
    }
    const raw = extraUrl.trim();
    if (raw.length < 2) {
      toast.error("Paste the full policy URL, or a path like /pages/return-policy.");
      return;
    }
    const resolved = raw.startsWith("/")
      ? `${origin.replace(/\/$/, "")}${raw}`
      : raw;
    setBusy("fetch-page");
    try {
      const result = await fetchStorePageFn({
        data: {
          url: resolved,
          kind: extraKind === "auto" ? undefined : extraKind,
          hidden: extraHidden,
        },
      });
      if (!result.ok) {
        toast.error(actionError(result.error, "Could not read that page."));
        return;
      }
      try {
        const host = new URL(result.page.url).host.replace(/^www\./, "");
        const current = useAuditStore.getState().host.replace(/^www\./, "");
        if (current && host !== current) {
          toast.error(`That URL is on ${host}, not ${current}.`);
          return;
        }
      } catch {
        /* keep going */
      }
      useAuditStore.getState().addPage(result.page);
      setPageTab(result.page.url);
      setExtraUrl("");
      reveal("pages");
      toast.success(
        `Added “${result.page.title}”${result.page.hidden ? " (hidden from homepage)" : ""}.`,
      );
    } finally {
      setBusy("idle");
    }
  }

  async function audit(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("audit");
    try {
      const result = await auditStoreFn({
        data: {
          origin: s.origin,
          host: s.host,
          homeTitle: s.homeTitle,
          hints: s.hints ?? undefined,
          pages: s.pages.map((p) => ({
            kind: p.kind,
            label: p.label,
            url: p.url,
            title: p.title,
            text: p.text.slice(0, 9000),
            hidden: Boolean(p.hidden),
            added: Boolean(p.added),
          })),
          missing: s.missing,
          aiKeys: aiKeysPayload(),
        },
      });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        s.setFindings("", result.citations);
        return false;
      }
      rememberProvider(result);
      s.setFindings(result.text, result.citations);
      if (!nested) {
        toast.success("Audit complete. Review the gaps, then rewrite a policy.");
        reveal("audit");
        reveal("rewrite");
      }
      return true;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function refinePage(
    page: {
      kind: PolicyKind;
      url: string;
      title: string;
      text: string;
      label: string;
    },
    quiet = false,
  ) {
    const s = useAuditStore.getState();
    const answered = [
      ...Object.entries(s.briefAnswers),
      ...Object.entries(s.answers),
    ]
      .filter(([, v]) => v.trim())
      .map(([id, answer]) => `${id}: ${answer}`)
      .join("\n");
    try {
      const result = await refineStorePolicyFn({
        data: {
          kind: page.kind,
          origin: s.origin,
          host: s.host,
          pageUrl: page.url || undefined,
          pageTitle: page.title || page.label,
          findings: s.findings,
          currentPolicy: page.text.slice(0, 12000),
          extraInstruction: answered
            ? `Merchant questionnaire answers (use these instead of [TO BE COMPLETED] where they fit):\n${answered}`
            : undefined,
          aiKeys: aiKeysPayload(),
        },
      });
      if (!result.ok) {
        if (!quiet) toast.error(actionError(result.error, "That request did not complete."));
        return null;
      }
      rememberProvider(result);
      const item = {
        kind: page.kind,
        url: page.url,
        slug: result.slug,
        title: result.title,
        raw: result.text,
      };
      s.setRefined(item);
      setRefineTab(page.url || page.kind);
      if (!quiet) toast.success(`Revised “${result.title}” drafted.`);
      return item;
    } catch (err) {
      if (!quiet) toast.error(actionError(err, "That rewrite did not complete."));
      return null;
    }
  }

  async function refine(page: {
    kind: PolicyKind;
    url: string;
    title: string;
    text: string;
    label: string;
  }) {
    if (!session.findings) {
      toast.error("Run the Indian-law audit first so the rewrite has findings to use.");
      return;
    }
    setBusy(page.kind);
    setRewriteUrl(page.url);
    try {
      await refinePage(page);
      reveal("rewrite");
    } finally {
      setBusy("idle");
      setRewriteUrl("");
    }
  }

  function currentRewriteCards() {
    const s = useAuditStore.getState();
    const live = s.pages.map((p) => ({ ...p, missing: false }));
    const missing = s.missing
      .filter((m) => !s.pages.some((p) => p.kind === m.kind))
      .map((m) => ({
        kind: m.kind,
        label: m.label,
        url: "",
        title: m.label,
        text: "",
        chars: 0,
        status: 0,
        hidden: false,
        added: false,
        missing: true,
      }));
    return [...live, ...missing];
  }

  async function refineAll(nested = false) {
    const s = useAuditStore.getState();
    if (!s.findings) {
      toast.error("Run the Indian-law audit first so the rewrite has findings to use.");
      return { ok: false, rewriteOk: 0, rewriteTotal: 0, failed: ["Revise policies"] };
    }
    const cards = currentRewriteCards();
    if (!cards.length) {
      toast.error("Research a store first.");
      return { ok: false, rewriteOk: 0, rewriteTotal: 0, failed: ["Revise policies"] };
    }
    if (!nested) {
      setBusy("rewrite-all");
      reveal("rewrite");
    }
    const written: typeof s.refined = [];
    const failed: string[] = [];
    const pause = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

    async function one(page: (typeof cards)[number], index: number, total: number) {
      setRewriteUrl(page.url);
      setRewriteProgress({
        current: index + 1,
        total,
        title: page.title || POLICY_LABELS[page.kind],
      });
      let item = await refinePage(page, true);
      if (!item) {
        await pause(800);
        item = await refinePage(page, true);
      }
      if (item) written.push(item);
      else failed.push(page.title || POLICY_LABELS[page.kind]);
    }

    try {
      for (let i = 0; i < cards.length; i += 1) {
        await one(cards[i], i, cards.length);
        if (i < cards.length - 1) await pause(400);
      }
      useAuditStore.getState().replaceRefined(written);
      if (!nested) {
        if (!failed.length) {
          toast.success(`Rewrote all ${written.length} pages for ${s.host}.`);
        } else {
          toast.error(
            `${written.length} rewritten, ${failed.length} failed (${failed.join(", ")}). Tap the failed cards to retry.`,
          );
        }
      }
      return {
        ok: failed.length === 0,
        rewriteOk: written.length,
        rewriteTotal: cards.length,
        failed,
      };
    } catch (err) {
      useAuditStore.getState().replaceRefined(written);
      if (!nested) toast.error(actionError(err, "Rewrite-all stopped before finishing."));
      return {
        ok: false,
        rewriteOk: written.length,
        rewriteTotal: cards.length,
        failed: failed.length ? failed : ["Revise policies"],
      };
    } finally {
      if (!nested) {
        setBusy("idle");
        setRewriteUrl("");
        setRewriteProgress(null);
      }
    }
  }

  function improvedPayload() {
    const s = useAuditStore.getState();
    const send = useSenderStore.getState();
    return {
      origin: s.origin,
      host: s.host,
      homeTitle: s.homeTitle,
      hints: s.hints ?? undefined,
      pages: s.pages.map((p) => ({
        kind: p.kind,
        label: p.label,
        url: p.url,
        title: p.title,
        text: p.text.slice(0, 9000),
        hidden: Boolean(p.hidden),
        added: Boolean(p.added),
      })),
      missing: s.missing,
      findings: s.findings?.slice(0, 8000) || undefined,
      gapsPaper: s.gapsPaper?.slice(0, 8000) || undefined,
      questionnairePaper: s.questionsPaper?.slice(0, 8000) || undefined,
      clientBrief: s.briefPaper?.slice(0, 8000) || undefined,
      implementPaper: s.implementPaper?.slice(0, 8000) || undefined,
      answers: [
        ...Object.entries(s.briefAnswers),
        ...Object.entries(s.answers),
      ]
        .filter(([, v]) => v.trim())
        .slice(0, 24)
        .map(([id, answer]) => ({
          id: id.slice(0, 40),
          title: id.slice(0, 200),
          answer: answer.slice(0, 800),
        })),
      refined: s.refined.slice(0, 12).map((r) => ({
        kind: r.kind,
        title: r.title.slice(0, 200),
        text: (parseDraftOutput(r.raw).draft || r.raw).slice(0, PAYLOAD_CLIP),
      })),
      sender: senderPayload(send),
    };
  }

  async function findGaps(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("gaps");
    try {
      const result = await findPolicyGapsFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setGapsPaper(result.text, result.citations);
      if (!nested) {
        toast.success(
          s.refined.length
            ? "Gap register updated against the live pages and your rewrites."
            : "Gap register ready. Rewrite a policy, then run this again to see what closed.",
        );
        reveal("gaps");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not score remaining gaps."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeSelling(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("selling");
    try {
      const result = await writeSellingPointsFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setSellingPaper(result.text, result.citations);
      if (!nested) {
        toast.success("Selling points ready — store copy plus your pitch to this founder.");
        reveal("selling");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not write selling points."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeQuestions(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("questions");
    try {
      const result = await writeQuestionnaireFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setQuestionsPaper(result.text, result.citations);
      if (!nested) {
        toast.success("Legal-facts questionnaire ready.");
        reveal("facts");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not build the legal-facts questionnaire."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeBrief(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("brief");
    try {
      const result = await writeClientBriefFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setBriefPaper(result.text, result.citations);
      if (!nested) {
        toast.success("Client-needs brief ready. Send it, or fill it on the call.");
        reveal("brief");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not draft the client brief."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeImplement(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("implement");
    try {
      const result = await writeImplementationsFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setImplementPaper(result.text, result.citations);
      if (!nested) {
        toast.success("Implementation playbook drafted for this store.");
        reveal("implement");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not draft the playbook."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeEmail(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("email");
    try {
      const result = await writeForwardEmailFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "That request did not complete."));
        return false;
      }
      rememberProvider(result);
      s.setEmailPaper(result.text, result.citations);
      if (!nested) {
        toast.success("Forward-ready emails drafted. Copy or open in your mail app.");
        reveal("emails");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not draft the emails."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeCold(nested = false) {
    const s = useAuditStore.getState();
    if (!s.pages.length) {
      toast.error("Research the store first.");
      return false;
    }
    if (!nested) setBusy("cold");
    try {
      const result = await writeColdEmailFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "Could not draft the cold emails."));
        return false;
      }
      rememberProvider(result);
      s.setColdPaper(result.text, result.citations);
      startSequence(s.host, s.origin);
      if (!nested) {
        toast.success("21-day sequence ready. Send Email 1 today — ask them to reply send.");
        reveal("cold");
        reveal("timeline");
      }
      return true;
    } catch (err) {
      toast.error(actionError(err, "Could not draft the cold emails."));
      return false;
    } finally {
      if (!nested) setBusy("idle");
    }
  }

  async function writeAgreement() {
    if (!session.pages.length) {
      toast.error("Research the store first.");
      return;
    }
    setBusy("agreement");
    try {
      const result = await writeServiceAgreementFn({ data: improvedPayload() });
      if (!result.ok) {
        toast.error(actionError(result.error, "Could not draft the service agreement."));
        return;
      }
      rememberProvider(result);
      session.setAgreementPaper(result.text, result.citations);
      toast.success("Service agreement and service levels drafted for this store.");
      reveal("agreement");
    } catch (err) {
      toast.error(actionError(err, "Could not draft the service agreement."));
    } finally {
      setBusy("idle");
    }
  }

  async function runFullFlow() {
    if (isBatchRunning()) {
      toast.error("A batch is running. Wait for it to finish, or stop it on Batch.");
      return;
    }
    const target =
      session.urlInput.trim() || useAuditStore.getState().origin || "";
    if (target.length < 4) {
      toast.error("Paste a store address — for example dakshis.com");
      return;
    }
    setBusy("flow");
    setSequenceNotice(null);
    try {
      if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "default") {
        void Notification.requestPermission();
      }
    } catch {
      /* ignore */
    }
    try {
      const report = await runStoreSequence(target, {
        onProgress: (p) => {
          setFlowProgress({ current: p.step, total: p.total, title: p.title });
          if (p.rewrite) setRewriteProgress(p.rewrite);
          else setRewriteProgress(null);
        },
      });
      const pages = useAuditStore.getState().pages;
      setPageTab(pages[0]?.url ?? "");
      if (!report.pages) {
        toast.error("Full sequence stopped — no live pages were readable.");
        return;
      }
      reveal("pages");
      reveal("audit");
      reveal("rewrite");
      reveal("gaps");
      reveal("brief");
      reveal("facts");
      reveal("implement");
      reveal("selling");
      reveal("emails");
      reveal("cold");
      reveal("timeline");
      const notice = {
        host: report.host,
        finishedAt: Date.now(),
        rewriteOk: report.rewriteOk,
        rewriteTotal: report.rewriteTotal,
        failed: report.failed,
      };
      setSequenceNotice(notice);
      notifySequenceComplete(notice);
    } catch (err) {
      toast.error(actionError(err, "Full sequence stopped."));
    } finally {
      setBusy("idle");
      setFlowProgress(null);
      setRewriteProgress(null);
      setRewriteUrl("");
    }
  }

  async function saveWord(opts: {
    title: string;
    body: string;
    stem: string;
    subtitle?: string;
  }) {
    if (!opts.body.trim()) return;
    try {
      await downloadDraftDocx({
        title: opts.title,
        subtitle: opts.subtitle ?? session.host,
        host: session.host,
        body: opts.body,
        filename: `NyayaDraft-${session.host.replace(/[^\w.-]+/g, "-")}-${opts.stem}.docx`,
      });
      toast.success("Word file downloaded — you can edit it in Word or Google Docs.");
    } catch {
      toast.error("Could not build the Word file.");
    }
  }

  async function savePdf(opts: { title: string; body: string; stem: string }) {
    if (!opts.body.trim()) return;
    try {
      await downloadPaperPdf({
        host: session.host,
        title: opts.title,
        body: opts.body,
        filename: `NyayaDraft-${session.host.replace(/[^\w.-]+/g, "-")}-${opts.stem}.pdf`,
      });
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Could not build the PDF.");
    }
  }

  function masterPack() {
    const profile = [
      `Store: ${session.homeTitle || session.host}`,
      `Host: ${session.host}`,
      `URL: ${session.origin}`,
      session.hints?.legalName ? `Legal name: ${session.hints.legalName}` : "",
      session.hints?.gstins?.[0] ? `GSTIN: ${session.hints.gstins.join(", ")}` : "",
      session.hints?.emails?.length ? `Emails: ${session.hints.emails.join(", ")}` : "",
      session.hints?.phones?.length ? `Phones: ${session.hints.phones.join(", ")}` : "",
      `Pages read: ${session.pages.length}`,
      session.missing.length
        ? `Missing from crawl: ${session.missing.map((m) => m.label).join(", ")}`
        : "Required policy pages were all found.",
      "Sequence",
      "1. Research — live pages",
      "2. Indian-law audit",
      "3. Revised policies",
      "4. Gaps",
      "5. Client brief",
      "6. Legal facts",
      "7. Implementations",
      "8. Selling points",
      "9. Forwarding emails",
      "10. Cold outreach",
      "",
      "Pages",
      ...session.pages.map(
        (p) =>
          `- ${p.label} — ${p.title}${p.hidden ? " [hidden from homepage]" : ""}${p.added ? " [added]" : ""}\n  ${p.url} (${p.chars.toLocaleString("en-IN")} characters)`,
      ),
    ]
      .filter((line) => line !== "")
      .join("\n");

    const sections = [
      session.pages.length
        ? {
            title: "1. Research — live pages fetched",
            body: session.pages
              .map(
                (p) =>
                  `## ${p.label}\n${p.title}\n${p.url}\n(${p.chars.toLocaleString("en-IN")} characters)${p.hidden ? " · hidden from homepage" : ""}${p.added ? " · added by drafter" : ""}\n\n${p.text}`,
              )
              .join("\n\n"),
          }
        : null,
      session.findings ? { title: "2. Indian-law audit", body: session.findings } : null,
      ...session.refined.map((r, i) => {
        const parsed = parseDraftOutput(r.raw);
        const notes = parsed.notes ? `\n\n## Drafting notes\n${parsed.notes}` : "";
        const auth = parsed.authorities
          ? `\n\n## Authorities relied on\n${parsed.authorities}`
          : "";
        return {
          title: `3.${i + 1} Revised policy — ${r.title}`,
          body: `${parsed.draft}${notes}${auth}`,
        };
      }),
      session.gapsPaper ? { title: "4. Gap register", body: session.gapsPaper } : null,
      session.briefPaper
        ? {
            title: "5. Client needs brief",
            body: applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers),
          }
        : null,
      session.questionsPaper
        ? {
            title: "6. Legal facts questionnaire",
            body: applyQuestionnaireAnswers(session.questionsPaper, session.answers),
          }
        : null,
      session.implementPaper
        ? { title: "7. Implementation playbook", body: session.implementPaper }
        : null,
      session.sellingPaper ? { title: "8. Selling points", body: session.sellingPaper } : null,
      session.emailPaper ? { title: "9. Forwarding emails", body: session.emailPaper } : null,
      session.coldPaper ? { title: "10. Cold outreach to the store", body: session.coldPaper } : null,
      session.agreementPaper
        ? { title: "Service agreement and service levels", body: session.agreementPaper }
        : null,
      session.citations.length
        ? {
            title: "Authorities retrieved",
            body: session.citations
              .map(
                (c, i) =>
                  `### ${i + 1}. ${c.citation} — ${c.title}\n${c.statute}\n${c.text}`,
              )
              .join("\n\n"),
          }
        : null,
    ].filter((s): s is { title: string; body: string } => Boolean(s));

    return { profile, sections };
  }

  async function saveMaster(format: "pdf" | "docx") {
    if (!session.origin) {
      toast.error("Research a store first.");
      return;
    }
    setBusy(format === "pdf" ? "pdf" : "docx");
    try {
      const { profile, sections } = masterPack();
      if (format === "pdf") {
        await downloadMasterPdf({
          host: session.host,
          homeTitle: session.homeTitle || session.host,
          origin: session.origin,
          profile,
          sections,
        });
        toast.success("Master PDF downloaded — every paper from this store in one file.");
      } else {
        await downloadMasterDocx({
          host: session.host,
          homeTitle: session.homeTitle || session.host,
          profile,
          sections,
        });
        toast.success("Master Word downloaded — every paper from this store in one file.");
      }
    } catch {
      toast.error(format === "pdf" ? "Could not build the master PDF." : "Could not build the master Word file.");
    } finally {
      setBusy("idle");
    }
  }

  function revisedSections() {
    const used = new Set<string>();
    const ordered: typeof session.refined = [];
    for (const card of rewriteCards) {
      const item = session.refined.find((r) =>
        card.url ? r.url === card.url : r.kind === card.kind,
      );
      const key = item ? item.url || item.kind : "";
      if (item && !used.has(key)) {
        used.add(key);
        ordered.push(item);
      }
    }
    for (const item of session.refined) {
      const key = item.url || item.kind;
      if (!used.has(key)) {
        used.add(key);
        ordered.push(item);
      }
    }
    return ordered.map((r) => {
      const parsed = parseDraftOutput(r.raw);
      const notes = parsed.notes ? `\n\n## Drafting notes\n${parsed.notes}` : "";
      const auth = parsed.authorities
        ? `\n\n## Authorities relied on\n${parsed.authorities}`
        : "";
      return {
        title: r.title,
        body: `${parsed.draft}${notes}${auth}`,
      };
    });
  }

  async function saveRevised(format: "pdf" | "docx") {
    if (!session.refined.length) {
      toast.error("Rewrite at least one policy first.");
      return;
    }
    setBusy(format === "pdf" ? "pdf" : "docx");
    try {
      const sections = revisedSections();
      const profile = [
        `Store: ${session.homeTitle || session.host}`,
        `Host: ${session.host}`,
        `URL: ${session.origin}`,
        session.hints?.legalName ? `Legal name: ${session.hints.legalName}` : "",
        `Revised policies in this file: ${sections.length}`,
        "",
        "Contents",
        ...sections.map((s, i) => `${i + 1}. ${s.title}`),
      ]
        .filter((line) => line !== "")
        .join("\n");
      const stem = `NyayaDraft-${session.host.replace(/[^\w.-]+/g, "-")}-revised-policies`;
      if (format === "pdf") {
        await downloadMasterPdf({
          host: session.host,
          homeTitle: `${session.homeTitle || session.host} — revised policies`,
          origin: session.origin,
          profile,
          sections,
          kicker: "REVISED POLICIES",
          filename: `${stem}.pdf`,
        });
        toast.success("Revised policies PDF downloaded.");
      } else {
        await downloadMasterDocx({
          host: session.host,
          homeTitle: `${session.homeTitle || session.host} — revised policies`,
          title: `${session.homeTitle || session.host} — revised policies`,
          profile,
          sections,
          filename: `${stem}.docx`,
        });
        toast.success("Revised policies Word downloaded.");
      }
    } catch {
      toast.error(
        format === "pdf"
          ? "Could not build the revised-policies PDF."
          : "Could not build the revised-policies Word file.",
      );
    } finally {
      setBusy("idle");
    }
  }

  async function saveOriginal(format: "pdf" | "docx", pageUrl?: string) {
    if (!session.pages.length) {
      toast.error("Research a store first.");
      return;
    }
    const pages = pageUrl
      ? session.pages.filter((p) => p.url === pageUrl)
      : session.pages;
    if (!pages.length) {
      toast.error("No original policy text to export.");
      return;
    }
    setBusy(format === "pdf" ? "orig-pdf" : "docx");
    try {
      const stem = pageUrl ? (pages[0]?.kind ?? "policy") : "original-policies";
      const filename = `NyayaDraft-${session.host.replace(/[^\w.-]+/g, "-")}-${stem}`;
      if (format === "pdf") {
        await downloadOriginalPoliciesPdf({
          host: session.host,
          homeTitle: session.homeTitle || session.host,
          origin: session.origin,
          pages,
          filename: `${filename}.pdf`,
        });
      } else {
        const body = pages
          .map(
            (p) =>
              `## ${p.title || p.label}\n${p.url}\n\nAs crawled. Not a NyayaDraft rewrite.\n\n${p.text}`,
          )
          .join("\n\n");
        await downloadDraftDocx({
          title: `${session.homeTitle || session.host} — original policies`,
          subtitle: "As crawled. Not a rewrite.",
          host: session.host,
          body,
          filename: `${filename}.docx`,
        });
      }
      toast.success(
        pages.length === 1
          ? `Original ${pages[0].label} downloaded as ${format === "pdf" ? "PDF" : "Word"}.`
          : `Original policies downloaded — ${pages.length} pages as crawled.`,
      );
    } catch {
      toast.error("Could not build the original-policies file.");
    } finally {
      setBusy("idle");
    }
  }

  function saveFindings() {
    if (!session.findings) return;
    saveHistory({
      id: `store-audit::${session.host}`,
      slug: "store-audit",
      title: `Store audit — ${session.host}`,
      createdAt: Date.now(),
      facts: { website: session.origin, host: session.host },
      draftText: session.findings,
      notes: session.missing.map((m) => m.label).join(", "),
      citations: session.citations,
    });
    toast.success("Audit saved on this device.");
  }

  function saveRefined(url: string, kind: PolicyKind) {
    const item = session.refined.find((r) =>
      url ? r.url === url : r.kind === kind,
    );
    if (!item) return;
    const parsed = parseDraftOutput(item.raw);
    saveHistory({
      id: `${item.slug}::${session.host}::${item.url || item.kind}`,
      slug: item.slug,
      title: `${item.title} — ${session.host}`,
      createdAt: Date.now(),
      facts: {
        website: session.origin,
        host: session.host,
        url: item.url,
        kind: item.kind,
        pageTitle: item.title,
      },
      draftText: parsed.draft,
      notes: parsed.notes,
      citations: session.citations,
    });
    toast.success("Revised policy saved on this device.");
  }

  function savePaper(
    slug: "store-gaps" | "store-selling" | "store-questions" | "store-brief" | "store-implement" | "store-email" | "store-cold" | "store-agreement",
    title: string,
    body: string,
  ) {
    if (!body) return;
    saveHistory({
      id: `${slug}::${session.host}`,
      slug,
      title: `${title} — ${session.host}`,
      createdAt: Date.now(),
      facts: { website: session.origin, host: session.host },
      draftText: body,
      notes: "",
      citations: session.citations,
    });
    toast.success("Saved on this device. Open it from History.");
  }

  function saveAllWork(quiet = false) {
    const n = saveSessionPapers();
    if (!quiet) {
      const host = useAuditStore.getState().host;
      toast.success(
        n
          ? `Saved ${n} paper${n === 1 ? "" : "s"} for ${host}. Open History.`
          : "Nothing to save yet — run the sequence first.",
      );
    }
    return n;
  }

  const activePage =
    session.pages.find((p) => p.url === pageTab) ?? session.pages[0];
  const activeRefined = session.refined.find(
    (r) => (r.url || r.kind) === refineTab,
  );
  const parsedRefined = useMemo(
    () => (activeRefined ? parseDraftOutput(activeRefined.raw) : null),
    [activeRefined],
  );
  const questions = useMemo(
    () => parseStoreQuestions(session.questionsPaper),
    [session.questionsPaper],
  );
  const briefQuestions = useMemo(
    () => parseStoreQuestions(session.briefPaper),
    [session.briefPaper],
  );
  const emails = useMemo(
    () => parseForwardEmails(session.emailPaper),
    [session.emailPaper],
  );
  const coldEmails = useMemo(
    () => parseForwardEmails(session.coldPaper),
    [session.coldPaper],
  );
  const sampleClause = useMemo(
    () => sampleClauseText(session.coldPaper),
    [session.coldPaper],
  );
  const callScript = useMemo(
    () => callScriptText(session.coldPaper),
    [session.coldPaper],
  );
  const rewriteCards = useMemo(() => {
    const live = session.pages.map((p) => ({ ...p, missing: false }));
    const missing = session.missing
      .filter((m) => !session.pages.some((p) => p.kind === m.kind))
      .map((m) => ({
        kind: m.kind,
        label: m.label,
        url: "",
        title: m.label,
        text: "",
        chars: 0,
        status: 0,
        hidden: false,
        added: false,
        missing: true,
      }));
    return [...live, ...missing];
  }, [session.pages, session.missing]);
  const briefEmails = useMemo(
    () => parseForwardEmails(session.briefPaper),
    [session.briefPaper],
  );
  const answeredCount = questions.filter((q) => session.answers[q.id]?.trim()).length;
  const briefAnswered = briefQuestions.filter((q) => session.briefAnswers[q.id]?.trim()).length;

  return (
    <AppShell>
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-[12px] tracking-[0.2em] text-muted uppercase">
              Live store · retrieve · rewrite
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Audit a store’s policies
            </h1>
            <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted">
              One button runs the full sequence: research the live pages, audit
              them against Indian law, rewrite every policy, score remaining
              gaps, then the client brief, legal facts, implementations, selling
              points, forwarding emails and cold outreach. Save all writes every
              paper to History. The master Word/PDF follows the same order.
            </p>
            <form
              className="mt-6 flex flex-col gap-3 sm:flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                void research();
              }}
            >
              <div className="relative min-w-0 flex-1">
                <Globe className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
                <Input
                  value={session.urlInput}
                  onChange={(e) => session.setUrlInput(e.target.value)}
                  placeholder="dakshis.com"
                  className="pl-10"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
              <Button type="submit" disabled={working} className="sm:w-44">
                {busy === "research" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <ScanSearch className="size-4" />
                )}
                Research site
              </Button>
              <Button
                type="button"
                disabled={working}
                onClick={() => void runFullFlow()}
                className="sm:w-52"
              >
                {busy === "flow" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Play className="size-4" />
                )}
                {busy === "flow" && flowProgress
                  ? `${flowProgress.current}/10 ${flowProgress.title}`
                  : "Run full sequence"}
              </Button>
            </form>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[12px] text-muted">Try</span>
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  className="rounded-full bg-surface-2 px-3 py-1 text-[12px] text-muted hover:text-ink"
                  onClick={() => {
                    session.setUrlInput(ex);
                    void research(ex);
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </section>

        {!session.origin ? (
          <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <p className="font-display text-xl text-muted">
              No store loaded yet. Paste a URL and tap Run full sequence, or
              Research site to go step by step.
            </p>
          </section>
        ) : (
          <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge variant="muted">{session.host}</Badge>
                <h2 className="mt-2 font-display text-2xl font-medium tracking-tight">
                  {session.homeTitle || session.host}
                </h2>
                <p className="mt-1 text-sm text-muted">
                  {session.pages.length} page{session.pages.length === 1 ? "" : "s"} read
                  {session.missing.length
                    ? ` · missing ${session.missing.map((m) => m.label).join(", ")}`
                    : ""}
                </p>
                {session.hints ? (
                  <p className="mt-2 max-w-2xl text-[13px] text-muted">
                    {session.hints.legalName ? `${session.hints.legalName}. ` : ""}
                    {session.hints.gstins?.[0] ? `GSTIN ${session.hints.gstins[0]}. ` : ""}
                    {session.hints.emails?.[0] ?? ""}
                    {session.hints.phones?.[0] ? ` · ${session.hints.phones[0]}` : ""}
                  </p>
                ) : null}
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={() => void runFullFlow()}
                  disabled={working}
                >
                  {busy === "flow" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Play className="size-4" />
                  )}
                  {busy === "flow" && flowProgress
                    ? `${flowProgress.current}/10 ${flowProgress.title}`
                    : "Run full sequence"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveAllWork()}
                  disabled={working || !session.origin}
                >
                  <Bookmark className="size-4" />
                  Save all
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveMaster("docx")}
                  disabled={working}
                >
                  {busy === "docx" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Master Word
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveMaster("pdf")}
                  disabled={working}
                >
                  {busy === "pdf" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileDown className="size-4" />
                  )}
                  Master PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveOriginal("docx")}
                  disabled={working || !session.pages.length}
                >
                  {busy === "docx" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Original policies Word
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveOriginal("pdf")}
                  disabled={working || !session.pages.length}
                >
                  {busy === "orig-pdf" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileDown className="size-4" />
                  )}
                  Original policies PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setOpen({})}
                  disabled={working}
                >
                  Collapse all
                </Button>
                <Button onClick={() => void audit()} disabled={working || !session.pages.length}>
                  {busy === "audit" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Wand2 className="size-4" />
                  )}
                  Audit against Indian law
                </Button>
                <Button
                  onClick={() => void refineAll()}
                  disabled={working || !session.findings || !rewriteCards.length}
                >
                  {busy === "rewrite-all" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Wand2 className="size-4" />
                  )}
                  {busy === "rewrite-all" && rewriteProgress
                    ? `Rewriting ${rewriteProgress.current}/${rewriteProgress.total}`
                    : `Rewrite all policies${rewriteCards.length ? ` (${rewriteCards.length})` : ""}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveRevised("docx")}
                  disabled={working || !session.refined.length}
                >
                  {busy === "docx" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Download className="size-4" />
                  )}
                  Revised policies Word
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void saveRevised("pdf")}
                  disabled={working || !session.refined.length}
                >
                  {busy === "pdf" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <FileDown className="size-4" />
                  )}
                  Revised policies PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void findGaps()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "gaps" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ListChecks className="size-4" />
                  )}
                  Find remaining gaps
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeBrief()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "brief" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Handshake className="size-4" />
                  )}
                  Client brief
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeQuestions()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "questions" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ClipboardPen className="size-4" />
                  )}
                  Legal facts
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeImplement()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "implement" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Wrench className="size-4" />
                  )}
                  Better implementations
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeSelling()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "selling" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Megaphone className="size-4" />
                  )}
                  Write selling points
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeEmail()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "email" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Mail className="size-4" />
                  )}
                  Forwarding emails
                </Button>
                <Button
                  variant="outline"
                  onClick={() => void writeCold()}
                  disabled={working || !session.pages.length}
                >
                  {busy === "cold" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  Cold email
                </Button>
                <Button
                  variant="outline"
                  onClick={() => saveAllWork()}
                  disabled={working || !session.origin}
                >
                  <Bookmark className="size-4" />
                  Save all
                </Button>
              </div>
            </div>

            {busy === "flow" && flowProgress ? (
              <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2 px-4 py-3 text-sm">
                <p className="font-medium">
                  Step {flowProgress.current} of {flowProgress.total} — {flowProgress.title}
                </p>
                {rewriteProgress ? (
                  <p className="mt-1 text-muted">
                    Rewriting {rewriteProgress.current}/{rewriteProgress.total}: {rewriteProgress.title}
                  </p>
                ) : (
                  <p className="mt-1 text-muted">
                    Stay on this page. Each step uses the output of the one before.
                  </p>
                )}
              </div>
            ) : null}

            {sequenceNotice ? (
              <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                      {sequenceNotice.failed.length
                        ? "Sequence finished with gaps"
                        : "Sequence complete"}
                    </p>
                    <p className="mt-1 font-display text-lg font-medium">
                      {sequenceNotice.host}
                    </p>
                    <p className="mt-1 text-sm text-muted">
                      {new Date(sequenceNotice.finishedAt).toLocaleString("en-IN")}
                      {sequenceNotice.rewriteTotal
                        ? ` · ${sequenceNotice.rewriteOk} of ${sequenceNotice.rewriteTotal} policies rewritten`
                        : ""}
                      {sequenceNotice.failed.length
                        ? ` · still open: ${sequenceNotice.failed.join(", ")}`
                        : " · all ten steps saved"}
                    </p>
                  </div>
                  <Button variant="outline" onClick={() => setSequenceNotice(null)}>
                    Dismiss
                  </Button>
                </div>
              </div>
            ) : null}

            {session.pages.length ? (
              <Fold
                title="Live pages"
                hint={`${session.pages.length} page${session.pages.length === 1 ? "" : "s"} as crawled · ${session.pages.filter((p) => p.hidden).length} hidden from homepage`}
                open={isOpen("pages")}
                onToggle={() => toggleFold("pages")}
              >
              <form
                className="mb-4 flex flex-col gap-3 rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-border)] sm:flex-row sm:items-end"
                onSubmit={(e) => {
                  e.preventDefault();
                  void addLivePage();
                }}
              >
                <div className="min-w-0 flex-1">
                  <Label htmlFor="extra-policy">Add a live policy URL</Label>
                  <Input
                    id="extra-policy"
                    value={extraUrl}
                    onChange={(e) => setExtraUrl(e.target.value)}
                    placeholder="/pages/return-policy or full URL"
                    className="mt-1"
                    autoCapitalize="none"
                    autoCorrect="off"
                    spellCheck={false}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Label>Kind</Label>
                  <Select
                    value={extraKind}
                    onValueChange={(v) => setExtraKind(v as "auto" | PolicyKind)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Auto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="auto">Auto from URL</SelectItem>
                      {POLICY_KINDS.map((k) => (
                        <SelectItem key={k} value={k}>
                          {POLICY_LABELS[k]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  variant={extraHidden ? "default" : "outline"}
                  onClick={() => setExtraHidden((v) => !v)}
                  className="sm:w-44"
                >
                  {extraHidden ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                  {extraHidden ? "Hidden from home" : "Linked on home"}
                </Button>
                <Button type="submit" disabled={working} className="sm:w-40">
                  {busy === "fetch-page" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  Fetch page
                </Button>
              </form>
              <p className="mb-3 text-[13px] text-muted">
                Added URLs are live pages, not hidden. Mark Hidden only when
                the page exists but is not linked from the homepage — the audit
                treats that as an E-Commerce Rules access gap.
              </p>
              <Tabs
                value={pageTab || session.pages[0].url}
                onValueChange={setPageTab}
                className="mt-0"
              >
                <TabsList className="h-auto w-full flex-wrap justify-start gap-1">
                  {session.pages.map((p) => (
                    <TabsTrigger key={p.url} value={p.url} className="gap-1">
                      {p.hidden ? <EyeOff className="size-3" /> : null}
                      {p.title && p.title.length <= 40 ? p.title : (POLICY_LABELS[p.kind] ?? p.label)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {session.pages.map((p) => (
                  <TabsContent key={p.url} value={p.url}>
                    <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <h3 className="font-display text-lg font-medium">{p.title}</h3>
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[12px] break-all text-primary hover:underline"
                          >
                            {p.url}
                          </a>
                          {p.added ? (
                            <p className="mt-1 text-[12px] text-muted">Added by you.</p>
                          ) : null}
                        </div>
                        <Badge variant="outline">{p.chars.toLocaleString("en-IN")} chars</Badge>
                        <Button
                          variant={p.hidden ? "default" : "outline"}
                          size="sm"
                          onClick={() => session.togglePageHidden(p.url)}
                        >
                          {p.hidden ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                          {p.hidden ? "Hidden from homepage" : "On homepage"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void saveOriginal("docx", p.url)}
                          disabled={working}
                        >
                          <Download className="size-4" />
                          Word
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => void saveOriginal("pdf", p.url)}
                          disabled={working}
                        >
                          {busy === "orig-pdf" ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <FileDown className="size-4" />
                          )}
                          PDF
                        </Button>
                      </div>
                      <ScrollArea className="mt-4 max-h-72">
                        <pre className="font-serif text-[14px] leading-relaxed whitespace-pre-wrap text-ink">
                          {p.text}
                        </pre>
                      </ScrollArea>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
              </Fold>
            ) : null}

            {session.pages.length ? (
              <>
              <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <ActionCard
                  title="Find remaining gaps"
                  ready={Boolean(session.gapsPaper)}
                  readyLabel="Ready"
                  idleLabel="After rewrites"
                  body="Scores live pages against any rewrite in this session. Severity, the Indian-law hook, and a paste-ready sentence for each hole — including banner-versus-policy contradictions."
                  busy={busy === "gaps"}
                  working={working}
                  icon={<ListChecks className="size-4" />}
                  cta={session.gapsPaper ? "Re-score gaps" : "Find remaining gaps"}
                  onClick={() => void findGaps()}
                />
                <ActionCard
                  title="Client brief"
                  ready={Boolean(session.briefPaper)}
                  readyLabel={briefAnswered ? `${briefAnswered} answered` : "Ready"}
                  idleLabel="Send to the merchant"
                  body="What this client wants the work to achieve — deliverables, promises they will honour, claims they will kill, support model, what “done” looks like. Email it as Word, or fill it on the call."
                  busy={busy === "brief"}
                  working={working}
                  icon={<Handshake className="size-4" />}
                  cta={session.briefPaper ? "Refresh client brief" : "Build client brief"}
                  onClick={() => void writeBrief()}
                />
                <ActionCard
                  title="Legal facts"
                  ready={Boolean(session.questionsPaper)}
                  readyLabel={answeredCount ? `${answeredCount} answered` : "Ready"}
                  idleLabel="Officer, GST, unboxing"
                  body="The blanks a policy cannot invent — named grievance officer, who reads support@, unboxing as evidence, COD fee. Use after the client brief."
                  busy={busy === "questions"}
                  working={working}
                  icon={<ClipboardPen className="size-4" />}
                  cta={session.questionsPaper ? "Refresh legal facts" : "Build legal facts"}
                  onClick={() => void writeQuestions()}
                />
                <ActionCard
                  title="Better implementations"
                  ready={Boolean(session.implementPaper)}
                  readyLabel="Ready"
                  idleLabel="Shopify playbook"
                  body="Where to put the text: Settings → Policies, footer imprint, PDP Legal Metrology, DPDP notice at collection, checkout lines that match the refund page."
                  busy={busy === "implement"}
                  working={working}
                  icon={<Wrench className="size-4" />}
                  cta={session.implementPaper ? "Refresh playbook" : "Suggest implementations"}
                  onClick={() => void writeImplement()}
                />
                <ActionCard
                  title="Write selling points"
                  ready={Boolean(session.sellingPaper)}
                  readyLabel="Ready"
                  idleLabel="From improved text"
                  body="Checkout, PDP and ad lines that match a clause they have — plus pitch lines for you: how this rewrite helps THEIR conversion, margin and COD/RTO."
                  busy={busy === "selling"}
                  working={working}
                  icon={<Megaphone className="size-4" />}
                  cta={session.sellingPaper ? "Rewrite selling points" : "Write selling points"}
                  onClick={() => void writeSelling()}
                />
                <ActionCard
                  title="Forwarding emails"
                  ready={Boolean(session.emailPaper)}
                  readyLabel="Ready"
                  idleLabel="Copy and send"
                  body="Three letters in your name: one to the developer, one to your advocate, one customer notice to send only after the new pages are live."
                  busy={busy === "email"}
                  working={working}
                  icon={<Mail className="size-4" />}
                  cta={session.emailPaper ? "Rewrite emails" : "Write forwarding emails"}
                  onClick={() => void writeEmail()}
                />
                <ActionCard
                  title="Cold email the store"
                  ready={Boolean(session.coldPaper)}
                  readyLabel="Ready"
                  idleLabel="From you to them"
                  body="Day-0 email asks them to reply send for a one-page SAMPLE rewrite. Then a 21-day sequence. Layman gaps, not statute names."
                  busy={busy === "cold"}
                  working={working}
                  icon={<Send className="size-4" />}
                  cta={session.coldPaper ? "Rewrite cold emails" : "Draft cold emails"}
                  onClick={() => void writeCold()}
                />
              </div>
              </>
            ) : null}

            {session.pages.length ? (
              <Fold
                title="Onboard timeline"
                hint="21-day sequence, then Clock B after they reply"
                open={isOpen("timeline")}
                onToggle={() => toggleFold("timeline")}
              >
                <PipelineBoard host={session.host} origin={session.origin} />
              </Fold>
            ) : null}

            {briefQuestions.length ? (
              <Fold
                title="Client brief"
                hint={`${briefAnswered}/${briefQuestions.length} answered`}
                open={isOpen("brief")}
                onToggle={() => toggleFold("brief")}
              >
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                      Client needs · {session.host}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">
                      Client brief
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted">
                      Send this to the merchant, or fill it while you are on the
                      call. HIGH answers drive the rewrites, selling points and
                      the developer email — not a generic D2C checklist.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="muted">
                      {briefAnswered}/{briefQuestions.length} answered
                    </Badge>
                    {briefEmails[0] ? (
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={mailtoHref(
                            briefEmails[0].to,
                            briefEmails[0].subject,
                            briefEmails[0].body,
                          )}
                        >
                          <Mail className="size-4" />
                          Email brief to client
                        </a>
                      </Button>
                    ) : null}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void saveWord({
                          title: `Client needs brief — ${session.host}`,
                          subtitle: "For the merchant to complete",
                          body: applyQuestionnaireAnswers(
                            session.briefPaper,
                            session.briefAnswers,
                          ),
                          stem: "client-brief",
                        })
                      }
                    >
                      <Download className="size-4" />
                      Word
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        void savePdf({
                          title: `Client needs brief — ${session.host}`,
                          body: applyQuestionnaireAnswers(
                            session.briefPaper,
                            session.briefAnswers,
                          ),
                          stem: "client-brief",
                        })
                      }
                    >
                      <FileDown className="size-4" />
                      PDF
                    </Button>
                  </div>
                </div>
                <ol className="mt-6 grid gap-5">
                  {briefQuestions.map((q) => (
                    <li
                      key={q.id}
                      className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] text-muted">{q.id}</span>
                        <Badge variant={q.severity === "HIGH" ? "default" : "muted"}>
                          {q.severity}
                        </Badge>
                        <h3 className="font-display text-lg font-medium">{q.title}</h3>
                      </div>
                      {q.why ? (
                        <p className="mt-1 text-[13px] leading-relaxed text-muted">{q.why}</p>
                      ) : null}
                      <Label htmlFor={`c-${q.id}`} className="sr-only">
                        {q.title}
                      </Label>
                      <Textarea
                        id={`c-${q.id}`}
                        className="mt-3"
                        value={session.briefAnswers[q.id] ?? ""}
                        onChange={(e) => session.setBriefAnswer(q.id, e.target.value)}
                        placeholder={
                          q.hint || "What does this client want — in their words."
                        }
                      />
                    </li>
                  ))}
                </ol>
              </div>
              </Fold>
            ) : null}

            {questions.length ? (
              <Fold
                title="Legal facts"
                hint={`${answeredCount}/${questions.length} answered`}
                open={isOpen("facts")}
                onToggle={() => toggleFold("facts")}
              >
              <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                      Legal facts · {session.host}
                    </p>
                    <h2 className="mt-1 font-display text-2xl font-medium tracking-tight">
                      Legal facts
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm text-muted">
                      Blanks a policy cannot invent. Fill after the client brief.
                    </p>
                  </div>
                  <Badge variant="muted">
                    {answeredCount}/{questions.length} answered
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void saveWord({
                        title: `Legal facts — ${session.host}`,
                        subtitle: "Blanks a policy cannot invent",
                        body: applyQuestionnaireAnswers(
                          session.questionsPaper,
                          session.answers,
                        ),
                        stem: "legal-facts",
                      })
                    }
                  >
                    <Download className="size-4" />
                    Word
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      void savePdf({
                        title: `Legal facts — ${session.host}`,
                        body: applyQuestionnaireAnswers(
                          session.questionsPaper,
                          session.answers,
                        ),
                        stem: "legal-facts",
                      })
                    }
                  >
                    <FileDown className="size-4" />
                    PDF
                  </Button>
                </div>
                <ol className="mt-6 grid gap-5">
                  {questions.map((q) => (
                    <li
                      key={q.id}
                      className="border-t border-border pt-4 first:border-t-0 first:pt-0"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[12px] text-muted">{q.id}</span>
                        <Badge variant={q.severity === "HIGH" ? "default" : "muted"}>
                          {q.severity}
                        </Badge>
                        <h3 className="font-display text-lg font-medium">{q.title}</h3>
                      </div>
                      {q.why ? (
                        <p className="mt-1 text-[13px] leading-relaxed text-muted">{q.why}</p>
                      ) : null}
                      <Label htmlFor={`q-${q.id}`} className="sr-only">
                        {q.title}
                      </Label>
                      <Textarea
                        id={`q-${q.id}`}
                        className="mt-3"
                        value={session.answers[q.id] ?? ""}
                        onChange={(e) => session.setAnswer(q.id, e.target.value)}
                        placeholder={q.hint || "Type the answer this store can stand behind."}
                      />
                    </li>
                  ))}
                </ol>
              </div>
              </Fold>
            ) : null}

            {session.findings ? (
              <Fold
                title="Indian-law audit"
                hint="Gaps against CPA, DPDP and the E-Commerce Rules"
                open={isOpen("audit")}
                onToggle={() => toggleFold("audit")}
              >
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
                <DraftPaper title={`Audit — ${session.host}`} body={session.findings} />
                <div className="flex flex-col gap-4">
                  <CitationPanel
                    citations={session.citations as Citation[]}
                    title="Authorities retrieved"
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      void saveWord({
                        title: `Store policy audit — ${session.host}`,
                        subtitle: "Indian-law gap analysis",
                        body: session.findings,
                        stem: "audit",
                      })
                    }
                  >
                    <Download className="size-4" />
                    Word
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      void savePdf({
                        title: `Store policy audit — ${session.host}`,
                        body: session.findings,
                        stem: "audit",
                      })
                    }
                  >
                    <FileDown className="size-4" />
                    PDF
                  </Button>
                </div>
              </div>
              </Fold>
            ) : null}

            {session.findings ? (
              <Fold
                title="Rewrite a policy"
                hint={
                  session.refined.length
                    ? `${session.refined.length} of ${rewriteCards.length} revised`
                    : `${rewriteCards.length} pages from this store`
                }
                open={isOpen("rewrite")}
                onToggle={() => toggleFold("rewrite")}
              >
              <div>
                <p className="max-w-2xl text-sm text-muted">
                  One rewrite card per live page this store actually publishes.
                  Return stays return, refund stays refund, contact stays contact.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={() => void refineAll()}
                    disabled={working || !session.findings}
                  >
                    {busy === "rewrite-all" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Wand2 className="size-4" />
                    )}
                    {busy === "rewrite-all" && rewriteProgress
                      ? `Rewriting ${rewriteProgress.current} of ${rewriteProgress.total} — ${rewriteProgress.title}`
                      : `Rewrite all ${rewriteCards.length} pages`}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void saveRevised("docx")}
                    disabled={working || !session.refined.length}
                  >
                    <Download className="size-4" />
                    All revised Word
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => void saveRevised("pdf")}
                    disabled={working || !session.refined.length}
                  >
                    <FileDown className="size-4" />
                    All revised PDF
                  </Button>
                  {busy === "rewrite-all" && rewriteProgress ? (
                    <p className="text-[13px] text-muted">
                      Stays on this page. Do not refresh.
                    </p>
                  ) : null}
                </div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {rewriteCards.map((item) => {
                    const key = item.url || item.kind;
                    const have = session.refined.some((r) =>
                      item.url ? r.url === item.url : r.kind === item.kind && !r.url,
                    );
                    const spinning =
                      rewriteUrl === item.url &&
                      (busy === item.kind || busy === "rewrite-all");
                    return (
                      <div
                        key={key}
                        className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-border)]"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-lg font-medium">
                            {item.title || POLICY_LABELS[item.kind]}
                          </h3>
                          <Badge variant={have ? "default" : "muted"}>
                            {have
                              ? "Drafted"
                              : item.missing
                                ? "Missing"
                                : item.hidden
                                  ? "Hidden live"
                                  : "Live page"}
                          </Badge>
                        </div>
                        <p className="mt-1 flex-1 text-[13px] text-muted">
                          {KIND_HINTS[item.kind]}
                        </p>
                        <Button
                          className="mt-4"
                          variant={have ? "outline" : "default"}
                          disabled={working}
                          onClick={() => void refine(item)}
                        >
                          {spinning ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Wand2 className="size-4" />
                          )}
                          {have
                            ? "Redraft"
                            : item.missing
                              ? "Draft from profile"
                              : "Revise this page"}
                        </Button>
                      </div>
                    );
                  })}
                </div>

                {session.refined.length ? (
                  <Tabs
                    value={refineTab || session.refined[0]?.url || session.refined[0]?.kind}
                    onValueChange={setRefineTab}
                    className="mt-8"
                  >
                    <TabsList className="h-auto flex-wrap justify-start gap-1">
                      {session.refined.map((r) => (
                        <TabsTrigger key={r.url || r.kind} value={r.url || r.kind}>
                          {r.title}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    {session.refined.map((r) => (
                      <TabsContent key={r.url || r.kind} value={r.url || r.kind}>
                        {parsedRefined &&
                        (r.url || r.kind) ===
                          (refineTab || session.refined[0]?.url || session.refined[0]?.kind) ? (
                          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                            <DraftPaper title={r.title} body={parsedRefined.draft} />
                            <div className="flex flex-col gap-2 xl:w-52">
                              <Button
                                variant="outline"
                                onClick={() => {
                                  void navigator.clipboard.writeText(parsedRefined.draft);
                                  toast.success("Copied.");
                                }}
                              >
                                <Copy className="size-4" />
                                Copy
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  void saveWord({
                                    title: r.title,
                                    subtitle: `${session.host} — customer-facing policy`,
                                    body: parsedRefined.draft,
                                    stem: r.kind,
                                  })
                                }
                              >
                                <Download className="size-4" />
                                Word
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  void savePdf({
                                    title: r.title,
                                    body: parsedRefined.draft,
                                    stem: r.kind,
                                  })
                                }
                              >
                                <FileDown className="size-4" />
                                PDF
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => saveRefined(r.url, r.kind)}
                              >
                                <Bookmark className="size-4" />
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : null}
                      </TabsContent>
                    ))}
                  </Tabs>
                ) : null}
              </div>
              </Fold>
            ) : null}

            {session.gapsPaper ? (
              <Fold
                title="Gap register"
                hint="Remaining holes after live pages and rewrites"
                open={isOpen("gaps")}
                onToggle={() => toggleFold("gaps")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper title={`Gap register — ${session.host}`} body={session.gapsPaper} />
                <PaperTools
                  title={`Gap register — ${session.host}`}
                  body={session.gapsPaper}
                  stem="gaps"
                  host={session.host}
                  onWord={() =>
                    void saveWord({
                      title: `Gap register — ${session.host}`,
                      subtitle: "Remaining holes after live pages and rewrites",
                      body: session.gapsPaper,
                      stem: "gaps",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Gap register — ${session.host}`,
                      body: session.gapsPaper,
                      stem: "gaps",
                    })
                  }
                  onSave={() =>
                    savePaper("store-gaps", "Gap register", session.gapsPaper)
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.sellingPaper ? (
              <Fold
                title="Selling points"
                hint="Store copy + your pitch to this founder"
                open={isOpen("selling")}
                onToggle={() => toggleFold("selling")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper title={`Selling points — ${session.host}`} body={session.sellingPaper} />
                <PaperTools
                  title={`Selling points — ${session.host}`}
                  body={session.sellingPaper}
                  stem="selling-points"
                  host={session.host}
                  onWord={() =>
                    void saveWord({
                      title: `Selling points — ${session.host}`,
                      subtitle: "Store copy and your pitch — conversion, margin, COD",
                      body: session.sellingPaper,
                      stem: "selling-points",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Selling points — ${session.host}`,
                      body: session.sellingPaper,
                      stem: "selling-points",
                    })
                  }
                  onSave={() =>
                    savePaper("store-selling", "Selling points", session.sellingPaper)
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.briefPaper ? (
              <Fold
                title="Client brief paper"
                hint="Full brief for Word or the merchant"
                open={isOpen("brief")}
                onToggle={() => toggleFold("brief")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper
                  title={`Client brief — ${session.host}`}
                  body={applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers)}
                />
                <PaperTools
                  title={`Client needs brief — ${session.host}`}
                  body={applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers)}
                  stem="client-brief"
                  host={session.host}
                  onWord={() =>
                    void saveWord({
                      title: `Client needs brief — ${session.host}`,
                      subtitle: "What this merchant wants the work to achieve",
                      body: applyQuestionnaireAnswers(
                        session.briefPaper,
                        session.briefAnswers,
                      ),
                      stem: "client-brief",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Client needs brief — ${session.host}`,
                      body: applyQuestionnaireAnswers(
                        session.briefPaper,
                        session.briefAnswers,
                      ),
                      stem: "client-brief",
                    })
                  }
                  onSave={() =>
                    savePaper(
                      "store-brief",
                      "Client brief",
                      applyQuestionnaireAnswers(session.briefPaper, session.briefAnswers),
                    )
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.questionsPaper ? (
              <Fold
                title="Legal facts paper"
                hint="Blanks a policy cannot invent"
                open={isOpen("facts")}
                onToggle={() => toggleFold("facts")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper
                  title={`Legal facts — ${session.host}`}
                  body={applyQuestionnaireAnswers(session.questionsPaper, session.answers)}
                />
                <PaperTools
                  title={`Legal facts — ${session.host}`}
                  body={applyQuestionnaireAnswers(session.questionsPaper, session.answers)}
                  stem="legal-facts"
                  host={session.host}
                  onWord={() =>
                    void saveWord({
                      title: `Legal facts — ${session.host}`,
                      subtitle: "Blanks a policy cannot invent",
                      body: applyQuestionnaireAnswers(
                        session.questionsPaper,
                        session.answers,
                      ),
                      stem: "legal-facts",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Legal facts — ${session.host}`,
                      body: applyQuestionnaireAnswers(
                        session.questionsPaper,
                        session.answers,
                      ),
                      stem: "legal-facts",
                    })
                  }
                  onSave={() =>
                    savePaper(
                      "store-questions",
                      "Legal facts",
                      applyQuestionnaireAnswers(session.questionsPaper, session.answers),
                    )
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.implementPaper ? (
              <Fold
                title="Implementations"
                hint="Where the improved text goes on the live site"
                open={isOpen("implement")}
                onToggle={() => toggleFold("implement")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper
                  title={`Implementations — ${session.host}`}
                  body={session.implementPaper}
                />
                <PaperTools
                  title={`Implementation playbook — ${session.host}`}
                  body={session.implementPaper}
                  stem="implementations"
                  host={session.host}
                  onWord={() =>
                    void saveWord({
                      title: `Implementation playbook — ${session.host}`,
                      subtitle: "Where the improved text goes on the live site",
                      body: session.implementPaper,
                      stem: "implementations",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Implementation playbook — ${session.host}`,
                      body: session.implementPaper,
                      stem: "implementations",
                    })
                  }
                  onSave={() =>
                    savePaper("store-implement", "Implementations", session.implementPaper)
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.emailPaper ? (
              <Fold
                title="Forwarding emails"
                hint="Developer, advocate, customer notice"
                open={isOpen("emails")}
                onToggle={() => toggleFold("emails")}
              >
              <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                <DraftPaper title={`Forwarding emails — ${session.host}`} body={session.emailPaper} />
                <div className="flex flex-col gap-2 xl:w-52">
                  {emails.slice(0, 3).map((em) => (
                    <Button key={em.heading} variant="outline" asChild>
                      <a href={mailtoHref(em.to, em.subject, em.body)}>
                        <Mail className="size-4" />
                        {/developer/i.test(em.heading)
                          ? "Open developer mail"
                          : /advocate|ca/i.test(em.heading)
                            ? "Open advocate mail"
                            : "Open customer notice"}
                      </a>
                    </Button>
                  ))}
                  <PaperTools
                    title={`Forwarding emails — ${session.host}`}
                    body={session.emailPaper}
                    stem="emails"
                    host={session.host}
                    stacked={false}
                    onWord={() =>
                      void saveWord({
                        title: `Forwarding emails — ${session.host}`,
                        subtitle: "Copy into Gmail, Outlook or WhatsApp",
                        body: session.emailPaper,
                        stem: "emails",
                      })
                    }
                    onPdf={() =>
                      void savePdf({
                        title: `Forwarding emails — ${session.host}`,
                        body: session.emailPaper,
                        stem: "emails",
                      })
                    }
                    onSave={() =>
                      savePaper("store-email", "Forwarding emails", session.emailPaper)
                    }
                  />
                </div>
              </div>
              </Fold>
            ) : null}

            {session.coldPaper ? (
              <Fold
                title="Cold email"
                hint="Day 0 → day 21 · sample first"
                open={isOpen("cold")}
                onToggle={() => toggleFold("cold")}
              >
              <div className="grid gap-4">
                {sampleClause ? (
                  <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
                    <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                      Gift · send only after they reply send
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium">
                      Sample clause — not for publication
                    </h3>
                    <pre className="mt-3 font-serif text-[14px] leading-relaxed whitespace-pre-wrap">
                      {sampleClause}
                    </pre>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          void navigator.clipboard.writeText(sampleClause);
                          toast.success("Sample copied.");
                        }}
                      >
                        <Copy className="size-4" />
                        Copy sample
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() =>
                          void saveWord({
                            title: `SAMPLE — ${session.host}`,
                            subtitle: "Not for publication",
                            body: sampleClause,
                            stem: "sample-clause",
                          })
                        }
                      >
                        <Download className="size-4" />
                        Sample Word
                      </Button>
                    </div>
                  </div>
                ) : null}
                {callScript ? (
                  <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5">
                    <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                      After they have the sample
                    </p>
                    <h3 className="mt-1 font-display text-xl font-medium">Call script</h3>
                    <pre className="mt-3 font-serif text-[14px] leading-relaxed whitespace-pre-wrap">
                      {callScript}
                    </pre>
                    <Button
                      className="mt-3"
                      variant="outline"
                      onClick={() => {
                        void navigator.clipboard.writeText(callScript);
                        toast.success("Script copied.");
                      }}
                    >
                      <Copy className="size-4" />
                      Copy script
                    </Button>
                  </div>
                ) : null}
                <div className="grid gap-4 lg:grid-cols-2">
                  {coldEmails.map((em) => {
                    const touch = emailTouchId(em.heading);
                    return (
                      <article
                        key={em.heading}
                        className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5"
                      >
                        <p className="text-[12px] text-muted">{em.heading}</p>
                        <h3 className="mt-1 font-display text-lg font-medium leading-snug">
                          {em.subject && em.subject !== "—" ? em.subject : em.heading}
                        </h3>
                        {em.to ? (
                          <p className="mt-1 text-[13px] text-muted">To: {em.to}</p>
                        ) : null}
                        <pre className="mt-3 flex-1 font-serif text-[14px] leading-relaxed whitespace-pre-wrap">
                          {em.body}
                        </pre>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {/whatsapp|dm/i.test(em.heading) ? (
                            <Button variant="outline" size="sm" asChild>
                              <a
                                href={`https://wa.me/?text=${encodeURIComponent(em.body)}`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                Open WhatsApp
                              </a>
                            </Button>
                          ) : (
                            <Button variant="outline" size="sm" asChild>
                              <a href={mailtoHref(em.to, em.subject, em.body)}>
                                {emailCta(em.heading)}
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              void navigator.clipboard.writeText(
                                em.subject && em.subject !== "—"
                                  ? `Subject: ${em.subject}\n\n${em.body}`
                                  : em.body,
                              );
                              toast.success("Copied.");
                            }}
                          >
                            Copy
                          </Button>
                          {touch ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                markSent(session.host, touch);
                                toast.success(`Marked ${touch.toUpperCase()} sent.`);
                              }}
                            >
                              Mark sent
                            </Button>
                          ) : null}
                        </div>
                      </article>
                    );
                  })}
                </div>
                <PaperTools
                  title={`Cold outreach — ${session.host}`}
                  body={session.coldPaper}
                  stem="cold-email"
                  host={session.host}
                  stacked={false}
                  onWord={() =>
                    void saveWord({
                      title: `Cold outreach — ${session.host}`,
                      subtitle: "21-day sequence · sample first",
                      body: session.coldPaper,
                      stem: "cold-email",
                    })
                  }
                  onPdf={() =>
                    void savePdf({
                      title: `Cold outreach — ${session.host}`,
                      body: session.coldPaper,
                      stem: "cold-email",
                    })
                  }
                  onSave={() =>
                    savePaper("store-cold", "Cold email", session.coldPaper)
                  }
                />
              </div>
              </Fold>
            ) : null}

            {session.pages.length ? (
              <Fold
                title="Service agreement"
                hint={
                  session.agreementPaper
                    ? "Draft ready · fee and SLA"
                    : "Set fee and SLA, then draft"
                }
                open={isOpen("agreement")}
                onToggle={() => toggleFold("agreement")}
              >
              <div className="grid gap-4">
                <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                  <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                    Your terms · this engagement
                  </p>
                  <h2 className="mt-1 font-display text-2xl font-medium">
                    Fee, advance and service levels
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-muted">
                    These numbers go into the service agreement with {session.host}.
                    Blanks become [TO BE COMPLETED]. Saved on this device.
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <TermField
                      id="fee"
                      label="Fixed fee (INR)"
                      value={sender.fee}
                      onChange={(v) => sender.setField("fee", v)}
                      placeholder="25000"
                    />
                    <TermField
                      id="advance"
                      label="Advance %"
                      value={sender.advancePct}
                      onChange={(v) => sender.setField("advancePct", v)}
                      placeholder="50"
                    />
                    <TermField
                      id="draft-days"
                      label="Draft working days"
                      value={sender.draftDays}
                      onChange={(v) => sender.setField("draftDays", v)}
                      placeholder="7"
                    />
                    <TermField
                      id="revisions"
                      label="Included revisions"
                      value={sender.revisions}
                      onChange={(v) => sender.setField("revisions", v)}
                      placeholder="1"
                    />
                    <TermField
                      id="response"
                      label="Reply hours (IST)"
                      value={sender.responseHours}
                      onChange={(v) => sender.setField("responseHours", v)}
                      placeholder="24"
                    />
                    <TermField
                      id="pan"
                      label="Your PAN"
                      value={sender.pan}
                      onChange={(v) => sender.setField("pan", v)}
                      placeholder="ABCDE1234F"
                    />
                    <TermField
                      id="gstin"
                      label="Your GSTIN"
                      value={sender.gstin}
                      onChange={(v) => sender.setField("gstin", v)}
                      placeholder="If registered"
                    />
                    <TermField
                      id="city-forum"
                      label="City / courts"
                      value={sender.city}
                      onChange={(v) => sender.setField("city", v)}
                      placeholder="Hisar"
                    />
                  </div>
                  <div className="mt-3">
                    <TermField
                      id="address"
                      label="Your address"
                      value={sender.address}
                      onChange={(v) => sender.setField("address", v)}
                      placeholder="For the signature block"
                    />
                  </div>
                  <Button
                    className="mt-4"
                    onClick={() => void writeAgreement()}
                    disabled={working}
                  >
                    {busy === "agreement" ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <ScrollText className="size-4" />
                    )}
                    {session.agreementPaper
                      ? "Rewrite service agreement"
                      : "Draft service agreement"}
                  </Button>
                </div>
                {session.agreementPaper ? (
                  <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto]">
                    <DraftPaper
                      title={`Service agreement — ${session.host}`}
                      body={session.agreementPaper}
                    />
                    <PaperTools
                      title={`Service agreement — ${session.host}`}
                      body={session.agreementPaper}
                      stem="service-agreement"
                      host={session.host}
                      onWord={() =>
                        void saveWord({
                          title: `Service agreement — ${session.host}`,
                          subtitle: "Drafter and store · service levels attached",
                          body: session.agreementPaper,
                          stem: "service-agreement",
                        })
                      }
                      onPdf={() =>
                        void savePdf({
                          title: `Service agreement — ${session.host}`,
                          body: session.agreementPaper,
                          stem: "service-agreement",
                        })
                      }
                      onSave={() =>
                        savePaper(
                          "store-agreement",
                          "Service agreement",
                          session.agreementPaper,
                        )
                      }
                    />
                  </div>
                ) : null}
              </div>
              </Fold>
            ) : null}

            {activePage &&
            !session.findings &&
            !session.gapsPaper &&
            !session.questionsPaper &&
            !session.briefPaper ? (
              <p className="mt-8 text-sm text-muted">
                Next: build the client brief and email it to the merchant. Then
                legal facts, audit, and Word downloads.
              </p>
            ) : null}
          </section>
        )}
      </main>
    </AppShell>
  );
}

function ActionCard({
  title,
  ready,
  readyLabel,
  idleLabel,
  body,
  busy,
  working,
  icon,
  cta,
  onClick,
}: {
  title: string;
  ready: boolean;
  readyLabel: string;
  idleLabel: string;
  body: string;
  busy: boolean;
  working: boolean;
  icon: ReactNode;
  cta: string;
  onClick: () => void;
}) {
  return (
    <div className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-4 shadow-[var(--shadow-border)]">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-display text-lg font-medium">{title}</h3>
        <Badge variant={ready ? "default" : "muted"}>{ready ? readyLabel : idleLabel}</Badge>
      </div>
      <p className="mt-1 flex-1 text-[13px] text-muted">{body}</p>
      <Button
        className="mt-4"
        variant={ready ? "outline" : "default"}
        disabled={working}
        onClick={onClick}
      >
        {busy ? <Loader2 className="size-4 animate-spin" /> : icon}
        {cta}
      </Button>
    </div>
  );
}

function PaperTools({
  body,
  onSave,
  onWord,
  onPdf,
  stacked = true,
}: {
  title: string;
  body: string;
  stem: string;
  host: string;
  onSave: () => void;
  onWord: () => void;
  onPdf: () => void;
  stacked?: boolean;
}) {
  return (
    <div className={stacked ? "flex flex-col gap-2 xl:w-52" : "flex flex-col gap-2"}>
      <Button
        variant="outline"
        onClick={() => {
          void navigator.clipboard.writeText(body);
          toast.success("Copied.");
        }}
      >
        <Copy className="size-4" />
        Copy
      </Button>
      <Button variant="outline" onClick={onWord}>
        <Download className="size-4" />
        Word
      </Button>
      <Button variant="outline" onClick={onPdf}>
        <FileDown className="size-4" />
        PDF
      </Button>
      <Button variant="outline" onClick={onSave}>
        <Bookmark className="size-4" />
        Save
      </Button>
    </div>
  );
}

function TermField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
