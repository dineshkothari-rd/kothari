import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import TenantTable from "../components/admin/TenantTable";

export default function AdminDashboard() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <AdminHeader />
      <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        <AdminStats />
        <TenantTable />
      </div>
    </div>
  );
}
