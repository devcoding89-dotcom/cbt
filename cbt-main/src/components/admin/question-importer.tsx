"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileUp, Loader2, Upload } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Field, Select, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { csvToObjects } from "@/lib/csv";
import { EXAMS, SUBJECTS_BY_EXAM, type Exam } from "@/lib/types";
import * as XLSX from "xlsx";

type Row = Record<string, unknown>;
interface Result {
  inserted?: number;
  wouldInsert?: number;
  errors: { index: number; error: string }[];
}

export function QuestionImporter() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [exam, setExam] = useState<Exam>("JAMB");
  const [questionYear, setQuestionYear] = useState("");
  const [answerYear, setAnswerYear] = useState("");
  const [questionRaw, setQuestionRaw] = useState("");
  const [answerRaw, setAnswerRaw] = useState("");
  const [questionRows, setQuestionRows] = useState<Row[]>([]);
  const [answerRows, setAnswerRows] = useState<Row[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [validated, setValidated] = useState(false);
  const [busy, setBusy] = useState(false);
  const questionFileRef = useRef<HTMLInputElement>(null);
  const answerFileRef = useRef<HTMLInputElement>(null);

  const rows: Row[] = questionRows.map((row, index) => ({
    ...row,
    subject,
    exam,
    ...(questionYear ? { year: questionYear } : {}),
    ...(answerRows[index]?.answer || answerRows[index]?.correct_answer
      ? { correct_answer: answerRows[index].answer || answerRows[index].correct_answer }
      : {}),
  }));

  const parse = (text: string, kind: "questions" | "answers") => {
    if (kind === "questions") setQuestionRaw(text);
    else setAnswerRaw(text);
    setResult(null);
    setValidated(false);
    const trimmed = text.trim();
    if (!trimmed) {
      if (kind === "questions") setQuestionRows([]);
      else setAnswerRows([]);
      setParseError(null);
      return;
    }
    try {
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        const json = JSON.parse(trimmed) as Row | Row[];
        const arr = Array.isArray(json) ? json : [json];
        if (kind === "questions") setQuestionRows(arr);
        else setAnswerRows(arr);
        setParseError(null);
      } else {
        const objs = csvToObjects(trimmed);
        if (!objs.length) throw new Error("No data rows found — check that the first line is a header.");
        if (kind === "questions") setQuestionRows(objs);
        else setAnswerRows(objs);
        setParseError(null);
      }
    } catch (e) {
      if (kind === "questions") setQuestionRows([]);
      else setAnswerRows([]);
      setParseError(e instanceof Error ? e.message : "Could not parse the input.");
    }
  };

  const onFile = async (file: File, kind: "questions" | "answers") => {
    if (file.name.toLowerCase().endsWith(".pdf") || file.type === "application/pdf") {
      setBusy(true);
      setParseError(null);
      try {
        const form = new FormData();
        form.append("file", file);
        const response = await fetch("/api/admin/questions/parse-pdf", { method: "POST", body: form });
        const data = (await response.json()) as { text?: string; error?: string };
        if (!response.ok || !data.text) throw new Error(data.error || "Could not extract text from this PDF.");
        parse(data.text, kind);
      } catch (error) {
        setParseError(error instanceof Error ? error.message : "Could not read this PDF.");
      } finally {
        setBusy(false);
      }
      return;
    }
    if (file.name.toLowerCase().endsWith(".xlsx") || file.name.toLowerCase().endsWith(".xls")) {
      const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Row>(sheet, { defval: "" });
      if (kind === "questions") setQuestionRows(rows);
      else setAnswerRows(rows);
      if (kind === "questions") setQuestionRaw(`${rows.length} Excel rows loaded`);
      else setAnswerRaw(`${rows.length} Excel rows loaded`);
      setParseError(null);
      setResult(null);
      setValidated(false);
      return;
    }
    parse(await file.text(), kind);
  };

  const send = async (dryRun: boolean) => {
    if (!subject) {
      setParseError("Choose the subject before validating or importing.");
      return;
    }
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows,
          dryRun,
        }),
      });
      const json = (await res.json()) as Result & { error?: string };
      if (json.error) {
        setParseError(json.error);
      } else {
        setResult(json);
        setValidated(dryRun && !json.errors.length);
        if (!dryRun && json.inserted) {
          setTimeout(() => router.push("/admin/questions?created=1"), 1200);
        }
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div className="space-y-5">
        <Card>
          <CardHeader>
            <CardTitle>1. Choose subject and exam</CardTitle>
            <p className="mt-1 text-sm text-ink-500">
              These values are applied to every question in this import.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Subject" htmlFor="import-subject">
                <Select id="import-subject" value={subject} onChange={(event) => setSubject(event.target.value)}>
                  <option value="">Choose a subject</option>
                  {[...new Set(Object.values(SUBJECTS_BY_EXAM).flat())].sort().map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Exam" htmlFor="import-exam">
                <Select id="import-exam" value={exam} onChange={(event) => setExam(event.target.value as Exam)}>
                  {EXAMS.map((option) => <option key={option} value={option}>{option}</option>)}
                </Select>
              </Field>
              <Field label="Year" htmlFor="import-year">
                <input
                  id="import-year"
                  type="number"
                  min={1900}
                  max={new Date().getFullYear() + 1}
                  value={questionYear}
                  onChange={(event) => setQuestionYear(event.target.value)}
                  placeholder="2025"
                  className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
                />
              </Field>
            </div>

            <div className="rounded-xl bg-brand-50 px-3.5 py-3 text-sm text-brand-900">
              <strong>2. Paste CSV for {subject || "your selected subject"}</strong>
              <p className="mt-1 text-xs text-brand-700">
                PDF, CSV, Excel, JSON, or pasted text are supported. For CSV/Excel use question_text and
                option columns. For PDF, extracted text appears below for you to review and format.
              </p>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
              <ImportInput title="3. Questions" raw={questionRaw} fileRef={questionFileRef} onText={(text) => parse(text, "questions")} onFile={(file) => void onFile(file, "questions")} accept=".csv,.xlsx,.xls,.pdf,.json,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json" placeholder="question_text,option_a,option_b,option_c,option_d,topic\nWhat is 2 + 2?,3,4,5,6,Algebra" />
              <ImportInput title="4. Answers" raw={answerRaw} fileRef={answerFileRef} onText={(text) => parse(text, "answers")} onFile={(file) => void onFile(file, "answers")} accept=".csv,.xlsx,.xls,.pdf,.json,text/csv,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/json" placeholder="answer\nB" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Answer year" htmlFor="answer-year">
                <input id="answer-year" type="number" min={1900} max={new Date().getFullYear() + 1} value={answerYear} onChange={(event) => setAnswerYear(event.target.value)} placeholder="2025" className="flex h-11 w-full rounded-xl border border-ink-200 bg-white px-3 text-sm text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" />
              </Field>
              <p className="self-end text-xs leading-relaxed text-ink-500">Answers are matched to questions by row number. Question year and answer year are shown in the preview.</p>
            </div>

            {parseError && <Alert>{parseError}</Alert>}

            {rows.length > 0 && !parseError && (
              <Alert tone="info">
                Matched <strong>{rows.length}</strong> question{rows.length === 1 ? "" : "s"} with answers by row
                order. Click <strong>Validate</strong> to check every question before saving it.
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => send(true)} disabled={!rows.length || !subject || busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Validate
              </Button>
              <Button type="button" onClick={() => send(false)} disabled={!rows.length || !subject || !validated || busy}>
                <Upload className="size-4" />
                Import {rows.length || ""} question{rows.length === 1 ? "" : "s"}
              </Button>
            </div>

            {result && (
              <div className="space-y-3">
                {typeof result.inserted === "number" && (
                  <Alert tone="success">
                    <strong>{result.inserted}</strong> question{result.inserted === 1 ? "" : "s"} imported
                    successfully. Redirecting…
                  </Alert>
                )}
                {typeof result.wouldInsert === "number" && (
                  <Alert tone="info">
                    <strong>{result.wouldInsert}</strong> row{result.wouldInsert === 1 ? "" : "s"} passed
                    validation and will be imported.
                  </Alert>
                )}
                {result.errors.length > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5">
                    <p className="flex items-center gap-2 text-sm font-semibold text-amber-900">
                      <AlertTriangle className="size-4" />
                      {result.errors.length} row{result.errors.length === 1 ? "" : "s"} skipped
                    </p>
                    <ul className="mt-2 max-h-48 space-y-1 overflow-y-auto text-[12px] text-amber-800">
                      {result.errors.slice(0, 50).map((e) => (
                        <li key={e.index}>
                          Row {e.index}: {e.error}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </CardBody>
        </Card>

        {rows.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Preview (first 8 rows)</CardTitle>
            </CardHeader>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-[12px]">
                <thead className="border-b border-ink-200 bg-ink-50 uppercase tracking-wide text-ink-500">
                  <tr>
                    {["exam", "subject", "topic", "question", "answer", "question year", "answer year"].map((h) => (
                      <th key={h} className="px-3 py-2 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-100">
                  {rows.slice(0, 8).map((r, i) => (
                    <tr key={i}>
                      <td className="px-3 py-2">{String(r.exam ?? "—")}</td>
                      <td className="px-3 py-2">{String(r.subject ?? "—")}</td>
                      <td className="px-3 py-2">{String(r.topic ?? "—")}</td>
                      <td className="max-w-xs truncate px-3 py-2">{String(r.question_text ?? r.question ?? "—")}</td>
                      <td className="px-3 py-2 font-bold">{String(r.correct_answer ?? r.answer ?? "—")}</td>
                      <td className="px-3 py-2">{questionYear || "—"}</td>
                      <td className="px-3 py-2">{answerYear || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </div>

      <Card className="lg:sticky lg:top-6">
        <CardHeader>
          <CardTitle>Accepted format</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4 text-[13px] leading-relaxed text-ink-600">
          <div>
            <p className="font-semibold text-ink-900">Required columns</p>
            <ul className="mt-1.5 list-disc space-y-1 pl-4">
              <li>
                Choose the exam above — it is added to every imported row
              </li>
              <li>
                Choose the subject above — it is added to every imported row
              </li>
              <li>
                <code className="font-mono text-[12px]">question_text</code>
              </li>
              <li>
                <code className="font-mono text-[12px]">option_a … option_e</code> (or a single{" "}
                <code className="font-mono text-[12px]">options</code> column separated by <code>|</code>)
              </li>
              <li>
                <code className="font-mono text-[12px]">correct_answer</code> — the letter A–E, or the exact
                option text
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-ink-900">Optional</p>
            <p className="mt-1">
              <code className="font-mono text-[12px]">topic</code>, <code className="font-mono text-[12px]">explanation</code>,{" "}
              <code className="font-mono text-[12px]">difficulty</code> (easy/medium/hard),{" "}
              <code className="font-mono text-[12px]">year</code>,{" "}
              <code className="font-mono text-[12px]">image_url</code>,{" "}
              <code className="font-mono text-[12px]">is_active</code>
            </p>
          </div>
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-[11px] font-bold uppercase tracking-wide text-ink-500">JSON example</p>
            <pre className="mt-2 overflow-x-auto font-mono text-[11px] leading-relaxed text-ink-700">{`[
  {
    "exam": "JAMB",
    "subject": "Physics",
    "topic": "Waves",
    "question_text": "v = f × ?",
    "options": ["λ", "T", "a", "m"],
    "correct_answer": "A",
    "explanation": "Wave speed = frequency × wavelength",
    "difficulty": "easy",
    "year": 2022
  }
]`}</pre>
          </div>
          <a
            href="/templates/questions-template.csv"
            download
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-brand-700 hover:underline"
          >
            <FileUp className="size-4" />
            Download CSV template
          </a>
          <p className="text-[12px] text-ink-500">
            Tip: keep topic names consistent (e.g. always &ldquo;Quadratic Equations&rdquo;). The AI report and
            textbook matcher group by exactly this string.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}

function ImportInput({
  title,
  raw,
  fileRef,
  onText,
  onFile,
  accept,
  placeholder,
}: {
  title: string;
  raw: string;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onText: (text: string) => void;
  onFile: (file: File) => void;
  accept: string;
  placeholder: string;
}) {
  return (
    <div className="space-y-3">
                <p className="text-sm font-bold text-ink-900">{title}</p>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        className="block w-full rounded-xl border border-dashed border-ink-300 bg-ink-50/60 p-3 text-xs text-ink-600"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) onFile(file);
        }}
      />
      <Textarea value={raw} onChange={(event) => onText(event.target.value)} placeholder={placeholder} className="min-h-48 font-mono text-[12px]" />
    </div>
  );
}
