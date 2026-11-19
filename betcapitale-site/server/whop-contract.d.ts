export interface WhopPlanMeta {
  id: string;
  tier: "standard" | "elite";
  label: string;
  days: number;
  price: number;
  currency: string;
}
export const WHOP_PLANS: WhopPlanMeta[];
export const LEGACY_WHOP_PLANS: WhopPlanMeta[];
export function isKnownWhopPlanId(planId: string): boolean;
export function isWhopMembershipValid(status: string | null | undefined, expiresAt: Date | null, nowMs?: number): boolean | null;
