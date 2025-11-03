# Data Model: Telemetry Transformation UI Demo

**Feature**: 001-telemetry-transform-ui  
**Date**: November 1, 2025  
**Status**: Complete

## Overview

This document defines all data structures used in the telemetry transformation UI demo. The model includes telemetry data representation, transformation operations, and UI state management.

---

## Core Entities

### 1. Telemetry Data (OTLP Format)

**Purpose**: Represents OpenTelemetry Protocol (OTLP) resource spans in JSON format

**Structure**: Follows OTLP specification

```typescript
interface ResourceSpan {
  resource: Resource;
  schemaUrl?: string;
  scopeSpans: ScopeSpan[];
}

interface Resource {
  attributes: KeyValue[];
  droppedAttributesCount: number;
}

interface ScopeSpan {
  scope: Scope;
  schemaUrl?: string;
  spans: Span[];
}

interface Scope {
  name: string;
  version: string;
  attributes: KeyValue[];
  droppedAttributesCount: number;
}

interface Span {
  traceId: string;
  spanId: string;
  parentSpanId?: string;
  name: string;
  kind: SpanKind;
  startTimeUnixNano: string;
  endTimeUnixNano: string;
  attributes: KeyValue[];
  droppedAttributesCount: number;
  events: Event[];
  droppedEventsCount: number;
  links: Link[];
  droppedLinksCount: number;
  status: Status;
  flags: number;
  traceState?: string;
}

interface KeyValue {
  key: string;
  value: AnyValue;
}

interface AnyValue {
  stringValue?: string;
  intValue?: string;
  doubleValue?: number;
  boolValue?: boolean;
  arrayValue?: ArrayValue;
  kvlistValue?: KeyValueList;
  bytesValue?: string;
}

enum SpanKind {
  UNSPECIFIED = 0,
  INTERNAL = 1,
  SERVER = 2,
  CLIENT = 3,
  PRODUCER = 4,
  CONSUMER = 5,
}

interface Status {
  code: number;
  message: string;
}

interface Event {
  timeUnixNano: string;
  name: string;
  attributes: KeyValue[];
  droppedAttributesCount: number;
}

interface Link {
  traceId: string;
  spanId: string;
  traceState?: string;
  attributes: KeyValue[];
  droppedAttributesCount: number;
}
```

**Relationships**:
- ResourceSpan → Resource (1:1)
- ResourceSpan → ScopeSpan (1:many)
- ScopeSpan → Scope (1:1)
- ScopeSpan → Span (1:many)
- Span → Event (1:many)
- Span → Link (1:many)
- All → KeyValue attributes (many)

**Validation Rules**:
- Keys must be non-empty strings
- At least one value type must be set in AnyValue
- TraceId and SpanId must be valid hex strings
- Timestamps are Unix nano precision as strings

---

### 2. Display Tree Structure

**Purpose**: Flattened representation of telemetry data for UI display

**Structure**: Hierarchical tree with sections and attribute rows

```typescript
interface TelemetryTree {
  sections: TelemetrySection[];
}

interface TelemetrySection {
  id: string; // Unique identifier (e.g., "resource", "span-attributes")
  type: SectionType;
  label: string; // Display name (e.g., "Resource", "Span Attributes")
  expanded: boolean;
  attributes: DisplayAttribute[];
  updateCount: number; // Number of transformations affecting this section
}

enum SectionType {
  RESOURCE = 'resource',
  SCOPE_INFO = 'scope-info',
  SPAN_INFO = 'span-info',
  SPAN_ATTRIBUTES = 'span-attributes',
  EVENTS = 'events',
  LINKS = 'links',
}

interface DisplayAttribute {
  id: string; // Unique identifier for this attribute instance
  path: string; // JSON path in original OTLP (e.g., "resource.attributes[0]")
  sectionId: string; // Parent section ID
  key: string;
  value: string; // Stringified value for display
  valueType: ValueType; // For syntax highlighting
  depth: number; // Indentation level in tree
  modifications: AttributeModification[]; // Active transformations on this attribute
}

enum ValueType {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  NULL = 'null',
  OBJECT = 'object',
  ARRAY = 'array',
}

interface AttributeModification {
  transformationId: string; // Links to Transformation
  type: TransformationType;
  label: string; // Display label (e.g., "DELETE", "MASK [0-7]")
  color: ModificationColor;
}

enum ModificationColor {
  GREEN = 'green', // Add operations
  RED = 'red', // Delete operations
  BLUE = 'blue', // Mask and rename operations
}
```

