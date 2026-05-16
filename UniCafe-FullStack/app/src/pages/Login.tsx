import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useToastStore } from "@/store/toastStore";
import { useAuth } from "@/hooks/useAuth";
import {
  UtensilsCrossed,
  User,
  ShieldCheck,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
} from "lucide-react";

type LoginMode = "student" | "admin";

export default function Login() {
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { isAuthenticated, isAdmin } = useAuth();
  const [mode, setMode] = useState<LoginMode>("student");
  const [showPassword, setShowPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Student login/register
  const loginMutation = trpc.auth.login.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("unicafe_token", data.token);
      addToast({
        title: "Welcome back!",
        description: `Logged in as ${data.user.name}`,
        variant: "success",
      });
      window.location.href = "/";
    },
    onError: (err) => {
      addToast({
        title: "Login failed",
        description: err.message,
        variant: "error",
      });
    },
  });

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("unicafe_token", data.token);
      addToast({
        title: "Account created!",
        description: `Welcome, ${data.user.name}`,
        variant: "success",
      });
      window.location.href = "/";
    },
    onError: (err) => {
      addToast({
        title: "Registration failed",
        description: err.message,
        variant: "error",
      });
    },
  });

  // Admin login
  const adminLoginMutation = trpc.auth.adminLogin.useMutation({
    onSuccess: (data) => {
      localStorage.setItem("unicafe_token", data.token);
      addToast({
        title: "Admin access granted",
        description: "Welcome to the admin dashboard",
        variant: "success",
      });
      window.location.href = "/admin";
    },
    onError: (err) => {
      addToast({
        title: "Admin login failed",
        description: err.message,
        variant: "error",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "admin") {
      adminLoginMutation.mutate({ email, adminPassword: password });
    } else {
      if (isRegister) {
        registerMutation.mutate({ name, email, password });
      } else {
        loginMutation.mutate({ email, password });
      }
    }
  };

  const isLoading =
    loginMutation.isPending ||
    registerMutation.isPending ||
    adminLoginMutation.isPending;

  // Redirect if already authenticated
  if (isAuthenticated) {
    if (isAdmin) {
      navigate("/admin");
    } else {
      navigate("/");
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-[#EBF4FA] flex items-center justify-center p-4">
      {/* Hero Section */}
      <div className="w-full max-w-[420px]">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#4DA8DA] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#4DA8DA]/20">
            <UtensilsCrossed className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-fredoka text-3xl font-bold text-[#1A2B3C]">
            UniCafe
          </h1>
          <p className="text-[#5A7A94] mt-1 text-sm">
            University Cafeteria Ordering
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-[#4DA8DA]/5 border border-[#D0E4F0] overflow-hidden">
          {/* Mode Toggle */}
          <div className="flex border-b border-[#D0E4F0]">
            <button
              onClick={() => { setMode("student"); setIsRegister(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                mode === "student"
                  ? "bg-[#4DA8DA]/8 text-[#4DA8DA] border-b-2 border-[#4DA8DA]"
                  : "text-[#8BA3B8] hover:text-[#5A7A94]"
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Student Login
            </button>
            <button
              onClick={() => { setMode("admin"); setIsRegister(false); }}
              className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-all ${
                mode === "admin"
                  ? "bg-[#F0A030]/8 text-[#F0A030] border-b-2 border-[#F0A030]"
                  : "text-[#8BA3B8] hover:text-[#5A7A94]"
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Login
            </button>
          </div>

          {/* Form */}
          <div className="p-6">
            <h2 className="font-fredoka text-xl font-semibold text-[#1A2B3C] mb-1">
              {mode === "admin"
                ? "Admin Access"
                : isRegister
                ? "Create Account"
                : "Student Login"}
            </h2>
            <p className="text-[#8BA3B8] text-sm mb-5">
              {mode === "admin"
                ? "Enter any email with the admin secret password"
                : isRegister
                ? "Register with your university email"
                : "Sign in with your email and password"}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "student" && isRegister && (
                <div>
                  <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA] transition-all"
                      required
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      mode === "admin"
                        ? "admin@unicafe.edu"
                        : "student@unicafe.edu"
                    }
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA] transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A2B3C] mb-1.5">
                  {mode === "admin" ? "Admin Secret Password" : "Password"}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8BA3B8]" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      mode === "admin" ? "Enter admin secret" : "Your password"
                    }
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-[#D0E4F0] bg-[#F0F7FB] text-[#1A2B3C] placeholder-[#8BA3B8] text-sm focus:outline-none focus:ring-2 focus:ring-[#4DA8DA]/30 focus:border-[#4DA8DA] transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8BA3B8] hover:text-[#5A7A94]"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 rounded-xl text-white font-medium text-sm transition-all duration-200 ${
                  mode === "admin"
                    ? "bg-[#F0A030] hover:bg-[#E09020] shadow-lg shadow-[#F0A030]/20"
                    : "bg-[#4DA8DA] hover:bg-[#3D98CA] shadow-lg shadow-[#4DA8DA]/20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isLoading
                  ? "Please wait..."
                  : mode === "admin"
                  ? "Access Admin Panel"
                  : isRegister
                  ? "Create Account"
                  : "Sign In"}
              </button>
            </form>

            {/* Toggle login/register */}
            {mode === "student" && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-sm text-[#4DA8DA] hover:text-[#3D98CA] font-medium transition-colors"
                >
                  {isRegister
                    ? "Already have an account? Sign in"
                    : "Need an account? Register"}
                </button>
              </div>
            )}

            {/* Demo credentials */}
            {mode === "student" && !isRegister && (
              <div className="mt-4 p-3 bg-[#F0F7FB] rounded-xl border border-[#D0E4F0]">
                <p className="text-xs font-medium text-[#5A7A94] mb-1">
                  Demo Credentials
                </p>
                <p className="text-xs text-[#8BA3B8]">
                  Email: student@unicafe.edu
                </p>
                <p className="text-xs text-[#8BA3B8]">Password: password123</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
