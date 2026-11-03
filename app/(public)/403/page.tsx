import Link from "next/link";

export const metadata = { title: "Không có quyền", robots: { index: false } };

export default function ForbiddenPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-6xl font-bold text-red-600">403</p>
      <h1 className="mt-4 text-2xl font-bold">Bạn không có quyền truy cập</h1>
      <p className="mt-2 text-slate-600">Trang này chỉ dành cho lớp trưởng (admin).</p>
      <Link href="/dashboard" className="mt-6 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">
        Về Dashboard
      </Link>
    </div>
  );
}
