# Technical Research: Telemetry Transformation UI Demo

**Feature**: 001-telemetry-transform-ui  
**Date**: November 1, 2025  
**Status**: Completed

## Overview

This document captures technical decisions, best practices research, and rationale for technology choices made during the planning phase of the telemetry transformation UI demo.

## Research Areas

### 1. OpenTelemetry Protocol (OTLP) Data Handling

**Decision**: Use TypeScript interfaces matching OTLP JSON format for type safety

**Rationale**:
- The hardcoded sample data follows OTLP JSON format (resourceSpans structure)
- Strong typing prevents runtime errors when traversing nested telemetry structure
- Enables IDE autocomplete and type checking throughout the application
- Official `@opentelemetry/api` package provides standard type definitions

**Implementation Approach**:
- Import types from `@opentelemetry/api` where available
- Create custom TypeScript interfaces for display-specific structures (flattened tree view)
- Parser transforms OTLP nested format into flat, displayable attribute lists
- Maintain traceability between original OTLP structure and display representation

**Alternatives Considered**:
- **Dynamic/untyped objects**: Rejected - prone to runtime errors, poor DX
- **Zod schemas with runtime validation**: Rejected - unnecessary overhead for hardcoded data
- **GraphQL schema**: Rejected - no API layer needed for demo

---

### 2. Drag-and-Drop Implementation

**Decision**: Use `@dnd-kit/core` for drag-and-drop functionality

**Rationale**:
- Accessibility-first design with built-in keyboard navigation support
- Smooth animations with customizable transitions
- Flexible API for complex constraints (section-restricted dragging)
- Lightweight and performant
- Active maintenance and excellent TypeScript support
- Better accessibility than native HTML5 drag-and-drop

**Implementation Approach**:
- DndContext wrapper around transformation list
- Draggable wrapper for each transformation row with drag handle
- Droppable zones within sections for restricted transformations
- Custom collision detection for section boundaries
- Visual feedback (highlighted drop zones) during drag

**Alternatives Considered**:
- **Framer Motion drag**: Has drag capabilities but less accessible, more animation-focused
- **React Beautiful DND**: Considered but `@dnd-kit` is more modern with better accessibility
- **Native HTML5 drag-and-drop**: Poor accessibility, inconsistent browser behavior
- **Custom implementation**: Unnecessary complexity, reinventing the wheel

---

### 3. State Management

**Decision**: Use Zustand for transformation state, React Context for UI state

**Rationale**:
- Zustand provides simple, hooks-based state management without boilerplate
- Excellent TypeScript support with type inference
- Minimal re-renders - subscribers only re-render when their slice changes
- DevTools support for debugging transformation sequence
- React Context sufficient for simpler UI state (panel sizes, keyboard focus)
- Avoids prop drilling for transformation list accessed by multiple components

**Implementation Approach**:
- **Transformation Store** (Zustand): List of transformations, add/remove/reorder operations, undo functionality
- **UI Store** (Zustand): Panel sizes, active row selection, hover states, keyboard navigation state
- **React Context**: Theme/styling preferences if needed
- Actions separated from state for testability
- Selectors for derived state (filtered transformations by section, change counts)

**Alternatives Considered**:
- **Redux Toolkit**: Too heavy for demo, unnecessary boilerplate
- **React Context only**: Causes excessive re-renders for frequently updated transformation list
- **Jotai/Recoil**: Atomic state management unnecessary for linear transformation sequence
- **MobX**: Observable pattern adds complexity, not idiomatic React

---

### 4. Keyboard Navigation Architecture

**Decision**: Custom keyboard handler system with focus management

**Rationale**:
- Spec requires comprehensive keyboard support (Tab, Enter, ESC, arrows, Cmd+shortcuts)
- Need centralized keyboard event coordination to avoid conflicts
- Focus trap management for edit modes
- Keyboard hints bar needs to show context-sensitive shortcuts

**Implementation Approach**:
- Global keyboard event listener at app root
- KeyboardContext provides current focus context (viewing, editing, dragging)
- Component-level handlers for mode-specific keys (e.g., Enter in edit mode)
- Focus management utilities (moveFocus, trapFocus, restoreFocus)
- Keyboard hints bar subscribes to focus context to show relevant shortcuts
- Prevent default browser shortcuts where they conflict (Cmd+[, Cmd+])

**Alternatives Considered**:
- **Individual component key handlers**: Rejected - leads to conflicts and duplication
- **Library like react-hotkeys-hook**: Considered but custom solution more flexible for complex focus states
- **Browser's native focus management only**: Insufficient for custom keyboard shortcuts

---

### 5. Syntax Highlighting for Code Values

**Decision**: Custom lightweight syntax highlighter with CSS classes

**Rationale**:
- Only need to highlight strings, numbers, booleans, null - not full code
- Lightweight regex-based tokenization sufficient
- Tailwind classes for colors based on token type
- No need for heavy syntax highlighting libraries (Prism, Highlight.js)
- Matches codebase aesthetic with Tailwind color palette

