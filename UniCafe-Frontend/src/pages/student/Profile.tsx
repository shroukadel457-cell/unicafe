import { useAuth } from "@/hooks/useAuth";
import { SidebarLayout } from "@/components/layout/SidebarLayout";
import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user, isAdmin } = useAuth();

  return (
    <SidebarLayout>
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-[#0F172A]" style={{ fontFamily: "Fredoka, sans-serif" }}>
          Profile
        </h1>

        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-[#EBF2FF] rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-[#3B82F6]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">{user?.name}</h2>
              <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mt-1 ${isAdmin ? "bg-purple-100 text-purple-600" : "bg-blue-100 text-blue-600"}`}>
                {isAdmin ? "Administrator" : "Student"}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
              <Mail className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="text-xs text-[#94A3B8]">Email</p>
                <p className="text-sm font-medium text-[#0F172A]">{user?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
              <Shield className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="text-xs text-[#94A3B8]">Role</p>
                <p className="text-sm font-medium text-[#0F172A] capitalize">{user?.role}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-[#F8FAFC] rounded-xl">
              <Calendar className="w-5 h-5 text-[#3B82F6]" />
              <div>
                <p className="text-xs text-[#94A3B8]">Member Since</p>
                <p className="text-sm font-medium text-[#0F172A]">{new Date().toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
