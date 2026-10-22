import React from 'react';
import type { ShieldStatus } from '../../state/studioState.ts';

export interface StreakShieldProps {
  status: ShieldStatus;
  recoveryCount?: number;
  className?: string;
  compact?: boolean;
}

export const StreakShield: React.FC<StreakShieldProps> = ({
  status,
  recoveryCount = 0,
  className = '',
  compact = false,
}) => {
  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border transition-all ${
          status === 'CHARGED'
            ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
            : status === 'ARMED'
            ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-400/50 animate-pulse'
            : 'bg-rose-50 text-rose-600 border-rose-200'
        } ${className}`}
        title={`Pretty Privilege Shield: ${status}`}
      >
        <span>{status === 'SHATTERED' ? '💔' : '🛡️'}</span>
        <span>{status}</span>
        {status === 'SHATTERED' && <span>({recoveryCount}/5)</span>}
      </div>
    );
  }

  return (
    <div
      className={`glass-card p-4 rounded-2xl border transition-all ${
        status === 'ARMED'
          ? 'ring-2 ring-amber-400/60 shadow-lg shadow-amber-400/10'
          : status === 'CHARGED'
          ? 'border-emerald-200/80'
          : 'border-rose-200/60 opacity-90'
      } ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-sm ${
              status === 'CHARGED'
                ? 'bg-gradient-to-br from-emerald-100 to-cyan-100 border border-emerald-200'
                : status === 'ARMED'
                ? 'bg-gradient-to-br from-amber-100 to-rose-100 border border-amber-300 animate-pulse'
                : 'bg-gradient-to-br from-slate-100 to-rose-100 border border-rose-200'
            }`}
          >
            {status === 'SHATTERED' ? '💔' : status === 'ARMED' ? '⚡🛡️' : '🛡️✨'}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-slate-900">
                Pretty Privilege Shield
              </h4>
              <span
                className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  status === 'CHARGED'
                    ? 'bg-emerald-100 text-emerald-800'
                    : status === 'ARMED'
                    ? 'bg-amber-100 text-amber-800 animate-pulse'
                    : 'bg-rose-100 text-rose-700'
                }`}
              >
                {status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {status === 'CHARGED'
                ? 'Armed automatically on Level 4 Complex questions to protect your streak'
                : status === 'ARMED'
                ? 'ACTIVE PROTECTION: A wrong answer on this L4 question will not reset your streak'
                : `Shattered! Solve 5 consecutive questions correctly to recharge (${recoveryCount}/5)`}
            </p>
          </div>
        </div>

        {status === 'SHATTERED' && (
          <div className="text-right pl-2">
            <span className="text-base font-extrabold text-rose-600 block">
              {recoveryCount} / 5
            </span>
            <span className="text-[10px] text-slate-400 font-semibold">recharge</span>
          </div>
        )}
      </div>

      {status === 'SHATTERED' && (
        <div className="mt-3 w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-rose-500 transition-all duration-300 rounded-full"
            style={{ width: `${(recoveryCount / 5) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
};

export default StreakShield;
