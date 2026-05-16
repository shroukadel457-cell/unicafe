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
  ChevronDown,
  ChevronUp,
  MapPin,
} from "lucide-react";

const statusConfig = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Timer },
  preparing: { label: "Preparing", color: "bg-blue-100 text-blue-700", icon: ChefHat },
  ready: { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  completed: { label: "Completed", color: "bg-gray-100 text-gray-700", icon: PackageCheck },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: XCircle },
};

const filterTabs = ["All", "Pending", "Preparing", "Ready", "Completed"];

export default function OrdersPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const { addToast } = useToastStore();
  const utils = trpc.useUtils();

  const { data: orders, isLoading } = trpc.order.list.useQuery(
    activeFilter !== "All" ? { status: activeFilter.toLowerCase() } : undefined
  );

  const cancelMutation = trpc.order.cancel.useMutation({
    onSuccess: () => {
      addToast("Order cancelled", "info");
      utils.order.list.invalidate();
    },
    onError: (err) => {
      addToast(err.message, "error");
    },
  });

  return (
    <SidebarLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
            My Orders
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">Track and manage your cafeteria orders</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab
                  ? "bg-[#3B82F6] text-white"
                  : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#3B82F6]/30"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Orders list */}
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-[#E2E8F0] p-5 animate-pulse">
                <div className="h-4 bg-[#E2E8F0] rounded w-32 mb-3" />
                <div className="h-3 bg-[#E2E8F0] rounded w-48" />
              </div>
            ))}
          </div>
        ) : orders?.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
            <PackageCheck className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8]">No orders found</p>
            <p className="text-xs text-[#CBD5E1] mt-1">Place an order from a cafeteria to see it here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders?.map((order) => {
              const cfg = statusConfig[order.status as keyof typeof statusConfig];
              const StatusIcon = cfg?.icon || Timer;
              const isExpanded = expandedOrder === order.id;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div
                    className="p-4 cursor-pointer"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#0F172A]">
                          #{order.id.toString().padStart(5, "0")}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cfg?.color}`}>
                          <StatusIcon className="w-3 h-3" />
                          {cfg?.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#3B82F6]">{order.totalEGP} EGP</span>
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4 text-[#94A3B8]" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-[#94A3B8]" />
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[#94A3B8]">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {order.branch?.name}
                      </span>
                      <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>{order.items?.length || 0} items</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-[#E2E8F0] px-4 py-3">
                      <div className="space-y-2 mb-3">
                        {order.items?.map((item) => (
                          <div key={item.id} className="flex items-center justify-between text-sm">
                            <span className="text-[#475569]">
                              {item.menuItem?.name} x{item.quantity}
                            </span>
                            <span className="text-[#0F172A] font-medium">
                              {(Number(item.priceEGP) * item.quantity).toFixed(2)} EGP
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                        <span className="text-xs text-[#94A3B8]">
                          {new Date(order.createdAt).toLocaleString()}
                        </span>
                        {order.status === "pending" && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              cancelMutation.mutate({ id: order.id });
                            }}
                            disabled={cancelMutation.isPending}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SidebarLayout>
  );
}
