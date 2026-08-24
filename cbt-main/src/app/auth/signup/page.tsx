import { redirect } from "next/navigation";
import { SignupForm } from "@/components/auth-forms";
import { getCurrentUser } from "@/lib/auth";
import { EXAMS, type Exam } from "@/lib/types";

export const metadata = { title: "Create account" };

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  const { exam } = await searchParams;
  const valid = EXAMS.includes(exam as Exam) ? (exam as Exam) : undefined;
  return <SignupForm exam={valid} />;
}
