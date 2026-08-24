import { repo } from "@/lib/db";
import { paystackEnabled } from "@/lib/paystack";
import { Badge, Card, Stat } from "@/components/ui/card";
import { Alert } from "@/components/ui/input";
import { formatDateTime, formatNaira } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const [payments, profiles] = await Promise.all([repo.listPayments(undefined, 500), repo.listProfiles({ limit: 500 })]);
  const byId = new Map(profiles.map((p) => [p.id, p]));
  const success = payments.filter((p) => p.status === "success");
  const revenue = success.reduce((a, p) => a + p.amount, 0);
  const thisMonth = success.filter((p) => new Date(p.paid_at ?? p.created_at).getMonth() === new Date().getMonth());

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-950">Payments</h1>
        <p className="mt-1 text-sm text-ink-500">All subscription transactions.</p>
      </div>

      {!paystackEnabled && (
        <Alert tone="warning">
          Paystack keys are not configured, so checkout runs in simulation mode. Add{" "}
          <code className="font-mono">PAYSTACK_SECRET_KEY</code> and{" "}
          <code className="font-mono">NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY</code> to accept live payments, and point
          your Paystack webhook at <code className="font-mono">/api/webhooks/paystack</code>.
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat label="Gross revenue" value={formatNaira(revenue)} tone="success" />
        <Stat label="Successful" value={success.length} />
        <Stat label="This month" value={formatNaira(thisMonth.reduce((a, p) => a + p.amount, 0))} tone="info" />
        <Stat label="Pending / failed" value={payments.length - success.length} tone="warning" />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-[11px] uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Reference</th>
                <th className="px-4 py-3 font-semibold">Student</th>
                <th className="px-4 py-3 font-semibold">Amount</th>
                <th className="px-4 py-3 font-semibold">Channel</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {payments.map((p) => (
                <tr key={p.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3 font-mono text-[11px] text-ink-600">{p.paystack_ref}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-ink-900">{byId.get(p.user_id)?.full_name ?? "—"}</p>
                    <p className="text-[11px] text-ink-500">{p.email}</p>
                  </td>
                  <td className="px-4 py-3 font-semibold text-ink-900">{formatNaira(p.amount)}</td>
                  <td className="px-4 py-3 text-[12px] text-ink-600">{p.channel ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge tone={p.status === "success" ? "success" : p.status === "pending" ? "warning" : "danger"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-ink-500">{formatDateTime(p.paid_at ?? p.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {payments.length === 0 && <p className="py-12 text-center text-sm text-ink-500">No payments yet.</p>}
      </Card>
    </div>
  );
}
