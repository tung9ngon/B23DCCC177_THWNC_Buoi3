"use client";

import { useState } from "react";
import { DeadlineRow, type DeadlineView } from "./deadline-row";

type Status = "all" | "upcoming" | "overdue";

export function DeadlineFilter({
  deadlines,
  subjects,
}: {
  deadlines: DeadlineView[];
  subjects: { slug: string; name: string }[];
}) {
  const [subject, setSubject] = useState("all");
  const [status, setStatus] = useState<Status>("all");

  const now = Date.now();
  const visible = deadlines.filter((d) => {
    if (subject !== "all" && d.subjectSlug !== subject) return false;
    if (status === "upcoming") return new Date(d.dueAt).getTime() >= now;
    if (status === "overdue") return new Date(d.dueAt).getTime() < now;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <label className="text-sm">
          <span className="mr-2 font-medium">Môn học</span>
          <select value={subject} onChange={(e) => setSubject(e.target.value)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
            <option value="all">Tất cả</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.slug}>{s.name}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mr-2 font-medium">Trạng thái</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)} className="rounded-lg border border-slate-300 bg-white px-3 py-2">
            <option value="all">Tất cả</option>
            <option value="upcoming">Sắp tới</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </label>
      </div>
      <p className="text-sm text-slate-500">{visible.length} deadline</p>
      <ul className="space-y-3">
        {visible.map((d) => (
          <DeadlineRow key={d.id} deadline={d} />
        ))}
      </ul>
    </div>
  );
}
