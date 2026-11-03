// ma trận phân quyền, chỗ nào cần check quyền đều gọi can()
export const ROLES = ["guest", "user", "admin"] as const;
export type Role = (typeof ROLES)[number];

export type UserRole = Exclude<Role, "guest">;

export type Action =
  | "deadline:view"
  | "deadline:complete"
  | "deadline:create"
  | "deadline:delete";

const PERMISSIONS: Record<Action, readonly Role[]> = {
  "deadline:view": ["guest", "user", "admin"],
  "deadline:complete": ["user", "admin"],
  "deadline:create": ["admin"],
  "deadline:delete": ["admin"],
};

export function can(role: Role | null | undefined, action: Action): boolean {
  return PERMISSIONS[action].includes(role ?? "guest");
}

export const ROLE_LABELS: Record<Role, string> = {
  guest: "Khách",
  user: "Sinh viên",
  admin: "Lớp trưởng",
};
