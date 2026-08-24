import { redirect } from "next/navigation";
import { repo } from "@/lib/db";
import { QuestionForm } from "@/components/admin/question-form";

export const dynamic = "force-dynamic";

export default async function EditQuestionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await repo.getQuestion(id);
  if (!question) redirect("/admin/questions");

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Edit question</h1>
        <p className="mt-1 text-sm text-ink-500">
          {question.exam} · {question.subject} · {question.topic}
        </p>
      </div>
      <QuestionForm question={question} />
    </div>
  );
}
