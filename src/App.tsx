import React, { useState, useEffect, useRef } from 'react';
import type { PaperId, TopicId } from './types/curriculum.ts';
import type { DifficultyMode, ZanteStudioState } from './types/gamification.ts';
import type { MainNavTab } from './components/navigation/PaperNav.tsx';
import {
  ShieldStatus,
  StreakShieldMachine,
  getStreakMilestoneToast,
  getModeSwitchRoast,
  isLateNightStudy,
  getLateNightMessage,
  switchPaper,
  switchDifficulty,
  recordQuestionResult,
} from './state/studioState.ts';
import { loadStudioState, saveStudioState } from './state/storage.ts';
import { soundEngine } from './sound/audioEngine.ts';

// UI and Navigation Components
import AuroraBackground from './components/ui/AuroraBackground.tsx';
import Header from './components/navigation/Header.tsx';
import PaperNav from './components/navigation/PaperNav.tsx';
import MobileTabBar from './components/navigation/MobileTabBar.tsx';

// Studio Views
import QuestionView from './components/studio/QuestionView.tsx';
import CheatSheetView from './components/studio/CheatSheetView.tsx';
import ExamSimulator from './components/studio/ExamSimulator.tsx';

// Power Tools & Modals
import FormulaSheetDrawer from './components/tools/FormulaSheetDrawer.tsx';
import GlassScratchpad from './components/tools/GlassScratchpad.tsx';
import ViphypeVaultModal from './components/gamification/ViphypeVaultModal.tsx';

