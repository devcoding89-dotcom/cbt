import type { ReactNode } from "react";

export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="container-x max-w-3xl py-16">
      <p className="text-[12px] font-bold uppercase tracking-[0.18em] text-brand-600">Legal</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-950 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-ink-500">Last updated {updated}</p>
      <div className="reader mt-8">{children}</div>
    </div>
  );
}
