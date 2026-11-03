import type { Metadata } from "next";
import { ConfirmButton } from "@/components/confirm-button";
import { DeadlineRow } from "@/components/deadline-row";
import { deleteDeadlineAction } from "@/lib/actions";
import { getDeadlineViews, getSubjects } from "@/lib/data";
import { requirePageAccess } from "@/lib/session";
import { CreateDeadlineForm } from "./create-deadline-form";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị deadline",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  await requirePageAccess("/admin", "deadline:create");
  const [deadlines, subjects] = await Promise.all([getDeadlineViews(), getSubjects()]);

  return (
    <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 lg:self-start">
        <h1 className="text-xl font-bold">Thêm deadline</h1>
        <CreateDeadlineForm subjects={subjects.map((s) => ({ slug: s.slug, name: s.name }))} />
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-bold">Tất cả deadline ({deadlines.length})</h2>
        <ul className="space-y-3">
          {deadlines.map((d) => (
            <DeadlineRow key={d.id} deadline={d}>
              <form action={deleteDeadlineAction.bind(null, d.id)}>
                <ConfirmButton message={`Xoá deadline "${d.title}"?`}>Xoá</ConfirmButton>
              </form>
            </DeadlineRow>
          ))}
        </ul>
      </section>
    </div>
  );
}
