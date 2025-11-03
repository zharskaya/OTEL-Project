# Implementation Tasks: Telemetry Transformation UI Demo

**Feature**: 001-telemetry-transform-ui  
**Branch**: `001-telemetry-transform-ui`  
**Generated**: November 1, 2025  
**Total Tasks**: 148

---

## Task Organization

Tasks are organized by user story to enable independent, incremental implementation. Each phase represents a complete, independently testable feature increment.

### Priority Legend
- **P1**: Critical for MVP (User Stories 1, 2, 3, 13)
- **P2**: Important features (User Stories 4, 5, 6, 8, 9)
- **P3**: Nice-to-have (User Stories 7, 10, 11, 12)

### Task Format
```
- [ ] [TaskID] [P] [Story] Description with file path
```
- **[P]**: Parallelizable (can be done independently)
- **[Story]**: User story label (US1-US13)

---

## Phase 1: Setup & Project Initialization ✅

**Goal**: Set up Next.js project with all dependencies and folder structure

### Tasks

- [X] T001 Create Next.js 15 project with TypeScript, App Router, src-dir, Tailwind, ESLint
- [X] T002 Install core dependencies: zustand, @dnd-kit/core, @dnd-kit/sortable, framer-motion
- [X] T003 [P] Install dev dependencies: vitest, @vitejs/plugin-react, @testing-library/react, @testing-library/jest-dom, @playwright/test
- [X] T004 [P] Install OpenTelemetry types: @opentelemetry/api, @opentelemetry/otlp-transformer (dev)
- [X] T005 Initialize Shadcn UI with default configuration in src/components/ui
- [X] T006 [P] Install Shadcn components: button, input, tooltip, label, separator, scroll-area
- [X] T007 Create directory structure: src/lib/{telemetry,transformations/operations,state,utils}
- [X] T008 [P] Create directory structure: src/components/{panels,telemetry-display,transformations,keyboard-hints,section-header}
- [X] T009 [P] Create directory structure: src/types
- [X] T010 [P] Create directory structure: tests/{unit/{transformations,telemetry,utils},component,e2e}
- [X] T011 Copy TypeScript contracts from specs/001-telemetry-transform-ui/contracts/ to src/types/
- [X] T012 Configure vitest in vitest.config.ts with React plugin and path aliases
- [X] T013 [P] Configure Playwright in playwright.config.ts with baseURL and test settings
- [X] T014 [P] Configure ESLint with Next.js rules and TypeScript settings
- [X] T015 [P] Configure Prettier for consistent code formatting
- [X] T016 Update package.json scripts: dev, build, test, test:component, test:e2e, lint, format

**Completion Criteria**: 
- ✅ Project runs with `npm run dev`
- ✅ All directories exist
- ✅ All dependencies installed
- ✅ Vitest and Playwright configured

---

## Phase 2: Foundational Layer

**Goal**: Build core data structures, parser, and transformation engine that all user stories depend on

### Tasks

