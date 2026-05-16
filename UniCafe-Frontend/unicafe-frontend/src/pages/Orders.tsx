import { useState } from "react";
import { trpc } from "@/providers/trpc";
import { useToastStore } from "@/store/toastStore";
import AppLayout from "@/components/AppLayout";
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  X,
  Package,
} from "lucide-react";

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  pending: { color: "#F0A030", bg: "#F0A030/10", label: "Pending" },
  preparing: { color: "#4DA8DA", bg: "#4DA8DA/10", label: "Preparing" },
  ready: { color: "#4CAF7D", bg: "#4CAF7D/10", label: "Ready" },
  completed: { color: "#4CAF7D", bg: "#4CAF7D/10", label: "Completed" },
  cancelled: { color: "#E86060", bg: "#E86060/10", label: "Cancelled" },
};

const statusSteps = ["pending", "preparing", "ready", "completed"];
const stepLabels = ["Placed", "Preparing", "Ready", "Completed"];

export default function Orders() {
  const { addToast } = useToastStore();
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [cancelConfirm, setCancelConfirm] = useState<number | null>(null);

  const { data: orders, isLoading, refetch } = trpc.order.myOrders.useQuery();
  const cancelMutation = trpc.order.cancel.useMutation({
    onSuccess: () => {
      addToast({
        title: "Order cancelled",
        description: "Your order has been cancelled",
        variant: "success",
      });
      setCancelConfirm(null);
      refetch();
    },
    onError: (err) => {
      addToast({
        title: "Cannot cancel",
        description: err.message,
        variant: "error",
      });
    },
  });

  const toggleExpand = (orderId: number) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStepIndex = (status: string) => statusSteps.indexOf(status);

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#D0E4F0] p-5 animate-pulse"
            >
              <div className="h-4 bg-[#F0F7FB] rounded w-1/3 mb-3" />
              <div className="h-3 bg-[#F0F7FB] rounded w-1/2" />
            </div>
          ))}
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C] mb-6">
        My Orders
      </h1>

      {orders && orders.length > 0 ? (
        <div className="space-y-4">
          {orders.map((order) => {
            const expanded = expandedOrder === order.id;
            const config = statusConfig[order.status] || statusConfig.pending;
            const currentStep = getStepIndex(order.status);

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden"
              >
                {/* Order Header */}
                <div
                  className="p-4 cursor-pointer hover:bg-[#F0F7FB]/50 transition-colors"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#4DA8DA]/10 flex items-center justify-center">
                        <ClipboardList className="w-5 h-5 text-[#4DA8DA]" />
                      </div>
                      <div>
                        <p className="font-fredoka font-semibold text-[#1A2B3C] text-sm">
                          Order #{order.id}
                        </p>
                        <p className="text-xs text-[#8BA3B8]">
                          {order.branchName} &middot;{" "}
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )
                            : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className="px-2.5 py-1 rounded-full text-[10px] font-semibold"
                        style={{
                          color: config.color,
                          backgroundColor: `rgba(${parseInt(
                            config.color.slice(1, 3),
                            16
                          )}, ${parseInt(
                            config.color.slice(3, 5),
                            16
                          )}, ${parseInt(
                            config.color.slice(5, 7),
                            16
                          )}, 0.1)`,
                        }}
                      >
                        {config.label}
                      </span>
                      <span className="font-fredoka font-semibold text-[#1A2B3C] text-sm">
                        {Number(order.totalEGP).toFixed(0)} EGP
                      </span>
                      {expanded ? (
                        <ChevronUp className="w-4 h-4 text-[#8BA3B8]" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-[#8BA3B8]" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Details */}
                {expanded && (
                  <div className="px-4 pb-4 border-t border-[#D0E4F0]">
                    {/* Status Timeline */}
                    {order.status !== "cancelled" && (
                      <div className="py-4">
                        <div className="flex items-center">
                          {statusSteps.map((step, index) => {
                            const isActive = index <= currentStep;
                            const isCurrent = index === currentStep;
                            return (
                              <div
                                key={step}
                                className="flex items-center flex-1"
                              >
                                <div className="flex flex-col items-center flex-1">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
                                      isActive
                                        ? "bg-[#4DA8DA] text-white"
                                        : "bg-[#D0E4F0] text-[#8BA3B8]"
                                    } ${
                                      isCurrent
                                        ? "ring-3 ring-[#4DA8DA]/20"
                                        : ""
                                    }`}
                                  >
                                    {index + 1}
                                  </div>
                                  <span
                                    className={`text-[9px] mt-1 font-medium ${
                                      isActive
                                        ? "text-[#1A2B3C]"
                                        : "text-[#8BA3B8]"
                                    }`}
                                  >
                                    {stepLabels[index]}
                                  </span>
                                </div>
                                {index < 3 && (
                                  <div
                                    className={`h-0.5 flex-1 mx-1 ${
                                      index < currentStep
                                        ? "bg-[#4DA8DA]"
                                        : "bg-[#D0E4F0]"
                                    }`}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Items */}
                    <div className="space-y-2 py-3 border-t border-[#D0E4F0]">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F0F7FB] flex items-center justify-center text-xs">
                              {item.quantity}x
                            </div>
                            <span className="text-sm text-[#1A2B3C]">
                              {item.menuItemName || "Item"}
                            </span>
                          </div>
                          <span className="text-sm text-[#5A7A94]">
                            {Number(item.priceEGP).toFixed(0)} EGP
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total + Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-[#D0E4F0]">
                      <span className="font-fredoka font-bold text-[#1A2B3C]">
                        Total: {Number(order.totalEGP).toFixed(0)} EGP
                      </span>
                      {order.status === "pending" && (
                        <>
                          {cancelConfirm === order.id ? (
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setCancelConfirm(null)}
                                className="px-3 py-1.5 rounded-lg text-xs text-[#5A7A94] hover:bg-[#F0F7FB] transition-colors"
                              >
                                Keep
                              </button>
                              <button
                                onClick={() =>
                                  cancelMutation.mutate({ id: order.id })
                                }
                                className="px-3 py-1.5 rounded-lg text-xs bg-[#E86060] text-white hover:bg-[#D85050] transition-colors"
                              >
                                Cancel Order
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setCancelConfirm(order.id)}
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-[#E86060] hover:bg-[#E86060]/5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                              Cancel
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D0E4F0]">
          <Package className="w-12 h-12 text-[#D0E4F0] mx-auto mb-3" />
          <p className="text-[#8BA3B8] text-sm mb-1">No orders yet</p>
          <p className="text-[#8BA3B8] text-xs">
            Start ordering from the menu to see your orders here
          </p>
        </div>
      )}
    </AppLayout>
  );
}
