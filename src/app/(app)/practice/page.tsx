import { redirect } from "next/navigation";
import { getCurrentUser, isSubscribed } from "@/lib/auth";
import { repo } from "@/lib/db";
import { PracticeSetup } from "@/components/app/practice-setup";

export const metadata = { title: "Practice" };
export const dynamic = "force-dynamic";

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ subject?: string; topic?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const exam = user.target_exam ?? "JAMB";
  const { subject, topic } = await searchParams;

  const [subjectCounts, facets] = await Promise.all([
    repo.questionCountsBySubject(exam),
    repo.questionFacets(exam),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">Start a practice session</h1>
        <p className="mt-1 text-sm text-ink-500">
          Choose your subjects and length. Everything is timed exactly like the real CBT.
        </p>
      </div>
      <PracticeSetup
        exam={exam}
        subjectCounts={subjectCounts}
        presetSubject={subject}
        presetTopic={topic}
        topics={facets.topics}
        subscribed={isSubscribed(user)}
      />
    </div>
  );
}
