"use server";

import { revalidatePath } from "next/cache";
import { AuthError } from "next-auth";
import { z } from "zod";
import { auth, signIn } from "@/auth";
import { can, type Action } from "./permissions";
import { DEADLINE_TYPES } from "./constants";
import * as db from "./data";

// action nào cũng phải check quyền lại
async function requirePermission(action: Action) {
  const session = await auth();
  if (!session?.user || !can(session.user.role, action)) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return session.user;
}

const idSchema = z.string().regex(/^\d+$/, "Id không hợp lệ");

function revalidateDeadline(id: string) {
  revalidatePath(`/deadlines/${id}`);
  revalidatePath("/sitemap.xml");
  revalidatePath("/admin");
  revalidatePath("/dashboard", "layout");
}

export async function toggleCompleteAction(deadlineId: string) {
  const user = await requirePermission("deadline:complete");
  const id = idSchema.parse(deadlineId);
  if (!(await db.getDeadline(id))) throw new Error("Deadline không tồn tại.");
  await db.toggleCompletion(user.id, id);
  revalidatePath("/dashboard", "layout");
}

export type CreateDeadlineState = {
  ok?: boolean;
  message?: string;
  errors?: Partial<Record<"title" | "subjectSlug" | "type" | "dueAt" | "description", string>>;
};

const createSchema = z.object({
  title: z.string({ message: "Nhập tiêu đề" }).trim().min(3, "Tiêu đề tối thiểu 3 ký tự").max(120, "Tiêu đề tối đa 120 ký tự"),
  subjectSlug: z.string({ message: "Chọn môn học" }).min(1, "Chọn môn học"),
  type: z.enum(DEADLINE_TYPES, { message: "Loại deadline không hợp lệ" }),
  // datetime-local dạng YYYY-MM-DDTHH:mm, coi là giờ VN
  dueAt: z.string({ message: "Chọn hạn nộp" }).regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, "Chọn hạn nộp"),
  description: z.string({ message: "Mô tả không hợp lệ" }).trim().max(1000, "Mô tả tối đa 1000 ký tự"),
});

export async function createDeadlineAction(
  _prev: CreateDeadlineState,
  formData: FormData,
): Promise<CreateDeadlineState> {
  try {
    await requirePermission("deadline:create");
  } catch (e) {
    return { message: (e as Error).message };
  }

  const parsed = createSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    const errors: CreateDeadlineState["errors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<CreateDeadlineState["errors"]>;
      errors[key] ??= issue.message;
    }
    return { errors };
  }

  if (!(await db.getSubject(parsed.data.subjectSlug))) {
    return { errors: { subjectSlug: "Môn học không tồn tại" } };
  }

  const deadline = await db.createDeadline({
    ...parsed.data,
    dueAt: `${parsed.data.dueAt}:00+07:00`,
  });
  revalidateDeadline(deadline.id);
  return { ok: true, message: `Đã thêm deadline #${deadline.id}.` };
}

export async function deleteDeadlineAction(deadlineId: string) {
  await requirePermission("deadline:delete");
  const id = idSchema.parse(deadlineId);
  if (!(await db.getDeadline(id))) throw new Error("Deadline không tồn tại.");
  await db.deleteDeadline(id);
  revalidateDeadline(id);
}

// chặn open redirect
function safeCallbackUrl(formData: FormData) {
  const url = String(formData.get("callbackUrl") ?? "");
  return url.startsWith("/") && !url.startsWith("//") ? url : "/dashboard";
}

export type LoginState = { error?: string; redirectTo?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) return { error: "Email hoặc mật khẩu không đúng." };
    throw error;
  }
  return { redirectTo: safeCallbackUrl(formData) };
}

export async function githubLoginAction(formData: FormData) {
  const redirectTo = safeCallbackUrl(formData);
  await signIn("github", { redirectTo });
}
