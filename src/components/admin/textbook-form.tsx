"use client";

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { Loader2, Save, Upload } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Checkbox, Field, Input, Select, Textarea } from "@/components/ui/input";
import { Button, buttonClass } from "@/components/ui/button";
import { saveTextbookAction, type AdminState } from "@/app/admin/actions";
import { EXAMS, SUBJECTS_BY_EXAM, type Exam, type TextbookChapter } from "@/lib/types";

export function TextbookForm({ chapter }: { chapter?: TextbookChapter }) {
  const [state, action, pending] = useActionState(saveTextbookAction, {} as AdminState);
  const [exam, setExam] = useState<Exam>(chapter?.exam ?? "JAMB");
  const [filePath, setFilePath] = useState(chapter?.file_path ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const json = (await res.json()) as { url?: string; error?: string };
      if (json.url) setFilePath(json.url);
      else setUploadError(json.error ?? "Upload failed");
    } catch {
      setUploadError("Upload failed — check your connection.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form action={action} className="grid gap-5 lg:grid-cols-[1.6fr_1fr] lg:items-start">
      {chapter && <input type="hidden" name="id" value={chapter.id} />}

      <div className="space-y-5">
        {state.error && <Alert>{state.error}</Alert>}

        <Card>
          <CardHeader>
            <CardTitle>Chapter details</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field label="Book title" htmlFor="book_title">
              <Input id="book_title" name="book_title" required defaultValue={chapter?.book_title} placeholder="New School Mathematics for Senior Secondary" />
            </Field>
            <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
              <Field label="Chapter title" htmlFor="title">
                <Input id="title" name="title" required defaultValue={chapter?.title} placeholder="Quadratic Equations" />
              </Field>
              <Field label="Chapter no." htmlFor="chapter_number">
                <Input id="chapter_number" name="chapter_number" type="number" min={0} defaultValue={chapter?.chapter_number ?? ""} placeholder="2" />
              </Field>
            </div>
            <Field label="Short description" htmlFor="description">
              <Input id="description" name="description" defaultValue={chapter?.description ?? ""} placeholder="Factorisation, completing the square and the quadratic formula." />
            </Field>
            <Field
              label="Topic tags"
              htmlFor="topic_tags"
              hint="Comma separated. These must match the topic names used on your questions — that is how the AI report links a weakness to this chapter."
            >
              <Input id="topic_tags" name="topic_tags" defaultValue={chapter?.topic_tags.join(", ")} placeholder="Quadratic Equations, Algebra" />
            </Field>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
            <p className="mt-1 text-sm text-ink-500">
              Write the chapter inline as HTML, or upload a PDF/HTML file. Inline content renders best on
              phones.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <Field
              label="Inline HTML"
              htmlFor="content_html"
              hint="Supports h2, h3, p, ul/ol, table, strong, and the helper classes .eq (formula block) and .example (worked example)."
            >
              <Textarea
                id="content_html"
                name="content_html"
                defaultValue={chapter?.content_html ?? ""}
                className="min-h-64 font-mono text-[12px]"
                placeholder={`<h2>2.1 Introduction</h2>\n<p>A quadratic equation is…</p>\n<p class="eq">ax² + bx + c = 0</p>`}
              />
            </Field>

            <div className="rounded-xl border border-dashed border-ink-200 bg-ink-50/60 p-4">
              <p className="text-sm font-semibold text-ink-800">Or attach a file</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.html,.htm,.txt,.epub"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload(f);
                  }}
                />
                <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
                  {uploading ? <Loader2 className="size-4 animate-spin" /> : <Upload className="size-4" />}
                  {uploading ? "Uploading…" : "Upload PDF / HTML"}
                </Button>
                {filePath && (
                  <a href={filePath} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-brand-700 hover:underline">
                    View uploaded file
                  </a>
                )}
              </div>
              {uploadError && <p className="mt-2 text-[12px] font-medium text-rose-600">{uploadError}</p>}
              <Input
                name="file_path"
                value={filePath}
                onChange={(e) => setFilePath(e.target.value)}
                placeholder="/uploads/chapter.pdf or https://…"
                className="mt-3"
              />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle>Classification</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <Field label="Exam" htmlFor="exam">
            <Select id="exam" name="exam" value={exam} onChange={(e) => setExam(e.target.value as Exam)}>
              {EXAMS.map((e) => (
                <option key={e} value={e}>
                  {e}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Subject" htmlFor="subject">
            <Input id="subject" name="subject" required list="tb-subjects" defaultValue={chapter?.subject} placeholder="Mathematics" />
            <datalist id="tb-subjects">
              {SUBJECTS_BY_EXAM[exam].map((s) => (
                <option key={s} value={s} />
              ))}
            </datalist>
          </Field>
          <Field label="Page count (optional)" htmlFor="page_count">
            <Input id="page_count" name="page_count" type="number" min={0} defaultValue={chapter?.page_count ?? ""} />
          </Field>
          <label className="flex items-center gap-2.5 text-sm text-ink-700">
            <Checkbox name="is_published" defaultChecked={chapter?.is_published ?? true} />
            Published (visible to students)
          </label>
          <div className="flex flex-col gap-2 pt-1">
            <Button type="submit" loading={pending} className="w-full">
              <Save className="size-4" />
              {chapter ? "Save chapter" : "Create chapter"}
            </Button>
            <Link href="/admin/textbooks" className={buttonClass("ghost", "md", "w-full")}>
              Cancel
            </Link>
          </div>
        </CardBody>
      </Card>
    </form>
  );
}
