import React, { useState } from 'react';
import katex from 'katex';
import type { QuestionMemo } from '../../types/curriculum.ts';
import GlassCard from '../ui/GlassCard.tsx';

export interface NscMemoCardProps {
  nscMemo: QuestionMemo;
  className?: string;
  defaultExpanded?: boolean;
}

export const NscMemoCard: React.FC<NscMemoCardProps> = ({
  nscMemo,
  className = '',
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (!nscMemo || !Array.isArray(nscMemo.steps) || nscMemo.steps.length === 0) {
    return null;
  }

  const renderMath = (latex: string) => {
    try {
      return katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  };

  return (
    <GlassCard
      elevation="sm"
      className={`p-4 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white/80 to-slate-50 border border-emerald-200/80 shadow-sm ${className}`}
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">📐</span>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Layer 2 • Full-Marks NSC Memo
              </h4>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {nscMemo.totalMarks} {nscMemo.totalMarks === 1 ? 'Mark' : 'Marks'}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">
              Official DBE Marking Guideline • Step-by-Step Ticked Criteria
            </span>
          </div>
        </div>

        <button
          type="button"
          className="text-xs font-bold px-2.5 py-1 rounded-full bg-white text-emerald-700 border border-emerald-300 hover:bg-emerald-50 transition-all"
        >
          {expanded ? 'Collapse Memo' : 'View Memo'}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-emerald-200/60 space-y-2.5">
          {nscMemo.steps.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start justify-between gap-3 p-2.5 rounded-xl bg-white/80 border border-slate-200/70"
            >
              {/* Step Latex Solution */}
              <div
                className="text-sm text-slate-900 overflow-x-auto flex-1 font-mono"
                dangerouslySetInnerHTML={{ __html: renderMath(step.stepLatex) }}
              />

              {/* DBE Tick Mark Allocation Badge */}
              <div className="shrink-0 flex items-center">
                <span className="dbe-tick-mark">
                  {step.tickAllocation.includes('\\checkmark') || step.tickAllocation.includes('✓') ? (
                    <span
                      dangerouslySetInnerHTML={{
                        __html: renderMath(step.tickAllocation),
                      }}
                    />
                  ) : (
                    <span>✓ {step.tickAllocation}</span>
                  )}
                </span>
              </div>
            </div>
          ))}

          <div className="text-right pt-1">
            <span className="text-xs font-bold text-slate-500">
              Total Marks: <strong className="text-emerald-700 font-extrabold">{nscMemo.totalMarks}</strong>
            </span>
          </div>
        </div>
      )}
    </GlassCard>
  );
};

export default NscMemoCard;
