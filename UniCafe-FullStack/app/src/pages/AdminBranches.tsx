import { trpc } from "@/providers/trpc";
import AppLayout from "@/components/AppLayout";
import {
  MapPin,
  Clock,
  Calendar,
  Building2,
  School,
  Users,
  UtensilsCrossed,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Building2, School, Users, UtensilsCrossed,
};

function isBranchOpen() {
  const now = new Date();
  const day = now.getDay();
  if (day === 5 || day === 6) return false;
  const hour = now.getHours();
  const minutes = now.getMinutes();
  const currentTime = hour * 60 + minutes;
  return currentTime >= 8 * 60 && currentTime < 16 * 60;
}

export default function AdminBranches() {
  const { data: branches, isLoading } = trpc.branch.list.useQuery();

  return (
    <AppLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C]">
          Branch Settings
        </h1>
        <span className="text-sm text-[#8BA3B8]">
          {branches?.length || 0} branches
        </span>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#D0E4F0] p-6 animate-pulse"
            >
              <div className="h-12 w-12 bg-[#F0F7FB] rounded-xl mb-4" />
              <div className="h-4 bg-[#F0F7FB] rounded w-2/3 mb-2" />
              <div className="h-3 bg-[#F0F7FB] rounded w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {branches?.map((branch) => {
            const open = isBranchOpen();
            const BranchIcon = iconMap[branch.icon] || Building2;

            return (
              <div
                key={branch.id}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-6"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${branch.color}15` }}
                  >
                    <span style={{ color: branch.color }}>
                      <BranchIcon className="w-7 h-7" />
                    </span>
                  </div>
                  <div>
                    <h3 className="font-fredoka font-semibold text-[#1A2B3C] text-lg">
                      {branch.name}
                    </h3>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold mt-1 ${
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
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm text-[#5A7A94]">
                    <Calendar className="w-4 h-4 text-[#8BA3B8]" />
                    {branch.workDays}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A7A94]">
                    <Clock className="w-4 h-4 text-[#8BA3B8]" />
                    {branch.openingHours}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-[#5A7A94]">
                    <MapPin className="w-4 h-4 text-[#8BA3B8]" />
                    Campus Main Area
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#D0E4F0]">
                  <p className="text-xs text-[#8BA3B8]">
                    Working days: {branch.workDays}
                  </p>
                  <p className="text-xs text-[#8BA3B8] mt-1">
                    Hours: {branch.openingHours}
                  </p>
                  {!open && (
                    <p className="text-xs text-[#E86060] mt-2 bg-[#E86060]/5 p-2 rounded-lg">
                      This branch is currently closed. Working hours are Sunday
                      Thursday, 8:00 AM 4:00 PM.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
