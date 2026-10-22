import('./ts_resolver.mjs').then(async () => {
  const p1 = await import('../src/generators/p1Generators.ts');
  const p2 = await import('../src/generators/p2Generators.ts');
  
  const gens = [
    { name: 'QuadraticEquation', fn: p1.generateQuadraticEquation },
    { name: 'QuadraticInequality', fn: p1.generateQuadraticInequality },
    { name: 'SurdEquation', fn: p1.generateSurdEquation },
    { name: 'ArithmeticSequence', fn: p1.generateArithmeticSequence },
    { name: 'QuadraticSequence', fn: p1.generateQuadraticSequence },
    { name: 'SumToInfinity', fn: p1.generateSumToInfinity },
    { name: 'HyperbolaAsymptotes', fn: p1.generateHyperbolaAsymptotes },
    { name: 'MortgageRepayment', fn: p1.generateMortgageRepayment },
    { name: 'CubicTurningPoints', fn: p1.generateCubicTurningPoints },
    { name: 'RegressionLine', fn: p2.generateRegressionLine },
    { name: 'CircleTangent', fn: p2.generateCircleTangent },
    { name: 'InclinationAngle', fn: p2.generateInclinationAngle },
    { name: 'TrigGeneralSolution', fn: p2.generateTrigGeneralSolution },
    { name: 'CyclicQuad', fn: p2.generateCyclicQuadQuestion },
    { name: 'TanChord', fn: p2.generateTanChordQuestion },
  ];

  for (const g of gens) {
    let fallbackCount = 0;
    let duplicateDistractorCount = 0;
    const runs = 2000;
    for (let i = 0; i < runs; i++) {
      const q = g.fn();
      const seen = new Set();
      for (const d of q.distractors) {
        if (d.explanation.includes('Arithmetic variation')) {
          fallbackCount++;
        }
        if (seen.has(d.latex)) {
          duplicateDistractorCount++;
        }
        seen.add(d.latex);
      }
    }
    console.log(g.name + ': fallbacks = ' + fallbackCount + ', duplicate distractors = ' + duplicateDistractorCount + ' (out of ' + runs + ')');
  }
});
