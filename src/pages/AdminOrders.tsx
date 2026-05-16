import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useToastStore } from "@/store/toastStore";
import AppLayout from "@/components/AppLayout";
import {
  ClipboardList,
  ChevronDown,
  SlidersHorizontal,
  Search,
  RefreshCw,
} from "lucide-react";

const statusFilters = [
  { value: "all", label: "All Statuses" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "ready", label: "Ready" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const statusColors: Record<string, string> = {
  pending: "#F0A030",
  preparing: "#4DA8DA",
  ready: "#4CAF7D",
  completed: "#4CAF7D",
  cancelled: "#E86060",
};

export default function AdminOrders() {
  const { addToast } = useToastStore();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const { data: orders, isLoading, refetch } = trpc.order.adminList.useQuery(
    statusFilter === "all" ? undefined : { status: statusFilter }
  );

  const updateStatus = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      addToast({
        title: "Status updated",
        description: "Order status has been updated",
        variant: "success",
      });
      refetch();
    },
    onError: (err) => {
      addToast({
        title: "Update failed",
        description: err.message,
        variant: "error",
      });
    },
  });

  const filteredOrders =
    orders?.filter(
      (o) =>
        !search ||
        o.userName?.toLowerCase().includes(search.toLowerCase()) ||
        o.id.toString().includes(search)
    ) || [];

  return (
    <AppLayout>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
          Order Management
        </h1>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#D0E4F0] text-sm text-[#5A7A94] hover:text-[#4DA8DA] hover:border-[#4DA8DA] transition-all self-start"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name or order ID..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-white text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA]"
          />
        </div>
        <div className="relative">
          <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2.5 rounded-xl border border-[#D0E4F0] bg-white text-[#1A2B3C] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 appearance-none cursor-pointer"
          >
            {statusFilters.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-[#4DA8DA] border-t-transparent rounded-full mx-auto" />
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#D0E4F0] bg-[#F0F7FB]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Student
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Branch
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Total
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#5A7A94] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D0E4F0]">
                {filteredOrders.map((order) => {
                  const expanded = expandedOrder === order.id;
                  const color = statusColors[order.status] || "#8BA3B8";

                  return (
                    <>
                      <tr
                        key={order.id}
                        className="hover:bg-[#F0F7FB]/50 transition-colors cursor-pointer"
                        onClick={() =>
                          setExpandedOrder(expanded ? null : order.id)
                        }
                      >
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-medium text-[#1A2B3C]">
                            #{order.id}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-[#1A2B3C]">
                            {order.userName}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm text-[#5A7A94]">
                            {order.branchName}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-sm font-fredoka font-semibold text-[#1A2B3C]">
                            {Number(order.totalEGP).toFixed(0)} EGP
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                            style={{
                              color,
                              backgroundColor: `rgba(${parseInt(
                                color.slice(1, 3),
                                16
                              )}, ${parseInt(
                                color.slice(3, 5),
                                16
                              )}, ${parseInt(
                                color.slice(5, 7),
                                16
                              )}, 0.1)`,
                            }}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedOrder(expanded ? null : order.id);
                            }}
                            className="text-[#8BA3B8] hover:text-[#4DA8DA] transition-colors"
                          >
                            <ChevronDown
                              className={`w-4 h-4 transition-transform ${
                                expanded ? "rotate-180" : ""
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                      {expanded && (
                        <tr>
                          <td colSpan={6} className="px-5 py-4 bg-[#F0F7FB]/30">
                            {/* Items */}
                            <div className="space-y-2 mb-4">
                              <p className="text-xs font-semibold text-[#5A7A94] uppercase tracking-wider mb-2">
                                Items
                              </p>
                              {order.items.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between py-1.5"
                                >
                                  <span className="text-sm text-[#1A2B3C]">
                                    {item.quantity}x {item.menuItemName}
                                  </span>
                                  <span className="text-sm text-[#5A7A94]">
                                    {Number(item.priceEGP).toFixed(0)} EGP
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Status Update */}
                            <div className="flex items-center gap-3 pt-3 border-t border-[#D0E4F0]">
                              <span className="text-xs font-semibold text-[#5A7A94]">
                                Update Status:
                              </span>
                              <div className="flex items-center gap-2">
                                {statusOptions.map((opt) => (
                                  <button
                                    key={opt.value}
                                    onClick={() =>
                                      updateStatus.mutate({
                                        id: order.id,
                                        status: opt.value as any,
                                      })
                                    }
                                    disabled={
                                      order.status === opt.value ||
                                      updateStatus.isPending
                                    }
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-medium transition-all ${
                                      order.status === opt.value
                                        ? "bg-[#4DA8DA] text-white"
                                        : "bg-white text-[#5A7A94] border border-[#D0E4F0] hover:border-[#4DA8DA] hover:text-[#4DA8DA]"
                                    } disabled:opacity-50`}
                                  >
                                    {opt.label}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-10 text-center">
            <ClipboardList className="w-10 h-10 text-[#D0E4F0] mx-auto mb-3" />
            <p className="text-sm text-[#8BA3B8]">No orders found</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
