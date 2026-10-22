import React from 'react';
import { getStreakTier, getStreakMilestoneToast } from '../../state/studioState.ts';

export interface HeatMeterProps {
  streak: number;
  highestStreak?: number;
  className?: string;
}

export const HeatMeter: React.FC<HeatMeterProps> = ({
  streak,
  highestStreak = 0,
  className = '',
}) => {
  const tierInfo = getStreakTier(streak);
  const toastMessage = getStreakMilestoneToast(streak);

  // Multiplier mapping
  const getMultiplier = (s: number) => {
    if (s >= 20) return '3.0x';
    if (s >= 10) return '2.5x';
    if (s >= 5) return '2.0x';
    if (s >= 3) return '1.5x';
    return '1.0x';
  };

  // Progress to next tier
  const getNextThreshold = (s: number) => {
    if (s < 3) return { next: 3, prev: 0 };
    if (s < 5) return { next: 5, prev: 3 };
    if (s < 10) return { next: 10, prev: 5 };
    if (s < 20) return { next: 20, prev: 10 };
    return { next: s + 10, prev: 20 };
  };

  const { next, prev } = getNextThreshold(streak);
  const progressPercent = Math.min(100, Math.max(0, ((streak - prev) / (next - prev)) * 100));

  const getTierIcon = () => {
    switch (tierInfo.tier) {
      case 4:
        return '👑✨';
      case 3:
        return '⚡💎';
      case 2:
        return '🔥✨';
      case 1:
        return '🌸🔥';
      case 0:
      default:
        return '🌱';
    }
  };

  return (
    <div
      className={`glass-card p-4 rounded-2xl border border-white/90 shadow-md transition-all ${
        tierInfo.tier >= 3 ? 'iridescent-border' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl animate-bounce">{getTierIcon()}</span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                {tierInfo.badgeTitle}
              </span>
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full bg-violet-100 text-violet-700">
                {getMultiplier(streak)} EXP
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Current Streak: <strong className="text-slate-800">{streak}</strong>
              {highestStreak > streak && (
                <span className="ml-1 opacity-75">(Best: {highestStreak})</span>
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-lg font-black text-slate-900 tracking-tight">
            {streak}
          </span>
          <span className="text-xs text-slate-400 font-semibold block">
            {tierInfo.tier === 4 ? 'MAX TIER' : `${next - streak} to next tier`}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 rounded-full bg-slate-200/70 overflow-hidden shadow-inner">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            tierInfo.tier === 4
              ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 animate-pulse'
              : tierInfo.tier === 3
              ? 'bg-gradient-to-r from-cyan-400 to-blue-600'
              : tierInfo.tier === 2
              ? 'bg-gradient-to-r from-amber-400 to-rose-500'
              : tierInfo.tier === 1
              ? 'bg-gradient-to-r from-pink-400 to-purple-400'
              : 'bg-slate-400'
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Milestone Toast Banner (if at milestone) */}
      {toastMessage && (
        <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-pink-50 via-purple-50 to-cyan-50 border border-pink-200/80 text-xs text-slate-800 font-medium flex items-center gap-2 shadow-sm animate-fade-in">
          <span className="text-base shrink-0">💅</span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default HeatMeter;
