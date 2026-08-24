import Link from "next/link";
import { BookOpen, BrainCircuit, HeartHandshake, Target } from "lucide-react";
import { buttonClass } from "@/components/ui/button";

export const metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-600">About</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">
        Built for the student who is already trying hard.
      </h1>
      <p className="mt-4 text-[17px] leading-relaxed text-ink-600">
        Every year, hundreds of thousands of Nigerian students sit JAMB, WAEC and NECO. Most of them practise.
        Far fewer know <em>what</em> to practise. That gap — between effort and direction — is the whole reason
        PrepAI exists.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {[
          { icon: Target, t: "The problem", d: "Free past-question apps give you a score and nothing else. A score tells you that you failed, not why." },
          { icon: BrainCircuit, t: "Our answer", d: "We analyse every answer by topic, pace and difficulty, then hand you a ranked list of what to fix first." },
          { icon: BookOpen, t: "Closing the loop", d: "Each weak topic links to the textbook chapter that covers it, and a one-tap drill to re-test yourself." },
          { icon: HeartHandshake, t: "Priced for students", d: "₦1,000 a month, no auto-renewal. Pay in the months you are studying, stop in the months you are not." },
        ].map((x) => (
          <div key={x.t} className="rounded-2xl border border-ink-200 bg-white p-5 card-shadow">
            <x.icon className="size-6 text-brand-600" />
            <p className="mt-3 text-base font-bold text-ink-950">{x.t}</p>
            <p className="mt-1.5 text-[14px] leading-relaxed text-ink-600">{x.d}</p>
          </div>
        ))}
      </div>

      <div className="reader mt-12">
        <h2>How the analysis works</h2>
        <p>
          There is no mystery box. After you submit a session we group your answers by topic and score each one
          on four signals: accuracy, exposure (how many questions you actually saw), pace (whether you rushed
          or stalled) and difficulty mix (missing easy questions is weighted more heavily than missing hard
          ones). Skipped questions count as half-wrong, because in an exam a blank is a lost mark.
        </p>
        <p>
          Topics above your weakness threshold are flagged, ranked by how much they are costing you, and
          matched to a textbook chapter through shared topic tags. Across sessions we track whether each topic
          is improving, flat or getting worse — that is your study plan.
        </p>
        <h2>Where the questions come from</h2>
        <p>
          The bank is built from past JAMB, WAEC and NECO objective papers, each with a worked explanation.
          PrepAI is an independent study platform and is not affiliated with any examination body.
        </p>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/auth/signup" className={buttonClass("primary", "lg")}>
          Create a free account
        </Link>
        <Link href="/contact" className={buttonClass("outline", "lg")}>
          Talk to us
        </Link>
      </div>
    </div>
  );
}
