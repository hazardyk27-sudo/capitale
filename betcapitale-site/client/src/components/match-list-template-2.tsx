import type { ComponentType, CSSProperties, SVGProps } from "react";
import * as FlagIcons from "country-flag-icons/react/3x2";

export type MatchListTemplate2Match = {
  id: number;
  date: string;
  homeTeam: string;
  awayTeam: string;
  competition: string;
  kickoffAt: string;
  result: string | null;
  country?: string | null;
  countryCode?: string | null;
};

export type MatchListTemplate2Metrics = {
  metric1: string;
  metric2: string;
  metric3: string;
  metric4: string;
  movement: string;
};

export type MatchListTemplate2Props = {
  matches: MatchListTemplate2Match[];
  date: string;
  fmt: "story" | "post";
  variant: "prematch" | "result";
  metricsByMatch: Record<number, MatchListTemplate2Metrics>;
  totalMatches?: number;
  pageNumber?: number;
  pageCount?: number;
};

const palette = {
  ink: "#142333",
  muted: "#687785",
  faint: "#91A0AA",
  line: "#E7ECEF",
  paper: "#FCFDFD",
  card: "#FFFFFF",
  teal: "#087F70",
  tealPale: "#EAF6F3",
  red: "#B94F4D",
  redPale: "#F9EEEE",
};

function Flag({ code }: { code: string }) {
  const normalized = code.trim().toUpperCase();
  const Icon = (FlagIcons as Record<string, ComponentType<SVGProps<SVGSVGElement>>>)[normalized];

  if (Icon) {
    return (
      <Icon
        aria-label={`${normalized} flag`}
        role="img"
        style={{
          width: 25,
          height: 17,
          borderRadius: 3,
          display: "block",
          outline: "1px solid rgba(20,35,51,.12)",
          flexShrink: 0,
        }}
      />
    );
  }

  return (
    <span
      aria-label={`${normalized} country code; flag unavailable`}
      style={{
        width: 25,
        height: 17,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 4,
        border: `1px solid ${palette.line}`,
        background: "#F5F7F8",
        color: palette.muted,
        fontSize: 8,
        fontWeight: 800,
        letterSpacing: ".04em",
        flexShrink: 0,
      }}
    >
      {normalized.slice(0, 2)}
    </span>
  );
}

function TeamInitials({ name, size }: { name: string; size: number }) {
  const words = name
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  const initials = words.length === 1
    ? Array.from(words[0]).slice(0, 2).join("")
    : words.slice(0, 2).map((part) => Array.from(part)[0] ?? "").join("");

  return (
    <div
      aria-hidden="true"
      style={{
        width: size,
        height: size,
        borderRadius: size < 30 ? 8 : 12,
        border: "1px solid #DCE5E8",
        background: "linear-gradient(145deg, #F7FAFA, #EDF3F3)",
        color: "#36545C",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        fontSize: Math.max(8, size * 0.32),
        fontWeight: 800,
        letterSpacing: ".04em",
      }}
    >
      {initials || "?"}
    </div>
  );
}

