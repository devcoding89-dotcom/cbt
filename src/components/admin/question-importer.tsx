"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, CheckCircle2, FileUp, Loader2, Upload } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { csvToObjects } from "@/lib/csv";

type Row = Record<string, unknown>;
interface Result {
  inserted?: number;
  wouldInsert?: number;
  errors: { index: number; error: string }[];
}

export function QuestionImporter() {
  const router = useRouter();
  const [raw, setRaw] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const parse = (text: string) => {
    setRaw(text);
    setResult(null);
    const trimmed = text.trim();
    if (!trimmed) {
      setRows([]);
      setParseError(null);
      return;
    }
    try {
      if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
        const json = JSON.parse(trimmed) as Row | Row[];
        const arr = Array.isArray(json) ? json : [json];
        setRows(arr);
        setParseError(null);
      } else {
        const objs = csvToObjects(trimmed);
        if (!objs.length) throw new Error("No data rows found — check that the first line is a header.");
        setRows(objs);
        setParseError(null);
      }
    } catch (e) {
      setRows([]);
      setParseError(e instanceof Error ? e.message : "Could not parse the input.");
    }
  };

  const onFile = async (file: File) => {
    const text = await file.text();
    parse(text);
  };

  const send = async (dryRun: boolean) => {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch("/api/admin/questions/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rows, dryRun }),
      });
      const json = (await res.json()) as Result & { error?: string };
      if (json.error) {
        setParseError(json.error);
      } else {
        setResult(json);
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
            <CardTitle>Paste or upload</CardTitle>
            <p className="mt-1 text-sm text-ink-500">
              Accepts CSV (with a header row) or a JSON array. Everything is validated before anything is saved.
            </p>
          </CardHeader>
          <CardBody className="space-y-4">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const f = e.dataTransfer.files?.[0];
                if (f) void onFile(f);
              }}
              className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-200 bg-ink-50/50 px-6 py-8 text-center"
            >
              <FileUp className="size-8 text-ink-300" />
              <p className="mt-2 text-sm font-semibold text-ink-800">Drop a .csv or .json file here</p>
              <p className="text-xs text-ink-500">or</p>
              <input
                ref={fileRef}
                type="file"
                accept=".csv,.json,text/csv,application/json"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) void onFile(f);
                }}
              />
              <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => fileRef.current?.click()}>
                Choose file
              </Button>
            </div>

            <Textarea
              value={raw}
              onChange={(e) => parse(e.target.value)}
              placeholder={`exam,subject,topic,question_text,option_a,option_b,option_c,option_d,correct_answer,explanation,difficulty,year\nJAMB,Mathematics,Algebra,"Solve x + 3 = 7","2","3","4","5",C,"x = 7 − 3 = 4",easy,2023`}
              className="min-h-56 font-mono text-[12px]"
            />

            {parseError && <Alert>{parseError}</Alert>}

            {rows.length > 0 && !parseError && (
              <Alert tone="info">
                Parsed <strong>{rows.length}</strong> row{rows.length === 1 ? "" : "s"}. Run a validation check
                before importing.
              </Alert>
            )}

            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" onClick={() => send(true)} disabled={!rows.length || busy}>
                {busy ? <Loader2 className="size-4 animate-spin" /> : <CheckCircle2 className="size-4" />}
                Validate
              </Button>
              <Button type="button" onClick={() => send(false)} disabled={!rows.length || busy}>
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
                    {["exam", "subject", "topic", "question", "answer"].map((h) => (
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
                <code className="font-mono text-[12px]">exam</code> — JAMB, WAEC or NECO
              </li>
              <li>
                <code className="font-mono text-[12px]">subject</code>, <code className="font-mono text-[12px]">topic</code>
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
              <code className="font-mono text-[12px]">explanation</code>,{" "}
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
