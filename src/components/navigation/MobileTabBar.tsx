import React from 'react';
import type { PaperId } from '../../types/curriculum.ts';
import type { MainNavTab } from './PaperNav.tsx';
import { soundEngine } from '../../sound/audioEngine.ts';

export interface MobileTabBarProps {
  activePaper: PaperId;
  onPaperChange: (paper: PaperId) => void;
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  onToggleFormulaSheet: () => void;
  onToggleScratchpad: () => void;
  isScratchpadActive?: boolean;
}

export const MobileTabBar: React.FC<MobileTabBarProps> = ({
  activePaper,
  onPaperChange,
  activeTab,
  onTabChange,
  onToggleFormulaSheet,
  onToggleScratchpad,
  isScratchpadActive = false,
}) => {
  const handleNav = (tab: MainNavTab, paper?: PaperId) => {
    soundEngine.playTapPop();
    onTabChange(tab);
    if (paper) onPaperChange(paper);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/80 backdrop-blur-2xl border-t border-white/80 shadow-lg px-2 py-1.5 pb-safe">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {/* Paper 2 Tab (Special Edition) */}
        <button
          type="button"
          onClick={() => handleNav('practice', 'P2')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl px-2 py-1 transition-all ${
            activeTab === 'practice' && activePaper === 'P2'
              ? 'text-violet-700 font-bold bg-violet-50/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-base">📐</span>
          <span className="text-[10px] tracking-tight font-semibold">Paper 2</span>
        </button>

        {/* Paper 1 Tab */}
        <button
          type="button"
          onClick={() => handleNav('practice', 'P1')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl px-2 py-1 transition-all ${
            activeTab === 'practice' && activePaper === 'P1'
              ? 'text-violet-700 font-bold bg-violet-50/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-base">📘</span>
          <span className="text-[10px] tracking-tight">Paper 1</span>
        </button>

        {/* One-Pager Cheat Sheets */}
        <button
          type="button"
          onClick={() => handleNav('one_pagers')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl px-2 py-1 transition-all ${
            activeTab === 'one_pagers'
              ? 'text-violet-700 font-bold bg-violet-50/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-base">📑</span>
          <span className="text-[10px] tracking-tight">Sheets</span>
        </button>

        {/* 20-Exam Simulator */}
        <button
          type="button"
          onClick={() => handleNav('simulator')}
          className={`flex flex-col items-center justify-center min-w-[54px] min-h-[44px] rounded-xl px-2 py-1 transition-all ${
            activeTab === 'simulator'
              ? 'text-violet-700 font-bold bg-violet-50/80 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span className="text-base">⏱️</span>
          <span className="text-[10px] tracking-tight">Exam</span>
        </button>

        {/* Formula Sheet Quick Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTapPop();
            onToggleFormulaSheet();
          }}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl px-1.5 py-1 text-slate-700 hover:text-slate-900 active:scale-95"
          title="Open Formula Sheet"
        >
          <span className="text-xs font-bold bg-slate-200/80 px-1.5 py-0.5 rounded-md">Fx</span>
          <span className="text-[10px]">Formulas</span>
        </button>

        {/* Scratchpad Quick Button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTapPop();
            onToggleScratchpad();
          }}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] rounded-xl px-1.5 py-1 transition-all ${
            isScratchpadActive
              ? 'text-violet-700 font-bold bg-violet-100/80'
              : 'text-slate-700 hover:text-slate-900'
          }`}
          title="Toggle Scratchpad"
        >
          <span className="text-base">✏️</span>
          <span className="text-[10px]">Draw</span>
        </button>
      </div>
    </div>
  );
};

export default MobileTabBar;
