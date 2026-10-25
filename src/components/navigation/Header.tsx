import React, { useState, useEffect, useRef } from 'react';
import type { DifficultyMode } from '../../types/gamification.ts';
import type { AudioMode } from '../../types/audio.ts';
import type { ShieldStatus } from '../../state/studioState.ts';
import { getStreakTier, CrownTapDetector } from '../../state/studioState.ts';
import { soundEngine } from '../../sound/audioEngine.ts';
import GlassButton from '../ui/GlassButton.tsx';
import GlassPill from '../ui/GlassPill.tsx';

export interface HeaderProps {
  difficultyMode: DifficultyMode;
  onDifficultyChange: (mode: DifficultyMode) => void;
  streakCount: number;
  shieldStatus: ShieldStatus;
  shieldRecoveryCount?: number;
  onOpenVipVault: () => void;
  onToggleFormulaSheet: () => void;
  onToggleScratchpad: () => void;
  isScratchpadActive?: boolean;
  isFormulaDrawerOpen?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  difficultyMode,
  onDifficultyChange,
  streakCount,
  shieldStatus,
  shieldRecoveryCount = 0,
  onOpenVipVault,
  onToggleFormulaSheet,
  onToggleScratchpad,
  isScratchpadActive = false,
  isFormulaDrawerOpen = false,
}) => {
  const [detector] = useState(() => new CrownTapDetector());
  const [tapSparkle, setTapSparkle] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(!soundEngine.isMuted());
  const [audioMode, setAudioMode] = useState<AudioMode>(() => soundEngine.getAudioMode());
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => soundEngine.isVoiceEnabled());
  const [activeSoundName, setActiveSoundName] = useState<string | null>(null);
  const [soundFlashing, setSoundFlashing] = useState<boolean>(false);
  const soundFlashTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (soundEngine.onSoundTriggered) {
      const unsubscribe = soundEngine.onSoundTriggered((soundName: string) => {
        setActiveSoundName(soundName);
        setSoundFlashing(true);
        if (soundFlashTimerRef.current) clearTimeout(soundFlashTimerRef.current);
        soundFlashTimerRef.current = setTimeout(() => {
          setSoundFlashing(false);
          setActiveSoundName(null);
        }, 900);
      });
      return unsubscribe;
    }
  }, []);

  const tierInfo = getStreakTier(streakCount);

  // Crown 5-tap easter egg handler
  const handleCrownTap = () => {
    soundEngine.playTapPop();
    setTapSparkle(true);
    setTimeout(() => setTapSparkle(false), 300);

    const unlocked = detector.tap(Date.now());
    if (unlocked) {
      soundEngine.playConfettiBlast();
      onOpenVipVault();
      detector.reset();
    }
  };

  const handleAudioToggle = () => {
    const nextState = soundEngine.toggleMute();
    setAudioEnabled(nextState);
  };

  const handleAudioModeToggle = () => {
    const next = soundEngine.toggleAudioMode();
    setAudioMode(next);
  };

  const handleVoiceToggle = () => {
    const next = soundEngine.toggleVoice();
    setVoiceEnabled(next);
  };

  const handleDifficultyToggle = (targetMode?: DifficultyMode) => {
    const nextMode = targetMode ?? (difficultyMode === 'zante' ? 'andre' : 'zante');
    if (nextMode === difficultyMode) return;

    if (nextMode === 'zante' && difficultyMode === 'andre') {
      if (soundEngine.getAudioMode() === 'meme') {
        soundEngine.playVineBoom();
        soundEngine.speakReaction("Running back to Zante mode? Don't worry, your secret is safe.");
      } else {
        soundEngine.playTapPop();
      }
    } else {
      soundEngine.playTapPop();
    }
    onDifficultyChange(nextMode);
  };

  return (
    <header className="sticky top-0 z-30 w-full backdrop-blur-2xl bg-white/70 border-b border-white/80 shadow-sm shadow-slate-900/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Crown Tap Target */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={handleCrownTap}
            title="Zante's Crown (Tap 5x for VIP Hype Vault)"
            className={`p-2 rounded-2xl glass-card flex items-center justify-center spring-touch transition-transform ${
              tapSparkle ? 'scale-125 rotate-12 ring-2 ring-pink-400' : 'hover:scale-105'
            }`}
          >
            <span className="text-xl sm:text-2xl select-none" role="img" aria-label="Crown">
              👑
            </span>
          </button>

          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Zante's Matric Maths Studio — Paper 2 Edition
              </h1>
              <span className="hidden sm:inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-100/80 text-pink-700 border border-pink-200">
                150 Marks
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block">
              South African DBE CAPS Grade 12 Pure Mathematics • Paper 2 Special Edition
            </p>
          </div>
        </div>

        {/* Center / Right: Difficulty Mode Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <div className="flex items-center p-1 rounded-2xl bg-slate-200/60 backdrop-blur-md border border-white/80 shadow-inner">
            <button
              type="button"
              onClick={() => handleDifficultyToggle('zante')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                difficultyMode === 'zante'
                  ? 'bg-white text-pink-600 shadow-sm border border-white/90 scale-100'
                  : 'text-slate-600 hover:text-slate-900 scale-95 opacity-80'
              }`}
            >
              <span>💅</span>
              <span>Zante</span>
            </button>
            <button
              type="button"
              onClick={() => handleDifficultyToggle('andre')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                difficultyMode === 'andre'
                  ? 'bg-white text-violet-700 shadow-sm border border-white/90 scale-100'
                  : 'text-slate-600 hover:text-slate-900 scale-95 opacity-80'
              }`}
            >
              <span>📐</span>
              <span>Andre</span>
            </button>
          </div>

          {/* Streak Heat Badge */}
          <GlassPill
            className="!px-2.5 !py-1 text-xs sm:text-sm"
            title={`${tierInfo.name} (${streakCount} streak)`}
          >
            <span className="animate-pulse">🔥</span>
            <span className="font-bold">{streakCount}</span>
          </GlassPill>

          {/* Pretty Privilege Shield Badge */}
          <div
            className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border transition-all ${
              shieldStatus === 'CHARGED'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : shieldStatus === 'ARMED'
                ? 'bg-amber-50 text-amber-700 border-amber-300 ring-2 ring-amber-300/40 animate-pulse'
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
            title={`Pretty Privilege Shield: ${shieldStatus}${
              shieldStatus === 'SHATTERED' ? ` (${shieldRecoveryCount}/5 to recharge)` : ''
            }`}
          >
            <span>{shieldStatus === 'SHATTERED' ? '💔' : '🛡️'}</span>
            <span className="hidden lg:inline">{shieldStatus}</span>
            {shieldStatus === 'SHATTERED' && (
              <span className="text-[10px] bg-slate-200 px-1 rounded-full font-bold">
                {shieldRecoveryCount}/5
              </span>
            )}
          </div>

          {/* Audio Mode Switcher: Classy Glass vs Unhinged Meme */}
          <GlassButton
            variant={audioMode === 'meme' ? 'primary' : 'subtle'}
            size="sm"
            onClick={handleAudioModeToggle}
            title={
              audioMode === 'meme'
                ? 'Mode: Unhinged Meme Audio 💀 (Click for Classy Glass 🥂)'
                : 'Mode: Classy Glass Audio 🥂 (Click for Meme 💀)'
            }
            className="!px-2.5 !py-1.5 !min-h-[36px] text-xs font-bold"
          >
            <span>{audioMode === 'meme' ? '💀 Meme' : '🥂 Glass'}</span>
          </GlassButton>

          {/* Sassy Voice Reactions Toggle */}
          <GlassButton
            variant={voiceEnabled ? 'primary' : 'subtle'}
            size="sm"
            onClick={handleVoiceToggle}
            title={
              voiceEnabled
                ? 'Sassy Verbal Reactions ON (Click to Mute Voice)'
                : 'Sassy Verbal Reactions OFF (Click to Enable)'
            }
            className="!px-2.5 !py-1.5 !min-h-[36px] text-xs"
          >
            <span>{voiceEnabled ? '🗣️' : '🤫'}</span>
          </GlassButton>

          {/* Power Tool Buttons */}
          <div className="flex items-center gap-1">
            <GlassButton
              variant={isFormulaDrawerOpen ? 'primary' : 'subtle'}
              size="sm"
              onClick={onToggleFormulaSheet}
              title="Official NSC Formula Sheet (Key: F)"
              className="!px-2.5 !py-1.5 !min-h-[36px]"
            >
              <span className="font-bold text-xs">Fx</span>
            </GlassButton>

            <GlassButton
              variant={isScratchpadActive ? 'primary' : 'subtle'}
              size="sm"
              onClick={onToggleScratchpad}
              title="Glass Scratchpad Canvas"
              className="!px-2.5 !py-1.5 !min-h-[36px]"
            >
              <span>✏️</span>
            </GlassButton>

            <div className="relative flex items-center">
              <GlassButton
                variant={soundFlashing ? 'primary' : 'subtle'}
                size="sm"
                onClick={handleAudioToggle}
                title={
                  audioEnabled
                    ? `Master Sound Effects Enabled ${activeSoundName ? `(Playing: ${activeSoundName})` : ''}`
                    : `Master Sound Effects Muted ${activeSoundName ? `(Triggered: ${activeSoundName})` : ''}`
                }
                className={`!px-2.5 !py-1.5 !min-h-[36px] transition-all relative ${
                  soundFlashing
                    ? 'ring-2 ring-pink-500 scale-110 shadow-lg shadow-pink-500/40 bg-pink-100 text-pink-700'
                    : ''
                }`}
              >
                <span className="flex items-center gap-1">
                  <span>{audioEnabled ? '🔊' : '🔇'}</span>
                  {soundFlashing && (
                    <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-ping shrink-0" />
                  )}
                </span>
              </GlassButton>

              {/* Unmistakable visual speaker indicator flash badge */}
              {soundFlashing && activeSoundName && (
                <div
                  role="status"
                  aria-live="polite"
                  className="absolute -bottom-7 right-0 z-50 whitespace-nowrap px-2 py-0.5 rounded-full bg-slate-900/95 text-white text-[10px] font-bold shadow-lg border border-pink-400/60 flex items-center gap-1 pointer-events-none animate-bounce"
                >
                  <span className="text-pink-300">♪</span>
                  <span>{activeSoundName}</span>
                  {!audioEnabled && <span className="text-amber-300 text-[9px]">(muted)</span>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
