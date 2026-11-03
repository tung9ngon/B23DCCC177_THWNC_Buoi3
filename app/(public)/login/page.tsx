import type { Metadata } from "next";
import { githubEnabled } from "@/auth";
import { githubLoginAction } from "@/lib/actions";
import { LoginForm } from "./login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string }> }) {
  const callbackUrl = (await searchParams).callbackUrl ?? "/dashboard";

  return (
    <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-8">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>
      <p className="mt-1 text-sm text-slate-500">Dùng tài khoản lớp để đánh dấu deadline đã xong.</p>
      <LoginForm callbackUrl={callbackUrl} />
      {githubEnabled && (
        <form action={githubLoginAction} className="mt-3">
          <input type="hidden" name="callbackUrl" value={callbackUrl} />
          <button className="w-full rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">
            Đăng nhập bằng GitHub
          </button>
        </form>
      )}
    </div>
  );
}
