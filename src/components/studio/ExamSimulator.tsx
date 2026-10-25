import React, { useState, useEffect, useMemo, useRef } from 'react';
import katex from 'katex';
import confetti from 'canvas-confetti';
import type { PaperId, TopicId, CognitiveLevel, Question } from '../../types/curriculum.ts';
import { TOPICS } from '../../data/topics.ts';
import { PAST_PAPER_QUESTIONS } from '../../data/pastPaperQuestions.ts';
import { generateP1Question } from '../../generators/p1Generators.ts';
import { generateP2Question } from '../../generators/p2Generators.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassCard from '../ui/GlassCard.tsx';
import GlassButton from '../ui/GlassButton.tsx';
import GlassPill from '../ui/GlassPill.tsx';

// Dynamic Diagrams
import FunctionPlot from '../diagrams/FunctionPlot.tsx';
import AnalyticalGeometryPlot from '../diagrams/AnalyticalGeometryPlot.tsx';
import TrigDiagram from '../diagrams/TrigDiagram.tsx';
import StatsDiagram from '../diagrams/StatsDiagram.tsx';
import EuclideanGeometryDiagram from '../diagrams/EuclideanGeometryDiagram.tsx';

import {
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
  type ExamArchetype,
  type BlueprintQuestionSpec,
} from '../../data/cheatSheets.ts';

export {
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
  type ExamArchetype,
  type BlueprintQuestionSpec,
};

export interface ExamSimulatorProps {
  initialPaper?: PaperId;
  onOpenFormulaSheet?: (formulaId?: string) => void;
  className?: string;
}

