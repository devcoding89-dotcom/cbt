import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";
import { activateSubscription, verifyTransaction } from "@/lib/paystack";

export const dynamic = "force-dynamic";

/** Paystack redirects here after checkout. We verify server-side, then bounce. */
export default async function PaymentCallbackPage({
  searchParams,
}: {
  searchParams: Promise<{ reference?: string; trxref?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const sp = await searchParams;
  const reference = sp.reference || sp.trxref;
  if (!reference) redirect("/billing?status=failed");

  const payment = await repo.getPaymentByRef(reference);
  if (!payment || payment.user_id !== user.id) redirect("/billing?status=failed");

  if (payment.status !== "success") {
    const verified = await verifyTransaction(reference);
    if (verified.ok && verified.status === "success") {
      await activateSubscription(reference, { transactionId: verified.id, channel: verified.channel });
    } else {
      await repo.updatePaymentByRef(reference, { status: "failed" });
      redirect("/billing?status=failed");
    }
  }

  redirect("/billing?status=success");
}
