import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  UtensilsCrossed,
  Mail,
  Lock,
  User,
  Shield,
  ArrowRight,
  AlertCircle,
  Coffee,
  Cookie,
  Beef,
} from "lucide-react";

type LoginMode = "student" | "admin";

export default function Login() {
  const [mode, setMode] = useState<LoginMode>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const studentLogin = trpc.auth.studentLogin.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("unicafe_token", data.token);
      window.location.href = "/";
    },
    onError: (err) => {
      setError(err.message || "Invalid email or password");
    },
  });

  const adminLogin = trpc.auth.adminLogin.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("unicafe_token", data.token);
      window.location.href = "/admin";
    },
    onError: (err) => {
      setError(err.message || "Invalid admin credentials");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (mode === "student") {
      studentLogin.mutate({ email, password });
    } else {
      adminLogin.mutate({ email, password });
    }
  };

  const isLoading = studentLogin.isPending || adminLogin.isPending;

  return (
    <div className="min-h-screen flex">
      {/* Left side - Blue gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#3B82F6] to-[#1D4ED8] flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                top: `${15 + i * 15}%`,
                left: `${10 + (i % 3) * 30}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: "3s",
              }}
            >
              <Coffee className="w-12 h-12 text-white" />
            </div>
          ))}
        </div>

        <div className="relative z-10 text-center px-8">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <UtensilsCrossed className="w-10 h-10 text-white" />
          </div>
          <h1
            className="text-4xl font-bold text-white mb-3"
            style={{ fontFamily: "Fredoka, sans-serif" }}
          >
            UniCafe
          </h1>
          <p className="text-white/80 text-lg mb-8">
            University Cafeteria Ordering System
          </p>

          <div className="flex items-center justify-center gap-4 mt-12">
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
              <Coffee className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
              <Beef className="w-7 h-7 text-white" />
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm hover:scale-110 transition-transform">
              <Cookie className="w-7 h-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-[#F0F4F8]">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-[#3B82F6] rounded-xl flex items-center justify-center mx-auto mb-4">
              <UtensilsCrossed className="w-8 h-8 text-white" />
            </div>
            <h1
              className="text-2xl font-bold text-[#0F172A]"
              style={{ fontFamily: "Fredoka, sans-serif" }}
            >
              UniCafe
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-[#E2E8F0] p-6">
            {/* Mode toggle */}
            <div className="flex rounded-xl bg-[#F0F4F8] p-1 mb-6">
              <button
                onClick={() => {
                  setMode("student");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "student"
                    ? "bg-white text-[#3B82F6] shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                <User className="w-4 h-4" />
                Student
              </button>
              <button
                onClick={() => {
                  setMode("admin");
                  setError("");
                }}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  mode === "admin"
                    ? "bg-white text-[#3B82F6] shadow-sm"
                    : "text-[#475569] hover:text-[#0F172A]"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>
            </div>

            <h2 className="text-xl font-bold text-[#0F172A] mb-1" style={{ fontFamily: "Fredoka, sans-serif" }}>
              {mode === "student" ? "Student Login" : "Admin Login"}
            </h2>
            <p className="text-sm text-[#94A3B8] mb-6">
              {mode === "student"
                ? "Sign in with your student email"
                : "Enter any email with admin password"}
            </p>

            {error && (
              <div className="flex items-center gap-2 px-3 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={mode === "student" ? "student@unicafe.edu" : "admin@unicafe.com"}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "student" ? "password123" : "UniCafeAdmin2026!"}
                    className="w-full h-11 pl-10 pr-4 rounded-xl border border-[#E2E8F0] bg-white text-sm text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#3B82F6]/20 focus:border-[#3B82F6] transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {mode === "student" ? "Login as Student" : "Login as Admin"}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {mode === "student" && (
              <p className="text-xs text-center text-[#94A3B8] mt-4">
                Demo: student@unicafe.edu / password123
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
