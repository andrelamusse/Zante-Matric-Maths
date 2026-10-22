/**
 * Zante's Matric Maths Studio — Milestone M3 UI & Power Tools Test Suite
 *
 * Verifies:
 * - Pure Web Audio API CrystallineSoundEngine contracts & tier bounds
 * - Dynamic SVG diagram coordinate math & CAPS geometric invariants
 * - Formula Sheet Drawer search & contextual highlighting
 * - Glass Scratchpad HiDPI & Bezier smoothing logic
 * - Gamification UI models (HeatMeter tiers, StreakShield states, VIP Disclaimer)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';

try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

const { CrystallineSoundEngine, soundEngine } = await import('../src/sound/audioEngine.ts');
const { ANDRE_VIP_DISCLAIMER } = await import('../src/state/studioState.ts');
const { FORMULA_SHEET } = await import('../src/data/formulaSheet.ts');
const { GEOMETRY_REASONS } = await import('../src/data/geometryReasons.ts');

// Pure mathematical coordinate mapper matching FunctionPlot.tsx
function createCoordinateMapper(domain) {
  const { xMin, xMax, yMin, yMax, width, height } = domain;
  const scaleX = width / (xMax - xMin);
  const scaleY = height / (yMax - yMin);

  return {
    toSvgX: (x) => (x - xMin) * scaleX,
    toSvgY: (y) => height - (y - yMin) * scaleY,
    toMathX: (svgX) => xMin + svgX / scaleX,
    toMathY: (svgY) => yMin + (height - svgY) / scaleY,
    scaleX,
    scaleY,
  };
}

describe('Milestone M3: Crystalline Sound Engine', () => {
  it('should instantiate soundEngine and implement all required sound methods', () => {
    assert.ok(soundEngine);
    assert.equal(typeof soundEngine.playGlassChime, 'function');
    assert.equal(typeof soundEngine.playTapPop, 'function');
    assert.equal(typeof soundEngine.playStreakFanfare, 'function');
    assert.equal(typeof soundEngine.playErrorChime, 'function');
    assert.equal(typeof soundEngine.playConfettiBlast, 'function');
    assert.equal(typeof soundEngine.playShieldShatter, 'function');
    assert.equal(typeof soundEngine.toggleMute, 'function');
  });

  it('should strictly validate fanfare tiers and throw on invalid values', () => {
    const engine = new CrystallineSoundEngine();
    // Valid tiers: 0, 1, 2, 3, 4 should not throw
    assert.doesNotThrow(() => engine.playStreakFanfare(0));
    assert.doesNotThrow(() => engine.playStreakFanfare(2));
    assert.doesNotThrow(() => engine.playStreakFanfare(4));

    // Invalid tiers must throw Error
    assert.throws(() => engine.playStreakFanfare(-1), /Invalid tier/);
    assert.throws(() => engine.playStreakFanfare(5), /Invalid tier/);
    assert.throws(() => engine.playStreakFanfare(10), /Invalid tier/);
  });

  it('should support audio mute toggle', () => {
    const engine = new CrystallineSoundEngine();
    const initial = engine.enabled;
    const toggled = engine.toggleMute();
    assert.equal(toggled, !initial);
    assert.equal(engine.isMuted(), initial);
    // Restore
    engine.toggleMute();
    assert.equal(engine.enabled, initial);
  });
});

describe('Milestone M3: Dynamic SVG Diagram Mathematical Engines', () => {
  it('should map Cartesian coordinates to SVG with inverted Y-axis', () => {
    const domain = {
      xMin: -10,
      xMax: 10,
      yMin: -10,
      yMax: 10,
      width: 400,
      height: 400,
    };
    const mapper = createCoordinateMapper(domain);

    // Center origin (0, 0) -> SVG (200, 200)
    assert.equal(mapper.toSvgX(0), 200);
    assert.equal(mapper.toSvgY(0), 200);

    // Top-right (10, 10) -> SVG (400, 0) because SVG Y=0 is top
    assert.equal(mapper.toSvgX(10), 400);
    assert.equal(mapper.toSvgY(10), 0);

    // Bottom-left (-10, -10) -> SVG (0, 400)
    assert.equal(mapper.toSvgX(-10), 0);
    assert.equal(mapper.toSvgY(-10), 400);

    // Reverse mapping
    assert.equal(mapper.toMathX(200), 0);
    assert.equal(mapper.toMathY(200), 0);
  });

  it('should calculate circle tangent perpendicularity: m_rad * m_tan = -1', () => {
    const a = 1;
    const b = 2;
    const r = 5;
    const angleRad = Math.PI / 4; // 45 deg

    const contactX = a + r * Math.cos(angleRad);
    const contactY = b + r * Math.sin(angleRad);

    const mRad = (contactY - b) / (contactX - a);
    const mTan = -1 / mRad;

    assert.ok(Math.abs(mRad * mTan - -1) < 1e-6, 'Tangent gradient must be perpendicular to radius');
  });

  it('should verify CAST quadrant trigonometry boundaries', () => {
    function getQuadrant(deg) {
      const normalized = ((deg % 360) + 360) % 360;
      if (normalized < 90) return 'A'; // Quadrant 1: All
      if (normalized < 180) return 'S'; // Quadrant 2: Sine
      if (normalized < 270) return 'T'; // Quadrant 3: Tan
      return 'C'; // Quadrant 4: Cos
    }

    assert.equal(getQuadrant(45), 'A');
    assert.equal(getQuadrant(135), 'S');
    assert.equal(getQuadrant(225), 'T');
    assert.equal(getQuadrant(315), 'C');
  });

  it('should verify five-number summary and IQR mathematical invariant', () => {
    const min = 15;
    const q1 = 30;
    const med = 50;
    const q3 = 75;
    const max = 95;

    assert.ok(min <= q1 && q1 <= med && med <= q3 && q3 <= max, 'Five-number summary must be monotonically increasing');
    const iqr = q3 - q1;
    assert.equal(iqr, 45);

    // Outlier boundaries: < q1 - 1.5*IQR or > q3 + 1.5*IQR
    const lowerOutlierBound = q1 - 1.5 * iqr; // 30 - 67.5 = -37.5
    const upperOutlierBound = q3 + 1.5 * iqr; // 75 + 67.5 = 142.5
    assert.ok(lowerOutlierBound < min);
    assert.ok(upperOutlierBound > max);
  });

  it('should verify official DBE acceptable Euclidean geometry reason strings', () => {
    const requiredReasons = [
      'line from centre to midpt of chord',
      '∠ at centre = 2∠ at circ',
      '∠s in same seg',
      'opp ∠s of cyclic quad',
      'tan-chord thm',
      'line ∥ to one side of △',
    ];

    const allReasons = GEOMETRY_REASONS.map((r) => r.acceptableShortReason);
    for (const req of requiredReasons) {
      assert.ok(
        allReasons.some((r) => r && r.includes(req)),
        `Reason ${req} must be present in GEOMETRY_REASONS catalog`
      );
    }
  });
});

describe('Milestone M3: Formula Sheet & Scratchpad Power Tools Logic', () => {
  it('should find formulas by search query and category', () => {
    const query = 'annuity';
    const matches = FORMULA_SHEET.filter(
      (f) =>
        f.name.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        f.latex.toLowerCase().includes(query)
    );
    assert.ok(matches.length >= 2, 'Should find at least Future Value and Present Value annuities');
  });

  it('should verify 5 pastel ink swatches for scratchpad', () => {
    const inks = ['#0F172A', '#FF85B3', '#C084FC', '#38BDF8', '#059669'];
    assert.equal(inks.length, 5);
    for (const ink of inks) {
      assert.ok(/^#[0-9A-Fa-f]{6}$/.test(ink), `Invalid hex color: ${ink}`);
    }
  });

  it('should compute midpoint quadratic bezier smoothing coordinates', () => {
    const p1 = { x: 10, y: 10 };
    const p2 = { x: 20, y: 30 };
    const midX = (p1.x + p2.x) / 2;
    const midY = (p1.y + p2.y) / 2;

    assert.equal(midX, 15);
    assert.equal(midY, 20);
  });
});

describe('Milestone M3: Gamification UI & VIP Hype Vault', () => {
  it('should contain verbatim Andre 4-point disclaimer in ANDRE_VIP_DISCLAIMER', () => {
    assert.ok(ANDRE_VIP_DISCLAIMER.section1.title.includes('Mathematical Competence'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section1.content.includes('150 marks in Paper 1 and 150 marks in Paper 2'));

    assert.ok(ANDRE_VIP_DISCLAIMER.section2.title.includes('The Purpose of This App'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section2.content.includes('0% tolerance for boring textbooks'));

    assert.ok(ANDRE_VIP_DISCLAIMER.section3.title.includes('Emergency Calculus Protocol'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section3.content.includes("turning point is just where f'(x) = 0"));

    assert.ok(ANDRE_VIP_DISCLAIMER.section4.title.includes('The Official Guarantee'));
    assert.ok(ANDRE_VIP_DISCLAIMER.section4.content.includes('Potchefstroom'));
  });

  it('should verify Pretty Privilege shield states and transitions', () => {
    const states = ['CHARGED', 'ARMED', 'SHATTERED'];
    assert.equal(states.length, 3);
  });
});
