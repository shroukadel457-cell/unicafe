import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import {
  ShoppingCart,
  DollarSign,
  Activity,
  TrendingUp,
  ArrowUpRight,
  Users,
  UtensilsCrossed,
  Clock,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAuth();

  const { data: stats } = trpc.dashboard.stats.useQuery(undefined, {
    enabled: isAdmin,
  });
  const { data: recentOrders } = trpc.dashboard.recentOrders.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  const { data: revenueByBranch } = trpc.dashboard.revenueByBranch.useQuery(
    undefined,
    { enabled: isAdmin }
  );

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#EBF4FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#4DA8DA] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <AppLayout>
      <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C] mb-6">
        Admin Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4DA8DA]/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-[#4DA8DA]" />
            </div>
            <span className="text-[10px] font-medium text-[#4CAF7D] bg-[#4CAF7D]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" />
              Active
            </span>
          </div>
          <p className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
            {stats?.totalOrders || 0}
          </p>
          <p className="text-xs text-[#8BA3B8] mt-0.5">Total Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#4CAF7D]/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-[#4CAF7D]" />
            </div>
            <span className="text-[10px] font-medium text-[#4CAF7D] bg-[#4CAF7D]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Revenue
            </span>
          </div>
          <p className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
            {stats?.totalRevenue?.toFixed(0) || 0} EGP
          </p>
          <p className="text-xs text-[#8BA3B8] mt-0.5">Total Revenue</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0A030]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#F0A030]" />
            </div>
            <span className="text-[10px] font-medium text-[#F0A030] bg-[#F0A030]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              Live
            </span>
          </div>
          <p className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
            {stats?.activeOrders || 0}
          </p>
          <p className="text-xs text-[#8BA3B8] mt-0.5">Active Orders</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#7DC8F0]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#7DC8F0]" />
            </div>
            <span className="text-[10px] font-medium text-[#4DA8DA] bg-[#4DA8DA]/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Avg
            </span>
          </div>
          <p className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
            {stats?.avgOrderValue?.toFixed(0) || 0} EGP
          </p>
          <p className="text-xs text-[#8BA3B8] mt-0.5">Avg Order Value</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-[#D0E4F0]">
            <h2 className="font-fredoka font-semibold text-[#1A2B3C]">
              Recent Orders
            </h2>
            <button
              onClick={() => navigate("/admin/orders")}
              className="text-xs text-[#4DA8DA] hover:text-[#3D98CA] font-medium flex items-center gap-1 transition-colors"
            >
              View All
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="divide-y divide-[#D0E4F0]">
            {recentOrders?.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-lg bg-[#F0F7FB] flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed className="w-4 h-4 text-[#4DA8DA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#1A2B3C] truncate">
                    {order.userName}
                  </p>
                  <p className="text-[10px] text-[#8BA3B8]">
                    {order.branchName}
                  </p>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    order.status === "pending"
                      ? "bg-[#F0A030]/10 text-[#F0A030]"
                      : order.status === "preparing"
                      ? "bg-[#4DA8DA]/10 text-[#4DA8DA]"
                      : order.status === "ready"
                      ? "bg-[#4CAF7D]/10 text-[#4CAF7D]"
                      : "bg-[#4CAF7D]/10 text-[#4CAF7D]"
                  }`}
                >
                  {order.status}
                </span>
                <span className="text-sm font-fredoka font-semibold text-[#1A2B3C]">
                  {Number(order.totalEGP).toFixed(0)} EGP
                </span>
              </div>
            ))}
            {(!recentOrders || recentOrders.length === 0) && (
              <div className="p-8 text-center text-sm text-[#8BA3B8]">
                No orders yet
              </div>
            )}
          </div>
        </div>

        {/* Revenue by Branch */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden">
          <div className="p-5 border-b border-[#D0E4F0]">
            <h2 className="font-fredoka font-semibold text-[#1A2B3C]">
              Revenue by Branch
            </h2>
          </div>
          <div className="divide-y divide-[#D0E4F0]">
            {revenueByBranch?.map((branch) => (
              <div key={branch.branchName} className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-[#1A2B3C]">
                    {branch.branchName}
                  </span>
                  <span className="text-sm font-fredoka font-semibold text-[#4DA8DA]">
                    {branch.revenue.toFixed(0)} EGP
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-[#F0F7FB] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#4DA8DA] rounded-full transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          (branch.revenue /
                            Math.max(
                              ...(revenueByBranch?.map((b) => b.revenue) || [
                                1,
                              ])
                            )) *
                            100
                        )}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8BA3B8] min-w-[40px] text-right">
                    {branch.orderCount} orders
                  </span>
                </div>
              </div>
            ))}
            {(!revenueByBranch || revenueByBranch.length === 0) && (
              <div className="p-8 text-center text-sm text-[#8BA3B8]">
                No revenue data yet
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
