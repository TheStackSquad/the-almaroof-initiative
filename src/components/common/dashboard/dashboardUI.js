// src/components/dashboard/DashboardUI.js
import { useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { usePermits } from "@/utils/hooks/usePermits";
import { getStatusCounts } from "@/utils/permitUtils";
import DashboardHeader from "@/components/common/dashboard/dashboardHeader";
import StatusSummary from "@/components/common/dashboard/statusSummary";
import FilterControls from "@/components/common/dashboard/filterControls";
import PermitsList from "@/components/common/dashboard/permitList";
import LoadingSpinner from "@/components/common/loadingSpinner";
import { logoutUser } from "@/redux/action/authAction";

const DashboardUI = () => {
  const [filter, setFilter] = useState("all");
  const user = useSelector((state) => state.auth.user);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const router = useRouter();

  const { permits, loading, error, refetch } = usePermits(user?.id);
  const statusCounts = getStatusCounts(permits);
  const filteredPermits =
    filter === "all"
      ? permits
      : permits.filter((permit) => permit.status === filter);

  if (!isAuthenticated) {
    return <AuthRequired router={router} />;
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <DashboardHeader user={user} onLogout={logoutUser} />
        <StatusSummary statusCounts={statusCounts} />
        <FilterControls
          filter={filter}
          onFilterChange={setFilter}
          statusCounts={statusCounts}
          totalCount={permits.length}
        />
        <PermitsList
          permits={filteredPermits}
          filter={filter}
          onUpdate={refetch}
        />
      </div>
    </div>
  );
};

const AuthRequired = ({ router }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Please sign in</h2>
      <p className="text-gray-600 mb-6">
        You need to be authenticated to view your dashboard
      </p>
      <button
        onClick={() => router.push("/auth-entry")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
      >
        Go to Sign In
      </button>
    </div>
  </div>
);

export default DashboardUI;
