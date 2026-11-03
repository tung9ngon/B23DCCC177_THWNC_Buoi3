"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ROLE_LABELS } from "@/lib/permissions";

// trang tĩnh không đọc session ở server được nên lấy ở client
export function UserMenu() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-32 animate-pulse rounded-lg bg-slate-200" aria-hidden />;
  }

  if (!session?.user) {
    return (
      <Link href="/login" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">
        Đăng nhập
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right leading-tight">
        <p className="text-sm font-semibold">{session.user.name}</p>
        <p className="text-xs text-slate-500">{ROLE_LABELS[session.user.role]}</p>
      </div>
      <button
        onClick={() => signOut({ redirectTo: "/" })}
        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-100"
      >
        Đăng xuất
      </button>
    </div>
  );
}
