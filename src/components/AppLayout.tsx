import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ClipboardList,
  Building2,
  LogOut,
  Menu,
  X,
  ShoppingCart,
} from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
}

const studentNav = [
  { path: "/", label: "Dashboard", icon: LayoutDashboard },
  { path: "/menu", label: "Menu", icon: UtensilsCrossed },
  { path: "/orders", label: "My Orders", icon: ClipboardList },
  { path: "/branches", label: "Branches", icon: Building2 },
];

const adminNav = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Orders", icon: ClipboardList },
  { path: "/admin/menu", label: "Menu Management", icon: UtensilsCrossed },
  { path: "/admin/branches", label: "Branches", icon: Building2 },
];

export default function AppLayout({ children }: AppLayoutProps) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());

  const navItems = isAdmin ? adminNav : studentNav;

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#EBF4FA] font-inter flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-full w-[260px] bg-[#1A2B3C] z-50 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-white/10">
          <div className="w-10 h-10 rounded-xl bg-[#4DA8DA] flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="font-fredoka text-xl font-semibold text-white">
            UniCafe
          </span>
          <button
            className="ml-auto lg:hidden text-white/60 hover:text-white"
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-[#4DA8DA]/15 text-white border-l-[3px] border-[#4DA8DA]"
                    : "text-[#A0B4C8] hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="px-3 py-4 border-t border-white/10 space-y-1">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl">
            <div className="w-9 h-9 rounded-full bg-[#4DA8DA] flex items-center justify-center text-white font-fredoka font-semibold text-sm">
              {user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name || "User"}
              </p>
              <p className="text-[#A0B4C8] text-xs truncate">
                {isAdmin ? "Administrator" : "Student"}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#A0B4C8] hover:bg-white/5 hover:text-white transition-all w-full"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-[260px] min-h-screen flex-1 flex flex-col">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-[#EBF4FA]/80 backdrop-blur-md border-b border-[#D0E4F0]">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/60 transition-colors"
              >
                <Menu className="w-5 h-5 text-[#1A2B3C]" />
              </button>
              <div>
                <h1 className="font-fredoka text-lg font-semibold text-[#1A2B3C]">
                  Welcome back, {user?.name?.split(" ")[0] || "User"}
                </h1>
                <p className="text-xs text-[#5A7A94] hidden sm:block">
                  {isAdmin
                    ? "Manage cafeteria operations"
                    : "Order your favorite meals"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart button (students only) */}
              {!isAdmin && (
                <button
                  onClick={() => navigate("/cart")}
                  className="relative p-2.5 rounded-xl bg-white border border-[#D0E4F0] hover:shadow-md transition-all"
                >
                  <ShoppingCart className="w-5 h-5 text-[#4DA8DA]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#4DA8DA] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </button>
              )}

              {/* Role badge */}
              <div
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  isAdmin
                    ? "bg-[#F0A030]/15 text-[#F0A030]"
                    : "bg-[#4DA8DA]/15 text-[#4DA8DA]"
                }`}
              >
                {isAdmin ? "Admin" : "Student"}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 max-w-[1280px] mx-auto w-full">
          {children}
        </main>

        {/* Copyright Footer - Always at bottom */}
        <footer className="px-4 lg:px-8 py-4 border-t border-[#D0E4F0] bg-[#EBF4FA]/60 backdrop-blur-sm mt-auto">
          <p className="text-center text-xs text-[#5A7A94] font-medium">
            &copy; 2026 Shrouk Adel. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}