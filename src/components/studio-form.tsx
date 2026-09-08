import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { DraftTemplate } from "@/lib/drafts/templates";

export function StudioForm({
  template,
  values,
  onChange,
}: {
  template: DraftTemplate;
  values: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {template.fields.map((field) => {
        const id = `field-${field.key}`;
        return (
          <div key={field.key} className="flex flex-col gap-1.5">
            <Label htmlFor={id}>
              {field.label}
              {field.required ? (
                <span className="ml-1 text-danger">*</span>
              ) : null}
            </Label>
            {field.type === "textarea" ? (
              <Textarea
                id={id}
                value={values[field.key] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
                rows={4}
              />
            ) : field.type === "select" ? (
              <Select
                value={values[field.key] || field.options?.[0]?.value}
                onValueChange={(v) => onChange(field.key, v)}
              >
                <SelectTrigger id={id} className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(field.options ?? []).map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id={id}
                type={field.type === "date" ? "date" : "text"}
                value={values[field.key] ?? ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
            )}
            {field.hint ? (
              <p className="text-[12px] text-muted">{field.hint}</p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
