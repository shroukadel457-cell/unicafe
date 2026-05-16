import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

type AuthUser = {
  id: number;
  name: string | null;
  email: string | null;
  role: string;
};

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logout = useCallback(() => {
    localStorage.removeItem("unicafe_token");
    utils.invalidate();
    window.location.reload();
  }, [utils]);

  return useMemo(
    () => ({
      user: (user as AuthUser) ?? null,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isStudent: user?.role === "student",
      isLoading,
      error,
      logout,
      refresh: refetch,
    }),
    [user, isLoading, error, logout, refetch]
  );
}
