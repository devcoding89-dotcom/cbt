import { repo, usingSupabase } from "@/lib/db";
import { paystackEnabled } from "@/lib/paystack";
import { SettingsForm } from "@/components/admin/settings-form";
import { Card, CardBody, CardHeader, CardTitle, Badge } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await repo.getSettings();

  const env = [
    { key: "NEXT_PUBLIC_SUPABASE_URL", set: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL), note: "Supabase project URL" },
    { key: "SUPABASE_SERVICE_ROLE_KEY", set: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY), note: "Server-side Supabase access" },
    { key: "PAYSTACK_SECRET_KEY", set: paystackEnabled, note: "Live payments" },
    { key: "AUTH_SECRET", set: Boolean(process.env.AUTH_SECRET), note: "Session cookie signing" },
    { key: "NEXT_PUBLIC_SITE_URL", set: Boolean(process.env.NEXT_PUBLIC_SITE_URL), note: "Callback + OG URLs" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Pricing, access rules and the AI weakness threshold.</p>
      </div>

      <SettingsForm settings={settings} />

      <Card>
        <CardHeader>
          <CardTitle>Environment</CardTitle>
          <p className="mt-1 text-sm text-ink-500">
            Currently storing data in <strong>{usingSupabase ? "Supabase" : "the local JSON database"}</strong>.
          </p>
        </CardHeader>
        <CardBody className="space-y-2">
          {env.map((e) => (
            <div key={e.key} className="flex items-center justify-between gap-3 border-b border-ink-100 pb-2 last:border-0">
              <div className="min-w-0">
                <p className="truncate font-mono text-[12px] text-ink-800">{e.key}</p>
                <p className="text-[11px] text-ink-500">{e.note}</p>
              </div>
              <Badge tone={e.set ? "success" : "neutral"}>{e.set ? "set" : "not set"}</Badge>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
