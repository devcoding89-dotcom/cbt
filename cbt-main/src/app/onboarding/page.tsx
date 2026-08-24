import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";
import { EXAMS, type Exam } from "@/lib/types";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = { title: "Choose your exam" };
export const dynamic = "force-dynamic";

async function chooseExam(formData: FormData) {
  "use server";
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const exam = String(formData.get("exam") ?? "") as Exam;
  if (!EXAMS.includes(exam)) redirect("/onboarding");
  await repo.updateProfile(user.id, { target_exam: exam });
  redirect("/dashboard");
}

const meta: Record<Exam, { name: string; desc: string; points: string[]; accent: string }> = {
  JAMB: {
    name: "JAMB UTME",
    desc: "Unified Tertiary Matriculation Examination",
    points: ["4 subjects (English compulsory)", "180 questions · 2 hours", "Full CBT mock simulation"],
    accent: "from-brand-500 to-brand-700",
  },
  WAEC: {
    name: "WAEC SSCE",
    desc: "West African Senior School Certificate",
    points: ["Up to 9 subjects", "Self-paced or timed", "Objective past questions"],
    accent: "from-emerald-500 to-emerald-700",
  },
  NECO: {
    name: "NECO SSCE",
    desc: "National Examinations Council",
    points: ["Up to 9 subjects", "Self-paced or timed", "Objective past questions"],
    accent: "from-amber-500 to-orange-600",
  },
};

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  return (
    <div className="min-h-dvh bg-ink-50/60">
      <div className="border-b border-ink-200 bg-white">
        <div className="container-x flex h-16 items-center">
          <Logo />
        </div>
      </div>

      <div className="container-x max-w-4xl py-12">
        <div className="text-center">
          <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-600">Step 1 of 1</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
            Welcome{user.full_name ? `, ${user.full_name.split(" ")[0]}` : ""} 👋
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] text-ink-500">
            Which exam are you preparing for? This tailors your question bank, timing and textbook
            recommendations. You can change it later in settings.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {EXAMS.map((exam) => {
            const m = meta[exam];
            return (
              <form key={exam} action={chooseExam}>
                <input type="hidden" name="exam" value={exam} />
                <button
                  type="submit"
                  className="group relative flex h-full w-full flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white p-6 text-left transition-all duration-200 card-shadow hover:-translate-y-1 hover:border-brand-400 hover:shadow-xl"
                >
                  <span className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${m.accent}`} />
                  <p className="text-lg font-bold tracking-tight text-ink-950">{m.name}</p>
                  <p className="mt-1 text-[13px] text-ink-500">{m.desc}</p>
                  <ul className="mt-4 flex-1 space-y-2">
                    {m.points.map((p) => (
                      <li key={p} className="flex items-start gap-2 text-[13px] text-ink-600">
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        {p}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-brand-700">
                    Select {exam}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </button>
              </form>
            );
          })}
        </div>

        <form action={chooseExam} className="mt-8 text-center">
          <input type="hidden" name="exam" value="JAMB" />
          <Button variant="ghost" size="sm" type="submit">
            Not sure yet — start with JAMB
          </Button>
        </form>
      </div>
    </div>
  );
}