**Relationships**:
- TelemetryTree → TelemetrySection (1:many)
- TelemetrySection → DisplayAttribute (1:many)
- DisplayAttribute → AttributeModification (1:many)
- AttributeModification → Transformation (many:1)

**State Transitions**:
- Section: collapsed ↔ expanded (user toggle)
- Attribute: unmodified → modified (transformation applied)
- Attribute: modified → unmodified (transformation undone)

**Validation Rules**:
- Section IDs must be unique within tree
- Attribute IDs must be unique within tree
- Path must reference valid location in original OTLP
- updateCount must equal count of modifications in section

---

### 3. Transformation Operations

**Purpose**: Represents user-defined transformations to apply to telemetry data

**Base Structure**:

```typescript
interface Transformation {
  id: string; // UUID
  type: TransformationType;
  order: number; // Execution order (0-based index in list)
  sectionId: string; // Section where transformation is defined
  createdAt: Date;
  params: TransformationParams; // Type-specific parameters
  status: TransformationStatus;
}

enum TransformationType {
  ADD_STATIC = 'add-static',
  ADD_SUBSTRING = 'add-substring',
  DELETE = 'delete',
  MASK = 'mask',
  RENAME_KEY = 'rename-key',
  RAW_OTTL = 'raw-ottl',
}

enum TransformationStatus {
  DRAFT = 'draft', // Being edited
  ACTIVE = 'active', // Saved and will be applied
  ERROR = 'error', // Failed validation or execution
}

type TransformationParams =
  | AddStaticParams
  | AddSubstringParams
  | DeleteParams
  | MaskParams
  | RenameKeyParams
  | RawOTTLParams;
```

**Type-Specific Parameters**:

```typescript
interface AddStaticParams {
  key: string;
  value: string;
  insertionPoint: string; // Section ID where to add
}

interface AddSubstringParams {
  sourceAttributePath: string; // Path to source attribute
  sourceKey: string;
  newKey: string;
  substringStart: number;
  substringEnd: number | 'end'; // 'end' for until end of string
  insertionPoint: string; // Section ID where to add
}

interface DeleteParams {
  attributePath: string; // Path to attribute to delete
  attributeKey: string;
}

interface MaskParams {
  attributePath: string; // Path to attribute to mask
  attributeKey: string;
  maskStart: number;
  maskEnd: number | 'end';
  maskChar: string; // Default: '*'
}

interface RenameKeyParams {
  attributePath: string;
  oldKey: string;
  newKey: string;
}

interface RawOTTLParams {
  statement: string; // OTTL statement as string
  insertionPoint: string; // Section ID
}
```

**Relationships**:
- Transformation → TelemetrySection (many:1 via sectionId)
- Transformation → DisplayAttribute (many:many via attributePath)

**State Transitions**:
- draft → active (user saves)
- active → draft (user edits)
- active → deleted (user undoes)
- any → error (validation/execution fails)

**Validation Rules**:
- **AddStatic**: key must be non-empty, not already exist in section
- **AddSubstring**: sourceAttributePath must exist, substringStart < substringEnd
- **Delete**: attributePath must exist
- **Mask**: attributePath must exist, maskStart < maskEnd, within value length
- **RenameKey**: oldKey must exist, newKey must not exist
- **RawOTTL**: statement must be non-empty (actual OTTL validation stubbed for demo)
- Order must be unique and sequential (0, 1, 2, ...)

