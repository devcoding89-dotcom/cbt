import { cookies, headers } from "next/headers";
import { getCurrentUser } from "@/lib/auth";
import { usingSupabase } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata = { title: "Session diagnostics" };

export default async function DebugPage() {
  const jar = await cookies();
  const h = await headers();
  const raw = jar.get("prepai_session")?.value;
  const user = await getCurrentUser();

  const rows: [string, string][] = [
    ["Signed in?", user ? `YES — ${user.email} (${user.role})` : "NO"],
    ["Cookie received by server", raw ? `yes (${raw.length} chars)` : "NO — browser is not sending it"],
    ["x-forwarded-proto", h.get("x-forwarded-proto") ?? "(none)"],
    ["Host", h.get("x-forwarded-host") ?? h.get("host") ?? "(none)"],
    ["Data source", usingSupabase ? "Supabase" : "local JSON"],
    ["Target exam", user?.target_exam ?? "—"],
  ];

  return (
    <div className="container-x max-w-2xl py-16">
      <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Session diagnostics</h1>
      <p className="mt-2 text-sm text-ink-500">
        Screenshot this page and send it over if login is not sticking.
      </p>

      <div
        className={`mt-6 rounded-2xl p-5 text-white ${user ? "bg-emerald-600" : "bg-rose-600"}`}
      >
        <p className="text-lg font-bold">{user ? "✅ You ARE logged in" : "❌ You are NOT logged in"}</p>
        <p className="mt-1 text-sm opacity-90">
          {user
            ? "Exam cards will take you straight to practice."
            : "The browser is not storing or returning the session cookie, so every page treats you as a guest."}
        </p>
      </div>

      <dl className="mt-6 divide-y divide-ink-100 rounded-2xl border border-ink-200 bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-start justify-between gap-4 px-5 py-3">
            <dt className="text-sm text-ink-500">{k}</dt>
            <dd className="text-right text-sm font-semibold text-ink-900">{v}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-2xl border border-ink-200 bg-ink-50 p-5 text-sm leading-relaxed text-ink-600">
        <p className="font-semibold text-ink-900">If it says NOT logged in after signing in:</p>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Open this preview in its own browser tab instead of the embedded panel.</li>
          <li>Log in again, then come back to /debug.</li>
        </ol>
        <p className="mt-3">
          Browsers block cookies for sites shown inside another site&apos;s frame. In a normal tab —
          and on your real domain after deploying — this restriction does not apply.
        </p>
      </div>
    </div>
  );
}