**Implementation Approach**:
- Tokenizer function: regex to identify strings (quoted), numbers, booleans, null
- Render tokens as spans with Tailwind classes
- Color scheme: strings (text-green-600), numbers (text-blue-600), booleans (text-purple-600)
- OTTL code in raw OTTL mode uses same tokenizer
- Monospace font for all code-like content

**Alternatives Considered**:
- **Prism.js**: Too heavy (30kb+ gzipped), designed for full programming languages
- **Highlight.js**: Similar size concerns, unnecessary features
- **Monaco Editor**: Massive (1MB+), way too heavy for simple value display
- **Plain text**: Rejected - poor UX, hard to distinguish value types

---

### 6. Panel Resizing Implementation

**Decision**: Custom resize handler with mouse/touch events

**Rationale**:
- Simple use case: single vertical divider between two panels
- No need for complex layout library
- Smooth resize with CSS flex and JavaScript to set flex-basis
- Touch support for mobile devices
- Visual feedback (cursor change, divider highlight) on hover

**Implementation Approach**:
- Container with `display: flex`
- Panels have `flex: 1` initially (50/50 split)
- Divider captures mousedown/touchstart events
- On drag: calculate percentage based on mouse position, update flex-basis
- Store panel sizes in UI state (Zustand) for persistence across interactions
- Min/max width constraints to prevent panels from disappearing

**Alternatives Considered**:
- **react-split-pane**: Additional dependency for simple use case, outdated
- **react-resizable-panels**: Newer but still unnecessary for single divider
- **CSS resize property**: Poor browser support, limited control over behavior
- **Grid layout with fr units**: Less intuitive for dynamic resizing with mouse

---

### 7. Transformation Execution Engine

**Decision**: Sequential transformation pipeline with immutable data transformations

**Rationale**:
- Spec requires transformations applied sequentially from first to last
- Pure functions for each transformation type enable testing and predictability
- Immutable transformations prevent accidental state mutations
- Easy to compute "preview after N transformations" for partial results
- Each transformation returns new data structure (spread operators)

**Implementation Approach**:
- `TransformationEngine.execute(telemetryData, transformations[])` main entry point
- Reduce over transformations array, accumulating result
- Each transformation type is a pure function: `(data, params) => newData`
- Transformation types: AddAttribute, DeleteAttribute, MaskValue, RenameKey, SubstringAttribute, RawOTTL
- Validation before execution (detect conflicts, validate paths)
- Error handling: continue on error, mark failed transformation, show in UI

**Alternatives Considered**:
- **Mutable transformation pipeline**: Harder to test, risk of side effects
- **Async transformations**: Unnecessary for client-side demo, adds complexity
- **Real OTTL engine integration**: Out of scope for demo, would require WASM or server
- **Transaction/rollback system**: Overkill for demo, undo is full state replacement

---

### 8. Testing Strategy

**Decision**: Three-tier testing approach (unit, component, E2E)

**Rationale**:
- Unit tests for transformation engine ensure correctness of business logic
- Component tests verify UI behavior and user interactions
- E2E tests validate complete user workflows from the specification
- Test coverage directly maps to functional requirements and acceptance scenarios
- Supports TDD approach if desired (write tests first, then implement)

**Implementation Approach**:
- **Unit Tests** (Vitest): 
  - All transformation operations (add, delete, mask, rename, substring)
  - Telemetry parser (OTLP → tree structure)
  - Keyboard utilities
  - State management actions
  
- **Component Tests** (React Testing Library + Vitest):
  - Form interactions (add attribute, rename key, raw OTTL)
  - Button actions (delete, undo, save, cancel)
  - Keyboard navigation within components
  - Visual state updates (labels, colors, backgrounds)
  
- **E2E Tests** (Playwright):
  - Complete transformation workflows (User Stories 1-13)
  - Keyboard navigation across entire app
  - Drag-and-drop reordering
  - Panel resizing
  - Preview execution

**Alternatives Considered**:
- **Jest instead of Vitest**: Vitest is faster and better integrated with Vite/Next.js
- **Cypress instead of Playwright**: Playwright has better TypeScript support and is faster
- **Only E2E tests**: Insufficient for rapid feedback, hard to debug failures
- **Only unit tests**: Misses integration issues and UX bugs

---

### 9. Accessibility (WCAG 2.1 AA Compliance)

**Decision**: Built-in accessibility following WCAG 2.1 AA standards

**Rationale**:
- Spec requires keyboard navigation - accessibility is core requirement
- Shadcn UI components are accessible by default
- Proper ARIA labels and roles improve screen reader experience
- Focus management critical for keyboard-only users
- Color contrast ratios must meet AA standards

