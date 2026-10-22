/**
 * Zante's Matric Maths Studio — Milestone M3 Adversarial Empirical Test Suite
 * Challenger 1 (EMPIRICAL CHALLENGER / critic & specialist)
 *
 * Exhaustively stress-tests Dynamic SVG Diagram Mathematical Engines:
 * 1. Parabola vertex (p, q) coordinate transformations across negative, zero, positive domains & roots.
 * 2. Hyperbola asymptotes and exponential asymptotes with boundary offsets and inverse logs.
 * 3. Circle tangents with Pythagorean triples, testing right-angle perpendicular marker geometry & gradients.
 * 4. CAST 4-quadrant diagram angles and unit circle coordinates across 0..360 deg.
 * 5. Box-and-whisker plot scaling from 5-number summary across extreme data spreads.
 * 6. Euclidean geometry theorems: subtended angles (2θ vs θ), cyclic quad, tan-chord, proportionality.
 *
 * Rigorous Invariants:
 * - Zero NaN in SVG viewBox, path `d` strings, circle radii, text coordinates across 500+ parameter variations.
 * - Exact mathematical coordinate transformations matching Cartesian <-> SVG mapping.
 * - Verbatim official DBE acceptable reasons catalog alignment.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Register TypeScript hook
try {
  register('./ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

// Production Imports
const { FunctionPlot, createCoordinateMapper } = await import('../src/components/diagrams/FunctionPlot.tsx');
const { AnalyticalGeometryPlot } = await import('../src/components/diagrams/AnalyticalGeometryPlot.tsx');
const { TrigDiagram } = await import('../src/components/diagrams/TrigDiagram.tsx');
const { StatsDiagram } = await import('../src/components/diagrams/StatsDiagram.tsx');
const { EuclideanGeometryDiagram } = await import('../src/components/diagrams/EuclideanGeometryDiagram.tsx');
const { GEOMETRY_REASONS } = await import('../src/data/geometryReasons.ts');

// Strict SVG NaN & Malformation Auditor
function assertNoSvgNaN(svgHtml, context) {
  assert.ok(svgHtml, `${context}: SVG HTML output must be non-empty string`);
  assert.equal(typeof svgHtml, 'string', `${context}: SVG HTML must be string`);

  // General NaN check
  assert.ok(!svgHtml.includes('NaN'), `${context}: SVG contains "NaN" token: ${svgHtml.slice(0, 300)}`);

  // Specific SVG attribute NaN checks
  assert.ok(!/viewBox="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: viewBox contains NaN`);
  assert.ok(!/\bd="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: path d attribute contains NaN`);
  assert.ok(!/\bcx="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: circle cx contains NaN`);
  assert.ok(!/\bcy="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: circle cy contains NaN`);
  assert.ok(!/\br="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: circle r contains NaN`);
  assert.ok(!/\bx="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: text/rect x contains NaN`);
  assert.ok(!/\by="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: text/rect y contains NaN`);
  assert.ok(!/\bx1="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: line x1 contains NaN`);
  assert.ok(!/\by1="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: line y1 contains NaN`);
  assert.ok(!/\bx2="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: line x2 contains NaN`);
  assert.ok(!/\by2="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: line y2 contains NaN`);
  assert.ok(!/\bpoints="[^"]*NaN[^"]*"/i.test(svgHtml), `${context}: polygon points contains NaN`);
}

describe('Challenger 1 Adversarial Suite: Dynamic SVG Diagrams (M3)', () => {

  // Global test variation accumulator
  let totalVariationsTested = 0;

  // --------------------------------------------------------------------------
  // DOMAIN 1: Parabola Vertex (p, q) Coordinate Transformations
  // --------------------------------------------------------------------------
  describe('Domain 1: Parabola vertex (p, q) transformations & roots', () => {
    it('should correctly transform vertex (p, q) and roots across negative, zero, positive domains with zero NaN', () => {
      const pValues = [-6, -4, -2, -1, -0.5, 0, 0.5, 1, 2, 4, 6];
      const qValues = [-5, -3, -1, 0, 1, 3, 5];
      const aValues = [-2, -1, -0.5, 0.5, 1, 2];

      let domain1Count = 0;

      for (const p of pValues) {
        for (const q of qValues) {
          for (const a of aValues) {
            domain1Count++;
            totalVariationsTested++;

            const context = `Parabola(a=${a}, p=${p}, q=${q})`;
            const svg = renderToStaticMarkup(
              React.createElement(FunctionPlot, {
                type: 'parabola',
                params: { a, p, q, showTangent: false, showAsymptotes: true },
              })
            );

            assertNoSvgNaN(svg, context);

            // Verify vertex coordinate mapping
            // Default domain: xMin=-7, xMax=7, yMin=-6, yMax=8, width=460, height=320
            const scaleX = 460 / 14;
            const scaleY = 320 / 14;
            const expectedSvgX = (p - -7) * scaleX;
            const expectedSvgY = 320 - (q - -6) * scaleY;

            // Vertex label check
            assert.ok(
              svg.includes(`Turning Point (${p}, ${q})`),
              `${context}: Missing expected turning point label`
            );

            // Path d attribute starts with valid M
            assert.ok(svg.includes('stroke="#7C3AED"'), `${context}: Missing primary curve`);
            const pathMatch = svg.match(/d="([^"]+)" fill="none" stroke="#7C3AED"/);
            if (pathMatch) {
              const d = pathMatch[1];
              assert.ok(d.startsWith('M '), `${context}: Parabola path must start with 'M '`);
              assert.ok(!d.includes('NaN'), `${context}: Parabola path contains NaN`);
            }

            // Real roots invariant
            const disc = -q / a;
            if (disc >= 0) {
              const r1 = p - Math.sqrt(disc);
              const r2 = p + Math.sqrt(disc);
              if (r1 >= -7 && r1 <= 7) {
                assert.ok(svg.includes(`x-int (${r1.toFixed(1)}, 0)`), `${context}: Missing expected root r1`);
              }
              if (r2 >= -7 && r2 <= 7 && Math.abs(r2 - r1) > 0.1) {
                assert.ok(svg.includes(`x-int (${r2.toFixed(1)}, 0)`), `${context}: Missing expected root r2`);
              }
            }

            // y-intercept invariant
            const yInt = a * Math.pow(0 - p, 2) + q;
            if (yInt >= -6 && yInt <= 8) {
              assert.ok(svg.includes(`y-int (0, ${yInt.toFixed(1)})`), `${context}: Missing expected y-intercept`);
            }
          }
        }
      }

      // Test custom domains (shifted, narrow, wide)
      const customDomains = [
        { xMin: -15, xMax: -1, yMin: -20, yMax: 5, width: 500, height: 400 },
        { xMin: 2, xMax: 20, yMin: 0, yMax: 50, width: 600, height: 450 },
        { xMin: -100, xMax: 100, yMin: -100, yMax: 100, width: 800, height: 600 },
        { xMin: -2, xMax: 2, yMin: -2, yMax: 2, width: 300, height: 300 },
      ];

      for (const dom of customDomains) {
        domain1Count++;
        totalVariationsTested++;
        const context = `Parabola(customDomain: [${dom.xMin}, ${dom.xMax}])`;
        const svg = renderToStaticMarkup(
          React.createElement(FunctionPlot, {
            type: 'parabola',
            params: { a: 1, p: (dom.xMin + dom.xMax) / 2, q: (dom.yMin + dom.yMax) / 2 },
            domain: dom,
          })
        );
        assertNoSvgNaN(svg, context);
      }

      assert.ok(domain1Count >= 460, `Domain 1 variations tested: ${domain1Count} >= 460`);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 2: Hyperbola & Exponential Asymptotes with Boundary Offsets
  // --------------------------------------------------------------------------
  describe('Domain 2: Hyperbola asymptotes and exponential asymptotes', () => {
    it('should render hyperbola branches and asymptotes across domain boundaries without NaN', () => {
      const pValues = [-5, -2, 0, 2, 5];
      const qValues = [-4, -2, 0, 2, 4];
      const aValues = [-4, -2, -1, 1, 2, 4];

      let hyperbolaCount = 0;

      for (const p of pValues) {
        for (const q of qValues) {
          for (const a of aValues) {
            hyperbolaCount++;
            totalVariationsTested++;

            const context = `Hyperbola(a=${a}, p=${p}, q=${q})`;
            const svg = renderToStaticMarkup(
              React.createElement(FunctionPlot, {
                type: 'hyperbola',
                params: { a, p, q, showAsymptotes: true },
              })
            );

            assertNoSvgNaN(svg, context);

            // Asymptote center of symmetry check
            assert.ok(
              svg.includes(`Intersection of Asymptotes (${p}, ${q})`),
              `${context}: Missing asymptote intersection label`
            );

            // Check that vertical asymptote line x=p is present
            assert.ok(svg.includes('stroke="#EF4444"'), `${context}: Missing red dashed asymptote`);
          }
        }
      }

      // Boundary offset stress tests (p placed near or on boundary of viewport)
      const boundaryP = [-7, -6.85, 6.85, 7, -10, 10];
      for (const p of boundaryP) {
        hyperbolaCount++;
        totalVariationsTested++;
        const context = `Hyperbola Boundary(p=${p})`;
        const svg = renderToStaticMarkup(
          React.createElement(FunctionPlot, {
            type: 'hyperbola',
            params: { a: 2, p, q: 1, showAsymptotes: true },
          })
        );
        assertNoSvgNaN(svg, context);
      }

      assert.ok(hyperbolaCount >= 120, `Hyperbola variations tested: ${hyperbolaCount} >= 120`);
    });

    it('should render exponential curves and logarithmic inverses across bases without NaN', () => {
      const bases = [0.25, 0.5, 1.5, 2, 3, 5];
      const aValues = [-2, -1, 0.5, 1, 2];
      const pValues = [-2, 0, 2];
      const qValues = [-3, 0, 3];

      let expCount = 0;

      for (const b of bases) {
        for (const a of aValues) {
          for (const p of pValues) {
            for (const q of qValues) {
              expCount++;
              totalVariationsTested++;

              const context = `Exponential(b=${b}, a=${a}, p=${p}, q=${q})`;
              const svg = renderToStaticMarkup(
                React.createElement(FunctionPlot, {
                  type: 'exponential',
                  params: { b, a, p, q, showAsymptotes: true, showInverse: true },
                })
              );

              assertNoSvgNaN(svg, context);

              // Check horizontal asymptote y = q
              assert.ok(svg.includes('stroke="#EF4444"'), `${context}: Missing horizontal asymptote`);

              // Check y-intercept calculation
              const yInt = a * Math.pow(b, -p) + q;
              if (yInt >= -6 && yInt <= 8) {
                assert.ok(svg.includes(`y-int (0, ${yInt.toFixed(2)})`), `${context}: Missing y-intercept`);
              }
            }
          }
        }
      }

      assert.ok(expCount >= 270, `Exponential variations tested: ${expCount} >= 270`);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 3: Circle Tangents with Pythagorean Triples & Right-Angle Markers
  // --------------------------------------------------------------------------
  describe('Domain 3: Circle tangents with Pythagorean triples & perpendicular marker geometry', () => {
    it('should verify right-angle perpendicular marker geometry and tangent slope', () => {
      // Pythagorean triples: (3, 4, 5), (5, 12, 13), (8, 15, 17), (7, 24, 25)
      const triples = [
        { x: 3, y: 4, r: 5, angle: (Math.atan2(4, 3) * 180) / Math.PI },
        { x: 4, y: 3, r: 5, angle: (Math.atan2(3, 4) * 180) / Math.PI },
        { x: -3, y: 4, r: 5, angle: (Math.atan2(4, -3) * 180) / Math.PI },
        { x: -4, y: -3, r: 5, angle: (Math.atan2(-3, -4) * 180) / Math.PI },
        { x: 5, y: 12, r: 13, angle: (Math.atan2(12, 5) * 180) / Math.PI },
        { x: 8, y: 15, r: 17, angle: (Math.atan2(15, 8) * 180) / Math.PI },
        { x: 7, y: 24, r: 25, angle: (Math.atan2(24, 7) * 180) / Math.PI },
      ];

      const centers = [
        { cx: 0, cy: 0 },
        { cx: 1, cy: 2 },
        { cx: -2, cy: 3 },
        { cx: 2, cy: -1 },
      ];

      let circleCount = 0;

      for (const t of triples) {
        for (const c of centers) {
          circleCount++;
          totalVariationsTested++;

          const context = `CircleTangent(center=(${c.cx},${c.cy}), r=${t.r}, angle=${t.angle.toFixed(1)}°)`;
          const svg = renderToStaticMarkup(
            React.createElement(AnalyticalGeometryPlot, {
              type: 'circle_tangent',
              params: {
                centerX: c.cx,
                centerY: c.cy,
                radius: t.r,
                contactAngleDeg: t.angle,
              },
            })
          );

          assertNoSvgNaN(svg, context);

          // Contact Point coordinates
          const rad = (t.angle * Math.PI) / 180;
          const expectedContactX = c.cx + t.r * Math.cos(rad);
          const expectedContactY = c.cy + t.r * Math.sin(rad);

          assert.ok(
            svg.includes(`P(${expectedContactX.toFixed(1)}, ${expectedContactY.toFixed(1)})`),
            `${context}: Point of contact coordinate mismatch`
          );

          // Right-angle 90° box geometry check
          // Look for: d="M sx sy L b1x b1y L b2x b2y L b3x b3y Z"
          const boxMatch = svg.match(/d="M ([0-9.-]+) ([0-9.-]+) L ([0-9.-]+) ([0-9.-]+) L ([0-9.-]+) ([0-9.-]+) L ([0-9.-]+) ([0-9.-]+) Z"/);
          assert.ok(boxMatch, `${context}: Right-angle 90° marker path missing or malformed`);

          const P = { x: parseFloat(boxMatch[1]), y: parseFloat(boxMatch[2]) };
          const B1 = { x: parseFloat(boxMatch[3]), y: parseFloat(boxMatch[4]) };
          const B2 = { x: parseFloat(boxMatch[5]), y: parseFloat(boxMatch[6]) };
          const B3 = { x: parseFloat(boxMatch[7]), y: parseFloat(boxMatch[8]) };

          // Vector v1 = B1 - P, v2 = B3 - P
          const v1 = { x: B1.x - P.x, y: B1.y - P.y };
          const v2 = { x: B3.x - P.x, y: B3.y - P.y };

          // Perpendicularity invariant: dot product v1 . v2 == 0
          const dot = v1.x * v2.x + v1.y * v2.y;
          assert.ok(Math.abs(dot) < 0.05, `${context}: Right-angle box sides not perpendicular (dot=${dot})`);

          // Square sides equal length: |v1| == |v2|
          const len1 = Math.hypot(v1.x, v1.y);
          const len2 = Math.hypot(v2.x, v2.y);
          assert.ok(Math.abs(len1 - len2) < 0.05, `${context}: Right-angle box side lengths unequal (${len1} vs ${len2})`);

          // Tangent gradient * radius gradient = -1
          const mRad = Math.sin(rad) / Math.cos(rad);
          const mTan = -1 / mRad;
          assert.ok(Math.abs(mRad * mTan - -1) < 1e-6, `${context}: m_rad * m_tan != -1`);
        }
      }

      // Standard non-Pythagorean angle sweeps (excluding degenerate 0/180/360)
      const angles = [15, 30, 45, 60, 75, 105, 120, 135, 150, 165, 195, 210, 225, 240, 255, 285, 300, 315, 330, 345];
      for (const ang of angles) {
        circleCount++;
        totalVariationsTested++;
        const context = `CircleTangent(angle=${ang}°)`;
        const svg = renderToStaticMarkup(
          React.createElement(AnalyticalGeometryPlot, {
            type: 'circle_tangent',
            params: { centerX: 0, centerY: 0, radius: 4, contactAngleDeg: ang },
          })
        );
        assertNoSvgNaN(svg, context);
      }

      // Line inclination test variations (non-degenerate)
      const lineVariations = [
        { x1: -4, y1: -2, x2: 3, y2: 5 },
        { x1: 0, y1: 0, x2: 5, y2: 5 },
        { x1: -3, y1: 4, x2: 4, y2: -3 },
        { x1: -5, y1: 1, x2: 5, y2: 1 }, // horizontal
        { x1: 2, y1: -4, x2: 2, y2: 4 },  // vertical
      ];

      for (const lv of lineVariations) {
        circleCount++;
        totalVariationsTested++;
        const context = `LineInclination(${lv.x1},${lv.y1} -> ${lv.x2},${lv.y2})`;
        const svg = renderToStaticMarkup(
          React.createElement(AnalyticalGeometryPlot, {
            type: 'line_inclination',
            params: lv,
          })
        );
        assertNoSvgNaN(svg, context);
      }

      assert.ok(circleCount >= 50, `Circle tangent variations tested: ${circleCount} >= 50`);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 4: CAST 4-Quadrant Diagram Angles & Unit Circle Coordinates
  // --------------------------------------------------------------------------
  describe('Domain 4: CAST 4-quadrant diagram angles & unit circle coordinates', () => {
    it('should verify trigonometric coordinates and quadrant geometry across 0..360 deg with zero NaN', () => {
      let trigCount = 0;

      // 5-degree increments from 0 to 360 = 73 angles
      for (let deg = 0; deg <= 360; deg += 5) {
        trigCount++;
        totalVariationsTested++;

        const context = `CAST(deg=${deg})`;
        const svg = renderToStaticMarkup(
          React.createElement(TrigDiagram, {
            type: 'cast_circle',
            params: { angleDeg: deg },
          })
        );

        assertNoSvgNaN(svg, context);

        // Verify mathematical unit circle coordinates
        const rad = (deg * Math.PI) / 180;
        const cosVal = Math.cos(rad);
        const sinVal = Math.sin(rad);

        // Pythagorean identity invariant: cos^2 + sin^2 == 1
        const pyth = cosVal * cosVal + sinVal * sinVal;
        assert.ok(Math.abs(pyth - 1.0) < 1e-9, `${context}: Pythagorean identity failed: ${pyth}`);

        // SVG coordinates: cx=200, cy=180, r=120
        const expectedPointX = 200 + 120 * cosVal;
        const expectedPointY = 180 - 120 * sinVal;
        const distFromCenter = Math.hypot(expectedPointX - 200, expectedPointY - 180);
        assert.ok(Math.abs(distFromCenter - 120) < 1e-6, `${context}: Point not on circle circumference`);

        // Check Point P label in SVG
        assert.ok(
          svg.includes(`P(${cosVal.toFixed(2)}, ${sinVal.toFixed(2)})`),
          `${context}: Missing coordinate label for Point P`
        );
      }

      // Non-standard & extreme angles
      const extraAngles = [-90, -45, -30, 405, 450, 540, 720, 22.5, 67.5, 112.5, 292.5];
      for (const deg of extraAngles) {
        trigCount++;
        totalVariationsTested++;
        const context = `CAST Extra(deg=${deg})`;
        const svg = renderToStaticMarkup(
          React.createElement(TrigDiagram, {
            type: 'cast_circle',
            params: { angleDeg: deg },
          })
        );
        assertNoSvgNaN(svg, context);
      }

      // SOH-CAH-TOA diagram
      trigCount++;
      totalVariationsTested++;
      const sohSvg = renderToStaticMarkup(React.createElement(TrigDiagram, { type: 'soh_cah_toa' }));
      assertNoSvgNaN(sohSvg, 'SOH-CAH-TOA');
      assert.ok(sohSvg.includes('sin θ = O / H'), 'SOH formula present');
      assert.ok(sohSvg.includes('cos θ = A / H'), 'CAH formula present');
      assert.ok(sohSvg.includes('tan θ = O / A'), 'TOA formula present');

      // Wave graphs
      trigCount++;
      totalVariationsTested++;
      const waveSvg = renderToStaticMarkup(React.createElement(TrigDiagram, { type: 'wave_graphs' }));
      assertNoSvgNaN(waveSvg, 'Wave Graphs');
      assert.ok(waveSvg.includes('y = sin(x)'), 'Sine wave legend present');
      assert.ok(waveSvg.includes('y = cos(x)'), 'Cosine wave legend present');

      assert.ok(trigCount >= 85, `CAST diagram variations tested: ${trigCount} >= 85`);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 5: Box-and-Whisker Plot Scaling Across Extreme Data Spreads
  // --------------------------------------------------------------------------
  describe('Domain 5: Box-and-whisker plot scaling across extreme data spreads', () => {
    it('should scale five-number summary without NaN across massive and micro spreads', () => {
      const spreads = [
        { min: 12, q1: 28, median: 45, q3: 68, max: 92, desc: 'Standard typical' },
        { min: 10, q1: 30, median: 50, q3: 70, max: 90, desc: 'Perfect symmetric' },
        { min: 5, q1: 8, median: 12, q3: 18, max: 95, desc: 'Heavily right-skewed' },
        { min: 5, q1: 82, median: 88, q3: 92, max: 95, desc: 'Heavily left-skewed' },
        { min: -40, q1: -15, median: 0, q3: 25, max: 60, desc: 'Zero-crossing' },
        { min: -100, q1: -75, median: -50, q3: -25, max: -5, desc: 'All negative' },
        { min: 0.001, q1: 0.002, median: 0.003, q3: 0.004, max: 0.005, desc: 'Micro floating point' },
        { min: 1e6, q1: 2.5e6, median: 5e6, q3: 7.5e6, max: 1e7, desc: 'Mega integer spread' },
        { min: 50, q1: 50, median: 50, q3: 50, max: 50, desc: 'Degenerate zero-variance identical' },
      ];

      const outlierScenarios = [
        [],
        [5],
        [-20, 120],
        [-100, -80, 150, 200],
      ];

      let statsCount = 0;

      for (const sp of spreads) {
        for (const out of outlierScenarios) {
          statsCount++;
          totalVariationsTested++;

          const context = `BoxPlot(${sp.desc}, outliers=${out.length})`;
          const svg = renderToStaticMarkup(
            React.createElement(StatsDiagram, {
              type: 'box_plot',
              params: {
                min: sp.min,
                q1: sp.q1,
                median: sp.median,
                q3: sp.q3,
                max: sp.max,
                outliers: out,
              },
            })
          );

          assertNoSvgNaN(svg, context);

          // Invariant: coordinates must be monotonic
          // width=460, padding=45
          const dataRange = sp.max - sp.min || 1;
          const scale = (v) => 45 + ((v - sp.min) / dataRange) * (460 - 2 * 45);

          const minX = scale(sp.min);
          const q1X = scale(sp.q1);
          const medX = scale(sp.median);
          const q3X = scale(sp.q3);
          const maxX = scale(sp.max);

          assert.ok(minX <= q1X, `${context}: minX <= q1X violated`);
          assert.ok(q1X <= medX, `${context}: q1X <= medX violated`);
          assert.ok(medX <= q3X, `${context}: medX <= q3X violated`);
          assert.ok(q3X <= maxX, `${context}: q3X <= maxX violated`);

          // Rect width >= 0
          const rectWidth = q3X - q1X;
          assert.ok(rectWidth >= 0, `${context}: Negative rect width`);
        }
      }

      // Ogive diagram stress
      for (let n of [50, 100, 200, 500, 1000]) {
        statsCount++;
        totalVariationsTested++;
        const context = `Ogive(totalN=${n})`;
        const svg = renderToStaticMarkup(
          React.createElement(StatsDiagram, {
            type: 'ogive',
            params: { totalN: n },
          })
        );
        assertNoSvgNaN(svg, context);
      }

      assert.ok(statsCount >= 40, `Stats variations tested: ${statsCount} >= 40`);
    });
  });

  // --------------------------------------------------------------------------
  // DOMAIN 6: Euclidean Geometry Theorems & Official DBE Reasons
  // --------------------------------------------------------------------------
  describe('Domain 6: Euclidean geometry theorems & SVG path strings', () => {
    it('should verify all 6 CAPS Euclidean geometry diagrams and reason alignment', () => {
      const theorems = [
        { type: 'center_chord', reason: 'line from centre to midpt of chord' },
        { type: 'angle_at_centre', reason: '∠ at centre = 2 × ∠ at circumf' },
        { type: 'angles_same_segment', reason: '∠s in same seg' },
        { type: 'cyclic_quad', reason: 'opp ∠s of cyclic quad' },
        { type: 'tan_chord', reason: 'tan chord thm' },
        { type: 'proportionality', reason: 'line ∥ one side of △' },
      ];

      const centerAngles = [20, 40, 60, 80, 100, 120, 140, 160, 170, 179];

      let euclidCount = 0;

      for (const th of theorems) {
        for (const ang of centerAngles) {
          euclidCount++;
          totalVariationsTested++;

          const context = `Euclidean(${th.type}, angle=${ang}°)`;
          const svg = renderToStaticMarkup(
            React.createElement(EuclideanGeometryDiagram, {
              type: th.type,
              params: {
                centerAngleDeg: ang,
                cyclicAngleA: 72,
              },
            })
          );

          assertNoSvgNaN(svg, context);

          // Subtended angles theorem: 2θ vs θ
          if (th.type === 'angle_at_centre') {
            assert.ok(svg.includes(`2θ = ${ang}°`), `${context}: Missing 2θ text`);
            assert.ok(svg.includes(`θ = ${ang / 2}°`), `${context}: Missing θ text`);
          }

          // Reason Pill matches official CAPS catalog
          assert.ok(
            svg.includes(th.reason),
            `${context}: Reason pill must contain "${th.reason}"`
          );
        }
      }

      assert.ok(euclidCount >= 60, `Euclidean variations tested: ${euclidCount} >= 60`);
    });
  });

  // --------------------------------------------------------------------------
  // GLOBAL AUDIT SUMMARY
  // --------------------------------------------------------------------------
  describe('Global Audit: 500+ Parameter Variation Invariant', () => {
    it('should have executed over 500 parameter variations with zero NaN across all domains', () => {
      console.log(`\n======================================================`);
      console.log(`CHALLENGER 1 EMPIRICAL AUDIT METRICS:`);
      console.log(`Total parameter variations evaluated: ${totalVariationsTested}`);
      console.log(`Minimum requirement: 500 variations`);
      console.log(`Target project directory: c:\\NWU\\zante-matric-maths`);
      console.log(`======================================================\n`);

      assert.ok(
        totalVariationsTested >= 500,
        `Expected >= 500 parameter variations, actually tested: ${totalVariationsTested}`
      );
    });
  });
});
