import DashboardHeader from "../components/tenant/DashboardHeader";
import QuickStats from "../components/tenant/QuickStats";
import NoticeBoard from "../components/tenant/NoticeBoard";

export default function TenantDashboard() {
  return (
    <div className="bg-gray-50 dark:bg-gray-950 min-h-screen transition-colors duration-300">
      <DashboardHeader />
      <div className="max-w-5xl mx-auto px-4 py-10 flex flex-col gap-10">
        <QuickStats />
        <NoticeBoard />
      </div>
    </div>
  );
}
