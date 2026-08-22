import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { usingSupabase } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { Logo } from "@/components/logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login?next=/admin");
  if (user.role !== "admin") redirect("/dashboard");

  return (
    <div className="min-h-dvh bg-ink-50/60">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-ink-200 bg-ink-950 px-3 py-5 lg:flex">
          <div className="px-2 [&_span]:text-white">
            <Logo />
          </div>
          <p className="mt-1 px-2 text-[11px] font-semibold uppercase tracking-wider text-ink-400">
            Admin console
          </p>
          <AdminNav />
          <div className="mt-auto space-y-2 px-2 pt-4">
            <p className="rounded-lg bg-white/5 px-2.5 py-2 text-[11px] text-ink-300">
              Data source:{" "}
              <span className="font-semibold text-white">{usingSupabase ? "Supabase" : "Local JSON"}</span>
            </p>
            <Link href="/dashboard" className="block px-2.5 text-[12px] font-medium text-ink-300 hover:text-white">
              ← Back to student app
            </Link>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-60">
          <div className="lg:hidden">
            <div className="flex items-center justify-between border-b border-ink-200 bg-ink-950 px-4 py-3">
              <div className="[&_span]:text-white">
                <Logo />
              </div>
              <Link href="/dashboard" className="text-[12px] font-medium text-ink-300">
                Student app
              </Link>
            </div>
            <div className="hide-scrollbar overflow-x-auto border-b border-ink-200 bg-ink-900 px-2">
              <AdminNav horizontal />
            </div>
          </div>
          <main className="px-4 py-6 sm:px-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
