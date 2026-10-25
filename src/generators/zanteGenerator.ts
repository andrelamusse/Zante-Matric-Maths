import type { ZanteQuestion, ZanteCategory } from '../types/gamification.ts';
import { fisherYatesShuffle } from './utils.ts';

/**
 * Zante's Matric Maths Studio — Parametric Zante Question Generator
 *
 * Produces infinite randomized, feisty, witty, zero-stress joke questions across
 * all 6 categories with guaranteed mathematical and string integrity:
 * - Zero NaN
 * - Zero undefined
 * - Exactly 4 distinct options per question
 * - Valid correctIndex (0 to 3)
 * - Feisty, high-status teasing tone suitable for group-chat screenshots
 */

let generatorCounter = 1;

function shuffleWithOptions<T>(correctItem: T, distractors: T[]): { options: T[]; correctIndex: number } {
  // Ensure distractors are distinct and do not contain correctItem
  const uniqueDistractors = Array.from(new Set(distractors.filter((d) => d !== correctItem)));
  while (uniqueDistractors.length < 3) {
    uniqueDistractors.push(`Option ${uniqueDistractors.length + 2}` as unknown as T);
  }

  const options: T[] = [correctItem, ...uniqueDistractors.slice(0, 3)];
  // In-place Fisher-Yates shuffle directly on options array
  fisherYatesShuffle(options);
  const correctIndex = options.indexOf(correctItem);

  return { options, correctIndex };
}

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================================================================
// CATEGORY 1: ELEMENTARY
// ===========================================================================
export function generateElementaryZante(): ZanteQuestion {
  const id = `zante_gen_elem_${generatorCounter++}_${randInt(100, 999)}`;
  const templateType = randInt(1, 4);

  if (templateType === 1) {
    const a = randInt(1, 6);
    const b = randInt(1, 5);
    const sum = a + b;
    const correct = `${sum}`;
    const distractors = [
      `${sum + 1} (adjusted for inflation)`,
      `${sum - 1}`,
      'A panic attack',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'elementary',
      questionText: `Solve for x: ${a} + ${b} = x.`,
      options,
      correctIndex,
      wittyToast: `You solved ${a} + ${b} in record time. Einstein has been real quiet since you tackled this.`,
      screenshotQuote: `Proof I'm a certified math genius 💅 ${a} + ${b} conquered. Distinction incoming.`,
    };
  } else if (templateType === 2) {
    const num = randInt(4, 15);
    const correct = `${num + 1}`;
    const distractors = [
      `${num + 2}`,
      `${num - 1}`,
      'Depends on the economic climate',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'elementary',
      questionText: `What integer comes immediately after ${num}?`,
      options,
      correctIndex,
      wittyToast: `Sequential counting above ${num}: flawless execution. Don't let the DBE catch you flexing.`,
      screenshotQuote: `Proof I'm a certified math genius 💅 Sequential counting after ${num}: mastered.`,
    };
  } else if (templateType === 3) {
    const shapes = [
      { name: 'triangle', sides: 3 },
      { name: 'square', sides: 4 },
      { name: 'pentagon', sides: 5 },
      { name: 'hexagon', sides: 6 },
    ];
    const chosen = pickRandom(shapes);
    const correct = `${chosen.sides}`;
    const distractors = [
      `${chosen.sides + 1} if it is aesthetic`,
      'Too many vertices for a Tuesday',
      'One continuous boundary vibe',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'elementary',
      questionText: `How many sides does a standard ${chosen.name} have?`,
      options,
      correctIndex,
      wittyToast: `Geometric topology decoded. Euclidean examiners are shaking in their boots.`,
      screenshotQuote: `Euclidean Geometry royalty: ${chosen.name} sides identified with 100% precision 💅`,
    };
  } else {
    const big = randInt(15, 50);
    const small = randInt(2, 10);
    const correct = `${big}`;
    const distractors = [
      `${small} (it has better energy)`,
      'They are equal in my heart',
      'Both values are invalid',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'elementary',
      questionText: `Which number is strictly greater: ${big} or ${small}?`,
      options,
      correctIndex,
      wittyToast: `Inequalities demolished. Double-digit mastery on full display.`,
      screenshotQuote: `Inequalities conquered: ${big} > ${small}. Big numbers fear me 💅`,
    };
  }
}

