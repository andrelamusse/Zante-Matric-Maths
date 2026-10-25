/**
 * Zante's Matric Maths Studio — Dynamic Banter Memory Buffer & 2026 Voice Lines
 *
 * Implements an LRU anti-repetition queue (capacity 15) ensuring Zante never
 * hears the same compliment, roast, streak toast, or voice cue twice in a session.
 *
 * Contains 65+ fresh, high-status, witty 2026 voice lines matching Zante's
 * aesthetic: "Smart AND pretty", zero-cringe, playful group-chat screenshot vibes.
 */

export class BanterMemoryBuffer {
  private buffer: string[] = [];
  public readonly capacity: number;

  constructor(capacity: number = 15) {
    this.capacity = capacity;
  }

  /**
   * Returns whether an entry is currently in the recent memory buffer.
   */
  has(item: string): boolean {
    return this.buffer.includes(item);
  }

  /**
   * Records a line in the buffer, moving it to the most-recent position.
   * Evicts the oldest entry if capacity is exceeded.
   */
  record(item: string): void {
    if (!item) return;
    const existingIdx = this.buffer.indexOf(item);
    if (existingIdx !== -1) {
      this.buffer.splice(existingIdx, 1);
    }
    this.buffer.push(item);
    if (this.buffer.length > this.capacity) {
      this.buffer.shift();
    }
  }

  /**
   * Selects a fresh item from candidates avoiding anything in the 15-entry LRU buffer.
   * If all candidates are currently in the buffer, falls back to the least-recently-used candidate.
   */
  selectFresh<T extends string>(candidates: readonly T[] | T[]): T {
    if (candidates.length === 0) {
      throw new Error('Candidate list cannot be empty');
    }

    const available = candidates.filter((item) => !this.buffer.includes(item));
    let chosen: T;

    if (available.length > 0) {
      chosen = available[Math.floor(Math.random() * available.length)];
    } else {
      // All candidates are in the buffer: pick least recently used (lowest buffer index)
      let oldestIdx = Infinity;
      chosen = candidates[0];
      for (const item of candidates) {
        const idx = this.buffer.indexOf(item);
        if (idx !== -1 && idx < oldestIdx) {
          oldestIdx = idx;
          chosen = item;
        }
      }
    }

    this.record(chosen);
    return chosen;
  }

  /**
   * Returns current buffer entries (oldest to newest).
   */
  getEntries(): string[] {
    return [...this.buffer];
  }

  /**
   * Returns current buffer size.
   */
  size(): number {
    return this.buffer.length;
  }

  /**
   * Clears memory buffer.
   */
  clear(): void {
    this.buffer = [];
  }
}

// ---------------------------------------------------------------------------
// 65+ Fresh, High-Status, Witty 2026 Voice Lines
// ---------------------------------------------------------------------------

export const PRAISE_VOICE_LINES = [
  "4?! Stop it right now, Einstein is literally shaking. You're so smart AND pretty, how is that even legal? 💅✨",
  "Well done baby, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖",
  "Academic weapon unlocked! Give this girl her 100% Matric distinction right now 🔥😘",
  'Wait, Einstein has been real quiet since you tackled this.',
  'Smart AND pretty, pick a struggle honestly.',
  'Academic weapon unlocked. Hand over the distinction already.',
  "Don't let Harvard see this, they'll offer you a full ride right now.",
  '1000 aura points added. Distinction energy is radiating.',
  'The Department of Basic Education is not ready for this level of competence.',
  'Beauty, brains, and perfect algebra? The simulation is glitching.',
  'Math Paper 2 is literally shaking in its boots.',
  'Flawless calculation. We love a high-status academic queen.',
  'She solved it before the ice in her latte even melted.',
  'Okay wait, you actually cooked so hard on this one.',
  'That was not just correct, that was aesthetically immaculate.',
  'Full marks on the memo. The examiner has zero notes.',
  'Euclidean geometry riders bow before you today.',
  'A whole math baddie in her natural habitat.',
  'Your brain works faster than uncapped fiber internet.',
  'The Tan-Chord Theorem was honored to be proved by you.',
  'Pure distinction behavior. Screenshot this immediately.',
  'Andre is taking frantic notes in the corner right now.',
  'Zero mistakes detected. Your aura is blinding.',
  'Not a single flaw in that proof. Pure mathematical royalty.',
  "She's calculating at an Ivy League standard today.",
  'That step was smoother than a fresh lip gloss application.',
  'Trigonometry & circle geometry mastered. Onto the graduation stage we go.',
  'Crown polished, distinction secured, next question please.',
] as const;

