import { trpc } from "@/providers/trpc";
import { useCallback, useMemo } from "react";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: "student" | "admin";
}

export function useAuth() {
  const utils = trpc.useUtils();

  const {
    data: user,
    isLoading,
    error,
  } = trpc.auth.me.useQuery(undefined, {
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: async () => {
      localStorage.removeItem("unicafe_token");
      await utils.invalidate();
      window.location.reload();
    },
  });

  const logout = useCallback(() => {
    localStorage.removeItem("unicafe_token");
    logoutMutation.mutate();
    window.location.reload();
  }, [logoutMutation]);

  return useMemo(
    () => ({
      user: (user as AuthUser) ?? null,
      isAuthenticated: !!user,
      isAdmin: user?.role === "admin",
      isStudent: user?.role === "student",
      isLoading,
      error,
      logout,
    }),
    [user, isLoading, error, logout],
  );
}
