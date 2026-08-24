"use client";

import { useActionState } from "react";
import { Save } from "lucide-react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, Checkbox, Field, Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { saveSettingsAction, type AdminState } from "@/app/admin/actions";
import type { AppSettings } from "@/lib/types";

export function SettingsForm({ settings }: { settings: AppSettings }) {
  const [state, action, pending] = useActionState(saveSettingsAction, {} as AdminState);
  return (
    <form action={action} className="space-y-5">
      {state.error && <Alert>{state.error}</Alert>}
      {state.ok && <Alert tone="success">{state.ok}</Alert>}

      <Card>
        <CardHeader>
          <CardTitle>Platform</CardTitle>
        </CardHeader>
        <CardBody className="grid gap-4 sm:grid-cols-2">
          <Field label="Site name" htmlFor="site_name">
            <Input id="site_name" name="site_name" defaultValue={settings.site_name} />
          </Field>
          <Field label="Subscription price (₦)" htmlFor="price_naira" hint="Charged per 30 days.">
            <Input
              id="price_naira"
              name="price_naira"
              type="number"
              min={100}
              step={50}
              defaultValue={settings.price_kobo / 100}
            />
          </Field>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Access &amp; AI</CardTitle>
        </CardHeader>
        <CardBody className="space-y-4">
          <label className="flex items-start gap-3 rounded-xl border border-ink-200 p-3.5">
            <Checkbox name="paywall_enabled" defaultChecked={settings.paywall_enabled} className="mt-0.5" />
            <span>
              <span className="block text-sm font-semibold text-ink-900">Require a subscription to practise</span>
              <span className="block text-[12px] text-ink-500">
                Turn this off to open the whole platform for a launch promo or beta cohort.
              </span>
            </span>
          </label>

          <Field
            label="Weakness threshold (%)"
            htmlFor="weakness_threshold"
            hint="A topic is flagged as weak when the student's weakness score is at or above this value. 50 is a good default."
          >
            <Input
              id="weakness_threshold"
              name="weakness_threshold"
              type="number"
              min={20}
              max={90}
              defaultValue={settings.weakness_threshold}
            />
          </Field>

          <Field
            label="Free questions per day"
            htmlFor="free_questions_per_day"
            hint="Reserved for a future freemium tier — currently informational."
          >
            <Input
              id="free_questions_per_day"
              name="free_questions_per_day"
              type="number"
              min={0}
              defaultValue={settings.free_questions_per_day}
            />
          </Field>
        </CardBody>
      </Card>

      <Button type="submit" loading={pending}>
        <Save className="size-4" />
        Save settings
      </Button>
    </form>
  );
}