// ===========================================================================
// CATEGORY 2: ICED COFFEE
// ===========================================================================
export function generateIcedCoffeeZante(): ZanteQuestion {
  const id = `zante_gen_coffee_${generatorCounter++}_${randInt(100, 999)}`;
  const drinks = [
    'oat milk iced vanilla latte',
    'iced brown sugar shaken espresso',
    'cold brew with sweet cream',
    'iced matcha latte',
  ];
  const drink = pickRandom(drinks);
  const templateType = randInt(1, 3);

  if (templateType === 1) {
    const price = randInt(40, 65);
    const qty = randInt(2, 4);
    const correct = 'R0.00 (in fact, you made a profit)';
    const distractors = [
      `R${qty * price}.00`,
      `R${price}.00`,
      'Financial ruin',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'iced_coffee',
      questionText: `If a ${drink} costs R${price}, and you order ${qty}, but Andre pays for the round, how much did you spend?`,
      options,
      correctIndex,
      wittyToast: `Pure economic theory. Free ${drink} is legally considered an appreciating asset.`,
      screenshotQuote: `Master of Financial Mathematics: Acquired ${qty} iced lattes for R0. Economic genius ☕✨`,
    };
  } else if (templateType === 2) {
    const budget = randInt(80, 150);
    const cost = randInt(45, 65);
    const change = budget - cost;
    const correct = `R${change}.00`;
    const distractors = [
      `R${budget}.00 because Apple Pay does not count as real money`,
      'Negative R300 after a quick trip to Zara',
      'R0, tip the barista the entire surplus',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'iced_coffee',
      questionText: `You have R${budget}.00 cash. An ${drink} costs R${cost}.00. How much is left for study snacks?`,
      options,
      correctIndex,
      wittyToast: `Mental subtraction on point! You could literally audit the South African Reserve Bank.`,
      screenshotQuote: `Budgeting verified: R${change}.00 reserved for sweet treats. Economic stability achieved ☕💅`,
    };
  } else {
    const iceRatio = randInt(65, 85);
    const correct = `${iceRatio}% aesthetic clinking sounds, ${100 - iceRatio}% liquid caffeine`;
    const distractors = [
      '100% hot filter coffee in a tall glass',
      'Mathematically balanced 50/50 ratio',
      '99% liquid, zero ice cubes allowed',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'iced_coffee',
      questionText: `What is the optimal thermodynamic ratio of ice to coffee in an ${drink}?`,
      options,
      correctIndex,
      wittyToast: `The sound of ice against glass increases mathematical retention by 42%. It is pure science.`,
      screenshotQuote: `Thermodynamics: ${iceRatio}% ice clinks, ${100 - iceRatio}% caffeine. Study optimization complete ☕✨`,
    };
  }
}

// ===========================================================================
// CATEGORY 3: PASSENGER PRINCESS
// ===========================================================================
export function generatePassengerPrincessZante(): ZanteQuestion {
  const id = `zante_gen_pass_${generatorCounter++}_${randInt(100, 999)}`;
  const templateType = randInt(1, 3);

  if (templateType === 1) {
    const cars = ['the Golf GTI', 'the Polo', 'the BMW', 'the SUV'];
    const car = pickRandom(cars);
    const correct = "Tell Andre 'The car is making a pretty orange light'";
    const distractors = [
      'Calculate the fuel reserve in liters using calculus',
      'Pull the handbrake and panic immediately',
      'Pretend you did not see it and turn up the music',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'passenger_princess',
      questionText: `When the fuel warning light illuminates in ${car}, what is your designated response?`,
      options,
      correctIndex,
      wittyToast: `Correct delegation is the highest form of problem solving in CAPS Pure Maths.`,
      screenshotQuote: `Automotive logistics: Ambient orange dashboard light reported. Problem delegated 🚗👑`,
    };
  } else if (templateType === 2) {
    const times = ['14:00', '15:30', '18:00', '19:15'];
    const eta = pickRandom(times);
    const correct = 'When the main character arrives, the event begins';
    const distractors = [
      `${eta} sharp on the dot`,
      '30 minutes early to review past papers',
      'Time is an invariant scalar quantity',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'passenger_princess',
      questionText: `The GPS indicates ETA is ${eta}. You start doing your eyeliner 2 minutes prior. What time do you arrive?`,
      options,
      correctIndex,
      wittyToast: `Einstein's Special Relativity proven: Time dilates around people with immaculate composure.`,
      screenshotQuote: `Special Relativity: Time bends to the schedule of the main character 🚗👑`,
    };
  } else {
    const correct = 'The passenger princess unconditionally';
    const distractors = [
      'The driver who owns the car',
      'Whoever scored highest in Grade 11 Trigonometry',
      'The national radio broadcaster',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'passenger_princess',
      questionText: `Under South African passenger princess constitutional protocol, who controls the vehicle Aux cable?`,
      options,
      correctIndex,
      wittyToast: `Sonic sovereignty respected. Your playlist curation is legally non-negotiable.`,
      screenshotQuote: `Acoustic Engineering: Aux cable sovereignty non-negotiable. Flawless playlist 🚗👑`,
    };
  }
}

