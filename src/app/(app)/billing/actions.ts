"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { repo } from "@/lib/db";
import { activateSubscription, initializeTransaction } from "@/lib/paystack";

export interface BillingState {
  error?: string;
}

function originFromHeaders(h: Headers) {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (envUrl) return envUrl.replace(/\/$/, "");
  const proto = h.get("x-forwarded-proto") ?? "http";
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  return `${proto}://${host}`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function startCheckoutAction(_prev: BillingState, _formData: FormData): Promise<BillingState> {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");

  const settings = await repo.getSettings();
  const origin = originFromHeaders(await headers());

  const res = await initializeTransaction({
    userId: user.id,
    email: user.email,
    amountKobo: settings.price_kobo,
    origin,
  });

  if (!res.ok || !res.authorization_url) {
    return { error: res.error ?? "Could not start checkout. Please try again." };
  }
  redirect(res.authorization_url);
}

/** Used by the simulated checkout page when Paystack keys are not configured. */
export async function completeSimulatedPaymentAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  const reference = String(formData.get("reference") ?? "");
  const payment = await repo.getPaymentByRef(reference);
  if (!payment || payment.user_id !== user.id) redirect("/billing?status=failed");
  await activateSubscription(reference, { channel: "simulated", transactionId: "sim-" + Date.now() });
  redirect(`/payment/callback?reference=${encodeURIComponent(reference)}`);
}
