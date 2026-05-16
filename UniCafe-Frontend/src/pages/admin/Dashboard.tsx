import { trpc } from "@/providers/trpc";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import {
  ClipboardList,
  Clock,
  Banknote,
  BookOpen,
  TrendingUp,
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

export default function AdminDashboard() {
  const { data: stats } = trpc.dashboard.stats.useQuery();
  const { data: recentOrders } = trpc.dashboard.recentOrders.useQuery({ limit: 10 });

  const statCards = [
    {
      label: "Total Orders (Today)",
      value: stats?.totalOrdersToday ?? 0,
      icon: ClipboardList,
      color: "#3B82F6",
      bg: "#EBF2FF",
    },
    {
      label: "Active Orders",
      value: stats?.activeOrders ?? 0,
      icon: Clock,
      color: "#F59E0B",
      bg: "#FEF3C7",
    },
    {
      label: "Revenue (Today)",
      value: `${(stats?.totalRevenueToday ?? 0).toFixed(2)} EGP`,
      icon: Banknote,
      color: "#10B981",
      bg: "#D1FAE5",
    },
    {
      label: "Menu Items",
      value: stats?.totalMenuItems ?? 0,
      icon: BookOpen,
      color: "#8B5CF6",
      bg: "#EDE9FE",
    },
  ];

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
            Admin Dashboard
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">Overview of cafeteria operations</p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.label}
                className="bg-white rounded-xl border border-[#E2E8F0] p-5 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: card.bg }}
                  >
                    <Icon className="w-5 h-5" style={{ color: card.color }} />
                  </div>
                  <TrendingUp className="w-4 h-4 text-[#10B981]" />
                </div>
                <p className="text-2xl font-bold text-[#0F172A]">{card.value}</p>
                <p className="text-xs text-[#94A3B8] mt-0.5">{card.label}</p>
              </div>
            );
          })}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E2E8F0]">
            <h2 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Recent Orders
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Order ID</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Student</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Branch</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Items</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Total</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders?.map((order) => {
                  const cfg = statusConfig[order.status as keyof typeof statusConfig];
                  const StatusIcon = cfg?.icon || Timer;
                  return (
                    <tr key={order.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                      <td className="px-5 py-3 font-medium text-[#0F172A]">
                        #{order.id.toString().padStart(5, "0")}
                      </td>
                      <td className="px-5 py-3 text-[#475569]">{order.user?.name}</td>
                      <td className="px-5 py-3 text-[#475569]">{order.branch?.name}</td>
                      <td className="px-5 py-3 text-[#475569]">{order.items?.length || 0} items</td>
                      <td className="px-5 py-3 font-semibold text-[#3B82F6]">{order.totalEGP} EGP</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg?.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg?.label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[#94A3B8] text-xs">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="text-center py-8 text-sm text-[#94A3B8]">No orders yet</div>
            )}
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
