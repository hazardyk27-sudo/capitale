import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

export type AuthUser = {
  id: number;
  email: string;
  emailVerified: boolean;
  memberTier: "select" | "unlimited" | null;
  membershipExpiresAt: string | null;
};

export function useAuth() {
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ["/api/auth/me"],
    queryFn: async () => {
      const r = await fetch("/api/auth/me");
      if (r.status === 401) return null;
      return r.json();
    },
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return { user: user ?? null, isLoading };
}

export function useLogout() {
  const [, navigate] = useLocation();
  return useMutation({
    mutationFn: () => fetch("/api/auth/logout", { method: "POST" }).then((r) => r.json()),
    onSuccess: () => {
      // Clear ALL cached queries on logout — not just /api/auth/me. Otherwise
      // session-scoped data (e.g. tier-filtered /api/membership/publications)
      // stays cached and can leak into the next account that logs in on the
      // same browser/tab (e.g. an Unlimited member's content briefly showing
      // to a Select member who logs in afterwards).
      queryClient.clear();
      navigate("/");
    },
  });
}
