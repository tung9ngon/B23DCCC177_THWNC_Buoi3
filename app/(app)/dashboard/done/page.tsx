import type { Metadata } from "next";
import { DeadlineRow } from "@/components/deadline-row";
import { toggleCompleteAction } from "@/lib/actions";
import { getCompletedIds, getDeadlineViews } from "@/lib/data";
import { requirePageAccess } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Đã hoàn thành",
  robots: { index: false, follow: false },
};

export default async function DonePage() {
  const user = await requirePageAccess("/dashboard/done", "deadline:complete");
  const [deadlines, completed] = await Promise.all([getDeadlineViews(), getCompletedIds(user.id)]);
  const done = deadlines.filter((d) => completed.includes(d.id));

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Đã hoàn thành ({done.length})</h1>
      {done.length === 0 && <p className="text-slate-500">Bạn chưa đánh dấu deadline nào.</p>}
      <ul className="space-y-3">
        {done.map((d) => (
          <DeadlineRow key={d.id} deadline={d}>
            <form action={toggleCompleteAction.bind(null, d.id)}>
              <button className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium hover:bg-slate-100">
                Bỏ đánh dấu
              </button>
            </form>
          </DeadlineRow>
        ))}
      </ul>
    </div>
  );
}
