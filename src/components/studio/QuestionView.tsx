import React, { useState, useEffect, useMemo } from 'react';
import katex from 'katex';
import confetti from 'canvas-confetti';
import type { DifficultyMode, ZanteQuestion, ZanteCategory } from '../../types/gamification.ts';
import type { PaperId, TopicId, CognitiveLevel, Question } from '../../types/curriculum.ts';
import type { ShieldStatus } from '../../state/studioState.ts';
import { ZANTE_QUESTIONS } from '../../data/zanteQuestions.ts';
import { generateZanteQuestion } from '../../generators/zanteGenerator.ts';
import { PAST_PAPER_QUESTIONS } from '../../data/pastPaperQuestions.ts';
import { generateP1Question } from '../../generators/p1Generators.ts';
import { generateP2Question } from '../../generators/p2Generators.ts';
import { TOPICS } from '../../data/topics.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassCard from '../ui/GlassCard.tsx';
import GlassButton from '../ui/GlassButton.tsx';
import GlassPill from '../ui/GlassPill.tsx';

// Gamification Cards & Modals
import VibeCheckCard from '../gamification/VibeCheckCard.tsx';
import NscMemoCard from '../gamification/NscMemoCard.tsx';
import QuoteCardModal from '../gamification/QuoteCardModal.tsx';

// Dynamic Diagrams
import FunctionPlot from '../diagrams/FunctionPlot.tsx';
import AnalyticalGeometryPlot from '../diagrams/AnalyticalGeometryPlot.tsx';
import TrigDiagram from '../diagrams/TrigDiagram.tsx';
import StatsDiagram from '../diagrams/StatsDiagram.tsx';
import EuclideanGeometryDiagram from '../diagrams/EuclideanGeometryDiagram.tsx';

