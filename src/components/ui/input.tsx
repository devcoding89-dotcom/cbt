import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase =
  "w-full rounded-xl border border-ink-200 bg-white px-3.5 text-sm text-ink-900 placeholder:text-ink-400 " +
  "transition-colors focus:border-brand-500 focus:outline-none focus:ring-4 focus:ring-brand-500/10 " +
  "disabled:bg-ink-50 disabled:text-ink-400";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(fieldBase, "h-11", className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(fieldBase, "min-h-24 py-2.5 leading-relaxed", className)} {...props} />;
}

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(fieldBase, "h-11 appearance-none bg-no-repeat pr-9", className)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23687695' stroke-width='2.5' stroke-linecap='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
        backgroundPosition: "right 0.75rem center",
      }}
      {...props}
    >
      {children}
    </select>
  );
}

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label className={cn("mb-1.5 block text-sm font-medium text-ink-800", className)} {...props} />;
}

export function Field({
  label,
  hint,
  error,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs text-ink-500">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
    </div>
  );
}

export function Checkbox({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="checkbox"
      className={cn(
        "size-4.5 shrink-0 cursor-pointer rounded-md border-ink-300 text-brand-600 accent-brand-600 focus:ring-brand-500",
        className,
      )}
      {...props}
    />
  );
}

export function Alert({
  tone = "danger",
  children,
  className,
}: {
  tone?: "danger" | "success" | "info" | "warning";
  children: React.ReactNode;
  className?: string;
}) {
  const tones = {
    danger: "bg-rose-50 text-rose-800 ring-rose-600/15",
    success: "bg-emerald-50 text-emerald-800 ring-emerald-600/15",
    info: "bg-brand-50 text-brand-800 ring-brand-600/15",
    warning: "bg-amber-50 text-amber-900 ring-amber-600/20",
  };
  return (
    <div className={cn("rounded-xl px-3.5 py-3 text-sm ring-1 ring-inset", tones[tone], className)}>
      {children}
    </div>
  );
}
