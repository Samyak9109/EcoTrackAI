# EcoTrack AI

EcoTrack AI is a lightweight personal carbon footprint assistant. It helps
individuals estimate where their emissions come from, identify their highest
impact habits, explore possible changes, and build practical low-carbon routines.

## Chosen Vertical

**ClimateTech and Sustainability: Personal Carbon Management**

The project focuses on the gap between climate awareness and everyday action.
Carbon information is often difficult to interpret, while generic sustainability
tips do not account for a person's actual routine. EcoTrack AI converts a small
set of lifestyle inputs into:

- An estimated monthly carbon footprint
- A carbon score and category breakdown
- Context-aware recommendations
- A seven-day action plan
- What-if comparisons
- Trackable daily actions

The goal is awareness and behavior guidance, not scientific carbon accounting.

## Product Features

- Lifestyle-based carbon footprint calculator
- Monthly footprint estimate in kg CO2e
- Carbon score from 0 to 100
- Transport, electricity, food, shopping, and waste breakdown
- Highest-emission category detection
- Personalized recommendation engine
- Local rule-based smart assistant
- Seven-day low-carbon action plan
- What-if lifestyle simulator
- Daily eco-action tracker
- Completion count, estimated monthly saving potential, and streak
- Profile history for comparing updated estimates
- Responsive and keyboard-accessible interface
- Browser-only persistence with no account or backend

## Approach and Logic

The solution uses deterministic, explainable rules instead of an external AI
service. This keeps the prototype fast, private, inexpensive, and usable without
API keys.

### 1. Lifestyle Profile

The user provides eight non-sensitive lifestyle inputs:

- Daily commute distance
- Primary transport mode
- Monthly electricity usage
- Diet type
- Monthly online order frequency
- General shopping frequency
- Recycling behavior
- Daily AC usage

Numeric inputs are validated and cannot be negative.

### 2. Carbon Calculation Method

Approximate emission factors are stored locally in
`src/data/emissionFactors.ts`.

The monthly category estimates are calculated as follows:

```text
transport =
  daily commute distance x 22 commute days x transport emission factor

electricity =
  monthly electricity units x electricity emission factor

food =
  monthly estimate for the selected diet type

shopping =
  shopping-frequency estimate
  + online orders x delivery estimate

waste =
  recycling or non-recycling monthly estimate

total =
  transport + electricity + food + shopping + waste
```

The carbon score is:

```text
score = clamp(100 - total / 5, 0, 100)
```

Score labels:

| Score | Label |
| --- | --- |
| 80-100 | Climate Champion |
| 60-79 | Eco Improver |
| 40-59 | Getting Started |
| 0-39 | High Impact Lifestyle |

### 3. Recommendation Method

Each action in `src/data/actionLibrary.ts` contains:

- Category
- Description
- Estimated monthly saving potential
- Difficulty
- A condition that determines whether it applies to the profile

The recommendation engine:

1. Removes actions that do not apply to the user.
2. Prioritizes actions from the user's highest-emission category.
3. Sorts actions by estimated saving potential.
4. Uses difficulty as the final ranking factor.
5. Returns the highest-ranked actions for the requested view.

This prevents obviously irrelevant suggestions. For example, vegetarian users
are not given beginner meat-reduction actions, and users who already recycle
receive improved sorting and reuse guidance instead.

### 4. Smart Assistant Method

The assistant is rule-based and runs entirely in the browser. It detects intent
from keywords and supports:

- General reduction advice
- Transport guidance
- Electricity guidance
- Food guidance
- Shopping guidance
- Waste guidance
- Score explanation
- Seven-day planning
- What-if questions

After detecting the intent, it combines:

- The user's profile
- Current category estimates
- Highest-emission category
- Applicable actions

This produces short contextual responses rather than static generic tips.

### 5. What-If Simulation Method

The simulator creates a temporary copy of the current profile and allows the
user to change:

- Transport mode
- Monthly commute days
- Electricity usage
- Diet type
- Online order frequency

The calculator runs once for the current profile and once for the modified
profile. The signed difference shows whether the scenario reduces or increases
the monthly estimate.

### 6. Action Tracking Method

Completed actions store only:

```ts
{
  actionId: string;
  completedAt: string;
}
```

Saving values are derived from the central action library so stored data does
not become stale when an action is updated. Repeating the same action on
multiple days contributes to the streak, but its monthly saving potential is
counted only once.

## How the Solution Works

1. The landing page explains the product and privacy model.
2. The user completes the lifestyle profile.
3. EcoTrack calculates the monthly estimate and carbon score.
4. The dashboard displays the category breakdown and biggest contributor.
5. The recommendation engine provides relevant next actions.
6. The assistant answers questions using the same profile and result.
7. The simulator compares possible lifestyle changes.
8. The tracker records completed actions and calculates a daily streak.
9. Updating the profile adds a new estimate to local history.

Hash-based navigation is used so the prototype works as a static frontend
without requiring server-side route configuration.

## Architecture

