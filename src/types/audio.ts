export type AudioMode = 'classy' | 'meme';

export interface SoundEngine {
  init(): void;
  playGlassChime(): void;
  playTapPop(): void;
  playStreakFanfare(tier: number): void;
  playErrorChime(): void;
  playConfettiBlast(): void;
  playShieldShatter(): void;

  // Synthesized Viral Meme Stingers
  playVineBoom(): void;
  playSadTrombone(): void;
  playBruhThud(): void;
  playBaddieShimmer(): void;
  playCameraShutter(): void;
  playAirhorn(): void;
  playJackpot(): void;

  // Audio Mode & Speech
  getAudioMode(): AudioMode;
  setAudioMode(mode: AudioMode): void;
  toggleAudioMode(): AudioMode;
  speakReaction(text: string, options?: { pitch?: number; rate?: number }): void;
  cancelSpeech(): void;
  isVoiceEnabled(): boolean;
  toggleVoice(): boolean;
}
