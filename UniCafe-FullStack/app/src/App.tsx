import { Routes, Route, Navigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Branches from "./pages/Branches";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminMenu from "./pages/AdminMenu";
import AdminBranches from "./pages/AdminBranches";
import NotFound from "./pages/NotFound";
import ToastContainer from "./components/ToastContainer";

function StudentGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBF4FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#4DA8DA] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <>{children}</>;
}

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#EBF4FA] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#4DA8DA] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Student Routes */}
        <Route
          path="/"
          element={
            <StudentGuard>
              <Home />
            </StudentGuard>
          }
        />
        <Route
          path="/menu"
          element={
            <StudentGuard>
              <Menu />
            </StudentGuard>
          }
        />
        <Route
          path="/orders"
          element={
            <StudentGuard>
              <Orders />
            </StudentGuard>
          }
        />
        <Route
          path="/cart"
          element={
            <StudentGuard>
              <Cart />
            </StudentGuard>
          }
        />
        <Route
          path="/branches"
          element={
            <StudentGuard>
              <Branches />
            </StudentGuard>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <AdminDashboard />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/orders"
          element={
            <AdminGuard>
              <AdminOrders />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/menu"
          element={
            <AdminGuard>
              <AdminMenu />
            </AdminGuard>
          }
        />
        <Route
          path="/admin/branches"
          element={
            <AdminGuard>
              <AdminBranches />
            </AdminGuard>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <ToastContainer />
    </>
  );
}
