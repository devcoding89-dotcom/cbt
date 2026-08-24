import { QuestionForm } from "@/components/admin/question-form";

export const dynamic = "force-dynamic";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">New question</h1>
        <p className="mt-1 text-sm text-ink-500">Add a single question to the bank.</p>
      </div>
      <QuestionForm />
    </div>
  );
}
