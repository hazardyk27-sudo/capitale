import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "wouter";
import SiteHeader from "@/components/SiteHeader";
import { ChevronRight, ChevronDown, ArrowRight } from "lucide-react";
import preMatchImg from "@assets/UH-2088659256-W_1784125864336.png";
import settledImg from "@assets/UH-2088659256-W_(1)_1784125899473.png";

/* ── Design tokens ─────────────────────────────────────────────── */
const BG      = "#F7F7F5";
const NAVY    = "#071B33";
const ORANGE  = "#F47A12";
const TEXT2   = "#667085";
const BORDER  = "#E2E5E9";
const SOFT    = "#F0F2F4";
const WHITE   = "#ffffff";

/* ── Navigation data ───────────────────────────────────────────── */
const NAV_SECTIONS = [
  { id: "kar-mantigi",   short: "Kâr Mantığı",             full: "Kâr Mantığı",                   desc: "Tek bir kupon yerine günlük toplam sonucun nasıl değerlendirildiğini gör." },
  { id: "analiz",        short: "Yazılım Analizi",          full: "Yazılım Analizi",                desc: "Maçların hangi veri katmanları üzerinden tarandığını incele." },
  { id: "filtreleme",    short: "Filtreleme",               full: "Algoritmik Filtreleme",          desc: "Yüzlerce maç içinden uygun adayların nasıl seçildiğini gör." },
  { id: "olusturma",     short: "Kuponların Oluşturulması", full: "Kuponların Oluşturulması",       desc: "Seçimlerin oran, risk ve potansiyel dönüş yaklaşımıyla nasıl birleştirildiğini incele." },
  { id: "seffaflik",     short: "Şeffaflık",                full: "Şeffaflık ve Kanıt",             desc: "Kuponların maç başlamadan önce nasıl kayıt altına alındığını gör." },
  { id: "arsiv",         short: "Arşiv",                    full: "Sonuç ve Arşiv",                 desc: "Kazanan, kaybeden ve iade edilen bütün kayıtların nasıl saklandığını incele." },
  { id: "uyelik",        short: "Üyelik",                   full: "Üyeler Neye Erişir?",            desc: "Standard ve Premium üyelik kapsamlarını karşılaştır." },
];

/* ── Helpers ────────────────────────────────────────────────────── */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.14em", marginBottom: "14px" }}>
      {children}
    </p>
  );
}

