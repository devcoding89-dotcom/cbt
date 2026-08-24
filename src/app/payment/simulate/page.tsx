import Link from "next/link";
import { redirect } from "next/navigation";
import { Building2, CreditCard, Landmark, Lock, Smartphone } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";
import { paystackEnabled } from "@/lib/paystack";
import { completeSimulatedPaymentAction } from "@/app/(app)/billing/actions";
import { Button, buttonClass } from "@/components/ui/button";
import { formatNaira } from "@/lib/utils";
import { Logo } from "@/components/logo";

export const metadata = { title: "Checkout" };
export const dynamic = "force-dynamic";

/**
 * Stand-in for the Paystack hosted checkout, used when no API keys are set so
 * the full pay → webhook → unlock flow can be exercised locally.
 */
export default async function SimulatePaymentPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string }>;
}) {
  if (paystackEnabled) redirect("/billing");
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const { reference } = await searchParams;
  const payment = reference ? await repo.getPaymentByRef(reference) : null;
  if (!payment || payment.user_id !== user.id) redirect("/billing?status=failed");

  return (
    <div className="grid min-h-dvh place-items-center bg-ink-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-5 flex justify-center">
          <Logo />
        </div>
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white card-shadow">
          <div className="flex items-center justify-between bg-emerald-600 px-5 py-3 text-white">
            <span className="text-sm font-bold">Paystack (simulated)</span>
            <Lock className="size-4" />
          </div>
          <div className="p-6">
            <p className="text-sm text-ink-500">Paying as</p>
            <p className="text-[15px] font-semibold text-ink-900">{user.email}</p>

            <div className="mt-5 rounded-xl bg-ink-50 p-4 text-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-400">Amount</p>
              <p className="mt-1 text-3xl font-extrabold tracking-tight text-ink-950">
                {formatNaira(payment.amount)}
              </p>
              <p className="mt-1 font-mono text-[11px] text-ink-400">{payment.paystack_ref}</p>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2">
              {[
                { icon: CreditCard, label: "Card" },
                { icon: Landmark, label: "Transfer" },
                { icon: Smartphone, label: "USSD" },
                { icon: Building2, label: "Bank" },
              ].map((m, i) => (
                <div
                  key={m.label}
                  className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-3 text-[11px] font-semibold ${
                    i === 0 ? "border-emerald-500 bg-emerald-50 text-emerald-700" : "border-ink-200 text-ink-500"
                  }`}
                >
                  <m.icon className="size-4" />
                  {m.label}
                </div>
              ))}
            </div>

            <form action={completeSimulatedPaymentAction} className="mt-6">
              <input type="hidden" name="reference" value={payment.paystack_ref} />
              <Button type="submit" variant="success" size="lg" className="w-full">
                Pay {formatNaira(payment.amount)}
              </Button>
            </form>

            <Link href="/billing?status=failed" className={buttonClass("ghost", "sm", "mt-2 w-full")}>
              Cancel payment
            </Link>

            <p className="mt-4 text-center text-[11px] leading-relaxed text-ink-400">
              This is a local simulation — no real money moves. Configure PAYSTACK_SECRET_KEY to use live
              Paystack checkout.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