// ===========================================================================
// CATEGORY 4: GIRL MATH
// ===========================================================================
export function generateGirlMathZante(): ZanteQuestion {
  const id = `zante_gen_math_${generatorCounter++}_${randInt(100, 999)}`;
  const templateType = randInt(1, 3);

  if (templateType === 1) {
    const orig = randInt(8, 16) * 100;
    const discount = randInt(3, 7) * 100;
    const sale = orig - discount;
    const correct = `You made R${discount}.00 in pure profit`;
    const distractors = [
      `You spent R${sale}.00`,
      'You broke even',
      'It was a minor financial loss',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'girl_math',
      questionText: `A luxury outfit was R${orig}.00. It is marked down to R${sale}.00. If you purchase it, what occurred?`,
      options,
      correctIndex,
      wittyToast: `That is not retail spending; that is capital acquisition. Wall Street is taking notes.`,
      screenshotQuote: `Girl Math distinction: Saved R${discount}.00 = Net Profit R${discount}.00. Wall Street who? 💅`,
    };
  } else if (templateType === 2) {
    const retVal = randInt(4, 8) * 100;
    const buyVal = retVal + randInt(3, 8) * 10;
    const diff = buyVal - retVal;
    const correct = `R${diff}.00 (practically free)`;
    const distractors = [
      `R${buyVal}.00`,
      `R${retVal + buyVal}.00`,
      'Nothing, store credit is monopoly currency',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'girl_math',
      questionText: `You return an unwanted R${retVal}.00 jacket and immediately buy a R${buyVal}.00 perfume. How much did you spend?`,
      options,
      correctIndex,
      wittyToast: `A R${diff}.00 luxury perfume? The Department of Trade and Industry needs to audit your genius.`,
      screenshotQuote: `Marginal Cost Analysis: R${buyVal} item - R${retVal} return = R${diff}. Basically free 💅`,
    };
  } else {
    const cash = randInt(100, 400);
    const correct = 'R0.00. Cash is paper, not money';
    const distractors = [
      `The full R${cash}.00 amount`,
      `Half the amount (R${cash / 2}.00)`,
      'It creates an overdraft fee',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'girl_math',
      questionText: `If you pay for lunch using R${cash}.00 in physical cash banknotes, how much did your bank balance drop?`,
      options,
      correctIndex,
      wittyToast: `If no banking app notification arrives on your lock screen, did the transaction even occur? Quantum economics says no.`,
      screenshotQuote: `Quantum Economics: Bank balance undisturbed = 100% free lunch 💅`,
    };
  }
}

// ===========================================================================
// CATEGORY 5: FLIRTY PRIORITIES
// ===========================================================================
export function generateFlirtyPrioritiesZante(): ZanteQuestion {
  const id = `zante_gen_flirt_${generatorCounter++}_${randInt(100, 999)}`;
  const templateType = randInt(1, 4);

  if (templateType === 1) {
    const pages = randInt(10, 20);
    const topics = ['circle theorems', 'cubic optimization', '3D trigonometry', 'compound annuities'];
    const topic = pickRandom(topics);
    const correct = "Leave on delivered for 4 hours, then reply 'cute'";
    const distractors = [
      'Read all pages with analytical scrutiny and take detailed notes',
      'Send an immediate thumbs-up emoji',
      'Block the contact immediately',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'flirty_priorities',
      questionText: `Andre sends you a ${pages}-page handwritten memo explaining ${topic} at 23:00. What is standard protocol?`,
      options,
      correctIndex,
      wittyToast: `High-status power play. Acknowledges the LaTeX typesetting while keeping him humble.`,
      screenshotQuote: `Social Dynamics 101: ${pages} pages of ${topic} answered with 'cute'. Power balance restored 💅`,
    };
  } else if (templateType === 2) {
    const heartCount = randInt(3, 6);
    const heartString = Array(heartCount).fill('💖').join(' ');
    const correct = `${heartCount}`;
    const distractors = [
      `${heartCount}, and they are all for you`,
      `${heartCount + 1}`,
      'Too much emotional data for one screen',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'flirty_priorities',
      questionText: `Count the hearts: ${heartString}. Exactly how many are visible?`,
      options,
      correctIndex,
      wittyToast: `Well done baby, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖`,
      screenshotQuote: `Heart audit complete: exactly ${heartCount}. Discrete mathematics handled with style 💖`,
    };
  } else if (templateType === 3) {
    const correct = '1.0 (certain event)';
    const distractors = [
      '0.50 (equal probability)',
      '0.00 (impossible event)',
      'Depends on whether you skipped the calculus section',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'flirty_priorities',
      questionText: `According to Kolmogorov probability axioms, what is the probability that you are Andre's favorite student?`,
      options,
      correctIndex,
      wittyToast: `In rigorous probability theory, P(E) = 1.0 represents mathematical certainty. The axioms do not lie.`,
      screenshotQuote: `Probability Theory: P(Favorite) = 1.0. Mathematical certainty verified 💅`,
    };
  } else {
    const correct = '+10,000';
    const distractors = [
      '+50 (mid)',
      '0 aura',
      'Needs to touch grass',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'flirty_priorities',
      questionText: 'If a guy can prove the Tan-Chord Theorem in 4 lines without looking at the memo, his aura is:',
      options,
      correctIndex,
      wittyToast: 'Well done baby, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖',
      screenshotQuote: 'Euclidean geometry aura check: 4-line Tan-Chord proof = +10,000 aura 💅📐',
    };
  }
}

