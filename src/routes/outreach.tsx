import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Copy,
  Download,
  FileDown,
  Globe,
  Loader2,
  Mail,
  MessageCircle,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { Fold } from "@/components/fold";
import { DraftPaper } from "@/components/draft-paper";
import { PipelineBoard } from "@/components/pipeline-board";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { researchStoreFn, writeColdEmailFn } from "@/lib/ai/store-audit";
import { aiKeysPayload, rememberProvider } from "@/lib/ai/keys-store";
import { useAuditStore } from "@/lib/drafts/audit-store";
import { downloadDraftDocx } from "@/lib/drafts/docx-export";
import { downloadPaperPdf } from "@/lib/drafts/pdf-export";
import {
  callScriptText,
  emailCta,
  mailtoHref,
  parseForwardEmails,
  sampleClauseText,
} from "@/lib/drafts/parse";
import { emailTouchId, usePipelineStore } from "@/lib/drafts/pipeline-store";
import { senderPayload, useSenderStore } from "@/lib/drafts/sender-store";
import { useDraftStore } from "@/lib/drafts/store";

export const Route = createFileRoute("/outreach")({ component: OutreachPage });

function OutreachPage() {
  const sender = useSenderStore();
  const audit = useAuditStore();
  const startSequence = usePipelineStore((s) => s.startSequence);
  const ensurePipeline = usePipelineStore((s) => s.ensure);
  const markSent = usePipelineStore((s) => s.markSent);
  const saveHistory = useDraftStore((s) => s.save);
  const [url, setUrl] = useState(audit.urlInput || audit.host || "");
  const [busy, setBusy] = useState<"idle" | "research" | "draft">("idle");
  const [open, setOpen] = useState({ emails: true, paper: false, timeline: true });
  const working = busy !== "idle";

  const emails = useMemo(
    () => parseForwardEmails(audit.coldPaper),
    [audit.coldPaper],
  );
  const sampleClause = useMemo(
    () => sampleClauseText(audit.coldPaper),
    [audit.coldPaper],
  );
  const callScript = useMemo(
    () => callScriptText(audit.coldPaper),
    [audit.coldPaper],
  );

  async function researchThenDraft() {
    const target = url.trim() || audit.origin;
    if (!target) {
      toast.error("Paste a store URL first.");
      return;
    }
    setBusy("research");
    try {
      let origin = audit.origin;
      let host = audit.host;
      let homeTitle = audit.homeTitle;
      let pages = audit.pages;
      let missing = audit.missing;
      let hints = audit.hints ?? undefined;

      const sameHost =
        origin &&
        (target.includes(host) || origin.includes(target.replace(/^https?:\/\//, "")));

      if (!pages.length || !sameHost) {
        const researched = await researchStoreFn({ data: { url: target } });
        if (!researched.ok) {
          toast.error(researched.error);
          return;
        }
        audit.setUrlInput(target);
        audit.setResearch({
          origin: researched.origin,
          host: researched.host,
          homeTitle: researched.homeTitle,
          pages: researched.pages,
          missing: researched.missing,
          hints: researched.hints,
        });
        origin = researched.origin;
        host = researched.host;
        homeTitle = researched.homeTitle;
        pages = researched.pages;
        missing = researched.missing;
        hints = researched.hints;
        toast.success(`Read ${pages.length} page${pages.length === 1 ? "" : "s"} on ${host}.`);
      }

      setBusy("draft");
      const packed = senderPayload(sender);
      const result = await writeColdEmailFn({
        data: {
          origin,
          host,
          homeTitle,
          hints,
          pages: pages.map((p) => ({
            kind: p.kind,
            label: p.label,
            url: p.url,
            title: p.title,
            text: p.text.slice(0, 9000),
          })),
          missing,
          findings: audit.findings?.slice(0, 8000) || undefined,
          gapsPaper: audit.gapsPaper?.slice(0, 8000) || undefined,
          sender: packed,
          aiKeys: aiKeysPayload(),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      rememberProvider(result);
      audit.setColdPaper(result.text, result.citations);
      startSequence(host, origin);
      ensurePipeline(host, origin);
      toast.success("21-day sequence ready. Send Email 1 — ask them to reply send.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not draft the cold emails.");
    } finally {
      setBusy("idle");
    }
  }

  async function saveWord() {
    if (!audit.coldPaper.trim()) return;
    try {
      await downloadDraftDocx({
        title: `Cold outreach — ${audit.host || "store"}`,
        subtitle: sender.name
          ? `From ${sender.name} to the merchant`
          : "From you to the merchant",
        host: audit.host,
        body: audit.coldPaper,
        filename: `NyayaDraft-${(audit.host || "store").replace(/[^\w.-]+/g, "-")}-cold-email.docx`,
      });
      toast.success("Word file downloaded.");
    } catch {
      toast.error("Could not build the Word file.");
    }
  }

  async function savePdf() {
    if (!audit.coldPaper.trim()) return;
    try {
      await downloadPaperPdf({
        host: audit.host || "store",
        title: `Cold outreach — ${audit.host || "store"}`,
        body: audit.coldPaper,
        filename: `NyayaDraft-${(audit.host || "store").replace(/[^\w.-]+/g, "-")}-cold-email.pdf`,
      });
      toast.success("PDF downloaded.");
    } catch {
      toast.error("Could not build the PDF.");
    }
  }

  function save() {
    if (!audit.coldPaper) return;
    saveHistory({
      id: `store-cold::${audit.host}`,
      slug: "store-cold",
      title: `Cold email — ${audit.host}`,
      createdAt: Date.now(),
      facts: { website: audit.origin, host: audit.host, from: sender.name },
      draftText: audit.coldPaper,
      notes: "",
      citations: audit.citations,
    });
    toast.success("Saved on this device.");
  }

  return (
    <AppShell>
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <p className="text-[12px] tracking-[0.2em] text-muted uppercase">
              Freelance drafter · store outreach
            </p>
            <h1 className="mt-2 font-display text-4xl font-medium tracking-tight">
              Cold email the store
            </h1>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-muted">
              Email 1 is 80–120 words: one live gap in shop language, a one-page
              SAMPLE rewrite if they reply “send”, and why they should hire you.
              The 21-day timeline sits next to the pack. The meeting comes after
              they have seen your sentence next to theirs.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                From you
              </p>
              <h2 className="mt-1 font-display text-2xl font-medium">Your signature</h2>
              <p className="mt-1 text-sm text-muted">
                Optional. Leave the name as x — you will type your own name
                into the email before you send it.
              </p>
              <div className="mt-4 grid gap-3">
                <Field
                  id="sender-name"
                  label="Signature name"
                  value={sender.name}
                  onChange={(v) => sender.setField("name", v)}
                  placeholder="x"
                />
                <Field
                  id="sender-city"
                  label="City"
                  value={sender.city}
                  onChange={(v) => sender.setField("city", v)}
                  placeholder="Delhi"
                />
                <Field
                  id="sender-email"
                  label="Reply-to email"
                  value={sender.email}
                  onChange={(v) => sender.setField("email", v)}
                  placeholder="you@studio.example"
                />
                <Field
                  id="sender-phone"
                  label="Phone / WhatsApp"
                  value={sender.phone}
                  onChange={(v) => sender.setField("phone", v)}
                  placeholder="+91 …"
                />
                <div className="grid gap-1.5">
                  <Label htmlFor="sender-offer">What you offer in one line</Label>
                  <Textarea
                    id="sender-offer"
                    value={sender.offer}
                    onChange={(e) => sender.setField("offer", e.target.value)}
                    placeholder="I rewrite Indian D2C TOS, refund, shipping and DPDP notices so the live banners match the law."
                  />
                </div>
                <Field
                  id="sender-proof"
                  label="Proof (optional — a result, not a boast)"
                  value={sender.proof}
                  onChange={(v) => sender.setField("proof", v)}
                  placeholder="Last month: aligned a jewellery store’s 7-day banner with its refund page."
                />
                <Field
                  id="sender-address"
                  label="Address (for the service agreement)"
                  value={sender.address}
                  onChange={(v) => sender.setField("address", v)}
                  placeholder="Hisar, Haryana"
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    id="sender-pan"
                    label="PAN"
                    value={sender.pan}
                    onChange={(v) => sender.setField("pan", v)}
                    placeholder="ABCDE1234F"
                  />
                  <Field
                    id="sender-gstin"
                    label="GSTIN"
                    value={sender.gstin}
                    onChange={(v) => sender.setField("gstin", v)}
                    placeholder="If registered"
                  />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    id="sender-fee"
                    label="Typical fee (INR)"
                    value={sender.fee}
                    onChange={(v) => sender.setField("fee", v)}
                    placeholder="25000"
                  />
                  <Field
                    id="sender-advance"
                    label="Advance %"
                    value={sender.advancePct}
                    onChange={(v) => sender.setField("advancePct", v)}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
              <p className="text-[12px] tracking-[0.16em] text-muted uppercase">
                To the store
              </p>
              <h2 className="mt-1 font-display text-2xl font-medium">Their URL</h2>
              <p className="mt-1 text-sm text-muted">
                NyayaDraft opens the published TOS, privacy, refund and shipping
                pages and writes the hook from those, not from a template.
              </p>
              <form
                className="mt-4 flex flex-col gap-3 sm:flex-row"
                onSubmit={(e) => {
                  e.preventDefault();
                  void researchThenDraft();
                }}
              >
                <Input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="dakshis.com"
                  aria-label="Store URL"
                />
                <Button type="submit" disabled={working} className="sm:w-56">
                  {busy === "research" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : busy === "draft" ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Send className="size-4" />
                  )}
                  {busy === "research"
                    ? "Reading the store…"
                    : busy === "draft"
                      ? "Writing the emails…"
                      : "Draft cold emails"}
                </Button>
              </form>
              {audit.host ? (
                <p className="mt-3 text-[13px] text-muted">
                  Last researched: <span className="text-ink">{audit.host}</span>
                  {audit.pages.length
                    ? ` · ${audit.pages.length} pages`
                    : ""}
                  .{" "}
                  <Link to="/audit" className="text-primary hover:underline">
                    Open full audit
                  </Link>
                </p>
              ) : null}
              <ul className="mt-6 grid gap-2 text-sm text-muted">
                <li>Day 0 — observation, layman so-what, “reply send”.</li>
                <li>Day 3 — bump. Day 7 — a second live gap.</li>
                <li>Day 14 — pack and fee. Day 21 — break-up.</li>
                <li>Sample clause is marked not for publication. Full TOS stays behind the fee.</li>
              </ul>
            </div>
          </div>

          {audit.host ? (
            <Fold
              title="Onboard timeline"
              hint="Clock A until they reply · Clock B after send"
              open={open.timeline}
              onToggle={() => setOpen((s) => ({ ...s, timeline: !s.timeline }))}
            >
              <PipelineBoard host={audit.host} origin={audit.origin} />
            </Fold>
          ) : null}

          {emails.length ? (
            <Fold
              title="The 21-day pack"
              hint={`Ready to send · ${audit.host}`}
              open={open.emails}
              onToggle={() => setOpen((s) => ({ ...s, emails: !s.emails }))}
            >
            <div className="grid gap-4">
              <div className="flex flex-wrap justify-end gap-2">
                  <Button variant="outline" onClick={() => void saveWord()}>
                    <Download className="size-4" />
                    Word
                  </Button>
                  <Button variant="outline" onClick={() => void savePdf()}>
                    <FileDown className="size-4" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={save}>
                    Save
                  </Button>
              </div>
              {sampleClause ? (
                <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                  <Badge variant="muted">SAMPLE — not for publication</Badge>
                  <h3 className="mt-3 font-display text-lg font-medium">
                    One-page rewrite — send after they reply send
                  </h3>
                  <pre className="mt-3 font-serif text-[14px] leading-relaxed whitespace-pre-wrap">
                    {sampleClause}
                  </pre>
                  <Button
                    className="mt-3"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      void navigator.clipboard.writeText(sampleClause);
                      markSent(audit.host, "sample");
                      toast.success("Sample copied. Mark sample sent when it leaves your inbox.");
                    }}
                  >
                    <Copy className="size-4" />
                    Copy sample
                  </Button>
                </article>
              ) : null}
              {callScript ? (
                <article className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]">
                  <Badge variant="muted">Call script</Badge>
                  <pre className="mt-3 font-serif text-[14px] leading-relaxed whitespace-pre-wrap">
                    {callScript}
                  </pre>
                </article>
              ) : null}
              <div className="grid gap-4 lg:grid-cols-2">
                {emails.map((email) => {
                  const touch = emailTouchId(email.heading);
                  return (
                  <article
                    key={email.heading}
                    className="flex flex-col rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)]"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="muted">{email.heading.replace(/^EMAIL \d+\s*—\s*/i, "")}</Badge>
                    </div>
                    <h3 className="mt-3 font-display text-lg font-medium leading-snug">
                      {email.subject && email.subject !== "—"
                        ? email.subject
                        : email.heading}
                    </h3>
                    {email.to ? (
                      <p className="mt-1 text-[13px] text-muted">To: {email.to}</p>
                    ) : null}
                    <pre className="mt-3 flex-1 font-serif text-[14px] leading-relaxed whitespace-pre-wrap text-ink">
                      {email.body}
                    </pre>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {/whatsapp|dm/i.test(email.heading) ? (
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={`https://wa.me/?text=${encodeURIComponent(email.body)}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <MessageCircle className="size-4" />
                            Open WhatsApp
                          </a>
                        </Button>
                      ) : (
                        <Button variant="outline" size="sm" asChild>
                          <a href={mailtoHref(email.to, email.subject, email.body)}>
                            <Mail className="size-4" />
                            {emailCta(email.heading)}
                          </a>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          void navigator.clipboard.writeText(
                            email.subject && email.subject !== "—"
                              ? `Subject: ${email.subject}\n\n${email.body}`
                              : email.body,
                          );
                          toast.success("Copied.");
                        }}
                      >
                        <Copy className="size-4" />
                        Copy
                      </Button>
                      {touch ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            markSent(audit.host, touch);
                            toast.success("Marked sent on the timeline.");
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
            </div>
            </Fold>
          ) : null}

          {audit.coldPaper ? (
            <Fold
              title="Full outreach paper"
              hint={audit.host}
              open={open.paper}
              onToggle={() => setOpen((s) => ({ ...s, paper: !s.paper }))}
            >
              <DraftPaper title={`Cold outreach — ${audit.host}`} body={audit.coldPaper} />
            </Fold>
          ) : (
            <p className="mt-10 flex items-center gap-2 text-sm text-muted">
              <Globe className="size-4" />
              Paste a store and draft. Sign as x unless you type a name.
              Nothing leaves this device until you tap the button.
            </p>
          )}
        </section>
      </main>
    </AppShell>
  );
}

function Field({
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