- [ ] T017 [P] Create hardcoded OTLP sample data in src/lib/telemetry/sample-data.ts (from spec)
- [ ] T018 Implement TelemetryParser.parse() in src/lib/telemetry/telemetry-parser.ts (OTLP → TelemetryTree)
- [ ] T019 [P] Implement TelemetryFormatter.formatValue() in src/lib/telemetry/telemetry-formatter.ts (AnyValue → string)
- [ ] T020 Implement addAttribute() operation in src/lib/transformations/operations/add-attribute.ts
- [ ] T021 [P] Implement deleteAttribute() operation in src/lib/transformations/operations/delete-attribute.ts
- [ ] T022 [P] Implement maskValue() operation in src/lib/transformations/operations/mask-value.ts
- [ ] T023 [P] Implement renameKey() operation in src/lib/transformations/operations/rename-key.ts
- [ ] T024 [P] Implement substringAttribute() operation in src/lib/transformations/operations/substring-attribute.ts
- [ ] T025 [P] Implement rawOTTL() stub operation in src/lib/transformations/operations/raw-ottl.ts
- [ ] T026 Implement TransformationEngine.execute() in src/lib/transformations/transformation-engine.ts
- [ ] T027 [P] Implement TransformationValidator in src/lib/transformations/transformation-validator.ts
- [ ] T028 Create TransformationStore (Zustand) in src/lib/state/transformation-store.ts with actions and selectors
- [ ] T029 [P] Create UIStore (Zustand) in src/lib/state/ui-store.ts for panel sizes, selection, keyboard state
- [ ] T030 [P] Create custom hooks in src/lib/state/hooks.ts (useTransformations, useUIState)
- [ ] T031 Write unit test for TelemetryParser.parse() in tests/unit/telemetry/telemetry-parser.test.ts
- [ ] T032 [P] Write unit tests for addAttribute in tests/unit/transformations/add-attribute.test.ts
- [ ] T033 [P] Write unit tests for deleteAttribute in tests/unit/transformations/delete-attribute.test.ts
- [ ] T034 [P] Write unit tests for maskValue in tests/unit/transformations/mask-value.test.ts
- [ ] T035 [P] Write unit tests for renameKey in tests/unit/transformations/rename-key.test.ts
- [ ] T036 [P] Write unit tests for substringAttribute in tests/unit/transformations/substring-attribute.test.ts
- [ ] T037 [P] Write unit test for TransformationEngine.execute() in tests/unit/transformations/transformation-engine.test.ts

**Completion Criteria**:
- ✅ All 6 transformation operations work correctly
- ✅ Transformation engine executes transformations sequentially
- ✅ Parser converts OTLP to display tree
- ✅ All unit tests pass
- ✅ State stores work correctly

---

## Phase 3: User Story 1 (P1) - View and Transform Telemetry Sample Data

**Goal**: Display telemetry in tree view with basic panels and run transformations

**Independent Test**: Load app, see telemetry tree with expanded sections, click Run, see results in OUTPUT panel

### Tasks

- [ ] T038 [US1] Create SplitPanel component in src/components/panels/split-panel.tsx with flex layout
- [ ] T039 [US1] Create InputPanel component in src/components/panels/input-panel.tsx with header and Run button
- [ ] T040 [US1] Create OutputPanel component in src/components/panels/output-panel.tsx with header and empty state
- [ ] T041 [US1] Create TelemetryTree component in src/components/telemetry-display/telemetry-tree.tsx
- [ ] T042 [US1] Create TreeSection component in src/components/telemetry-display/tree-section.tsx with expand/collapse
- [ ] T043 [US1] Create AttributeRow component in src/components/telemetry-display/attribute-row.tsx with hover state
- [ ] T044 [P] [US1] Create SyntaxHighlighter component in src/components/telemetry-display/syntax-highlighter.tsx
- [ ] T045 [US1] Wire up main page in src/app/page.tsx with SplitPanel, InputPanel, OutputPanel
- [ ] T046 [US1] Implement Run button handler to execute transformations and update OUTPUT panel
- [ ] T047 [US1] Add "Select to modify" tooltip on attribute value hover
- [ ] T048 [US1] Implement ⌘+Enter (Ctrl+Enter) keyboard shortcut for Run
- [ ] T049 [US1] Show empty state in OUTPUT panel before first run
- [ ] T050 [US1] Show dimmed message in OUTPUT when changes made but not yet run
- [ ] T051 [P] [US1] Style global layout in src/app/globals.css with Tailwind imports
- [ ] T052 [P] [US1] Write component test for TelemetryTree in tests/component/telemetry-tree.test.tsx
- [ ] T053 [P] [US1] Write component test for AttributeRow in tests/component/attribute-row.test.tsx
- [ ] T054 [US1] Write E2E test for complete transformation workflow in tests/e2e/transformation-workflow.spec.ts

**Completion Criteria**:
- ✅ Telemetry displays in hierarchical tree
- ✅ Resource, Span Info, Span Attributes expanded by default
- ✅ Run button executes transformations
- ✅ OUTPUT panel shows transformed result
- ✅ Keyboard shortcut works (⌘+Enter)

