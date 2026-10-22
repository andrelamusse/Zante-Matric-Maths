import('./ts_resolver.mjs').then(async () => {
  const p1 = await import('../src/generators/p1Generators.ts');
  const p2 = await import('../src/generators/p2Generators.ts');

  console.log('--- QuadraticSequence Fallback Samples ---');
  for (let i = 0; i < 2000; i++) {
    const q = p1.generateQuadraticSequence();
    for (const d of q.distractors) {
      if (d.explanation.includes('Arithmetic variation')) {
        console.log('Question:', q.questionLatex);
        console.log('Correct:', q.distractors.find(x => x.id === q.correctAnswerId).latex);
        console.log('Distractors:', q.distractors.map(x => x.latex));
        console.log('---');
        break;
      }
    }
  }

  console.log('--- CircleTangent Fallback Samples ---');
  for (let i = 0; i < 2000; i++) {
    const q = p2.generateCircleTangent();
    for (const d of q.distractors) {
      if (d.explanation.includes('Arithmetic variation')) {
        console.log('Question:', q.questionLatex);
        console.log('Correct:', q.distractors.find(x => x.id === q.correctAnswerId).latex);
        console.log('Distractors:', q.distractors.map(x => x.latex));
        console.log('---');
        break;
      }
    }
  }
});
