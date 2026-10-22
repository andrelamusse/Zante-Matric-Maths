import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import { FORMULA_SHEET } from '../../data/formulaSheet.ts';
import type { FormulaItem } from '../../types/curriculum.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassButton from '../ui/GlassButton.tsx';

export interface FormulaSheetDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activeFormulaId?: string;
  className?: string;
}

export const FormulaSheetDrawer: React.FC<FormulaSheetDrawerProps> = ({
  isOpen,
  onClose,
  activeFormulaId,
  className = '',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const activeItemRef = useRef<HTMLDivElement | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-scroll to active formula when drawer opens
  useEffect(() => {
    if (isOpen && activeFormulaId && activeItemRef.current) {
      setTimeout(() => {
        activeItemRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 250);
    }
  }, [isOpen, activeFormulaId]);

  if (!isOpen) return null;

  // Extract distinct categories
  const categories = ['all', 'Algebra', 'Patterns', 'Finance', 'Calculus', 'Probability', 'Statistics', 'Analytical Geometry', 'Trigonometry'];

  // Filter formulas
  const q = searchQuery.toLowerCase().trim();
  const filteredFormulas = FORMULA_SHEET.filter((f) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      f.category.toLowerCase() === selectedCategory.toLowerCase() ||
      (selectedCategory === 'Algebra' && f.topicId === 'algebra') ||
      (selectedCategory === 'Patterns' && f.topicId === 'patterns') ||
      (selectedCategory === 'Finance' && f.topicId === 'finance') ||
      (selectedCategory === 'Calculus' && f.topicId === 'calculus') ||
      (selectedCategory === 'Probability' && f.topicId === 'probability') ||
      (selectedCategory === 'Statistics' && f.topicId === 'statistics') ||
      (selectedCategory === 'Analytical Geometry' && f.topicId === 'analytical_geometry') ||
      (selectedCategory === 'Trigonometry' && f.topicId === 'trigonometry');

    if (!matchesCategory) return false;

    if (!q) return true;

    return (
      f.name.toLowerCase().includes(q) ||
      f.description.toLowerCase().includes(q) ||
      f.latex.toLowerCase().includes(q) ||
      (f.usageNotes && f.usageNotes.toLowerCase().includes(q))
    );
  });

  return (
    <div className={`fixed inset-0 z-50 flex justify-end ${className}`}>
      {/* Translucent Dimming Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm transition-opacity"
        onClick={() => {
          soundEngine.playTapPop();
          onClose();
        }}
        aria-hidden="true"
      />

      {/* Slide-over Liquid Glass Panel */}
      <div className="relative w-full max-w-lg h-full glass-card-elevated bg-white/90 backdrop-blur-3xl shadow-2xl flex flex-col z-10 border-l border-white/80 overflow-hidden animate-slide-left">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200/60 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📑</span>
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                Official NSC Formula Sheet
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              DBE Standard Grade 12 Pure Mathematics • 44 Formulas
            </p>
          </div>

          <GlassButton
            variant="ghost"
            size="sm"
            onClick={() => {
              soundEngine.playTapPop();
              onClose();
            }}
            className="!p-2 rounded-full min-h-[36px] min-w-[36px]"
            title="Close Drawer (Esc)"
          >
            <span className="text-base font-bold text-slate-600">✕</span>
          </GlassButton>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200/50 bg-white/40">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search formulas (e.g. quadratic, annuity, sine rule)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm rounded-xl bg-white/80 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto mt-2.5 pb-1 no-scrollbar">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setSelectedCategory(cat);
                  }}
                  className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-white/60 hover:bg-white text-slate-600'
                  }`}
                >
                  {cat === 'all' ? 'All (44)' : cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Formula Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredFormulas.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <span className="text-3xl block mb-2">🔍</span>
              <p className="text-sm font-medium">No formulas found for "{searchQuery}"</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-xs text-violet-600 font-semibold underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            filteredFormulas.map((f: FormulaItem) => {
              const isActive = f.id === activeFormulaId;
              let renderedHtml = '';
              try {
                renderedHtml = katex.renderToString(f.latex, {
                  displayMode: true,
                  throwOnError: false,
                });
              } catch {
                renderedHtml = f.latex;
              }

              return (
                <div
                  key={f.id}
                  ref={isActive ? activeItemRef : undefined}
                  className={`p-4 rounded-xl transition-all ${
                    isActive
                      ? 'iridescent-border bg-white ring-2 ring-violet-400/50 shadow-lg'
                      : 'bg-white/70 hover:bg-white/90 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{f.name}</span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                          f.paper === 'P1'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-emerald-100 text-emerald-700'
                        }`}
                      >
                        {f.paper}
                      </span>
                      {f.isOfficialDBE ? (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                          DBE Official
                        </span>
                      ) : (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-pink-100 text-pink-700 font-medium">
                          Essential
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <span className="text-[11px] font-bold text-violet-600 animate-pulse">
                        Active Question
                      </span>
                    )}
                  </div>

                  {/* Rendered KaTeX Formula */}
                  <div
                    className="py-1 text-slate-900 overflow-x-auto"
                    dangerouslySetInnerHTML={{ __html: renderedHtml }}
                  />

                  {/* Description & Tips */}
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {f.description}
                  </p>

                  {f.usageNotes && (
                    <div className="mt-2 text-[11px] px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 flex items-start gap-1.5">
                      <span className="shrink-0 text-amber-500 font-bold">💡 Tip:</span>
                      <span>{f.usageNotes}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default FormulaSheetDrawer;
