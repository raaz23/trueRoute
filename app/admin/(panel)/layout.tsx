import AdminSidebar from "@/components/admin/AdminSidebar";

export const metadata = {
  title: "Admin — TrueRoute",
};

export default function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-6 md:p-10">{children}</div>
    </div>
  );
}
