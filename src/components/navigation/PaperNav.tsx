import React from 'react';
import type { PaperId, TopicId } from '../../types/curriculum.ts';
import { TOPICS } from '../../data/topics.ts';
import GlassButton from '../ui/GlassButton.tsx';

export type MainNavTab = 'practice' | 'one_pagers' | 'simulator';

export interface PaperNavProps {
  activePaper: PaperId;
  onPaperChange: (paper: PaperId) => void;
  activeTopic?: TopicId;
  onTopicChange?: (topicId: TopicId) => void;
  activeTab: MainNavTab;
  onTabChange: (tab: MainNavTab) => void;
  className?: string;
}

export const PaperNav: React.FC<PaperNavProps> = ({
  activePaper,
  onPaperChange,
  activeTopic,
  onTopicChange,
  activeTab,
  onTabChange,
  className = '',
}) => {
  const p1Topics = Object.values(TOPICS).filter((t) => t.paper === 'P1');
  const p2Topics = Object.values(TOPICS).filter((t) => t.paper === 'P2');
  const activeTopics = activePaper === 'P1' ? p1Topics : p2Topics;

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 space-y-3 ${className}`}>
      {/* Primary Section Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-1.5 rounded-2xl glass-card">
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
          {/* Paper 1 Tab */}
          <GlassButton
            variant={activeTab === 'practice' && activePaper === 'P1' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              onTabChange('practice');
              onPaperChange('P1');
            }}
            className="!px-3.5 !py-2"
          >
            <span className="font-bold">Paper 1</span>
            <span className="text-[11px] opacity-80">(150m)</span>
          </GlassButton>

          {/* Paper 2 Tab */}
          <GlassButton
            variant={activeTab === 'practice' && activePaper === 'P2' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => {
              onTabChange('practice');
              onPaperChange('P2');
            }}
            className="!px-3.5 !py-2"
          >
            <span className="font-bold">Paper 2</span>
            <span className="text-[11px] opacity-80">(150m)</span>
          </GlassButton>

          {/* One-Pager Cheat Sheets Tab */}
          <GlassButton
            variant={activeTab === 'one_pagers' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('one_pagers')}
            className="!px-3.5 !py-2"
          >
            <span>📑</span>
            <span className="font-semibold">One-Pagers</span>
          </GlassButton>

          {/* 20-Exam Simulator Tab */}
          <GlassButton
            variant={activeTab === 'simulator' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('simulator')}
            className="!px-3.5 !py-2"
          >
            <span>⏱️</span>
            <span className="font-semibold">Exam Simulator</span>
          </GlassButton>
        </div>

        {/* Paper Summary Badge */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 pr-2 font-medium">
          {activeTab === 'practice' ? (
            <span>
              {activePaper === 'P1'
                ? 'Paper 1: Algebra, Patterns, Functions, Finance, Calculus, Probability'
                : 'Paper 2: Statistics, Analytical Geometry, Trigonometry, Euclidean Geometry'}
            </span>
          ) : activeTab === 'one_pagers' ? (
            <span>High-Yield Summaries, Exam Traps & Euclidean Reasons</span>
          ) : (
            <span>Timed 3-Hour 150-Mark Authentic NSC Mock Exam</span>
          )}
        </div>
      </div>

      {/* Sub-Topic Navigator Pills (Only in Practice Mode) */}
      {activeTab === 'practice' && onTopicChange && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {activeTopics.map((topic) => {
            const isSelected = activeTopic === topic.id;
            return (
              <button
                key={topic.id}
                type="button"
                onClick={() => onTopicChange(topic.id)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-semibold transition-all spring-touch ${
                  isSelected
                    ? 'bg-violet-600 text-white shadow-sm shadow-violet-500/25 ring-2 ring-violet-300/50'
                    : 'bg-white/70 hover:bg-white/95 text-slate-700 border border-white/80'
                }`}
              >
                <span>{topic.name}</span>
                <span className={`ml-1.5 text-[10px] ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                  {topic.weightMarks}m
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PaperNav;
