import { NextResponse } from "next/server";
import { activateSubscription, verifyWebhookSignature } from "@/lib/paystack";
import { repo } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const raw = await req.text();
  const signature = req.headers.get("x-paystack-signature");

  if (!verifyWebhookSignature(raw, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: {
    event?: string;
    data?: { reference?: string; channel?: string; id?: number; status?: string };
  };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const reference = payload.data?.reference;
  if (!reference) return NextResponse.json({ ok: true });

  if (payload.event === "charge.success" || payload.data?.status === "success") {
    await activateSubscription(reference, {
      transactionId: payload.data?.id ? String(payload.data.id) : null,
      channel: payload.data?.channel ?? null,
    });
  } else if (payload.event === "charge.failed") {
    await repo.updatePaymentByRef(reference, { status: "failed" });
  }

  return NextResponse.json({ ok: true });
}
