import { useState, useEffect } from "react";
import { useSearchParams } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import { useAuth } from "@/hooks/useAuth";
import AppLayout from "@/components/AppLayout";
import {
  Search,
  Plus,
  Minus,
  ShoppingCart,
  X,
  SlidersHorizontal,
  Package,
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
  Building2,
  School,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Beef, Coffee, Cake, Salad, GlassWater, Cookie, Drumstick, Pizza,
  ChefHat, IceCreamCone, Cherry, Milk, Fish, Sandwich, Egg,
  CupSoda, Donut, Building2, School, Users, UtensilsCrossed,
};

const categories = [
  { value: "all", label: "All Items" },
  { value: "main_course", label: "Main Course" },
  { value: "sandwiches", label: "Sandwiches" },
  { value: "salads", label: "Salads" },
  { value: "drinks", label: "Drinks" },
  { value: "desserts", label: "Desserts" },
  { value: "coffee", label: "Coffee" },
  { value: "breakfast", label: "Breakfast" },
  { value: "snacks", label: "Snacks" },
];

export default function Menu() {
  const [searchParams] = useSearchParams();
  const { addToast } = useToastStore();
  const { isAuthenticated } = useAuth();
  const addItem = useCartStore((s) => s.addItem);
  const cartBranchId = useCartStore((s) => s.branchId);
  const setBranch = useCartStore((s) => s.setBranch);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<number | undefined>(
    searchParams.get("branch")
      ? Number(searchParams.get("branch"))
      : undefined
  );
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems, isLoading } = trpc.menu.list.useQuery({
    branchId: selectedBranch,
    category: activeCategory === "all" ? undefined : activeCategory,
    search: search || undefined,
  });

  // Auto-set branch when cart is from different branch
  useEffect(() => {
    if (selectedBranch && cartBranchId && selectedBranch !== cartBranchId) {
      const branch = branches?.find((b) => b.id === selectedBranch);
      if (branch) {
        setBranch(selectedBranch, branch.name);
        addToast({
          title: "Branch changed",
          description: `Cart cleared for ${branch.name}`,
          variant: "warning",
        });
      }
    }
  }, [selectedBranch]);

  const handleAddToCart = (item: NonNullable<typeof menuItems>[0]) => {
    if (!isAuthenticated) {
      addToast({
        title: "Please sign in",
        description: "Sign in to add items to cart",
        variant: "warning",
      });
      return;
    }

    const qty = quantities[item.id] || 1;
    const branch = branches?.find((b) => b.id === item.branchId);

    for (let i = 0; i < qty; i++) {
      addItem({
        menuItemId: item.id,
        name: item.name,
        price: Number(item.priceEGP),
        icon: item.icon,
        branchId: item.branchId,
        branchName: branch?.name || "Unknown",
      });
    }

    addToast({
      title: "Added to cart",
      description: `${qty}x ${item.name}`,
      variant: "success",
    });
    setQuantities((prev) => ({ ...prev, [item.id]: 1 }));
  };

  const updateQty = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
          Menu Explorer
        </h1>

        {/* Search */}
        <div className="relative w-full lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search food items..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-white text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8BA3B8] hover:text-[#1A2B3C]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Branch Pills */}
      <div className="mb-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedBranch(undefined)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              !selectedBranch
                ? "bg-[#4DA8DA] text-white shadow-md shadow-[#4DA8DA]/20"
                : "bg-white text-[#5A7A94] border border-[#D0E4F0] hover:border-[#4DA8DA]"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            All Branches
          </button>
          {branches?.map((branch) => {
            const Icon = iconMap[branch.icon] || Building2;
            return (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  selectedBranch === branch.id
                    ? "text-white shadow-md"
                    : "bg-white text-[#5A7A94] border border-[#D0E4F0] hover:border-[#4DA8DA]"
                }`}
                style={
                  selectedBranch === branch.id
                    ? { backgroundColor: branch.color }
                    : undefined
                }
              >
                <Icon className="w-4 h-4" />
                {branch.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filters */}
      <div className="mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat.value
                  ? "bg-[#4DA8DA]/10 text-[#4DA8DA] border border-[#4DA8DA]/30"
                  : "bg-white text-[#8BA3B8] border border-[#D0E4F0] hover:text-[#5A7A94]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Items Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#D0E4F0] overflow-hidden animate-pulse"
            >
              <div className="h-32 bg-[#F0F7FB]" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-[#F0F7FB] rounded w-2/3" />
                <div className="h-3 bg-[#F0F7FB] rounded w-full" />
                <div className="h-8 bg-[#F0F7FB] rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : menuItems && menuItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems.map((item) => {
            if (!item.available) return null;
            const MenuIcon = iconMap[item.icon] || Cookie;
            const qty = quantities[item.id] || 1;

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="h-32 bg-[#F0F7FB] flex items-center justify-center border-b border-[#D0E4F0] group-hover:bg-[#E8F4FA] transition-colors">
                  <MenuIcon className="w-12 h-12 text-[#4DA8DA] group-hover:scale-110 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
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

                  {/* Quantity + Add */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-[#F0F7FB] rounded-lg border border-[#D0E4F0]">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="p-1.5 text-[#8BA3B8] hover:text-[#1A2B3C] transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-sm font-medium text-[#1A2B3C] w-5 text-center">
                        {qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1.5 text-[#8BA3B8] hover:text-[#1A2B3C] transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[#4DA8DA] hover:bg-[#3D98CA] text-white text-xs font-medium transition-all shadow-md shadow-[#4DA8DA]/15"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#D0E4F0]">
          <Package className="w-12 h-12 text-[#D0E4F0] mx-auto mb-3" />
          <p className="text-[#8BA3B8] text-sm mb-1">No items found</p>
          <p className="text-[#8BA3B8] text-xs">
            Try adjusting your filters or search
          </p>
        </div>
      )}
    </AppLayout>
  );
}
