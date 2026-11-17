import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { toPng } from "html-to-image";
import type { CouponWithSelections } from "@shared/schema";
import { BetSlipCard, deriveSettledStatus } from "@/components/BetSlipCard";

function Bet365Logo() {
  return (
    <svg width="72" height="22" viewBox="0 0 72 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="72" height="22" rx="3" fill="#027B5B" />
      <text
        x="36" y="15.5"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontSize="13"
        fontWeight="700"
        fill="#FFFFFF"
        letterSpacing="0.3"
      >
        bet365
      </text>
    </svg>
  );
}

export default function CouponDetail() {
  const { id } = useParams<{ id: string }>();
  const slipRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const { data: coupon, isLoading } = useQuery<CouponWithSelections>({
    queryKey: ["/api/coupons", id],
    queryFn: async () => {
      const res = await fetch(`/api/coupons/${id}`);
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  async function handleExport() {
    const el = slipRef.current;
    if (!el || !coupon) return;
    setExporting(true);
    try {
      // html-to-image renders via SVG serialisation — much more accurate
      // font metrics and no scroll-offset issues vs html2canvas.
      const dataUrl = await toPng(el, {
        backgroundColor: "#ffffff",
        pixelRatio: 3,
        skipFonts: false,
      });
      const sels = coupon.selections;
      let suffix = " RESULT";
      if (sels.some((s) => s.result === "pending")) {
        suffix = " PENDING";
      } else if (sels.every((s) => s.result === "pre-match")) {
        suffix = " PRE MATCH";
      }
      const link = document.createElement("a");
      link.download = `${coupon.betId}${suffix}.png`;
      link.href = dataUrl;
      link.click();
    } finally {
      setExporting(false);
    }
  }

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#94A3B8", fontSize: 13 }}>Loading…</span>
      </div>
    );
  }

  if (!coupon) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span style={{ color: "#94A3B8", fontSize: 13 }}>
          Coupon not found.{" "}
          <Link href="/coupons" style={{ color: "#16844A" }}>Back</Link>
        </span>
      </div>
    );
  }

  // Unsettled coupons are not receipt-eligible
  if (deriveSettledStatus(coupon) === null) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#111111", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <p style={{ color: "#94A3B8", fontSize: 13, margin: 0 }}>This coupon is not yet settled.</p>
        <Link href="/coupons" style={{ color: "#16844A", fontSize: 13 }}>← All Receipts</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#111111", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* ── top nav ──────────────────────────────────────────────────────── */}
      <div
        style={{
          height: 34,
          backgroundColor: "#0d0d0d",
          borderBottom: "1px solid #1a1a1a",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/coupons" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>← Back</Link>
        <Bet365Logo />
      </div>

      {/* ── outer app header above receipt ───────────────────────────────── */}
      <div style={{ maxWidth: 468, width: "calc(100% - 20px)", margin: "0 auto", paddingTop: 16 }}>
        {/* ── receipt card ─────────────────────────────────────────────── */}
        <BetSlipCard ref={slipRef} coupon={coupon} />

        {/* ── export button ─────────────────────────────────────────────── */}
        <button
          data-testid="button-export-image"
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: "100%",
            height: 38,
            marginTop: 8,
            backgroundColor: exporting ? "#145228" : "#16844A",
            border: "none",
            borderRadius: 3,
            color: "#FFFFFF",
            fontSize: 12,
            fontWeight: 600,
            cursor: exporting ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            opacity: exporting ? 0.75 : 1,
            transition: "background-color 0.15s",
            fontFamily: "Inter, Arial, sans-serif",
          }}
        >
          {exporting ? "Exporting…" : "Export as Image"}
        </button>

        {/* ── footer links ─────────────────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingBottom: 24 }}>
          <Link href="/coupons" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>← All Receipts</Link>
          <Link href="/admin/coupons" style={{ color: "#94A3B8", fontSize: 11, textDecoration: "none" }}>Admin Panel</Link>
        </div>
      </div>
    </div>
  );
}