```text
src/
  components/   Shared layout, cards, charts, and empty states
  data/         Emission factors, option metadata, and action library
  pages/        Landing, profile, dashboard, assistant, tracker, simulator
  styles/       Feature-owned CSS and responsive rules
  tests/        Unit and regression tests
  types/        Shared TypeScript contracts
  utils/        Calculation, recommendations, assistant, tracking, storage
```

Core responsibilities are separated from UI code:

- `carbonCalculator.ts`: footprint, score, and highest category
- `recommendationEngine.ts`: action filtering and ranking
- `assistantEngine.ts`: intent detection and personalized responses
- `simulator.ts`: current versus projected comparison
- `actionTracking.ts`: savings lookup and streak calculation
- `storage.ts`: safe localStorage access and history management

## AI-Assisted Development Workflow

EcoTrack AI was developed using multiple AI tools with separate,
purpose-specific roles. These tools supported planning, design, implementation,
and review; they are not runtime dependencies of the application.

### Antigravity: Primary Project Workspace

Antigravity was used as the main environment for developing and maintaining the
project. It supported the end-to-end workflow, including:

- Understanding and organizing the project requirements
- Planning features and implementation phases
- Coordinating development tasks
- Reviewing project structure and code quality
- Improving tool selection and tool calls
- Validating the finished prototype

Antigravity skills were used to bring specialized workflows into the project.
This included **Caveman** and other relevant skills for clearer decomposition,
more effective tool usage, implementation support, and maintainability review.

### Stitch: UI and Product Design

Stitch was used as the design-focused AI role. It helped shape the visual
direction and user experience of the product, including:

- Eco-friendly green and blue visual language
- Landing-page and dashboard composition
- Card, form, navigation, and mobile layout patterns
- Clear visual hierarchy for scores, emissions, and recommended actions
- A lightweight interface that avoids large design frameworks and media assets

The resulting design was implemented as responsive React components and
feature-owned CSS.

### Plan Mode and Gemini: PRD Generation

Plan Mode, together with Gemini, was used during the product-definition stage
to generate and refine the Product Requirements Document (PRD). This process
helped define:

- The ClimateTech problem and target user
- Product scope and MVP priorities
- Required pages and user journeys
- Carbon calculation assumptions
- Smart-assistant intents and expected behavior
- Accessibility, security, privacy, testing, and efficiency requirements
- The phased implementation plan

The PRD was treated as a planning artifact. The final implementation was
validated against the actual code, tests, and browser behavior.

### AI Role Summary

| AI tool or workflow | Role in the project |
| --- | --- |
| Antigravity | Primary development environment and project coordination |
| Antigravity skills | Specialized planning, tool-use, implementation, and review workflows |
| Caveman skill | Requirement decomposition and practical task breakdown |
| Stitch | UI direction, screen design, layout, and visual hierarchy |
| Plan Mode | Structured product planning and implementation sequencing |
| Gemini | PRD generation and refinement support |

No generated AI output was used as a substitute for validation. The final
project was compiled, tested, reviewed, and exercised through its main browser
workflow.

## Assumptions

1. A typical monthly commute contains 22 travel days.
2. Commute distance represents the distance used once per commute day in the
   simplified prototype formula.
3. Electricity input is provided in monthly billing units.
4. Diet emissions are represented by broad monthly category estimates.
5. Shopping and waste behavior can be represented using simple frequency bands.
6. Online orders use one average delivery emission factor.
7. Recycling behavior is represented as a yes/no input.
8. AC usage affects recommendations but is not added as a separate emission
   category because it is already reflected in the electricity input.
9. Action savings are directional estimates and are not added to or subtracted
   from the calculated footprint automatically.
10. All users use the app on one browser and device; there is no cloud sync.
11. LocalStorage is sufficient for hackathon-scale persistence.
12. The prototype does not collect identity, payment, address, or exact location
    data.

## Privacy and Security

- No backend or database
- No external AI API
- No API keys
- No user account
- No identity data
- No unsafe HTML rendering
- Profile, actions, and history remain in browser localStorage
- Storage failures are handled without crashing the application

LocalStorage keys:

```text
ecotrack_profile
ecotrack_actions
ecotrack_history
```

## Technology

- React
- Vite
- TypeScript
- CSS
- Vitest

The project intentionally avoids chart libraries, UI frameworks, image packs,
AI SDKs, and other heavy dependencies.

## Run Locally

Requirements:

- Node.js 20 or newer
- npm

```bash
npm install
npm run dev
```

Open the URL printed by Vite, normally:

```text
http://localhost:5173/
```

## Test and Build

```bash
npm test
npm run build
```

The test suite covers:

- Carbon calculations and score boundaries
- Highest-category detection
- Recommendation relevance
- Assistant intent responses and seven-day plans
- What-if simulation changes
- Action saving and streak behavior
- Legacy localStorage normalization
- History deduplication

## Limitations

- Emission factors are simplified and not region-specific.
- The estimates do not include every source of personal emissions.
- The assistant understands predefined keyword-based intents, not unrestricted
  natural language.
- Savings are awareness estimates rather than verified reductions.
- Data is not synchronized between browsers or devices.

## Disclaimer

Carbon calculations and action savings are approximate. EcoTrack AI is intended
for awareness, education, and behavior guidance, not scientific reporting,
regulatory disclosure, or certified carbon accounting.
