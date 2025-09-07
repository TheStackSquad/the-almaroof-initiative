// src/components/dashboard/dashboardHeader.js
const DashboardHeader = ({ user, onLogout }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Permit Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage your permit applications</p>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600">Welcome, {user?.username}</span>
        <button
          onClick={onLogout}
          className="bg-red-100 text-red-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
);
