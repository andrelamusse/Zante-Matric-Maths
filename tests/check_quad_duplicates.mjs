import('./ts_resolver.mjs').then(async () => {
  const { generateQuadraticEquation } = await import('../src/generators/p1Generators.ts');
  let duplicateRootDistractorHits = 0;
  const runs = 2000;
  for (let i = 0; i < runs; i++) {
    const q = generateQuadraticEquation();
    const correctOpt = q.distractors.find(d => d.id === q.correctAnswerId);
    const cMatch = correctOpt.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
    const cr1 = parseInt(cMatch[1], 10);
    const cr2 = parseInt(cMatch[2], 10);
    const correctSet = new Set([cr1, cr2]);

    for (const d of q.distractors) {
      if (d.id === q.correctAnswerId) continue;
      const dMatch = d.latex.match(/x\s*=\s*(-?\d+).*?x\s*=\s*(-?\d+)/);
      if (dMatch) {
        const dr1 = parseInt(dMatch[1], 10);
        const dr2 = parseInt(dMatch[2], 10);
        const dSet = new Set([dr1, dr2]);
        if (dSet.size === correctSet.size && [...dSet].every(x => correctSet.has(x))) {
          duplicateRootDistractorHits++;
          if (duplicateRootDistractorHits <= 5) {
            console.log('Sample Duplicate Mathematical Answer:');
            console.log('Question:', q.questionLatex);
            console.log('Correct:', correctOpt.latex);
            console.log('Distractor (' + d.id + '):', d.latex, 'Explanation:', d.explanation);
            console.log('---');
          }
        }
      }
    }
  }
  console.log('Total duplicate mathematical solution distractors in QuadraticEquation: ' + duplicateRootDistractorHits + ' out of ' + runs);
});
