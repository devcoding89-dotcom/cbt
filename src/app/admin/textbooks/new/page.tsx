import { TextbookForm } from "@/components/admin/textbook-form";

export const dynamic = "force-dynamic";

export default function NewTextbookPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">New textbook chapter</h1>
        <p className="mt-1 text-sm text-ink-500">Tag it with the same topic names you use on questions.</p>
      </div>
      <TextbookForm />
    </div>
  );
}
