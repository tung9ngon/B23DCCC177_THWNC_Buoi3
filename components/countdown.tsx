"use client";

import { useEffect, useState } from "react";

const DAY = 24 * 60 * 60 * 1000;

function label(dueAt: string, now: number) {
  const diff = new Date(dueAt).getTime() - now;
  if (diff < 0) return { text: `Quá hạn ${Math.max(1, Math.floor(-diff / DAY))} ngày`, overdue: true };
  if (diff < DAY) return { text: `Còn ${Math.ceil(diff / (60 * 60 * 1000))} giờ`, overdue: false };
  return { text: `Còn ${Math.ceil(diff / DAY)} ngày`, overdue: false };
}

export function Countdown({ dueAt }: { dueAt: string }) {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const timer = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(timer);
  }, []);

  if (now === null) {
    return <span className="inline-block h-6 w-24 rounded-full bg-slate-100" aria-hidden />;
  }

  const { text, overdue } = label(dueAt, now);
  return (
    <span
      className={`inline-block rounded-full px-3 py-0.5 text-xs font-semibold ${
        overdue ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {text}
    </span>
  );
}
