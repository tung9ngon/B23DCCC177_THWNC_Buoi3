import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import { SiteHeader } from "@/components/site-header";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </SessionProvider>
  );
}