---

## Phase 4: User Story 2 (P1) - Add Static Attributes

**Goal**: Users can add new static attributes via form

**Independent Test**: Click Add button, enter "test = value", save, run transformation, verify in OUTPUT

### Tasks

- [ ] T055 [US2] Create SectionHeader component in src/components/section-header/section-header.tsx with Add/Terminal buttons
- [ ] T056 [US2] Create AddAttributeForm component in src/components/transformations/add-attribute-form.tsx
- [ ] T057 [US2] Implement inline form with "Enter new_key = new_value" placeholder
- [ ] T058 [US2] Parse key=value input and create Transformation object
- [ ] T059 [US2] Connect Save button to addTransformation action in store
- [ ] T060 [US2] Implement Cancel button to remove form row
- [ ] T061 [US2] Handle Enter key press to save transformation
- [ ] T062 [US2] Handle ESC key press to cancel
- [ ] T063 [US2] Handle click outside with text entered (save) or empty (cancel)
- [ ] T064 [US2] Create TransformationRow component in src/components/transformations/transformation-row.tsx
- [ ] T065 [US2] Display saved transformation with green "ADD" label
- [ ] T066 [US2] Apply light green background to ADD transformation rows
- [ ] T067 [US2] Show drag handle icon on left side of transformation row
- [ ] T068 [P] [US2] Write component test for AddAttributeForm in tests/component/add-attribute-form.test.tsx
- [ ] T069 [P] [US2] Write component test for TransformationRow in tests/component/transformation-row.test.tsx
- [ ] T070 [US2] Write E2E test for add attribute workflow in tests/e2e/add-attribute.spec.ts

**Completion Criteria**:
- ✅ Add button creates editable form
- ✅ Save creates transformation with green label
- ✅ Cancel removes form
- ✅ Transformation appears in OUTPUT after Run

---

## Phase 5: User Story 3 (P1) - Remove Existing Attributes

**Goal**: Users can delete attributes with visual feedback

**Independent Test**: Hover attribute, click Delete, verify strikethrough and red label, run, verify removed from OUTPUT

### Tasks

- [ ] T071 [US3] Add Delete button to AttributeRow on hover
- [ ] T072 [US3] Create deleteAttribute transformation on Delete click
- [ ] T073 [US3] Apply strikethrough styling to deleted key and value
- [ ] T074 [US3] Display red "DELETE" label on deleted rows
- [ ] T075 [US3] Apply light red background to deleted rows
- [ ] T076 [US3] Show drag handle on deleted rows
- [ ] T077 [US3] Replace Delete button with Undo on modified rows
- [ ] T078 [US3] Implement Undo button to remove transformation
- [ ] T079 [P] [US3] Write component test for Delete button behavior in tests/component/delete-button.test.tsx
- [ ] T080 [US3] Write E2E test for delete attribute workflow in tests/e2e/delete-attribute.spec.ts

**Completion Criteria**:
- ✅ Delete button appears on hover
- ✅ Deleted attributes show red label and strikethrough
- ✅ Undo restores original state
- ✅ Deleted attributes excluded from OUTPUT

---

## Phase 6: User Story 13 (P1) - View Change Indicators

**Goal**: Clear visual feedback for all transformation types

**Independent Test**: Create any transformation, verify color-coded background, appropriate label, and drag handle

### Tasks

- [ ] T081 [US13] Create TransformationLabel component in src/components/transformations/transformation-labels.tsx
- [ ] T082 [US13] Implement color coding: green (ADD), red (DELETE), blue (MASK, RENAME)
- [ ] T083 [US13] Display appropriate label text based on transformation type
- [ ] T084 [US13] Apply background colors: light green, light red, light blue
- [ ] T085 [US13] Show drag handle icon on all transformation rows
- [ ] T086 [US13] Implement hover highlighting for modified rows
- [ ] T087 [US13] Show Undo button on hover for modified rows
- [ ] T088 [US13] Apply syntax highlighting to code-like content (values, OTTL)
- [ ] T089 [US13] Create syntax tokenizer in src/lib/utils/syntax-highlighter.ts
- [ ] T090 [US13] Apply Tailwind color classes: strings (green), numbers (blue), booleans (purple)
- [ ] T091 [P] [US13] Write component test for TransformationLabel in tests/component/transformation-label.test.tsx
- [ ] T092 [US13] Write E2E test for visual indicators in tests/e2e/visual-indicators.spec.ts

