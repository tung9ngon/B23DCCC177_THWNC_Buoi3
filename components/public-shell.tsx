import { SessionProvider } from "next-auth/react";
import { SiteHeader } from "./site-header";

export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <SiteHeader />
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
      <footer className="border-t border-slate-200 py-6 text-center text-sm text-slate-500">
        Class Deadline Hub · B23DCCC177 · LTWNC
      </footer>
    </SessionProvider>
  );
}
