import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import type { CouponWithSelections } from "@shared/schema";
import { BetSlipCard, deriveSettledStatus } from "@/components/BetSlipCard";

export default function Coupons() {
  const { data: allCoupons = [], isLoading } = useQuery<CouponWithSelections[]>({
    queryKey: ["/api/coupons"],
  });

  // Only show fully settled coupons (Won / Lost / Void) — never open/pending
  const coupons = allCoupons.filter((c) => deriveSettledStatus(c) !== null);

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111111", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* ── site nav (minimal) ───────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#0a0a0a", borderBottom: "1px solid #1f1f1f", padding: "8px 16px", display: "flex", justifyContent: "flex-end", gap: 16 }}>
        <Link href="/" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>Profit Chart</Link>
        <Link href="/matches" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>Matches</Link>
        <Link href="/admin/coupons" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>Admin</Link>
      </div>

      {/* ── content area ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 468, width: "calc(100% - 20px)", margin: "0 auto", paddingTop: 16, paddingBottom: 24 }}>
        {isLoading && (
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "48px 0" }}>Loading…</p>
        )}

        {!isLoading && coupons.length === 0 && (
          <p style={{ textAlign: "center", color: "#94A3B8", fontSize: 13, padding: "48px 0" }}>
            No settled coupons yet.{" "}
            <Link href="/admin/coupons" style={{ color: "#16844A" }}>Add one →</Link>
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {coupons.map((c) => (
            <div key={c.id}>
              {/* ── outer app header (per-coupon) ─────────────────────── */}
              <div
                style={{
                  height: 34,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingLeft: 4,
                  paddingRight: 4,
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 400, color: "#94A3B8", lineHeight: 1 }}>{c.placedAt}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>SmartXFlow</span>
              </div>

              {/* ── receipt card ──────────────────────────────────────── */}
              <BetSlipCard coupon={c} />

              {/* ── view button (outside card) ────────────────────────── */}
              <Link
                href={`/coupons/${c.id}`}
                data-testid={`link-view-coupon-${c.id}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 38,
                  marginTop: 8,
                  backgroundColor: "transparent",
                  border: "1px solid #16844A",
                  color: "#16844A",
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 3,
                  textDecoration: "none",
                }}
              >
                View Coupon Details
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