**Completion Criteria**:
- ✅ All transformation types have distinct colors
- ✅ Labels clearly indicate transformation type
- ✅ Syntax highlighting works on values
- ✅ Undo button appears on modified rows

---

## Phase 7: User Story 4 (P2) - Mask Sensitive Data

**Goal**: Users can select and mask substrings of values

**Independent Test**: Select part of value, click MASK, verify masked output with asterisks

### Tasks

- [ ] T093 [US4] Implement text selection detection on attribute values
- [ ] T094 [US4] Create MaskValueSelector component in src/components/transformations/mask-value-selector.tsx
- [ ] T095 [US4] Show tooltip with selection type (Full string, Substr(start, end))
- [ ] T096 [US4] Display MASK and NEW ATRBT options in tooltip
- [ ] T097 [US4] Create maskValue transformation on MASK click
- [ ] T098 [US4] Display masked value with asterisks above original
- [ ] T099 [US4] Show dimmed and crossed-out original value below
- [ ] T100 [US4] Display blue "MASK [range]" label with range info
- [ ] T101 [US4] Apply light blue background to masked rows
- [ ] T102 [US4] Implement Undo for mask transformations
- [ ] T103 [P] [US4] Write component test for MaskValueSelector in tests/component/mask-value-selector.test.tsx
- [ ] T104 [US4] Write E2E test for mask value workflow in tests/e2e/mask-value.spec.ts

**Completion Criteria**:
- ✅ Text selection shows MASK option
- ✅ Masked values show asterisks in correct range
- ✅ Blue label shows mask range
- ✅ OUTPUT shows masked values

---

## Phase 8: User Story 5 (P2) - Create Attributes from Substrings

**Goal**: Users can extract substrings into new attributes

**Independent Test**: Select substring, click NEW ATRBT, name it, verify OUTPUT shows new attribute

### Tasks

- [ ] T105 [US5] Show NEW ATRBT option in text selection tooltip
- [ ] T106 [US5] Create SubstringAttributeForm component in src/components/transformations/substring-attribute-form.tsx
- [ ] T107 [US5] Display "SUBSTR(attribute_key, range)" as value
- [ ] T108 [US5] Make key field editable with placeholder "Enter new_key"
- [ ] T109 [US5] Focus cursor in key field immediately
- [ ] T110 [US5] Handle Save/Cancel buttons and keyboard shortcuts
- [ ] T111 [US5] Create addSubstring transformation on save
- [ ] T112 [US5] Display green "ADD" label on substring-based attributes
- [ ] T113 [US5] Apply light green background
- [ ] T114 [US5] Extract and display substring value in OUTPUT
- [ ] T115 [P] [US5] Write component test for SubstringAttributeForm in tests/component/substring-attribute-form.test.tsx
- [ ] T116 [US5] Write E2E test for substring extraction workflow in tests/e2e/substring-attribute.spec.ts

**Completion Criteria**:
- ✅ NEW ATRBT creates form with SUBSTR notation
- ✅ User can name the new attribute
- ✅ OUTPUT shows extracted substring value
- ✅ Green label indicates ADD operation

---

## Phase 9: User Story 6 (P2) - Rename Attribute Keys

**Goal**: Users can rename attribute keys

**Independent Test**: Click key, edit name, verify OUTPUT shows new key name

### Tasks

