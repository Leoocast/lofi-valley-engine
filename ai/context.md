# FUNDAMENTAL PRINCIPLE: HEADLESS GAME ENGINE

This project uses a Headless Game Engine architecture.

Definition:

- The game does not depend on React to exist.
- React is NOT the engine, it's just a visualization and input layer.
- All simulation lives outside of React.

If React disappears tomorrow, the game keeps running.

# LAYER ROLES

## Engine [(src/engine)](../src/engine)

Responsibilities:

- Game time
- Simulations (crops, water, growth, weather, etc.)
- World rules
- Canonical state
- Deterministic logic

Prohibitions:

- NO JSX
- NO React hooks
- NO visual effects
- NO UI logic

The engine is blind: it doesn't know how the game looks.

## State – ZUSTAND

Zustand is the bridge between Engine and React.

Rules:

Zustand contains the single source of truth

- The Engine writes to Zustand
- React only reads from Zustand
- React never mutates world logic directly (Unless they are simple things, like changing a boolean in the view that doesn't affect the world or ticks)
- Zustand is preferably used in vanilla store mode to:
  - Avoid unnecessary renders
  - Be able to update from loops and systems

Mental example:
[(src/engine/systems/tickSystem.ts)](../src/engine/systems/tickSystem.ts)
<br/>
Time advances → Engine calculates → Zustand updates → React reacts
<br/>
<strong>NEVER THE OTHER WAY AROUND.</strong>

## React [(src/views)](../src/views)

Responsibilities:

- Render state
- Handle input (mouse, keyboard)
- Show animations, UI, visual feedback

Prohibitions:

- NO simulation logic
- NO game timers
- NO growth rules
- NO "if 2 hours pass then…"

React observes, it doesn't decide.

## TIME SYSTEM (CRITICAL)

Game time:

- Does NOT depend on real time
- Does NOT depend on frame rate
- Can go at x1, x10, pause or accelerate

Rules:

- The Engine controls time
- Time is calculated by ticks (still thinking about deltaTime if necessary in the future)
- React only shows "it's 6:00 AM"

# AI COLLABORATION RULES

When an AI works on this project:

Must:

- Respect the headless architecture
- Think like a game designer + systems engineer
- Propose simple solutions before complex ones (Always seeking performance)
- Prioritize clarity over "generic best practices" (Very important)

Must not:

- Rewrite code without being asked
- Put logic in React "for convenience"
- Introduce unnecessary dependencies
- Break Engine / View separation

## PERFORMANCE FIRST (WITHOUT OVERENGINEERING)

This project prioritizes performance and stability at all times.

### Core principle

We seek:

- The fewest possible re-renders
- The least amount of work per frame
- Clarity + efficiency, not "clever code"

But we do NOT seek:

- Optimizing by reflex
- Irrelevant micro-optimizations
- Unnecessary complexity

### Main rule

If an optimization adds hundreds or thousands of lines of code to save ~1ms, it is NOT done.

Cognitive cost matters more than marginal gain.

### React and Performance

Rules:

- React only re-renders when truly necessary
- Specific selectors are used in Zustand (Very important)
- Avoid passing large or mutable objects as props

World logic should not be recalculated in components

Acceptable:

- A cheap re-render
- A trivial calculation in render
- Well-understood simplicity

Not acceptable:

- Re-renders due to unnecessary global state
- Chained useEffect for game logic
- "Optimizing" without measuring or without a real problem

### Engine and Performance

Rules:

- Simulation runs outside of React
- The Engine can update state without causing immediate renders
- Systems must be predictable and deterministic

Logic must scale well with x1 / x10 without multiplying cost

Acceptable:

- Clear logic even if not the most micro-optimized
- A simple and readable loop

Not acceptable:

- Abstract systems just "in case" (VERY IMPORTANT, if you have any questions about future design, ask me)
- Generalizations that nobody needs yet
- Preventive overengineering

### Optimization philosophy

Correct order:

1.- Correct design
2.- Clear code
3.- Measure
4.- Optimize only what hurts

Never the other way around.

### Guiding phrase (for AI and collaborators)

- Performance matters.
- Clarity matters more.
- Overengineering kills the project faster than 2ms extra.

The player doesn't see the profiler, but they do feel the lag.

### Summary of key points to keep in mind

- React renders, the Engine decides.
- State lives in Zustand.
- Time is a simulation, not a clock.
- If it only works at x1, it's poorly designed.
- The player controls the pace, not the system.

## CURRENT DEVELOPMENT STATUS

### Temporarily Disabled Mechanics

**Crop Death**

- **Status**: Disabled during development
- **Implementation**: All `deathTimeWithoutWater` and `deathTimeWithoutHarvest` values in `cropConfigs.ts` are set to `Infinity`
- **Reason**: Will be implemented later with a new improved mechanic
- **Location**: `src/constants/cropConfigs.ts`
- **Affected system**: `CropGrowthSystem.ts` (comparisons `>=` with `Infinity` never succeed, preventing crop death)
