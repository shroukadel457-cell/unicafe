import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import {
  TrendingUp,
  ShoppingBag,
  Clock3,
  Package,
  Flame,
  MapPin,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  Beef,
  Coffee,
  Cake,
  Salad,
  GlassWater,
  Cookie,
  Drumstick,
  Pizza,
  ChefHat,
  IceCreamCone,
  Cherry,
  Milk,
  Fish,
  Sandwich,
  Egg,
  CupSoda,
  Donut,
  UtensilsCrossed,
  Building2,
  School,
  Users,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef, Coffee, Cake, Salad, GlassWater, Cookie, Drumstick, Pizza,
  ChefHat, IceCreamCone, Cherry, Milk, Fish, Sandwich, Egg,
  CupSoda, Donut, UtensilsCrossed, Building2, School, Users,
};

function getMenuIcon(iconName: string) {
  const Icon = iconMap[iconName] || Cookie;
  return Icon;
}

function getBranchIcon(iconName: string) {
  const Icon = iconMap[iconName] || Building2;
  return Icon;
}

function isBranchOpen() {
  const now = new Date();
  const day = now.getDay();
  if (day === 5 || day === 6) return false;
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hour * 60 + minutes;
  const openTime = 8 * 60;
  const closeTime = 16 * 60;
  return currentTime >= openTime && currentTime < closeTime;
}