- [ ] T117 [US6] Add "Click to rename" tooltip on key hover
- [ ] T118 [US6] Create RenameKeyForm component in src/components/transformations/rename-key-form.tsx
- [ ] T119 [US6] Make key editable on click with text selected
- [ ] T120 [US6] Show Save and Cancel buttons next to editable key
- [ ] T121 [US6] Handle Enter to save, ESC to cancel
- [ ] T122 [US6] Handle click outside with changes (save) or no changes (cancel)
- [ ] T123 [US6] Create renameKey transformation on save
- [ ] T124 [US6] Display new key above old key
- [ ] T125 [US6] Show old key dimmed and crossed out below
- [ ] T126 [US6] Display blue "RENAME KEY" label
- [ ] T127 [US6] Apply light blue background
- [ ] T128 [US6] Show renamed key in OUTPUT panel
- [ ] T129 [P] [US6] Write component test for RenameKeyForm in tests/component/rename-key-form.test.tsx
- [ ] T130 [US6] Write E2E test for rename key workflow in tests/e2e/rename-key.spec.ts

**Completion Criteria**:
- ✅ Keys become editable on click
- ✅ Both old and new keys visible with strikethrough on old
- ✅ Blue RENAME KEY label shown
- ✅ OUTPUT uses new key names

---

## Phase 10: User Story 8 (P2) - Reorder Transformations

**Goal**: Users can drag and drop transformations to change execution order

**Independent Test**: Create two transformations, drag one above the other, run, verify order affects result

### Tasks

- [ ] T131 [US8] Set up DndContext in src/app/page.tsx
- [ ] T132 [US8] Wrap transformation list with SortableContext
- [ ] T133 [US8] Make TransformationRow draggable with useSortable hook
- [ ] T134 [US8] Show drag handle icon on all transformation rows
- [ ] T135 [US8] Implement handleDragEnd to reorder transformations in store
- [ ] T136 [US8] Highlight drop positions during drag
- [ ] T137 [US8] Restrict MASK/DELETE/RENAME to same section during drag
- [ ] T138 [US8] Allow ADD/OTTL to be placed anywhere
- [ ] T139 [US8] Update transformation order field on drop
- [ ] T140 [US8] Re-execute transformations after reorder if OUTPUT active
- [ ] T141 [P] [US8] Write E2E test for drag-and-drop reordering in tests/e2e/drag-drop.spec.ts

**Completion Criteria**:
- ✅ Transformations can be dragged with handle
- ✅ Drop positions highlight appropriately
- ✅ Section restrictions enforced
- ✅ Order affects transformation results

---

## Phase 11: User Story 9 (P2) - Navigate with Keyboard

**Goal**: Full keyboard navigation support

**Independent Test**: Complete workflow using only keyboard (no mouse)

### Tasks

- [x] T142 [US9] Create KeyboardContext in src/lib/utils/keyboard.ts (built into components)
- [x] T143 [US9] Implement global keyboard event listener (in page.tsx)
- [x] T144 [US9] Handle Tab key for sequential navigation (native browser behavior)
- [x] T145 [US9] Handle Enter key to enter edit mode (implemented in forms)
- [x] T146 [US9] Handle ESC key to exit edit mode (implemented in forms)
- [x] T147 [US9] Handle ↑/↓ arrow keys for row navigation (via @dnd-kit)
- [x] T148 [US9] Handle ←/→ arrow keys for column navigation (via @dnd-kit)
- [x] T149 [US9] Handle ⌘↑/Ctrl↑ and ⌘[ to move row up (via @dnd-kit)
- [x] T150 [US9] Handle ⌘↓/Ctrl↓ and ⌘] to move row down (via @dnd-kit)
- [x] T151 [US9] Implement focus management utilities in src/lib/utils/keyboard.ts (built into forms)
- [x] T152 [US9] Create KeyboardHintsBar component in src/components/keyboard-hints/keyboard-hints-bar.tsx
- [x] T153 [US9] Display context-sensitive shortcuts at bottom of window
- [x] T154 [US9] Update hints based on current keyboard mode
- [x] T155 [US9] Add ARIA labels to all interactive elements
- [x] T156 [US9] Implement focus trap for edit modes (implemented in forms)
- [ ] T157 [P] [US9] Write E2E test for keyboard navigation in tests/e2e/keyboard-navigation.spec.ts

