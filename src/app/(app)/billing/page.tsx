import { redirect } from "next/navigation";
import { CheckCircle2, Info, ShieldCheck } from "lucide-react";
import { getCurrentUser, isSubscribed } from "@/lib/auth";
import { repo } from "@/lib/db";
import { paystackEnabled } from "@/lib/paystack";
import { Badge, Card, CardBody, CardHeader, CardTitle, Stat } from "@/components/ui/card";
import { Alert } from "@/components/ui/input";
import { CheckoutButton } from "@/components/app/checkout-button";
import { formatDate, formatDateTime, formatNaira } from "@/lib/utils";

export const metadata = { title: "Subscription" };
export const dynamic = "force-dynamic";

const perks = [
  "Unlimited timed CBT sessions",
  "Every subject, topic and past question",
  "AI weakness report after each session",
  "Full digital textbook library",
  "Progress dashboard and study plan",
  "30 days access · no auto-renewal",
];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; reason?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const sp = await searchParams;

  const [settings, payments] = await Promise.all([repo.getSettings(), repo.listPayments(user.id, 50)]);
  const active = isSubscribed(user);
  const price = formatNaira(settings.price_kobo);
  const daysLeft =
    user.subscription_expires_at && active
      ? Math.max(0, Math.ceil((new Date(user.subscription_expires_at).getTime() - Date.now()) / 864e5))
      : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950 sm:text-3xl">Subscription</h1>
        <p className="mt-1 text-sm text-ink-500">One flat plan. Pay only for the months you are studying.</p>
      </div>

      {sp.status === "success" && (
        <Alert tone="success">
          <strong>Payment confirmed.</strong> Your subscription is now active — go ahead and start a session.
        </Alert>
      )}
      {sp.status === "failed" && <Alert>That payment did not go through. You have not been charged.</Alert>}
      {sp.reason === "practice" && !active && (
        <Alert tone="warning">A subscription is required to start a practice session.</Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat
          label="Status"
          value={active ? "Active" : user.subscription_status === "expired" ? "Expired" : "Inactive"}
          tone={active ? "success" : "warning"}
          sub={active ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left` : "Not subscribed"}
        />
        <Stat label="Expires" value={active ? formatDate(user.subscription_expires_at) : "—"} tone="info" />
        <Stat label="Plan price" value={price} sub="per 30 days" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <Card className="border-2 border-brand-600">
          <CardBody className="pt-6">
            <Badge tone="brand">Monthly plan</Badge>
            <p className="mt-3 flex items-end gap-1.5">
              <span className="text-4xl font-extrabold tracking-tight text-ink-950">{price}</span>
              <span className="pb-1 text-sm font-medium text-ink-500">/ 30 days</span>
            </p>
            <ul className="mt-5 space-y-2.5">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-[14px] text-ink-700">
                  <CheckCircle2 className="mt-0.5 size-4.5 shrink-0 text-emerald-500" />
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <CheckoutButton label={active ? "Extend by 30 days" : "Subscribe now"} price={price} />
            </div>
            <p className="mt-3 flex items-center justify-center gap-1.5 text-[12px] text-ink-400">
              <ShieldCheck className="size-3.5" />
              Card · Bank transfer · USSD — secured by Paystack
            </p>
            {!paystackEnabled && (
              <div className="mt-4 rounded-xl bg-amber-50 px-3.5 py-3 text-[12px] leading-relaxed text-amber-900">
                <Info className="mr-1.5 inline size-3.5" />
                <strong>Simulation mode:</strong> no Paystack keys configured, so checkout uses a built-in mock
                page. Add <code className="font-mono">PAYSTACK_SECRET_KEY</code> to go live.
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payment history</CardTitle>
          </CardHeader>
          <CardBody>
            {payments.length === 0 ? (
              <p className="py-6 text-center text-sm text-ink-500">No payments yet.</p>
            ) : (
              <div className="divide-y divide-ink-100">
                {payments.map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-900">{formatNaira(p.amount)}</p>
                      <p className="truncate text-[11px] text-ink-500">
                        {formatDateTime(p.paid_at ?? p.created_at)} · {p.channel ?? "—"} ·{" "}
                        <span className="font-mono">{p.paystack_ref.slice(0, 18)}</span>
                      </p>
                    </div>
                    <Badge tone={p.status === "success" ? "success" : p.status === "pending" ? "warning" : "danger"}>
                      {p.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