**Implementation Approach**:
- **Keyboard Navigation**: Full support per spec (Tab, arrow keys, Enter, ESC, shortcuts)
- **Focus Indicators**: Clear focus rings on all interactive elements
- **ARIA Labels**: Descriptive labels for icon buttons, sections, transformations
- **Role Attributes**: Proper roles for tree view, buttons, forms, dialogs
- **Color Contrast**: Test all color combinations (green/red/blue backgrounds with text)
- **Screen Reader**: Test key flows with VoiceOver/NVDA
- **Focus Trap**: When in edit mode, trap focus within form until save/cancel

**Specific Requirements**:
- Tree view: `role="tree"`, `role="treeitem"` with `aria-expanded` for sections
- Transformation rows: `role="listitem"` with descriptive `aria-label`
- Icon buttons: Always include `aria-label` (e.g., "Add static attribute")
- Drag handles: `aria-label="Reorder transformation"` with keyboard alternative
- Status messages: `aria-live="polite"` for "Transformation applied", "Undo successful"

**Alternatives Considered**:
- **Accessibility as afterthought**: Rejected - spec explicitly requires keyboard navigation
- **Automated testing only**: Insufficient - need manual screen reader testing
- **Skip ARIA labels on obvious elements**: Rejected - screen reader users need context

---

### 10. Performance Optimization

**Decision**: React Server Components for static content, memoization for expensive computations

**Rationale**:
- Telemetry tree rendering with 50+ attributes needs optimization
- Transformation preview computation should be memoized
- Drag-and-drop animations must maintain 60fps
- First paint should be fast (<1 second)

**Implementation Approach**:
- **Server Components**: Header, keyboard hints bar, initial UI shell
- **Client Components**: Transformation list, telemetry tree (interactive)
- **Memoization**: 
  - `useMemo` for transformation execution result
  - `useMemo` for tree structure derivation from OTLP data
  - `React.memo` for AttributeRow component (prevents re-renders)
- **Virtual Scrolling**: Not needed initially, add if performance issues with large trees
- **Debouncing**: Preview execution debounced by 150ms during rapid edits
- **Code Splitting**: Dynamic imports for heavy components (drag-and-drop provider)

**Performance Budget**:
- Initial load: < 2 seconds on 3G
- Time to Interactive: < 3 seconds
- Transformation preview: < 200ms
- Drag operation: 60fps (16ms per frame)
- Memory: < 100MB for app with 100 transformations

**Alternatives Considered**:
- **All client components**: Worse initial load performance
- **Virtual scrolling from start**: Premature optimization for typical use
- **Web Workers for transformations**: Unnecessary for client-side data, adds complexity
- **Request Animation Frame for all updates**: Overkill, React batching sufficient

---

## Technology Stack Summary

| Category | Choice | Version | Rationale |
|----------|--------|---------|-----------|
| Framework | Next.js | 15.x | App Router, RSC, excellent DX, Vercel deployment |
| Language | TypeScript | 5.x | Type safety, autocomplete, refactoring support |
| UI Library | React | 19.x | Component model, hooks, ecosystem |
| Component Library | Shadcn UI | Latest | Accessible, customizable, Tailwind-based |
| Styling | Tailwind CSS | 3.x | Utility-first, mobile-first, rapid prototyping |
| Animation | Framer Motion | 11.x | Smooth animations, gesture support |
| Drag-and-Drop | @dnd-kit | 6.x | Accessible, performant, flexible |
| State Management | Zustand | 4.x | Simple, performant, TypeScript-friendly |
| Testing Framework | Vitest | 2.x | Fast, Vite-integrated, Jest-compatible |
| Component Testing | React Testing Library | 16.x | User-centric testing, good practices |
| E2E Testing | Playwright | 1.x | Fast, reliable, excellent debugging |
| Linting | ESLint | 9.x | Code quality, Next.js rules |
| Formatting | Prettier | 3.x | Consistent code style |
| Package Manager | npm/pnpm | Latest | Fast installs, workspace support |

---

## Open Questions / Future Research

### Resolved
All technical unknowns from the Technical Context have been resolved through this research phase.

### Future Enhancements (Out of Scope for Demo)
1. **Real OTTL Engine**: Integration with actual OpenTelemetry Transformation Language processor
2. **Backend API**: Save/load transformation configurations
3. **Multiple Samples**: Upload custom telemetry samples
4. **Transformation Templates**: Pre-built transformation patterns
5. **Export Functionality**: Actually implement Copy/Download (currently placeholder)
6. **Collaborative Editing**: Multiple users editing transformations simultaneously
7. **Transformation History**: Git-like history with diff view
8. **Performance Profiling**: Built-in profiler for transformation execution time

---

## References

- [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otlp/)
- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Shadcn UI Components](https://ui.shadcn.com/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [React Testing Library](https://testing-library.com/react)
- [Playwright Documentation](https://playwright.dev/)

---

**Status**: ✅ Research complete - all NEEDS CLARIFICATION items resolved
**Next Phase**: Phase 1 - Data Model & Contracts




