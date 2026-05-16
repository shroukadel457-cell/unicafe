import { useState } from "react";
import { Link, useLocation } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/stores/cartStore";
import {
  Home,
  Utensils,
  ClipboardList,
  User,
  LayoutDashboard,
  BookOpen,
  BarChart3,
  LogOut,
  Menu,
  X,
  UtensilsCrossed,
} from "lucide-react";
import { ToastContainer } from "./ToastContainer";

const studentNav = [
  { path: "/", label: "Home", icon: Home },
  { path: "/cafeterias", label: "Cafeterias", icon: Utensils },
  { path: "/orders", label: "My Orders", icon: ClipboardList },
  { path: "/profile", label: "Profile", icon: User },
];

const adminNav = [
  { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { path: "/admin/orders", label: "Orders", icon: ClipboardList },
  { path: "/admin/menu", label: "Menu Items", icon: BookOpen },
  { path: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cartCount = useCartStore((s) => s.getItemCount());

  const navItems = isAdmin ? adminNav : studentNav;

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]">
      <ToastContainer />

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-white p-2 rounded-lg shadow-md border border-[#E2E8F0]"
      >
        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-white border-r border-[#E2E8F0] shadow-[2px_0_8px_rgba(0,0,0,0.04)] z-40 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-[#E2E8F0]">
          <div className="w-9 h-9 bg-[#3B82F6] rounded-lg flex items-center justify-center">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span
            className="text-xl font-bold text-[#0F172A]"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            UniCafe
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="px-3 mb-2">
            <span className="text-[11px] font-semibold text-[#94A3B8] uppercase tracking-wider">
              {isAdmin ? "Admin Side" : "Student Side"}
            </span>
          </div>

          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#EBF2FF] text-[#3B82F6] border-l-[3px] border-[#3B82F6]"
                    : "text-[#475569] hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
                {item.path === "/cafeterias" && cartCount > 0 && (
                  <span className="ml-auto bg-[#3B82F6] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                    {cartCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User mini-card */}
        {user && (
          <div className="px-4 py-4 border-t border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#EBF2FF] rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-[#3B82F6]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[#0F172A] truncate">
                  {user.name}
                </p>
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                    isAdmin
                      ? "bg-purple-100 text-purple-600"
                      : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {isAdmin ? "Admin" : "Student"}
                </span>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </button>
          </div>
        )}
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="p-4 lg:p-6 pt-16 lg:pt-6">{children}</div>
      </main>
    </div>
  );
}
