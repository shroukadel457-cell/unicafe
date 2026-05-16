import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import AppLayout from "@/components/AppLayout";
import {
  MapPin,
  Clock,
  Calendar,
  ChevronRight,
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
  const openTime = 8 * 60;
  const closeTime = 16 * 60;
  return currentTime >= openTime && currentTime < closeTime;
}

export default function Branches() {
  const navigate = useNavigate();
  const { data: branches, isLoading } = trpc.branch.list.useQuery();

  return (
    <AppLayout>
      <h1 className="font-fredoka text-2xl font-bold text-[#1A2B3C] mb-6">
        Cafeteria Branches
      </h1>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#D0E4F0] p-5 animate-pulse"
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
                onClick={() => navigate(`/menu?branch=${branch.id}`)}
                className="bg-white rounded-2xl shadow-sm border border-[#D0E4F0] p-5 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${branch.color}15` }}
                  >
                    <span style={{ color: branch.color }}>
                      <BranchIcon className="w-7 h-7" />
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-fredoka font-semibold text-[#1A2B3C]">
                        {branch.name}
                      </h3>
                      <ChevronRight className="w-4 h-4 text-[#8BA3B8] group-hover:text-[#4DA8DA] transition-colors" />
                    </div>

                    <div className="space-y-1.5 mt-2">
                      <div className="flex items-center gap-2 text-xs text-[#8BA3B8]">
                        <Calendar className="w-3.5 h-3.5" />
                        {branch.workDays}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8BA3B8]">
                        <Clock className="w-3.5 h-3.5" />
                        {branch.openingHours}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#8BA3B8]">
                        <MapPin className="w-3.5 h-3.5" />
                        Campus Main Area
                      </div>
                    </div>

                    <div className="mt-3">
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
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AppLayout>
  );
}
