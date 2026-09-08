import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  Copy,
  Download,
  FileDown,
  Loader2,
  PenLine,
  Printer,
  Wand2,
} from "lucide-react";
import { toast } from "sonner";
import { CitationPanel, type Citation } from "@/components/citation-panel";
import { DraftPaper } from "@/components/draft-paper";
import { StudioForm } from "@/components/studio-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateDraft, refineDraft, searchAuthorities } from "@/lib/ai/legal";
import { aiKeysPayload, rememberProvider } from "@/lib/ai/keys-store";
import { downloadDraftDocx } from "@/lib/drafts/docx-export";
import { downloadPaperPdf } from "@/lib/drafts/pdf-export";
import { parseDraftOutput } from "@/lib/drafts/parse";
import { useDraftStore } from "@/lib/drafts/store";
import type { DraftTemplate } from "@/lib/drafts/templates";

type Stage = "idle" | "retrieving" | "drafting" | "ready" | "refining";

export function DraftStudio({ template }: { template: DraftTemplate }) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const field of template.fields) {
      if (field.type === "select" && field.options?.[0]) {
        init[field.key] = field.options[0].value;
      }
    }
    return init;
  });
  const [stage, setStage] = useState<Stage>("idle");
  const [raw, setRaw] = useState("");
  const [citations, setCitations] = useState<Citation[]>([]);
  const [refine, setRefine] = useState("");
  const save = useDraftStore((s) => s.save);

  const parsed = useMemo(() => (raw ? parseDraftOutput(raw) : null), [raw]);
  const busy = stage === "retrieving" || stage === "drafting" || stage === "refining";

  function setField(key: string, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function fillSample() {
    setValues({ ...template.sample });
    toast.message("Sample matter loaded. Review the facts, then draft.");
  }

  async function runDraft() {
    const missing = template.fields.filter(
      (f) => f.required && !(values[f.key] ?? "").trim(),
    );
    if (missing.length) {
      toast.error(`Please complete: ${missing.map((f) => f.label).join(", ")}`);
      return;
    }
    const factBlob = Object.values(values).join(" ");
    setStage("retrieving");
    try {
      const found = await searchAuthorities({
        data: { query: `${template.ragQuery}\n${factBlob}`, k: 8 },
      });
      setCitations(found.hits);
      setStage("drafting");
      const result = await generateDraft({
        data: {
          slug: template.slug,
          title: template.title,
          instructions: template.instructions,
          facts: values,
          ragQuery: template.ragQuery,
          aiKeys: aiKeysPayload(),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        setCitations(result.citations);
        setStage(raw ? "ready" : "idle");
        return;
      }
      rememberProvider(result);
      setRaw(result.text);
      setCitations(result.citations);
      setStage("ready");
      toast.success("Draft prepared. Review authorities before you copy it.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Drafting failed.");
      setStage(raw ? "ready" : "idle");
    }
  }

  async function runRefine() {
    if (!raw || !refine.trim()) return;
    setStage("refining");
    try {
      const result = await refineDraft({
        data: {
          slug: template.slug,
          title: template.title,
          currentDraft: raw,
          instruction: refine.trim(),
          ragQuery: template.ragQuery,
          aiKeys: aiKeysPayload(),
        },
      });
      if (!result.ok) {
        toast.error(result.error);
        setStage("ready");
        return;
      }
      rememberProvider(result);
      setRaw(result.text);
      setCitations(result.citations);
      setRefine("");
      setStage("ready");
      toast.success("Revision applied.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Revision failed.");
      setStage("ready");
    }
  }

  function copyDraft() {
    const text = parsed?.draft || raw;
    if (!text) return;
    void navigator.clipboard.writeText(text);
    toast.success("Draft copied.");
  }

  function saveDraft() {
    if (!parsed?.draft) return;
    save({
      id: `${template.slug}-${Date.now()}`,
      slug: template.slug,
      title: template.title,
      createdAt: Date.now(),
      facts: values,
      draftText: parsed.draft,
      notes: parsed.notes,
      citations,
    });
    toast.success("Saved to history on this device.");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        All instruments
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Badge variant="muted">{template.forum}</Badge>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {template.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{template.blurb}</p>
        </div>
        <div className="flex flex-wrap gap-2" data-print-hide>
          <Button variant="outline" onClick={fillSample} disabled={busy}>
            Load sample matter
          </Button>
          <Button onClick={() => void runDraft()} disabled={busy}>
            {busy && stage !== "refining" ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PenLine className="size-4" />
            )}
            {stage === "retrieving"
              ? "Retrieving authorities"
              : stage === "drafting"
                ? "Drafting"
                : "Draft with RAG"}
          </Button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_minmax(0,18rem)]">
        <section className="rounded-[var(--radius-lg)] border border-border bg-surface p-5 shadow-[var(--shadow-border)] lg:max-h-[calc(100dvh-7rem)] lg:overflow-y-auto lg:p-6">
          <h2 className="font-display text-lg font-medium">Facts of the matter</h2>
          <p className="mt-1 mb-5 text-[13px] text-muted">
            These particulars are the only facts the model may use.
          </p>
          <StudioForm template={template} values={values} onChange={setField} />
        </section>

        <section className="min-w-0">
          <DraftPaper
            title={template.title}
            body={parsed?.draft ?? ""}
            emptyHint={
              stage === "drafting" || stage === "retrieving"
                ? "Retrieving statute and composing the instrument…"
                : "Fill the facts — or load a sample matter — then draft. The page will set here as a pleading."
            }
          />
          {parsed?.notes ? (
            <div className="mt-4 rounded-[var(--radius-md)] border border-border bg-surface-2 p-4">
              <p className="text-[11px] tracking-[0.14em] text-muted uppercase">
                Drafting notes
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-ink">
                {parsed.notes}
              </p>
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-2" data-print-hide>
            <Button variant="outline" size="sm" onClick={copyDraft} disabled={!raw}>
              <Copy className="size-4" />
              Copy
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!raw}
              onClick={() => {
                void downloadDraftDocx({
                  title: template.title,
                  subtitle: "NyayaDraft working draft — review before use",
                  body: parsed?.draft || raw,
                  filename: `NyayaDraft-${template.slug}.docx`,
                })
                  .then(() => toast.success("Word file downloaded."))
                  .catch(() => toast.error("Could not build the Word file."));
              }}
            >
              <Download className="size-4" />
              Word
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!raw}
              onClick={() => {
                void downloadPaperPdf({
                  host: "NyayaDraft",
                  title: template.title,
                  body: parsed?.draft || raw,
                  filename: `NyayaDraft-${template.slug}.pdf`,
                })
                  .then(() => toast.success("PDF downloaded."))
                  .catch(() => toast.error("Could not build the PDF."));
              }}
            >
              <FileDown className="size-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={!raw}
              onClick={() => window.print()}
            >
              <Printer className="size-4" />
              Print
            </Button>
            <Button variant="outline" size="sm" disabled={!parsed?.draft} onClick={saveDraft}>
              <Bookmark className="size-4" />
              Save
            </Button>
          </div>
          <div className="mt-3 flex gap-2" data-print-hide>
            <Input
              value={refine}
              placeholder="Revise: shorten the prayer, add limitation, more formal…"
              onChange={(e) => setRefine(e.target.value)}
              disabled={!raw || busy}
              onKeyDown={(e) => {
                if (e.key === "Enter") void runRefine();
              }}
            />
            <Button
              variant="secondary"
              disabled={!raw || busy || !refine.trim()}
              onClick={() => void runRefine()}
            >
              {stage === "refining" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Wand2 className="size-4" />
              )}
              Revise
            </Button>
          </div>
        </section>

        <CitationPanel citations={citations} className="lg:col-span-2 xl:col-span-1 xl:sticky xl:top-20" />
      </div>
    </div>
  );
}
