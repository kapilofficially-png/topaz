import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { DraftStudio } from "@/components/draft-studio";
import { Button } from "@/components/ui/button";
import { getTemplate } from "@/lib/drafts/templates";

export const Route = createFileRoute("/draft/$slug")({
  component: DraftPage,
});

function DraftPage() {
  const { slug } = Route.useParams();
  const template = getTemplate(slug);

  if (!template) {
    return (
      <AppShell>
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="font-display text-3xl font-medium">No such instrument</h1>
          <p className="mt-2 text-sm text-muted">
            That draft type is not in the chambers list.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Back to drafts</Link>
          </Button>
        </main>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <main>
        <DraftStudio template={template} />
      </main>
    </AppShell>
  );
}