export const ExamSimulator: React.FC<ExamSimulatorProps> = ({
  initialPaper = 'P2',
  onOpenFormulaSheet,
  className = '',
}) => {
  const [selectedPaper, setSelectedPaper] = useState<PaperId>(initialPaper);
  const [selectedArchetypeId, setSelectedArchetypeId] = useState<string>('EX-01');
  const [isExamActive, setIsExamActive] = useState<boolean>(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState<boolean>(false);

  // Timer: 3 Hours = 180 minutes = 10,800 seconds
  const INITIAL_TIMER_SECONDS = 180 * 60;
  const [secondsRemaining, setSecondsRemaining] = useState<number>(INITIAL_TIMER_SECONDS);
  const [isTimerPaused, setIsTimerPaused] = useState<boolean>(false);

  // Questions and User Progress
  const [examQuestions, setExamQuestions] = useState<Question[]>(() =>
    buildMockExamQuestions(initialPaper || 'P2', 'EX-01')
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({}); // { questionIndex: answerOptionId }
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Review mode filter: 'all' | 'incorrect' | 'flagged'
  const [reviewFilter, setReviewFilter] = useState<'all' | 'incorrect' | 'flagged'>('all');

  // Timer countdown hook
  useEffect(() => {
    if (!isExamActive || isExamSubmitted || isTimerPaused) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isExamActive, isExamSubmitted, isTimerPaused]);

  // Start / Restart Exam
  const handleStartExam = (paper: PaperId, archetypeId: string) => {
    soundEngine.playTapPop();
    const questions = buildMockExamQuestions(paper, archetypeId);
    setExamQuestions(questions);
    setSelectedPaper(paper);
    setSelectedArchetypeId(archetypeId);
    setSecondsRemaining(INITIAL_TIMER_SECONDS);
    setIsTimerPaused(false);
    setSelectedAnswers({});
    setFlaggedQuestions({});
    setCurrentQuestionIndex(0);
    setIsExamActive(true);
    setIsExamSubmitted(false);
  };

  const handleAutoSubmit = () => {
    soundEngine.playErrorChime();
    setIsExamActive(false);
    setIsExamSubmitted(true);
  };

  const handleSubmitExam = () => {
    soundEngine.playGlassChime();
    setIsExamActive(false);
    setIsExamSubmitted(true);
    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FF85B3', '#C084FC', '#38BDF8', '#FDBA74', '#6EE7B7'],
      });
    } catch {
      // Ignore
    }
  };

  const handleSelectAnswer = (optionId: string) => {
    soundEngine.playTapPop();
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionId,
    }));
  };

  const handleToggleFlag = (qIdx: number) => {
    soundEngine.playTapPop();
    setFlaggedQuestions((prev) => ({
      ...prev,
      [qIdx]: !prev[qIdx],
    }));
  };

  // Keyboard speedrun navigation during live exam
  useEffect(() => {
    if (!isExamActive || isExamSubmitted) return;

    const handleExamKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      const key = e.key;
      const curQ = examQuestions[currentQuestionIndex];
      if (!curQ) return;

      // 1..4 or A..D / a..d option selection
      let selectedIdx: number | null = null;
      if (key === '1' || key === 'a' || key === 'A') selectedIdx = 0;
      else if (key === '2' || key === 'b' || key === 'B') selectedIdx = 1;
      else if (key === '3' || key === 'c' || key === 'C') selectedIdx = 2;
      else if (key === '4' || key === 'd' || key === 'D') selectedIdx = 3;

      if (selectedIdx !== null && selectedIdx < curQ.distractors.length) {
        e.preventDefault();
        handleSelectAnswer(curQ.distractors[selectedIdx].id);
      } else if (key === 'ArrowRight' || key === 'Enter') {
        if (currentQuestionIndex < examQuestions.length - 1) {
          e.preventDefault();
          soundEngine.playTapPop();
          setCurrentQuestionIndex((prev) => prev + 1);
        }
      } else if (key === 'ArrowLeft') {
        if (currentQuestionIndex > 0) {
          e.preventDefault();
          soundEngine.playTapPop();
          setCurrentQuestionIndex((prev) => prev - 1);
        }
      }
    };

    window.addEventListener('keydown', handleExamKeyDown);
    return () => window.removeEventListener('keydown', handleExamKeyDown);
  }, [isExamActive, isExamSubmitted, currentQuestionIndex, examQuestions]);

  // Safe KaTeX formatting
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

  // Timer formatting
  const formatTime = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentQ = examQuestions[currentQuestionIndex] || examQuestions[0];
  const totalExamMarks = useMemo(() => examQuestions.reduce((sum, q) => sum + q.marks, 0), [examQuestions]);

  // Score Calculation
  const examResults = useMemo(() => {
    let earnedMarks = 0;
    const topicScores: Record<string, { earned: number; total: number; name: string }> = {};
    const cognitiveScores: Record<CognitiveLevel, { earned: number; total: number }> = {
      L1: { earned: 0, total: 0 },
      L2: { earned: 0, total: 0 },
      L3: { earned: 0, total: 0 },
      L4: { earned: 0, total: 0 },
    };

    examQuestions.forEach((q, idx) => {
      const chosenId = selectedAnswers[idx];
      const isCorrect = chosenId === q.correctAnswerId;
      const qMarks = q.marks;

      // Cognitive
      cognitiveScores[q.cognitiveLevel].total += qMarks;
      if (isCorrect) {
        cognitiveScores[q.cognitiveLevel].earned += qMarks;
        earnedMarks += qMarks;
      }

      // Topic
      if (!topicScores[q.topic]) {
        topicScores[q.topic] = {
          earned: 0,
          total: 0,
          name: TOPICS[q.topic]?.name || q.topic,
        };
      }
      topicScores[q.topic].total += qMarks;
      if (isCorrect) {
        topicScores[q.topic].earned += qMarks;
      }
    });

    const percentage = totalExamMarks > 0 ? (earnedMarks / totalExamMarks) * 100 : 0;
    let distinctionTitle = 'Elementary Standard';
    let distinctionBadge = '🌱 Need Practice';
    if (percentage >= 80) {
      distinctionTitle = 'Distinction Standard (Level 7)';
      distinctionBadge = '👑 Distinction 💅';
    } else if (percentage >= 70) {
      distinctionTitle = 'Meritorious Achievement (Level 6)';
      distinctionBadge = '🔥 Meritorious';
    } else if (percentage >= 60) {
      distinctionTitle = 'Substantial Achievement (Level 5)';
      distinctionBadge = '⚡ Substantial';
    } else if (percentage >= 50) {
      distinctionTitle = 'Moderate Achievement (Level 4)';
      distinctionBadge = '📘 Moderate Pass';
    }

    return {
      earnedMarks,
      totalExamMarks,
      percentage,
      distinctionTitle,
      distinctionBadge,
      topicScores,
      cognitiveScores,
    };
  }, [examQuestions, selectedAnswers, totalExamMarks]);

  // Count answered questions
  const answeredCount = Object.keys(selectedAnswers).length;
  const flaggedCount = Object.values(flaggedQuestions).filter(Boolean).length;

  return (
    <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${className}`}>
      {/* Simulator Lobby / Paper & Archetype Selection */}
      {!isExamActive && !isExamSubmitted && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-card-elevated iridescent-border bg-white/90">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200/60">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-3xl">⏱️</span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      Paper 2 20-Exam Simulator
                    </h2>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Authentic DBE NSC Paper 2 Standard • 150 Marks • 3 Hours • 4 Topics
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-3xl leading-relaxed">
                  Experience authentic examination conditions calibrated to the official 4-tier cognitive taxonomy
                  (L1 20%, L2 35%, L3 30%, L4 15%). Includes live countdown timer, question palette matrix, and step-by-step ticked NSC Memos.
                </p>
              </div>

              {/* Quick Paper Toggle */}
              <div className="flex items-center p-1 rounded-2xl bg-slate-200/70 border border-white/80 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setSelectedPaper('P2');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedPaper === 'P2'
                      ? 'bg-white text-emerald-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📐 Paper 2 Special Edition (10 Questions • 150m)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setSelectedPaper('P1');
                  }}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    selectedPaper === 'P1'
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  📘 Paper 1 (11 Questions • 150m)
                </button>
              </div>
            </div>

            {/* Blueprint Overview Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Duration</span>
                <span className="text-base font-black text-slate-900">3 Hours (180 min)</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Total Mark Weight</span>
                <span className="text-base font-black text-violet-700">150 Marks Exact</span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Question Count</span>
                <span className="text-base font-black text-slate-900">
                  {selectedPaper === 'P1' ? '11 Questions' : '10 Questions'}
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-white border border-slate-200/70 text-center shadow-sm">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Marking Memo</span>
                <span className="text-base font-black text-emerald-700">DBE Tick Marks (✓)</span>
              </div>
            </div>

            {/* Paper 2 4-Section Breakdown Pill */}
            {selectedPaper === 'P2' && (
              <div className="p-3 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between flex-wrap gap-2 text-xs mb-2">
                <span className="font-extrabold text-emerald-900 flex items-center gap-1.5">
                  <span>📐</span>
                  <span>Official CAPS Paper 2 Breakdown (150 Marks):</span>
                </span>
                <div className="flex items-center gap-2 flex-wrap font-semibold text-emerald-800">
                  <span className="px-2 py-0.5 rounded-full bg-white border border-emerald-200 shadow-2xs">📊 Statistics (20 ± 3m)</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-emerald-200 shadow-2xs">📏 Analytical Geometry (40 ± 3m)</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-emerald-200 shadow-2xs">🔄 Trigonometry (50 ± 3m)</span>
                  <span className="px-2 py-0.5 rounded-full bg-white border border-emerald-200 shadow-2xs">⭕ Euclidean Geometry (40 ± 3m)</span>
                </div>
              </div>
            )}

            {/* 20 Archetype Selector Grid */}
            <div className="mt-4 pt-4 border-t border-slate-200/60">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Select Exam Archetype ({EXAM_ARCHETYPES.length} Available)
                </span>
                <span className="text-xs text-slate-500">Mined from official DBE NSC & Provincial Prelims</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2.5 max-h-72 overflow-y-auto pr-1">
                {EXAM_ARCHETYPES.map((arch) => {
                  const isSelected = selectedArchetypeId === arch.id;
                  return (
                    <div
                      key={arch.id}
                      onClick={() => {
                        soundEngine.playTapPop();
                        setSelectedArchetypeId(arch.id);
                      }}
                      className={`p-3 rounded-xl border text-left cursor-pointer transition-all spring-touch ${
                        isSelected
                          ? 'bg-violet-50/90 border-violet-400 shadow-sm ring-2 ring-violet-300/60'
                          : 'bg-white/70 hover:bg-white border-slate-200/80 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                          {arch.id}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">{arch.session} {arch.year}</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                        {arch.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                        {arch.distinctionFeature}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Launch Exam CTA */}
            <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between flex-wrap gap-4">
              <div className="text-xs text-slate-500">
                Selected: <strong className="text-slate-800">{EXAM_ARCHETYPES.find((a) => a.id === selectedArchetypeId)?.name}</strong> ({selectedPaper})
              </div>

              <GlassButton
                variant="primary"
                size="lg"
                onClick={() => handleStartExam(selectedPaper, selectedArchetypeId)}
                className="!px-8 font-black text-base shadow-lg shadow-violet-500/25"
              >
                <span>Start 3-Hour Mock Exam ⚡</span>
              </GlassButton>
            </div>
          </div>
        </div>
      )}

      {/* Live Exam In Progress Runner */}
      {isExamActive && !isExamSubmitted && (
        <div className="space-y-4">
          {/* Top Sticky Status Bar: Timer, Mark Progress, Action Controls */}
          <div className="sticky top-16 z-20 p-3 sm:p-4 rounded-2xl glass-card-elevated bg-white/95 border border-white/90 shadow-md flex items-center justify-between gap-2 flex-wrap">
            {/* Left: Exam Identifier */}
            <div className="flex items-center gap-2">
              <span className="text-xl">⏱️</span>
              <div>
                <span className="text-xs font-black text-slate-900">
                  {selectedPaper} • {EXAM_ARCHETYPES.find((a) => a.id === selectedArchetypeId)?.name}
                </span>
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span>Q {currentQuestionIndex + 1} of {examQuestions.length}</span>
                  <span>•</span>
                  <span>{answeredCount} of {examQuestions.length} Answered</span>
                </div>
              </div>
            </div>

            {/* Center: 3-Hour Countdown Timer */}
            <div className="flex items-center gap-2">
              <div
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-mono text-sm sm:text-base font-black transition-all ${
                  secondsRemaining < 600
                    ? 'bg-rose-100 text-rose-700 animate-pulse border border-rose-300'
                    : secondsRemaining < 1800
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-800 border border-slate-200'
                }`}
                title="3-Hour Countdown Timer"
              >
                <span>⏳</span>
                <span>{formatTime(secondsRemaining)}</span>
              </div>

              <button
                type="button"
                onClick={() => {
                  soundEngine.playTapPop();
                  setIsTimerPaused(!isTimerPaused);
                }}
                className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-600"
              >
                {isTimerPaused ? 'Resume ▶' : 'Pause ⏸'}
              </button>
            </div>

            {/* Right: Flag Question & Submit Button */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleToggleFlag(currentQuestionIndex)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                  flaggedQuestions[currentQuestionIndex]
                    ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <span>{flaggedQuestions[currentQuestionIndex] ? '🚩 Flagged' : '🏳️ Flag'}</span>
              </button>

              <GlassButton
                variant="primary"
                size="sm"
                onClick={handleSubmitExam}
                className="!px-4 font-bold"
              >
                Submit Exam 📝
              </GlassButton>
            </div>
          </div>

          {/* Question Palette Matrix */}
          <div className="p-3 rounded-2xl glass-card bg-white/80 border border-slate-200/60">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Question Matrix Palette
              </span>
              <div className="flex items-center gap-3 text-[10px] text-slate-500">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-600" /> Answered
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Flagged
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Unanswered
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {examQuestions.map((q, idx) => {
                const isCurrent = currentQuestionIndex === idx;
                const isAnswered = selectedAnswers[idx] !== undefined;
                const isFlagged = flaggedQuestions[idx];

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playTapPop();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`relative min-w-[38px] h-9 rounded-xl text-xs font-bold transition-all spring-touch flex items-center justify-center ${
                      isCurrent
                        ? 'ring-2 ring-violet-500 bg-white text-violet-700 font-extrabold shadow-sm scale-105 z-10'
                        : isAnswered
                        ? 'bg-violet-600 text-white shadow-xs'
                        : 'bg-white/90 text-slate-700 border border-slate-200/80 hover:bg-white'
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isFlagged && (
                      <span className="absolute -top-1 -right-1 text-[10px]">🚩</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Question Display Card */}
          <GlassCard elevation="md" className="p-6 bg-white/95 border border-white/90">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base font-black text-slate-900">
                  Question {currentQuestionIndex + 1}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                  {TOPICS[currentQ.topic]?.name}
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  {currentQ.cognitiveLevel}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  [{currentQ.marks} Marks]
                </span>
                {currentQ.formulaRefId && onOpenFormulaSheet && (
                  <button
                    type="button"
                    onClick={() => onOpenFormulaSheet(currentQ.formulaRefId)}
                    className="text-xs text-violet-600 font-bold hover:underline"
                  >
                    View Formula (Fx)
                  </button>
                )}
              </div>
            </div>

            {/* LaTeX Question Statement */}
            <div
              className="py-3 text-slate-900 text-sm sm:text-base leading-relaxed overflow-x-auto font-mono"
              dangerouslySetInnerHTML={{ __html: renderMath(currentQ.questionLatex, true) }}
            />

            {/* Dynamic Diagram if present */}
            {currentQ.svgDiagramType && (
              <div className="my-4 max-w-xl mx-auto">
                {currentQ.svgDiagramType === 'parabola' || currentQ.svgDiagramType === 'hyperbola' ? (
                  <FunctionPlot
                    type={currentQ.svgDiagramType === 'hyperbola' ? 'hyperbola' : 'parabola'}
                    params={currentQ.svgDiagramParams}
                  />
                ) : currentQ.svgDiagramType === 'circle_tangent' ? (
                  <AnalyticalGeometryPlot
                    type="circle_tangent"
                    params={currentQ.svgDiagramParams}
                  />
                ) : currentQ.svgDiagramType === 'trig' ? (
                  <TrigDiagram
                    type="cast_circle"
                    params={currentQ.svgDiagramParams}
                  />
                ) : currentQ.svgDiagramType === 'statistics' ? (
                  <StatsDiagram
                    type="box_plot"
                    params={currentQ.svgDiagramParams}
                  />
                ) : (
                  <EuclideanGeometryDiagram
                    type="angle_at_centre"
                    params={currentQ.svgDiagramParams}
                  />
                )}
              </div>
            )}

            {/* Distractor Choices */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Select Candidate Answer:
              </span>
              {currentQ.distractors.map((dist) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === dist.id;
                return (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => handleSelectAnswer(dist.id)}
                    className={`w-full p-4 rounded-2xl border text-left transition-all spring-touch flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-violet-50/90 border-violet-500 ring-2 ring-violet-300 shadow-sm'
                        : 'bg-white hover:bg-slate-50 border-slate-200/80 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center gap-3 overflow-x-auto flex-1">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center ${
                            isSelected
                              ? 'bg-violet-600 text-white'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {dist.id.replace('opt-', '').toUpperCase()}
                        </span>
                        <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">
                          {currentQ.distractors.indexOf(dist) + 1}
                        </kbd>
                      </div>
                      <div
                        className="text-xs sm:text-sm text-slate-900 font-mono"
                        dangerouslySetInnerHTML={{ __html: renderMath(dist.latex, false) }}
                      />
                    </div>

                    <div className="shrink-0">
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'border-violet-600 bg-violet-600 text-white text-xs'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && '✓'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 pt-4 border-t border-slate-200/60 flex items-center justify-between">
              <GlassButton
                variant="subtle"
                size="md"
                onClick={() => {
                  soundEngine.playTapPop();
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                }}
                disabled={currentQuestionIndex === 0}
              >
                ← Previous
              </GlassButton>

              <div className="text-xs text-slate-500 font-medium">
                {currentQuestionIndex + 1} of {examQuestions.length}
              </div>

              {currentQuestionIndex < examQuestions.length - 1 ? (
                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={() => {
                    soundEngine.playTapPop();
                    setCurrentQuestionIndex((prev) => Math.min(examQuestions.length - 1, prev + 1));
                  }}
                >
                  Next →
                </GlassButton>
              ) : (
                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={handleSubmitExam}
                  className="!px-6 font-bold"
                >
                  Review & Submit Exam 🏁
                </GlassButton>
              )}
            </div>
          </GlassCard>
        </div>
      )}

      {/* Exam Submitted / Score Report & Ticked Memo Review Mode */}
      {isExamSubmitted && (
        <div className="space-y-6">
          {/* Hero Score Breakdown Card */}
          <div className="p-6 sm:p-8 rounded-3xl glass-card-elevated iridescent-border bg-white/95 shadow-xl text-center">
            <span className="text-4xl block mb-2">🎓📜</span>
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-violet-100 text-violet-800">
              Official Mock Examination Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
              Score: {examResults.earnedMarks} / {examResults.totalExamMarks} ({examResults.percentage.toFixed(1)}%)
            </h2>
            <div className="flex items-center justify-center gap-2 mt-2">
              <span className="text-sm font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {examResults.distinctionBadge}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {examResults.distinctionTitle}
              </span>
            </div>

            {/* Cognitive & Topic Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6 text-left">
              {(['L1', 'L2', 'L3', 'L4'] as const).map((level) => {
                const cs = examResults.cognitiveScores[level];
                const pct = cs.total > 0 ? (cs.earned / cs.total) * 100 : 0;
                return (
                  <div key={level} className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      {level === 'L1' ? 'Level 1: Knowledge' : level === 'L2' ? 'Level 2: Routine' : level === 'L3' ? 'Level 3: Complex' : 'Level 4: Problem Solving'}
                    </span>
                    <span className="text-base font-black text-slate-900">
                      {cs.earned} / {cs.total}m
                    </span>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                      <div className="bg-violet-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-200/60 flex-wrap">
              <GlassButton
                variant="primary"
                size="md"
                onClick={() => handleStartExam(selectedPaper, selectedArchetypeId)}
                className="!px-6 font-bold"
              >
                Retake Exam 🔁
              </GlassButton>
              <GlassButton
                variant="subtle"
                size="md"
                onClick={() => {
                  soundEngine.playTapPop();
                  setIsExamSubmitted(false);
                  setIsExamActive(false);
                }}
                className="!px-6 font-bold"
              >
                Choose Another Archetype 📚
              </GlassButton>
            </div>
          </div>

          {/* Step-by-Step Ticked Memo Review Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">
                  Step-by-Step NSC Memo Review ({examQuestions.length} Questions)
                </h3>
                <p className="text-xs text-slate-500">
                  Compare candidate answers with official DBE tick marks (✓) and Zante Vibe Checks.
                </p>
              </div>

              {/* Review Filter */}
              <div className="flex items-center p-1 rounded-xl bg-slate-200/70 border border-white/80">
                {(['all', 'incorrect', 'flagged'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => {
                      soundEngine.playTapPop();
                      setReviewFilter(mode);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition-all ${
                      reviewFilter === mode ? 'bg-white text-violet-700 shadow-sm' : 'text-slate-600'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions Memo List */}
            <div className="space-y-4">
              {examQuestions.map((q, idx) => {
                const userChoiceId = selectedAnswers[idx];
                const isCorrect = userChoiceId === q.correctAnswerId;
                const isFlagged = flaggedQuestions[idx];

                if (reviewFilter === 'incorrect' && isCorrect) return null;
                if (reviewFilter === 'flagged' && !isFlagged) return null;

                return (
                  <GlassCard key={q.id} elevation="sm" className="p-5 bg-white/95 border border-slate-200/80">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-3 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">Question {idx + 1}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {TOPICS[q.topic]?.name}
                        </span>
                        <span
                          className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                            isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {isCorrect ? `✓ FULL MARKS (${q.marks}/${q.marks})` : `✗ INCORRECT (0/${q.marks})`}
                        </span>
                        {isFlagged && <span className="text-xs">🚩 Flagged</span>}
                      </div>

                      <span className="text-xs font-extrabold text-slate-500">[{q.marks}m • {q.cognitiveLevel}]</span>
                    </div>

                    {/* Question Statement */}
                    <div
                      className="py-2 text-slate-900 text-sm overflow-x-auto font-mono"
                      dangerouslySetInnerHTML={{ __html: renderMath(q.questionLatex, true) }}
                    />

                    {/* Candidate Choice vs Correct Choice */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-3 text-xs">
                      <div className={`p-2.5 rounded-xl border ${isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/70 border-rose-200 text-rose-900'}`}>
                        <span className="font-bold block mb-1">Your Selected Option:</span>
                        {userChoiceId ? (
                          <div dangerouslySetInnerHTML={{ __html: renderMath(q.distractors.find((d) => d.id === userChoiceId)?.latex || '', false) }} />
                        ) : (
                          <span className="italic text-slate-400">Not Attempted</span>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                        <span className="font-bold block mb-1">Correct Memorandum Option:</span>
                        <div dangerouslySetInnerHTML={{ __html: renderMath(q.distractors.find((d) => d.isCorrect)?.latex || '', false) }} />
                      </div>
                    </div>

                    {/* Zante Vibe Check */}
                    {q.zanteVibeCheck && (
                      <div className="p-3 my-2 rounded-xl bg-pink-50/80 border border-pink-200/80 text-xs text-pink-900 leading-relaxed">
                        <span className="font-bold mr-1">💅 Zante Vibe Check:</span>
                        {q.zanteVibeCheck}
                      </div>
                    )}

                    {/* Full DBE Tick Memo */}
                    <div className="mt-3 pt-2 border-t border-slate-100 space-y-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase block">
                        Official NSC Marking Steps:
                      </span>
                      {q.nscMemo.steps.map((step, sIdx) => (
                        <div
                          key={sIdx}
                          className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-xs"
                        >
                          <div
                            className="font-mono text-slate-800 overflow-x-auto"
                            dangerouslySetInnerHTML={{ __html: renderMath(step.stepLatex, false) }}
                          />
                          <span
                            className="font-bold text-emerald-700 ml-2 shrink-0"
                            dangerouslySetInnerHTML={{ __html: renderMath(step.tickAllocation) }}
                          />
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamSimulator;
