import { useState } from "react";
import { useSearchParams, Link } from "react-router";
import { trpc } from "@/providers/trpc";
import { useCartStore } from "@/stores/cartStore";
import { useToastStore } from "@/stores/toastStore";
import {
  Building2,
  School,
  Utensils,
  Users,
  Plus,
  Minus,
  ShoppingCart,
  X,
  Search,
  ArrowLeft,
  Clock,
  AlertTriangle,
  Beef,
  Coffee,
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
  Trash2,
} from "lucide-react";
import { SidebarLayout } from "@/components/layout/SidebarLayout";

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

const categories = [
  "All",
  "Main Course",
  "Sandwiches",
  "Salads",
  "Breakfast",
  "Drinks",
  "Coffee",
  "Desserts",
  "Snacks",
];

export default function CafeteriasPage() {
  const [searchParams] = useSearchParams();
  const branchId = searchParams.get("branch");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState<number | null>(null);
  const { addToast } = useToastStore();

  const { data: branches } = trpc.branch.list.useQuery();
  const { data: menuItems } = trpc.menu.list.useQuery(
    branchId ? { branchId: Number(branchId), category: activeCategory !== "All" ? activeCategory : undefined, search: searchQuery || undefined } : undefined
  );

  const utils = trpc.useUtils();
  const createOrder = trpc.order.create.useMutation({
    onSuccess: () => {
      addToast("Order placed successfully!", "success");
      cart.clearCart();
      setCartOpen(false);
      utils.order.list.invalidate();
    },
    onError: (err) => {
      addToast(err.message, "error");
    },
  });

  const cart = useCartStore();
  const selectedBranch = branches?.find((b) => b.id === Number(branchId));

  const handleAddToCart = (item: NonNullable<typeof menuItems>[0]) => {
    if (!selectedBranch) return;
    if (cart.branchId !== null && cart.branchId !== selectedBranch.id) {
      setConfirmSwitch(selectedBranch.id);
      return;
    }
    const added = cart.addItem(
      {
        menuItemId: item.id,
        name: item.name,
        price: Number(item.priceEGP),
        icon: item.icon,
        iconColor: item.iconColor,
      },
      selectedBranch.id,
      selectedBranch.name
    );
    if (added) {
      addToast(`${item.name} added to cart`, "success");
    }
  };

  const handleSwitchBranch = () => {
    if (confirmSwitch !== null && selectedBranch) {
      cart.clearCart();
      cart.switchBranch(confirmSwitch, selectedBranch.name);
      setConfirmSwitch(null);
      addToast("Cart cleared for new branch", "info");
    }
  };

  const handleCheckout = () => {
    if (!cart.branchId || cart.items.length === 0) return;
    createOrder.mutate({
      branchId: cart.branchId,
      items: cart.items.map((i) => ({
        menuItemId: i.menuItemId,
        quantity: i.quantity,
      })),
    });
  };

  if (!branchId) {
    // Show branch selection
    return (
      <SidebarLayout>
        <div className="space-y-6 max-w-6xl mx-auto">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
              Our Cafeterias
            </h1>
            <p className="text-sm text-[#94A3B8] mt-1">Choose a cafeteria to view its menu</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {branches?.map((branch) => {
              const Icon = branchIconMap[branch.icon] || Building2;
              return (
                <Link
                  key={branch.id}
                  to={`/cafeterias?branch=${branch.id}`}
                  className="group bg-white border border-[#E2E8F0] rounded-xl p-5 hover:shadow-lg hover:border-[#3B82F6]/20 transition-all duration-300"
                  style={{ borderTopWidth: "4px", borderTopColor: branch.iconColor }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: branch.iconColor + "15" }}
                    >
                      <Icon className="w-7 h-7" style={{ color: branch.iconColor }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#0F172A]">{branch.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full mt-1 ${
                          branch.isOpen
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {branch.isOpen ? "Open Now" : "Closed"}
                      </span>
                    </div>
                    <ArrowLeft className="w-5 h-5 text-[#94A3B8] rotate-180 group-hover:text-[#3B82F6] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </SidebarLayout>
    );
  }

  if (!selectedBranch) return null;

  const Icon = branchIconMap[selectedBranch.icon] || Building2;

  return (
    <SidebarLayout>
      <div className="space-y-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/cafeterias"
              className="w-9 h-9 bg-white border border-[#E2E8F0] rounded-lg flex items-center justify-center hover:shadow-md transition-shadow"
            >
              <ArrowLeft className="w-4 h-4 text-[#475569]" />
            </Link>
            <div className="flex items-center gap-2">
              <Icon className="w-6 h-6" style={{ color: selectedBranch.iconColor }} />
              <h1 className="text-xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                {selectedBranch.name}
              </h1>
              <span
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${
                  selectedBranch.isOpen
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {selectedBranch.isOpen ? "Open Now" : "Closed"}
              </span>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 px-4 py-2 bg-[#3B82F6] text-white rounded-xl hover:bg-[#2563EB] transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="text-sm font-medium">Cart</span>
            {cart.getItemCount() > 0 && (
              <span className="bg-white text-[#3B82F6] text-[11px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                {cart.getItemCount()}
              </span>
            )}
          </button>
        </div>

        {!selectedBranch.isOpen && (
          <div className="flex items-center gap-2 px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-700">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            This branch is currently closed. Working hours are Sunday–Thursday, 8:00 AM–4:00 PM.
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search menu items..."
            className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6]"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#3B82F6] text-white"
                  : "bg-white text-[#475569] border border-[#E2E8F0] hover:border-[#3B82F6]/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {menuItems?.map((item) => {
            const ItemIcon = getMenuIcon(item.icon);
            const cartItem = cart.items.find((ci) => ci.menuItemId === item.id);
            return (
              <div
                key={item.id}
                className="bg-white border border-[#E2E8F0] rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: item.iconColor + "15" }}
                  >
                    <ItemIcon className="w-6 h-6" style={{ color: item.iconColor }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-[#0F172A] truncate">{item.name}</h4>
                    <p className="text-xs text-[#94A3B8] line-clamp-2 mt-0.5">{item.description}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-[#3B82F6]">{item.priceEGP} EGP</span>
                      {item.available ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Available
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-red-500">Not Available</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  {!cartItem ? (
                    <button
                      onClick={() => handleAddToCart(item)}
                      disabled={!item.available || !selectedBranch.isOpen}
                      className="flex-1 py-2 bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#E2E8F0] disabled:text-[#94A3B8] text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex-1 flex items-center justify-between bg-[#F0F4F8] rounded-lg px-3 py-2">
                      <button
                        onClick={() => cart.updateQuantity(cartItem.menuItemId, cartItem.quantity - 1)}
                        className="w-7 h-7 bg-white rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#475569]" />
                      </button>
                      <span className="text-sm font-semibold text-[#0F172A]">{cartItem.quantity}</span>
                      <button
                        onClick={() => cart.updateQuantity(cartItem.menuItemId, cartItem.quantity + 1)}
                        className="w-7 h-7 bg-white rounded-md flex items-center justify-center hover:shadow-sm transition-shadow"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#475569]" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {menuItems?.length === 0 && (
          <div className="text-center py-12">
            <Cookie className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
            <p className="text-sm text-[#94A3B8]">No items found</p>
          </div>
        )}
      </div>

      {/* Cart slide-out panel */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setCartOpen(false)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <h3 className="text-lg font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
                Your Cart
              </h3>
              <button
                onClick={() => setCartOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-[#F0F4F8] flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-[#475569]" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              {cart.items.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-[#CBD5E1] mx-auto mb-3" />
                  <p className="text-sm text-[#94A3B8]">Your cart is empty</p>
                  <p className="text-xs text-[#CBD5E1] mt-1">Browse the menu to add items</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.branchName && (
                    <div className="flex items-center gap-2 text-sm text-[#475569]">
                      <Clock className="w-4 h-4 text-[#3B82F6]" />
                      Ordering from: <span className="font-semibold">{cart.branchName}</span>
                    </div>
                  )}
                  {cart.items.map((item) => {
                    const ItemIcon = getMenuIcon(item.icon);
                    return (
                      <div key={item.menuItemId} className="flex items-center gap-3 bg-[#F8FAFC] rounded-xl p-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                          style={{ backgroundColor: item.iconColor + "15" }}
                        >
                          <ItemIcon className="w-5 h-5" style={{ color: item.iconColor }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#0F172A] truncate">{item.name}</p>
                          <p className="text-xs text-[#94A3B8]">{item.price} EGP each</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => cart.updateQuantity(item.menuItemId, item.quantity - 1)}
                            className="w-7 h-7 bg-white border border-[#E2E8F0] rounded-md flex items-center justify-center hover:shadow-sm"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-sm font-semibold w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => cart.updateQuantity(item.menuItemId, item.quantity + 1)}
                            className="w-7 h-7 bg-white border border-[#E2E8F0] rounded-md flex items-center justify-center hover:shadow-sm"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-[#0F172A] w-16 text-right">
                          {(item.price * item.quantity).toFixed(2)} EGP
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {cart.items.length > 0 && (
              <div className="border-t border-[#E2E8F0] p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[#475569]">Subtotal</span>
                  <span className="text-lg font-bold text-[#0F172A]">{cart.getTotal().toFixed(2)} EGP</span>
                </div>
                <button
                  onClick={() => cart.clearCart()}
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear Cart
                </button>
                <button
                  onClick={handleCheckout}
                  disabled={createOrder.isPending}
                  className="w-full py-3 bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-60 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  {createOrder.isPending ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Checkout</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm switch modal */}
      {confirmSwitch !== null && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setConfirmSwitch(null)} />
          <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl">
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Switch Cafeteria?</h3>
            <p className="text-sm text-[#475569] mb-4">
              Switching cafeterias will clear your current cart. Continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSwitch(null)}
                className="flex-1 py-2.5 border border-[#E2E8F0] text-[#475569] rounded-xl text-sm font-medium hover:bg-[#F0F4F8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSwitchBranch}
                className="flex-1 py-2.5 bg-[#EF4444] text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Clear & Switch
              </button>
            </div>
          </div>
        </div>
      )}
    </SidebarLayout>
  );
}