**Completion Criteria**:
- ✅ All operations possible via keyboard
- ✅ Tab navigates through elements
- ✅ Arrow keys navigate rows/columns
- ✅ Shortcuts work as specified
- ✅ Keyboard hints bar shows relevant shortcuts

---

## Phase 12: User Story 10 (P3) - Adjust Panel Sizes

**Goal**: Users can resize INPUT and OUTPUT panels

**Independent Test**: Drag divider, verify panels resize proportionally

### Tasks

- [x] T158 [US10] Create PanelDivider component in src/components/panels/panel-divider.tsx
- [x] T159 [US10] Add hover effects (highlight and cursor change)
- [x] T160 [US10] Implement mousedown/touchstart event handlers
- [x] T161 [US10] Track mouse position during drag
- [x] T162 [US10] Calculate percentage based on mouse position
- [x] T163 [US10] Update flex-basis of panels dynamically
- [x] T164 [US10] Store panel sizes in UIStore (using local state)
- [x] T165 [US10] Apply min/max width constraints
- [x] T166 [US10] Ensure content reflows appropriately
- [ ] T167 [P] [US10] Write component test for PanelDivider in tests/component/panel-divider.test.tsx
- [ ] T168 [US10] Write E2E test for panel resizing in tests/e2e/panel-resize.spec.ts

**Completion Criteria**:
- ✅ Divider highlights on hover
- ✅ Panels resize smoothly during drag
- ✅ Sizes persist during session
- ✅ Content remains readable

---

## Phase 13: User Story 11 (P3) - Track Changes Per Section

**Goal**: Show modification count on section headers

**Independent Test**: Add transformations, verify section headers show "N UPDATES"

### Tasks

- [ ] T169 [US11] Create UpdateCounter component in src/components/section-header/update-counter.tsx
- [ ] T170 [US11] Implement getUpdateCount selector in TransformationStore
- [ ] T171 [US11] Calculate count of transformations per section
- [ ] T172 [US11] Display counter only when count > 0
- [ ] T173 [US11] Show "1 UPDATE" for single modification
- [ ] T174 [US11] Show "N UPDATES" for multiple modifications
- [ ] T175 [US11] Update counter in real-time as transformations added/removed
- [ ] T176 [US11] Hide counter when all transformations in section undone
- [ ] T177 [P] [US11] Write component test for UpdateCounter in tests/component/update-counter.test.tsx

**Completion Criteria**:
- ✅ Counters appear on section headers
- ✅ Counts are accurate
- ✅ Singular/plural forms correct
- ✅ Counters update in real-time

---

## Phase 14: User Story 7 (P3) - Apply Raw OTTL Statements

**Goal**: Advanced users can write raw OTTL code

**Independent Test**: Click Terminal button, enter OTTL statement, save, verify green label

### Tasks

- [ ] T178 [US7] Add Terminal button to section headers
- [ ] T179 [US7] Create RawOTTLForm component in src/components/transformations/raw-ottl-form.tsx
- [ ] T180 [US7] Display terminal icon in form row
- [ ] T181 [US7] Show text field with placeholder "Add raw OTTL statement"
- [ ] T182 [US7] Focus cursor immediately
- [ ] T183 [US7] Handle Save/Cancel and keyboard shortcuts
- [ ] T184 [US7] Create rawOTTL transformation on save
- [ ] T185 [US7] Display statement as code-formatted text
- [ ] T186 [US7] Show green "ADD" label
- [ ] T187 [US7] Apply light green background
- [ ] T188 [US7] Apply syntax highlighting to OTTL statement
- [ ] T189 [US7] Implement stub execution (no-op) for demo
- [ ] T190 [P] [US7] Write component test for RawOTTLForm in tests/component/raw-ottl-form.test.tsx
- [ ] T191 [US7] Write E2E test for raw OTTL workflow in tests/e2e/raw-ottl.spec.ts

**Completion Criteria**:
- ✅ Terminal button creates OTTL form
- ✅ Statements save with green label
- ✅ Syntax highlighting applied
- ✅ Stub execution doesn't break preview

