import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassButton from '../ui/GlassButton.tsx';

export interface QuoteCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  quote: string;
  wittyToast?: string;
  category?: string;
  streak?: number;
  onNext?: () => void;
}

export const QuoteCardModal: React.FC<QuoteCardModalProps> = ({
  isOpen,
  onClose,
  quote,
  wittyToast,
  category = 'Zante Mode',
  streak = 0,
  onNext,
}) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      soundEngine.playConfettiBlast();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#FF85B3', '#C084FC', '#38BDF8', '#FDBA74', '#6EE7B7'],
        });
      } catch {
        // Fallback if canvas-confetti is running in test/mock environment
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    soundEngine.playTapPop();
    const shareText = `"${quote}" — Zante's Matric Maths Studio 💅✨ (Streak: ${streak})`;
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(shareText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Ignore clipboard write failure
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md rounded-3xl glass-card-elevated iridescent-border p-6 sm:p-8 bg-white/95 shadow-2xl flex flex-col items-center text-center">
        {/* Top Badges */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-200">
            💅 {category.replace(/_/g, ' ').toUpperCase()}
          </span>
          {streak > 0 && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
              🔥 Streak: {streak}
            </span>
          )}
        </div>

        {/* Screenshot Quote Container */}
        <div className="w-full my-3 p-5 rounded-2xl bg-gradient-to-br from-pink-50/80 via-purple-50/60 to-cyan-50/80 border border-pink-200/90 shadow-inner">
          <span className="text-3xl block mb-2">💅👑</span>
          <blockquote className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
            "{quote}"
          </blockquote>
          {wittyToast && (
            <p className="text-xs text-slate-500 mt-2 font-medium italic">
              {wittyToast}
            </p>
          )}
        </div>

        <p className="text-[11px] text-slate-400 mt-1 mb-5">
          Screenshot-ready • Send this to the group chat
        </p>

        {/* Actions */}
        <div className="flex items-center gap-3 w-full">
          <GlassButton
            variant="subtle"
            size="md"
            onClick={handleCopy}
            className="flex-1"
          >
            {copied ? 'Copied! 💅' : 'Copy Quote 📋'}
          </GlassButton>

          <GlassButton
            variant="primary"
            size="md"
            onClick={() => {
              soundEngine.playTapPop();
              onClose();
              onNext?.();
            }}
            className="flex-1 font-bold"
          >
            Keep Flexing ⚡
          </GlassButton>
        </div>

        {/* Close button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTapPop();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-sm p-1 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default QuoteCardModal;
