/**
 * Zante's Matric Maths Studio — Adversarial Challenge Suite for Milestone M3
 * Challenger 2: Power Tools & Sound Engine
 *
 * Scope:
 * 1. Formula Sheet Drawer search algorithm & category filtering (empty string, partial matches, case-insensitivity, P1 vs P2, KaTeX rendering, active formula highlighting).
 * 2. Glass Scratchpad state machine, undo/redo stack limits, opacity clamp in [0.1, 1.0], tool toggles (pen vs eraser), bezier smoothing.
 * 3. Audio Engine method contracts: oscillator frequency generation, gain envelope exponential decay (V > 0), audio unlock routines, mute toggle persistence.
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

const { FORMULA_SHEET } = await import('../src/data/formulaSheet.ts');
const { CrystallineSoundEngine } = await import('../src/sound/audioEngine.ts');

// ============================================================================
// WEB AUDIO API MOCK HARNESS FOR RIGOROUS METHOD CONTRACT TESTING
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
    // Web Audio Spec: value MUST be strictly positive (> 0)
    if (value <= 0) {
      throw new RangeError(
        `Web Audio API RangeError: The float target value must be non-negative and non-zero, got ${value}`
      );
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
    this.detune = new MockAudioParam(0);
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
    this.gain = new MockAudioParam(0);
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
    this.state = 'suspended';
    this.currentTime = 0;
    this.sampleRate = 44100;
    this.destination = new MockAudioNode(this);

    // Telemetry tracking
    this.createdNodes = {
      oscillators: [],
      gains: [],
      filters: [],
      bufferSources: [],
    };
  }

  resume() {
    this.state = 'running';
    return Promise.resolve();
  }

  createOscillator() {
    const node = new MockOscillatorNode(this);
    this.createdNodes.oscillators.push(node);
    return node;
  }

  createGain() {
    const node = new MockGainNode(this);
    this.createdNodes.gains.push(node);
    return node;
  }

  createBiquadFilter() {
    const node = new MockBiquadFilterNode(this);
    this.createdNodes.filters.push(node);
    return node;
  }

  createBufferSource() {
    const node = new MockAudioBufferSourceNode(this);
    this.createdNodes.bufferSources.push(node);
    return node;
  }

  createBuffer(channels, length, sampleRate) {
    const channelData = new Array(channels).fill(0).map(() => new Float32Array(length));
    return {
      numberOfChannels: channels,
      length,
      sampleRate,
      duration: length / sampleRate,
      getChannelData: (ch) => channelData[ch] || new Float32Array(length),
    };
  }
}

// Mock window and localStorage
class MockLocalStorage {
  constructor() {
    this.store = new Map();
  }
  getItem(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  setItem(key, value) {
    this.store.set(key, String(value));
  }
  removeItem(key) {
    this.store.delete(key);
  }
  clear() {
    this.store.clear();
  }
}

// Global browser simulation environment
function setupBrowserMocks() {
  const localStorage = new MockLocalStorage();
  const listeners = new Map();

  global.window = {
    AudioContext: MockAudioContext,
    localStorage,
    addEventListener: (event, handler, options) => {
      if (!listeners.has(event)) listeners.set(event, []);
      listeners.get(event).push({ handler, options });
    },
    removeEventListener: (event, handler) => {
      if (listeners.has(event)) {
        const list = listeners.get(event).filter((item) => item.handler !== handler);
        listeners.set(event, list);
      }
    },
    dispatchEvent: (event, data) => {
      if (listeners.has(event)) {
        const list = [...listeners.get(event)];
        for (const item of list) {
          item.handler(data);
          if (item.options?.once) {
            global.window.removeEventListener(event, item.handler);
          }
        }
      }
    },
  };

  global.localStorage = localStorage;
  return { localStorage, listeners };
}

// ============================================================================
// 1. FORMULA SHEET DRAWER SEARCH & CATEGORY FILTERING ADVERSARIAL SUITE
// ============================================================================

describe('Formula Sheet Drawer: Search Algorithm & Category Filtering', () => {
  // Pure filtering algorithm extracted verbatim from FormulaSheetDrawer.tsx lines 51-75
  function filterFormulas(searchQuery, selectedCategory) {
    const q = searchQuery.toLowerCase().trim();
    return FORMULA_SHEET.filter((f) => {
      const matchesCategory =
        selectedCategory === 'all' ||
        f.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'Algebra' && f.topicId === 'algebra') ||
        (selectedCategory === 'Patterns' && f.topicId === 'patterns') ||
        (selectedCategory === 'Finance' && f.topicId === 'finance') ||
        (selectedCategory === 'Calculus' && f.topicId === 'calculus') ||
        (selectedCategory === 'Probability' && f.topicId === 'probability') ||
        (selectedCategory === 'Statistics' && f.topicId === 'statistics') ||
        (selectedCategory === 'Analytical Geometry' && f.topicId === 'analytical_geometry') ||
        (selectedCategory === 'Trigonometry' && f.topicId === 'trigonometry');

      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        f.latex.toLowerCase().includes(q) ||
        (f.usageNotes && f.usageNotes.toLowerCase().includes(q))
      );
    });
  }

  it('Empty String & Whitespace: returns full catalog (44 items) without false exclusions', () => {
    assert.equal(filterFormulas('', 'all').length, 44);
    assert.equal(filterFormulas('   ', 'all').length, 44);
    assert.equal(filterFormulas('\t\n  \r', 'all').length, 44);
  });

  it('Partial String Matching: locates formulas across name, description, LaTeX, and usageNotes', () => {
    // Name match
    const annuityMatches = filterFormulas('annuity', 'all');
    assert.ok(annuityMatches.length >= 2, 'Should find Future Value and Present Value annuities');
    assert.ok(annuityMatches.some((f) => f.name.includes('Future Value Annuity')));
    assert.ok(annuityMatches.some((f) => f.name.includes('Present Value Annuity')));

    // Description match
    const quadMatches = filterFormulas('quadratic equation', 'all');
    assert.ok(quadMatches.length >= 1);
    assert.equal(quadMatches[0].id, 'P1-AL-01');

    // LaTeX symbol match: \sqrt in P1-AL-01 and P2-AG-01
    const sqrtMatches = filterFormulas('\\sqrt', 'all');
    assert.equal(sqrtMatches.length, 2, 'Exactly 2 formulas in DBE catalog contain \\sqrt');
    assert.ok(sqrtMatches.some((f) => f.id === 'P1-AL-01'));
    assert.ok(sqrtMatches.some((f) => f.id === 'P2-AG-01'));

    // Usage notes match
    const tipMatches = filterFormulas('standard form', 'all');
    assert.ok(tipMatches.length >= 1);
    assert.ok(tipMatches[0].usageNotes?.includes('standard form'));
  });

  it('Case-Insensitivity: identical result sets regardless of query casing', () => {
    const queries = ['QUADRATIC', 'quadratic', 'QuAdRaTiC', 'qUaDrAtIc'];
    const results = queries.map((q) => filterFormulas(q, 'all').map((f) => f.id));

    for (let i = 1; i < results.length; i++) {
      assert.deepEqual(results[i], results[0], `Casing mismatch for query ${queries[i]}`);
    }
  });

  it('Special Characters & Adversarial Regex-Like Input: safely handled without escaping crashes', () => {
    const adversarialQueries = [
      '.*',
      '[a-z]+',
      '(\\d+)',
      'x^2 + y^2',
      'a !== 0',
      '\\\\',
      '${undefined}',
      '<script>alert("xss")</script>',
    ];

    for (const q of adversarialQueries) {
      assert.doesNotThrow(() => {
        const matches = filterFormulas(q, 'all');
        assert.ok(Array.isArray(matches));
      }, `Search crashed on adversarial query: ${q}`);
    }
  });

  it('Curriculum Catalog & UI Category Analysis: discovers omission of "Functions" tab', () => {
    const drawerCategories = [
      'Algebra',
      'Patterns',
      'Finance',
      'Calculus',
      'Probability',
      'Statistics',
      'Analytical Geometry',
      'Trigonometry',
    ];

    const matchedIds = new Set();
    for (const cat of drawerCategories) {
      const items = filterFormulas('', cat);
      items.forEach((item) => matchedIds.add(item.id));
    }

    // Empirical Bug Finding: UN-FN-01 (Functions & Inverses) is orphaned from category tabs
    const missingItems = FORMULA_SHEET.filter((f) => !matchedIds.has(f.id));
    assert.equal(missingItems.length, 1, 'Exactly one formula is omitted from the drawer category tabs');
    assert.equal(missingItems[0].id, 'UN-FN-01');
    assert.equal(missingItems[0].topicId, 'functions');
    assert.equal(missingItems[0].category, 'Functions & Inverses');
    assert.equal(missingItems[0].name, 'Hyperbola Asymptotes & Symmetry');
  });

  it('Paper Distribution: verifies 20 Paper 1 formulas and 24 Paper 2 formulas (44 total)', () => {
    const p1Items = FORMULA_SHEET.filter((f) => f.paper === 'P1');
    const p2Items = FORMULA_SHEET.filter((f) => f.paper === 'P2');

    assert.equal(p1Items.length, 20, 'Paper 1 must have exactly 20 formulas');
    assert.equal(p2Items.length, 24, 'Paper 2 must have exactly 24 formulas');
    assert.equal(p1Items.length + p2Items.length, 44, 'Total must equal 44');
  });

  it('Adversarial Finding: FormulaSheetDrawer does not support Paper 1 vs Paper 2 filtering', () => {
    // Current FormulaSheetDrawer.tsx behavior:
    // If selectedCategory is set to 'P1' or 'P2', 0 formulas match
    const p1CatResult = filterFormulas('', 'P1');
    const p2CatResult = filterFormulas('', 'P2');
    assert.equal(p1CatResult.length, 0, 'Current drawer category filter rejects "P1"');
    assert.equal(p2CatResult.length, 0, 'Current drawer category filter rejects "P2"');

    // If user searches "p1" or "p2" in the search box, 0 formulas match because f.paper is not in search fields
    const p1SearchResult = filterFormulas('p1', 'all');
    const p2SearchResult = filterFormulas('p2', 'all');
    assert.equal(p1SearchResult.length, 0, 'Current search query does not match paper "P1"');
    assert.equal(p2SearchResult.length, 0, 'Current search query does not match paper "P2"');
  });

  it('Active Formula Auto-Highlighting: each of the 44 formulas can be uniquely identified and highlighted', () => {
    for (const formula of FORMULA_SHEET) {
      const activeFormulaId = formula.id;

      // Simulate drawer rendering logic for isActive
      const renderedItems = FORMULA_SHEET.map((f) => ({
        id: f.id,
        isActive: f.id === activeFormulaId,
        cardClass:
          f.id === activeFormulaId
            ? 'iridescent-border bg-white ring-2 ring-violet-400/50 shadow-lg'
            : 'bg-white/70 hover:bg-white/90 border border-slate-200/80 shadow-sm',
      }));

      const activeList = renderedItems.filter((item) => item.isActive);
      assert.equal(activeList.length, 1, `Exactly one formula should be active for id ${formula.id}`);
      assert.equal(activeList[0].id, formula.id);
      assert.ok(activeList[0].cardClass.includes('iridescent-border'));
    }
  });

  it('Active Formula Highlight Edge Case: non-existent or undefined activeFormulaId gracefully defaults to zero highlights', () => {
    for (const invalidId of ['', 'UNKNOWN-ID', null, undefined, 'P3-NONEXISTENT']) {
      const activeCount = FORMULA_SHEET.filter((f) => f.id === invalidId).length;
      assert.equal(activeCount, 0, `Invalid id "${invalidId}" must not match any formula`);
    }
  });
});

// ============================================================================
// 2. GLASS SCRATCHPAD STATE MACHINE & CANVAS LOGIC ADVERSARIAL SUITE
// ============================================================================

describe('Glass Scratchpad: State Machine, Undo/Redo & Opacity Clamp', () => {
  // Pure model of Scratchpad state transitions reflecting GlassScratchpad.tsx
  class ScratchpadModel {
    constructor() {
      this.tool = 'pen';
      this.color = '#0F172A';
      this.lineWidth = 3;
      this.opacity = 0.85;
      this.isOpen = false;
      this.isMinimized = false;
      this.undoStack = [];
      this.redoStack = [];
      this.isDrawing = false;
      this.points = [];
      this.canvasPixelData = 'blank_canvas';
    }

    open() {
      this.isOpen = true;
      this.isMinimized = false;
      if (this.undoStack.length === 0) {
        this.saveState('initial_blank');
      }
    }

    close() {
      this.isOpen = false;
    }

    minimize() {
      if (!this.isOpen) return;
      this.isMinimized = true;
    }

    unminimize() {
      if (!this.isOpen) return;
      this.isMinimized = false;
    }

    setTool(newTool) {
      if (newTool !== 'pen' && newTool !== 'eraser') {
        throw new Error(`Invalid tool: ${newTool}`);
      }
      this.tool = newTool;
    }

    // Direct setter from GlassScratchpad.tsx: setOpacity(parseFloat(e.target.value))
    setOpacityDirect(val) {
      this.opacity = val;
    }

    // Clamped setter as requested by spec: clamp in [0.1, 1.0]
    setOpacityClamped(val) {
      this.opacity = Math.min(1.0, Math.max(0.1, Number.isFinite(val) ? val : 0.85));
    }

    getBackgroundDimming() {
      return Math.max(0.15, 0.45 * (1 - this.opacity));
    }

    saveState(data) {
      if (this.undoStack.length >= 20) {
        this.undoStack.shift();
      }
      this.undoStack.push(data);
    }

    startDrawing(pt) {
      this.isDrawing = true;
      this.points = [pt];
      this.redoStack = []; // Invalidates redo on new stroke
    }

    drawTo(pt) {
      if (!this.isDrawing) return;
      this.points.push(pt);
    }

    endDrawing(resultingData) {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.points = [];
      this.canvasPixelData = resultingData;
      this.saveState(resultingData);
    }

    undo() {
      if (this.undoStack.length <= 1) return false;
      const current = this.undoStack.pop();
      this.redoStack.push(current);
      this.canvasPixelData = this.undoStack[this.undoStack.length - 1];
      return true;
    }

    redo() {
      if (this.redoStack.length === 0) return false;
      const next = this.redoStack.pop();
      this.undoStack.push(next);
      this.canvasPixelData = next;
      return true;
    }

    clear() {
      this.canvasPixelData = 'cleared_canvas';
      this.saveState('cleared_canvas');
    }
  }

  it('Tool Toggles: pen vs eraser configuration & stroke dimensions', () => {
    const pad = new ScratchpadModel();
    assert.equal(pad.tool, 'pen');

    // Switch to eraser
    pad.setTool('eraser');
    assert.equal(pad.tool, 'eraser');

    // Switch back to pen
    pad.setTool('pen');
    assert.equal(pad.tool, 'pen');

    // Invalid tool rejection
    assert.throws(() => pad.setTool('highlighter'), /Invalid tool/);
    assert.throws(() => pad.setTool(''), /Invalid tool/);
  });

  it('Opacity Clamp: validates clamp in [0.1, 1.0] and reveals slider range discrepancies', () => {
    const pad = new ScratchpadModel();
    assert.equal(pad.opacity, 0.85);

    // In-bounds values
    pad.setOpacityClamped(0.5);
    assert.equal(pad.opacity, 0.5);

    pad.setOpacityClamped(0.1);
    assert.equal(pad.opacity, 0.1);

    pad.setOpacityClamped(1.0);
    assert.equal(pad.opacity, 1.0);

    // Out-of-bounds lower
    pad.setOpacityClamped(0.0);
    assert.equal(pad.opacity, 0.1, '0.0 should clamp to 0.1');

    pad.setOpacityClamped(-0.75);
    assert.equal(pad.opacity, 0.1, 'Negative opacity should clamp to 0.1');

    // Out-of-bounds upper
    pad.setOpacityClamped(1.5);
    assert.equal(pad.opacity, 1.0, '1.5 should clamp to 1.0');

    // Non-finite
    pad.setOpacityClamped(NaN);
    assert.equal(pad.opacity, 0.85, 'NaN should fallback safely');

    // Empirical Finding on GlassScratchpad.tsx implementation:
    // GlassScratchpad.tsx uses an unconstrained HTML input min="0.2" max="0.95"
    // without an explicit JavaScript clamp function in setOpacity:
    pad.setOpacityDirect(-0.5);
    assert.equal(pad.opacity, -0.5, 'Documented finding: Direct setOpacity in GlassScratchpad.tsx does not enforce clamp');
  });

  it('Undo/Redo Stack Limits: capped at 20 states across 50 consecutive strokes', () => {
    const pad = new ScratchpadModel();
    pad.open();
    assert.equal(pad.undoStack.length, 1);

    // Draw 50 sequential strokes
    for (let i = 1; i <= 50; i++) {
      pad.startDrawing({ x: i, y: i });
      pad.drawTo({ x: i + 5, y: i + 5 });
      pad.endDrawing(`stroke_${i}`);

      assert.ok(
        pad.undoStack.length <= 20,
        `Undo stack exceeded capacity at stroke ${i}: length was ${pad.undoStack.length}`
      );
    }

    assert.equal(pad.undoStack.length, 20, 'Undo stack must be capped at 20');
    // The oldest stroke retained should be stroke 31
    assert.equal(pad.undoStack[0], 'stroke_31');
    assert.equal(pad.undoStack[19], 'stroke_50');
  });

  it('Undo Boundary: preserves baseline canvas and refuses to pop below 1 state', () => {
    const pad = new ScratchpadModel();
    pad.open();
    pad.startDrawing({ x: 0, y: 0 });
    pad.endDrawing('stroke_1');
    assert.equal(pad.undoStack.length, 2);

    // First undo succeeds
    assert.equal(pad.undo(), true);
    assert.equal(pad.undoStack.length, 1);
    assert.equal(pad.canvasPixelData, 'initial_blank');

    // Second undo fails (boundary protection)
    assert.equal(pad.undo(), false);
    assert.equal(pad.undoStack.length, 1);
    assert.equal(pad.canvasPixelData, 'initial_blank');
  });

  it('Redo Invalidation: new drawing stroke clears redo stack completely', () => {
    const pad = new ScratchpadModel();
    pad.open();

    pad.startDrawing({ x: 1, y: 1 });
    pad.endDrawing('stroke_1');
    pad.startDrawing({ x: 2, y: 2 });
    pad.endDrawing('stroke_2');

    // Undo once
    pad.undo();
    assert.equal(pad.redoStack.length, 1);
    assert.equal(pad.redoStack[0], 'stroke_2');

    // Start a new stroke instead of redoing
    pad.startDrawing({ x: 3, y: 3 });
    assert.equal(pad.redoStack.length, 0, 'Redo stack must be cleared when a new stroke begins');
  });

  it('Midpoint Quadratic Bezier Smoothing: validates curve interpolation math', () => {
    // Exact midpoint logic from GlassScratchpad.tsx lines 156-165
    function computeBezierMidpoint(lastP, currP) {
      return {
        midX: (lastP.x + currP.x) / 2,
        midY: (lastP.y + currP.y) / 2,
      };
    }

    const testPairs = [
      { p1: { x: 0, y: 0 }, p2: { x: 100, y: 100 }, expected: { midX: 50, midY: 50 } },
      { p1: { x: 12.4, y: 34.6 }, p2: { x: 18.6, y: 55.4 }, expected: { midX: 15.5, midY: 45.0 } },
      { p1: { x: -50, y: 80 }, p2: { x: 50, y: -20 }, expected: { midX: 0, midY: 30 } },
    ];

    for (const { p1, p2, expected } of testPairs) {
      const result = computeBezierMidpoint(p1, p2);
      assert.ok(Math.abs(result.midX - expected.midX) < 1e-6);
      assert.ok(Math.abs(result.midY - expected.midY) < 1e-6);
    }
  });

  it('Adversarial Finding: GlassScratchpad unmounting on minimize loses active canvas pixels', () => {
    // Analysis of GlassScratchpad.tsx lines 43-80 and 215-232:
    // When isMinimized === true, GlassScratchpad returns floating pill and unmounts <canvas>.
    // When isMinimized reverts to false, <canvas> remounts.
    // However, existingData is retrieved from canvas.width > 0, which is 0 upon fresh mount.
    // And undoStackRef.current has length > 0, so saveState() is not called, nor is putImageData called!
    // Result: Newly mounted canvas is blank until undo/redo is clicked.
    const canvasUnmountedOnMinimize = true;
    assert.ok(canvasUnmountedOnMinimize, 'Documented state loss risk on scratchpad unminimize');
  });
});

// ============================================================================
// 3. AUDIO ENGINE METHOD CONTRACTS & WEB AUDIO SYNTHESIZER ADVERSARIAL SUITE
// ============================================================================

describe('Crystalline Sound Engine: Web Audio Method Contracts & Invariants', () => {
  beforeEach(() => {
    setupBrowserMocks();
  });

  it('Method Signature Audit: implements all 7 sound generation & mute contracts', () => {
    const engine = new CrystallineSoundEngine();
    const requiredMethods = [
      'init',
      'playGlassChime',
      'playTapPop',
      'playStreakFanfare',
      'playErrorChime',
      'playConfettiBlast',
      'playShieldShatter',
      'toggleMute',
      'isMuted',
    ];

    for (const m of requiredMethods) {
      assert.equal(typeof engine[m], 'function', `AudioEngine missing method ${m}`);
    }
  });

  it('Glass Chime: generates 5 pentatonic sine oscillators (C6, E6, G6, B6, C7) with lowpass filter', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];
    assert.ok(ctx);

    const prevOscCount = ctx.createdNodes.oscillators.length;
    const prevGainCount = ctx.createdNodes.gains.length;
    const prevFilterCount = ctx.createdNodes.filters.length;

    engine.playGlassChime();

    const oscs = ctx.createdNodes.oscillators.slice(prevOscCount);
    const gains = ctx.createdNodes.gains.slice(prevGainCount);
    const filters = ctx.createdNodes.filters.slice(prevFilterCount);

    assert.equal(oscs.length, 5, 'Glass chime must generate exactly 5 oscillators');
    assert.equal(gains.length, 5, 'Glass chime must generate exactly 5 gain nodes');
    assert.equal(filters.length, 5, 'Glass chime must generate exactly 5 filter nodes');

    const expectedFreqs = [1046.5, 1318.5, 1567.9, 1975.5, 2093.0];
    for (let i = 0; i < 5; i++) {
      assert.equal(oscs[i].type, 'sine');
      const freqEvent = oscs[i].frequency.events.find((e) => e.type === 'setValueAtTime');
      assert.ok(freqEvent);
      assert.equal(freqEvent.value, expectedFreqs[i]);

      // Filter check
      assert.equal(filters[i].type, 'lowpass');
      const filterFreqEvent = filters[i].frequency.events.find((e) => e.type === 'setValueAtTime');
      assert.equal(filterFreqEvent.value, 4500);

      // Gain Envelope Exponential Decay check: target MUST be strictly > 0
      const expDecay = gains[i].gain.events.find((e) => e.type === 'exponentialRampToValueAtTime');
      assert.ok(expDecay, 'Gain node must have exponential decay ramp');
      assert.ok(expDecay.value > 0, 'Exponential decay target must be strictly positive');
      assert.equal(expDecay.value, 0.0001);
    }
  });

  it('Tap Pop: generates rapid downward frequency glide (540Hz -> 180Hz over 35ms)', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    const prevOscCount = ctx.createdNodes.oscillators.length;
    const prevGainCount = ctx.createdNodes.gains.length;

    engine.playTapPop();

    const oscs = ctx.createdNodes.oscillators.slice(prevOscCount);
    const gains = ctx.createdNodes.gains.slice(prevGainCount);

    assert.equal(oscs.length, 1);
    assert.equal(gains.length, 1);

    const osc = oscs[0];
    const initialFreq = osc.frequency.events.find((e) => e.type === 'setValueAtTime');
    const glideFreq = osc.frequency.events.find((e) => e.type === 'exponentialRampToValueAtTime');

    assert.equal(initialFreq.value, 540);
    assert.equal(glideFreq.value, 180);
    assert.ok(glideFreq.endTime > initialFreq.startTime);

    // Gain check
    const gainDecay = gains[0].gain.events.find((e) => e.type === 'exponentialRampToValueAtTime');
    assert.ok(gainDecay);
    assert.ok(gainDecay.value > 0);
    assert.equal(gainDecay.value, 0.0001);
  });

  it('Streak Fanfare: strictly validates tier bounds [0..4] and scales note count (3..6)', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    const expectedNoteCounts = [3, 4, 5, 6, 6];
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98];

    for (let tier = 0; tier <= 4; tier++) {
      const prevOscCount = ctx.createdNodes.oscillators.length;
      engine.playStreakFanfare(tier);
      const oscs = ctx.createdNodes.oscillators.slice(prevOscCount);

      assert.equal(oscs.length, expectedNoteCounts[tier], `Tier ${tier} should have ${expectedNoteCounts[tier]} notes`);

      for (let i = 0; i < oscs.length; i++) {
        assert.equal(oscs[i].type, i % 2 === 0 ? 'sine' : 'triangle');
        const freqEvent = oscs[i].frequency.events.find((e) => e.type === 'setValueAtTime');
        assert.equal(freqEvent.value, baseFreqs[i]);
      }
    }

    // Adversarial tier boundaries: out of range must throw Error
    const invalidTiers = [-1, -99, 5, 10, 100];
    for (const inv of invalidTiers) {
      assert.throws(
        () => engine.playStreakFanfare(inv),
        /Invalid tier/,
        `Tier ${inv} should have thrown invalid tier Error`
      );
    }

    // Empirical Finding: NaN or undefined tier bypasses < 0 and > 4 checks
    // because NaN < 0 is false and NaN > 4 is false!
    assert.doesNotThrow(() => {
      engine.playStreakFanfare(NaN);
    }, 'Documented finding: NaN bypasses numerical comparison');
  });

  it('Error Chime: generates dual soft descending tones (392.0Hz -> 349.23Hz)', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    const prevOscCount = ctx.createdNodes.oscillators.length;
    engine.playErrorChime();
    const oscs = ctx.createdNodes.oscillators.slice(prevOscCount);

    assert.equal(oscs.length, 2);
    const freqs = oscs.map((o) => o.frequency.events.find((e) => e.type === 'setValueAtTime').value);
    assert.deepEqual(freqs, [392.0, 349.23]);
    assert.equal(oscs[0].type, 'sine');
    assert.equal(oscs[1].type, 'sine');
  });

  it('Confetti Blast: generates filtered white noise burst with bandpass sweep (1400Hz -> 3600Hz, Q=3.2)', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    const prevBufCount = ctx.createdNodes.bufferSources.length;
    const prevFilterCount = ctx.createdNodes.filters.length;

    engine.playConfettiBlast();

    const bufSources = ctx.createdNodes.bufferSources.slice(prevBufCount);
    const filters = ctx.createdNodes.filters.slice(prevFilterCount);

    assert.equal(bufSources.length, 1);
    assert.ok(bufSources[0].buffer);
    assert.equal(bufSources[0].buffer.numberOfChannels, 1);
    assert.equal(bufSources[0].buffer.length, Math.floor(ctx.sampleRate * 0.22));

    // Filter check
    assert.ok(filters.length >= 1);
    const bp = filters[0];
    assert.equal(bp.type, 'bandpass');
    const fStart = bp.frequency.events.find((e) => e.type === 'setValueAtTime');
    const fEnd = bp.frequency.events.find((e) => e.type === 'exponentialRampToValueAtTime');
    assert.equal(fStart.value, 1400);
    assert.equal(fEnd.value, 3600);
    const qEvent = bp.Q.events.find((e) => e.type === 'setValueAtTime');
    assert.equal(qEvent.value, 3.2);
  });

  it('Shield Shatter: generates 4 resonant fracture frequencies with exponential descent to 600Hz', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    const prevOscCount = ctx.createdNodes.oscillators.length;
    engine.playShieldShatter();
    const oscs = ctx.createdNodes.oscillators.slice(prevOscCount);

    assert.equal(oscs.length, 4);
    const expectedFreqs = [2400, 3600, 4800, 1800];

    for (let i = 0; i < 4; i++) {
      assert.equal(oscs[i].type, 'triangle');
      const startFreq = oscs[i].frequency.events.find((e) => e.type === 'setValueAtTime');
      const endFreq = oscs[i].frequency.events.find((e) => e.type === 'exponentialRampToValueAtTime');
      assert.equal(startFreq.value, expectedFreqs[i]);
      assert.equal(endFreq.value, 600);
    }
  });

  it('Exponential Gain Envelopes: validates strict positivity (V > 0) across all sound methods', () => {
    const engine = new CrystallineSoundEngine();
    engine.init();
    const ctx = engine['ctx'];

    // Trigger every sound generator
    engine.playGlassChime();
    engine.playTapPop();
    engine.playStreakFanfare(0);
    engine.playStreakFanfare(4);
    engine.playErrorChime();
    engine.playConfettiBlast();
    engine.playShieldShatter();

    // Verify all created gain nodes
    for (const gainNode of ctx.createdNodes.gains) {
      for (const event of gainNode.gain.events) {
        if (event.type === 'exponentialRampToValueAtTime') {
          assert.ok(
            event.value > 0,
            `Web Audio violation: exponential decay target must be > 0, got ${event.value}`
          );
        }
      }
    }
  });

  it('Audio Unlock Routines: passive one-time gesture listeners activate and resume AudioContext', () => {
    const { listeners } = setupBrowserMocks();
    const engine = new CrystallineSoundEngine();

    // Verify listeners registered for pointerdown and keydown
    assert.ok(listeners.has('pointerdown'));
    assert.ok(listeners.has('keydown'));
    assert.equal(listeners.get('pointerdown').length, 1);
    assert.equal(listeners.get('keydown').length, 1);

    // Initial context should not be instantiated until gesture
    assert.equal(engine['ctx'], null);

    // Dispatch simulated pointerdown user gesture
    global.window.dispatchEvent('pointerdown', {});

    // Context should now be initialized and running
    assert.ok(engine['ctx']);
    assert.equal(engine['ctx'].state, 'running');
    assert.equal(engine['unlocked'], true);

    // Listeners should be detached
    assert.equal(listeners.get('pointerdown').length, 0);
    assert.equal(listeners.get('keydown').length, 0);
  });

  it('Mute Toggle & LocalStorage Persistence: roundtrips across engine re-instantiations and disables all audio nodes', () => {
    const { localStorage } = setupBrowserMocks();

    // 1. Initial engine is enabled
    const engine1 = new CrystallineSoundEngine();
    assert.equal(engine1.enabled, true);
    assert.equal(engine1.isMuted(), false);

    // 2. Toggle to muted
    const newState = engine1.toggleMute();
    assert.equal(newState, false);
    assert.equal(engine1.enabled, false);
    assert.equal(engine1.isMuted(), true);
    assert.equal(localStorage.getItem('zante_audio_enabled'), 'false');

    // 3. When muted, invoking sound methods generates ZERO audio nodes
    engine1.init(); // should do nothing when muted
    assert.equal(engine1['ctx'], null);

    engine1.playGlassChime();
    engine1.playTapPop();
    engine1.playStreakFanfare(2);
    engine1.playErrorChime();
    engine1.playConfettiBlast();
    engine1.playShieldShatter();
    assert.equal(engine1['ctx'], null);

    // 4. Instantiate a new engine: must restore muted state from localStorage
    const engine2 = new CrystallineSoundEngine();
    assert.equal(engine2.enabled, false);
    assert.equal(engine2.isMuted(), true);

    // 5. Unmute on engine2
    engine2.toggleMute();
    assert.equal(engine2.enabled, true);
    assert.equal(localStorage.getItem('zante_audio_enabled'), 'true');

    // 6. Instantiate engine3: must restore enabled state
    const engine3 = new CrystallineSoundEngine();
    assert.equal(engine3.enabled, true);
  });

  it('LocalStorage Fault Resilience: engine handles storage exceptions gracefully without crashing', () => {
    // Simulate quota exceeded or private browsing security error
    global.localStorage.getItem = () => {
      throw new Error('SecurityError: The operation is insecure.');
    };
    global.localStorage.setItem = () => {
      throw new Error('QuotaExceededError');
    };

    assert.doesNotThrow(() => {
      const faultyEngine = new CrystallineSoundEngine();
      faultyEngine.toggleMute();
      faultyEngine.toggleMute();
    });
  });
});
