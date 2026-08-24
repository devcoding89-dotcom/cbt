import Link from "next/link";
import { Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { repo } from "@/lib/db";
import { EXAMS, type Difficulty, type Exam } from "@/lib/types";
import { Badge, Card, CardBody, EmptyState } from "@/components/ui/card";
import { Input, Select } from "@/components/ui/input";
import { buttonClass } from "@/components/ui/button";
import { deleteQuestionAction, toggleQuestionActiveAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const PER_PAGE = 25;

export default async function AdminQuestionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    exam?: string;
    subject?: string;
    difficulty?: string;
    page?: string;
    created?: string;
    updated?: string;
  }>;
}) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);
  const exam = (sp.exam as Exam | "ALL") || "ALL";

  const [{ rows, total }, facets] = await Promise.all([
    repo.listQuestions({
      exam,
      subject: sp.subject || undefined,
      difficulty: (sp.difficulty as Difficulty) || undefined,
      search: sp.q || undefined,
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
    }),
    repo.questionFacets(exam),
  ]);
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));

  const qs = (patch: Record<string, string | number | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: sp.q, exam: sp.exam, subject: sp.subject, difficulty: sp.difficulty, page: sp.page, ...patch };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, String(v));
    return `/admin/questions?${p.toString()}`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Question bank</h1>
          <p className="mt-1 text-sm text-ink-500">{total} questions match your filters.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/questions/import" className={buttonClass("outline", "sm")}>
            <Upload className="size-4" />
            Import
          </Link>
          <Link href="/admin/questions/new" className={buttonClass("primary", "sm")}>
            <Plus className="size-4" />
            New question
          </Link>
        </div>
      </div>

      {(sp.created || sp.updated) && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Question {sp.created ? "created" : "updated"} successfully.
        </div>
      )}

      <Card>
        <CardBody className="pt-5">
          <form className="grid gap-3 sm:grid-cols-[1.5fr_repeat(3,1fr)_auto]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-3.5 size-4 text-ink-400" />
              <Input name="q" defaultValue={sp.q} placeholder="Search question text or topic…" className="pl-9" />
            </div>
            <Select name="exam" defaultValue={sp.exam ?? ""}>
              <option value="">All exams</option>
              {EXAMS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
            <Select name="subject" defaultValue={sp.subject ?? ""}>
              <option value="">All subjects</option>
              {facets.subjects.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
            <Select name="difficulty" defaultValue={sp.difficulty ?? ""}>
              <option value="">Any difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </Select>
            <button className={buttonClass("secondary", "md")}>Filter</button>
          </form>
        </CardBody>
      </Card>

      {rows.length === 0 ? (
        <Card>
          <CardBody className="pt-6">
            <EmptyState
              title="No questions found"
              description="Adjust the filters, or import questions in bulk from CSV/JSON."
              action={
                <Link href="/admin/questions/import" className={buttonClass("primary", "md")}>
                  Import questions
                </Link>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead className="border-b border-ink-200 bg-ink-50 text-[11px] uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Question</th>
                  <th className="px-4 py-3 font-semibold">Exam</th>
                  <th className="px-4 py-3 font-semibold">Subject / topic</th>
                  <th className="px-4 py-3 font-semibold">Ans</th>
                  <th className="px-4 py-3 font-semibold">Level</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {rows.map((q) => (
                  <tr key={q.id} className="hover:bg-ink-50/60">
                    <td className="max-w-md px-4 py-3">
                      <p className="line-clamp-2 font-medium text-ink-900">{q.question_text}</p>
                      <p className="mt-0.5 line-clamp-1 text-[11px] text-ink-400">
                        {q.options.length} options{q.year ? ` · ${q.year}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="brand">{q.exam}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-ink-800">{q.subject}</p>
                      <p className="text-[11px] text-ink-500">{q.topic}</p>
                    </td>
                    <td className="px-4 py-3">
                      <span className="grid size-7 place-items-center rounded-lg bg-emerald-50 text-[12px] font-bold text-emerald-700">
                        {q.correct_answer}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "rounded-lg px-2 py-0.5 text-[11px] font-semibold",
                          q.difficulty === "hard"
                            ? "bg-rose-50 text-rose-700"
                            : q.difficulty === "easy"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-amber-50 text-amber-700",
                        )}
                      >
                        {q.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <form action={toggleQuestionActiveAction}>
                        <input type="hidden" name="id" value={q.id} />
                        <button className={cn("text-[11px] font-semibold", q.is_active ? "text-emerald-600" : "text-ink-400")}>
                          {q.is_active ? "● Active" : "○ Hidden"}
                        </button>
                      </form>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/questions/${q.id}`}
                          className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <form action={deleteQuestionAction}>
                          <input type="hidden" name="id" value={q.id} />
                          <button className="grid size-8 place-items-center rounded-lg text-ink-400 hover:bg-rose-50 hover:text-rose-600">
                            <Trash2 className="size-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pages > 1 && (
            <div className="flex items-center justify-between border-t border-ink-100 px-4 py-3 text-sm">
              <span className="text-ink-500">
                Page {page} of {pages}
              </span>
              <div className="flex gap-2">
                {page > 1 && (
                  <Link href={qs({ page: page - 1 })} className={buttonClass("outline", "sm")}>
                    Previous
                  </Link>
                )}
                {page < pages && (
                  <Link href={qs({ page: page + 1 })} className={buttonClass("outline", "sm")}>
                    Next
                  </Link>
                )}
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
