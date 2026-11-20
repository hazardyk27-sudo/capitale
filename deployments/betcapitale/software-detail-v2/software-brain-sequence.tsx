import { useEffect, useState } from "react";
import { Activity, BrainCircuit, Check, Clock3, FileText, BarChart3 } from "lucide-react";
import { normalizeSoftwareDetailBullets } from "@/lib/software-details";

export type SoftwareDepartment = "sxf" | "news" | "analyst";
export type DepartmentSummary = { software_detail_bullets_en?: string[] | null } | null;
export type SoftwareDepartmentSummaries = Partial<Record<SoftwareDepartment, DepartmentSummary>> | null;

type StageSpec = {
  role: SoftwareDepartment;
  title: string;
  phase: string;
  durationMs: number;
  unavailable: string;
  icon: typeof Activity;
};

export const STAGES: readonly StageSpec[] = [
  { role: "sxf", title: "Market analysis", phase: "Piyasa analiz ediliyor...", durationMs: 2000, unavailable: "Market report not available", icon: Activity },
  { role: "news", title: "News analysis", phase: "Haberler analiz ediliyor...", durationMs: 3000, unavailable: "News report not available", icon: FileText },
  { role: "analyst", title: "Statistical analysis", phase: "İstatistikler analiz ediliyor...", durationMs: 4000, unavailable: "Statistical report not available", icon: BarChart3 },
];

function NeuralBrain({ durationMs }: { durationMs: number }) {
  return (
    <div className="capitale-neural-scene" aria-hidden="true">
      <div className="capitale-neural-orbit capitale-neural-orbit-a" />
      <div className="capitale-neural-orbit capitale-neural-orbit-b" />
      <span className="capitale-neural-node capitale-neural-node-a" />
      <span className="capitale-neural-node capitale-neural-node-b" />
      <span className="capitale-neural-node capitale-neural-node-c" />
      <span className="capitale-neural-node capitale-neural-node-d" />
      <div className="capitale-neural-center"><BrainCircuit size={35} strokeWidth={1.45} /></div>
      <span className="capitale-neural-sweep" style={{ animationDuration: `${durationMs}ms` }} />
    </div>
  );
}

function AnalysisStage({ spec, index, stageIndex, content }: {
  spec: StageSpec;
  index: number;
  stageIndex: number;
  content: DepartmentSummary | undefined;
}) {
  const pending = index > stageIndex;
  const active = index === stageIndex;
  const done = index < stageIndex;
  const bullets = normalizeSoftwareDetailBullets(content?.software_detail_bullets_en);
  const Icon = spec.icon;

  return (
    <section
      className={`capitale-analysis-card ${active ? "capitale-analysis-card-active" : ""} ${done ? "capitale-analysis-card-done" : ""}`}
      aria-label={spec.title}
      data-state={active ? "analyzing" : done ? "complete" : "pending"}
      data-department={spec.role}
    >
      <div className="capitale-analysis-card-heading">
        <div className="capitale-analysis-icon"><Icon size={18} /></div>
        <div className="min-w-0 flex-1">
          <div className="capitale-analysis-eyebrow">0{index + 1} / {spec.role.toUpperCase()}</div>
          <h4 className="capitale-analysis-title">{spec.title}</h4>
        </div>
        <span className={`capitale-analysis-status ${done ? "capitale-analysis-status-done" : ""}`}>
          {done ? <><Check size={12} /> Complete</> : active ? <><span className="capitale-live-dot" /> Processing</> : <><Clock3 size={12} /> Waiting</>}
        </span>
      </div>

      {active && (
        <div className="capitale-analysis-processing" role="status" aria-live="polite">
          <NeuralBrain durationMs={spec.durationMs} />
          <p className="capitale-analysis-phase">{spec.phase}</p>
          <p className="capitale-analysis-helper">CAPITALE · REPORT VISUALIZATION</p>
          <div className="capitale-analysis-progress-track">
            <div className="capitale-analysis-progress-bar" key={spec.role} style={{ animationDuration: `${spec.durationMs}ms` }} />
          </div>
          <p className="capitale-analysis-time">{Math.round(spec.durationMs / 1000)}s · Preview sequence</p>
        </div>
      )}

      {pending && (
        <div className="capitale-analysis-pending" aria-label="Waiting for preceding report presentation">
          <div className="capitale-analysis-skeleton w-[90%]" />
          <div className="capitale-analysis-skeleton w-[76%]" />
          <div className="capitale-analysis-skeleton w-[61%]" />
          <p>Waiting for previous stage</p>
        </div>
      )}

      {done && (
        <div className="capitale-analysis-results" aria-live="polite">
          {bullets.length ? (
            <ol className="capitale-analysis-bullets">
              {bullets.map((bullet, i) => (
                <li key={i} className="capitale-analysis-bullet" style={{ animationDelay: `${i * 130}ms` }}>
                  <span className="capitale-analysis-bullet-index">{String(i + 1).padStart(2, "0")}</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="capitale-analysis-unavailable">{spec.unavailable}</p>
          )}
        </div>
      )}
    </section>
  );
}

export function SoftwareBrainSequence({ reportKey, summaries, preview = false }: {
  reportKey: string;
  summaries?: SoftwareDepartmentSummaries;
  preview?: boolean;
}) {
  const [stageIndex, setStageIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduce = media.matches;
    setReduceMotion(reduce);
    setStageIndex(reduce ? STAGES.length : 0);
    if (reduce) return;

    let elapsed = 0;
    const timers = STAGES.map((spec, index) => {
      elapsed += spec.durationMs;
      return window.setTimeout(() => setStageIndex(index + 1), elapsed);
    });
    return () => timers.forEach(window.clearTimeout);
  }, [reportKey]);

  return (
    <div className="capitale-analysis-sequence">
      <div className="capitale-analysis-sequence-header">
        <div>
          <p className="capitale-analysis-sequence-kicker">CAPITALE INTELLIGENCE</p>
          <h3 className="capitale-analysis-sequence-heading">Three-stage analysis</h3>
          <p className="capitale-analysis-sequence-caption">Visualizing saved department summaries — no live analysis is being performed.</p>
        </div>
        <span className="capitale-analysis-sequence-count">{stageIndex >= 3 ? "3 / 3 complete" : `Stage ${stageIndex + 1} / 3`}</span>
      </div>
      {preview && <p className="capitale-analysis-demo">DEMO · All scores, money shares, odds and narrative are illustrative — not real match analysis.</p>}
      <div className={`capitale-analysis-grid ${reduceMotion ? "capitale-reduce-motion" : ""}`}>
        {STAGES.map((spec, index) => (
          <AnalysisStage
            key={spec.role}
            index={index}
            spec={spec}
            stageIndex={stageIndex}
            content={summaries?.[spec.role]}
          />
        ))}
      </div>
    </div>
  );
}
