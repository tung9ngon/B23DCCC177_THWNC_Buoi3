import { auth } from "@/auth";
import { SidebarNav } from "@/components/sidebar-nav";
import { can } from "@/lib/permissions";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const items = [
    { href: "/dashboard", label: "Tổng quan" },
    { href: "/dashboard/done", label: "Đã hoàn thành" },
    ...(can(session?.user?.role, "deadline:create") ? [{ href: "/admin", label: "Quản trị" }] : []),
  ];

  return (
    <div className="grid gap-6 md:grid-cols-[200px_1fr]">
      <aside className="md:sticky md:top-6 md:self-start">
        <SidebarNav items={items} />
      </aside>
      <section>{children}</section>
    </div>
  );
}
