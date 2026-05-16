import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { useToastStore } from "@/stores/toastStore";
import {
  Timer,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  XCircle,
  Search,
  ChevronDown,
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Timer },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-700", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700", icon: PackageCheck },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

const statusOptions = ["pending", "preparing", "ready", "completed", "cancelled"];

export default function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const { addToast } = useToastStore();
  const utils = trpc.useUtils();

  const { data: orders, isLoading } = trpc.order.list.useQuery(
    statusFilter ? { status: statusFilter } : undefined
  );

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      addToast("Order status updated", "success");
      utils.order.list.invalidate();
      utils.dashboard.stats.invalidate();
      setEditingStatus(null);
    },
    onError: (err) => addToast(err.message, "error"),
  });

  const filteredOrders = orders?.filter((o) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      o.user?.name?.toLowerCase().includes(q) ||
      o.branch?.name?.toLowerCase().includes(q) ||
      o.id.toString().includes(q)
    );
  });

  return (
    <SidebarLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Orders Management
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">View and manage all student orders</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#94A3B8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search orders..."
                className="h-10 pl-9 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#475569] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
            >
              <option value="">All Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Student</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Branch</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Items</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#475569] uppercase">Date</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="border-t border-[#E2E8F0]">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="h-4 bg-[#E2E8F0] rounded animate-pulse" />
                      </td>
                    </tr>
                  ))
                ) : filteredOrders?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-sm text-[#94A3B8]">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders?.map((order) => {
                    const cfg = statusConfig[order.status as keyof typeof statusConfig];
                    const StatusIcon = cfg?.icon || Timer;
                    return (
                      <tr key={order.id} className="border-t border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors">
                        <td className="px-4 py-3 font-medium text-[#0F172A]">
                          #{order.id.toString().padStart(5, "0")}
                        </td>
                        <td className="px-4 py-3 text-[#475569]">{order.user?.name}</td>
                        <td className="px-4 py-3 text-[#475569]">{order.branch?.name}</td>
                        <td className="px-4 py-3 text-[#475569]">{order.items?.length || 0} items</td>
                        <td className="px-4 py-3 font-semibold text-[#3B82F6]">{order.totalEGP} EGP</td>
                        <td className="px-4 py-3 relative">
                          {editingStatus === order.id ? (
                            <select
                              value={order.status}
                              onChange={(e) => {
                                updateStatus.mutate({ id: order.id, status: e.target.value as any });
                              }}
                              onBlur={() => setEditingStatus(null)}
                              autoFocus
                              className="h-8 px-2 rounded-lg border border-[#3B82F6] bg-white text-xs font-medium focus:outline-none"
                            >
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>
                                  {s.charAt(0).toUpperCase() + s.slice(1)}
                                </option>
                              ))}
                            </select>
                          ) : (
                            <button
                              onClick={() => setEditingStatus(order.id)}
                              className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg?.color} hover:opacity-80 transition-opacity`}
                            >
                              <StatusIcon className="w-3 h-3" />
                              {cfg?.label}
                              <ChevronDown className="w-2.5 h-2.5" />
                            </button>
                          )}
                        </td>
                        <td className="px-4 py-3 text-[#94A3B8] text-xs">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