export default function Home() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((s) => s.addItem);

  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems } = trpc.menu.list.useQuery({});
  const { data: myOrders } = trpc.order.myOrders.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  const popularItems =
    menuItems?.filter((item) => item.popular && item.available).slice(0, 6) ||
    [];

  const activeOrder = myOrders?.find(
    (o) => o.status === "pending" || o.status === "preparing" || o.status === "ready"
  );

  const handleAddToCart = (item: (typeof popularItems)[0]) => {
    if (!isAuthenticated) {
      addToast({
        title: "Please sign in",
        description: "Sign in to add items to your cart",
        variant: "warning",
      });
      return;
    }

    const branch = branches?.find((b) => b.id === item.branchId);
    addItem({
      menuItemId: item.id,
      name: item.name,
      price: Number(item.priceEGP),
      icon: item.icon,
      branchId: item.branchId,
      branchName: branch?.name || "Unknown",
    });

    addToast({
      title: "Added to cart",
      description: `${item.name} added`,
      variant: "success",
    });
  };

  return (
    <AppLayout>
      {/* Hero */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-6 lg:p-8 mb-6 relative overflow-hidden">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4DA8DA]/10 text-[#4DA8DA] text-xs font-medium mb-4">
            <TrendingUp className="w-3.5 h-3.5" />
            Fresh meals daily
          </div>
          <h1 className="font-fredoka text-2xl lg:text-3xl font-bold text-[#1A2B3C] mb-2">
            Fresh from the campus kitchen
          </h1>
          <p className="text-[#5A7A94] text-sm max-w-md mb-5">
            Order your favorite meals from any cafeteria branch and pick them up
            in minutes. Quick, easy, and delicious.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DA8DA] hover:bg-[#3D98CA] text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-[#4DA8DA]/20"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Menu
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#4DA8DA]/5 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 right-20 w-32 h-32 bg-[#7DC8F0]/5 rounded-full translate-y-1/2" />
      </div>

      {/* Active Order Tracking */}
      {activeOrder && (
        <div className="mb-6 bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#4DA8DA]/10 flex items-center justify-center">
                <Clock3 className="w-5 h-5 text-[#4DA8DA]" />
              </div>
              <div>
                <h2 className="font-fredoka text-lg font-semibold text-[#1A2B3C]">
                  Order #{activeOrder.id}
                </h2>
                <p className="text-xs text-[#5A7A94]">
                  {activeOrder.branchName} &middot; {activeOrder.items.length} items
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                activeOrder.status === "pending"
                  ? "bg-[#F0A030]/10 text-[#F0A030]"
                  : activeOrder.status === "preparing"
                  ? "bg-[#4DA8DA]/10 text-[#4DA8DA]"
                  : "bg-[#4CAF7D]/10 text-[#4CAF7D]"
              }`}
            >
              {activeOrder.status.charAt(0).toUpperCase() +
                activeOrder.status.slice(1)}
            </span>
          </div>

          <div className="flex items-center gap-0">
            {["pending", "preparing", "ready", "completed"].map(
              (step, index) => {
                const stepOrder = ["pending", "preparing", "ready", "completed"];
                const currentIndex = stepOrder.indexOf(activeOrder.status);
                const isActive = index <= currentIndex;
                const isCurrent = index === currentIndex;
                const labels = ["Placed", "Preparing", "Ready", "Completed"];

                return (
                  <div key={step} className="flex items-center flex-1">
                    <div className="flex flex-col items-center flex-1">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? "bg-[#4DA8DA] text-white"
                            : "bg-[#D0E4F0] text-[#8BA3B8]"
                        } ${isCurrent ? "ring-4 ring-[#4DA8DA]/20" : ""}`}
                      >
                        {index + 1}
                      </div>
                      <span
                        className={`text-[10px] mt-1.5 font-medium ${
                          isActive ? "text-[#1A2B3C]" : "text-[#8BA3B8]"
                        }`}
                      >
                        {labels[index]}
                      </span>
                    </div>
                    {index < 3 && (
                      <div
                        className={`h-0.5 flex-1 mx-2 ${
                          index < currentIndex ? "bg-[#4DA8DA]" : "bg-[#D0E4F0]"
                        }`}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Branch Cards */}
      <div className="mb-6">
        <h2 className="font-fredoka text-lg font-semibold text-[#1A2B3C] mb-3 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#4DA8DA]" />
          Cafeteria Branches
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {branches?.map((branch) => {
            const open = isBranchOpen();
            const BranchIcon = getBranchIcon(branch.icon);

            return (
              <div
                key={branch.id}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-4 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
                onClick={() => navigate(`/menu?branch=${branch.id}`)}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${branch.color}15` }}
                >
                  <BranchIcon className="w-6 h-6" />
                </div>
                <h3 className="font-fredoka font-semibold text-[#1A2B3C] mb-1">
                  {branch.name}
                </h3>
                <p className="text-xs text-[#8BA3B8] mb-1">
                  {branch.workDays} &middot; {branch.openingHours}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold ${
                      open
                        ? "bg-[#4CAF7D]/10 text-[#4CAF7D]"
                        : "bg-[#E86060]/10 text-[#E86060]"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        open ? "bg-[#4CAF7D]" : "bg-[#E86060]"
                      }`}
                    />
                    {open ? "Open Now" : "Closed"}
                  </span>
                  <ChevronRight className="w-4 h-4 text-[#8BA3B8] group-hover:text-[#4DA8DA] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Popular Items */}
      <div>
        <h2 className="font-fredoka text-lg font-semibold text-[#1A2B3C] mb-3 flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#F0A030]" />
          Popular Items
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {popularItems.map((item) => {
            const MenuIcon = getMenuIcon(item.icon);
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-32 bg-[#F0F7FB] flex items-center justify-center border-b border-[#D0E4F0] group-hover:bg-[#E8F4FA] transition-colors">
                  <MenuIcon className="w-12 h-12 text-[#4DA8DA] group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-fredoka font-medium text-[#1A2B3C] text-sm">
                      {item.name}
                    </h3>
                    <span className="text-[#4DA8DA] font-fredoka font-semibold text-sm">
                      {Number(item.priceEGP).toFixed(0)} EGP
                    </span>
                  </div>
                  <p className="text-xs text-[#8BA3B8] mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(item);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[#F0F7FB] hover:bg-[#4DA8DA] text-[#4DA8DA] hover:text-white text-xs font-medium transition-all border border-[#D0E4F0] hover:border-[#4DA8DA]"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {popularItems.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#D0E4F0]">
            <Package className="w-12 h-12 text-[#D0E4F0] mx-auto mb-3" />
            <p className="text-[#8BA3B8] text-sm">No popular items available</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
