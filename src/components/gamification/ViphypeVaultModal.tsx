import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ANDRE_VIP_DISCLAIMER } from '../../state/studioState.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassButton from '../ui/GlassButton.tsx';

export interface ViphypeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export const ViphypeVaultModal: React.FC<ViphypeVaultModalProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  useEffect(() => {
    if (isOpen) {
      soundEngine.playConfettiBlast();
      soundEngine.playGlassChime();
      try {
        confetti({
          particleCount: 120,
          spread: 90,
          origin: { y: 0.5 },
          colors: ['#FF85B3', '#C084FC', '#38BDF8', '#FDBA74', '#6EE7B7'],
        });
      } catch {
        // Ignore
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const sections = [
    ANDRE_VIP_DISCLAIMER.section1,
    ANDRE_VIP_DISCLAIMER.section2,
    ANDRE_VIP_DISCLAIMER.section3,
    ANDRE_VIP_DISCLAIMER.section4,
  ];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-md animate-fade-in ${className}`}>
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl glass-card-elevated iridescent-border p-6 sm:p-8 bg-white/95 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="text-center pb-4 border-b border-slate-200/80">
          <span className="text-4xl block mb-2 animate-bounce">👑✨</span>
          <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 text-purple-800 border border-purple-200">
            5x Crown Tap Secret Unlocked
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 tracking-tight">
            The VIP Hype Vault
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Andre's Official 4-Point Matric Pure Maths Disclaimer & Encouragement
          </p>
        </div>

        {/* Perks Banner */}
        <div className="my-4 p-3 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-cyan-50 border border-emerald-200 text-xs text-emerald-800 font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛡️✨</span>
            <span>Pretty Privilege Shield Refilled to 100% CHARGED</span>
          </div>
          <span className="text-[10px] bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
            PERK UNLOCKED
          </span>
        </div>

        {/* Verbatim 4-Point Disclaimer Content */}
        <div className="space-y-4 my-2">
          {sections.map((sec, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white/80 border border-slate-200/80 shadow-sm"
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs font-bold w-5 h-5 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center">
                  {idx + 1}
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  {sec.title}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed pl-7">
                {sec.content}
              </p>
            </div>
          ))}
        </div>

        {/* Footer Guarantee */}
        <div className="mt-4 pt-4 border-t border-slate-200/80 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400 font-medium">
            Certified NWU / CAPS Distinction Engine
          </span>

          <GlassButton
            variant="primary"
            size="md"
            onClick={() => {
              soundEngine.playTapPop();
              onClose();
            }}
            className="!px-6 font-bold"
          >
            Claim Distinction 🎓
          </GlassButton>
        </div>

        {/* Top-right close button */}
        <button
          type="button"
          onClick={() => {
            soundEngine.playTapPop();
            onClose();
          }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 font-bold text-base p-1.5 rounded-full"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ViphypeVaultModal;
