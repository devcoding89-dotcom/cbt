import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";
import { loadSessionQuestions, stripAnswers } from "@/lib/services/practice";
import { SessionRunner } from "@/components/app/session-runner";

export const metadata = { title: "CBT session" };
export const dynamic = "force-dynamic";

export default async function SessionPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const { id } = await params;
  const session = await repo.getSession(id);
  if (!session || session.user_id !== user.id) redirect("/practice");
  if (session.status === "completed") redirect(`/reports/${session.id}`);

  const [questions, answers] = await Promise.all([
    loadSessionQuestions(session),
    repo.listAnswers(session.id),
  ]);

  const initialAnswers: Record<string, { selected: string | null; flagged: boolean; timeMs: number }> = {};
  for (const a of answers) {
    initialAnswers[a.question_id] = {
      selected: a.selected_option,
      flagged: a.flagged,
      timeMs: a.time_taken_ms,
    };
  }

  const elapsed = Math.round((Date.now() - new Date(session.started_at).getTime()) / 1000);

  return (
    <SessionRunner
      sessionId={session.id}
      exam={session.exam}
      questions={questions.map(stripAnswers)}
      durationSeconds={session.duration_seconds}
      elapsedSeconds={elapsed}
      initialAnswers={initialAnswers}
    />
  );
}
