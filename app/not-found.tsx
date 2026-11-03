import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export const metadata = { title: "Không tìm thấy", robots: { index: false } };

export default function NotFound() {
  return (
    <PublicShell>
      <div className="mx-auto max-w-md py-16 text-center">
        <p className="text-6xl font-bold text-red-600">404</p>
        <h1 className="mt-4 text-2xl font-bold">Không tìm thấy trang</h1>
        <p className="mt-2 text-slate-600">Deadline hoặc trang bạn tìm không tồn tại hoặc đã bị xoá.</p>
        <Link href="/deadlines" className="mt-6 inline-block rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">
          Xem danh sách deadline
        </Link>
      </div>
    </PublicShell>
  );
}
