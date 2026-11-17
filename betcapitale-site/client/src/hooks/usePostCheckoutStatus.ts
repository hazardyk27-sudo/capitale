import { useEffect, useRef, useState } from "react";
import { queryClient } from "@/lib/queryClient";

export type PostCheckoutStatus = "idle" | "checking" | "confirmed" | "timeout";

/**
 * Verifies a Whop checkout redirect against real membership state instead of
 * trusting the `?success=true` query param on its own. The redirect only tells
 * us Whop finished the checkout flow — it says nothing about whether our own
 * webhook has actually granted the membership yet (or ever will, if the two
 * systems can't be correlated). Polls `/api/auth/me/tier` — the same
 * expiry-aware `getUserMemberTier` source of truth access control uses — so an
 * already-expired or not-yet-granted tier never gets reported as "active".
 * (Deliberately not `/api/auth/me`: that endpoint returns the raw stored
 * `memberTier` column, which stays truthy past `membershipExpiresAt`.)
 */
export function usePostCheckoutStatus(): PostCheckoutStatus {
  const [status, setStatus] = useState<PostCheckoutStatus>("idle");
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (new URLSearchParams(window.location.search).get("success") !== "true") return;
    if (attemptedRef.current) return;
    attemptedRef.current = true;

    setStatus("checking");

    const MAX_ATTEMPTS = 10;
    const INTERVAL_MS = 2000;
    let attempts = 0;
    let cancelled = false;

    async function poll() {
      attempts += 1;
      try {
        const r = await fetch("/api/auth/me/tier");
        if (r.ok) {
          const data = await r.json() as { tier: string | null };
          if (cancelled) return;
          if (data.tier) {
            // Refresh the cached auth/me data too so the rest of the app (nav,
            // membership page, etc.) reflects the newly-active tier right away.
            queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
            setStatus("confirmed");
            return;
          }
        }
      } catch {
        // transient network error — fall through and retry on the next tick
      }
      if (cancelled) return;
      if (attempts >= MAX_ATTEMPTS) {
        setStatus("timeout");
        return;
      }
      setTimeout(poll, INTERVAL_MS);
    }

    // Give the webhook a brief head start before the first check.
    const kickoff = setTimeout(poll, 1200);
    return () => {
      cancelled = true;
      clearTimeout(kickoff);
    };
  }, []);

  return status;
}
