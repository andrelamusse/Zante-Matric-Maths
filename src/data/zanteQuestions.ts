import type { ZanteQuestion, ZanteCategory } from '../types/gamification.ts';
import { shuffleZanteQuestion } from '../generators/utils.ts';

/**
 * Zante's Matric Maths Studio — Curated Zante Difficulty Joke Questions
 *
 * 30 curated elementary, zero-stress joke questions across all 6 categories:
 * - elementary (5)
 * - iced_coffee (5)
 * - passenger_princess (5)
 * - girl_math (5)
 * - flirty_priorities (5)
 * - matric_tropes (5)
 *
 * Tone: Feisty, witty, high-status teasing, playfully cute/flirty for group-chat screenshots.
 * Zero cringe, never clingy, never weird or pedantic.
 */
export const ZANTE_QUESTIONS: ZanteQuestion[] = [
  // -------------------------------------------------------------------------
  // Category 1: Elementary Counting & Toddler Math
  // -------------------------------------------------------------------------
  {
    id: 'zante_elem_01',
    category: 'elementary',
    questionText: 'What integer comes immediately after 3?',
    options: ['4', '7 (if we round up for inflation)', 'A panic attack', 'Whatever you want it to be'],
    correctIndex: 0,
    wittyToast: "4?! Stop it right now, Einstein is literally shaking. You're so smart AND pretty, how is that even legal? 💅✨",
    screenshotQuote: "Proof I'm a certified math genius 💅 Sequential counting: mastered.",
  },
  {
    id: 'zante_elem_02',
    category: 'elementary',
    questionText: 'Solve for x: 1 + 1 = x.',
    options: ['Window', '2', '11', 'Depends on who is asking'],
    correctIndex: 1,
    wittyToast: 'Groundbreaking arithmetic. Einstein has been real quiet since you solved this one.',
    screenshotQuote: '1 + 1 conquered. CAPS Paper 1 does not stand a chance.',
  },
  {
    id: 'zante_elem_03',
    category: 'elementary',
    questionText: 'How many sides does a triangle have in Euclidean Geometry?',
    options: ['3', '4 if it is aesthetic', 'Too many angles for a Tuesday', 'Just 1 continuous boundary vibe'],
    correctIndex: 0,
    wittyToast: 'Tri = three. You cracked the Latin root code. Euclidean geometry is shaking in its boots.',
    screenshotQuote: 'Euclidean geometry master. I know triangles have 3 sides.',
  },
  {
    id: 'zante_elem_04',
    category: 'elementary',
    questionText: 'Count the fingers on your left hand (standard human biology):',
    options: ['12', '5', 'Enough to hold an iced matcha', 'Undefined'],
    correctIndex: 1,
    wittyToast: 'Five out of five. Your spatial awareness is elite today.',
    screenshotQuote: 'Left-hand finger audit: 100% accurate. Distinction incoming.',
  },
  {
    id: 'zante_elem_05',
    category: 'elementary',
    questionText: 'Which number is strictly bigger: 5 or 2?',
    options: ['5', '2 (it has better energy)', 'They are equal in my heart', 'Both are invalid'],
    correctIndex: 0,
    wittyToast: 'Inequalities demolished. You really know your numbers. Big numbers fear you.',
    screenshotQuote: 'Inequalities conquered: 5 > 2. Distinction incoming.',
  },

  // -------------------------------------------------------------------------
  // Category 2: Iced Coffee & Daily Fuel
  // -------------------------------------------------------------------------
  {
    id: 'zante_coffee_01',
    category: 'iced_coffee',
    questionText: 'If Zante has 2 iced coffees and Andre buys her 1 more because she looks pretty today, how many iced coffees does she have?',
    options: ['3', 'Not enough caffeine to function', 'R0 spent (financial freedom)', '4 (girl math rounded up)'],
    correctIndex: 0,
    wittyToast: "3?! Stop it right now, Einstein is literally shaking. You're so smart AND pretty, how is that even legal? 💅✨",
    screenshotQuote: 'Beauty and brains verified: 2 + 1 = 3 iced coffees acquired ☕💖',
  },
  {
    id: 'zante_coffee_02',
    category: 'iced_coffee',
    questionText: "You order 1 iced coffee with extra ice. Someone asks for 'just a small sip'. How many sips remain for you?",
    options: ['0 sips (immediate biohazard, friendship terminated)', 'Half of it', 'The exact volume of liquid displaced by trust', 'A polite smile'],
    correctIndex: 0,
    wittyToast: 'Boundaries are important. Never negotiate on caffeine reserves.',
    screenshotQuote: 'Volume calculation: 1 iced latte minus 1 sip equals zero. Mathematical boundaries respected.',
  },
  {
    id: 'zante_coffee_03',
    category: 'iced_coffee',
    questionText: 'You have R100. An iced matcha is R65. How much money do you have left for study snacks?',
    options: ['R35', 'R100 because Apple Pay does not feel like real money', 'Negative R200 after Zara', 'R0, tip the barista'],
    correctIndex: 0,
    wittyToast: 'Look at that mental subtraction. You could literally work at the South African Reserve Bank.',
    screenshotQuote: 'Budgeting verified: R35 left for sweet treats. Economic stability achieved.',
  },
  {
    id: 'zante_coffee_04',
    category: 'iced_coffee',
    questionText: 'What is the optimal ratio of ice to coffee in an iced latte?',
    options: ['90% ice, 10% aesthetics', '70% aesthetic clinking sounds, 30% liquid caffeine', 'Mathematically balanced', 'Hot coffee in a glass'],
    correctIndex: 1,
    wittyToast: 'The sound of ice against glass increases mathematical retention by 42%. It is science.',
    screenshotQuote: 'Fluid dynamics: 70% ice clinks, 30% caffeine. Study optimization complete.',
  },
  {
    id: 'zante_coffee_05',
    category: 'iced_coffee',
    questionText: 'Drinking an iced caramel macchiato at 22:00 allows you to study for how many additional hours?',
    options: ['Zero hours (pure jittery heart palpitations)', '4 hours of academic weapon overdrive', 'Until tomorrow afternoon', 'Undefined'],
    correctIndex: 1,
    wittyToast: 'Caffeine pharmacology: Exponential energy boost achieved.',
    screenshotQuote: 'Midnight fuel: Macchiato power unlocked. Distinction incoming.',
  },

  // -------------------------------------------------------------------------
  // Category 3: Passenger Princess & Driving Priorities
  // -------------------------------------------------------------------------
  {
    id: 'zante_pass_01',
    category: 'passenger_princess',
    questionText: 'You are passenger princess. The driver asks you to check Google Maps. What is your designated priority?',
    options: ['Queue the auxiliary playlist vibes', "Look at the map upside down and say 'turn left where that dog was'", 'Take a golden hour selfie', 'Fall asleep immediately'],
    correctIndex: 1,
    wittyToast: 'Landmark-based navigation is statistically superior to Cartesian coordinate systems anyway.',
    screenshotQuote: 'Analytical Geometry: Landmark navigation > GPS coordinates. Flawless passenger princess 🚗👑',
  },
  {
    id: 'zante_pass_02',
    category: 'passenger_princess',
    questionText: 'The GPS says ETA is 14:00. You start doing your hair at 13:58. What time do you actually arrive?',
    options: ['14:00 sharp', '14:40 and looking immaculate', 'When the main character arrives, the event begins', 'Time is a social construct'],
    correctIndex: 2,
    wittyToast: 'Relativity theory proven. Time dilates around people with good hair.',
    screenshotQuote: 'Special Relativity: Time bends to the schedule of the main character.',
  },
  {
    id: 'zante_pass_03',
    category: 'passenger_princess',
    questionText: 'What is the correct response when the fuel light turns on in the car?',
    options: ["Tell Andre 'The car is making a pretty orange light'", 'Calculate the fuel reserve in liters', 'Pull over and panic', 'Pretend you did not see it'],
    correctIndex: 0,
    wittyToast: 'Correct. Delegation is the highest form of problem solving.',
    screenshotQuote: 'Fuel logistics: Ambient orange dashboard lighting reported. Problem delegated.',
  },
  {
    id: 'zante_pass_04',
    category: 'passenger_princess',
    questionText: 'Passenger Princess Rule #1: Who controls the vehicle AUX cord?',
    options: ['The passenger princess unconditionally', 'The driver', 'The radio', 'Whoever has the best math playlist'],
    correctIndex: 0,
    wittyToast: 'Sonic sovereignty respected. Your playlist is non-negotiable.',
    screenshotQuote: 'Sound engineering: Passenger princess controls the soundtrack 🎶👑',
  },
  {
    id: 'zante_pass_05',
    category: 'passenger_princess',
    questionText: 'If parking is parallel, what is the passenger princess expected to do?',
    options: ['Provide emotional commentary and say "you have lots of space"', 'Check the side mirrors', 'Take the steering wheel', 'Get out and push'],
    correctIndex: 0,
    wittyToast: 'Spatial reassurance: Maximum verbal support provided.',
    screenshotQuote: 'Parking geometry: Visual estimation by vibe.',
  },

  // -------------------------------------------------------------------------
  // Category 4: Outfit & Shopping ("Girl Math") Calculus
  // -------------------------------------------------------------------------
  {
    id: 'zante_math_01',
    category: 'girl_math',
    questionText: 'If something is on sale for 50% off and you buy it, how much did you save?',
    options: ['50%', 'You actually made money', '100% because not buying it would be irresponsible', 'It is literally free'],
    correctIndex: 1,
    wittyToast: 'Warren Buffett has been taking notes from you. That is pure profit.',
    screenshotQuote: 'Girl Math 101: 50% off is legally considered income.',
  },
  {
    id: 'zante_math_02',
    category: 'girl_math',
    questionText: 'You bought tickets for an event 3 months ago. Today you attend the event. How much did the event cost today?',
    options: ['The ticket price', 'R0 (it was pre-funded by past you, so it is basically free)', 'Double because of snacks', 'Inflation adjusted'],
    correctIndex: 1,
    wittyToast: 'Sunk cost fallacy inverted. Past you was generous to present you.',
    screenshotQuote: 'Financial theory: If it was bought months ago, attending today is free.',
  },
  {
    id: 'zante_math_03',
    category: 'girl_math',
    questionText: 'Paying with cash instead of card means:',
    options: ['You spent money', 'No money was spent because your bank balance did not drop', 'You are nostalgic', 'Budgeting'],
    correctIndex: 1,
    wittyToast: 'If the banking app does not ping, did the transaction even happen?',
    screenshotQuote: 'Cash economics: Bank balance intact = free purchase.',
  },
  {
    id: 'zante_math_04',
    category: 'girl_math',
    questionText: 'You return a R500 jacket and buy a R300 top. How much did you spend?',
    options: ['R300', 'You made R200 profit to spend on sushi', 'R0', 'R500'],
    correctIndex: 1,
    wittyToast: 'Macroeconomics distinction. You just created R200 of disposable stimulus.',
    screenshotQuote: 'Arbitrage master: Returned R500, spent R300, made R200 for lunch.',
  },
  {
    id: 'zante_math_05',
    category: 'girl_math',
    questionText: 'Buying R200 of skincare with a R50 voucher means:',
    options: ['You spent R150', 'You saved R50 so you should treat yourself to dessert', 'You overspent', 'No difference'],
    correctIndex: 1,
    wittyToast: 'Incentive alignment: Savings must be immediately reinvested into joy.',
    screenshotQuote: 'Voucher dynamics: R50 saved = dessert earned.',
  },

  // -------------------------------------------------------------------------
  // Category 5: Counting Hearts & Flirty Social Priorities
  // -------------------------------------------------------------------------
  {
    id: 'zante_flirt_01',
    category: 'flirty_priorities',
    questionText: 'Andre sends you a 14-page worked memo explaining a cubic function at 23:00. What is the appropriate response?',
    options: ['Read every single page with tears of joy', "'K'", "'Did you really KaTeX all of this for me?'", "'Send iced coffee first'"],
    correctIndex: 2,
    wittyToast: 'Acknowledge the effort, maintain the mystique. Standard protocol.',
    screenshotQuote: 'Typesetting diplomacy: Appreciating the KaTeX markup while staying unbothered.',
  },
  {
    id: 'zante_flirt_02',
    category: 'flirty_priorities',
    questionText: 'If a guy can prove the Tan-Chord Theorem in 4 lines without looking at the memo, his aura is:',
    options: ['+10,000', '+50 (mid)', '0 aura', 'Needs to touch grass'],
    correctIndex: 0,
    wittyToast: 'Well done baby, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖',
    screenshotQuote: 'Euclidean geometry aura check: 4-line Tan-Chord proof = +10,000 aura 💅📐',
  },
  {
    id: 'zante_flirt_03',
    category: 'flirty_priorities',
    questionText: 'When Andre explains Euclidean Geometry reasons, what is your official stance?',
    options: ['"Tan-chord theorem is obvious"', '"Why are the angles so dramatic?"', '"Just tell me what to write for the mark"', '"I agree with whatever gets 100%"'],
    correctIndex: 3,
    wittyToast: 'Mark maximizer strategy: Efficiency over unnecessary proofs.',
    screenshotQuote: 'Pragmatic Euclidean: Getting the 40 marks with zero drama.',
  },
  {
    id: 'zante_flirt_04',
    category: 'flirty_priorities',
    questionText: 'What is the probability that you are Andre\'s favorite student?',
    options: ['1.0 (certain event)', '0.5', '0.0', 'Depends on how many questions you skip'],
    correctIndex: 0,
    wittyToast: 'In Kolmogorov probability axioms, P(E) = 1 indicates absolute mathematical certainty.',
    screenshotQuote: 'Probability Theory: P(Favorite) = 1.0. The axioms do not lie 💅',
  },
  {
    id: 'zante_flirt_05',
    category: 'flirty_priorities',
    questionText: 'Count the hearts: 💖 💖 💖 — how many are there?',
    options: ['3', '3, and they are all for you', '4', 'Too many emotions for one screen'],
    correctIndex: 0,
    wittyToast: 'Well done gorgeous, that was insane skill. Beauty and brains in one package, honestly unfair to everyone else 👑💖',
    screenshotQuote: 'Heart audit complete: exactly 3. Discrete mathematics handled with style.',
  },

  // -------------------------------------------------------------------------
  // Category 6: Matric Stress Relievers & High School Tropes
  // -------------------------------------------------------------------------
  {
    id: 'zante_trope_01',
    category: 'matric_tropes',
    questionText: 'What is the primary function of a CASIO fx-82ZA calculator during matric finals?',
    options: ['Checking 7 + 8 just to be emotionally sure', 'Solving differential equations', 'Looking busy when the invigilator walks past', 'Spelling 07734 upside down'],
    correctIndex: 0,
    wittyToast: 'Emotional insurance: Because what if 7 + 8 changed since 2012?',
    screenshotQuote: 'Matric reality: Calculating 7 + 8 on CASIO just in case reality shifted.',
  },
  {
    id: 'zante_trope_02',
    category: 'matric_tropes',
    questionText: 'When the exam question says "Hence or otherwise", what does "otherwise" actually mean?',
    options: ['Take the scenic route and lose 20 minutes', 'The examiner is daring you to suffer', 'Use another method', 'Skip it'],
    correctIndex: 1,
    wittyToast: 'Pro tip: Always use "Hence". "Otherwise" is a psychological trap.',
    screenshotQuote: 'Exam translation: "Hence or otherwise" = "Use Hence or prepare for pain".',
  },
  {
    id: 'zante_trope_03',
    category: 'matric_tropes',
    questionText: 'The invigilator announces: "Ten minutes remaining". You are on Question 8. What is the move?',
    options: ['Write with the speed of sound and pray the handwriting is graded leniently', 'Accept your fate', 'Start drawing geometric shapes', 'Count your marks so far'],
    correctIndex: 0,
    wittyToast: 'Adrenaline protocol: Consistent accuracy marks can still save you.',
    screenshotQuote: 'Final 10 minutes: Speedrun algebra mode activated.',
  },
  {
    id: 'zante_trope_04',
    category: 'matric_tropes',
    questionText: 'What happens when you press "MODE SETUP 3" on your Casio fx-82ZA PLUS?',
    options: ['Table Mode and infinite power', 'The calculator explodes', 'It translates into French', 'It solves your life problems'],
    correctIndex: 0,
    wittyToast: 'Table mode is the ultimate matric cheat code for cubic graphs. You are ready.',
    screenshotQuote: 'Casio Mastery: Table Mode engaged. Cubic graph turning points tremble.',
  },
  {
    id: 'zante_trope_05',
    category: 'matric_tropes',
    questionText: 'If Paper 1 has 150 marks, how many marks are automatically awarded for spelling your name correctly in pen?',
    options: ['0, but the vibes are immaculate', 'At least 15 for penmanship', '150 emotional marks', '1 mark'],
    correctIndex: 0,
    wittyToast: 'The DBE memo gives zero marks for name aesthetics, but in this studio it gives you +100 aura.',
    screenshotQuote: 'Exam Logistics: 0 marks for handwriting, but +100 aura. The distinction is in the bag.',
  },
];

/**
 * Filter questions by category
 */
export function getZanteQuestionsByCategory(category: ZanteCategory): ZanteQuestion[] {
  return ZANTE_QUESTIONS.filter((q) => q.category === category);
}

/**
 * Look up a question by ID
 */
export function getZanteQuestionById(id: string): ZanteQuestion | undefined {
  return ZANTE_QUESTIONS.find((q) => q.id === id);
}

/**
 * Pick a random question, optionally excluding already completed question IDs
 */
export function getRandomZanteQuestion(excludeIds: string[] = []): ZanteQuestion {
  const pool = ZANTE_QUESTIONS.filter((q) => !excludeIds.includes(q.id));
  const candidatePool = pool.length > 0 ? pool : ZANTE_QUESTIONS;
  const randomIndex = Math.floor(Math.random() * candidatePool.length);
  return shuffleZanteQuestion(candidatePool[randomIndex]);
}
