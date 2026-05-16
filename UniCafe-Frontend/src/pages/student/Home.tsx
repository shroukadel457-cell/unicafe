import { Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import {
  Building2,
  School,
  Utensils,
  Users,
  Clock,
  ArrowRight,
  Search,
  ShoppingCart,
  Bell,
  Timer,
  ChefHat,
  CheckCircle2,
  PackageCheck,
  Coffee,
  Beef,
  Cookie,
  Drumstick,
  Sandwich,
  Salad,
  EggFried,
  CupSoda,
  CakeSlice,
  IceCreamCone,
  CircleDot,
  WrapText,
} from "lucide-react";

const branchIconMap: Record<string, React.ElementType> = {
  Building2,
  School,
  Utensils,
  Users,
};

const menuIconMap: Record<string, React.ElementType> = {
  Beef,
  Drumstick,
  Sandwich,
  Salad,
  EggFried,
  CupSoda,
  Coffee,
  CakeSlice,
  IceCreamCone,
  Cookie,
  CircleDot,
  WrapText,
};

function getMenuIcon(iconName: string) {
  return menuIconMap[iconName] || Cookie;
}

export default function StudentHome() {
  const { user } = useAuth();
  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems } = trpc.menu.list.useQuery({});
  const { data: orders } = trpc.order.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const cartCount = useCartStore((s) => s.getItemCount());

  const popularItems = menuItems?.filter((i) => i.popular && i.available).slice(0, 5) || [];
  const latestOrder = orders?.[0];

  const statusConfig = {
    pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Timer },
    preparing: { label: "Preparing", color: "bg-blue-100 text-blue-700", icon: ChefHat },
    ready: { label: "Ready", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
    completed: { label: "Completed", color: "bg-gray-100 text-gray-700", icon: PackageCheck },
    cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: Timer },
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for food..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>
        <div className="flex items-center gap-3">
          <button className="relative w-10 h-10 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center hover:shadow-md transition-shadow">
            <Bell className="w-5 h-5 text-[#475569]" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-[#F0F4F8]" />
          </button>
          <div className="relative">
            <Link
              to="/cafeterias"
              className="w-10 h-10 bg-white rounded-xl border border-[#E2E8F0] flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <ShoppingCart className="w-5 h-5 text-[#475569]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-[#3B82F6] text-white text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#EBF2FF] to-[#F0F4F8] rounded-2xl p-6 overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="space-y-3 z-10">
            <h2
              className="text-2xl font-bold text-[#0F172A]"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              Welcome back, {user?.name?.split(" ")[0] || "Student"}! 👋
            </h2>
            <p className="text-sm text-[#475569] max-w-md">
              Order food from your favorite cafeteria and get notified when it's ready.
            </p>
            <Link
              to="/orders"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#3B82F6] hover:bg-[#2563EB] text-white text-sm font-medium rounded-xl transition-all duration-200"
            >
              View My Orders
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {/* Animated food icons */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm animate-bounce" style={{ animationDuration: "3s" }}>
              <Coffee className="w-10 h-10 text-[#78350F]" />
            </div>
            <div className="w-16 h-16 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm animate-bounce" style={{ animationDuration: "2.5s", animationDelay: "0.5s" }}>
              <Beef className="w-8 h-8 text-[#EF4444]" />
            </div>
            <div className="w-20 h-20 bg-white/80 rounded-2xl flex items-center justify-center shadow-sm animate-bounce" style={{ animationDuration: "3.5s", animationDelay: "1s" }}>
              <Cookie className="w-10 h-10 text-[#B45309]" />
            </div>
          </div>
        </div>
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cafeterias */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                Our Cafeterias
              </h3>
              <Link to="/cafeterias" className="text-sm text-[#3B82F6] hover:underline">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {branches?.map((branch) => {
                const Icon = branchIconMap[branch.icon] || Building2;
                return (
                  <div
                    key={branch.id}
                    className="group bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-lg hover:border-[#3B82F6]/20 transition-all duration-300"
                    style={{ borderTopWidth: "4px", borderTopColor: branch.iconColor }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: branch.iconColor + "15" }}
                      >
                        <Icon className="w-6 h-6" style={{ color: branch.iconColor }} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#0F172A] text-sm">{branch.name}</h4>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              branch.isOpen
                                ? "bg-emerald-100 text-emerald-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {branch.isOpen ? "Open Now" : "Closed"}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#94A3B8] mb-3">
                      <Clock className="w-3.5 h-3.5" />
                      {branch.openingDays}, {branch.openingTime}–{branch.closingTime}
                    </div>
                    <Link
                      to={`/cafeterias?branch=${branch.id}`}
                      className="block w-full text-center py-2 text-sm font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EBF2FF] transition-colors"
                    >
                      View Menu
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
              How It Works
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { step: 1, title: "Choose Cafeteria", desc: "Pick your favorite branch", icon: Building2 },
                { step: 2, title: "Place Order", desc: "Order online easily", icon: ShoppingCart },
                { step: 3, title: "We Prepare", desc: "Fresh food for you", icon: ChefHat },
                { step: 4, title: "Get Notified", desc: "Pick up when ready", icon: CheckCircle2 },
              ].map((s, i) => (
                <div key={s.step} className="relative">
                  <div className="bg-[#EBF2FF] rounded-xl p-4 text-center">
                    <div className="w-8 h-8 bg-[#3B82F6] text-white rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-2">
                      {s.step}
                    </div>
                    <s.icon className="w-5 h-5 text-[#3B82F6] mx-auto mb-1.5" />
                    <p className="text-xs font-semibold text-[#0F172A]">{s.title}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-0.5">{s.desc}</p>
                  </div>
                  {i < 3 && (
                    <ArrowRight className="hidden sm:block absolute -right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#CBD5E1] z-10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right panel */}
        <div className="space-y-6">
          {/* Popular Items */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                Popular Items
              </h3>
              <Link to="/cafeterias" className="text-sm text-[#3B82F6] hover:underline">
                View Menu
              </Link>
            </div>
            <div className="space-y-3">
              {popularItems.map((item) => {
                const ItemIcon = getMenuIcon(item.icon);
                return (
                  <div key={item.id} className="flex items-center gap-3 group">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: item.iconColor + "15" }}
                    >
                      <ItemIcon className="w-5 h-5" style={{ color: item.iconColor }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#0F172A] truncate">{item.name}</p>
                      <p className="text-xs text-[#94A3B8]">{item.priceEGP} EGP</p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                      Available
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current Order */}
          {latestOrder && latestOrder.status !== "completed" && latestOrder.status !== "cancelled" && (
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
              <h3 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
                My Current Order
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0F172A]">
                    Order #{latestOrder.id.toString().padStart(5, "0")}
                  </span>
                  {(() => {
                    const cfg = statusConfig[latestOrder.status as keyof typeof statusConfig];
                    const StatusIcon = cfg?.icon || Timer;
                    return (
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full ${cfg?.color || ""}`}>
                        <StatusIcon className="w-3 h-3" />
                        {cfg?.label}
                      </span>
                    );
                  })()}
                </div>
                <p className="text-xs text-[#94A3B8]">{latestOrder.branch?.name}</p>
                <div className="space-y-1">
                  {latestOrder.items?.map((item) => (
                    <p key={item.id} className="text-xs text-[#475569]">
                      {item.menuItem?.name} x{item.quantity}
                    </p>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-[#E2E8F0]">
                  <span className="text-xs font-semibold text-[#0F172A]">Total</span>
                  <span className="text-sm font-bold text-[#3B82F6]">{latestOrder.totalEGP} EGP</span>
                </div>
                <Link
                  to="/orders"
                  className="block w-full text-center py-2 text-sm font-medium text-[#3B82F6] border border-[#3B82F6] rounded-lg hover:bg-[#EBF2FF] transition-colors"
                >
                  Track Order
                </Link>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5">
            <h3 className="text-lg font-bold text-[#0F172A] mb-4" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Notifications
            </h3>
            {latestOrder ? (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-[#EBF2FF] rounded-lg flex items-center justify-center shrink-0">
                    <Bell className="w-4 h-4 text-[#3B82F6]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#0F172A]">
                      Your order #{latestOrder.id.toString().padStart(5, "0")} is{" "}
                      {latestOrder.status === "pending" ? "pending" : latestOrder.status}!
                    </p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      {latestOrder.branch?.name} - {latestOrder.totalEGP} EGP
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-[#94A3B8]">No notifications yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
