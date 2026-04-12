import { useAuth } from "../../hooks/useAuth";

export default function DashboardHeader() {
  const { currentUser } = useAuth();

  return (
    <div className="bg-blue-600 dark:bg-gray-900 text-white py-10 px-4 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold">
          Welcome back, {currentUser?.displayName || "Tenant"} 👋
        </h1>
        <p className="text-blue-100 dark:text-gray-400 mt-1 text-sm">
          {currentUser?.email}
        </p>
      </div>
    </div>
  );
}