function formatDate(date: string) {
  if (!date) return "";
  const parsed = new Date(`${date.slice(0, 10)}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return date;
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(parsed);
}

export function MatchListTemplate2({
  matches,
  date,
  fmt,
  variant,
  metricsByMatch,
  totalMatches = matches.length,
  pageNumber = 1,
  pageCount = 1,
}: MatchListTemplate2Props) {
  const isStory = fmt === "story";
  const isResult = variant === "result";
  const count = matches.length;
  const dimensions = isStory ? { width: 1080, height: 1920 } : { width: 1080, height: 1350 };
  const padX = isStory ? 64 : 52;
  const padTop = isStory ? 58 : 42;
  const padBottom = isStory ? 38 : 28;
  const headerReserve = isStory ? 270 : 198;
  const footerReserve = isStory ? 48 : 42;
  const listTop = isStory ? 18 : 14;
  const gap = Math.max(isStory ? 5 : 4, (isStory ? 15 : 11) - count * (isStory ? 0.55 : 0.42));
  const roomForCards =
    dimensions.height - padTop - headerReserve - footerReserve - padBottom - listTop;
  const cardHeight = count > 0 ? Math.max(36, (roomForCards - gap * Math.max(0, count - 1)) / count) : 0;
  const dense = cardHeight < 82;
  const titleSize = isStory ? 74 : 62;
  const headerColor = isResult ? palette.teal : "#C66A38";
  const rowPad = Math.max(2, Math.min(9, cardHeight * 0.04));
  const topLineSize = Math.max(9, Math.min(isStory ? 15 : 13, cardHeight * 0.185));
  const teamSize = Math.max(12, Math.min(isStory ? 24 : 21, cardHeight * 0.31));
  const metricSize = Math.max(8, Math.min(isStory ? 13 : 11.5, cardHeight * 0.17));
  const badgeSize = Math.max(20, Math.min(38, cardHeight * 0.38));
  const metricGap = dense ? 5 : 8;
  const title = isResult ? "Match results" : "Today's matches";
  const base: CSSProperties = {
    boxSizing: "border-box",
    fontFamily: "'Aptos', 'Avenir Next', system-ui, sans-serif",
  };

  return (
    <div
      data-template="match-list-2"
      style={{
        ...base,
        width: dimensions.width,
        height: dimensions.height,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        background: palette.paper,
        color: palette.ink,
        padding: `${padTop}px ${padX}px ${padBottom}px`,
        position: "relative",
      }}
    >
      <div
        style={{
          height: headerReserve,
          minHeight: headerReserve,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <img
              src="/bet-capitale-logo.png"
              alt="BetCapitale"
              style={{
                display: "block",
                width: isStory ? 184 : 154,
                height: isStory ? 32 : 27,
                objectFit: "contain",
                objectPosition: "left center",
              }}
            />
          </div>
          <span
            style={{
              color: palette.faint,
              fontSize: isStory ? 13 : 11,
              fontWeight: 800,
              letterSpacing: ".17em",
              textTransform: "uppercase",
            }}
          >
            {isResult ? "FULL TIME" : "MATCHDAY"}
          </span>
        </div>

        <div
          style={{
            marginTop: isStory ? 28 : 20,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div style={{ width: 5, height: isStory ? 66 : 54, borderRadius: 4, background: headerColor }} />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: "Georgia, 'Times New Roman', serif",
                fontSize: titleSize,
                fontWeight: 700,
                lineHeight: 0.98,
                letterSpacing: "-.055em",
                color: palette.ink,
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: isStory ? 20 : 14,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            color: palette.muted,
          }}
        >
          <span style={{ fontSize: isStory ? 18 : 15, fontWeight: 600 }}>{formatDate(date)}</span>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: isStory ? 15 : 13,
              fontWeight: 700,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: headerColor }} />
            {totalMatches} {totalMatches === 1 ? "fixture" : "fixtures"}
          </span>
        </div>
        <div style={{ height: 1, background: palette.line, marginTop: "auto" }} />
      </div>

      {count > 0 ? (
        <div
          style={{
            paddingTop: listTop,
            display: "flex",
            flexDirection: "column",
            gap,
            flex: "0 0 auto",
            minHeight: 0,
          }}
        >
          {matches.map((match) => {
            const metric = metricsByMatch[match.id] ?? {
              metric1: "",
              metric2: "",
              metric3: "",
              metric4: "",
              movement: "",
            };
            const values = [metric.metric1, metric.metric2, metric.metric3, metric.metric4];
            const movement = metric.movement ?? "";
            const normalizedMovement = movement.trim().replace("−", "-");
            const movementNumberText = normalizedMovement.replace("%", "").replace(",", ".").trim();
            const movementIsNumeric = movementNumberText !== "" && Number.isFinite(Number(movementNumberText));
            const numericMovement = movementIsNumeric ? Number(movementNumberText) : 0;
            const hasMovement = normalizedMovement.length > 0;
            const movementIsDown = movementIsNumeric && numericMovement < 0;
            const movementIsUp = movementIsNumeric && numericMovement > 0;
            const movementColor = !hasMovement
              ? palette.faint
              : movementIsDown ? palette.red : movementIsUp ? palette.teal : palette.muted;
            const movementBg = !hasMovement
              ? "#F8FAFA"
              : movementIsDown ? palette.redPale : movementIsUp ? palette.tealPale : "#F2F5F6";
            const movementLabel = !hasMovement
              ? ""
              : movementIsNumeric
                ? `${numericMovement > 0 ? "+" : ""}${numericMovement}%`
                : movement;
            const code = match.countryCode?.trim();
            const homeNameSize = Math.max(teamSize * 0.68, teamSize - Math.max(0, match.homeTeam.length - 15) * 0.32);
            const awayNameSize = Math.max(teamSize * 0.68, teamSize - Math.max(0, match.awayTeam.length - 15) * 0.32);
            const competitionSize = Math.max(8, topLineSize - Math.max(0, match.competition.length - 26) * 0.12);

            return (
              <div
                key={match.id}
                style={{
                  boxSizing: "border-box",
                  height: cardHeight,
                  minHeight: 0,
                  flexShrink: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                    gap: dense ? 2 : 6,
                  padding: `${rowPad}px ${dense ? 11 : 16}px`,
                  border: "1px solid #E4EAED",
                  borderRadius: dense ? 14 : 18,
                  background: palette.card,
                  boxShadow: "0 3px 12px rgba(26,49,61,.045)",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 12,
                    minHeight: topLineSize + 2,
                    color: palette.muted,
                        fontSize: competitionSize,
                    fontWeight: 700,
                    lineHeight: 1.1,
                    letterSpacing: ".06em",
                    textTransform: "uppercase",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0, flex: 1 }}>
                    {code ? (
                      <Flag code={code} />
                    ) : (
                      <span
                        aria-label="Country unavailable"
                        title={match.country || "Country unavailable"}
                        style={{
                          width: 25,
                          height: 17,
                          flexShrink: 0,
                          borderRadius: 4,
                          border: `1px solid ${palette.line}`,
                          background: "#F5F7F8",
                          color: "#9AA6AE",
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 10,
                          fontWeight: 700,
                        }}
                      >
                        —
                      </span>
                    )}
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        lineHeight: 1.05,
                        color: "#657681",
                      }}
                    >
                      {match.competition}
                    </span>
                  </div>
                  <span
                    style={{
                      flexShrink: 0,
                      fontVariantNumeric: "tabular-nums",
                      letterSpacing: ".02em",
                      color: isResult ? palette.teal : "#B96335",
                      fontWeight: 800,
                      textTransform: "none",
                    }}
                  >
                    {match.kickoffAt}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: `minmax(0, 1fr) ${dense ? 48 : 64}px minmax(0, 1fr)`,
                    alignItems: "center",
                    minHeight: badgeSize,
                    gap: dense ? 6 : 10,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: dense ? 8 : 12, minWidth: 0 }}>
                        <TeamInitials name={match.homeTeam} size={badgeSize} />
                    <span
                      style={{
                        minWidth: 0,
                        color: palette.ink,
                        fontSize: homeNameSize,
                        lineHeight: 1.05,
                        fontWeight: 750,
                        letterSpacing: "-.025em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {match.homeTeam}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    <span style={{ height: 1, width: dense ? 8 : 12, background: "#D9E1E4" }} />
                    <span
                      style={{
                        color: "#8C9BA3",
                        fontSize: dense ? 8 : 9,
                        lineHeight: 1,
                        fontWeight: 900,
                        letterSpacing: ".1em",
                      }}
                    >
                      VS
                    </span>
                    <span style={{ height: 1, width: dense ? 8 : 12, background: "#D9E1E4" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: dense ? 8 : 12, minWidth: 0 }}>
                    <span
                      style={{
                        minWidth: 0,
                        textAlign: "right",
                        color: palette.ink,
                        fontSize: awayNameSize,
                        lineHeight: 1.05,
                        fontWeight: 750,
                        letterSpacing: "-.025em",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {match.awayTeam}
                    </span>
                    <TeamInitials name={match.awayTeam} size={badgeSize} />
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: metricGap,
                    minHeight: Math.max(16, metricSize + 5),
                    minWidth: 0,
                  }}
                >
                  {values.map((value, index) => (
                    <div
                      key={`metric-${index + 1}`}
                      style={{
                        boxSizing: "border-box",
                        flex: "1 1 0",
                        minWidth: 0,
                        height: Math.max(17, metricSize + 6),
                        padding: `0 ${dense ? 6 : 9}px`,
                        borderRadius: 7,
                        border: "1px solid #E9EEF0",
                        background: "#F8FAFA",
                        display: "flex",
                        alignItems: "center",
                        gap: dense ? 5 : 7,
                        color: palette.ink,
                      }}
                    >
                      <span
                        style={{
                          flexShrink: 0,
                          color: "#8A999F",
                          fontSize: Math.max(7, metricSize * 0.72),
                          fontWeight: 800,
                          letterSpacing: ".02em",
                        }}
                      >
                        {index + 1}
                      </span>
                      <span
                        style={{
                          minWidth: 0,
                          fontSize: metricSize,
                          fontWeight: 750,
                          lineHeight: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                  <div
                    style={{
                      boxSizing: "border-box",
                      flex: "0 0 116px",
                      height: Math.max(17, metricSize + 6),
                      padding: `0 ${dense ? 7 : 10}px`,
                      borderRadius: 7,
                      background: movementBg,
                      color: movementColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: metricSize,
                      fontWeight: 800,
                      lineHeight: 1,
                      fontVariantNumeric: "tabular-nums",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                    }}
                  >
                    {movementIsUp ? "↑ " : movementIsDown ? "↓ " : ""}{movementLabel}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: palette.muted,
            fontFamily: "Georgia, 'Times New Roman', serif",
            fontSize: 32,
            fontStyle: "italic",
          }}
        >
          No matches for this date
        </div>
      )}

      <div
        style={{
          marginTop: "auto",
          paddingTop: isStory ? 18 : 14,
          borderTop: `1px solid ${palette.line}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          color: palette.faint,
          fontSize: isStory ? 12 : 10,
          fontWeight: 700,
          letterSpacing: ".13em",
          textTransform: "uppercase",
        }}
      >
        <span>BETCAPITALE · FOOTBALL, IN FOCUS</span>
        <span>
          {pageCount > 1 ? `PAGE ${pageNumber} / ${pageCount} · ` : ""}
          {isStory ? "STORY" : "MATCHDAY POST"}
        </span>
      </div>
    </div>
  );
}
