"use server";

import { redirect } from "next/navigation";
import { canAccessPaidFeatures, getCurrentUser } from "@/lib/auth";
import { startSession, type Mode } from "@/lib/services/practice";
import type { Difficulty, Exam } from "@/lib/types";

export interface PracticeFormState {
  error?: string;
}

export async function startPracticeAction(
  _prev: PracticeFormState,
  formData: FormData,
): Promise<PracticeFormState> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  if (!(await canAccessPaidFeatures(user))) {
    redirect("/billing?reason=practice");
  }

  const exam = (String(formData.get("exam") ?? user.target_exam ?? "JAMB") as Exam) ?? "JAMB";
  const subjects = formData.getAll("subjects").map(String).filter(Boolean);
  const topics = formData.getAll("topics").map(String).filter(Boolean);
  const mode = String(formData.get("mode") ?? "quick") as Mode;
  const difficultyRaw = String(formData.get("difficulty") ?? "");
  const difficulty = ["easy", "medium", "hard"].includes(difficultyRaw)
    ? (difficultyRaw as Difficulty)
    : undefined;
  const customCount = Number(formData.get("count") ?? 0);

  if (!subjects.length && !topics.length) {
    return { error: "Select at least one subject to practise." };
  }

  const res = await startSession({
    userId: user.id,
    exam,
    subjects,
    topics,
    mode,
    difficulty,
    count: customCount > 0 ? customCount : undefined,
  });

  if (!res.ok) return { error: res.error };
  redirect(`/practice/session/${res.session.id}`);
}
