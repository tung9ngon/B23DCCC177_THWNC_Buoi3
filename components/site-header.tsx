import Image from "next/image";
import Link from "next/link";
import { UserMenu } from "./user-menu";

export function SiteHeader() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image src="/images/logo.png" alt="" width={32} height={32} priority />
          Class Deadline Hub
        </Link>
        <nav className="flex items-center gap-5 text-sm font-medium text-slate-600">
          <Link href="/deadlines" className="hover:text-slate-900">Deadline</Link>
          <Link href="/dashboard" className="hover:text-slate-900">Dashboard</Link>
        </nav>
        <UserMenu />
      </div>
    </header>
  );
}
