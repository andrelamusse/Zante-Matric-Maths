import React, { useState, useMemo } from 'react';
import katex from 'katex';
import type { TopicId, PaperId } from '../../types/curriculum.ts';
import { CHEAT_SHEETS, CHEAT_SHEET_LIST } from '../../data/cheatSheets.ts';
import { TOPICS } from '../../data/topics.ts';
import { GEOMETRY_REASONS } from '../../data/geometryReasons.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassCard from '../ui/GlassCard.tsx';
import GlassButton from '../ui/GlassButton.tsx';
import GlassPill from '../ui/GlassPill.tsx';

// Dynamic Diagrams
import FunctionPlot from '../diagrams/FunctionPlot.tsx';
import AnalyticalGeometryPlot from '../diagrams/AnalyticalGeometryPlot.tsx';
import TrigDiagram from '../diagrams/TrigDiagram.tsx';
import StatsDiagram from '../diagrams/StatsDiagram.tsx';
import EuclideanGeometryDiagram, { EuclideanTheoremType } from '../diagrams/EuclideanGeometryDiagram.tsx';

export interface CheatSheetViewProps {
  initialTopicId?: TopicId;
  onOpenFormulaSheetDrawer?: (formulaId?: string) => void;
  className?: string;
}

export const CheatSheetView: React.FC<CheatSheetViewProps> = ({
  initialTopicId = 'statistics',
  onOpenFormulaSheetDrawer,
  className = '',
}) => {
  const [selectedTopicId, setSelectedTopicId] = useState<TopicId>(initialTopicId);
  const [paperFilter, setPaperFilter] = useState<'ALL' | PaperId>('P2');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRecipeIndex, setActiveRecipeIndex] = useState<number | null>(0);
  const [showReasonsModal, setShowReasonsModal] = useState(false);
  const [reasonsSearchQuery, setReasonsSearchQuery] = useState('');
  const [reasonsCategoryFilter, setReasonsCategoryFilter] = useState<string>('all');

  // Diagram sub-type states
  const [functionPlotType, setFunctionPlotType] = useState<'parabola' | 'hyperbola' | 'exponential'>('parabola');
  const [statsPlotType, setStatsPlotType] = useState<'box_plot' | 'ogive'>('box_plot');
  const [analyticalPlotType, setAnalyticalPlotType] = useState<'circle_tangent' | 'line_inclination'>('circle_tangent');
  const [trigPlotType, setTrigPlotType] = useState<'cast_circle' | 'soh_cah_toa' | 'wave_graphs'>('cast_circle');
  const [euclideanPlotType, setEuclideanPlotType] = useState<EuclideanTheoremType>('angle_at_centre');

  const currentSheet = CHEAT_SHEETS[selectedTopicId] || CHEAT_SHEETS.statistics;
  const currentTopicInfo = TOPICS[selectedTopicId] || TOPICS.statistics;

  // Filtered topics list for pill selector
  const visibleTopicList = useMemo(() => {
    return CHEAT_SHEET_LIST.filter((sheet) => {
      if (paperFilter === 'ALL') return true;
      return sheet.paper === paperFilter;
    });
  }, [paperFilter]);

  // Safe KaTeX renderer
  const renderMath = (latex: string, displayMode: boolean = false): string => {
    try {
      return katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
      });
    } catch {
      return latex;
    }
  };

  // Filtered formulas, traps, and recipes by search query
  const q = searchQuery.toLowerCase().trim();
  const filteredFormulas = useMemo(() => {
    if (!q) return currentSheet.formulas;
    return currentSheet.formulas.filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.latex.toLowerCase().includes(q)
    );
  }, [currentSheet.formulas, q]);

  const filteredTraps = useMemo(() => {
    if (!q) return currentSheet.topTraps;
    return currentSheet.topTraps.filter(
      (t) =>
        t.trap.toLowerCase().includes(q) ||
        t.howToAvoid.toLowerCase().includes(q)
    );
  }, [currentSheet.topTraps, q]);

  const filteredRecipes = useMemo(() => {
    if (!q) return currentSheet.stepByStepRecipes;
    return currentSheet.stepByStepRecipes.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.steps.some((s) => s.toLowerCase().includes(q))
    );
  }, [currentSheet.stepByStepRecipes, q]);

  // Geometry reasons filtering
  const reasonsCategories = [
    { id: 'all', label: 'All Reasons' },
    { id: 'lines_angles', label: 'Lines & Angles' },
    { id: 'triangles_polygons', label: 'Triangles' },
    { id: 'circles_chords', label: 'Chords' },
    { id: 'circles_cyclic', label: 'Cyclic Quads' },
    { id: 'circles_tangents', label: 'Tangents' },
    { id: 'proportionality_similarity', label: 'Similarity' },
  ];

  const filteredReasons = useMemo(() => {
    const rq = reasonsSearchQuery.toLowerCase().trim();
    return GEOMETRY_REASONS.filter((r) => {
      const matchCat = reasonsCategoryFilter === 'all' || r.category === reasonsCategoryFilter;
      if (!matchCat) return false;
      if (!rq) return true;
      return (
        r.acceptableShortReason.toLowerCase().includes(rq) ||
        r.fullTheorem.toLowerCase().includes(rq)
      );
    });
  }, [reasonsSearchQuery, reasonsCategoryFilter]);

  const handleTopicSelect = (id: TopicId) => {
    soundEngine.playTapPop();
    setSelectedTopicId(id);
    setActiveRecipeIndex(0);
    // Reset relevant diagram subtype
    if (id === 'functions' || id === 'algebra') setFunctionPlotType('parabola');
    if (id === 'statistics') setStatsPlotType('box_plot');
    if (id === 'analytical_geometry') setAnalyticalPlotType('circle_tangent');
    if (id === 'trigonometry') setTrigPlotType('cast_circle');
    if (id === 'euclidean_geometry') setEuclideanPlotType('angle_at_centre');
  };

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${className}`}>
      {/* Top Banner & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-3xl glass-card-elevated iridescent-border bg-white/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">📑</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              One-Pager Cheat Sheets & High-Yield Summaries
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Official CAPS Grade 12 pure mathematics formulas, examiner traps, decision algorithms, and reasons.
          </p>
        </div>

        {/* Paper Filter & Search Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Paper selector buttons */}
          <div className="flex items-center p-1 rounded-2xl bg-slate-200/60 border border-white/80">
            <button
              type="button"
              onClick={() => {
                soundEngine.playTapPop();
                setPaperFilter('P2');
                if (currentSheet.paper !== 'P2') setSelectedTopicId('statistics');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                paperFilter === 'P2'
                  ? 'bg-white text-emerald-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paper 2 (Special Edition)
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTapPop();
                setPaperFilter('ALL');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                paperFilter === 'ALL'
                  ? 'bg-white text-violet-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Topics
            </button>
            <button
              type="button"
              onClick={() => {
                soundEngine.playTapPop();
                setPaperFilter('P1');
                if (currentSheet.paper !== 'P1') setSelectedTopicId('algebra');
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                paperFilter === 'P1'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Paper 1
            </button>
          </div>

          {/* Search input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search cheat sheet..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-7 py-1.5 text-xs rounded-xl bg-white/90 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400 w-44 sm:w-56"
            />
            <span className="absolute left-2.5 top-2 text-xs text-slate-400">🔍</span>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Euclidean reasons drawer trigger button */}
          <GlassButton
            variant="subtle"
            size="sm"
            onClick={() => {
              soundEngine.playTapPop();
              setShowReasonsModal(true);
            }}
            title="Browse all 40+ official CAPS acceptable reasons"
            className="!px-3 !py-1.5 text-xs font-semibold"
          >
            <span>📐 Reasons DB</span>
          </GlassButton>
        </div>
      </div>

      {/* 10-Topic Pill Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {visibleTopicList.map((sheet) => {
          const isSelected = selectedTopicId === sheet.topicId;
          const info = TOPICS[sheet.topicId];
          return (
            <button
              key={sheet.topicId}
              type="button"
              onClick={() => handleTopicSelect(sheet.topicId)}
              className={`whitespace-nowrap flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all spring-touch ${
                isSelected
                  ? 'bg-violet-600 text-white shadow-md shadow-violet-500/25 ring-2 ring-violet-300 scale-100'
                  : 'bg-white/80 hover:bg-white text-slate-700 border border-white/80 shadow-sm scale-95 opacity-85'
              }`}
            >
              <span className={`px-1.5 py-0.5 rounded text-[10px] ${isSelected ? 'bg-violet-700/80 text-violet-100' : 'bg-slate-100 text-slate-500'}`}>
                {sheet.paper}
              </span>
              <span>{info?.shortName || sheet.title}</span>
              <span className={`text-[11px] font-extrabold ${isSelected ? 'text-violet-200' : 'text-slate-400'}`}>
                {sheet.examWeightMarks}m
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Topic Hero Card */}
      <GlassCard elevation="md" className="p-6 bg-white/85 border border-white/90">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                currentSheet.paper === 'P1' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
              }`}>
                {currentSheet.paper} • {currentSheet.examWeightMarks} Marks ({currentTopicInfo.weightPercent}%)
              </span>
              <span className="text-xs font-bold text-slate-500">
                Typical Exam Placement: {currentTopicInfo.typicalQuestions}
              </span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
              {currentSheet.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
              {currentTopicInfo.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onOpenFormulaSheetDrawer && (
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => onOpenFormulaSheetDrawer()}
                className="!px-4 font-bold"
              >
                <span>Fx Slide-Over Sheet</span>
              </GlassButton>
            )}
            {selectedTopicId === 'euclidean_geometry' && (
              <GlassButton
                variant="iridescent"
                size="sm"
                onClick={() => setShowReasonsModal(true)}
                className="!px-4 font-bold"
              >
                <span>Official Reasons (40)</span>
              </GlassButton>
            )}
          </div>
        </div>

        {/* Cognitive Target Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Level 1 • Knowledge</span>
            <span className="text-sm font-extrabold text-slate-800">{currentTopicInfo.cognitiveTarget.L1} Marks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Level 2 • Routine</span>
            <span className="text-sm font-extrabold text-slate-800">{currentTopicInfo.cognitiveTarget.L2} Marks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Level 3 • Complex</span>
            <span className="text-sm font-extrabold text-slate-800">{currentTopicInfo.cognitiveTarget.L3} Marks</span>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Level 4 • Problem Solving</span>
            <span className="text-sm font-extrabold text-slate-800">{currentTopicInfo.cognitiveTarget.L4} Marks</span>
          </div>
        </div>
      </GlassCard>

      {/* Dynamic Interactive SVG Diagram for Active Topic */}
      <GlassCard elevation="md" className="p-5 bg-white/85">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">📊</span>
            <h4 className="text-sm font-bold text-slate-900 tracking-tight">
              Interactive Visual Concept Model
            </h4>
          </div>

          {/* Diagram Type Sub-Switcher based on Topic */}
          {(selectedTopicId === 'algebra' || selectedTopicId === 'functions') && (
            <div className="flex items-center gap-1">
              {(['parabola', 'hyperbola', 'exponential'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setFunctionPlotType(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    functionPlotType === t ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          )}

          {selectedTopicId === 'statistics' && (
            <div className="flex items-center gap-1">
              {(['box_plot', 'ogive'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setStatsPlotType(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    statsPlotType === t ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.replace('_', ' ')}
                </button>
              ))}
            </div>
          )}

          {selectedTopicId === 'analytical_geometry' && (
            <div className="flex items-center gap-1">
              {(['circle_tangent', 'line_inclination'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setAnalyticalPlotType(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    analyticalPlotType === t ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'circle_tangent' ? 'Circle Tangent' : 'Inclination'}
                </button>
              ))}
            </div>
          )}

          {selectedTopicId === 'trigonometry' && (
            <div className="flex items-center gap-1">
              {(['cast_circle', 'soh_cah_toa', 'wave_graphs'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setTrigPlotType(t);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                    trigPlotType === t ? 'bg-violet-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'cast_circle' ? 'CAST Circle' : t === 'soh_cah_toa' ? 'Triangle' : 'Waves'}
                </button>
              ))}
            </div>
          )}

          {selectedTopicId === 'euclidean_geometry' && (
            <div className="flex items-center gap-1 flex-wrap">
              {(
                [
                  { id: 'angle_at_centre', label: '∠ at Centre' },
                  { id: 'center_chord', label: 'Chord Bisector' },
                  { id: 'angles_same_segment', label: 'Same Seg' },
                  { id: 'cyclic_quad', label: 'Cyclic Quad' },
                  { id: 'tan_chord', label: 'Tan-Chord' },
                  { id: 'proportionality', label: 'Similarity' },
                ] as const
              ).map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setEuclideanPlotType(t.id);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                    euclideanPlotType === t.id
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Render the matching diagram component */}
        <div className="w-full flex justify-center">
          {selectedTopicId === 'algebra' || selectedTopicId === 'functions' ? (
            <FunctionPlot type={functionPlotType} />
          ) : selectedTopicId === 'statistics' ? (
            <StatsDiagram type={statsPlotType} />
          ) : selectedTopicId === 'analytical_geometry' ? (
            <AnalyticalGeometryPlot type={analyticalPlotType} />
          ) : selectedTopicId === 'trigonometry' ? (
            <TrigDiagram type={trigPlotType} />
          ) : selectedTopicId === 'euclidean_geometry' ? (
            <EuclideanGeometryDiagram type={euclideanPlotType} />
          ) : selectedTopicId === 'patterns' ? (
            <FunctionPlot
              type="parabola"
              params={{ a: 1, p: 0, q: 0 }}
              className="opacity-90"
            />
          ) : selectedTopicId === 'finance' ? (
            <FunctionPlot
              type="exponential"
              params={{ a: 1, b: 1.1, p: 0, q: 0 }}
            />
          ) : (
            <FunctionPlot
              type="parabola"
              params={{ a: -0.5, p: 2, q: 4 }}
            />
          )}
        </div>
      </GlassCard>

      {/* Two-Column Section: Formulas Grid (Left) & Top Traps (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Core Formulas Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">🧮</span>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Core Formulas & Invariants ({filteredFormulas.length})
              </h4>
            </div>
            <span className="text-xs text-slate-400">Click formula to copy</span>
          </div>

          <div className="space-y-3">
            {filteredFormulas.map((f, idx) => (
              <GlassCard
                key={idx}
                elevation="sm"
                className="p-4 bg-white/80 hover:bg-white border border-slate-200/80 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-slate-900">{f.name}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 font-semibold">
                    Formula {idx + 1}
                  </span>
                </div>

                {/* KaTeX Display */}
                <div
                  className="py-2 overflow-x-auto text-slate-900 font-mono text-center"
                  dangerouslySetInnerHTML={{ __html: renderMath(f.latex, true) }}
                />

                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {f.description}
                </p>
              </GlassCard>
            ))}

            {filteredFormulas.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No formulas matched your search.
              </div>
            )}
          </div>
        </div>

        {/* Top Traps Callout Cards */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Top 5 Examiner Traps & Gotchas
              </h4>
            </div>
            <span className="text-xs text-amber-600 font-semibold">High-Loss Errors</span>
          </div>

          <div className="space-y-3">
            {filteredTraps.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 via-orange-50/60 to-white/90 border border-amber-200/80 shadow-sm transition-all"
              >
                <div className="flex items-start gap-2.5">
                  <span className="shrink-0 text-base mt-0.5">🚨</span>
                  <div className="space-y-1.5 flex-1">
                    <h5 className="text-xs font-black text-rose-800 leading-snug">
                      Trap {idx + 1}: {t.trap}
                    </h5>
                    <div className="p-2.5 rounded-xl bg-white/90 border border-amber-200/70 text-xs text-slate-700 leading-relaxed font-medium">
                      <span className="font-bold text-emerald-700 mr-1.5">✓ How to Avoid:</span>
                      {t.howToAvoid}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredTraps.length === 0 && (
              <div className="text-center py-8 text-slate-400 text-xs">
                No examiner traps matched your search.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step-by-Step Recipes & Decision Algorithms */}
      <GlassCard elevation="md" className="p-6 bg-white/85">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📋</span>
            <div>
              <h4 className="text-base font-bold text-slate-900 tracking-tight">
                Step-by-Step Solution Recipes & Decision Trees
              </h4>
              <p className="text-xs text-slate-500">
                Standardised algorithms calibrated to full-mark DBE marking guidelines.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {filteredRecipes.map((recipe, rIdx) => {
            const isExpanded = activeRecipeIndex === rIdx;
            return (
              <div
                key={rIdx}
                className="rounded-2xl border border-slate-200/80 bg-white/90 overflow-hidden shadow-sm transition-all"
              >
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setActiveRecipeIndex(isExpanded ? null : rIdx);
                  }}
                  className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-violet-100 text-violet-700 font-bold text-xs flex items-center justify-center">
                      {rIdx + 1}
                    </span>
                    <h5 className="text-sm font-bold text-slate-900">
                      {recipe.title}
                    </h5>
                  </div>
                  <span className="text-xs font-bold text-violet-600">
                    {isExpanded ? 'Collapse ⎯' : 'View Recipe ▾'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-2.5 animate-fade-in">
                    {recipe.steps.map((step, sIdx) => (
                      <div key={sIdx} className="flex items-start gap-3">
                        <span className="shrink-0 text-xs font-extrabold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                          Step {sIdx + 1}
                        </span>
                        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                          {step}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {filteredRecipes.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs">
              No solution recipes matched your search.
            </div>
          )}
        </div>
      </GlassCard>

      {/* Official Acceptable Reasons Modal / Slide-Out */}
      {showReasonsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] rounded-3xl glass-card-elevated iridescent-border p-6 bg-white/95 shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📐</span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Official CAPS Acceptable Geometry Reasons
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verbatim shorthand phrases accepted by DBE NSC marking guidelines ({GEOMETRY_REASONS.length} total)
                </p>
              </div>

              <GlassButton
                variant="ghost"
                size="sm"
                onClick={() => {
                  soundEngine.playTapPop();
                  setShowReasonsModal(false);
                }}
                className="!p-2 rounded-full"
              >
                ✕
              </GlassButton>
            </div>

            {/* Filter & Search Bar inside modal */}
            <div className="py-3 border-b border-slate-200/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <input
                type="text"
                placeholder="Search acceptable reasons (e.g. tan-chord, cyclic quad, parallel)..."
                value={reasonsSearchQuery}
                onChange={(e) => setReasonsSearchQuery(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
              />

              <div className="flex items-center gap-1 overflow-x-auto pb-1 no-scrollbar">
                {reasonsCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTapPop();
                      setReasonsCategoryFilter(cat.id);
                    }}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      reasonsCategoryFilter === cat.id
                        ? 'bg-violet-600 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reasons List */}
            <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
              {filteredReasons.map((r) => (
                <div
                  key={r.id}
                  className="p-3 rounded-xl bg-white border border-slate-200/70 hover:border-violet-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Grade {r.grade} • {r.category.replace('_', ' ')}
                    </span>
                    <p className="text-xs text-slate-700 leading-snug font-medium">
                      {r.fullTheorem}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center">
                    <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-xs font-bold whitespace-nowrap">
                      {r.acceptableShortReason}
                    </span>
                  </div>
                </div>
              ))}

              {filteredReasons.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No reasons found for "{reasonsSearchQuery}".
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200/80 flex justify-end">
              <GlassButton
                variant="primary"
                size="sm"
                onClick={() => {
                  soundEngine.playTapPop();
                  setShowReasonsModal(false);
                }}
                className="!px-5 font-bold"
              >
                Done
              </GlassButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheatSheetView;
