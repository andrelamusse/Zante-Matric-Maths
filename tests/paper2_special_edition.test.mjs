import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { register } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';

try {
  register('./tests/ts_resolver.mjs', import.meta.url);
} catch (e) {
  // Already registered
}

const { ZANTE_QUESTIONS, getZanteQuestionById } = await import('../src/data/zanteQuestions.ts');
const { generateFlirtyPrioritiesZante, generateZanteQuestion } = await import('../src/generators/zanteGenerator.ts');
const { PRAISE_VOICE_LINES, ROAST_VOICE_LINES } = await import('../src/sound/banterMemory.ts');
const { FORMULA_SHEET } = await import('../src/data/formulaSheet.ts');
const { TOPICS } = await import('../src/data/topics.ts');
const { generateP2Question } = await import('../src/generators/p2Generators.ts');
const { buildMockExamQuestions, P2_BLUEPRINT } = await import('../src/data/cheatSheets.ts');

describe('Paper 2 Special Edition: Master Prompt Verification', () => {
  describe('1. Zante Difficulty Mode & Master Prompt Questions', () => {
    it('should include the Tan-Chord +10k aura question in ZANTE_QUESTIONS', () => {
      const q = ZANTE_QUESTIONS.find((item) =>
        item.questionText.includes('Tan-Chord Theorem in 4 lines')
      );
      assert.ok(q, 'Tan-Chord Theorem question must exist in ZANTE_QUESTIONS');
      assert.equal(q.category, 'flirty_priorities');
      assert.ok(q.options.includes('+10,000'), 'Must include +10,000 option');
      const correctOpt = q.options[q.correctIndex];
      assert.equal(correctOpt, '+10,000', 'Correct option must be +10,000');
      assert.ok(q.wittyToast.includes('Well done baby, that was insane skill'));
    });

    it('should generate Tan-Chord +10k aura questions from generator', () => {
      let found = false;
      for (let i = 0; i < 200; i++) {
        const q = generateFlirtyPrioritiesZante();
        if (q.questionText.includes('Tan-Chord Theorem in 4 lines')) {
          assert.equal(q.options[q.correctIndex], '+10,000');
          found = true;
          break;
        }
      }
      assert.ok(found, 'Generator should produce Tan-Chord questions');
    });

    it('should contain all 7 Master Prompt questions in Zante Mode', () => {
      const promptSnippets = [
        'What integer comes immediately after 3?',
        'How many sides does a triangle have in Euclidean Geometry?',
        'If Zante has 2 iced coffees and Andre buys her 1 more',
        'Which number is strictly bigger: 5 or 2?',
        'Passenger Princess Rule #1: Who controls the vehicle AUX cord?',
        'Count the hearts: 💖 💖 💖',
        'If a guy can prove the Tan-Chord Theorem in 4 lines',
      ];

      for (const snippet of promptSnippets) {
        const found = ZANTE_QUESTIONS.some((q) => q.questionText.includes(snippet));
        assert.ok(found, `ZANTE_QUESTIONS must contain prompt question matching: "${snippet}"`);
      }
    });

    it('should include the Master Prompt verbatim compliments in PRAISE_VOICE_LINES', () => {
      const requiredCompliments = [
        "4?! Stop it right now, Einstein is literally shaking. You're so smart AND pretty, how is that even legal? 💅✨",
        "Well done baby, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖",
        "Academic weapon unlocked! Give this girl her 100% Matric distinction right now 🔥😘",
      ];

      for (const comp of requiredCompliments) {
        assert.ok(
          PRAISE_VOICE_LINES.includes(comp),
          `PRAISE_VOICE_LINES must contain: "${comp}"`
        );
      }
    });

    it('should include the Master Prompt verbatim roasts in ROAST_VOICE_LINES', () => {
      const requiredRoasts = [
        "Wait, the math must be wrong because you're literally too pretty to be wrong. Try that again gorgeous 😉✨",
        "Girl... ain't no way you just clicked that. We are blaming the screen glare on that one 💀",
      ];

      for (const roast of requiredRoasts) {
        assert.ok(
          ROAST_VOICE_LINES.includes(roast),
          `ROAST_VOICE_LINES must contain: "${roast}"`
        );
      }
    });
  });

  describe('2. Paper 2 Curriculum Focus (150 Marks Exact)', () => {
    it('should verify the 4 official CAPS Paper 2 topics summing to 150 marks', () => {
      const p2TopicIds = ['statistics', 'analytical_geometry', 'trigonometry', 'euclidean_geometry'];
      let totalMarks = 0;
      for (const id of p2TopicIds) {
        const topic = TOPICS[id];
        assert.ok(topic, `Topic ${id} must exist`);
        assert.equal(topic.paper, 'P2');
        totalMarks += topic.weightMarks;
      }
      assert.equal(totalMarks, 150, 'Paper 2 topic weights must sum to exactly 150 marks');
    });

    it('should generate valid questions across all 4 Paper 2 topics with generateP2Question', () => {
      const p2TopicIds = ['statistics', 'analytical_geometry', 'trigonometry', 'euclidean_geometry'];
      for (const topicId of p2TopicIds) {
        const q = generateP2Question(topicId);
        assert.equal(q.paper, 'P2');
        assert.equal(q.topic, topicId);
        assert.ok(q.marks > 0);
        assert.ok(q.distractors.length >= 4);
        assert.ok(q.correctAnswerId);
      }
    });

    it('should build a complete 150-mark Paper 2 mock exam with 10 questions', () => {
      const exam = buildMockExamQuestions('P2', 'EX-01');
      assert.equal(exam.length, 10, 'Paper 2 blueprint must have exactly 10 questions');
      const totalMarks = exam.reduce((sum, q) => sum + q.marks, 0);
      assert.equal(totalMarks, 150, 'Paper 2 mock exam must have exactly 150 marks');
      for (const q of exam) {
        assert.equal(q.paper, 'P2');
      }
    });
  });

  describe('3. Component Branding & Static Artifacts', () => {
    it('should verify index.html has Paper 2 Edition in title', () => {
      const indexHtml = fs.readFileSync(path.resolve('index.html'), 'utf-8');
      assert.ok(indexHtml.includes("Zante's Matric Maths Studio — Paper 2 Edition"));
    });

    it('should verify Header.tsx contains Paper 2 Edition branding', () => {
      const headerContent = fs.readFileSync(path.resolve('src/components/navigation/Header.tsx'), 'utf-8');
      assert.ok(headerContent.includes("Zante's Matric Maths Studio — Paper 2 Edition"));
    });

    it('should verify PaperNav.tsx contains Paper 2 Edition tab and description', () => {
      const navContent = fs.readFileSync(path.resolve('src/components/navigation/PaperNav.tsx'), 'utf-8');
      assert.ok(navContent.includes('Paper 2 Edition'));
      assert.ok(navContent.includes("Zante's Matric Maths Studio — Paper 2 Edition"));
    });

    it('should verify FormulaSheetDrawer.tsx defaults to Paper 2', () => {
      const drawerContent = fs.readFileSync(path.resolve('src/components/tools/FormulaSheetDrawer.tsx'), 'utf-8');
      assert.ok(drawerContent.includes("useState<string>('Paper 2 (All)')"));
      assert.ok(drawerContent.includes('Official NSC Formula Sheet — Paper 2 Edition'));
    });

    it('should verify ExamSimulator.tsx defaults to Paper 2', () => {
      const simContent = fs.readFileSync(path.resolve('src/components/studio/ExamSimulator.tsx'), 'utf-8');
      assert.ok(simContent.includes("initialPaper = 'P2'"));
      assert.ok(simContent.includes('Paper 2 20-Exam Simulator'));
    });

    it('should verify App.tsx defaults state to Paper 2 and sets document title', () => {
      const appContent = fs.readFileSync(path.resolve('src/App.tsx'), 'utf-8');
      assert.ok(appContent.includes("activePaper: 'P2'"));
      assert.ok(appContent.includes("activeTopic: 'statistics'"));
      assert.ok(appContent.includes("Zante's Matric Maths Studio — Paper 2 Edition"));
    });
  });
});
