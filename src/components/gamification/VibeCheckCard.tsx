import React, { useState } from 'react';
import GlassCard from '../ui/GlassCard.tsx';
import { soundEngine } from '../../sound/audioEngine.ts';

export interface VibeCheckCardProps {
  vibeCheck: string;
  className?: string;
  defaultExpanded?: boolean;
}

export const VibeCheckCard: React.FC<VibeCheckCardProps> = ({
  vibeCheck,
  className = '',
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!vibeCheck) return null;

  const handleSpeakVibeCheck = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isSpeaking) {
      soundEngine.cancelSpeech();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      soundEngine.speakReaction(vibeCheck);
      const wordCount = vibeCheck.split(/\s+/).length;
      setTimeout(() => setIsSpeaking(false), Math.max(3000, wordCount * 380));
    }
  };

  return (
    <GlassCard
      elevation="sm"
      className={`p-4 rounded-2xl bg-gradient-to-br from-pink-50/90 via-purple-50/70 to-white/80 border border-pink-200/80 shadow-sm ${className}`}
    >
      <div
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-700">
              Layer 1 • Zante Vibe Check
            </h4>
            <span className="text-[11px] text-slate-500">
              Intuitive 2026 breakdown • Zero textbook fluff
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={handleSpeakVibeCheck}
            title={isSpeaking ? 'Stop voice reading' : 'Read Vibe Check aloud'}
            className={`text-xs font-bold px-2.5 py-1 rounded-full border transition-all flex items-center gap-1 ${
              isSpeaking
                ? 'bg-pink-600 text-white border-pink-700 animate-pulse'
                : 'bg-white/90 text-pink-700 border-pink-200 hover:bg-white'
            }`}
          >
            <span>{isSpeaking ? '⏹️' : '🔊'}</span>
            <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/80 text-pink-700 border border-pink-200 hover:bg-white transition-all"
          >
            {expanded ? 'Hide' : 'Expand'}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-pink-200/60 text-slate-800 text-sm leading-relaxed font-medium animate-fade-in">
          {vibeCheck}
        </div>
      )}
    </GlassCard>
  );
};

export default VibeCheckCard;
