import { redirect } from "next/navigation";
import { repo } from "@/lib/db";
import { TextbookForm } from "@/components/admin/textbook-form";

export const dynamic = "force-dynamic";

export default async function EditTextbookPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const chapter = await repo.getTextbook(id);
  if (!chapter) redirect("/admin/textbooks");
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Edit chapter</h1>
        <p className="mt-1 text-sm text-ink-500">
          {chapter.exam} · {chapter.subject} · {chapter.book_title}
        </p>
      </div>
      <TextbookForm chapter={chapter} />
    </div>
  );
}
