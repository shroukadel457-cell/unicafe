import { useToastStore } from "@/store/toastStore";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

const icons = {
  default: Info,
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertCircle,
};

const colors = {
  default: "border-l-[#4DA8DA] bg-white",
  success: "border-l-[#4CAF7D] bg-white",
  error: "border-l-[#E86060] bg-white",
  warning: "border-l-[#F0A030] bg-white",
};

const iconColors = {
  default: "text-[#4DA8DA]",
  success: "text-[#4CAF7D]",
  error: "text-[#E86060]",
  warning: "text-[#F0A030]",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {toasts.map((toast) => {
        const Icon = icons[toast.variant || "default"];
        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border-l-[3px] ${
              colors[toast.variant || "default"]
            } min-w-[320px] max-w-[400px] animate-in slide-in-from-top-2 fade-in duration-300`}
          >
            <Icon
              className={`w-5 h-5 mt-0.5 ${
                iconColors[toast.variant || "default"]
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1A2B3C]">
                {toast.title}
              </p>
              {toast.description && (
                <p className="text-xs text-[#5A7A94] mt-0.5">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8BA3B8] hover:text-[#1A2B3C] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
