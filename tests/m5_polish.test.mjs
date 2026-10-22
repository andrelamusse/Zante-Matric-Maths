/**
 * Milestone M5 Quality Polish Verification Suite
 *
 * Verifies the 4 quality polish enhancements identified during M4 review:
 * 1. TOPIC_CHEAT_SHEETS named alias export in src/data/cheatSheets.ts
 * 2. React camelCase fontWeight="bold" in StatsDiagram.tsx
 * 3. Division-by-zero protection in AnalyticalGeometryPlot.tsx for 0, 180, 360 deg
 * 4. Step-by-step ticked memo review KaTeX checkmark HTML rendering in ExamSimulator.tsx
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { register } from 'node:module';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Register TypeScript hook
try {
  register('./ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

describe('Milestone M5: Quality Polish Enhancements', () => {
  it('Enhancement 1: TOPIC_CHEAT_SHEETS named export exists and matches CHEAT_SHEETS', async () => {
    const { CHEAT_SHEETS, TOPIC_CHEAT_SHEETS } = await import('../src/data/cheatSheets.ts');
    assert.ok(TOPIC_CHEAT_SHEETS, 'TOPIC_CHEAT_SHEETS must be exported');
    assert.strictEqual(TOPIC_CHEAT_SHEETS, CHEAT_SHEETS, 'TOPIC_CHEAT_SHEETS must equal CHEAT_SHEETS');
    assert.strictEqual(Object.keys(TOPIC_CHEAT_SHEETS).length, 10, 'Must contain all 10 topics');
  });

  it('Enhancement 2: StatsDiagram uses valid React camelCase fontWeight="bold" without raw font-weight=', async () => {
    const statsFilePath = path.resolve('src/components/diagrams/StatsDiagram.tsx');
    const source = fs.readFileSync(statsFilePath, 'utf8');

    assert.ok(!source.includes('font-weight='), 'StatsDiagram.tsx source must NOT contain font-weight=');
    assert.ok(source.includes('fontWeight="bold"'), 'StatsDiagram.tsx source must use camelCase fontWeight="bold"');

    const { StatsDiagram } = await import('../src/components/diagrams/StatsDiagram.tsx');
    const markup = renderToStaticMarkup(
      React.createElement(StatsDiagram, {
        type: 'box_plot',
        params: { min: 10, q1: 25, median: 40, q3: 65, max: 95 },
      })
    );
    assert.ok(markup.includes('Q1=25'), 'Must render Q1 value');
    assert.ok(markup.includes('M=40'), 'Must render Median value');
    assert.ok(markup.includes('Q3=65'), 'Must render Q3 value');
  });

  it('Enhancement 3: AnalyticalGeometryPlot handles contactAngleDeg 0, 180, 360 without -Infinity or NaN', async () => {
    const { AnalyticalGeometryPlot } = await import('../src/components/diagrams/AnalyticalGeometryPlot.tsx');

    const testAngles = [0, 180, 360];
    for (const angle of testAngles) {
      const markup = renderToStaticMarkup(
        React.createElement(AnalyticalGeometryPlot, {
          type: 'circle_tangent',
          params: { centerX: 1, centerY: 2, radius: 4, contactAngleDeg: angle },
        })
      );

      assert.ok(!markup.includes('-Infinity'), `Markup for angle ${angle}° must not contain -Infinity`);
      assert.ok(!markup.includes('Infinity'), `Markup for angle ${angle}° must not contain Infinity`);
      assert.ok(!markup.includes('NaN'), `Markup for angle ${angle}° must not contain NaN`);
      assert.ok(markup.includes('P('), `Markup must include contact point for angle ${angle}°`);
      assert.ok(markup.includes('m_tan = undef'), `Tangent slope for horizontal radius at ${angle}° must indicate undef`);
    }
  });

  it('Enhancement 4: ExamSimulator tickAllocation renders KaTeX checkmark HTML markup', async () => {
    const examSimPath = path.resolve('src/components/studio/ExamSimulator.tsx');
    const source = fs.readFileSync(examSimPath, 'utf8');

    assert.ok(
      source.includes('dangerouslySetInnerHTML={{ __html: renderMath(step.tickAllocation) }}'),
      'ExamSimulator.tsx must render step.tickAllocation with dangerouslySetInnerHTML={{ __html: renderMath(step.tickAllocation) }}'
    );

    const katex = (await import('katex')).default;
    const rendered = katex.renderToString('\\checkmark\\text{ (Standard form)}', { throwOnError: false });
    assert.ok(rendered.includes('katex-html'), 'KaTeX output must contain katex-html element');
    assert.ok(rendered.includes('✓'), 'KaTeX output must render unicode checkmark');
  });
});
