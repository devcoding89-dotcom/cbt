import { getCurrentUser } from "@/lib/auth";
import { MarketingNav } from "@/components/marketing/navbar";
import { MarketingFooter } from "@/components/marketing/footer";

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  return (
    <div className="flex min-h-dvh flex-col bg-white">
      <MarketingNav signedIn={Boolean(user)} />
      <main className="flex-1">{children}</main>
      <MarketingFooter />
    </div>
  );
}
