import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { type ReactNode } from "react";

interface CouponImageDialogProps {
  couponId: number;
  source: "today" | "history" | "admin/today";
  label?: string;
  buttonLabel?: ReactNode;
  buttonClassName?: string;
}

export function CouponImageDialog({
  couponId,
  source,
  label,
  buttonLabel = "📷 View Image",
  buttonClassName,
}: CouponImageDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery<{
    preMatchImage: string | null;
    settledImage: string | null;
  }>({
    queryKey: [`/api/${source}/coupons/${couponId}/image`],
    queryFn: () =>
      fetch(`/api/${source}/coupons/${couponId}/image`).then((r) => r.json()),
    enabled: open,
    staleTime: 1000 * 60 * 10,
  });

  const img = data?.settledImage ?? data?.preMatchImage ?? null;

  const defaultBtnCls = [
    "inline-flex items-center gap-1.5 text-xs font-medium",
    "px-2.5 py-1.5 rounded border border-gray-200",
    "bg-white hover:bg-gray-50 text-gray-600 hover:text-gray-900",
    "transition-colors cursor-pointer",
  ].join(" ");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={buttonClassName ?? defaultBtnCls}
        data-testid={`button-view-image-${couponId}`}
      >
        {buttonLabel}
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(0,0,0,0.72)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
          }}
          data-testid="coupon-image-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 14,
              maxWidth: 500,
              width: "100%",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 18px",
                borderBottom: "1px solid #E4EAEE",
              }}
            >
              <span style={{ fontWeight: 700, fontSize: 14, color: "#0E1726" }}>
                {label ?? "Coupon Image"}
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 20,
                  lineHeight: 1,
                  color: "#5D6B7A",
                  padding: "2px 6px",
                }}
                data-testid="coupon-image-close"
              >
                ×
              </button>
            </div>

            <div style={{ padding: isLoading || !img ? "48px 24px" : 0 }}>
              {isLoading ? (
                <p style={{ textAlign: "center", color: "#5D6B7A", fontSize: 13, margin: 0 }}>
                  Loading…
                </p>
              ) : img ? (
                <img
                  src={img}
                  alt={label ?? "Coupon image"}
                  style={{ width: "100%", height: "auto", display: "block", objectFit: "contain" }}
                />
              ) : (
                <p style={{ textAlign: "center", color: "#5D6B7A", fontSize: 13, margin: 0 }}>
                  Image not found
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
