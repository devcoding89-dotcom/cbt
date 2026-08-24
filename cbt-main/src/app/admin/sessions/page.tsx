import Link from "next/link";
import { repo } from "@/lib/db";
import { Badge, Card, Stat } from "@/components/ui/card";
import { formatDateTime, formatDuration, scoreColor } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminSessionsPage() {
  const [sessions, profiles] = await Promise.all([repo.listAllSessions(300), repo.listProfiles({ limit: 500 })]);
  const byId = new Map(profiles.map((p) => [p.id, p]));
  const completed = sessions.filter((s) => s.status === "completed");
  const avg = completed.length
    ? Math.round(completed.reduce((a, s) => a + (s.score_percent ?? 0), 0) / completed.length)
    : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Sessions</h1>
        <p className="mt-1 text-sm text-ink-500">Every practice session run on the platform.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Total" value={sessions.length} />
        <Stat label="Completed" value={completed.length} tone="success" />
        <Stat label="In progress" value={sessions.filter((s) => s.status === "in_progress").length} tone="warning" />
        <Stat label="Average score" value={`${avg}%`} tone="info" />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-[11px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Exam / subjects</th>
                <th className="px-4 py-3 font-semibold">Mode</th>
                <th className="px-4 py-3 font-semibold">Questions</th>
                <th className="px-4 py-3 font-semibold">Score</th>
                <th className="px-4 py-3 font-semibold">Time</th>
                <th className="px-4 py-3 font-semibold">Started</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {sessions.map((s) => {
                const owner = byId.get(s.user_id);
                return (
                  <tr key={s.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3">
                      <Link href={`/reports/${s.id}`} className="font-medium text-ink-900 hover:text-brand-700">
                        {owner?.full_name ?? owner?.email ?? "Unknown"}
                      </Link>
                    </td>
                    <td className="max-w-xs px-4 py-3">
                      <Badge tone="brand">{s.exam}</Badge>
                      <p className="mt-1 truncate text-[11px] text-ink-500">{s.subjects.join(", ")}</p>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">{s.mode}</td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">{s.total_questions}</td>
                    <td className="px-4 py-3">
                      {s.status === "completed" ? (
                        <span className={`font-bold ${scoreColor(s.score_percent)}`}>{s.score_percent}%</span>
                      ) : (
                        <Badge tone="warning">{s.status}</Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[12px] text-ink-600">{formatDuration(s.time_taken_seconds)}</td>
                    <td className="px-4 py-3 text-[12px] text-ink-500">{formatDateTime(s.started_at)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {sessions.length === 0 && <p className="py-12 text-center text-sm text-ink-500">No sessions yet.</p>}
      </Card>
    </div>
  );
}
