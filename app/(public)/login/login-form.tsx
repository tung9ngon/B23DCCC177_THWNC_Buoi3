"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { loginAction } from "@/lib/actions";

export function LoginForm({ callbackUrl }: { callbackUrl: string }) {
  const [{ error, redirectTo }, formAction, pending] = useActionState(loginAction, {});
  const { update } = useSession();
  const router = useRouter();
  const redirected = useRef(false);

  useEffect(() => {
    if (!redirectTo || redirected.current) return;
    redirected.current = true;
    update().then(() => router.replace(redirectTo));
  }, [redirectTo, update, router]);

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input type="hidden" name="callbackUrl" value={callbackUrl} />
      <label className="block text-sm font-medium">
        Email
        <input name="email" type="email" required autoComplete="email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      <label className="block text-sm font-medium">
        Mật khẩu
        <input name="password" type="password" required minLength={6} autoComplete="current-password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" />
      </label>
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
      <button disabled={pending} className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}
