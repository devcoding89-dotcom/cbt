"use server";

import { redirect } from "next/navigation";
import { canAccessPaidFeatures, getCurrentUser } from "@/lib/auth";
import { MODES, startSession, type Mode } from "@/lib/services/practice";
import { EXAMS, type Difficulty, type Exam } from "@/lib/types";

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

  const examValue = String(formData.get("exam") ?? user.target_exam ?? "JAMB");
  if (!EXAMS.includes(examValue as Exam)) return { error: "Choose a valid exam." };
  const exam = examValue as Exam;
  const subjects = formData.getAll("subjects").map(String).filter(Boolean);
  const topics = formData.getAll("topics").map(String).filter(Boolean);
  const modeValue = String(formData.get("mode") ?? "quick");
  if (!Object.prototype.hasOwnProperty.call(MODES, modeValue)) return { error: "Choose a valid practice mode." };
  const mode = modeValue as Mode;
  const difficultyRaw = String(formData.get("difficulty") ?? "");
  const difficulty = ["easy", "medium", "hard"].includes(difficultyRaw)
    ? (difficultyRaw as Difficulty)
    : undefined;
  const shuffle = String(formData.get("shuffle") ?? "yes") === "yes";
  const customCount = Number(formData.get("count") ?? 0);
  if (!Number.isFinite(customCount) || customCount < 0 || customCount > 500) {
    return { error: "Question count must be between 1 and 500." };
  }

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
    shuffle,
    count: customCount > 0 ? customCount : undefined,
  });

  if (!res.ok) return { error: res.error };
  redirect(`/practice/session/${res.session.id}`);
}
