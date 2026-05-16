import { trpc } from "@/providers/trpc";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import {
  Banknote,
  TrendingUp,
  BarChart3,
  ClipboardList,
  Timer,
  ChefHat,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Timer },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-700", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700", icon: PackageCheck },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: Timer },
};

export default function AdminAnalytics() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: revenueData } = trpc.dashboard.revenueByBranch.useQuery();
  const { data: recentOrders } = trpc.dashboard.recentOrders.useQuery({ limit: 5 });

  const maxRevenue = Math.max(...(revenueData?.map((r) => r.revenue) || [1]));

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
            Analytics
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">Cafeteria performance insights</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#EBF2FF] flex items-center justify-center">
                <ClipboardList className="w-5 h-5 text-[#3B82F6]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats?.totalOrdersToday ?? 0}</p>
                <p className="text-xs text-[#94A3B8]">Orders Today</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                <Banknote className="w-5 h-5 text-[#10B981]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{(stats?.totalRevenueToday ?? 0).toFixed(2)}</p>
                <p className="text-xs text-[#94A3B8]">Revenue Today (EGP)</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-[#F59E0B]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0F172A]">{stats?.activeOrders ?? 0}</p>
                <p className="text-xs text-[#94A3B8]">Active Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue by Branch */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
            <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Revenue by Branch
            </h2>
          </div>

          {revenueData && revenueData.length > 0 ? (
            <div className="space-y-4">
              {revenueData.map((item) => (
                <div key={item.branchName} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#475569]">{item.branchName}</span>
                    <span className="font-bold text-[#0F172A]">{item.revenue.toFixed(2)} EGP</span>
                  </div>
                  <div className="h-3 bg-[#F0F4F8] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#3B82F6] rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((item.revenue / maxRevenue) * 100, 5)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-[#94A3B8] text-center py-6">No revenue data available</p>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Recent Activity
            </h2>
          </div>
          <div className="p-5 space-y-3">
            {recentOrders?.map((order) => {
              const cfg = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = cfg?.icon || Timer;
              return (
                <div key={order.id} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${cfg?.color.split(" ")[0]}`}>
                    <StatusIcon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#0F172A]">
                      Order #{order.id.toString().padStart(5, "0")} - {order.user?.name}
                    </p>
                    <p className="text-xs text-[#94A3B8]">{order.branch?.name} - {order.totalEGP} EGP</p>
                  </div>
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg?.color}`}>
                    {cfg?.label}
                  </span>
                </div>
              );
            })}
            {(!recentOrders || recentOrders.length === 0) && (
              <p className="text-sm text-[#94A3B8] text-center py-4">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
