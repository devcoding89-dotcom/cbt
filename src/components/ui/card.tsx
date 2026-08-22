import * as React from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-2xl border border-ink-200/80 bg-white card-shadow", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pt-5 pb-3 sm:px-6 sm:pt-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-base font-semibold text-ink-950", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("mt-1 text-sm text-ink-500", className)} {...props} />;
}

export function CardBody({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />;
}

export function CardFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center gap-3 border-t border-ink-100 px-5 py-4 sm:px-6", className)}
      {...props}
    />
  );
}

type Tone = "brand" | "neutral" | "success" | "warning" | "danger" | "info";
const tones: Record<Tone, string> = {
  brand: "bg-brand-50 text-brand-700 ring-brand-600/15",
  neutral: "bg-ink-100 text-ink-700 ring-ink-500/15",
  success: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
  warning: "bg-amber-50 text-amber-700 ring-amber-600/20",
  danger: "bg-rose-50 text-rose-700 ring-rose-600/15",
  info: "bg-sky-50 text-sky-700 ring-sky-600/15",
};

export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1 ring-inset",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}

export function Stat({
  label,
  value,
  sub,
  icon,
  tone = "brand",
}: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: Tone;
}) {
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-400">{label}</p>
          <p className="mt-1.5 text-2xl font-bold tracking-tight text-ink-950 sm:text-[26px]">{value}</p>
          {sub && <p className="mt-1 truncate text-xs text-ink-500">{sub}</p>}
        </div>
        {icon && (
          <span className={cn("grid size-9 shrink-0 place-items-center rounded-xl ring-1 ring-inset", tones[tone])}>
            {icon}
          </span>
        )}
      </div>
    </Card>
  );
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/40 px-6 py-14 text-center">
      {icon && <div className="mb-3 grid size-12 place-items-center rounded-2xl bg-white text-brand-600 card-shadow">{icon}</div>}
      <p className="text-base font-semibold text-ink-900">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-ink-500">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ProgressBar({ value, className, tone }: { value: number; className?: string; tone?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-ink-100", className)}>
      <div
        className={cn("h-full rounded-full transition-all duration-500", tone ?? "bg-brand-600")}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
  );
}
