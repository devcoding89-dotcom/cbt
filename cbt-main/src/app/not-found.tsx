import Link from "next/link";
import { buttonClass } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="grid min-h-dvh place-items-center bg-ink-50 px-4">
      <div className="text-center">
        <p className="text-[80px] font-extrabold leading-none tracking-tight text-brand-600">404</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-950">Page not found</h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-500">
          The page you are looking for does not exist, or you may need to log in first.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/" className={buttonClass("primary", "md")}>
            Back to home
          </Link>
          <Link href="/dashboard" className={buttonClass("outline", "md")}>
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