---

## Phase 15: User Story 12 (P3) - Copy and Download Results

**Goal**: Show placeholder messages for export functionality

**Independent Test**: Click Copy or Download, verify "Not included in this demo" message

### Tasks

- [ ] T192 [US12] Add Copy button to OUTPUT panel header
- [ ] T193 [US12] Add Download button to OUTPUT panel header
- [ ] T194 [US12] Create placeholder message component
- [ ] T195 [US12] Show "Not included in this demo" on Copy click
- [ ] T196 [US12] Show "Not included in this demo" on Download click
- [ ] T197 [P] [US12] Write component test for Copy/Download buttons in tests/component/export-buttons.test.tsx

**Completion Criteria**:
- ✅ Both buttons visible in OUTPUT header
- ✅ Placeholder messages appear on click
- ✅ No actual copy/download functionality

---

## Phase 16: Polish & Cross-Cutting Concerns

**Goal**: Final touches, performance optimization, and production readiness

### Tasks

- [ ] T198 [P] Create custom styles in src/styles/transformations.css for transformation-specific colors
- [ ] T199 [P] Optimize TelemetryTree with React.memo for AttributeRow components
- [ ] T200 [P] Memoize transformation execution result with useMemo
- [ ] T201 [P] Memoize tree structure derivation with useMemo
- [ ] T202 [P] Debounce transformation preview execution by 150ms
- [ ] T203 [P] Add Error Boundary component in src/components/error-boundary.tsx
- [ ] T204 [P] Implement error handling for transformation failures
- [ ] T205 [P] Add loading states for transformation execution
- [ ] T206 [P] Test responsive design on mobile viewports
- [ ] T207 [P] Verify WCAG 2.1 AA compliance with accessibility checker
- [ ] T208 [P] Test with screen reader (VoiceOver/NVDA)
- [ ] T209 [P] Run Lighthouse audit and achieve >90 scores
- [ ] T210 [P] Remove all console.log statements
- [ ] T211 [P] Add proper TypeScript error handling throughout
- [ ] T212 [P] Write README.md with setup and usage instructions
- [ ] T213 [P] Document component API in JSDoc comments
- [ ] T214 [P] Create demo GIF or video for documentation
- [ ] T215 [P] Final E2E test suite run across all scenarios

**Completion Criteria**:
- ✅ Performance meets targets (<100ms interactions, <200ms execution)
- ✅ Accessibility requirements met
- ✅ Error handling graceful
- ✅ Documentation complete
- ✅ All tests passing

---

## Dependency Graph

### User Story Dependencies

```
Phase 1 (Setup)
    ↓
Phase 2 (Foundational)
    ↓
    ├─→ Phase 3 (US1) ← MVP Core
    │       ↓
    │   ┌───┴────┬────────┬─────────────┐
    │   ↓        ↓        ↓             ↓
    │ Phase 4  Phase 5  Phase 6      Phase 7
    │ (US2)    (US3)    (US13)       (US4)
    │   ↓        ↓        ↓             ↓
    │   └────────┴────────┴─────────────┤
    │                                    ↓
    │                                 Phase 8
    │                                 (US5)
    │                                    ↓
    │                                 Phase 9
    │                                 (US6)
    │                                    ↓
    └────────────────────────────────→ Phase 10
                                       (US8)
                                          ↓
                                       Phase 11
                                       (US9)
                                          ↓
    ┌─────────────────────────────────────┤
    ↓                 ↓                    ↓
Phase 12          Phase 13             Phase 14
(US10)            (US11)               (US7)
    ↓                 ↓                    ↓
    └─────────────────┴────────────────────┤
                                           ↓
                                       Phase 15
                                       (US12)
                                           ↓
                                       Phase 16
                                       (Polish)
```

### Critical Path (MVP)
1. Setup (Phase 1)
2. Foundational (Phase 2)
3. **US1** - View and Transform (Phase 3) ← **First deliverable**
4. **US2** - Add Attributes (Phase 4)
5. **US3** - Delete Attributes (Phase 5)
6. **US13** - Change Indicators (Phase 6)

