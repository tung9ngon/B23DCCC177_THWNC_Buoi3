import type { Metadata } from "next";
import { DeadlineRow } from "@/components/deadline-row";
import { toggleCompleteAction } from "@/lib/actions";
import { getCompletedIds, getDeadlineViews } from "@/lib/data";
import { requirePageAccess } from "@/lib/session";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const user = await requirePageAccess("/dashboard", "deadline:complete");
  const [deadlines, completed] = await Promise.all([getDeadlineViews(), getCompletedIds(user.id)]);

  const now = Date.now();
  const todo = deadlines.filter((d) => !completed.includes(d.id));
  const overdue = todo.filter((d) => new Date(d.dueAt).getTime() < now);
  const upcoming = todo.filter((d) => new Date(d.dueAt).getTime() >= now);

  const stats = [
    { label: "Tổng deadline", value: deadlines.length },
    { label: "Đã xong", value: deadlines.length - todo.length },
    { label: "Quá hạn chưa xong", value: overdue.length },
  ];

  const renderList = (list: typeof todo) => (
    <ul className="space-y-3">
      {list.map((d) => (
        <DeadlineRow key={d.id} deadline={d}>
          <form action={toggleCompleteAction.bind(null, d.id)}>
            <button className="rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700">
              Đánh dấu đã xong
            </button>
          </form>
        </DeadlineRow>
      ))}
    </ul>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Xin chào, {user.name}</h1>
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Sắp tới ({upcoming.length})</h2>
        {upcoming.length ? renderList(upcoming) : <p className="text-slate-500">Không còn deadline nào sắp tới.</p>}
      </section>
      {overdue.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-red-700">Quá hạn ({overdue.length})</h2>
          {renderList(overdue)}
        </section>
      )}
    </div>
  );
}