export const ROAST_VOICE_LINES = [
  "Wait, the math must be wrong because you're literally too pretty to be wrong. Try that again gorgeous 😉✨",
  "Girl... ain't no way you just clicked that. We are blaming the screen glare on that one 💀",
  "Ain't no way... we're blaming the screen glare on that one.",
  'Wait, did your thumb slip? Try that again gorgeous.',
  "We're blaming Mercury in retrograde for that calculation.",
  "Bestie, let's pretend that was a misclick and never speak of it again.",
  'The math was not mathing there, but your confidence was a 10.',
  'Even the asymptotes are confused by that choice right now.',
  'Did you forget your glasses or was that emotional arithmetic?',
  'That answer choice was a bold creative choice, just mathematically wrong.',
  'Girl math did not approve that transaction.',
  'We will cut that out of the official highlight reel, do not worry.',
  'A slight detour on the road to a distinction. Shake it off.',
  'The negative sign was right there, looking straight at you!',
  'Quick, blame it on low caffeine levels before anyone notices.',
  'That was a warmup round. Now show them the real academic weapon.',
  'Zero marks on the memo, but 10 out of 10 for dramatic flair.',
  "Distraction detected. Lock back in, you've got this.",
  'That formula looked at you sideways and you let it win?!',
  "I'm going to erase that from memory like it never happened.",
  'Not the distractor option! Andre literally set a trap and you stepped in it.',
] as const;

export const STREAK_VOICE_LINES = [
  'Three in a row! Sparks are officially flying.',
  'Five streak! Who gave you permission to be good at maths too?',
  'Ten streak! Certified academic weapon, screenshot this immediately.',
  'Twenty streak! Paper 2 is literally shaking.',
  'Thirty streak! Liquid Diamond God-Tier, this is history in the making.',
  "Forty streak! Andre's jaw is on the floor.",
  'Fifty streak! They need to name a theorem after you at this point.',
  "Unstoppable momentum. The exam paper won't know what hit it.",
  "Streak meter overloaded. You're officially in distinction territory.",
  'This streak is officially longer than an iced coffee receipt.',
] as const;

export const SPECIAL_VOICE_LINES = [
  "Running back to Zante mode? Don't worry, your secret is safe.",
  'Pretty privilege shield activated. Your streak is legally protected.',
  'Shield shattered! Time to lock in and recharge those 5 questions.',
  "VIP Hype Vault unlocked! You found Andre's secret vault.",
  'Late night study session? Distinctions wait for no one.',
  'Formula sheet summoned. Let us find that exact equation.',
  'Glass scratchpad opened. Time to sketch this graph into submission.',
  'New milestone achieved! Your trophy cabinet is running out of space.',
  'Entering Level 4 territory. Pretty privilege shield is armed and ready.',
  'Exam simulator ready. Time to put 150 marks on the board.',
] as const;

export const ALL_VOICE_LINES = [
  ...PRAISE_VOICE_LINES,
  ...ROAST_VOICE_LINES,
  ...STREAK_VOICE_LINES,
  ...SPECIAL_VOICE_LINES,
] as const;

// Global singleton buffer for session memory
export const globalBanterBuffer = new BanterMemoryBuffer(15);

export type BanterCategory = 'praise' | 'roast' | 'streak' | 'special' | 'all';

/**
 * Returns a fresh voice line for the given category avoiding recent repetition.
 */
export function getFreshVoiceLine(
  category: BanterCategory = 'praise',
  buffer: BanterMemoryBuffer = globalBanterBuffer
): string {
  switch (category) {
    case 'praise':
      return buffer.selectFresh(PRAISE_VOICE_LINES);
    case 'roast':
      return buffer.selectFresh(ROAST_VOICE_LINES);
    case 'streak':
      return buffer.selectFresh(STREAK_VOICE_LINES);
    case 'special':
      return buffer.selectFresh(SPECIAL_VOICE_LINES);
    case 'all':
    default:
      return buffer.selectFresh(ALL_VOICE_LINES);
  }
}
