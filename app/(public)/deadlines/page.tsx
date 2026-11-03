import type { Metadata } from "next";
import { DeadlineFilter } from "@/components/deadline-filter";
import { getDeadlineViews, getSubjects } from "@/lib/data";

// ISR 60s
export const revalidate = 60;

export const metadata: Metadata = {
  title: "Danh sách deadline",
  description: "Tất cả deadline của lớp, lọc theo môn học và trạng thái.",
  alternates: { canonical: "/deadlines" },
};

export default async function DeadlinesPage() {
  const [deadlines, subjects] = await Promise.all([getDeadlineViews(), getSubjects()]);
  const generatedAt = new Date().toLocaleTimeString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Danh sách deadline</h1>
        <p className="mt-1 text-sm text-slate-500">Trang được dựng lúc {generatedAt} · tự làm mới sau 60 giây</p>
      </div>
      <DeadlineFilter deadlines={deadlines} subjects={subjects.map((s) => ({ slug: s.slug, name: s.name }))} />
    </div>
  );
}
