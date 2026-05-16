import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { UtensilsCrossed, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-[#EBF4FA] flex items-center justify-center p-4">
      <div className="text-center">
        <div className="w-20 h-20 rounded-2xl bg-[#4DA8DA]/10 flex items-center justify-center mx-auto mb-6">
          <UtensilsCrossed className="w-10 h-10 text-[#4DA8DA]" />
        </div>
        <h1 className="font-fredoka text-6xl font-bold text-[#1A2B3C] mb-2">
          404
        </h1>
        <p className="text-[#5A7A94] mb-6">
          This page could not be found. Let us get you back on track.
        </p>
        <Link
          to={isAdmin ? "/admin" : isAuthenticated ? "/" : "/login"}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#4DA8DA] hover:bg-[#3D98CA] text-white rounded-xl text-sm font-medium transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Link>
      </div>
    </div>
  );
}
