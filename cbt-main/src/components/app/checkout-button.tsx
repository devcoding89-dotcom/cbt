"use client";

import { useActionState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/input";
import { startCheckoutAction, type BillingState } from "@/app/(app)/billing/actions";

export function CheckoutButton({ label, price }: { label: string; price: string }) {
  const [state, action, pending] = useActionState(startCheckoutAction, {} as BillingState);
  return (
    <form action={action} className="space-y-3">
      {state.error && <Alert>{state.error}</Alert>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? <Loader2 className="size-4 animate-spin" /> : <CreditCard className="size-4" />}
        {pending ? "Opening secure checkout…" : `${label} — ${price}`}
      </Button>
    </form>
  );
}
