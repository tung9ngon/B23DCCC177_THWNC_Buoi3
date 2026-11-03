"use client";

export default function PublicError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-2xl font-bold">Đã có lỗi xảy ra</h1>
      <p className="mt-2 text-slate-600">{error.message || "Không tải được dữ liệu."}</p>
      <button onClick={reset} className="mt-6 rounded-lg bg-red-600 px-4 py-2 font-semibold text-white">
        Thử lại
      </button>
    </div>
  );
}