export interface QuestionViewProps {
  difficultyMode: DifficultyMode;
  activePaper: PaperId;
  activeTopic?: TopicId;
  streakCount: number;
  highestStreak: number;
  shieldStatus: ShieldStatus;
  shieldRecoveryCount?: number;
  onAnswerResult: (isCorrect: boolean, isLevel4: boolean) => void;
  onOpenFormulaSheet?: (formulaId?: string) => void;
  onToggleScratchpad?: () => void;
  className?: string;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  difficultyMode,
  activePaper,
  activeTopic,
  streakCount,
  highestStreak,
  shieldStatus,
  shieldRecoveryCount = 0,
  onAnswerResult,
  onOpenFormulaSheet,
  onToggleScratchpad,
  className = '',
}) => {
  // ---------------------------------------------------------------------------
  // Zante Mode State
  // ---------------------------------------------------------------------------
  const [zanteIndex, setZanteIndex] = useState<number>(0);
  const [currentZanteQ, setCurrentZanteQ] = useState<ZanteQuestion>(() => ZANTE_QUESTIONS[0]);
  const [zanteSelectedOption, setZanteSelectedOption] = useState<number | null>(null);
  const [zanteAnswered, setZanteAnswered] = useState<boolean>(false);
  const [zanteToast, setZanteToast] = useState<string | null>(null);
  const [quoteModalOpen, setQuoteModalOpen] = useState<boolean>(false);

  // ---------------------------------------------------------------------------
  // Andre Mode State
  // ---------------------------------------------------------------------------
  const [andreQuestion, setAndreQuestion] = useState<Question>(() => {
    const topicFiltered = PAST_PAPER_QUESTIONS.filter(
      (q) => q.paper === activePaper && (!activeTopic || q.topic === activeTopic)
    );
    return topicFiltered[0] || PAST_PAPER_QUESTIONS[0];
  });
  const [selectedDistractorId, setSelectedDistractorId] = useState<string | null>(null);
  const [andreAnswered, setAndreAnswered] = useState<boolean>(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  // Safe KaTeX math renderer
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

  // Re-sync Andre question when activePaper or activeTopic changes
  useEffect(() => {
    if (difficultyMode === 'andre') {
      const available = PAST_PAPER_QUESTIONS.filter(
        (q) => q.paper === activePaper && (!activeTopic || q.topic === activeTopic)
      );
      if (available.length > 0) {
        setAndreQuestion(available[Math.floor(Math.random() * available.length)]);
      } else {
        const generated =
          activePaper === 'P1'
            ? generateP1Question(activeTopic)
            : generateP2Question(activeTopic);
        setAndreQuestion(generated);
      }
      setSelectedDistractorId(null);
      setAndreAnswered(false);
      setIsAnswerCorrect(null);
    }
  }, [activePaper, activeTopic, difficultyMode]);

  // ---------------------------------------------------------------------------
  // Zante Mode Handlers
  // ---------------------------------------------------------------------------
  const handleZanteOptionClick = (idx: number) => {
    if (zanteAnswered) return;
    soundEngine.playTapPop();
    setZanteSelectedOption(idx);
    setZanteAnswered(true);

    const isCorrect = idx === currentZanteQ.correctIndex;
    if (isCorrect) {
      soundEngine.playGlassChime();
      soundEngine.playConfettiBlast();
      if (soundEngine.getAudioMode() === 'meme') {
        soundEngine.playBaddieShimmer();
        soundEngine.playCameraShutter();
        const sassyPraises = [
          'Wait, Einstein is shaking right now.',
          'Smart AND pretty, pick a struggle honestly.',
          'Academic weapon unlocked.',
          "Don't let Harvard see this, they'll offer you a full ride.",
        ];
        const pick = sassyPraises[Math.floor(Math.random() * sassyPraises.length)];
        soundEngine.speakReaction(pick);
      }
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ['#FF85B3', '#C084FC', '#38BDF8', '#FDBA74', '#6EE7B7'],
        });
      } catch {
        // Ignore in testing
      }
      setZanteToast(currentZanteQ.wittyToast);
      onAnswerResult(true, false);
    } else {
      soundEngine.playErrorChime();
      if (soundEngine.getAudioMode() === 'meme') {
        soundEngine.playSadTrombone();
        soundEngine.playBruhThud();
        const sassyRoasts = [
          "Girl... ain't no way you just clicked that.",
          "Ain't no way... we're blaming the screen glare on that one.",
          'Wait, did your thumb slip? Try that again gorgeous.',
        ];
        const pick = sassyRoasts[Math.floor(Math.random() * sassyRoasts.length)];
        soundEngine.speakReaction(pick);
      }
      setZanteToast("Even in Zante mode? Bestie, let's pretend that was a misclick 💅");
      onAnswerResult(false, false);
    }
  };

  const handleNextZanteQuestion = () => {
    soundEngine.playTapPop();
    const nextIdx = (zanteIndex + 1) % ZANTE_QUESTIONS.length;
    setZanteIndex(nextIdx);
    if (nextIdx === 0 && Math.random() > 0.5) {
      setCurrentZanteQ(generateZanteQuestion());
    } else {
      setCurrentZanteQ(ZANTE_QUESTIONS[nextIdx]);
    }
    setZanteSelectedOption(null);
    setZanteAnswered(false);
    setZanteToast(null);
  };

  // ---------------------------------------------------------------------------
  // Andre Mode Handlers
  // ---------------------------------------------------------------------------
  const handleSelectAndreDistractor = (id: string) => {
    if (andreAnswered) return;
    soundEngine.playTapPop();
    setSelectedDistractorId(id);
  };

  const handleSubmitAndreAnswer = () => {
    if (!selectedDistractorId || andreAnswered) return;

    const isL4 = andreQuestion.cognitiveLevel === 'L4';
    const chosenDist = andreQuestion.distractors.find((d) => d.id === selectedDistractorId);
    const correct = chosenDist?.isCorrect ?? false;

    setAndreAnswered(true);
    setIsAnswerCorrect(correct);

    if (correct) {
      soundEngine.playGlassChime();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#38BDF8', '#818CF8', '#C084FC'],
        });
      } catch {
        // Ignore
      }
      onAnswerResult(true, isL4);
    } else {
      if (isL4 && shieldStatus !== 'SHATTERED') {
        soundEngine.playShieldShatter();
      } else {
        soundEngine.playErrorChime();
      }
      onAnswerResult(false, isL4);
    }
  };

  const handleNextAndreQuestion = () => {
    soundEngine.playTapPop();
    const available = PAST_PAPER_QUESTIONS.filter(
      (q) =>
        q.paper === activePaper &&
        (!activeTopic || q.topic === activeTopic) &&
        q.id !== andreQuestion.id
    );
    if (available.length > 0 && Math.random() > 0.3) {
      setAndreQuestion(available[Math.floor(Math.random() * available.length)]);
    } else {
      const generated =
        activePaper === 'P1'
          ? generateP1Question(activeTopic)
          : generateP2Question(activeTopic);
      setAndreQuestion(generated);
    }
    setSelectedDistractorId(null);
    setAndreAnswered(false);
    setIsAnswerCorrect(null);
  };

  const handleGenerateVariation = () => {
    soundEngine.playTapPop();
    const generated =
      activePaper === 'P1'
        ? generateP1Question(andreQuestion.topic, andreQuestion.cognitiveLevel)
        : generateP2Question(andreQuestion.topic, andreQuestion.cognitiveLevel);
    setAndreQuestion(generated);
    setSelectedDistractorId(null);
    setAndreAnswered(false);
    setIsAnswerCorrect(null);
  };

  // ---------------------------------------------------------------------------
  // Desktop Speedrun Keyboard Shortcuts Listener
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is focused inside an input, textarea, or editable element
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // If quote modal is open, let the modal handle escape
      if (quoteModalOpen) return;

      const key = e.key;

      // 1. ZANTE DIFFICULTY SHORTCUTS
      if (difficultyMode === 'zante') {
        if (!zanteAnswered) {
          let selectedIdx: number | null = null;
          if (key === '1' || key === 'a' || key === 'A') selectedIdx = 0;
          else if (key === '2' || key === 'b' || key === 'B') selectedIdx = 1;
          else if (key === '3' || key === 'c' || key === 'C') selectedIdx = 2;
          else if (key === '4' || key === 'd' || key === 'D') selectedIdx = 3;

          if (selectedIdx !== null && selectedIdx < currentZanteQ.options.length) {
            e.preventDefault();
            handleZanteOptionClick(selectedIdx);
          }
        } else {
          // Already answered: Enter or Space advances immediately to next question
          if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            handleNextZanteQuestion();
          }
        }
      }

      // 2. ANDRE DIFFICULTY SHORTCUTS
      if (difficultyMode === 'andre') {
        if (!andreAnswered) {
          let selectedIdx: number | null = null;
          if (key === '1' || key === 'a' || key === 'A') selectedIdx = 0;
          else if (key === '2' || key === 'b' || key === 'B') selectedIdx = 1;
          else if (key === '3' || key === 'c' || key === 'C') selectedIdx = 2;
          else if (key === '4' || key === 'd' || key === 'D') selectedIdx = 3;

          if (selectedIdx !== null && selectedIdx < andreQuestion.distractors.length) {
            e.preventDefault();
            handleSelectAndreDistractor(andreQuestion.distractors[selectedIdx].id);
          } else if (key === 'Enter') {
            // Enter submits the active choice
            if (selectedDistractorId) {
              e.preventDefault();
              handleSubmitAndreAnswer();
            }
          }
        } else {
          // Already answered: Enter or Space advances immediately to next question
          if (key === 'Enter' || key === ' ') {
            e.preventDefault();
            handleNextAndreQuestion();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    difficultyMode,
    zanteAnswered,
    currentZanteQ,
    zanteIndex,
    quoteModalOpen,
    andreAnswered,
    andreQuestion,
    selectedDistractorId,
  ]);

  return (
    <div className={`w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 ${className}`}>
      {/* Desktop Keyboard Speedrun Pill */}
      <div className="hidden sm:flex items-center justify-center gap-3 text-[11px] font-medium text-slate-500 py-1.5 px-4 rounded-full bg-white/80 backdrop-blur-md border border-slate-200/80 max-w-fit mx-auto shadow-xs select-none">
        <span className="font-bold text-violet-700 flex items-center gap-1">⚡ Speedrun Keys:</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">1-4</kbd> or <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">A-D</kbd> Select
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">Enter ↵</kbd> Submit
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">Space</kbd> / <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">Enter</kbd> Next
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">F</kbd> Formula
        </span>
        <span>•</span>
        <span className="flex items-center gap-1">
          <kbd className="px-1.5 py-0.5 font-mono text-[10px] bg-slate-100 rounded border border-slate-300 text-slate-700 font-bold">S</kbd> Scratchpad
        </span>
      </div>
      {/* --------------------------------------------------------------------- */}
      {/* 1. ZANTE DIFFICULTY MODE (Feisty, Witty, Screenshot-Worthy)           */}
      {/* --------------------------------------------------------------------- */}
      {difficultyMode === 'zante' && (
        <div className="space-y-6">
          {/* Zante Mode Header Banner */}
          <div className="flex items-center justify-between p-4 rounded-3xl glass-card-elevated iridescent-border bg-gradient-to-r from-pink-50/90 via-purple-50/70 to-pink-50/90">
            <div className="flex items-center gap-3">
              <span className="text-3xl animate-bounce select-none">💅👑</span>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Zante Difficulty Mode
                  </h2>
                  <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
                    Zero-Stress Vibe
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Elementary arithmetic, iced coffee math, passenger princess priorities, and screenshot quotes.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <GlassPill className="!px-3 !py-1 text-xs">
                <span>🔥 Streak:</span>
                <strong className="text-pink-600 font-extrabold ml-1">{streakCount}</strong>
              </GlassPill>

              <GlassButton
                variant="subtle"
                size="sm"
                onClick={() => setQuoteModalOpen(true)}
                title="View shareable screenshot quote card"
                className="!px-3 text-xs font-bold"
              >
                <span>Share Quote 💅</span>
              </GlassButton>
            </div>
          </div>

          {/* Zante Question Card */}
          <GlassCard elevation="elevated" className="p-6 sm:p-8 bg-white/95 border border-white/90">
            <div className="flex items-center justify-between pb-3 border-b border-pink-100 mb-6">
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 uppercase tracking-wider">
                Category: {currentZanteQ.category.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-slate-400 font-bold">
                Question {zanteIndex + 1} of {ZANTE_QUESTIONS.length}
              </span>
            </div>

            {/* Prompt Statement */}
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight my-4">
              "{currentZanteQ.questionText}"
            </h3>

            {/* Options List */}
            <div className="space-y-3 my-6">
              {currentZanteQ.options.map((opt, idx) => {
                const isSelected = zanteSelectedOption === idx;
                const isCorrect = idx === currentZanteQ.correctIndex;
                let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-800';

                if (zanteAnswered) {
                  if (isSelected && isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300 shadow-md';
                  } else if (isSelected && !isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-300 text-rose-900 ring-2 ring-rose-200';
                  } else if (isCorrect) {
                    optionStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-800';
                  }
                }

                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleZanteOptionClick(idx)}
                    disabled={zanteAnswered}
                    className={`w-full p-4 rounded-2xl border text-left font-semibold text-sm sm:text-base transition-all spring-touch flex items-center justify-between gap-3 ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 text-xs font-black flex items-center justify-center">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <kbd className="hidden sm:inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200">
                          {idx + 1}
                        </kbd>
                      </div>
                      <span>{opt}</span>
                    </div>

                    {zanteAnswered && (
                      <span className="text-lg">
                        {isCorrect ? '💅✨' : isSelected ? '💀' : ''}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Toast Response */}
            {zanteToast && (
              <div className="p-4 my-4 rounded-2xl bg-gradient-to-r from-pink-50 via-purple-50 to-pink-50 border border-pink-200 text-sm font-semibold text-slate-800 flex items-start gap-2.5 animate-fade-in">
                <span className="text-xl shrink-0">💅</span>
                <p className="leading-relaxed">{zanteToast}</p>
              </div>
            )}

            {/* Next Action Buttons */}
            {zanteAnswered && (
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex items-center justify-between gap-3 flex-wrap">
                <GlassButton
                  variant="subtle"
                  size="md"
                  onClick={() => setQuoteModalOpen(true)}
                  className="!px-5 text-sm font-bold"
                >
                  📸 Screenshot Quote Card
                </GlassButton>

                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={handleNextZanteQuestion}
                  className="!px-6 text-sm font-black inline-flex items-center gap-2"
                >
                  <span>Next Question 💅⚡</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/25 text-white border border-white/30">
                    ↵ Enter
                  </kbd>
                </GlassButton>
              </div>
            )}
          </GlassCard>

          {/* Quote Card Modal */}
          <QuoteCardModal
            isOpen={quoteModalOpen}
            onClose={() => setQuoteModalOpen(false)}
            quote={currentZanteQ.screenshotQuote}
            wittyToast={currentZanteQ.wittyToast}
            category={currentZanteQ.category}
            streak={streakCount}
            onNext={handleNextZanteQuestion}
          />
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* 2. ANDRE DIFFICULTY MODE (Authentic CAPS Matric Exam Questions)       */}
      {/* --------------------------------------------------------------------- */}
      {difficultyMode === 'andre' && (
        <div className="space-y-6">
          {/* Andre Question Card */}
          <GlassCard elevation="elevated" className="p-6 sm:p-8 bg-white/95 border border-white/90">
            {/* Header: Topic, Cognitive Level, Marks, Shield status */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  andreQuestion.paper === 'P1'
                    ? 'bg-blue-100 text-blue-800 border border-blue-200'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                }`}>
                  {andreQuestion.paper} • {TOPICS[andreQuestion.topic]?.name}
                </span>

                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">
                  {andreQuestion.cognitiveLevel}
                </span>

                {andreQuestion.cognitiveLevel === 'L4' && (
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      shieldStatus === 'CHARGED' || shieldStatus === 'ARMED'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300 ring-2 ring-emerald-300/40 animate-pulse'
                        : 'bg-rose-100 text-rose-800 border-rose-300'
                    }`}
                  >
                    <span>🛡️</span>
                    <span>Streak Shield Protected</span>
                  </span>
                )}
              </div>

              {/* Marks & Tools Buttons */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  [{andreQuestion.marks} Marks]
                </span>

                {andreQuestion.formulaRefId && onOpenFormulaSheet && (
                  <GlassButton
                    variant="subtle"
                    size="sm"
                    onClick={() => onOpenFormulaSheet(andreQuestion.formulaRefId)}
                    title="Open linked formula on formula sheet"
                    className="!px-2.5 !py-1 text-xs"
                  >
                    <span>Fx Formula</span>
                  </GlassButton>
                )}

                {onToggleScratchpad && (
                  <GlassButton
                    variant="subtle"
                    size="sm"
                    onClick={onToggleScratchpad}
                    title="Open Glass Scratchpad"
                    className="!px-2.5 !py-1 text-xs"
                  >
                    <span>✏️ Draw</span>
                  </GlassButton>
                )}
              </div>
            </div>

            {/* LaTeX Question Statement */}
            <div
              className="py-4 text-slate-900 text-sm sm:text-base leading-relaxed overflow-x-auto font-mono"
              dangerouslySetInnerHTML={{ __html: renderMath(andreQuestion.questionLatex, true) }}
            />

            {/* Dynamic SVG Diagram (if specified on question) */}
            {andreQuestion.svgDiagramType && (
              <div className="my-5 max-w-xl mx-auto">
                {andreQuestion.svgDiagramType === 'parabola' || andreQuestion.svgDiagramType === 'hyperbola' ? (
                  <FunctionPlot
                    type={andreQuestion.svgDiagramType === 'hyperbola' ? 'hyperbola' : 'parabola'}
                    params={andreQuestion.svgDiagramParams}
                  />
                ) : andreQuestion.svgDiagramType === 'circle_tangent' ? (
                  <AnalyticalGeometryPlot
                    type="circle_tangent"
                    params={andreQuestion.svgDiagramParams}
                  />
                ) : andreQuestion.svgDiagramType === 'trig' ? (
                  <TrigDiagram
                    type="cast_circle"
                    params={andreQuestion.svgDiagramParams}
                  />
                ) : andreQuestion.svgDiagramType === 'statistics' ? (
                  <StatsDiagram
                    type="box_plot"
                    params={andreQuestion.svgDiagramParams}
                  />
                ) : (
                  <EuclideanGeometryDiagram
                    type="angle_at_centre"
                    params={andreQuestion.svgDiagramParams}
                  />
                )}
              </div>
            )}

            {/* Distractor Choices */}
            <div className="mt-6 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                Select Option:
              </span>

              {andreQuestion.distractors.map((dist) => {
                const isSelected = selectedDistractorId === dist.id;
                let optionStyle = 'bg-white hover:bg-slate-50 border-slate-200/90 text-slate-900';

                if (andreAnswered) {
                  if (isSelected && dist.isCorrect) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300 text-emerald-900 shadow-sm';
                  } else if (isSelected && !dist.isCorrect) {
                    optionStyle = 'bg-rose-50 border-rose-300 ring-2 ring-rose-200 text-rose-900';
                  } else if (dist.isCorrect) {
                    optionStyle = 'bg-emerald-50/70 border-emerald-300 text-emerald-800';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-violet-50/90 border-violet-500 ring-2 ring-violet-300 text-violet-950 shadow-sm';
                }

                return (
                  <button
                    key={dist.id}
                    type="button"
                    onClick={() => handleSelectAndreDistractor(dist.id)}
                    disabled={andreAnswered}
                    className={`w-full p-4 rounded-2xl border text-left transition-all spring-touch flex items-center justify-between gap-3 ${optionStyle}`}
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
                          {andreQuestion.distractors.indexOf(dist) + 1}
                        </kbd>
                      </div>
                      <div
                        className="text-xs sm:text-sm font-mono"
                        dangerouslySetInnerHTML={{ __html: renderMath(dist.latex, false) }}
                      />
                    </div>

                    <div className="shrink-0">
                      {andreAnswered ? (
                        <span className="text-sm font-bold">
                          {dist.isCorrect ? '✓' : isSelected ? '✗' : ''}
                        </span>
                      ) : (
                        <span
                          className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                            isSelected
                              ? 'border-violet-600 bg-violet-600 text-white text-xs'
                              : 'border-slate-300'
                          }`}
                        >
                          {isSelected && '✓'}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Answer Button */}
            {!andreAnswered && (
              <div className="mt-6 pt-4 border-t border-slate-200/60 flex justify-end">
                <GlassButton
                  variant="primary"
                  size="md"
                  onClick={handleSubmitAndreAnswer}
                  disabled={!selectedDistractorId}
                  className="!px-8 font-black inline-flex items-center gap-2"
                >
                  <span>Submit Answer ✓</span>
                  <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/25 text-white border border-white/30">
                    ↵ Enter
                  </kbd>
                </GlassButton>
              </div>
            )}

            {/* Answered State: Explanations & Next Actions */}
            {andreAnswered && (
              <div className="mt-8 pt-6 border-t border-slate-200/80 space-y-5 animate-fade-in">
                {/* Result Status Banner */}
                <div
                  className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                    isAnswerCorrect
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                      : 'bg-rose-50 border-rose-300 text-rose-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{isAnswerCorrect ? '🎉' : '⚠️'}</span>
                    <div>
                      <h4 className="text-sm font-black">
                        {isAnswerCorrect
                          ? `Full Marks! (+${andreQuestion.marks} Marks Earned)`
                          : `Incorrect Option Selected`}
                      </h4>
                      <p className="text-xs opacity-90">
                        {isAnswerCorrect
                          ? 'Flawless calculation. Keep building your distinction streak!'
                          : andreQuestion.cognitiveLevel === 'L4' && shieldStatus !== 'SHATTERED'
                          ? 'Pretty Privilege Shield saved your streak! 🛡️✨'
                          : 'Review the two-layer explanation below to master this concept.'}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-black px-3 py-1 rounded-full bg-white/80 shadow-xs">
                    {isAnswerCorrect ? `${andreQuestion.marks} / ${andreQuestion.marks} Marks` : `0 / ${andreQuestion.marks} Marks`}
                  </span>
                </div>

                {/* Layer 1: Zante Vibe Check */}
                <VibeCheckCard vibeCheck={andreQuestion.zanteVibeCheck} />

                {/* Layer 2: Full-Marks NSC Memo */}
                <NscMemoCard nscMemo={andreQuestion.nscMemo} />

                {/* Next Question Navigation Controls */}
                <div className="pt-4 flex items-center justify-between gap-3 flex-wrap">
                  <GlassButton
                    variant="subtle"
                    size="md"
                    onClick={handleGenerateVariation}
                    title="Generate another numerical variation of this question"
                    className="!px-5 text-xs sm:text-sm font-semibold"
                  >
                    🎲 Parametric Variation
                  </GlassButton>

                  <GlassButton
                    variant="primary"
                    size="md"
                    onClick={handleNextAndreQuestion}
                    className="!px-7 font-black text-sm shadow-md inline-flex items-center gap-2"
                  >
                    <span>Next Question →</span>
                    <kbd className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/25 text-white border border-white/30">
                      ↵ Enter
                    </kbd>
                  </GlassButton>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default QuestionView;