---

### 4. UI State

**Purpose**: Manages UI-specific state (not persisted, runtime only)

```typescript
interface UIState {
  panels: PanelState;
  selection: SelectionState;
  keyboard: KeyboardState;
  dragDrop: DragDropState;
}

interface PanelState {
  inputPanelWidth: number; // Percentage (0-100)
  outputPanelWidth: number; // Percentage (0-100)
  isDragging: boolean;
}

interface SelectionState {
  selectedAttributeId: string | null;
  selectedText: TextSelection | null;
  hoveredAttributeId: string | null;
  focusedElementId: string | null;
}

interface TextSelection {
  attributeId: string;
  start: number; // Character index
  end: number; // Character index
  selectionType: 'full' | 'substring';
}

interface KeyboardState {
  mode: KeyboardMode;
  activeElement: string | null; // Element ID with focus
  hintBarVisible: boolean;
}

enum KeyboardMode {
  NAVIGATION = 'navigation', // Browsing tree
  EDIT = 'edit', // Editing a form
  DRAG = 'drag', // Dragging an element
}

interface DragDropState {
  draggingTransformationId: string | null;
  dropTargetSectionId: string | null;
  dropIndex: number | null;
}
```

**Relationships**:
- UIState is singleton (one per application instance)
- Selection references DisplayAttribute by ID
- DragDrop references Transformation by ID
- Keyboard references any interactive element by ID

**State Transitions**:
- KeyboardMode: navigation → edit (Enter pressed) → navigation (ESC/save/cancel)
- KeyboardMode: navigation → drag (drag handle clicked) → navigation (drop/ESC)
- Panel dragging: false → true (mousedown on divider) → false (mouseup)

**Validation Rules**:
- Panel widths must sum to 100
- selectedAttributeId must reference existing attribute
- Only one element can have focus at a time
- Cannot be in multiple keyboard modes simultaneously

---

### 5. Transformation Execution Result

**Purpose**: Output of transformation engine with metadata

```typescript
interface TransformationResult {
  transformedData: ResourceSpan; // Result after applying transformations
  transformedTree: TelemetryTree; // Display tree of result
  executionTime: number; // Milliseconds
  appliedTransformations: number; // Count of successfully applied
  failedTransformations: TransformationError[]; // Any failures
  warnings: TransformationWarning[]; // Non-fatal issues
}

interface TransformationError {
  transformationId: string;
  type: TransformationType;
  message: string;
  attributePath?: string;
}

interface TransformationWarning {
  transformationId: string;
  message: string;
}
```

**Relationships**:
- TransformationResult → ResourceSpan (1:1 transformed output)
- TransformationResult → TelemetryTree (1:1 display representation)
- TransformationError → Transformation (many:1)

**Validation Rules**:
- appliedTransformations + failedTransformations.length = total transformations
- executionTime must be non-negative
- transformedData must be valid OTLP structure

---

## Data Flow

```
1. INITIAL LOAD
   Hardcoded OTLP Sample (ResourceSpan)
     ↓ [TelemetryParser.parse()]
   Display Tree (TelemetryTree)
     ↓ [Render]
   INPUT Panel UI

2. USER CREATES TRANSFORMATION
   User Interaction (click Add button)
     ↓ [Show form]
   User Input (key=value)
     ↓ [Validate]
   Transformation (draft status)
     ↓ [User saves]
   Transformation (active status)
     ↓ [Update transformation list]
   UI Updates (show transformation row with label)

3. USER RUNS TRANSFORMATION
   Run Button Click / Cmd+Enter
     ↓ [Collect all active transformations]
   Transformation[] (ordered by 'order' field)
     ↓ [TransformationEngine.execute()]
   TransformationResult
     ↓ [Extract transformedTree]
   OUTPUT Panel UI (displays transformed tree)

4. USER REORDERS TRANSFORMATION
   Drag Handle Mousedown
     ↓ [Set dragDrop state]
   User Drags
     ↓ [Show drop indicators]
   User Drops
     ↓ [Update transformation order]
   Re-execute if OUTPUT panel active
     ↓
   Updated OUTPUT Panel UI

5. USER UNDOES TRANSFORMATION
   Undo Button Click
     ↓ [Remove transformation from list]
   Updated Transformation[]
     ↓ [Re-execute if needed]
   Updated OUTPUT Panel UI
```

