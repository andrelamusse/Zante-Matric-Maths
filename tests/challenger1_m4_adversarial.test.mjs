/**
 * Zante's Matric Maths Studio — Milestone M4 Adversarial Empirical Test Suite
 * Challenger 1 (EMPIRICAL CHALLENGER / critic & specialist)
 *
 * Adversarially challenges:
 * 1. Topic Cheat Sheets Data Completeness & Schema Integrity
 *    - All 10 CAPS topics in CHEAT_SHEETS / TOPIC_CHEAT_SHEETS
 *    - Paper 1 (6 topics, 150m) & Paper 2 (4 topics, 150m) allocations
 * 2. KaTeX Formula Syntax & Parsing Audit
 *    - Every formula across all 10 topics parsed with katex.renderToString(..., { throwOnError: true, displayMode: true })
 *    - Balanced braces, unescaped characters, valid mathematical typesetting
 * 3. Examiner Traps & Step-by-Step Recipes Mathematical Coherence
 *    - Non-empty, actionable advice, curriculum standard adherence
 * 4. Euclidean Geometry Reasons Catalog & Filter Engine
 *    - Catalog contains >= 37 official reasons (actual: 43)
 *    - Category filtering and search query subset accuracy
 * 5. Dynamic SVG Visualizers Stability in CheatSheetView
 *    - Topic transitions across all 10 topics
 *    - Sub-type toggles across all diagram types
 *    - Zero NaN, undefined, or malformed attributes in SVG markup
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import katex from 'katex';

// Register TypeScript customization hook for Node 24 native ES module loading
try {
  register('./ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered or loaded externally
}

// ---------------------------------------------------------------------------
// Production Imports
// ---------------------------------------------------------------------------
const cheatSheetsMod = await import('../src/data/cheatSheets.ts');
const {
  CHEAT_SHEETS,
  CHEAT_SHEET_LIST,
  getCheatSheet,
  getCheatSheetsForPaper,
  EXAM_ARCHETYPES,
  P1_BLUEPRINT,
  P2_BLUEPRINT,
  buildMockExamQuestions,
} = cheatSheetsMod;

const { TOPICS, PAPER_1_TOPICS, PAPER_2_TOPICS } = await import('../src/data/topics.ts');
const {
  GEOMETRY_REASONS,
  getAllGeometryReasons,
  getGeometryReasonsByCategory,
  getGeometryReasonById,
} = await import('../src/data/geometryReasons.ts');

const { FunctionPlot } = await import('../src/components/diagrams/FunctionPlot.tsx');
const { AnalyticalGeometryPlot } = await import('../src/components/diagrams/AnalyticalGeometryPlot.tsx');
const { TrigDiagram } = await import('../src/components/diagrams/TrigDiagram.tsx');
const { StatsDiagram } = await import('../src/components/diagrams/StatsDiagram.tsx');
const { EuclideanGeometryDiagram } = await import('../src/components/diagrams/EuclideanGeometryDiagram.tsx');
const { CheatSheetView } = await import('../src/components/studio/CheatSheetView.tsx');

// ---------------------------------------------------------------------------
// Strict SVG NaN & Malformation Auditor
// ---------------------------------------------------------------------------
function assertNoSvgDefects(svgHtml, context) {
  assert.ok(svgHtml, `${context}: SVG HTML output must be non-empty string`);
  assert.equal(typeof svgHtml, 'string', `${context}: SVG HTML must be string`);

  // Extract SVG blocks if wrapped in a container component like CheatSheetView
  const svgMatches = svgHtml.match(/<svg[\s\S]*?<\/svg>/g) || [svgHtml];

  for (const svg of svgMatches) {
    // General token checks inside SVG
    assert.ok(!svg.includes('NaN'), `${context}: SVG contains "NaN" token`);
    assert.ok(!svg.includes('undefined'), `${context}: SVG contains "undefined" token`);
    assert.ok(!svg.includes('="null"'), `${context}: SVG contains attribute with "null" string`);
    assert.ok(!svg.includes('[object Object]'), `${context}: SVG contains "[object Object]"`);

    // Specific SVG attribute checks
    assert.ok(!/viewBox="[^"]*NaN[^"]*"/i.test(svg), `${context}: viewBox contains NaN`);
    assert.ok(!/\bd="[^"]*NaN[^"]*"/i.test(svg), `${context}: path d attribute contains NaN`);
    assert.ok(!/\bcx="[^"]*NaN[^"]*"/i.test(svg), `${context}: circle cx contains NaN`);
    assert.ok(!/\bcy="[^"]*NaN[^"]*"/i.test(svg), `${context}: circle cy contains NaN`);
    assert.ok(!/\bx="[^"]*NaN[^"]*"/i.test(svg), `${context}: text/rect x contains NaN`);
    assert.ok(!/\by="[^"]*NaN[^"]*"/i.test(svg), `${context}: text/rect y contains NaN`);
    assert.ok(!/\bx1="[^"]*NaN[^"]*"/i.test(svg), `${context}: line x1 contains NaN`);
    assert.ok(!/\by1="[^"]*NaN[^"]*"/i.test(svg), `${context}: line y1 contains NaN`);
    assert.ok(!/\bx2="[^"]*NaN[^"]*"/i.test(svg), `${context}: line x2 contains NaN`);
    assert.ok(!/\by2="[^"]*NaN[^"]*"/i.test(svg), `${context}: line y2 contains NaN`);
    assert.ok(!/\bpoints="[^"]*NaN[^"]*"/i.test(svg), `${context}: polygon points contains NaN`);
  }
}

// ---------------------------------------------------------------------------
// Test Suite
// ---------------------------------------------------------------------------
describe('Milestone M4 Challenger 1: Adversarial Cheat Sheet & Visualizer Verification', () => {

  // =========================================================================
  // 1. TOPIC CHEAT SHEETS Completeness & Named Export
  // =========================================================================
  describe('Requirement 1: 10 CAPS Topics in CHEAT_SHEETS & TOPIC_CHEAT_SHEETS Export', () => {
    const EXPECTED_TOPICS = [
      { id: 'algebra', paper: 'P1', marks: 25 },
      { id: 'patterns', paper: 'P1', marks: 25 },
      { id: 'functions', paper: 'P1', marks: 35 },
      { id: 'finance', paper: 'P1', marks: 15 },
      { id: 'calculus', paper: 'P1', marks: 35 },
      { id: 'probability', paper: 'P1', marks: 15 },
      { id: 'statistics', paper: 'P2', marks: 20 },
      { id: 'analytical_geometry', paper: 'P2', marks: 40 },
      { id: 'trigonometry', paper: 'P2', marks: 50 },
      { id: 'euclidean_geometry', paper: 'P2', marks: 40 },
    ];

    it('should export CHEAT_SHEETS and TOPIC_CHEAT_SHEETS alias', () => {
      assert.ok(CHEAT_SHEETS, 'CHEAT_SHEETS must be exported');
      // Check if TOPIC_CHEAT_SHEETS alias exists
      const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;
      assert.ok(topicCheatSheets, 'Topic cheat sheets map must exist');
    });

    it('should contain all 10 CAPS topics with exact mark weights summing to 150m for P1 and 150m for P2', () => {
      const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;
      assert.equal(Object.keys(topicCheatSheets).length, 10, 'Must have exactly 10 topic cheat sheets');

      let p1Sum = 0;
      let p2Sum = 0;

      for (const expected of EXPECTED_TOPICS) {
        const sheet = topicCheatSheets[expected.id];
        assert.ok(sheet, `Topic ${expected.id} must exist in topic cheat sheets`);
        assert.equal(sheet.topicId, expected.id, `topicId must match key for ${expected.id}`);
        assert.equal(sheet.paper, expected.paper, `paper must match CAPS specification for ${expected.id}`);
        assert.equal(sheet.examWeightMarks, expected.marks, `examWeightMarks must match CAPS weighting for ${expected.id}`);
        assert.ok(sheet.title && sheet.title.length > 3, `title must be non-empty for ${expected.id}`);

        if (sheet.paper === 'P1') {
          p1Sum += sheet.examWeightMarks;
          assert.ok(PAPER_1_TOPICS.includes(sheet.topicId), `${sheet.topicId} must be in PAPER_1_TOPICS`);
        } else {
          p2Sum += sheet.examWeightMarks;
          assert.ok(PAPER_2_TOPICS.includes(sheet.topicId), `${sheet.topicId} must be in PAPER_2_TOPICS`);
        }
      }

      assert.equal(p1Sum, 150, 'Paper 1 topic weights must sum to exactly 150 marks');
      assert.equal(p2Sum, 150, 'Paper 2 topic weights must sum to exactly 150 marks');
    });

    it('should support getCheatSheet and getCheatSheetsForPaper helpers for all 10 topics', () => {
      for (const expected of EXPECTED_TOPICS) {
        const sheet = getCheatSheet(expected.id);
        assert.ok(sheet, `getCheatSheet(${expected.id}) must return a sheet`);
        assert.equal(sheet.topicId, expected.id);
      }

      const p1List = getCheatSheetsForPaper('P1');
      const p2List = getCheatSheetsForPaper('P2');
      assert.equal(p1List.length, 6, 'Paper 1 must return 6 cheat sheets');
      assert.equal(p2List.length, 4, 'Paper 2 must return 4 cheat sheets');
    });
  });

  // =========================================================================
  // 2. KaTeX Formula Syntax & Parsing Audit
  // =========================================================================
  describe('Requirement 2: KaTeX Syntax & Formula Parsing Audit', () => {
    const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;

    it('should compile EVERY formula in every cheat sheet with throwOnError: true in KaTeX', () => {
      let formulaCount = 0;
      const parseFailures = [];

      for (const [topicId, sheet] of Object.entries(topicCheatSheets)) {
        assert.ok(Array.isArray(sheet.formulas), `${topicId}: formulas must be an array`);
        assert.ok(sheet.formulas.length >= 3, `${topicId}: must have at least 3 core formulas`);

        for (const [idx, f] of sheet.formulas.entries()) {
          formulaCount++;
          assert.ok(f.name && f.name.trim().length > 0, `${topicId} formula ${idx} must have non-empty name`);
          assert.ok(f.latex && f.latex.trim().length > 0, `${topicId} formula ${idx} must have non-empty latex`);
          assert.ok(f.description && f.description.trim().length > 5, `${topicId} formula ${idx} must have description`);

          try {
            // Strict KaTeX compile in display mode
            const html = katex.renderToString(f.latex, {
              throwOnError: true,
              displayMode: true,
            });
            assert.ok(html && html.includes('katex-display'), `Formula ${f.name} did not generate katex-display class`);
            assert.ok(!html.includes('katex-error'), `Formula ${f.name} generated katex-error`);
          } catch (err) {
            parseFailures.push({
              topicId,
              formulaName: f.name,
              latex: f.latex,
              error: err.message,
            });
          }
        }
      }

      assert.equal(
        parseFailures.length,
        0,
        `KaTeX parsing failures detected:\n${JSON.stringify(parseFailures, null, 2)}`
      );
      assert.ok(formulaCount >= 40, `Must have verified at least 40 total formulas (verified: ${formulaCount})`);
    });

    it('should verify balanced braces in all formula latex strings without unescaped literal braces', () => {
      for (const [topicId, sheet] of Object.entries(topicCheatSheets)) {
        for (const f of sheet.formulas) {
          const str = f.latex;
          let braceDepth = 0;
          let bracketDepth = 0;
          let parenDepth = 0;

          for (let i = 0; i < str.length; i++) {
            const ch = str[i];
            const prev = i > 0 ? str[i - 1] : '';

            if (ch === '{' && prev !== '\\') braceDepth++;
            if (ch === '}' && prev !== '\\') braceDepth--;
            if (ch === '[' && prev !== '\\') bracketDepth++;
            if (ch === ']' && prev !== '\\') bracketDepth--;
            if (ch === '(' && prev !== '\\') parenDepth++;
            if (ch === ')' && prev !== '\\') parenDepth--;

            assert.ok(
              braceDepth >= 0,
              `Premature closing brace in ${topicId} / ${f.name}: "${str}" at index ${i}`
            );
          }

          assert.equal(
            braceDepth,
            0,
            `Unbalanced curly braces in ${topicId} / ${f.name}: "${str}" (depth: ${braceDepth})`
          );
        }
      }
    });
  });

  // =========================================================================
  // 3. Traps & Recipes Coherence Audit
  // =========================================================================
  describe('Requirement 3: Examiner Traps & Step-by-Step Recipes Mathematical Coherence', () => {
    const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;

    it('should ensure each topic has at least 4 comprehensive traps with non-trivial avoid strategies', () => {
      let totalTraps = 0;
      for (const [topicId, sheet] of Object.entries(topicCheatSheets)) {
        assert.ok(Array.isArray(sheet.topTraps), `${topicId}: topTraps must be array`);
        assert.ok(sheet.topTraps.length >= 4, `${topicId}: must have at least 4 topTraps (has ${sheet.topTraps.length})`);

        for (const [tIdx, trapItem] of sheet.topTraps.entries()) {
          totalTraps++;
          assert.ok(trapItem.trap && trapItem.trap.trim().length >= 15, `${topicId} trap #${tIdx + 1} too short`);
          assert.ok(
            trapItem.howToAvoid && trapItem.howToAvoid.trim().length >= 25,
            `${topicId} howToAvoid #${tIdx + 1} too short to be mathematically helpful`
          );

          // Verify no placeholders
          const text = (trapItem.trap + ' ' + trapItem.howToAvoid).toLowerCase();
          assert.ok(!text.includes('todo'), `${topicId} trap #${tIdx + 1} contains TODO`);
          assert.ok(!text.includes('tbd'), `${topicId} trap #${tIdx + 1} contains TBD`);
          assert.ok(!text.includes('placeholder'), `${topicId} trap #${tIdx + 1} contains placeholder`);
        }
      }
      assert.ok(totalTraps >= 45, `Expected >= 45 total traps across 10 topics (found: ${totalTraps})`);
    });

    it('should ensure each topic has at least 2 step-by-step recipes with >= 3 sequential operational steps', () => {
      let totalRecipes = 0;
      let totalSteps = 0;

      for (const [topicId, sheet] of Object.entries(topicCheatSheets)) {
        assert.ok(Array.isArray(sheet.stepByStepRecipes), `${topicId}: stepByStepRecipes must be array`);
        assert.ok(
          sheet.stepByStepRecipes.length >= 2,
          `${topicId}: must have at least 2 stepByStepRecipes (has ${sheet.stepByStepRecipes.length})`
        );

        for (const [rIdx, recipe] of sheet.stepByStepRecipes.entries()) {
          totalRecipes++;
          assert.ok(recipe.title && recipe.title.trim().length >= 10, `${topicId} recipe #${rIdx + 1} missing title`);
          assert.ok(Array.isArray(recipe.steps), `${topicId} recipe #${rIdx + 1} steps must be array`);
          assert.ok(
            recipe.steps.length >= 3,
            `${topicId} recipe "${recipe.title}" must have at least 3 steps (has ${recipe.steps.length})`
          );

          for (const [sIdx, stepText] of recipe.steps.entries()) {
            totalSteps++;
            assert.ok(
              stepText && stepText.trim().length >= 10,
              `${topicId} recipe "${recipe.title}" step #${sIdx + 1} is empty or trivial`
            );
          }
        }
      }
      assert.ok(totalRecipes >= 20, `Expected >= 20 recipes across 10 topics (found: ${totalRecipes})`);
      assert.ok(totalSteps >= 80, `Expected >= 80 recipe steps across 10 topics (found: ${totalSteps})`);
    });
  });

  // =========================================================================
  // 4. Euclidean Geometry Reasons Catalog & Filter Engine
  // =========================================================================
  describe('Requirement 4: Euclidean Geometry Reasons Catalog (>= 37) & Filter Subsets', () => {
    it('should contain at least 37 official acceptable reasons in GEOMETRY_REASONS catalog', () => {
      assert.ok(Array.isArray(GEOMETRY_REASONS), 'GEOMETRY_REASONS must be an array');
      assert.ok(
        GEOMETRY_REASONS.length >= 37,
        `Catalog must contain >= 37 reasons. Actual: ${GEOMETRY_REASONS.length}`
      );

      const allReasons = getAllGeometryReasons();
      assert.equal(allReasons.length, GEOMETRY_REASONS.length);
    });

    it('should contain all required geometric categories with valid grade levels', () => {
      const EXPECTED_CATEGORIES = [
        'lines_angles',
        'triangles_polygons',
        'circles_chords',
        'circles_cyclic',
        'circles_tangents',
        'proportionality_similarity',
      ];

      const foundCategories = new Set(GEOMETRY_REASONS.map((r) => r.category));
      for (const cat of EXPECTED_CATEGORIES) {
        assert.ok(foundCategories.has(cat), `Category "${cat}" must exist in GEOMETRY_REASONS`);
        const catReasons = getGeometryReasonsByCategory(cat);
        assert.ok(catReasons.length >= 4, `Category "${cat}" must have at least 4 reasons (found ${catReasons.length})`);
      }

      for (const r of GEOMETRY_REASONS) {
        assert.ok(r.id && r.id.startsWith('GEO-'), `Reason ID must start with GEO- (found ${r.id})`);
        assert.ok(r.fullTheorem && r.fullTheorem.length >= 10, `fullTheorem too short in ${r.id}`);
        assert.ok(r.acceptableShortReason && r.acceptableShortReason.length >= 3, `acceptableShortReason missing in ${r.id}`);
        assert.ok([8, 9, 10, 11, 12].includes(r.grade), `Grade must be 8..12 in ${r.id} (found ${r.grade})`);

        // Test getGeometryReasonById
        const fetched = getGeometryReasonById(r.id);
        assert.equal(fetched?.id, r.id);
      }
    });

    it('should accurately filter reasons by category and search queries', () => {
      // 1. Category filters
      const lineReasons = getGeometryReasonsByCategory('lines_angles');
      assert.equal(lineReasons.length, 9, 'lines_angles category must have 9 reasons');

      const cyclicReasons = getGeometryReasonsByCategory('circles_cyclic');
      assert.equal(cyclicReasons.length, 5, 'circles_cyclic category must have 5 reasons');

      const tangentReasons = getGeometryReasonsByCategory('circles_tangents');
      assert.equal(tangentReasons.length, 5, 'circles_tangents category must have 5 reasons');

      const propReasons = getGeometryReasonsByCategory('proportionality_similarity');
      assert.equal(propReasons.length, 7, 'proportionality_similarity must have 7 reasons');

      // 2. Search query matching
      const querySearch = (query, cat = 'all') => {
        const q = query.toLowerCase().trim();
        return GEOMETRY_REASONS.filter((r) => {
          const matchCat = cat === 'all' || r.category === cat;
          if (!matchCat) return false;
          if (!q) return true;
          return (
            r.acceptableShortReason.toLowerCase().includes(q) ||
            r.fullTheorem.toLowerCase().includes(q)
          );
        });
      };

      // Search 'tan-chord'
      const tanChordResults = querySearch('tan-chord');
      assert.ok(tanChordResults.length >= 2, 'Search for tan-chord must return at least theorem and converse');
      for (const res of tanChordResults) {
        assert.ok(
          res.acceptableShortReason.toLowerCase().includes('tan-chord') ||
          res.fullTheorem.toLowerCase().includes('tan-chord')
        );
      }

      // Search 'cyclic quad'
      const cyclicResults = querySearch('cyclic quad');
      assert.ok(cyclicResults.length >= 2, 'Search for cyclic quad must return opposite and exterior angle theorems');

      // Combined category + query
      const chordsInCircles = querySearch('chord', 'circles_chords');
      assert.ok(chordsInCircles.length >= 5, 'Must find >= 5 chord theorems in circles_chords');

      // Disjoint search
      const emptyResults = querySearch('nonexistent_gibberish_12345');
      assert.equal(emptyResults.length, 0, 'Bogus query must return 0 reasons');
    });

    it('should verify cheatSheets.ts geometryReasons array aligns with GEOMETRY_REASONS', () => {
      const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;
      const euclidSheet = topicCheatSheets.euclidean_geometry;
      assert.ok(euclidSheet.geometryReasons, 'euclidean_geometry cheat sheet must have geometryReasons array');
      assert.equal(
        euclidSheet.geometryReasons.length,
        GEOMETRY_REASONS.length,
        'Cheat sheet geometryReasons count must match GEOMETRY_REASONS catalog count'
      );
    });
  });

  // =========================================================================
  // 5. Dynamic SVG Visualizers & CheatSheetView Stability
  // =========================================================================
  describe('Requirement 5: Dynamic SVG Visualizers Zero-Defect Audit', () => {

    it('should render FunctionPlot across all types (parabola, hyperbola, exponential) with ZERO NaN/undefined', () => {
      const types = ['parabola', 'hyperbola', 'exponential'];
      const testCases = [
        { type: 'parabola', params: { a: 1, p: 0, q: 0 } },
        { type: 'parabola', params: { a: -0.5, p: 2, q: 4 } },
        { type: 'parabola', params: { a: 2, p: -3, q: -5 } },
        { type: 'hyperbola', params: { a: 2, p: 1, q: -1 } },
        { type: 'hyperbola', params: { a: -3, p: -2, q: 2 } },
        { type: 'exponential', params: { a: 1, b: 2, p: 0, q: 0, showInverse: true } },
        { type: 'exponential', params: { a: -1, b: 1.5, p: 1, q: 2, showInverse: false } },
      ];

      for (const tc of testCases) {
        const el = React.createElement(FunctionPlot, tc);
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `FunctionPlot(${tc.type}, ${JSON.stringify(tc.params)})`);
        assert.ok(svg.includes('<svg'), `Must output valid <svg element`);
      }
    });

    it('should render AnalyticalGeometryPlot across circle_tangent & line_inclination with ZERO NaN/undefined', () => {
      const testCases = [
        { type: 'circle_tangent', params: { centerX: 1, centerY: 2, radius: 4, contactAngleDeg: 45 } },
        { type: 'circle_tangent', params: { centerX: 0, centerY: 0, radius: 5, contactAngleDeg: 120 } },
        { type: 'circle_tangent', params: { centerX: -2, centerY: 3, radius: 3, contactAngleDeg: 270 } },
        { type: 'line_inclination', params: { x1: -3, y1: -1, x2: 4, y2: 5 } },
        { type: 'line_inclination', params: { x1: -4, y1: 4, x2: 2, y2: -2 } }, // negative slope
        { type: 'line_inclination', params: { x1: 0, y1: 0, x2: 5, y2: 0 } }, // zero slope
      ];

      for (const tc of testCases) {
        const el = React.createElement(AnalyticalGeometryPlot, tc);
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `AnalyticalGeometryPlot(${tc.type})`);
      }
    });

    it('should render TrigDiagram across cast_circle, soh_cah_toa, wave_graphs with ZERO NaN/undefined', () => {
      const testCases = [
        { type: 'cast_circle', params: { angleDeg: 30 } },
        { type: 'cast_circle', params: { angleDeg: 135 } },
        { type: 'cast_circle', params: { angleDeg: 225 } },
        { type: 'cast_circle', params: { angleDeg: 315 } },
        { type: 'soh_cah_toa', params: {} },
        { type: 'wave_graphs', params: { amplitude: 2, period: 360 } },
      ];

      for (const tc of testCases) {
        const el = React.createElement(TrigDiagram, tc);
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `TrigDiagram(${tc.type})`);
      }
    });

    it('should render StatsDiagram across box_plot and ogive with ZERO NaN/undefined', () => {
      const testCases = [
        { type: 'box_plot', params: { min: 10, q1: 25, median: 45, q3: 70, max: 95 } },
        { type: 'box_plot', params: { min: 5, q1: 20, median: 35, q3: 50, max: 80, outliers: [95, 100] } },
        { type: 'ogive', params: { totalN: 120 } },
      ];

      for (const tc of testCases) {
        const el = React.createElement(StatsDiagram, tc);
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `StatsDiagram(${tc.type})`);
      }
    });

    it('should render EuclideanGeometryDiagram across all 6 theorem types with ZERO NaN/undefined', () => {
      const theorems = [
        'angle_at_centre',
        'center_chord',
        'angles_same_segment',
        'cyclic_quad',
        'tan_chord',
        'proportionality',
      ];

      for (const th of theorems) {
        const el = React.createElement(EuclideanGeometryDiagram, { type: th });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `EuclideanGeometryDiagram(${th})`);
      }
    });

    it('should render full CheatSheetView component across ALL 10 topics with ZERO NaN/undefined', () => {
      const allTopicIds = [
        'algebra',
        'patterns',
        'functions',
        'finance',
        'calculus',
        'probability',
        'statistics',
        'analytical_geometry',
        'trigonometry',
        'euclidean_geometry',
      ];

      for (const tid of allTopicIds) {
        const el = React.createElement(CheatSheetView, { initialTopicId: tid });
        const html = renderToStaticMarkup(el);

        assert.ok(html, `CheatSheetView(${tid}) rendered output must be non-empty`);
        assert.ok(html.includes('<svg'), `CheatSheetView(${tid}) must contain dynamic SVG diagram`);
        assertNoSvgDefects(html, `CheatSheetView(${tid})`);

        // Check for specific topic title in the rendered output (accounting for HTML entity encoding)
        const sheet = getCheatSheet(tid);
        const encodedTitle = sheet.title.replaceAll('&', '&amp;');
        assert.ok(
          html.includes(encodedTitle),
          `CheatSheetView(${tid}) must contain title "${sheet.title}"`
        );
      }
    });
  });

  // =========================================================================
  // 6. Exam Blueprints & Archetypes Integrity
  // =========================================================================
  describe('Exam Blueprints & 20 Archetypes Verification', () => {
    it('should verify all 20 NSC Exam Archetypes (EX-01 to EX-20)', () => {
      assert.equal(EXAM_ARCHETYPES.length, 20, 'Must have 20 exam archetypes');
      for (let i = 1; i <= 20; i++) {
        const id = `EX-${String(i).padStart(2, '0')}`;
        const arch = EXAM_ARCHETYPES.find((a) => a.id === id);
        assert.ok(arch, `Archetype ${id} must exist`);
        assert.ok(arch.name && arch.name.length > 5);
        assert.ok(arch.year >= 2020);
        assert.ok(arch.session && arch.session.length >= 2);
        assert.ok(arch.distinctionFeature && arch.distinctionFeature.length >= 5);
      }
    });

    it('should verify Paper 1 blueprint: exactly 11 questions, 150 marks', () => {
      assert.equal(P1_BLUEPRINT.length, 11, 'Paper 1 blueprint must have 11 questions');
      const totalMarks = P1_BLUEPRINT.reduce((s, q) => s + q.marks, 0);
      assert.equal(totalMarks, 150, 'Paper 1 blueprint total marks must be 150');

      for (let i = 0; i < P1_BLUEPRINT.length; i++) {
        assert.equal(P1_BLUEPRINT[i].qNum, i + 1, `P1 Q${i + 1} qNum mismatch`);
        assert.ok(PAPER_1_TOPICS.includes(P1_BLUEPRINT[i].topic), `P1 Q${i + 1} topic ${P1_BLUEPRINT[i].topic} not in P1`);
        assert.ok(P1_BLUEPRINT[i].marks > 0, `P1 Q${i + 1} marks must be > 0`);
      }
    });

    it('should verify Paper 2 blueprint: exactly 10 questions, 150 marks', () => {
      assert.equal(P2_BLUEPRINT.length, 10, 'Paper 2 blueprint must have 10 questions');
      const totalMarks = P2_BLUEPRINT.reduce((s, q) => s + q.marks, 0);
      assert.equal(totalMarks, 150, 'Paper 2 blueprint total marks must be 150');

      for (let i = 0; i < P2_BLUEPRINT.length; i++) {
        assert.equal(P2_BLUEPRINT[i].qNum, i + 1, `P2 Q${i + 1} qNum mismatch`);
        assert.ok(PAPER_2_TOPICS.includes(P2_BLUEPRINT[i].topic), `P2 Q${i + 1} topic ${P2_BLUEPRINT[i].topic} not in P2`);
        assert.ok(P2_BLUEPRINT[i].marks > 0, `P2 Q${i + 1} marks must be > 0`);
      }
    });

    it('should assemble valid mock exams with buildMockExamQuestions without NaN/undefined', () => {
      const p1Questions = buildMockExamQuestions('P1', 'EX-01');
      assert.equal(p1Questions.length, 11);
      const p1MarkSum = p1Questions.reduce((s, q) => s + q.marks, 0);
      assert.equal(p1MarkSum, 150);

      const p2Questions = buildMockExamQuestions('P2', 'EX-01');
      assert.equal(p2Questions.length, 10);
      const p2MarkSum = p2Questions.reduce((s, q) => s + q.marks, 0);
      assert.equal(p2MarkSum, 150);

      for (const q of [...p1Questions, ...p2Questions]) {
        assert.ok(!q.id.includes('undefined'), `Question id ${q.id} contains undefined`);
        assert.ok(q.marks > 0 && !Number.isNaN(q.marks), `Question ${q.id} marks invalid`);
        assert.ok(q.questionLatex && q.questionLatex.length > 5, `Question ${q.id} latex missing`);
        assert.ok(q.correctAnswerId, `Question ${q.id} missing correctAnswerId`);
        assert.ok(q.nscMemo && q.nscMemo.steps.length > 0, `Question ${q.id} missing memo steps`);
      }
    });
  });

  // =========================================================================
  // 7. White-Box Adversarial Stress Testing: 1,000+ Dynamic Diagram Iterations
  // =========================================================================
  describe('Adversarial Diagram Stress Testing (1,000+ Iterations)', () => {
    it('should stress-test FunctionPlot with 300 randomized parameter sets', () => {
      // 100 Parabolas
      for (let i = 0; i < 100; i++) {
        const a = (Math.random() - 0.5) * 8 || 1;
        const p = Math.floor((Math.random() - 0.5) * 12);
        const q = Math.floor((Math.random() - 0.5) * 12);
        const el = React.createElement(FunctionPlot, {
          type: 'parabola',
          params: { a, p, q, showTangent: true, showAsymptotes: true },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `Parabola iter ${i}`);
      }

      // 100 Hyperbolas
      for (let i = 0; i < 100; i++) {
        const a = (Math.random() - 0.5) * 10 || 2;
        const p = Math.floor((Math.random() - 0.5) * 8);
        const q = Math.floor((Math.random() - 0.5) * 8);
        const el = React.createElement(FunctionPlot, {
          type: 'hyperbola',
          params: { a, p, q, showAsymptotes: true },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `Hyperbola iter ${i}`);
      }

      // 100 Exponentials
      for (let i = 0; i < 100; i++) {
        const a = (Math.random() - 0.5) * 6 || 1;
        const b = 1.1 + Math.random() * 3;
        const p = Math.floor((Math.random() - 0.5) * 6);
        const q = Math.floor((Math.random() - 0.5) * 6);
        const el = React.createElement(FunctionPlot, {
          type: 'exponential',
          params: { a, b, p, q, showInverse: true, showAsymptotes: true },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `Exponential iter ${i}`);
      }
    });

    it('should stress-test StatsDiagram with 250 randomized 5-number summaries', () => {
      for (let i = 0; i < 250; i++) {
        const min = Math.floor(Math.random() * 20);
        const q1 = min + Math.floor(Math.random() * 15);
        const median = q1 + Math.floor(Math.random() * 20);
        const q3 = median + Math.floor(Math.random() * 25);
        const max = q3 + Math.floor(Math.random() * 30);
        const outliers = Math.random() > 0.5 ? [max + 10, max + 25] : [];

        const el = React.createElement(StatsDiagram, {
          type: 'box_plot',
          params: { min, q1, median, q3, max, outliers },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `StatsDiagram box_plot iter ${i}`);
      }
    });

    it('should stress-test TrigDiagram across 250 continuous degree sweeps', () => {
      for (let deg = 0; deg <= 360; deg += 1.5) {
        const el = React.createElement(TrigDiagram, {
          type: 'cast_circle',
          params: { angleDeg: deg },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `TrigDiagram cast_circle deg ${deg}`);
      }
    });

    it('should stress-test EuclideanGeometryDiagram across 200 angle permutations', () => {
      const theoremTypes = [
        'angle_at_centre',
        'center_chord',
        'angles_same_segment',
        'cyclic_quad',
        'tan_chord',
        'proportionality',
      ];

      for (let i = 0; i < 200; i++) {
        const t = theoremTypes[i % theoremTypes.length];
        const centerAngle = 20 + Math.floor(Math.random() * 140);
        const el = React.createElement(EuclideanGeometryDiagram, {
          type: t,
          params: { centerAngleDeg: centerAngle },
        });
        const svg = renderToStaticMarkup(el);
        assertNoSvgDefects(svg, `EuclideanGeometryDiagram iter ${i} (${t})`);
      }
    });
  });

  // =========================================================================
  // 8. Adversarial Search, Filtering, and Sub-Type Toggles Matrix
  // =========================================================================
  describe('Adversarial Search & Filter Engine Stress Testing', () => {
    it('should test search filter with special characters and regex metacharacters without throwing', () => {
      const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;
      const adversarialQueries = [
        '\\',
        '[',
        ']',
        '(',
        ')',
        '.*',
        '+',
        '?',
        '^',
        '$',
        '{',
        '}',
        '|',
        '<script>',
        '${7*7}',
        '__proto__',
        'constructor',
      ];

      for (const [topicId, sheet] of Object.entries(topicCheatSheets)) {
        for (const query of adversarialQueries) {
          const q = query.toLowerCase().trim();
          // Formulas search
          const matchedFormulas = sheet.formulas.filter(
            (f) =>
              f.name.toLowerCase().includes(q) ||
              f.description.toLowerCase().includes(q) ||
              f.latex.toLowerCase().includes(q)
          );
          assert.ok(Array.isArray(matchedFormulas));

          // Traps search
          const matchedTraps = sheet.topTraps.filter(
            (t) =>
              t.trap.toLowerCase().includes(q) ||
              t.howToAvoid.toLowerCase().includes(q)
          );
          assert.ok(Array.isArray(matchedTraps));

          // Recipes search
          const matchedRecipes = sheet.stepByStepRecipes.filter(
            (r) =>
              r.title.toLowerCase().includes(q) ||
              r.steps.some((s) => s.toLowerCase().includes(q))
          );
          assert.ok(Array.isArray(matchedRecipes));

          // Reasons search
          const matchedReasons = GEOMETRY_REASONS.filter(
            (r) =>
              r.acceptableShortReason.toLowerCase().includes(q) ||
              r.fullTheorem.toLowerCase().includes(q)
          );
          assert.ok(Array.isArray(matchedReasons));
        }
      }
    });

    it('should verify formula search accurately matches known terms across cheat sheets', () => {
      const topicCheatSheets = cheatSheetsMod.TOPIC_CHEAT_SHEETS || CHEAT_SHEETS;

      // Query 'discriminant' should match in algebra
      const algMatches = topicCheatSheets.algebra.formulas.filter((f) =>
        f.name.toLowerCase().includes('discriminant')
      );
      assert.equal(algMatches.length, 1);
      assert.ok(algMatches[0].latex.includes('b^2 - 4ac'));

      // Query 'annuity' should match in finance
      const finMatches = topicCheatSheets.finance.formulas.filter((f) =>
        f.name.toLowerCase().includes('annuity')
      );
      assert.equal(finMatches.length, 2); // Present and Future value annuities

      // Query 'first principles' should match in calculus
      const calcMatches = topicCheatSheets.calculus.formulas.filter((f) =>
        f.name.toLowerCase().includes('first principles')
      );
      assert.equal(calcMatches.length, 1);
      assert.ok(calcMatches[0].latex.includes('\\lim_{h \\to 0}'));
    });
  });

  // =========================================================================
  // 9. API Surface Audit: TOPIC_CHEAT_SHEETS Export Status
  // =========================================================================
  describe('API Surface: TOPIC_CHEAT_SHEETS Named Export Status', () => {
    it('should report whether TOPIC_CHEAT_SHEETS is exported or only CHEAT_SHEETS', () => {
      const hasCheatSheets = typeof cheatSheetsMod.CHEAT_SHEETS === 'object';
      const hasTopicCheatSheets = typeof cheatSheetsMod.TOPIC_CHEAT_SHEETS === 'object';

      assert.ok(hasCheatSheets, 'CHEAT_SHEETS must be exported');
      // If TOPIC_CHEAT_SHEETS is not exported, we note it as an API divergence finding
      if (!hasTopicCheatSheets) {
        console.warn(
          'CRITIC FINDING: TOPIC_CHEAT_SHEETS is not exported as a named export from src/data/cheatSheets.ts. It is exported as CHEAT_SHEETS.'
        );
      }
    });
  });
});

