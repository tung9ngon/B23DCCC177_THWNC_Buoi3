import Link from "next/link";
import { formatDueAt } from "@/lib/format";
import { Countdown } from "./countdown";

export type DeadlineView = {
  id: string;
  title: string;
  type: string;
  dueAt: string;
  subjectName: string;
  subjectSlug: string;
  subjectColor: string;
};

export function DeadlineRow({ deadline, children }: { deadline: DeadlineView; children?: React.ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white p-4">
      <span className="h-10 w-1.5 shrink-0 rounded-full" style={{ background: deadline.subjectColor }} aria-hidden />
      <div className="min-w-0 flex-1">
        <Link href={`/deadlines/${deadline.id}`} className="font-semibold hover:underline">
          {deadline.title}
        </Link>
        <p className="text-sm text-slate-500">
          {deadline.subjectName} · {deadline.type} · {formatDueAt(deadline.dueAt)}
        </p>
      </div>
      <Countdown dueAt={deadline.dueAt} />
      {children}
    </li>
  );
}
