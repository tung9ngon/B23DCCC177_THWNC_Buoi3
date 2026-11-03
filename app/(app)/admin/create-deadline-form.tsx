"use client";

import { startTransition, useActionState, useEffect, useRef } from "react";
import { createDeadlineAction, type CreateDeadlineState } from "@/lib/actions";
import { DEADLINE_TYPES } from "@/lib/constants";

const field = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2";

export function CreateDeadlineForm({ subjects }: { subjects: { slug: string; name: string }[] }) {
  const [state, formAction, pending] = useActionState<CreateDeadlineState, FormData>(createDeadlineAction, {});
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  const error = (name: keyof NonNullable<CreateDeadlineState["errors"]>) =>
    state.errors?.[name] && <span className="mt-1 block text-xs text-red-600">{state.errors[name]}</span>;

  return (
    // dùng onSubmit vì action={} làm react reset form khi bị lỗi validate
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        startTransition(() => formAction(formData));
      }}
      className="mt-4 space-y-4"
      noValidate
    >
      <label className="block text-sm font-medium">
        Tiêu đề
        <input name="title" className={field} />
        {error("title")}
      </label>
      <label className="block text-sm font-medium">
        Môn học
        <select name="subjectSlug" className={field} defaultValue="">
          <option value="" disabled>Chọn môn</option>
          {subjects.map((s) => (
            <option key={s.slug} value={s.slug}>{s.name}</option>
          ))}
        </select>
        {error("subjectSlug")}
      </label>
      <label className="block text-sm font-medium">
        Loại
        <select name="type" className={field} defaultValue={DEADLINE_TYPES[0]}>
          {DEADLINE_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        {error("type")}
      </label>
      <label className="block text-sm font-medium">
        Hạn nộp (giờ Việt Nam)
        <input name="dueAt" type="datetime-local" className={field} />
        {error("dueAt")}
      </label>
      <label className="block text-sm font-medium">
        Mô tả
        <textarea name="description" rows={3} className={field} />
        {error("description")}
      </label>
      {state.message && (
        <p className={`text-sm ${state.ok ? "text-emerald-700" : "text-red-600"}`} role="status">{state.message}</p>
      )}
      <button disabled={pending} className="w-full rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700 disabled:opacity-60">
        {pending ? "Đang lưu…" : "Thêm deadline"}
      </button>
    </form>
  );
}
