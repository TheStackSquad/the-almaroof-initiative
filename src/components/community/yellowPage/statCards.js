// src/components/community/yellowPage/StatsCards.js
import { Building2, Users, BookOpen } from "lucide-react";

export default function StatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatCard
        icon={
          <Building2 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
        }
        value={stats.total}
        label="Total Businesses"
        bgColor="bg-blue-100 dark:bg-blue-900/30"
      />
      <StatCard
        icon={<Users className="w-8 h-8 text-green-600 dark:text-green-400" />}
        value={stats.verified}
        label="Verified Businesses"
        bgColor="bg-green-100 dark:bg-green-900/30"
      />
      <StatCard
        icon={
          <BookOpen className="w-8 h-8 text-purple-600 dark:text-purple-400" />
        }
        value={stats.categories}
        label="Categories"
        bgColor="bg-purple-100 dark:bg-purple-900/30"
      />
    </div>
  );
}

function StatCard({ icon, value, label, bgColor }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-center">
        <div className={`p-3 ${bgColor} rounded-lg`}>{icon}</div>
        <div className="ml-4">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white font-['Montserrat']">
            {value}
          </h3>
          <p className="text-gray-600 dark:text-gray-300">{label}</p>
        </div>
      </div>
    </div>
  );
}