// ===========================================================================
// CATEGORY 6: MATRIC TROPES
// ===========================================================================
export function generateMatricTropesZante(): ZanteQuestion {
  const id = `zante_gen_trope_${generatorCounter++}_${randInt(100, 999)}`;
  const templateType = randInt(1, 3);

  if (templateType === 1) {
    const a = randInt(6, 9);
    const b = randInt(7, 9);
    const correct = `Checking ${a} + ${b} on the Casio just to be emotionally sure`;
    const distractors = [
      'Deriving cubic equations of state',
      'Calculating the speed of light',
      'Writing an apology letter to the invigilator',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'matric_tropes',
      questionText: `What is the primary function of your CASIO fx-82ZA PLUS during the final 10 minutes of Paper 1?`,
      options,
      correctIndex,
      wittyToast: `Emotional insurance: Because what if ${a} + ${b} changed its value since primary school?`,
      screenshotQuote: `Matric finals reality: Calculating ${a} + ${b} on Casio just in case reality shifted 💅`,
    };
  } else if (templateType === 2) {
    const correct = 'A psychological trap daring you to suffer';
    const distractors = [
      'A helpful invitation to explore alternative paths',
      'A shortcut that saves 15 minutes',
      'An instruction to skip the question entirely',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'matric_tropes',
      questionText: `When an NSC exam question says "Hence or otherwise", what does "otherwise" actually mean?`,
      options,
      correctIndex,
      wittyToast: `Pro tip: Always use 'Hence'. 'Otherwise' is a scenic detour into mark deduction territory.`,
      screenshotQuote: `Exam Translation: 'Hence or otherwise' = 'Use Hence or prepare for pain' 💅`,
    };
  } else {
    const correct = 'Write with supersonic speed and pray for lenient handwriting marks';
    const distractors = [
      'Accept your fate and admire the ceiling fans',
      'Begin sketching abstract Euclidean art on the formula sheet',
      'Count your potential distinction marks so far',
    ];
    const { options, correctIndex } = shuffleWithOptions(correct, distractors);
    return {
      id,
      category: 'matric_tropes',
      questionText: `The chief invigilator announces: "Ten minutes remaining". You are still on Question 9. What is the move?`,
      options,
      correctIndex,
      wittyToast: `Adrenaline protocol initiated: Rapid-fire accuracy marks can still secure the distinction.`,
      screenshotQuote: `Final 10 minutes: Supersonic speedrun algebra mode activated 💅`,
    };
  }
}

// ===========================================================================
// MAIN UNIFIED GENERATOR
// ===========================================================================
export function generateZanteQuestion(category?: ZanteCategory): ZanteQuestion {
  const allCategories: ZanteCategory[] = [
    'elementary',
    'iced_coffee',
    'passenger_princess',
    'girl_math',
    'flirty_priorities',
    'matric_tropes',
  ];
  const targetCategory = category || pickRandom(allCategories);

  switch (targetCategory) {
    case 'elementary':
      return generateElementaryZante();
    case 'iced_coffee':
      return generateIcedCoffeeZante();
    case 'passenger_princess':
      return generatePassengerPrincessZante();
    case 'girl_math':
      return generateGirlMathZante();
    case 'flirty_priorities':
      return generateFlirtyPrioritiesZante();
    case 'matric_tropes':
      return generateMatricTropesZante();
    default:
      return generateElementaryZante();
  }
}

/**
 * Generate a batch of randomized Zante questions
 */
export function generateZanteQuestionBatch(count: number, category?: ZanteCategory): ZanteQuestion[] {
  const batch: ZanteQuestion[] = [];
  for (let i = 0; i < count; i++) {
    batch.push(generateZanteQuestion(category));
  }
  return batch;
}