export const App: React.FC = () => {
  // 1. Persistent Studio State - Default to Paper 2 Special Edition
  const [studioState, setStudioState] = useState<ZanteStudioState>(() => {
    const loaded = loadStudioState();
    if (!loaded || loaded.activePaper !== 'P2') {
      return {
        ...loaded,
        activePaper: 'P2',
        activeTopic: 'statistics',
      };
    }
    return loaded;
  });

  // Set document title for Paper 2 Special Edition
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = "Zante's Matric Maths Studio — Paper 2 Edition";
    }
  }, []);

  // 2. Navigation Tabs
  const [activeTab, setActiveTab] = useState<MainNavTab>('practice');

  // 3. Power Tools & Drawer Overlays
  const [isFormulaDrawerOpen, setIsFormulaDrawerOpen] = useState<boolean>(false);
  const [activeFormulaId, setActiveFormulaId] = useState<string | undefined>(undefined);
  const [isScratchpadActive, setIsScratchpadActive] = useState<boolean>(false);
  const [isVipVaultOpen, setIsVipVaultOpen] = useState<boolean>(false);

  // 4. Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 5. Pretty Privilege / Streak Shield Machine
  const shieldMachineRef = useRef<StreakShieldMachine>(
    new StreakShieldMachine(
      studioState.shieldActive ? 'CHARGED' : 'SHATTERED',
      studioState.streakCount
    )
  );
  const [shieldStatus, setShieldStatus] = useState<ShieldStatus>(
    studioState.shieldActive ? 'CHARGED' : 'SHATTERED'
  );
  const [shieldRecoveryCount, setShieldRecoveryCount] = useState<number>(0);

  // Persist state on change
  useEffect(() => {
    saveStudioState(studioState);
  }, [studioState]);

  // Keyboard shortcut listener ('F' for formula sheet, 'S' for scratchpad, 'Escape' for closing overlays)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        setIsFormulaDrawerOpen((prev) => !prev);
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        setIsScratchpadActive((prev) => !prev);
      } else if (e.key === 'Escape') {
        setIsFormulaDrawerOpen(false);
        setIsScratchpadActive(false);
        setIsVipVaultOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Late-night study session detector on initial mount
  useEffect(() => {
    if (isLateNightStudy()) {
      showToast(getLateNightMessage(), 6000);
    }
  }, []);

  const showToast = (msg: string, durationMs: number = 4000) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, durationMs);
  };

  // Paper switcher
  const handlePaperChange = (paper: PaperId) => {
    soundEngine.playTapPop();
    setStudioState((prev) => switchPaper(prev, paper));
  };

  // Topic switcher
  const handleTopicChange = (topicId: TopicId) => {
    soundEngine.playTapPop();
    setStudioState((prev) => ({
      ...prev,
      activeTopic: topicId,
    }));
  };

  // Difficulty switcher (Andre <-> Zante)
  const handleDifficultyChange = (mode: DifficultyMode) => {
    const { newState, roastToast } = switchDifficulty(studioState, mode);
    setStudioState(newState);
    if (roastToast) {
      showToast(roastToast, 5000);
      if (soundEngine.getAudioMode() === 'meme') {
        soundEngine.playVineBoom();
        if (soundEngine.speakFreshBanter) {
          soundEngine.speakFreshBanter('special');
        } else {
          soundEngine.speakReaction("Running back to easy mode? Don't worry, your secret is safe.");
        }
      }
    }
  };

  // Open Formula Sheet with optional highlighting
  const handleOpenFormulaSheet = (formulaId?: string) => {
    soundEngine.playTapPop();
    setActiveFormulaId(formulaId);
    setIsFormulaDrawerOpen(true);
  };

  // Question Answer Result handler
  const handleAnswerResult = (isCorrect: boolean, isLevel4: boolean) => {
    const machine = shieldMachineRef.current;
    if (isLevel4 && machine.status === 'CHARGED') {
      machine.status = 'ARMED';
    }

    const { streakProtected, shieldShattered, reloaded } = machine.submitAnswer(
      isCorrect,
      isLevel4 ? 'L4' : 'L2'
    );

    setShieldStatus(machine.status);
    setShieldRecoveryCount(machine.recoveryCount);

    if (streakProtected) {
      showToast('🛡️ Pretty Privilege Shield saved your streak! (5 correct to recharge)', 4500);
    } else if (reloaded) {
      showToast('🛡️✨ Pretty Privilege Shield fully recharged!', 4000);
      soundEngine.playGlassChime();
    }

    const { newState, milestoneToast } = recordQuestionResult(
      studioState,
      `q_${Date.now()}`,
      isCorrect,
      isLevel4 ? 'L4' : 'L2'
    );

    setStudioState(newState);

    if (milestoneToast) {
      showToast(milestoneToast, 5000);
      const tier = machine.streak >= 20 ? 4 : machine.streak >= 10 ? 3 : machine.streak >= 5 ? 2 : 1;
      soundEngine.playStreakFanfare(tier);
      if (soundEngine.getAudioMode() === 'meme') {
        if (soundEngine.speakFreshBanter) {
          soundEngine.speakFreshBanter('streak');
        } else {
          soundEngine.speakReaction("Five in a row! Who gave you permission to be good at maths too?");
        }
      }
    }
  };

  // VIP Vault Unlocked
  const handleOpenVipVault = () => {
    setIsVipVaultOpen(true);
    // Refill shield to 100% CHARGED as reward
    shieldMachineRef.current.status = 'CHARGED';
    shieldMachineRef.current.recoveryCount = 0;
    setShieldStatus('CHARGED');
    setShieldRecoveryCount(0);
    setStudioState((prev) => ({
      ...prev,
      shieldActive: true,
      vipHypeVaultUnlocked: true,
      unlockedAchievements: prev.unlockedAchievements.includes('vip_vault_unlocked')
        ? prev.unlockedAchievements
        : [...prev.unlockedAchievements, 'vip_vault_unlocked'],
    }));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans pb-16 md:pb-0 overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* 5-Blob Animated Pastel Aurora Background */}
      <AuroraBackground />

      {/* Top Application Header */}
      <Header
        difficultyMode={studioState.difficultyMode}
        onDifficultyChange={handleDifficultyChange}
        streakCount={studioState.streakCount}
        shieldStatus={shieldStatus}
        shieldRecoveryCount={shieldRecoveryCount}
        onOpenVipVault={handleOpenVipVault}
        onToggleFormulaSheet={() => setIsFormulaDrawerOpen((prev) => !prev)}
        onToggleScratchpad={() => setIsScratchpadActive((prev) => !prev)}
        isScratchpadActive={isScratchpadActive}
        isFormulaDrawerOpen={isFormulaDrawerOpen}
      />

      {/* Primary Section & Topic Navigation Bar */}
      <PaperNav
        activePaper={studioState.activePaper}
        onPaperChange={handlePaperChange}
        activeTopic={studioState.activeTopic}
        onTopicChange={handleTopicChange}
        activeTab={activeTab}
        onTabChange={(tab) => {
          soundEngine.playTapPop();
          setActiveTab(tab);
        }}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] p-3.5 rounded-2xl glass-card-elevated iridescent-border bg-white/95 shadow-xl flex items-center justify-between gap-3 animate-slide-down">
          <div className="flex items-center gap-2.5">
            <span className="text-xl shrink-0">✨</span>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              {toastMessage}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 p-1"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main View Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto py-2">
        {activeTab === 'practice' && (
          <QuestionView
            difficultyMode={studioState.difficultyMode}
            activePaper={studioState.activePaper}
            activeTopic={studioState.activeTopic}
            streakCount={studioState.streakCount}
            highestStreak={studioState.highestStreak}
            shieldStatus={shieldStatus}
            shieldRecoveryCount={shieldRecoveryCount}
            onAnswerResult={handleAnswerResult}
            onOpenFormulaSheet={handleOpenFormulaSheet}
            onToggleScratchpad={() => setIsScratchpadActive((prev) => !prev)}
          />
        )}

        {activeTab === 'one_pagers' && (
          <CheatSheetView
            initialTopicId={studioState.activeTopic || 'algebra'}
            onOpenFormulaSheetDrawer={handleOpenFormulaSheet}
          />
        )}

        {activeTab === 'simulator' && (
          <ExamSimulator
            initialPaper={studioState.activePaper}
            onOpenFormulaSheet={handleOpenFormulaSheet}
          />
        )}
      </main>

      {/* Mobile Bottom Tab Bar (< 768px) */}
      <MobileTabBar
        activePaper={studioState.activePaper}
        onPaperChange={handlePaperChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onToggleFormulaSheet={() => setIsFormulaDrawerOpen((prev) => !prev)}
        onToggleScratchpad={() => setIsScratchpadActive((prev) => !prev)}
        isScratchpadActive={isScratchpadActive}
      />

      {/* Slide-over Official NSC Formula Sheet Drawer */}
      <FormulaSheetDrawer
        isOpen={isFormulaDrawerOpen}
        onClose={() => setIsFormulaDrawerOpen(false)}
        activeFormulaId={activeFormulaId}
      />

      {/* High-DPI Glass Scratchpad Overlay */}
      <GlassScratchpad
        isOpen={isScratchpadActive}
        onClose={() => setIsScratchpadActive(false)}
      />

      {/* Secret VIP Hype Vault Modal (5x Crown Tap) */}
      <ViphypeVaultModal
        isOpen={isVipVaultOpen}
        onClose={() => setIsVipVaultOpen(false)}
      />
    </div>
  );
};

export default App;
