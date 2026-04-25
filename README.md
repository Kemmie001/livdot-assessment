# Livdot Event Management

A React + TypeScript + Vite application for managing live-streaming events through a structured lifecycle.

**Live demo:** [https://livdot-assessment.vercel.app/events](https://livdot-assessment.vercel.app/events)

## Setup & Running

### Prerequisites

| Tool | Minimum version |
|------|----------------|
| Node.js | 18+ (tested on 20+) |
| Package manager | npm, yarn, or pnpm |

The project uses **yarn** (a `yarn.lock` is committed). Use the same manager to avoid lock-file conflicts.

### Install dependencies

```bash
yarn install
# or: npm install
```

### Start the dev server

```bash
yarn dev
# or: npm run dev
```

Opens at [http://localhost:5173](http://localhost:5173) by default (Vite's standard port).

> **No environment variables or external services are required.** The app runs entirely in-memory using a mock service layer — there is no real backend, no database, and no API keys to configure.

### Other scripts

| Command | What it does |
|---------|-------------|
| `yarn dev` | Start Vite dev server with HMR |
| `yarn build` | Type-check then produce a production bundle in `dist/` |
| `yarn preview` | Serve the production build locally |
| `yarn test` | Run Vitest in watch mode |
| `yarn test:run` | Single test run (CI-friendly) |
| `yarn test:coverage` | Single run with v8 coverage report |
| `yarn lint` | ESLint across the whole project |

### Notes

- **State is in-memory only.** All data (events, readiness checks) lives in module-level arrays inside `src/data/services/db.ts`. Refreshing the page resets everything to the seed data — this is intentional for the demo.
- **Route file is auto-generated.** `src/routeTree.gen.ts` is produced by the TanStack Router Vite plugin on every `yarn dev` or `yarn build`. Do not edit it manually; changes will be overwritten.
- **Path alias `@/`** maps to `src/` in both Vite (`vite.config.ts`) and Vitest (`vitest.config.ts`), so imports like `@/data/types/event.types` resolve correctly in both environments.

---

## Implementation Notes

### Component Structure

The UI is organised into two primary views, each paired with a dedicated hook that owns all logic:

```
src/
├── views/
│   ├── event-list/
│   │   ├── EventListView.tsx          # Renders event cards, empty/loading states, create button
│   │   ├── useEventList.ts            # Fetches events, exposes modal opener
│   │   └── components/
│   │       ├── EventCard.tsx          # Single event row with state badge + navigation
│   │       ├── EventStateBadge.tsx    # Colour-coded badge for lifecycle state
│   │       └── CreateEventModal.tsx   # Controlled dialog for creating a new event
│   │
│   └── event-dashboard/
│       ├── EventDashboardView.tsx     # Orchestrates all dashboard panels
│       ├── useEventDashboard.tsx      # Aggregates state machine, readiness, and local UI state
│       └── components/
│           ├── EventLifecycleTracker.tsx    # Step-tracker showing ordered lifecycle states
│           ├── EventActionPanel.tsx         # Primary CTA derived from current state
│           ├── ReadinessChecklist.tsx       # Host-actionable requirement items
│           ├── ReadinessStatusPanel.tsx     # Summary panel (shown alongside preview card)
│           ├── EventPreviewCard.tsx         # Thumbnail + price editor
│           ├── LiveStreamSimulator.tsx      # Simulated live-stream widget (live state only)
│           ├── ReplayPlayer.tsx             # Replay playback widget (replay state only)
│           └── OperationalStatusBanner.tsx  # Degraded/outage banner (live state only)
│
├── data/
│   ├── types/           # event.types.ts, readiness.types.ts
│   ├── schemas/         # Zod schemas for validation
│   ├── services/        # eventService, readinessService, operationalService (mock DB)
│   └── queries/         # React Query hooks (useEvents, useEvent, useReadiness, …)
│
├── store/
│   ├── optimisticStore.ts   # Zustand: tracks in-flight state transitions per event
│   └── uiStore.ts           # Zustand: tracks which modal is open
│
├── constants/
│   ├── eventLifecycle.ts        # VALID_TRANSITIONS, STATE_LABELS, ordered states, styles
│   └── readinessRequirements.ts # Metadata for each readiness requirement key
│
└── utils/
    ├── eventStateUtils.ts   # Pure functions: getPrimaryAction, getAllBlockedReasons
    └── readinessUtils.ts    # Pure helpers for readiness report evaluation
```

The components under `views/shadcn/` are a local copy of shadcn/ui primitives treated as a UI library — they carry no business logic.

---

### State Management Approach

Three layers of state work together:

#### 1. Server state — React Query
All event and readiness data is fetched and cached with `@tanstack/react-query`. Mutations (create, transition) invalidate the relevant query keys on success so the UI stays consistent with the server without manual cache writes.

#### 2. Optimistic UI — Zustand (`optimisticStore`)
When a lifecycle transition is triggered, `useTransitionEvent` immediately writes the target state into `optimisticStore.pendingTransitions[eventId]` before the request completes. `useEventStateMachine` prefers the pending state over the server state when computing `displayState`, so the UI reacts instantly. On success or error the pending entry is cleared and the server state takes over.

```
trigger transition
  → setPending(eventId, targetState)          ← optimistic store
  → mutationFn fires                          ← server request
  → on success: clearPending + invalidate     ← server state takes over
  → on error:   clearPending                  ← rolls back to last known server state
```

#### 3. Local / ephemeral state — Zustand (`uiStore`) + React `useState`
Modal visibility is held in `uiStore` so any component can open the create-event modal without prop drilling. Thumbnail previews and ticket price are `useState` local to `useEventDashboard` — they are not persisted and exist only for the current session.

#### State machine
Lifecycle logic is pure and data-driven. `VALID_TRANSITIONS` in `eventLifecycle.ts` is the single source of truth for what moves are legal. `eventStateUtils.ts` derives the primary CTA and blocked reasons from the current state and readiness report with no side effects, making the logic straightforward to unit-test independently of React.

---

### Assumptions & Tradeoffs

**Mock backend** — The app uses an in-memory service layer (`src/data/services/db.ts`) seeded with fake data. There is no real API; all mutations update module-level arrays in memory, so state resets on page refresh. This was the right call for a self-contained demo but would need to be swapped for real HTTP clients before production.

**Thumbnail and price are local-only** — Thumbnail selection and ticket pricing are stored in `useState` inside `useEventDashboard`. They influence readiness checks in the UI but are never sent to the server. The host-side toggles in `ReadinessChecklist` are the mechanism for satisfying requirements server-side; the thumbnail/price fields illustrate that flow rather than providing true persistence.

**Single primary action per state** — `getPrimaryAction` always returns at most one CTA. This simplifies the action panel but rules out multi-path branching (e.g., a parallel "cancel" action). States generally move forward; the one back-transition (`scheduled → draft`) is supported in the state machine but not currently surfaced in the UI.

**Optimistic rollback is silent** — On a failed transition the optimistic state is cleared and a toast is shown, but the UI snaps back to the previous server state without animation. This is acceptable for an internal tool but would feel jarring in a high-concurrency consumer product.

**Readiness is fetched on demand, not pushed** — `useReadiness` fetches on mount and on explicit query invalidation. There is no WebSocket or polling interval, so external readiness changes (e.g., crew assignment by a third party) only surface after a page reload or a transition that triggers invalidation. A production system would push these updates.

**No auth layer** — The app assumes a single host user. Access control and multi-tenancy were intentionally out of scope.
