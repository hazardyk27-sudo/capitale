export const PROMOTION_SOURCES = ["x", "meta", "insta", "ads", "direct"] as const;

export type PromotionSource = (typeof PROMOTION_SOURCES)[number];
export type PromotionResetTarget = "today" | "all" | PromotionSource;

export function isPromotionResetTarget(value: unknown): value is PromotionResetTarget {
  return value === "today" || value === "all" || (typeof value === "string" && PROMOTION_SOURCES.includes(value as PromotionSource));
}

export function getPromotionResetTodayRange(now = new Date()): { from: Date; to: Date } {
  const date = now.toLocaleDateString("en-CA", { timeZone: "Europe/Istanbul" });
  return {
    from: new Date(`${date}T00:00:00+03:00`),
    to: new Date(`${date}T23:59:59.999+03:00`),
  };
}