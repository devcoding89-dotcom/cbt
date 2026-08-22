import { QuestionImporter } from "@/components/admin/question-importer";

export const dynamic = "force-dynamic";

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Bulk import questions</h1>
        <p className="mt-1 text-sm text-ink-500">
          Load your own past questions from a spreadsheet or JSON export — validated row by row.
        </p>
      </div>
      <QuestionImporter />
    </div>
  );
}
