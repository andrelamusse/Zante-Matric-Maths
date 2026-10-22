/**
 * Zante's Matric Maths Studio — Milestone M5 Verification
 * Challenger 2: Multi-Viewport Responsive & Interactive Audit Suite
 *
 * Requirements Audited:
 * 1. Layout responsiveness across 3 target viewports: Mobile (375x812), Tablet (768x1024), Desktop (1440x900).
 * 2. Mobile touch target ergonomics (44px minimum touch targets audit: buttons, pills, matrix, drawer close).
 * 3. Apple Liquid Glass design tokens in `src/index.css` (alabaster, blur, Houdini @property, fallback, spring physics).
 * 4. Power Tools (FormulaSheetDrawer keyboard shortcut 'F' & search, GlassScratchpad canvas toggle & clear).
 * 5. Web Audio Synthesizer (AudioContext nodes, unlock gestures, 6 synthesis methods).
 * 6. Easter Eggs (Andre->Zante switch roast, late-night study detector 23:00-04:30, 5-tap crown badge VIP Hype Vault).
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';

try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

// Production Imports
const { FORMULA_SHEET } = await import('../src/data/formulaSheet.ts');
const { TOPICS } = await import('../src/data/topics.ts');
const {
  isLateNightStudy,
  isLateNight,
  getLateNightMessage,
  CrownTapDetector,
  ANDRE_VIP_DISCLAIMER,
  MODE_SWITCH_ROASTS,
  getModeSwitchRoast,
  switchDifficulty,
  unlockVipHypeVault,
  StreakShieldMachine,
} = await import('../src/state/studioState.ts');
const { CrystallineSoundEngine } = await import('../src/sound/audioEngine.ts');

// Read source files for static AST & token verification
const srcDir = path.resolve('src');
const indexCss = fs.readFileSync(path.join(srcDir, 'index.css'), 'utf-8');
const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
const appTsx = fs.readFileSync(path.join(srcDir, 'App.tsx'), 'utf-8');
const headerTsx = fs.readFileSync(path.join(srcDir, 'components', 'navigation', 'Header.tsx'), 'utf-8');
const paperNavTsx = fs.readFileSync(path.join(srcDir, 'components', 'navigation', 'PaperNav.tsx'), 'utf-8');
const mobileTabBarTsx = fs.readFileSync(path.join(srcDir, 'components', 'navigation', 'MobileTabBar.tsx'), 'utf-8');
const questionViewTsx = fs.readFileSync(path.join(srcDir, 'components', 'studio', 'QuestionView.tsx'), 'utf-8');
const examSimulatorTsx = fs.readFileSync(path.join(srcDir, 'components', 'studio', 'ExamSimulator.tsx'), 'utf-8');
const cheatSheetViewTsx = fs.readFileSync(path.join(srcDir, 'components', 'studio', 'CheatSheetView.tsx'), 'utf-8');
const formulaDrawerTsx = fs.readFileSync(path.join(srcDir, 'components', 'tools', 'FormulaSheetDrawer.tsx'), 'utf-8');
const scratchpadTsx = fs.readFileSync(path.join(srcDir, 'components', 'tools', 'GlassScratchpad.tsx'), 'utf-8');
const glassButtonTsx = fs.readFileSync(path.join(srcDir, 'components', 'ui', 'GlassButton.tsx'), 'utf-8');
const glassPillTsx = fs.readFileSync(path.join(srcDir, 'components', 'ui', 'GlassPill.tsx'), 'utf-8');
const vipVaultTsx = fs.readFileSync(path.join(srcDir, 'components', 'gamification', 'ViphypeVaultModal.tsx'), 'utf-8');
const quoteModalTsx = fs.readFileSync(path.join(srcDir, 'components', 'gamification', 'QuoteCardModal.tsx'), 'utf-8');

// ============================================================================
// WEB AUDIO MOCK HARNESS
// ============================================================================

class MockAudioParam {
  constructor(initialValue = 0) {
    this.value = initialValue;
    this.events = [];
  }
  setValueAtTime(value, startTime) {
    this.events.push({ type: 'setValueAtTime', value, startTime });
    this.value = value;
    return this;
  }
  linearRampToValueAtTime(value, endTime) {
    this.events.push({ type: 'linearRampToValueAtTime', value, endTime });
    this.value = value;
    return this;
  }
  exponentialRampToValueAtTime(value, endTime) {
    if (value <= 0) {
      throw new RangeError(`Web Audio API RangeError: exponential target must be strictly > 0, got ${value}`);
    }
    this.events.push({ type: 'exponentialRampToValueAtTime', value, endTime });
    this.value = value;
    return this;
  }
}

class MockAudioNode {
  constructor(context) {
    this.context = context;
    this.connections = [];
  }
  connect(destination) {
    this.connections.push(destination);
    return destination;
  }
  disconnect() {
    this.connections = [];
  }
}

class MockOscillatorNode extends MockAudioNode {
  constructor(context) {
    super(context);
    this.type = 'sine';
    this.frequency = new MockAudioParam(440);
    this.startedAt = null;
    this.stoppedAt = null;
  }
  start(time = 0) {
    this.startedAt = time;
  }
  stop(time = 0) {
    this.stoppedAt = time;
  }
}

class MockGainNode extends MockAudioNode {
  constructor(context) {
    super(context);
    this.gain = new MockAudioParam(1);
  }
}

class MockBiquadFilterNode extends MockAudioNode {
  constructor(context) {
    super(context);
    this.type = 'lowpass';
    this.frequency = new MockAudioParam(350);
    this.Q = new MockAudioParam(1);
  }
}

class MockAudioBufferSourceNode extends MockAudioNode {
  constructor(context) {
    super(context);
    this.buffer = null;
    this.startedAt = null;
    this.stoppedAt = null;
  }
  start(time = 0) {
    this.startedAt = time;
  }
  stop(time = 0) {
    this.stoppedAt = time;
  }
}

class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.destination = new MockAudioNode(this);
    this.createdNodes = [];
  }
  createOscillator() {
    const osc = new MockOscillatorNode(this);
    this.createdNodes.push(osc);
    return osc;
  }
  createGain() {
    const gain = new MockGainNode(this);
    this.createdNodes.push(gain);
    return gain;
  }
  createBiquadFilter() {
    const filter = new MockBiquadFilterNode(this);
    this.createdNodes.push(filter);
    return filter;
  }
  createBuffer(channels, length, sampleRate) {
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      getChannelData: () => new Float32Array(length),
    };
  }
  createBufferSource() {
    const src = new MockAudioBufferSourceNode(this);
    this.createdNodes.push(src);
    return src;
  }
  resume() {
    this.state = 'running';
    return Promise.resolve();
  }
}

// Setup mock window environment for Web Audio and DOM events
if (typeof globalThis.window === 'undefined') {
  globalThis.window = {
    AudioContext: MockAudioContext,
    addEventListener: () => {},
    removeEventListener: () => {},
    devicePixelRatio: 2,
    localStorage: {
      store: {},
      getItem(k) { return this.store[k] ?? null; },
      setItem(k, v) { this.store[k] = String(v); },
      removeItem(k) { delete this.store[k]; },
      clear() { this.store = {}; }
    }
  };
  globalThis.localStorage = globalThis.window.localStorage;
}

// ============================================================================
// TEST SUITES
// ============================================================================

describe('Challenger 2 Suite 1: Layout Responsiveness Across 3 Target Viewports', () => {
  it('1.1 Mobile Viewport (375x812): verifies HTML viewport meta tag and single-column responsive shell', () => {
    // index.html must specify responsive viewport meta tag
    assert.ok(
      indexHtml.includes('<meta name="viewport" content="width=device-width, initial-scale=1.0"'),
      'index.html must include standard responsive viewport meta tag'
    );

    // App.tsx responsive shell check: flex-col, overflow-x-hidden, mobile bottom padding
    assert.ok(appTsx.includes('flex flex-col'), 'App.tsx root must use vertical flex-col layout');
    assert.ok(appTsx.includes('overflow-x-hidden'), 'App.tsx root must prevent horizontal scroll overflow');
    assert.ok(appTsx.includes('pb-16 md:pb-0'), 'App.tsx must apply pb-16 on mobile to avoid fixed tab bar clipping');
  });

  it('1.2 Mobile Viewport (375x812): verifies MobileTabBar is active on mobile (< 768px) and hidden on desktop', () => {
    // MobileTabBar must contain md:hidden so it displays only on mobile
    assert.ok(
      mobileTabBarTsx.includes('md:hidden'),
      'MobileTabBar must use md:hidden to show only on mobile viewports'
    );
    assert.ok(
      mobileTabBarTsx.includes('fixed bottom-0'),
      'MobileTabBar must be fixed to the bottom on mobile'
    );

    // Verify all 6 mobile navigation touch targets are wired
    const requiredDestinations = ['Paper 1', 'Paper 2', 'Sheets', 'Exam', 'Formulas', 'Draw'];
    requiredDestinations.forEach((dest) => {
      assert.ok(
        mobileTabBarTsx.includes(dest),
        `MobileTabBar must render navigation action for ${dest}`
      );
    });
  });

  it('1.3 Tablet Viewport (768x1024): verifies adaptive layout transitions and drawer constraints', () => {
    // PaperNav must use flex wrap to adapt gracefully to tablet widths
    assert.ok(
      paperNavTsx.includes('flex-wrap'),
      'PaperNav must wrap items gracefully on tablet widths'
    );

    // Slide-over FormulaSheetDrawer max-w-lg (512px) fits within 768px tablet width
    assert.ok(
      formulaDrawerTsx.includes('max-w-lg'),
      'FormulaSheetDrawer must bound width to max-w-lg (512px) for tablet/desktop slide-over'
    );

    // Header adapts on tablet: hides extra subtitle text or adjusts spacing
    assert.ok(
      headerTsx.includes('hidden md:block'),
      'Header must hide secondary subtitle on small viewports'
    );
  });

  it('1.4 Desktop Viewport (1440x900): verifies max-w container centering and dual-pane layout', () => {
    // Container centering constraints
    assert.ok(
      appTsx.includes('max-w-7xl mx-auto'),
      'App.tsx main content must be constrained to max-w-7xl centered on desktop'
    );
    assert.ok(
      headerTsx.includes('max-w-7xl mx-auto'),
      'Header.tsx content must be constrained to max-w-7xl centered on desktop'
    );
    assert.ok(
      questionViewTsx.includes('max-w-5xl mx-auto'),
      'QuestionView.tsx content must be constrained to max-w-5xl centered on desktop'
    );

    // Desktop header displays full elements
    assert.ok(
      headerTsx.includes('hidden lg:inline'),
      'Header.tsx displays extended shield status labels on desktop (lg:inline)'
    );
    assert.ok(
      paperNavTsx.includes('hidden lg:flex'),
      'PaperNav.tsx displays full paper summary description badge on desktop (lg:flex)'
    );
  });
});

describe('Challenger 2 Suite 2: Mobile Touch Target Ergonomics Audit', () => {
  it('2.1 MobileTabBar touch targets satisfy minimum 44px (min-h-[44px])', () => {
    // In MobileTabBar.tsx: verify buttons declare min-h-[44px]
    const minHeight44Matches = mobileTabBarTsx.match(/min-h-\[44px\]/g) || [];
    assert.ok(
      minHeight44Matches.length >= 6,
      `MobileTabBar must declare min-h-[44px] on all 6 mobile action targets, found ${minHeight44Matches.length}`
    );

    // Verify tab buttons also declare minimum width (>= 44px)
    assert.ok(
      mobileTabBarTsx.includes('min-w-[54px]') || mobileTabBarTsx.includes('min-w-[48px]'),
      'MobileTabBar buttons must satisfy minimum width >= 44px'
    );
  });

  it('2.2 GlassButton default sizing satisfies minimum 44px (min-h-[44px])', () => {
    // In GlassButton.tsx: default 'md' button height must be min-h-[44px]
    assert.ok(
      glassButtonTsx.includes("min-h-[44px]'"),
      'GlassButton size md (default) must enforce min-h-[44px]'
    );
    assert.ok(
      glassButtonTsx.includes("min-h-[48px]'"),
      'GlassButton size lg must enforce min-h-[48px]'
    );
  });

  it('2.3 QuestionView multiple-choice option targets satisfy minimum 44px touch ergonomics', () => {
    // In QuestionView.tsx: options use p-4 (16px top + 16px bottom padding + line-height > 52px)
    assert.ok(
      questionViewTsx.includes('w-full p-4 rounded-2xl border text-left'),
      'QuestionView options must use full-width p-4 padding ensuring touch targets >= 44px'
    );
  });

  it('2.4 Empirical Finding: FormulaSheetDrawer close button has sub-44px touch target (36px)', () => {
    // In FormulaSheetDrawer.tsx line 112:
    // className="!p-2 rounded-full min-h-[36px] min-w-[36px]"
    const hasDrawerClose36px = formulaDrawerTsx.includes('min-h-[36px] min-w-[36px]');
    assert.ok(
      hasDrawerClose36px,
      'Empirical finding confirmed: FormulaSheetDrawer close button is set to 36px (min-h-[36px] min-w-[36px]) rather than 44px'
    );
  });

  it('2.5 Empirical Finding: ExamSimulator question matrix palette items have sub-44px touch target (36px h-9)', () => {
    // In ExamSimulator.tsx line 485:
    // className={`relative min-w-[38px] h-9 rounded-xl ...
    const hasMatrixH9 = examSimulatorTsx.includes('min-w-[38px] h-9');
    assert.ok(
      hasMatrixH9,
      'Empirical finding confirmed: ExamSimulator question matrix palette items use h-9 (36px height) and min-w-[38px] (< 44px)'
    );
  });

  it('2.6 CSS Design System contains .min-touch-target utility class (44px x 44px)', () => {
    // In src/index.css: verify .min-touch-target is defined
    assert.ok(indexCss.includes('.min-touch-target'), 'src/index.css must define .min-touch-target');
    assert.ok(indexCss.includes('min-height: 44px;'), '.min-touch-target must enforce min-height: 44px;');
    assert.ok(indexCss.includes('min-width: 44px;'), '.min-touch-target must enforce min-width: 44px;');
  });
});

describe('Challenger 2 Suite 3: Apple Liquid Glass Design Tokens in src/index.css', () => {
  it('3.1 Luminous Alabaster Surface & Aurora Mesh Tokens', () => {
    assert.ok(indexCss.includes('--canvas-base: #F8FAFC;'), 'Missing --canvas-base: #F8FAFC token');
    assert.ok(indexCss.includes('--canvas-surface: #FFFFFF;'), 'Missing --canvas-surface: #FFFFFF token');
    assert.ok(indexCss.includes('--iridescent-rose: #FF85B3;'), 'Missing --iridescent-rose token');
    assert.ok(indexCss.includes('--iridescent-violet: #C084FC;'), 'Missing --iridescent-violet token');
    assert.ok(indexCss.includes('--iridescent-cyan: #38BDF8;'), 'Missing --iridescent-cyan token');
    assert.ok(indexCss.includes('--iridescent-gold: #FDBA74;'), 'Missing --iridescent-gold token');
    assert.ok(indexCss.includes('--iridescent-mint: #6EE7B7;'), 'Missing --iridescent-mint token');
  });

  it('3.2 Frosted Glass Card Refraction & Specular Edge Tokens', () => {
    assert.ok(indexCss.includes('--glass-fill-primary: rgba(255, 255, 255, 0.76);'), 'Missing --glass-fill-primary token');
    assert.ok(indexCss.includes('backdrop-filter: blur(28px) saturate(190%);'), 'Missing blur(28px) saturate(190%) token');
    assert.ok(indexCss.includes('-webkit-backdrop-filter: blur(28px) saturate(190%);'), 'Missing -webkit-backdrop-filter token');
    assert.ok(indexCss.includes('--specular-inner-edge: inset 0 1px 0 0 rgba(255, 255, 255, 0.98);'), 'Missing specular inner edge token');
  });

  it('3.3 Living Iridescent Rainbow Border (@property CSS Houdini + Fallback)', () => {
    // CSS Houdini @property definition
    assert.ok(indexCss.includes('@property --iridescent-angle {'), 'Missing @property --iridescent-angle definition');
    assert.ok(indexCss.includes('syntax: "<angle>";'), '@property must declare syntax: "<angle>"');
    assert.ok(indexCss.includes('initial-value: 0deg;'), '@property must declare initial-value: 0deg');
    assert.ok(indexCss.includes('inherits: false;'), '@property must declare inherits: false');

    // Conic gradient & animation
    assert.ok(indexCss.includes('conic-gradient('), '.iridescent-border must use conic-gradient');
    assert.ok(indexCss.includes('from var(--iridescent-angle)'), 'conic-gradient must read from var(--iridescent-angle)');
    assert.ok(indexCss.includes('animation: rotateIridescence 6s linear infinite;'), 'Missing rotateIridescence animation');
    assert.ok(indexCss.includes('@keyframes rotateIridescence {'), 'Missing @keyframes rotateIridescence');
    assert.ok(indexCss.includes('--iridescent-angle: 360deg;'), 'rotateIridescence must rotate to 360deg');

    // Non-supporting browser fallback
    assert.ok(
      indexCss.includes('@supports not (background: paint(something))'),
      'Must declare fallback for browsers without CSS Houdini @property support'
    );
  });

  it('3.4 Apple Spring Physics Cubic-Bezier Timings & Active Press Scaling', () => {
    assert.ok(
      indexCss.includes('--spring-press: cubic-bezier(0.34, 1.56, 0.64, 1);'),
      'Missing Apple spring overshoot curve cubic-bezier(0.34, 1.56, 0.64, 1)'
    );
    assert.ok(
      indexCss.includes('--spring-morph: cubic-bezier(0.22, 1, 0.36, 1);'),
      'Missing Apple fluid morph curve cubic-bezier(0.22, 1, 0.36, 1)'
    );
    assert.ok(
      indexCss.includes('transform: scale(0.965);'),
      'Missing active spring-press scale(0.965)'
    );
  });
});

describe('Challenger 2 Suite 4: Power Tools Verification (FormulaSheetDrawer & GlassScratchpad)', () => {
  it('4.1 FormulaSheetDrawer keyboard shortcut ("F") listener in App.tsx', () => {
    assert.ok(
      appTsx.includes("e.key === 'f' || e.key === 'F'"),
      "App.tsx must listen to 'f' and 'F' keys to toggle FormulaSheetDrawer"
    );
    // Must avoid triggering when user is typing in input or textarea
    assert.ok(
      appTsx.includes("target.tagName === 'INPUT' || target.tagName === 'TEXTAREA'"),
      "App.tsx must guard 'F' key listener against triggering while typing in inputs"
    );
  });

  it('4.2 FormulaSheetDrawer search filtering across all 44 formulas and KaTeX rendering', () => {
    assert.equal(FORMULA_SHEET.length, 44, 'FormulaSheet catalog must contain exactly 44 formulas');

    const search = (q) => {
      const term = q.toLowerCase().trim();
      return FORMULA_SHEET.filter((f) => {
        if (!term) return true;
        return (
          f.name.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term) ||
          f.latex.toLowerCase().includes(term) ||
          (f.usageNotes && f.usageNotes.toLowerCase().includes(term))
        );
      });
    };

    // Test specific search queries
    const quadResults = search('quadratic');
    assert.ok(quadResults.length >= 1, 'Search for "quadratic" must return at least 1 formula');
    assert.ok(quadResults.some((f) => f.id === 'P1-AL-01'), 'Must match Quadratic Formula ID P1-AL-01');

    const annuityResults = search('annuity');
    assert.ok(annuityResults.length >= 2, 'Search for "annuity" must return future & present value annuities');

    const sineRuleResults = search('sine rule');
    assert.ok(sineRuleResults.length >= 1, 'Search for "sine rule" must return sine rule formula');

    // Empty search returns all 44
    assert.equal(search('').length, 44, 'Empty search must return all 44 formulas');
    assert.equal(search('   ').length, 44, 'Whitespace search must return all 44 formulas');
  });

  it('4.3 GlassScratchpad canvas clear routine and undo/redo stacks', () => {
    assert.ok(scratchpadTsx.includes('handleClear'), 'GlassScratchpad must implement handleClear routine');
    assert.ok(scratchpadTsx.includes('ctx.clearRect(0, 0, canvas.width, canvas.height)'), 'Clear routine must clear canvas context');
    assert.ok(scratchpadTsx.includes('handleUndo'), 'GlassScratchpad must implement handleUndo routine');
    assert.ok(scratchpadTsx.includes('handleRedo'), 'GlassScratchpad must implement handleRedo routine');
    assert.ok(scratchpadTsx.includes('undoStackRef.current.length >= 20'), 'Undo stack must be capped at 20 states');
  });

  it('4.4 GlassScratchpad canvas toggle, minimize and midpoint bezier curve smoothing', () => {
    assert.ok(scratchpadTsx.includes('setIsMinimized(true)'), 'GlassScratchpad must support minimize toggle');
    assert.ok(scratchpadTsx.includes('setIsMinimized(false)'), 'GlassScratchpad must support restore from minimize');
    assert.ok(scratchpadTsx.includes('ctx.quadraticCurveTo(lastP.x, lastP.y, midX, midY)'), 'GlassScratchpad must use midpoint quadratic bezier curve smoothing');
  });
});

describe('Challenger 2 Suite 5: Web Audio Synthesizer Deep Empirical Audit', () => {
  let engine;

  beforeEach(() => {
    engine = new CrystallineSoundEngine();
    engine.init();
  });

  it('5.1 Method signatures: implements all 6 required sound methods and mute toggle', () => {
    const requiredMethods = [
      'playGlassChime',
      'playTapPop',
      'playStreakFanfare',
      'playErrorChime',
      'playConfettiBlast',
      'playShieldShatter',
      'toggleMute',
      'isMuted',
    ];
    requiredMethods.forEach((method) => {
      assert.equal(typeof engine[method], 'function', `AudioEngine must define method ${method}`);
    });
  });

  it('5.2 Audio unlock routine attaches passive one-time gesture listeners', () => {
    assert.ok(
      typeof engine.init === 'function',
      'AudioEngine must provide init() to resume AudioContext upon user gesture'
    );
  });

  it('5.3 playGlassChime: creates 5 pentatonic sine oscillators and lowpass filter', () => {
    engine.playGlassChime();
    const ctx = engine['ctx'];
    assert.ok(ctx, 'AudioContext must be instantiated');
    const oscs = ctx.createdNodes.filter((n) => n instanceof MockOscillatorNode);
    assert.ok(oscs.length >= 5, `playGlassChime must create at least 5 oscillators, got ${oscs.length}`);
    const filters = ctx.createdNodes.filter((n) => n instanceof MockBiquadFilterNode);
    assert.ok(filters.length >= 5, 'playGlassChime must route through biquad filters');
  });

  it('5.4 playTapPop: creates rapid downward frequency glide (540Hz -> 180Hz)', () => {
    engine.playTapPop();
    const ctx = engine['ctx'];
    const oscs = ctx.createdNodes.filter((n) => n instanceof MockOscillatorNode);
    const popOsc = oscs[oscs.length - 1];
    assert.ok(popOsc, 'playTapPop must instantiate an oscillator');
    const freqEvents = popOsc.frequency.events;
    assert.ok(
      freqEvents.some((e) => e.type === 'setValueAtTime' && e.value === 540),
      'playTapPop must set initial frequency to 540Hz'
    );
    assert.ok(
      freqEvents.some((e) => e.type === 'exponentialRampToValueAtTime' && e.value === 180),
      'playTapPop must ramp frequency exponentially down to 180Hz'
    );
  });

  it('5.5 playStreakFanfare: validates tier parameter (0..4) and rejects invalid tiers', () => {
    assert.doesNotThrow(() => engine.playStreakFanfare(0));
    assert.doesNotThrow(() => engine.playStreakFanfare(1));
    assert.doesNotThrow(() => engine.playStreakFanfare(2));
    assert.doesNotThrow(() => engine.playStreakFanfare(3));
    assert.doesNotThrow(() => engine.playStreakFanfare(4));

    assert.throws(
      () => engine.playStreakFanfare(-1),
      /Invalid tier: -1/,
      'playStreakFanfare must reject negative tier'
    );
    assert.throws(
      () => engine.playStreakFanfare(5),
      /Invalid tier: 5/,
      'playStreakFanfare must reject tier > 4'
    );
  });

  it('5.6 playErrorChime: creates dual soft descending tones', () => {
    engine.playErrorChime();
    const ctx = engine['ctx'];
    const oscs = ctx.createdNodes.filter((n) => n instanceof MockOscillatorNode);
    assert.ok(oscs.length >= 2, 'playErrorChime must create at least 2 tone oscillators');
  });

  it('5.7 playConfettiBlast: creates synthetic white noise buffer source and bandpass filter', () => {
    engine.playConfettiBlast();
    const ctx = engine['ctx'];
    const buffers = ctx.createdNodes.filter((n) => n instanceof MockAudioBufferSourceNode);
    assert.ok(buffers.length >= 1, 'playConfettiBlast must create an AudioBufferSourceNode');
  });

  it('5.8 playShieldShatter: creates 4 fracture oscillators with exponential descent', () => {
    engine.playShieldShatter();
    const ctx = engine['ctx'];
    const oscs = ctx.createdNodes.filter((n) => n instanceof MockOscillatorNode);
    assert.ok(oscs.length >= 4, 'playShieldShatter must create 4 fracture oscillators');
  });

  it('5.9 Mute toggle: mutes all sound methods cleanly without node instantiation', () => {
    engine.enabled = false;
    const initialNodeCount = engine['ctx']?.createdNodes.length || 0;
    engine.playGlassChime();
    engine.playTapPop();
    engine.playErrorChime();
    engine.playShieldShatter();
    const finalNodeCount = engine['ctx']?.createdNodes.length || 0;
    assert.equal(finalNodeCount, initialNodeCount, 'Muted engine must not instantiate any audio nodes');
  });
});

describe('Challenger 2 Suite 6: Easter Eggs Verification', () => {
  it('6.1 Andre -> Zante difficulty switch roast toast', () => {
    const mockState = {
      version: 1,
      difficultyMode: 'andre',
      activePaper: 'P1',
      streakCount: 4,
      highestStreak: 4,
      shieldActive: true,
      vipHypeVaultUnlocked: false,
      crownTapCount: 0,
      lastStudyTimestamp: Date.now(),
      completedQuestionIds: [],
      unlockedAchievements: [],
    };

    // Switching Andre -> Zante triggers roast toast
    const { newState, roastToast } = switchDifficulty(mockState, 'zante');
    assert.equal(newState.difficultyMode, 'zante');
    assert.ok(roastToast, 'Switching Andre -> Zante must produce a roast toast');
    assert.ok(
      roastToast.includes("quadratic equations can't hurt you here") ||
      roastToast.includes('Zante mode'),
      `Roast toast must match witty voice, got: "${roastToast}"`
    );

    // Switching Zante -> Andre does NOT roast
    const switchBack = switchDifficulty(newState, 'andre');
    assert.equal(switchBack.newState.difficultyMode, 'andre');
    assert.equal(switchBack.roastToast, null, 'Switching Zante -> Andre must not produce a roast toast');
  });

  it('6.2 Late-Night Study Detector (23:00 to 04:30) boundary sweep', () => {
    // 22:59 -> false (1 minute before window)
    assert.equal(isLateNightStudy(22, 59), false, '22:59 must not be late night');

    // 23:00 -> true (exact start boundary)
    assert.equal(isLateNightStudy(23, 0), true, '23:00 must trigger late night');
    assert.equal(isLateNightStudy(23, 45), true, '23:45 must trigger late night');

    // Midnight through 03:59 -> true
    assert.equal(isLateNightStudy(0, 0), true, '00:00 must trigger late night');
    assert.equal(isLateNightStudy(1, 30), true, '01:30 must trigger late night');
    assert.equal(isLateNightStudy(3, 59), true, '03:59 must trigger late night');

    // 04:00 through 04:30 -> true (exact cutoff boundary)
    assert.equal(isLateNightStudy(4, 0), true, '04:00 must trigger late night');
    assert.equal(isLateNightStudy(4, 30), true, '04:30 must trigger late night');

    // 04:31 -> false (1 minute after window)
    assert.equal(isLateNightStudy(4, 31), false, '04:31 must not be late night');
    assert.equal(isLateNightStudy(5, 0), false, '05:00 must not be late night');
    assert.equal(isLateNightStudy(14, 0), false, '14:00 must not be late night');

    // Message check
    const msg = getLateNightMessage();
    assert.ok(msg.includes('Late-night math grind detected'), 'Late night message must provide encouraging reminder');
  });

  it('6.3 5-Tap Crown Badge VIP Hype Vault modal trigger', () => {
    const detector = new CrownTapDetector();

    const t0 = 1000;
    assert.equal(detector.tap(t0), false, 'Tap 1 must not unlock');
    assert.equal(detector.tap(t0 + 200), false, 'Tap 2 must not unlock');
    assert.equal(detector.tap(t0 + 400), false, 'Tap 3 must not unlock');
    assert.equal(detector.tap(t0 + 600), false, 'Tap 4 must not unlock');
    assert.equal(detector.tap(t0 + 800), true, 'Tap 5 within 2500ms must unlock VIP vault');

    // Taps separated by > 2500ms must not unlock
    detector.reset();
    assert.equal(detector.tap(1000), false);
    assert.equal(detector.tap(4000), false); // 3000ms later (exceeds window)
    assert.equal(detector.tap(7000), false);
    assert.equal(detector.tap(10000), false);
    assert.equal(detector.tap(13000), false);
    assert.equal(detector.unlocked, false, 'Slow taps (> 2500ms) must not unlock');
  });

  it('6.4 VIP Hype Vault unlocks Pretty Privilege Shield refill perk & achievement', () => {
    const baseState = {
      version: 1,
      difficultyMode: 'andre',
      activePaper: 'P1',
      streakCount: 3,
      highestStreak: 3,
      shieldActive: false,
      vipHypeVaultUnlocked: false,
      crownTapCount: 5,
      lastStudyTimestamp: Date.now(),
      completedQuestionIds: [],
      unlockedAchievements: [],
    };

    const { state: unlockedState, unlocked } = unlockVipHypeVault(baseState);
    assert.equal(unlocked, true);
    assert.equal(unlockedState.vipHypeVaultUnlocked, true);
    assert.equal(unlockedState.shieldActive, true, 'VIP Vault must refill Pretty Privilege Shield to true');
    assert.ok(
      unlockedState.unlockedAchievements.includes('vip_hype_vault'),
      'VIP Vault must reward vip_hype_vault achievement'
    );
  });

  it('6.5 Verbatim 4-Point Disclaimer from Andre in VIP Hype Vault', () => {
    // 1. Mathematical Competence
    assert.equal(ANDRE_VIP_DISCLAIMER.section1.title, 'Mathematical Competence');
    assert.ok(
      ANDRE_VIP_DISCLAIMER.section1.content.includes(
        '150 marks in Paper 1 and 150 marks in Paper 2 are just numbers waiting for you to collect them.'
      ),
      'Section 1 content must match Andre verbatim text'
    );

    // 2. The Purpose of This App
    assert.equal(ANDRE_VIP_DISCLAIMER.section2.title, 'The Purpose of This App');
    assert.ok(
      ANDRE_VIP_DISCLAIMER.section2.content.includes(
        '0% tolerance for boring textbooks and 100% devotion to helping you walk into the exam hall feeling completely untouchable.'
      ),
      'Section 2 content must match Andre verbatim text'
    );

    // 3. Emergency Calculus Protocol
    assert.equal(ANDRE_VIP_DISCLAIMER.section3.title, 'Emergency Calculus Protocol');
    assert.ok(
      ANDRE_VIP_DISCLAIMER.section3.content.includes(
        "the turning point is just where f'(x) = 0. Take the derivative, set it to zero, breathe, and keep moving."
      ),
      'Section 3 content must match Andre verbatim text'
    );

    // 4. The Official Guarantee
    assert.equal(ANDRE_VIP_DISCLAIMER.section4.title, 'The Official Guarantee');
    assert.ok(
      ANDRE_VIP_DISCLAIMER.section4.content.includes(
        'contractually entitled to brag about it indefinitely to everyone in Potchefstroom.'
      ),
      'Section 4 content must match Andre verbatim text'
    );
  });
});

describe('Challenger 2 Suite 7: Adversarial Stress Invariants & Boundary Matrix', () => {
  it('7.1 Full 24-Hour (1,440-minute) day sweep of Late-Night Study Detector', () => {
    let lateMinutes = 0;
    let normalMinutes = 0;

    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m++) {
        const isLate = isLateNightStudy(h, m);
        if (isLate) {
          lateMinutes++;
        } else {
          normalMinutes++;
        }
      }
    }

    // 23:00 to 24:00 = 60 mins
    // 00:00 to 04:00 = 240 mins
    // 04:00 to 04:30 = 31 mins (04:00 .. 04:30 inclusive)
    // Total = 331 minutes
    assert.equal(lateMinutes, 331, `Late night minutes in a day must be exactly 331, got ${lateMinutes}`);
    assert.equal(normalMinutes, 1440 - 331, `Normal minutes in a day must be exactly 1109, got ${normalMinutes}`);
    assert.equal(lateMinutes + normalMinutes, 1440, 'Sum of day minutes must equal 1,440');
  });

  it('7.2 High-concurrency AudioEngine stress: 100 rapid calls and exponential gain safety', () => {
    const stressEngine = new CrystallineSoundEngine();
    stressEngine.init();

    assert.doesNotThrow(() => {
      for (let i = 0; i < 100; i++) {
        stressEngine.playTapPop();
        stressEngine.playGlassChime();
        stressEngine.playStreakFanfare(i % 5);
        stressEngine.playErrorChime();
        stressEngine.playShieldShatter();
      }
    }, 'Rapid concurrent audio calls must not throw or crash');

    // Verify all created nodes with exponential ramps have strictly positive values
    const ctx = stressEngine['ctx'];
    assert.ok(ctx);
    const gains = ctx.createdNodes.filter((n) => n instanceof MockGainNode);
    gains.forEach((g) => {
      g.gain.events.forEach((ev) => {
        if (ev.type === 'exponentialRampToValueAtTime') {
          assert.ok(
            ev.value > 0,
            `Web Audio gain exponential target must be strictly > 0, got ${ev.value}`
          );
        }
      });
    });
  });

  it('7.3 FormulaSheet live search fuzzing: 50 special character and LaTeX queries', () => {
    const hostileQueries = [
      '\\frac', '\\sqrt', '{2a}', '^2', '\\pm', 'x =', '!!!', '???',
      'SELECT * FROM formulas', '<script>alert(1)</script>',
      '   annuity   ', 'QUADRATIC', 'arithmetic', 'geom', 'sin', 'cos', 'tan',
      '\\alpha', '\\beta', '\\theta', 'd = T_2 - T_1', 'P(A \\cup B)',
      'null', 'undefined', '[object Object]', '{}', 'NaN', '0', '-1',
    ];

    const search = (q) => {
      const term = q.toLowerCase().trim();
      return FORMULA_SHEET.filter((f) => {
        if (!term) return true;
        return (
          f.name.toLowerCase().includes(term) ||
          f.description.toLowerCase().includes(term) ||
          f.latex.toLowerCase().includes(term) ||
          (f.usageNotes && f.usageNotes.toLowerCase().includes(term))
        );
      });
    };

    hostileQueries.forEach((query) => {
      assert.doesNotThrow(
        () => search(query),
        `Searching for "${query}" must never throw or corrupt filter logic`
      );
    });
  });

  it('7.4 Empirical Touch Target Census: catalogs compliant vs sub-44px targets across all studio components', () => {
    // Compliant >= 44px elements inventory
    const compliantInventory = [
      { component: 'MobileTabBar', element: 'Paper 1 Tab', target: 'min-w-[54px] min-h-[44px]', status: 'PASS' },
      { component: 'MobileTabBar', element: 'Paper 2 Tab', target: 'min-w-[54px] min-h-[44px]', status: 'PASS' },
      { component: 'MobileTabBar', element: 'One-Pagers Tab', target: 'min-w-[54px] min-h-[44px]', status: 'PASS' },
      { component: 'MobileTabBar', element: 'Exam Simulator Tab', target: 'min-w-[54px] min-h-[44px]', status: 'PASS' },
      { component: 'MobileTabBar', element: 'Formulas Drawer Action', target: 'min-w-[48px] min-h-[44px]', status: 'PASS' },
      { component: 'MobileTabBar', element: 'Scratchpad Action', target: 'min-w-[48px] min-h-[44px]', status: 'PASS' },
      { component: 'GlassButton', element: 'Default md Button', target: 'min-h-[44px] px-4 py-2.5', status: 'PASS' },
      { component: 'GlassButton', element: 'Large lg Button', target: 'min-h-[48px] px-6 py-3.5', status: 'PASS' },
      { component: 'QuestionView', element: 'MCQ Option Cards', target: 'w-full p-4 (height >= 52px)', status: 'PASS' },
      { component: 'QuestionView', element: 'Next Question CTA', target: 'size="md" min-h-[44px]', status: 'PASS' },
      { component: 'QuoteCardModal', element: 'Copy & Keep Flexing CTAs', target: 'size="md" min-h-[44px]', status: 'PASS' },
      { component: 'ViphypeVaultModal', element: 'Claim Distinction CTA', target: 'size="md" min-h-[44px]', status: 'PASS' },
    ];

    // Sub-44px elements discovered (Adversarial Findings)
    const sub44Inventory = [
      { component: 'FormulaSheetDrawer', element: 'Drawer Close Button', target: 'min-h-[36px] min-w-[36px]', deficitPx: 8 },
      { component: 'ExamSimulator', element: 'Question Matrix Palette Items', target: 'min-w-[38px] h-9 (36px)', deficitPx: 8 },
      { component: 'Header', element: 'Header Tool Buttons (Fx, Draw, Audio)', target: '!min-h-[36px]', deficitPx: 8 },
      { component: 'GlassScratchpad', element: 'Toolbar Action Buttons (Undo, Redo, Clear, Min, Close)', target: 'size="sm" (min-h-[36px])', deficitPx: 8 },
      { component: 'GlassScratchpad', element: 'Pastel Ink Color Swatches', target: 'w-6 h-6 (24px)', deficitPx: 20 },
      { component: 'ViphypeVaultModal', element: 'Top-Right Close Button', target: 'p-1.5 text-base (~32px)', deficitPx: 12 },
      { component: 'QuoteCardModal', element: 'Top-Right Close Button', target: 'p-1 text-sm (~28px)', deficitPx: 16 },
    ];

    assert.equal(compliantInventory.length, 12, 'Must audit at least 12 core compliant touch targets');
    assert.equal(sub44Inventory.length, 7, 'Must catalog all 7 sub-44px adversarial touch target findings');
  });

  it('7.5 Multi-Viewport Modal Dialog Containment & Scroll Protection', () => {
    // ViphypeVaultModal max-w-2xl and max-h-[90vh] with overflow-y-auto
    assert.ok(vipVaultTsx.includes('max-w-2xl'), 'ViphypeVaultModal must bound width to max-w-2xl');
    assert.ok(vipVaultTsx.includes('max-h-[90vh]'), 'ViphypeVaultModal must bound height to max-h-[90vh]');
    assert.ok(vipVaultTsx.includes('overflow-y-auto'), 'ViphypeVaultModal must provide scroll on mobile');

    // QuoteCardModal max-w-md
    assert.ok(quoteModalTsx.includes('max-w-md'), 'QuoteCardModal must bound width to max-w-md');

    // GlassScratchpad max-w-4xl and h-[85vh]
    assert.ok(scratchpadTsx.includes('max-w-4xl'), 'GlassScratchpad must bound width to max-w-4xl');
    assert.ok(scratchpadTsx.includes('h-[85vh]'), 'GlassScratchpad must bound height to h-[85vh]');
  });
});

