# 🌟 Zante's Matric Maths Studio — Paper 2 Edition (Grade 12 CAPS Pure Mathematics)

A high-performance, self-contained interactive web application built by **Andre** for **Zante**, an 18-year-old Grade 12 Matriculant (Class of 2026) preparing exclusively for her **South African CAPS National Senior Certificate (NSC) Mathematics Paper 2 (150 Marks)** examinations.

The studio pairs serious, Paper 2 exam-accurate Matric preparation (Statistics, Analytical Geometry, Trigonometry, Euclidean Geometry) with effortless 2026 18-year-old energy, feisty/witty screenshot-worthy banter, hidden milestones, viral meme sound effects, and an **Apple Design Award–caliber Liquid Glass & Iridescent Prismatic White UI**.

---

## 🌐 Official Live Deployment & Repository Endpoints

- 🌐 **Live Web Application (GitHub Pages):** [https://andrelamusse.github.io/Zante-Matric-Maths/](https://andrelamusse.github.io/Zante-Matric-Maths/)
- 📁 **Official GitHub Repository:** [https://github.com/andrelamusse/Zante-Matric-Maths](https://github.com/andrelamusse/Zante-Matric-Maths)

---

## 🚀 Running Locally

```bash
# 1. Navigate to the project directory
cd c:\NWU\zante-matric-maths

# 2. Start the local preview server
npx vite preview --port 4173
# OR start dev mode:
npx vite --port 5173
```
Open **`http://localhost:4173/`** or **`http://localhost:5173/`** in any browser.

---

## 💎 Core Architecture & Features

### 1. Dual-Paper Separation (Paper 1 vs. Paper 2)
The application is cleanly divided into the two distinct NSC examinations:
- **📘 Paper 1 (150 Marks)**:
  - Algebra, Equations & Inequalities ($25 \pm 3$ marks)
  - Number Patterns, Sequences & Series ($25 \pm 3$ marks)
  - Functions, Inverses & Graphs ($35 \pm 3$ marks)
  - Finance, Growth & Decay ($15 \pm 3$ marks)
  - Differential Calculus ($35 \pm 3$ marks)
  - Probability & Counting Principles ($15 \pm 3$ marks)
- **📐 Paper 2 (150 Marks)**:
  - Statistics & Regression ($20 \pm 3$ marks)
  - Analytical Geometry ($40 \pm 3$ marks)
  - Trigonometry ($50 \pm 3$ marks)
  - Euclidean Geometry ($40 \pm 3$ marks) with official DBE acceptable short reasons

### 2. Dual-Difficulty Engine
- **🌸 Zante Difficulty (The Feisty/Witty Joke Mode)**:
  - Kindergarten-level, zero-stress questions (*"What number comes right after 3?"*, iced coffee priority math, passenger princess calculations).
  - Every answer triggers celebratory glass chimes, confetti bursts, iridescent refractions, and witty, playfully teasing + subtly cute banter designed to be screenshot-shared with her friends.
- **🔥 Andre Difficulty (Authentic NSC Matric Exam Standard)**:
  - Multi-step, rigorous CAPS questions calibrated to the cognitive distribution (L1 20%, L2 35%, L3 30%, L4 15%) of the latest 20 DBE NSC exam papers (Nov, May/June Second Opportunity, and Sept Record/Prelim exams).
  - Powered by both curated past-paper items and parametric generators for infinite practice.

### 3. Dual Audio Engine & Sassy Voice Reactions
- **Audio Modes (Toggle in Header)**:
  - **🥂 Classy Glass Audio**: Pure crystalline harmonic chimes and Apple-style tactile feedback.
  - **💀 Unhinged Meme Audio**: Synthesized viral meme stingers:
    - **Vine Boom / Bass Drop**: Triggers immediately on switching from `Andre Difficulty` back to `Zante Difficulty` or on roasts.
    - **Bombastic Side-Eye / Sad Trombone / "Bruh" Thud**: Plays when she misses an easy question on Zante Difficulty.
    - **Sparkly Baddie Shimmer + Paparazzi Camera Shutters 📸**: Plays when she gets a Zante Difficulty question right ("Smart AND pretty").
    - **Game Show Jackpot / Airhorn**: Plays on 5x, 10x, and 20x streaks.
- **🗣️ Sassy Verbal Voice Reactions (Web Speech API)**:
  - Speaks snappy verbal reactions out loud on right/wrong answers and streak milestones.
  - **Read Vibe Check 🔊**: Dedicated button in the explanation drawer to read the intuitive math breakdown aloud.

### 4. Dual-Layer Explanations & Gamification
- **✨ Layer 1: "Zante Vibe Check"**: Intuitive concept explanation in a sharp, effortless 2026 18-year-old voice (zero cringe slang).
- **📝 Layer 2: "Full-Marks NSC Memo"**: Official DBE marking criteria with step-by-step KaTeX working and tick allocations (`✓`).
- **🔥 Streak Heat Meter**: 5 visual tiers from Pearl Glow to Liquid Diamond Supernova.
- **🛡️ Pretty Privilege Streak Shield**: Automatically protects the streak on brutal Level 4 questions.
- **👑 VIP Hype Vault (5-Tap Crown Easter Egg)**: Tapping Zante's crown badge 5 times in the header unlocks Andre's Official 4-point disclaimer, shield refill, and confetti shower.

### 5. Matric Power Tools & Visualizers
- **📄 Official NSC Formula Sheet Drawer (Key: `F`)**: Slide-over frosted glass drawer containing all 44 formulas with live search and active question highlighting.
- **✏️ Glass Scratchpad Overlay**: Canvas doodling with 5 pastel inks, undo/redo, and high-DPI smoothing.
- **📐 Interactive Dynamic SVGs**: Real-time Cartesian coordinate renderers for parabolas, hyperbolas, exponential curves, circles with perpendicular tangents, CAST unit circle trigonometry, five-number summary box plots, and circle theorems.

### 6. One-Pager Cheat Sheets & 20-Exam Simulator
- **📑 10 One-Pager Cheat Sheets**: Full-topic cheat sheets featuring formulas, top 50 examiner traps with counter-strategies, 22 decision recipes, and 43 official Euclidean geometry reasons.
- **⏱️ 20-Paper NSC Exam Simulator**: Authentic 150-mark Paper 1 & Paper 2 mock exam with 3-hour countdown timer, question matrix palette, flag toggle, score report, and ticked memo review.

---

## 🧪 Automated Test Suite (422/422 Passing)

```bash
# Run strict TypeScript type check
npx tsc --noEmit

# Run complete 422-test automated suite
node --test tests/*.test.mjs

# Build production bundle
npx vite build
```
