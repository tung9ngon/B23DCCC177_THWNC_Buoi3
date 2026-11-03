import "server-only";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { can, type Action } from "./permissions";

// chưa login -> /login, không đủ quyền -> /403
export async function requirePageAccess(pathname: string, action: Action) {
  const session = await auth();
  if (!session?.user) redirect(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
  if (!can(session.user.role, action)) redirect("/403");
  return session.user;
}
