import Link from "next/link";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import { repo } from "@/lib/db";
import { Badge, Card, CardBody, EmptyState } from "@/components/ui/card";
import { buttonClass } from "@/components/ui/button";
import { deleteTextbookAction } from "@/app/admin/actions";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminTextbooksPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const chapters = await repo.listTextbooks({});

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Textbooks</h1>
          <p className="mt-1 text-sm text-ink-500">
            {chapters.length} chapter{chapters.length === 1 ? "" : "s"} · tagged chapters power the &ldquo;Study
            this topic&rdquo; button in AI reports.
          </p>
        </div>
        <Link href="/admin/textbooks/new" className={buttonClass("primary", "sm")}>
          <Plus className="size-4" />
          New chapter
        </Link>
      </div>

      {saved && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          Chapter saved.
        </div>
      )}

      {chapters.length === 0 ? (
        <Card>
          <CardBody className="pt-6">
            <EmptyState
              icon={<BookOpen className="size-6" />}
              title="No chapters yet"
              description="Add your first textbook chapter so weakness reports can recommend reading."
              action={
                <Link href="/admin/textbooks/new" className={buttonClass("primary", "md")}>
                  Add chapter
                </Link>
              }
            />
          </CardBody>
        </Card>
      ) : (
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left text-sm">
              <thead className="border-b border-ink-200 bg-ink-50 text-[11px] uppercase tracking-wide text-ink-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">Chapter</th>
                  <th className="px-4 py-3 font-semibold">Exam / subject</th>
                  <th className="px-4 py-3 font-semibold">Topic tags</th>
                  <th className="px-4 py-3 font-semibold">Source</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {chapters.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-ink-900">
                        {t.chapter_number ? `${t.chapter_number}. ` : ""}
                        {t.title}
                      </p>
                      <p className="text-[11px] text-ink-500">
                        {t.book_title} · {formatDate(t.created_at)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone="brand">{t.exam}</Badge>
                      <p className="mt-1 text-[12px] text-ink-600">{t.subject}</p>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {t.topic_tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="rounded bg-ink-100 px-1.5 py-0.5 text-[10px] text-ink-600">
                            {tag}
                          </span>
                        ))}
                        {t.topic_tags.length === 0 && <span className="text-[11px] text-amber-600">no tags</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">
                      {t.file_path ? "File" : t.content_html ? "Inline HTML" : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={t.is_published ? "success" : "neutral"}>
                        {t.is_published ? "Published" : "Draft"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Link
                          href={`/admin/textbooks/${t.id}`}
                          className="grid size-8 place-items-center rounded-lg text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                        >
                          <Pencil className="size-4" />
                        </Link>
                        <form action={deleteTextbookAction}>
                          <input type="hidden" name="id" value={t.id} />
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
        </Card>
      )}
    </div>
  );
}