---

## State Management Architecture

### Zustand Stores

**TransformationStore**:
```typescript
interface TransformationStore {
  transformations: Transformation[];
  lastExecutionResult: TransformationResult | null;
  
  // Actions
  addTransformation: (transformation: Transformation) => void;
  updateTransformation: (id: string, params: Partial<Transformation>) => void;
  removeTransformation: (id: string) => void;
  reorderTransformations: (sourceId: string, destinationIndex: number) => void;
  executeTransformations: (inputData: ResourceSpan) => TransformationResult;
  clearAll: () => void;
  
  // Selectors (derived state)
  getTransformationsBySection: (sectionId: string) => Transformation[];
  getUpdateCount: (sectionId: string) => number;
  canReorderTo: (transformationId: string, sectionId: string) => boolean;
}
```

**UIStore**:
```typescript
interface UIStore {
  panels: PanelState;
  selection: SelectionState;
  keyboard: KeyboardState;
  dragDrop: DragDropState;
  
  // Actions
  setPanelWidth: (inputWidth: number) => void;
  startPanelDrag: () => void;
  endPanelDrag: () => void;
  selectAttribute: (attributeId: string) => void;
  selectText: (selection: TextSelection) => void;
  clearSelection: () => void;
  setKeyboardMode: (mode: KeyboardMode) => void;
  moveFocus: (direction: 'up' | 'down' | 'left' | 'right') => void;
  startDrag: (transformationId: string) => void;
  updateDropTarget: (sectionId: string, index: number) => void;
  endDrag: () => void;
}
```

---

## Persistence

**Demo Version**: No persistence - all state is in-memory and reset on page reload

**Future Enhancement**: LocalStorage for:
- Transformation list (auto-save)
- Panel sizes (user preference)
- Collapsed/expanded sections (user preference)

---

## Data Validation Summary

| Entity | Validation Points | Error Handling |
|--------|-------------------|----------------|
| ResourceSpan | OTLP format compliance | Parse error message |
| DisplayAttribute | Valid path in OTLP | Skip invalid attributes |
| Transformation | Type-specific params | Show error status, prevent execution |
| TransformationResult | Valid OTLP output | Rollback to previous state |
| UIState | Valid IDs, sum constraints | Reset to defaults |

---

## Performance Considerations

1. **Immutable Updates**: All data transformations create new objects (spread operators)
2. **Memoization**: Derived state (tree from OTLP, transformation results) memoized
3. **Shallow Comparison**: Zustand selectors use shallow equality for re-render optimization
4. **Lazy Evaluation**: Transformation execution only on explicit user action (Run button)
5. **Batching**: Multiple transformations in sequence batched into single execution

---

## Testing Strategy

### Unit Tests
- Parse OTLP → TelemetryTree (all sections, attributes correct)
- Each transformation type (correct output for various inputs)
- Validation functions (catch invalid inputs)
- State actions (correct state updates)

### Integration Tests
- Full transformation pipeline (OTLP → transform → result)
- Reordering with section constraints
- Undo/redo affects correct transformations

### E2E Tests
- User creates transformation → sees in UI
- User runs transformation → OUTPUT updates
- User reorders → order persists and affects result

---

**Status**: ✅ Data model complete
**Next**: Contract definitions (TypeScript interfaces)