/* ── Hero — Right data card ─────────────────────────────────────── */
function DailyBalanceCard() {
  return (
    <div style={{
      background: NAVY, borderRadius: "16px", padding: "clamp(24px,4vw,36px)",
      border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 24px 64px rgba(7,27,51,0.22)",
    }}>
      <p style={{ fontSize: "10px", fontWeight: 800, color: "rgba(255,255,255,0.45)", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "20px" }}>
        GÜNLÜK BİLANÇO YAKLAŞIMI
      </p>

      <div style={{ marginBottom: "8px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>4 kupon yayınlandı</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>3 kaybeden kupon</span>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "rgba(239,68,68,0.85)" }}>−€300</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "13.5px", color: "rgba(255,255,255,0.55)" }}>1 kazanan kupon</span>
            <span style={{ fontSize: "13.5px", fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>+€620</span>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "16px" }}>
        <span style={{ fontSize: "14px", fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>Günlük net sonuç</span>
        <span style={{ fontSize: "22px", fontWeight: 800, color: ORANGE, letterSpacing: "-0.02em" }}>+€320</span>
      </div>

      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", lineHeight: 1.6, marginTop: "20px", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        Bu örnek yalnızca sistem yaklaşımını açıklar. Gerçek sonuçlar kupon oranlarına ve performansa göre değişir.
      </p>
    </div>
  );
}

/* ── Hero Section ───────────────────────────────────────────────── */
function HeroSection({ onScrollToKar }: { onScrollToKar: () => void }) {
  return (
    <section style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px) clamp(48px,6vw,72px)", borderBottom: `1px solid ${BORDER}`, background: WHITE }}>
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        <div className="flex flex-col lg:flex-row lg:items-center" style={{ gap: "clamp(40px,6vw,80px)" }}>

          {/* LEFT — copy */}
          <div style={{ flex: "1 1 0", minWidth: 0 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "20px" }}>
              BET CAPITALE SİSTEMİ
            </p>

            <h1 style={{ fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, color: NAVY, lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: "0" }}>
              Her kuponun kazanması gerekmez.
            </h1>
            <h1 style={{
              fontSize: "clamp(28px,4.5vw,52px)", fontWeight: 800, color: NAVY, lineHeight: 1.12,
              letterSpacing: "-0.03em", marginBottom: "24px",
              borderBottom: `3px solid ${ORANGE}`, display: "inline-block", paddingBottom: "4px",
            }}>
              Doğru sistemin günün toplamını kâra taşıması gerekir.
            </h1>

            <p style={{ fontSize: "clamp(15px,1.8vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "580px", marginBottom: "32px" }}>
              Bet Capitale, futbol maçlarını geliştirdiğimiz yazılım ile analiz eder ve belirlenen kriterleri karşılayan seçenekleri öne çıkarır. Kuponları tek tek değil, günlük toplam bilanço içinde değerlendiririz. Hedefimiz, yeterli isabeti doğru oran ve yatırım dağılımıyla birleştirerek üyelerimize düzenli günlük kazanç fırsatları sunmaktır.
            </p>

            <div className="flex flex-col sm:flex-row" style={{ gap: "12px", marginBottom: "28px" }}>
              <button
                onClick={onScrollToKar}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  background: ORANGE, color: WHITE,
                  padding: "14px 24px", borderRadius: "8px", border: "none",
                  fontSize: "14px", fontWeight: 700, cursor: "pointer",
                  fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
                  transition: "opacity 0.15s", width: "100%",
                }}
                data-testid="btn-hero-primary"
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                Sistemin Kâr Mantığını Gör
                <ArrowRight size={16} />
              </button>
              <Link href="/history" className="w-full sm:w-auto">
                <button
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                    background: "transparent", color: NAVY,
                    padding: "14px 24px", borderRadius: "8px", border: `1.5px solid ${BORDER}`,
                    fontSize: "14px", fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
                    transition: "border-color 0.15s", width: "100%",
                  }}
                  data-testid="btn-hero-secondary"
                  onMouseEnter={e => (e.currentTarget.style.borderColor = ORANGE)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = BORDER)}
                >
                  Geçmiş Performansı İncele
                </button>
              </Link>
            </div>

            {/* Trust line */}
            <div className="flex flex-wrap" style={{ gap: "6px 0", rowGap: "4px" }}>
              {["Maç öncesi yayın", "Zaman damgalı kayıt", "Silinmeyen sonuç geçmişi", "Açık bilanço"].map((item, i, arr) => (
                <span key={i} style={{ display: "flex", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{item}</span>
                  {i < arr.length - 1 && <span style={{ margin: "0 10px", color: BORDER, fontSize: "14px" }}>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* RIGHT — data card */}
          <div className="w-full lg:flex-none lg:w-[400px]">
            <DailyBalanceCard />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Sticky subnav ──────────────────────────────────────────────── */
function StickySubNav({ activeId, onNav }: { activeId: string; onNav: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <nav
      aria-label="Sayfa içi navigasyon"
      className="hidden md:block"
      style={{
        position: "sticky", top: "68px", zIndex: 40,
        backgroundColor: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)",
        borderBottom: `1px solid ${BORDER}`,
      }}
    >
      <div className="mx-auto flex items-center" style={{ maxWidth: "1200px", height: "46px", padding: "0 40px", gap: "4px", overflowX: "auto" }}>
        {NAV_SECTIONS.map((s) => {
          const active = activeId === s.id;
          const isHov = hovered === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onNav(s.id)}
              onMouseEnter={() => setHovered(s.id)}
              onMouseLeave={() => setHovered(null)}
              aria-current={active ? "location" : undefined}
              style={{
                position: "relative", background: "none", border: "none", cursor: "pointer",
                padding: "0 12px", height: "46px", flexShrink: 0,
                fontSize: "12.5px", fontWeight: active ? 600 : 500,
                color: active ? ORANGE : isHov ? NAVY : TEXT2,
                transition: "color 0.15s", fontFamily: "'Manrope', sans-serif",
              }}
              data-testid={`subnav-${s.id}`}
            >
              {s.short}
              {active && (
                <span style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "20px", height: "2px", background: ORANGE, borderRadius: "2px" }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

/* ── Mobile Topic Drawer ────────────────────────────────────────── */
function MobileTopicDrawer({ activeId, onNav }: { activeId: string; onNav: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const activeSection = NAV_SECTIONS.find((s) => s.id === activeId);

  function handleNav(id: string) {
    onNav(id);
    setOpen(false);
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="md:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 39 }}
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Topic drawer trigger bar */}
      <div
        className="md:hidden"
        style={{
          position: "sticky",
          top: "72px",
          zIndex: 40,
          backgroundColor: "rgba(255,255,255,0.97)",
          borderBottom: `1px solid ${BORDER}`,
        }}
      >
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-haspopup="listbox"
          data-testid="button-mobile-topics"
          style={{
            width: "100%", display: "flex", alignItems: "center",
            gap: "8px", padding: "10px 16px",
            background: "none", border: "none", cursor: "pointer",
            fontFamily: "'Manrope', sans-serif", textAlign: "left",
          }}
        >
          <span style={{ fontSize: "12px", fontWeight: 700, color: NAVY }}>Konular</span>
          {activeSection && (
            <>
              <span style={{ fontSize: "12px", color: BORDER }}>·</span>
              <span style={{
                fontSize: "12px", fontWeight: 600, color: ORANGE,
                flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}>
                {activeSection.short}
              </span>
            </>
          )}
          <ChevronDown
            size={14}
            style={{
              color: TEXT2, flexShrink: 0, marginLeft: "auto",
              transform: open ? "rotate(180deg)" : "none",
              transition: "transform 0.15s",
            }}
          />
        </button>

        {/* Dropdown panel — absolute inside sticky wrapper */}
        {open && (
          <div
            role="listbox"
            aria-label="Bölüm seç"
            style={{
              position: "absolute", top: "100%", left: 0, right: 0,
              background: WHITE,
              border: `1px solid ${BORDER}`,
              borderTop: `1px solid ${BORDER}`,
              boxShadow: "0 8px 24px rgba(7,27,51,0.12)",
              zIndex: 42,
            }}
          >
            {NAV_SECTIONS.map((s, idx) => {
              const active = activeId === s.id;
              return (
                <button
                  key={s.id}
                  role="option"
                  aria-selected={active}
                  onClick={() => handleNav(s.id)}
                  data-testid={`mobile-topic-${s.id}`}
                  style={{
                    display: "flex", alignItems: "center", gap: "12px",
                    width: "100%", padding: "13px 16px",
                    background: active ? "rgba(244,122,18,0.05)" : WHITE,
                    border: "none",
                    borderBottom: idx < NAV_SECTIONS.length - 1 ? `1px solid ${BORDER}` : "none",
                    cursor: "pointer", textAlign: "left",
                    fontFamily: "'Manrope', sans-serif",
                  }}
                >
                  <span style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em", flexShrink: 0, width: "20px" }}>
                    0{idx + 1}
                  </span>
                  <span style={{ fontSize: "13px", fontWeight: active ? 700 : 500, color: active ? NAVY : TEXT2, flex: 1, textAlign: "left" }}>
                    {s.short}
                  </span>
                  {active && (
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: ORANGE, flexShrink: 0 }} />
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

/* ── Topic Index ────────────────────────────────────────────────── */
function TopicIndex({ onNav }: { onNav: (id: string) => void }) {
  const [hovered, setHovered] = useState<string | null>(null);
  return (
    <section
      id="bu-sayfada"
      style={{ padding: "clamp(48px,7vw,72px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-topic-index"
    >
      <div className="mx-auto" style={{ maxWidth: "1200px" }}>
        <Eyebrow>BU SAYFADA</Eyebrow>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", background: BORDER }}>
          {NAV_SECTIONS.map((s, i) => {
            const isHov = hovered === s.id;
            return (
              <button
                key={s.id}
                onClick={() => onNav(s.id)}
                onMouseEnter={() => setHovered(s.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  textAlign: "left", background: isHov ? "#f9f9f8" : WHITE,
                  border: "none", cursor: "pointer",
                  padding: "clamp(20px,3vw,28px) clamp(20px,3vw,28px)",
                  transition: "background 0.15s",
                  fontFamily: "'Manrope', sans-serif",
                  display: "flex", flexDirection: "column", gap: "8px",
                }}
                data-testid={`topic-card-${s.id}`}
              >
                <span style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em" }}>0{i + 1}</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{s.full}</span>
                <span style={{ fontSize: "13px", color: TEXT2, lineHeight: 1.6 }}>{s.desc}</span>
                <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: ORANGE, fontWeight: 600, marginTop: "4px" }}>
                  İncele <ChevronRight size={13} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ── Kâr Mantığı Section ────────────────────────────────────────── */
function KarMantigiSection({ onBack }: { onBack: () => void }) {
  return (
    <section
      id="kar-mantigi"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-kar-mantigi"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>STRATEJİ</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "24px", maxWidth: "720px" }}>
          Amaç bütün kuponları kazanmak değil,<br />
          günün toplamını kâra taşımaktır.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "660px", marginBottom: "40px" }}>
          Bet Capitale sistemi, her kuponun kazanacağı varsayımıyla çalışmaz. Kupon sayısı, toplam oran, yatırım dağılımı ve potansiyel dönüş birlikte değerlendirilir. Bazı günlerde yayınlanan kuponlardan yalnızca birinin isabet etmesi bile toplam günlük bilançonun pozitif kapanmasını sağlayabilir.
        </p>

        {/* Quote card */}
        <div style={{
          borderLeft: `4px solid ${ORANGE}`, background: "#fdf8f4",
          borderRadius: "0 12px 12px 0", padding: "clamp(20px,4vw,32px) clamp(20px,4vw,36px)",
          marginBottom: "48px", maxWidth: "720px",
        }}>
          <p style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
            "Her kupon kazanmayabilir.<br />
            Strateji, kazanan kuponun kaybedenleri karşılayıp üzerinde getiri bırakmasını hedefler."
          </p>
        </div>

        {/* Three principle cards */}
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: "16px", marginBottom: "40px" }}>
          {[
            {
              num: "01", title: "Oran Dengesi",
              text: "Yüksek toplam dönüş potansiyeli ile kupon riski birlikte değerlendirilir.",
            },
            {
              num: "02", title: "Yatırım Dağılımı",
              text: "Bütün bütçeyi tek sonuca bağlamak yerine kuponlar toplam strateji içinde ele alınır.",
            },
            {
              num: "03", title: "Günlük Bilanço",
              text: "Performans tek bir kuponla değil, günün toplam sonucu üzerinden ölçülür.",
            },
          ].map((card) => (
            <div key={card.num} style={{
              background: BG, border: `1px solid ${BORDER}`,
              borderRadius: "12px", padding: "24px 24px",
            }}>
              <span style={{ fontSize: "11px", fontWeight: 800, color: ORANGE, letterSpacing: "0.06em", display: "block", marginBottom: "10px" }}>{card.num}</span>
              <p style={{ fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "8px" }}>{card.title}</p>
              <p style={{ fontSize: "13.5px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Yazılım Analizi Section ────────────────────────────────────── */
function AnalizSection({ onBack }: { onBack: () => void }) {
  const dataCards = [
    { title: "Geçmiş Performans", text: "Takımların ve oyuncuların önceki maçları, form durumu ve benzer karşılaşmaları incelenir." },
    { title: "Oran Hareketleri",  text: "Açılış oranları, düşüşler, yön değişimleri ve piyasa tepkileri takip edilir." },
    { title: "Para Akışı",        text: "Bahis hacmi, oynanan tutarlar ve olağan dışı para hareketleri değerlendirilir." },
    { title: "Kadro ve Gelişmeler", text: "Sakatlıklar, cezalar, rotasyonlar ve maç öncesi son haberler incelenir." },
    { title: "Maç Koşulları",     text: "Hava durumu, saha şartları, fikstür yoğunluğu ve deplasman etkisi hesaba katılır." },
    { title: "Hakem ve Oyuncu Verileri", text: "Hakem eğilimleri, oyuncu performansları ve kritik bireysel istatistikler karşılaştırılır." },
  ];

  return (
    <section
      id="analiz"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-analiz"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>YAZILIM ANALİZİ</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "760px" }}>
          Kazanç hedefinin arkasında yüzeysel tahminler değil,<br />
          çok katmanlı maç analizi var.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Geliştirdiğimiz yazılım her gün futbol maçlarını farklı veri katmanları üzerinden tarar. Amaç, yalnızca popüler takımları seçmek değil; istatistiksel ve piyasa açısından dikkat çeken karşılaşmaları belirlemektir.
        </p>

        {/* 2x3 data grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "1px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", background: BORDER, marginBottom: "48px" }}>
          {dataCards.map((card, i) => (
            <div key={i} style={{ background: WHITE, padding: "clamp(20px,3vw,28px)" }}>
              <p style={{ fontSize: "13px", fontWeight: 800, color: NAVY, marginBottom: "8px", letterSpacing: "-0.01em" }}>{card.title}</p>
              <p style={{ fontSize: "13px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{card.text}</p>
            </div>
          ))}
        </div>

        {/* Bottom statement */}
        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: "32px", maxWidth: "520px" }}>
          {["Veriyi topluyoruz.", "Filtreliyoruz.", "Piyasa hareketleriyle karşılaştırıyoruz.", "Son kararı sistem yaklaşımıyla veriyoruz."].map((line, i) => (
            <p key={i} style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: i === 3 ? ORANGE : NAVY, lineHeight: 1.5, margin: "0 0 4px" }}>
              {line}
            </p>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Filtreleme Section ─────────────────────────────────────────── */
function FiltrelemeSection({ onBack }: { onBack: () => void }) {
  const funnelSteps = [
    { label: "Tüm Maçlar",          desc: "Günün tüm karşılaşmaları taranır." },
    { label: "Veri Kontrolü",        desc: "Geçmiş performans, form ve kadro verileri incelenir." },
    { label: "Piyasa Kontrolü",      desc: "Oran hareketleri ve para akışıyla veri yönü karşılaştırılır." },
    { label: "Risk ve Oran Kontrolü",desc: "Potansiyel dönüşün alınan riski karşılayıp karşılamadığı değerlendirilir." },
    { label: "Kupon Adayları",       desc: "Kriterleri geçen seçimler kuponlara dönüştürülür.", highlight: true },
  ];

  return (
    <section
      id="filtreleme"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-filtreleme"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>FİLTRELEME</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "600px" }}>
          Her maç kupona girmez.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Yazılımın incelediği bütün maçlar paylaşılmaz. Belirlenen eşikleri karşılamayan, veri kalitesi yetersiz olan veya risk-getiri dengesi uygun görünmeyen karşılaşmalar elenir.
        </p>

        {/* Funnel visualization — mobile vertical, desktop horizontal */}
        <div className="hidden md:flex" style={{ alignItems: "stretch", marginBottom: "48px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
          {funnelSteps.map((step, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: 1 }}>
              <div style={{
                flex: 1, padding: "24px 20px",
                background: step.highlight ? `rgba(244,122,18,0.06)` : WHITE,
                borderRight: i < funnelSteps.length - 1 ? `1px solid ${BORDER}` : "none",
                height: "100%", display: "flex", flexDirection: "column", gap: "8px",
              }}>
                <p style={{ fontSize: "13px", fontWeight: 800, color: step.highlight ? ORANGE : NAVY, lineHeight: 1.3, margin: 0 }}>
                  {step.label}
                </p>
                <p style={{ fontSize: "12px", color: TEXT2, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
              {i < funnelSteps.length - 1 && (
                <div style={{ padding: "0 2px", color: TEXT2, flexShrink: 0 }}>
                  <ArrowRight size={14} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Mobile — vertical list */}
        <div className="md:hidden" style={{ marginBottom: "48px", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden" }}>
          {funnelSteps.map((step, i) => (
            <div key={i} style={{
              padding: "18px 20px",
              background: step.highlight ? `rgba(244,122,18,0.06)` : WHITE,
              borderBottom: i < funnelSteps.length - 1 ? `1px solid ${BORDER}` : "none",
              display: "flex", alignItems: "flex-start", gap: "14px",
            }}>
              {i < funnelSteps.length - 1 && (
                <ArrowRight size={14} style={{ color: TEXT2, flexShrink: 0, marginTop: "3px" }} />
              )}
              {i === funnelSteps.length - 1 && (
                <span style={{ width: "14px", flexShrink: 0 }} />
              )}
              <div>
                <p style={{ fontSize: "13px", fontWeight: 800, color: step.highlight ? ORANGE : NAVY, marginBottom: "4px" }}>{step.label}</p>
                <p style={{ fontSize: "12.5px", color: TEXT2, lineHeight: 1.55, margin: 0 }}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Final emphasis */}
        <div style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "20px", maxWidth: "560px" }}>
          <p style={{ fontSize: "clamp(15px,1.9vw,18px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, margin: 0 }}>
            Amaç daha fazla kupon üretmek değil,<br />
            yalnızca kriterleri karşılayan fırsatları öne çıkarmaktır.
          </p>
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Kuponların Oluşturulması Section ──────────────────────────── */
function OlusturmaSection({ onBack }: { onBack: () => void }) {
  const steps = [
    { num: "01", title: "Adaylar Belirlenir",       text: "Yazılım tarafından öne çıkarılan maçlar son kontrolden geçirilir." },
    { num: "02", title: "Oran ve Risk Değerlendirilir", text: "Her seçim, toplam kupon oranına ve potansiyel dönüşe etkisiyle birlikte ele alınır." },
    { num: "03", title: "Kuponlar Yayınlanır",       text: "Kuponlar ilk karşılaşma başlamadan önce üyelerle paylaşılır." },
    { num: "04", title: "Günlük Sonuç Ölçülür",     text: "Performans yalnızca tek tek kuponlarla değil, toplam günlük bilanço ile değerlendirilir." },
  ];

  return (
    <section
      id="olusturma"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-olusturma"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>KUPONLARIN OLUŞTURULMASI</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "720px" }}>
          Seçimler tek tek değil,<br />
          aynı günlük stratejinin parçaları olarak hazırlanır.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "48px" }}>
          Filtrelenen maçlar; oran dengesi, kupon sayısı, potansiyel dönüş ve toplam günlük risk dikkate alınarak kuponlara dönüştürülür.
        </p>

        {/* Steps */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
          {steps.map((step, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "flex-start", gap: "20px",
              padding: "clamp(20px,3vw,28px) clamp(20px,3vw,32px)",
              background: WHITE,
              borderBottom: i < steps.length - 1 ? `1px solid ${BORDER}` : "none",
            }}>
              <span style={{
                flexShrink: 0, width: "36px", height: "36px", borderRadius: "50%",
                background: `rgba(244,122,18,0.1)`, color: ORANGE,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "11px", fontWeight: 800, letterSpacing: "0.04em",
              }}>
                {step.num}
              </span>
              <div>
                <p style={{ fontSize: "15px", fontWeight: 700, color: NAVY, marginBottom: "6px" }}>{step.title}</p>
                <p style={{ fontSize: "14px", color: TEXT2, lineHeight: 1.65, margin: 0 }}>{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Closing line */}
        <p style={{ fontSize: "clamp(16px,2vw,20px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, maxWidth: "560px", margin: 0 }}>
          Tek bir tahmine değil,<br />
          <span style={{ color: ORANGE }}>birbirini tamamlayan toplam stratejiye</span> odaklanıyoruz.
        </p>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Şeffaflık ve Kanıt Section ─────────────────────────────────── */
function SeffaflikSection({ onBack }: { onBack: () => void }) {
  return (
    <section
      id="seffaflik"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-seffaflik"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>ŞEFFAFLIK VE KANIT</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "680px" }}>
          Güven istemiyoruz.<br />
          Süreci maçtan önce görünür kılıyoruz.
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "660px", marginBottom: "12px" }}>
          Kuponlar ilk karşılaşma başlamadan önce yayınlanır. Ziyaretçiler maç listesini, yayın saatini, kupon referansını, yatırılan tutarı, toplam oranı ve potansiyel dönüşü önceden görebilir. Üyelere özel seçimler ve tekil oranlar maç öncesinde gizli tutulur; maçlar tamamlandığında aynı kupon kaydı üzerinde açılır. Kazananlar da kaybedenler de geçmişten silinmez.
        </p>

        {/* Highlight statement */}
        <div style={{ borderLeft: `4px solid ${ORANGE}`, paddingLeft: "20px", maxWidth: "620px", margin: "32px 0 48px" }}>
          <p style={{ fontSize: "clamp(15px,1.9vw,18px)", fontWeight: 700, color: NAVY, lineHeight: 1.55, fontStyle: "italic", margin: 0 }}>
            "Biz yalnızca sonucu göstermiyoruz;<br />
            sonucun maçtan önce var olan kaydını da gösteriyoruz."
          </p>
        </div>

        {/* Before / After comparison */}
        <div className="flex flex-col md:flex-row md:items-start" style={{ gap: "0", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
          {/* Left — Pre-match */}
          <div style={{ flex: 1, padding: "clamp(24px,3vw,32px)", background: SOFT, borderRight: "none", borderBottom: `1px solid ${BORDER}` }} className="md:border-r md:border-b-0">
            <p style={{ fontSize: "10px", fontWeight: 800, color: TEXT2, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>MAÇ ÖNCESİ</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                ["Kupon Referansı", "UH-2088659256-W", true],
                ["Yayın Saati", "16:27"],
                ["İlk Maç", "19:00"],
                ["Toplam Oran", "3.86"],
                ["Yatırım", "€100,00"],
                ["Potansiyel Dönüş", "€386,37"],
              ].map(([label, val, hl], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: hl ? 700 : 500, color: hl ? NAVY : NAVY }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: "8px", borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: TEXT2, background: WHITE, padding: "4px 10px", borderRadius: "6px", border: `1px solid ${BORDER}` }}>
                  Seçimler Gizli
                </span>
              </div>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <img src={preMatchImg} alt="Maç öncesi kupon" style={{ width: "100%", display: "block" }} />
            </div>
          </div>

          {/* Center connector — mobile */}
          <div className="md:hidden" style={{ padding: "12px 24px", background: WHITE, borderBottom: `1px solid ${BORDER}`, textAlign: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: 700, color: TEXT2, letterSpacing: "0.04em" }}>
              Aynı kupon · Aynı referans · Aynı kayıt
            </span>
          </div>

          {/* Center connector — desktop */}
          <div className="hidden md:flex" style={{ flexDirection: "column", alignItems: "center", justifyContent: "flex-start", padding: "32px 16px 0", background: WHITE, flexShrink: 0 }}>
            <div style={{ width: "1px", height: "60px", background: BORDER }} />
            <div style={{ padding: "10px 12px", borderRadius: "8px", background: SOFT, border: `1px solid ${BORDER}`, textAlign: "center", margin: "10px 0", whiteSpace: "nowrap" }}>
              <div style={{ fontSize: "10.5px", fontWeight: 700, color: NAVY, lineHeight: 1.7 }}>
                Aynı kupon<br />Aynı referans<br />Aynı kayıt
              </div>
            </div>
            <div style={{ width: "1px", height: "60px", background: BORDER }} />
          </div>

          {/* Right — Post-match */}
          <div style={{ flex: 1, padding: "clamp(24px,3vw,32px)", background: "rgba(244,122,18,0.03)" }}>
            <p style={{ fontSize: "10px", fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: "16px" }}>MAÇ SONRASI</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
              {[
                ["Kupon Referansı", "UH-2088659256-W", true],
                ["Toplam Oran", "3.86"],
                ["Yatırım", "€100,00"],
                ["Gerçekleşen Dönüş", "€386,37"],
                ["Net Sonuç", "+€286,37"],
              ].map(([label, val, hl], i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "12px", color: TEXT2 }}>{label}</span>
                  <span style={{ fontSize: "12px", fontWeight: hl ? 700 : 500, color: NAVY }}>{val}</span>
                </div>
              ))}
              <div style={{ paddingTop: "8px", borderTop: `1px solid ${BORDER}` }}>
                <span style={{ fontSize: "11px", fontWeight: 700, color: "#117a4a", background: "rgba(17,122,74,0.08)", padding: "4px 10px", borderRadius: "6px", border: "1px solid rgba(17,122,74,0.2)" }}>
                  Kazandı
                </span>
              </div>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: `1px solid ${BORDER}` }}>
              <img src={settledImg} alt="Maç sonrası kupon" style={{ width: "100%", display: "block" }} />
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{ fontSize: "13px", color: TEXT2, background: SOFT, border: `1px solid ${BORDER}`, borderRadius: "8px", padding: "12px 18px", maxWidth: "660px" }}>
          Maç sonrasında yeni bir kupon hazırlanmaz; sonuç mevcut kayda eklenir.
        </p>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Arşiv Section ──────────────────────────────────────────────── */
function ArsivSection({ onBack }: { onBack: () => void }) {

  return (
    <section
      id="arsiv"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: BG, scrollMarginTop: "132px" }}
      data-testid="section-arsiv"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>SONUÇ VE ARŞİV</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "20px", maxWidth: "680px" }}>
          Geçmişi değiştirmiyoruz.<br />
          <span style={{ color: ORANGE }}>Tamamını görüyorsunuz.</span>
        </h2>
        <p style={{ fontSize: "clamp(15px,1.7vw,17px)", color: TEXT2, lineHeight: 1.75, maxWidth: "640px", marginBottom: "40px" }}>
          Kazanan, kaybeden ve iade edilen bütün kuponlar aynı sistem içinde saklanır. Dönemsel bilanço bunların tamamı kullanılarak hesaplanır; hiçbir kayıt silinmez veya gizlenmez.
        </p>

        <Link href="/history">
          <button
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              background: NAVY, color: WHITE,
              padding: "13px 22px", borderRadius: "8px", border: "none",
              fontSize: "14px", fontWeight: 700, cursor: "pointer",
              fontFamily: "'Manrope', sans-serif", letterSpacing: "-0.01em",
              transition: "opacity 0.15s",
            }}
            data-testid="btn-arsiv-gecmis"
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Geçmiş Performansı Gör
            <ArrowRight size={15} />
          </button>
        </Link>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Üyelik Section ─────────────────────────────────────────────── */
function UyelikSection({ onBack }: { onBack: () => void }) {
  const plans = [
    {
      tier: "STANDARD",
      subtitle: "Kontrollü erişim",
      desc: "Günün seçilmiş maçlarına ve sınırlı kupon içeriğine eriş. Sistemi daha sade ve kontrollü biçimde takip etmek isteyenler için.",
      features: ["Seçilmiş maç içerikleri", "Sınırlı kupon erişimi", "Geçmiş Standard performansı", "Günlük içerik takibi"],
      cta: "Standard Paketleri İncele",
      dark: false,
    },
    {
      tier: "PREMIUM",
      subtitle: "Tam erişim",
      desc: "Gün içinde yayınlanan bütün maçlara, kuponlara ve ek fırsatlara eriş. Bet Capitale sistemini eksiksiz takip etmek isteyenler için.",
      features: ["Günün tüm maçları", "Yayınlanan tüm kuponlar", "Gün içindeki ek içerikler", "Tam Premium arşivi"],
      cta: "Premium Paketleri İncele",
      dark: true,
    },
  ];

  return (
    <section
      id="uyelik"
      style={{ padding: "clamp(48px,8vw,88px) clamp(16px,4vw,40px)", borderBottom: `1px solid ${BORDER}`, background: WHITE, scrollMarginTop: "132px" }}
      data-testid="section-uyelik"
    >
      <div className="mx-auto" style={{ maxWidth: "1100px" }}>
        <Eyebrow>ÜYELİK</Eyebrow>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,42px)", fontWeight: 800, color: NAVY, lineHeight: 1.15, letterSpacing: "-0.03em", marginBottom: "48px", maxWidth: "580px" }}>
          Sana uygun erişim seviyesini seç.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: "20px", marginBottom: "0" }}>
          {plans.map((plan) => (
            <div
              key={plan.tier}
              style={{
                borderRadius: "16px", overflow: "hidden",
                border: plan.dark ? `1px solid rgba(244,122,18,0.25)` : `1px solid ${BORDER}`,
                background: plan.dark ? NAVY : WHITE,
                display: "flex", flexDirection: "column",
              }}
            >
              <div style={{ padding: "clamp(28px,4vw,36px)", flex: 1 }}>
                <p style={{ fontSize: "11px", fontWeight: 800, color: plan.dark ? "rgba(255,255,255,0.4)" : TEXT2, letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: "8px" }}>
                  {plan.tier}
                </p>
                <p style={{ fontSize: "18px", fontWeight: 700, color: plan.dark ? WHITE : NAVY, marginBottom: "12px" }}>
                  {plan.subtitle}
                </p>
                <p style={{ fontSize: "14px", color: plan.dark ? "rgba(255,255,255,0.55)" : TEXT2, lineHeight: 1.7, marginBottom: "24px" }}>
                  {plan.desc}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((f, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{
                        width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                        background: plan.dark ? "rgba(244,122,18,0.15)" : `rgba(244,122,18,0.1)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: "9px", color: ORANGE, fontWeight: 800,
                      }}>✓</span>
                      <span style={{ fontSize: "13.5px", color: plan.dark ? "rgba(255,255,255,0.7)" : NAVY }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: "0 clamp(28px,4vw,36px) clamp(28px,4vw,36px)" }}>
                <Link href="/plans">
                  <button
                    style={{
                      width: "100%", padding: "13px 20px", borderRadius: "8px",
                      border: plan.dark ? "none" : `1.5px solid ${BORDER}`,
                      background: plan.dark ? ORANGE : "transparent",
                      color: plan.dark ? WHITE : NAVY,
                      fontSize: "14px", fontWeight: 700, cursor: "pointer",
                      fontFamily: "'Manrope', sans-serif",
                      transition: "opacity 0.15s",
                    } as React.CSSProperties}
                    data-testid={`btn-uyelik-${plan.tier.toLowerCase()}`}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >
                    {plan.cta}
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <BackLink onClick={onBack} />
      </div>
    </section>
  );
}

/* ── Final CTA Section ──────────────────────────────────────────── */
function FinalCtaSection() {
  return (
    <section style={{ padding: "clamp(56px,8vw,96px) clamp(16px,4vw,40px)", background: NAVY, textAlign: "center" }}>
      <div className="mx-auto" style={{ maxWidth: "720px" }}>
        <p style={{ fontSize: "11px", fontWeight: 800, color: ORANGE, textTransform: "uppercase", letterSpacing: "0.16em", marginBottom: "20px" }}>
          BET CAPITALE'E KATIL
        </p>
        <h2 style={{ fontSize: "clamp(24px,3.5vw,40px)", fontWeight: 800, color: WHITE, lineHeight: 1.2, letterSpacing: "-0.025em", marginBottom: "20px" }}>
          Kuponları maç başlamadan önce gör.<br />
          Sonuçları değişmeyen kayıtlardan takip et.
        </h2>
        <p style={{ fontSize: "clamp(14px,1.8vw,17px)", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, maxWidth: "520px", margin: "0 auto 36px" }}>
          Standard ile seçilmiş içeriklere, Premium ile gün içinde yayınlanan bütün maçlara ve kuponlara eriş.
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center" style={{ gap: "12px", marginBottom: "24px" }}>
          <Link href="/plans" className="w-full sm:w-auto">
            <button
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: ORANGE, color: WHITE,
                padding: "14px 28px", borderRadius: "8px", border: "none",
                fontSize: "15px", fontWeight: 700, cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "opacity 0.15s", width: "100%",
              }}
              data-testid="btn-final-uyelik"
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              Üyeliğini Seç
            </button>
          </Link>
          <Link href="/today" className="w-full sm:w-auto">
            <button
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                background: "transparent", color: WHITE,
                padding: "14px 28px", borderRadius: "8px",
                border: "1.5px solid rgba(255,255,255,0.2)",
                fontSize: "15px", fontWeight: 600, cursor: "pointer",
                fontFamily: "'Manrope', sans-serif",
                transition: "border-color 0.15s", width: "100%",
              }}
              data-testid="btn-final-bugun"
              onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.5)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
            >
              Bugünün Kuponlarını Gör
            </button>
          </Link>
        </div>
        <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>
          Sonuç veya kâr garantisi verilmez. 18+.
        </p>
      </div>
    </section>
  );
}

/* ── Back link helper ───────────────────────────────────────────── */
function BackLink({ onClick }: { onClick: () => void }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{ marginTop: "48px", paddingTop: "20px", borderTop: `1px solid ${BORDER}` }}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        style={{
          background: "none", border: "none", cursor: "pointer", padding: 0,
          fontSize: "13px", color: hov ? ORANGE : TEXT2,
          transition: "color 0.15s", fontFamily: "'Manrope', sans-serif",
          display: "flex", alignItems: "center", gap: "4px",
        }}
        data-testid="btn-back-to-topics"
      >
        ↑ Konulara dön
      </button>
    </div>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function NasilCalisir() {
  const [activeSection, setActiveSection] = useState<string>("kar-mantigi");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    window.history.replaceState(null, "", `#${id}`);
  }, []);

  /* IntersectionObserver for active section */
  useEffect(() => {
    const sectionIds = NAV_SECTIONS.map((s) => s.id);
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-100px 0px -55% 0px", threshold: 0 }
    );
    sections.forEach((s) => observerRef.current!.observe(s));
    return () => observerRef.current?.disconnect();
  }, []);

  /* Hash on mount */
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        setTimeout(() => el.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" }), 150);
      }
    }
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", fontFamily: "'Manrope', sans-serif" }}>
      <SiteHeader />

      {/* Sticky subnav (desktop only) */}
      <StickySubNav activeId={activeSection} onNav={scrollTo} />

      {/* Mobile topic drawer — before hero, non-sticky, scrolls with page */}
      <MobileTopicDrawer activeId={activeSection} onNav={scrollTo} />

      {/* Hero */}
      <HeroSection onScrollToKar={() => scrollTo("kar-mantigi")} />

      {/* Topic Index */}
      <TopicIndex onNav={scrollTo} />

      {/* Sections */}
      <KarMantigiSection onBack={() => scrollTo("bu-sayfada")} />
      <AnalizSection     onBack={() => scrollTo("bu-sayfada")} />
      <FiltrelemeSection onBack={() => scrollTo("bu-sayfada")} />
      <OlusturmaSection  onBack={() => scrollTo("bu-sayfada")} />
      <SeffaflikSection  onBack={() => scrollTo("bu-sayfada")} />
      <ArsivSection      onBack={() => scrollTo("bu-sayfada")} />
      <UyelikSection     onBack={() => scrollTo("bu-sayfada")} />

      {/* Final CTA */}
      <FinalCtaSection />
    </div>
  );
}
