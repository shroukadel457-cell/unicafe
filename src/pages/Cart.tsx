import { useState } from "react";
import { useNavigate } from "react-router";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  Package,
  MapPin,
  Clock,
} from "lucide-react";

export default function Cart() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuth();
  const {
    items,
    branchId,
    branchName,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [isPlacing, setIsPlacing] = useState(false);

  const placeOrder = trpc.order.place.useMutation({
    onSuccess: () => {
      addToast({
        title: "Order placed!",
        description: "Your order is being prepared",
        variant: "success",
      });
      clearCart();
      navigate("/orders");
    },
    onError: (err) => {
      addToast({
        title: "Order failed",
        description: err.message,
        variant: "error",
      });
      setIsPlacing(false);
    },
  });

  const handleCheckout = () => {
    if (!isAuthenticated) {
      addToast({
        title: "Please sign in",
        description: "Sign in to place your order",
        variant: "warning",
      });
      return;
    }

    if (!branchId || items.length === 0) return;

    setIsPlacing(true);
    const total = getTotal();

    placeOrder.mutate({
      branchId,
      items: items.map((item) => ({
        menuItemId: item.menuItemId,
        quantity: item.quantity,
      })),
      totalEGP: total,
    });
  };

  if (items.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl border border-[#D0E4F0] p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#F0F7FB] flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-[#D0E4F0]" />
            </div>
            <h2 className="font-fredoka text-xl font-semibold text-[#1A2B3C] mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-[#8BA3B8] mb-5">
              Browse the menu and add your favorite items
            </p>
            <button
              onClick={() => navigate("/menu")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DA8DA] hover:bg-[#3D98CA] text-white rounded-xl text-sm font-medium transition-all"
            >
              Explore Menu
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const total = getTotal();

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C] flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-[#4DA8DA]" />
            Your Cart
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-[#E86060] hover:text-[#D85050] font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        {/* Branch Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-4 mb-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#4DA8DA]/10 flex items-center justify-center">
            <MapPin className="w-5 h-5 text-[#4DA8DA]" />
          </div>
          <div>
            <p className="text-xs text-[#8BA3B8]">Ordering from</p>
            <p className="font-fredoka font-semibold text-[#1A2B3C] text-sm">
              {branchName}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[#4CAF7D]">
            <Clock className="w-3.5 h-3.5" />
            Est. 8-12 min
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden mb-4">
          <div className="divide-y divide-[#D0E4F0]">
            {items.map((item) => (
              <div
                key={item.menuItemId}
                className="flex items-center gap-4 p-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#F0F7FB] flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-[#4DA8DA]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#1A2B3C] truncate">
                    {item.name}
                  </h3>
                  <p className="text-xs text-[#4DA8DA] font-fredoka font-medium">
                    {item.price.toFixed(0)} EGP each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.menuItemId,
                        item.quantity - 1
                      )
                    }
                    className="w-7 h-7 rounded-lg bg-[#F0F7FB] hover:bg-[#4DA8DA]/10 flex items-center justify-center transition-colors"
                  >
                    {item.quantity <= 1 ? (
                      <Trash2 className="w-3.5 h-3.5 text-[#E86060]" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-[#5A7A94]" />
                    )}
                  </button>
                  <span className="text-sm font-medium text-[#1A2B3C] w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(
                        item.menuItemId,
                        item.quantity + 1
                      )
                    }
                    className="w-7 h-7 rounded-lg bg-[#F0F7FB] hover:bg-[#4DA8DA]/10 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#5A7A94]" />
                  </button>
                </div>
                <p className="text-sm font-fredoka font-semibold text-[#1A2B3C] min-w-[60px] text-right">
                  {(item.price * item.quantity).toFixed(0)} EGP
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 mb-4">
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#8BA3B8]">Items ({getItemCount()})</span>
              <span className="text-[#1A2B3C]">{total.toFixed(0)} EGP</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8BA3B8]">Service</span>
              <span className="text-[#4CAF7D]">Free</span>
            </div>
            <div className="border-t border-[#D0E4F0] pt-2 flex justify-between">
              <span className="font-fredoka font-semibold text-[#1A2B3C]">
                Total
              </span>
              <span className="font-fredoka font-bold text-lg text-[#4DA8DA]">
                {total.toFixed(0)} EGP
              </span>
            </div>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={isPlacing || items.length === 0}
          className="w-full py-3 bg-[#4DA8DA] hover:bg-[#3D98CA] disabled:bg-[#D0E4F0] disabled:cursor-not-allowed text-white rounded-xl font-medium text-sm transition-all shadow-lg shadow-[#4DA8DA]/20 flex items-center justify-center gap-2"
        >
          {isPlacing ? "Placing Order..." : "Place Order"}
          {!isPlacing && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </AppLayout>
  );
}
