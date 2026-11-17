import { useEffect } from "react";
import { createPortal } from "react-dom";
import { TermsBody } from "@/components/TermsContent";
import { CURRENT_TERMS_VERSION, CURRENT_TERMS_EFFECTIVE_DATE_LABEL } from "@shared/terms";

const NAVY   = "#071B33";
const ORANGE = "#F47A12";
const TEXT2  = "#667085";
const BORDER = "#E2E5E9";

interface TermsModalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Compact popup showing the Terms of Use, Membership and Service content,
 * used from the Register page so users can review the terms without
 * navigating away from the registration form.
 */
export default function TermsModal({ open, onClose }: TermsModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(7,27,51,0.55)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        zIndex: 1000,
      }}
    >
      <style>{`
        .terms-modal-dialog { max-width: 300px; }
        @media (max-width: 640px) { .terms-modal-dialog { max-width: 200px; } }
      `}</style>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Terms of Use, Membership and Service"
        data-testid="modal-terms"
        className="terms-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "12px",
          width: "100%",
          maxHeight: "min(560px, 85vh)",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 12px 40px rgba(7,27,51,0.25)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: "12px",
            padding: "18px 20px 14px",
            borderBottom: `1px solid ${BORDER}`,
            flexShrink: 0,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Manrope', sans-serif",
                fontWeight: 800,
                color: NAVY,
                fontSize: "15px",
                margin: 0,
              }}
            >
              Terms of Use, Membership and Service
            </h2>
            <p style={{ fontSize: "11.5px", color: TEXT2, margin: "4px 0 0" }}>
              Last Updated: {CURRENT_TERMS_EFFECTIVE_DATE_LABEL} · Version {CURRENT_TERMS_VERSION}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            data-testid="button-close-terms-modal"
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "18px",
              lineHeight: 1,
              color: TEXT2,
              padding: "4px",
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: "16px 20px", overflowY: "auto", flex: 1 }}>
          <TermsBody />
        </div>

        <div style={{ padding: "12px 20px", borderTop: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <button
            type="button"
            onClick={onClose}
            data-testid="button-terms-modal-done"
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "13px",
              fontWeight: 700,
              color: "#fff",
              background: ORANGE,
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontFamily: "'Manrope', sans-serif",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
