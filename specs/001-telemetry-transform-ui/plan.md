# Implementation Plan: Telemetry Transformation UI Demo

**Branch**: `001-telemetry-transform-ui` | **Date**: November 1, 2025 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-telemetry-transform-ui/spec.md`

## Summary

Build an intuitive, visual UI for transforming OpenTelemetry data without requiring users to write OTTL (OpenTelemetry Transformation Language) code. The demo application displays hardcoded telemetry sample data in a hierarchical tree view with interactive transformation capabilities including add, delete, mask, rename attributes, and substring extraction. Users can preview transformations in real-time, reorder them via drag-and-drop, and use keyboard shortcuts for efficient workflows. The focus is on tactile UX with immediate visual feedback, color-coded operations, and clear change indicators.

**Technical Approach**: Next.js 15 App Router with React Server Components where possible, TypeScript for type safety, Shadcn UI components with Tailwind CSS for styling, Framer Motion for animations and drag-and-drop, and a client-side transformation engine that applies OTTL-equivalent operations to the hardcoded sample data.

## Technical Context

**Language/Version**: TypeScript 5.x with Next.js 15 (App Router)
**Primary Dependencies**: 
- React 19 (Server Components + Client Components)
- Shadcn UI component library
- Tailwind CSS for styling
- Framer Motion for animations and drag-and-drop
- @dnd-kit/core for advanced drag-and-drop (alternative to Framer Motion's drag)
- Zustand or React Context for state management
- OpenTelemetry Protocol types (@opentelemetry/api, @opentelemetry/otlp-transformer)

**Storage**: N/A (demo uses hardcoded sample data in-memory, no persistence)
**Testing**: Vitest for unit tests, React Testing Library for component tests, Playwright for E2E tests
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari, Edge) - responsive design with mobile-first approach
**Project Type**: Web application (Next.js single-page application structure with /src directory)
**Performance Goals**: 
- <100ms response time for UI interactions (hover, click, focus)
- <200ms for transformation preview execution
- 60fps animations for drag-and-drop and transitions
- Support for telemetry samples with 100+ attributes without performance degradation

**Constraints**: 
- Demo-only (no backend, no real OTTL engine integration)
- Hardcoded sample data only
- Must work entirely client-side
- Keyboard navigation must be fully functional (accessibility requirement)
- Panel resizing must be smooth and responsive

**Scale/Scope**: 
- Single demo page/route
- ~15-20 React components
- Support for 6 transformation types (Add, Delete, Mask, Rename, Substring, Raw OTTL)
- ~50 test scenarios covering all user stories
- Single user (no auth, no multi-user features)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Note**: No project-specific constitution has been defined yet. Applying general Next.js and React best practices:

### ✅ Architectural Principles
- **Server-First Approach**: Use React Server Components by default for optimal performance
- **Client Components Only When Needed**: Limit `'use client'` to components requiring interactivity (transformation editor, drag-and-drop)
- **Component Modularity**: Each transformation type, UI section, and interaction pattern should be independently testable
- **Type Safety**: Comprehensive TypeScript interfaces for all data structures (telemetry format, transformations, UI state)

### ✅ Code Organization
- **Feature-Based Structure**: Components organized by feature domain (telemetry-display, transformations, panels)
- **Shared UI Components**: Reusable components in `/src/components/ui` (from Shadcn)
- **Business Logic Separation**: Transformation logic separated from UI components
- **State Management**: Minimal state with clear boundaries (transformation list, active transformations, UI state)

### ✅ Quality Gates
- **Test Coverage**: All transformation logic must have unit tests
- **Accessibility**: WCAG 2.1 AA compliance (keyboard navigation, ARIA labels, focus management)
- **Performance Budget**: Lighthouse score >90 for Performance, Accessibility, Best Practices
- **Code Quality**: ESLint + Prettier configuration, no console.logs in production

### ✅ Development Practices
- **Mobile-First**: Responsive design starting from mobile viewport
- **Incremental Development**: Build transformations one at a time (Add → Delete → Mask → Rename → Substring → Raw OTTL)
- **Visual Testing**: Each component should be visually verifiable in isolation
- **Error Boundaries**: Graceful error handling for transformation failures

**Status**: ✅ All gates passed - proceeding to Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/001-telemetry-transform-ui/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification (already exists)
├── checklists/          # Quality checklists (already exists)
│   └── requirements.md
├── research.md          # Phase 0 output (to be created)
├── data-model.md        # Phase 1 output (to be created)
├── quickstart.md        # Phase 1 output (to be created)
└── contracts/           # Phase 1 output (to be created)
    ├── telemetry-types.ts        # TypeScript interfaces for OTLP format
    ├── transformation-types.ts    # Transformation operation types
    └── ui-state-types.ts          # UI state management types
```

### Source Code (repository root)

