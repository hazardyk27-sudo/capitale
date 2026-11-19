export const WHOP_PLANS = [
  { id: "plan_kkubDpOL8w15B", tier: "standard", label: "Deneme", days: 3, price: 1.00, currency: "eur" },
  { id: "plan_4JIVO6FmgFA79", tier: "standard", label: "Haftalık", days: 7, price: 49.90, currency: "eur" },
  { id: "plan_nKitqATxJmnWA", tier: "standard", label: "2 Haftalık", days: 14, price: 79.90, currency: "eur" },
  { id: "plan_CnxJOkAOfVniJ", tier: "standard", label: "Aylık", days: 30, price: 99.90, currency: "eur" },
  { id: "plan_rgusm9qeT4cHF", tier: "standard", label: "3 Aylık", days: 90, price: 179.90, currency: "eur" },
  { id: "plan_m6JAG7Q7qkdvA", tier: "elite", label: "Haftalık", days: 7, price: 129.90, currency: "eur" },
  { id: "plan_vYX23un8TEEYx", tier: "elite", label: "2 Haftalık", days: 14, price: 199.90, currency: "eur" },
  { id: "plan_rVX9JidE8gmfN", tier: "elite", label: "Aylık", days: 30, price: 249.90, currency: "eur" },
  { id: "plan_xmvI49ZIL0wjH", tier: "elite", label: "3 Aylık", days: 90, price: 399.90, currency: "eur" },
];

export const LEGACY_WHOP_PLANS = [
  { id: "plan_lBt72kE1sk3Jf", tier: "standard", label: "Haftalık", days: 7, price: 49.90, currency: "eur" },
  { id: "plan_1Ty9Fqp2UAFLz", tier: "standard", label: "2 Haftalık", days: 14, price: 79.90, currency: "eur" },
  { id: "plan_zw42pDTHWJ4zu", tier: "standard", label: "Aylık", days: 30, price: 99.90, currency: "eur" },
  { id: "plan_a9dQJJ06lNI5m", tier: "standard", label: "3 Aylık", days: 90, price: 179.90, currency: "eur" },
  { id: "plan_UbJysF7UeVvBE", tier: "elite", label: "Haftalık", days: 7, price: 129.90, currency: "eur" },
  { id: "plan_IyW3QRXibb3jL", tier: "elite", label: "2 Haftalık", days: 14, price: 199.90, currency: "eur" },
  { id: "plan_TWqTvjQAa9TS9", tier: "elite", label: "Aylık", days: 30, price: 249.90, currency: "eur" },
  { id: "plan_MpIeqiuyzO4KP", tier: "elite", label: "3 Aylık", days: 90, price: 399.90, currency: "eur" },
  { id: "plan_5TJSkdk8Xhx9o", tier: "elite", label: "Haftalık", days: 7, price: 99.90, currency: "eur" },
  { id: "plan_Ikppjr71XVqxh", tier: "elite", label: "2 Haftalık", days: 14, price: 159.90, currency: "eur" },
  { id: "plan_sBQtSPgR7sdVL", tier: "elite", label: "Aylık", days: 30, price: 199.90, currency: "eur" },
  { id: "plan_mII3DkdkWfXTW", tier: "elite", label: "3 Aylık", days: 90, price: 359.90, currency: "eur" },
];

const ALL_WHOP_PLANS = [...WHOP_PLANS, ...LEGACY_WHOP_PLANS];

export function isKnownWhopPlanId(planId) {
  return ALL_WHOP_PLANS.some((plan) => plan.id === planId);
}

export function isWhopMembershipValid(status, expiresAt, nowMs = Date.now()) {
  if (!status) return null;
  const hasFutureExpiry = expiresAt !== null && expiresAt.getTime() > nowMs;
  if (status === "one_time") return expiresAt === null || hasFutureExpiry;
  if (["active", "trialing"].includes(status)) return expiresAt === null || hasFutureExpiry;
  if (["past_due", "canceling", "canceled", "completed", "expiring"].includes(status)) return hasFutureExpiry;
  if (["expired", "paused", "banned"].includes(status)) return false;
  return null;
}