**Estimated MVP Time**: 2-3 weeks
**Estimated Full Feature Time**: 5 weeks

---

## Parallel Execution Opportunities

### Phase 1 (Setup) - Can be parallelized:
- T003 (dev deps), T004 (OTel types), T006 (Shadcn components)
- T008-T010 (directory structures)
- T013-T015 (configs)

### Phase 2 (Foundational) - High parallelization:
- T019 (formatter), T020-T025 (all transformation operations)
- T027 (validator), T029 (UIStore), T030 (hooks)
- T032-T037 (all unit tests after operations complete)

### Phase 3 (US1) - Some parallelization:
- T044 (syntax highlighter), T051 (global styles)
- T052-T053 (component tests after components done)

### Per User Story - Pattern:
1. Build UI components first (can be parallel if different files)
2. Wire up state and handlers (sequential)
3. Write tests (can be parallel)
4. Write E2E test (after all components done)

---

## Implementation Strategy

### Approach: Incremental MVP Delivery

**Week 1**: Phases 1-2 (Setup + Foundational)
- Complete project setup
- Build transformation engine
- All unit tests passing

**Week 2**: Phases 3-4 (US1 + US2) 
- **Deliverable**: MVP v0.1 - View telemetry and add attributes
- User can load app, see data, add attributes, preview results

**Week 3**: Phases 5-6 (US3 + US13)
- **Deliverable**: MVP v0.2 - Full basic transformations
- User can add, delete, and see clear visual indicators

**Week 4**: Phases 7-10 (US4-US6, US8)
- **Deliverable**: v0.3 - Advanced transformations
- Mask, substring extraction, rename, reordering

**Week 5**: Phases 11-16 (US9, US7, US10-US12, Polish)
- **Deliverable**: v1.0 - Full feature
- Keyboard nav, OTTL, panel resize, final polish

### Testing Strategy

- Write unit tests immediately after implementing functions (TDD optional)
- Write component tests after each component is functional
- Write E2E test after each user story phase completes
- Run full test suite before moving to next phase

### Code Review Points

After each phase:
1. Run `npm run lint`
2. Run `npm run test`
3. Visual review in browser
4. Check TypeScript compilation
5. Verify user story acceptance criteria met

---

## Task Summary

| Phase | User Story | Priority | Task Count | Estimated Time |
|-------|------------|----------|------------|----------------|
| 1 | Setup | - | 16 | 2-3 days |
| 2 | Foundational | - | 21 | 3-4 days |
| 3 | US1 | P1 | 17 | 3-4 days |
| 4 | US2 | P1 | 16 | 2-3 days |
| 5 | US3 | P1 | 10 | 1-2 days |
| 6 | US13 | P1 | 12 | 2 days |
| 7 | US4 | P2 | 12 | 2 days |
| 8 | US5 | P2 | 12 | 2 days |
| 9 | US6 | P2 | 14 | 2 days |
| 10 | US8 | P2 | 11 | 2-3 days |
| 11 | US9 | P2 | 16 | 3 days |
| 12 | US10 | P3 | 11 | 1-2 days |
| 13 | US11 | P3 | 9 | 1 day |
| 14 | US7 | P3 | 14 | 2 days |
| 15 | US12 | P3 | 6 | 0.5 day |
| 16 | Polish | - | 18 | 2-3 days |
| **Total** | **13 stories** | - | **215** | **~5 weeks** |

---

## Format Validation

✅ All tasks follow checklist format: `- [ ] [TaskID] [P] [Story] Description with file path`
✅ Task IDs sequential (T001-T215)
✅ [P] marker on parallelizable tasks
✅ [Story] label (US1-US13) on user story tasks
✅ File paths included where applicable
✅ Clear completion criteria per phase
✅ Independent test criteria defined
✅ Dependency graph shows story completion order

---

**Status**: ✅ Task breakdown complete - Ready for implementation
**Next Command**: `/speckit.implement` to begin development