```text
src/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Main demo page (transformation UI)
│   └── globals.css               # Global styles (Tailwind imports)
│
├── components/                   # Feature components
│   ├── ui/                       # Shadcn UI components (button, input, tooltip, etc.)
│   │   ├── button.tsx
│   │   ├── tooltip.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── panels/                   # Panel layout components
│   │   ├── split-panel.tsx       # Resizable split panel container
│   │   ├── input-panel.tsx       # Left panel (INPUT)
│   │   ├── output-panel.tsx      # Right panel (OUTPUT)
│   │   └── panel-divider.tsx     # Draggable divider
│   │
│   ├── telemetry-display/        # Telemetry tree view components
│   │   ├── telemetry-tree.tsx    # Main tree component
│   │   ├── tree-section.tsx      # Collapsible section (Resource, Span, etc.)
│   │   ├── attribute-row.tsx     # Key-value pair display
│   │   └── syntax-highlighter.tsx # Code-like syntax coloring
│   │
│   ├── transformations/          # Transformation operation components
│   │   ├── transformation-list.tsx           # Container for all transformations
│   │   ├── transformation-row.tsx            # Base transformation row
│   │   ├── add-attribute-form.tsx            # Add static attribute form
│   │   ├── delete-attribute-button.tsx       # Delete button & state
│   │   ├── mask-value-selector.tsx           # Value selection & masking
│   │   ├── rename-key-form.tsx               # Key renaming form
│   │   ├── substring-attribute-form.tsx      # Substring extraction form
│   │   ├── raw-ottl-form.tsx                 # Raw OTTL input form
│   │   └── transformation-labels.tsx         # ADD/DELETE/MASK labels
│   │
│   ├── keyboard-hints/           # Keyboard navigation hints
│   │   └── keyboard-hints-bar.tsx
│   │
│   └── section-header/           # Section header with action buttons
│       ├── section-header.tsx
│       └── update-counter.tsx
│
├── lib/                          # Business logic & utilities
│   ├── telemetry/                # Telemetry data handling
│   │   ├── sample-data.ts        # Hardcoded OTLP sample
│   │   ├── telemetry-parser.ts   # Parse OTLP JSON into tree structure
│   │   └── telemetry-formatter.ts # Format for display
│   │
│   ├── transformations/          # Transformation engine
│   │   ├── transformation-engine.ts          # Main engine - applies transformations
│   │   ├── operations/           # Individual transformation operations
│   │   │   ├── add-attribute.ts
│   │   │   ├── delete-attribute.ts
│   │   │   ├── mask-value.ts
│   │   │   ├── rename-key.ts
│   │   │   ├── substring-attribute.ts
│   │   │   └── raw-ottl.ts       # Stub for raw OTTL
│   │   └── transformation-validator.ts       # Validate transformation inputs
│   │
│   ├── state/                    # State management
│   │   ├── transformation-store.ts           # Zustand store for transformations
│   │   ├── ui-store.ts                       # UI state (panel sizes, selection)
│   │   └── hooks.ts                          # Custom React hooks
│   │
│   └── utils/                    # Utility functions
│       ├── keyboard.ts           # Keyboard event handlers
│       ├── drag-drop.ts          # Drag-and-drop utilities
│       └── clipboard.ts          # Clipboard operations (placeholder)
│
├── types/                        # TypeScript type definitions
│   ├── telemetry.ts              # OTLP data structures
│   ├── transformations.ts        # Transformation operation types
│   └── ui.ts                     # UI state types
│
└── styles/                       # Additional styles
    └── transformations.css       # Transformation-specific styles (colors, backgrounds)

tests/
├── unit/                         # Unit tests
│   ├── transformations/          # Transformation engine tests
│   │   ├── add-attribute.test.ts
│   │   ├── delete-attribute.test.ts
│   │   ├── mask-value.test.ts
│   │   └── ...
│   ├── telemetry/                # Telemetry parsing tests
│   │   └── telemetry-parser.test.ts
│   └── utils/                    # Utility function tests
│       └── keyboard.test.ts
│
├── component/                    # Component tests (React Testing Library)
│   ├── attribute-row.test.tsx
│   ├── add-attribute-form.test.tsx
│   └── ...
│
└── e2e/                          # End-to-end tests (Playwright)
    ├── transformation-workflow.spec.ts       # Complete transformation flow
    ├── keyboard-navigation.spec.ts           # Keyboard shortcuts
    └── drag-drop.spec.ts                     # Reordering transformations

```

**Structure Decision**: Selected **Web Application** structure with Next.js App Router. The `/src` directory contains all source code as per user rules. Components are organized by feature domain (panels, telemetry-display, transformations) with shared UI components from Shadcn in `/src/components/ui`. Business logic is separated into `/src/lib` with clear boundaries between data handling, transformation engine, and state management. This structure supports the iterative development approach and makes components independently testable.

## Complexity Tracking

No constitutional violations identified. The architecture follows standard Next.js patterns with clear separation of concerns:

| Aspect | Justification |
|--------|---------------|
| Client-side only | Appropriate for demo - no backend needed, simplifies deployment |
| Zustand for state | Lightweight state management, avoids prop drilling for transformation list |
| Multiple transformation types | Required by spec - each type has distinct UX and logic |
| Drag-and-drop library | Accessibility and smooth UX require mature library (@dnd-kit or Framer Motion) |

All complexity is driven by feature requirements in the specification. No unnecessary abstractions introduced.
