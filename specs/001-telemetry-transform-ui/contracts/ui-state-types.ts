/**
 * TypeScript interfaces for UI state management
 * Defines all runtime UI state (not persisted)
 */

export interface UIState {
  panels: PanelState;
  selection: SelectionState;
  keyboard: KeyboardState;
  dragDrop: DragDropState;
}

export interface PanelState {
  inputPanelWidth: number; // Percentage (0-100)
  outputPanelWidth: number; // Percentage (0-100)
  isDragging: boolean;
}

export interface SelectionState {
  selectedAttributeId: string | null;
  selectedText: TextSelection | null;
  hoveredAttributeId: string | null;
  focusedElementId: string | null;
}

export interface TextSelection {
  attributeId: string;
  start: number;
  end: number;
  selectionType: 'full' | 'substring';
}

export interface KeyboardState {
  mode: KeyboardMode;
  activeElement: string | null;
  hintBarVisible: boolean;
}

export enum KeyboardMode {
  NAVIGATION = 'navigation',
  EDIT = 'edit',
  DRAG = 'drag',
}

export interface DragDropState {
  draggingTransformationId: string | null;
  dropTargetSectionId: string | null;
  dropIndex: number | null;
}

// Zustand store interfaces

export interface TransformationStore {
  transformations: Transformation[];
  lastExecutionResult: TransformationResult | null;
  
  // Actions
  addTransformation: (transformation: Transformation) => void;
  updateTransformation: (id: string, params: Partial<Transformation>) => void;
  removeTransformation: (id: string) => void;
  reorderTransformations: (sourceId: string, destinationIndex: number) => void;
  executeTransformations: (inputData: ResourceSpan) => TransformationResult;
  clearAll: () => void;
  
  // Selectors
  getTransformationsBySection: (sectionId: string) => Transformation[];
  getUpdateCount: (sectionId: string) => number;
  canReorderTo: (transformationId: string, sectionId: string) => boolean;
}

export interface UIStore {
  state: UIState;
  
  // Panel actions
  setPanelWidth: (inputWidth: number) => void;
  startPanelDrag: () => void;
  endPanelDrag: () => void;
  
  // Selection actions
  selectAttribute: (attributeId: string) => void;
  selectText: (selection: TextSelection) => void;
  clearSelection: () => void;
  setHoveredAttribute: (attributeId: string | null) => void;
  
  // Keyboard actions
  setKeyboardMode: (mode: KeyboardMode) => void;
  setActiveElement: (elementId: string | null) => void;
  moveFocus: (direction: 'up' | 'down' | 'left' | 'right') => void;
  setHintBarVisible: (visible: boolean) => void;
  
  // Drag-drop actions
  startDrag: (transformationId: string) => void;
  updateDropTarget: (sectionId: string | null, index: number | null) => void;
  endDrag: () => void;
}

// Import types from other contracts (for reference)
import { Transformation, TransformationResult } from './transformation-types';
import { ResourceSpan } from './telemetry-types';

// Keyboard shortcuts configuration

export interface KeyboardShortcut {
  key: string;
  modifiers: KeyModifier[];
  action: string;
  description: string;
  context: KeyboardMode[];
}

export enum KeyModifier {
  CTRL = 'ctrl',
  CMD = 'cmd',
  SHIFT = 'shift',
  ALT = 'alt',
}

export const KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  {
    key: 'Enter',
    modifiers: [KeyModifier.CMD],
    action: 'run-transformation',
    description: 'Run transformation',
    context: [KeyboardMode.NAVIGATION, KeyboardMode.EDIT],
  },
  {
    key: 'Enter',
    modifiers: [],
    action: 'save-edit',
    description: 'Save changes',
    context: [KeyboardMode.EDIT],
  },
  {
    key: 'Escape',
    modifiers: [],
    action: 'cancel-edit',
    description: 'Cancel edit',
    context: [KeyboardMode.EDIT, KeyboardMode.DRAG],
  },
  {
    key: 'Tab',
    modifiers: [],
    action: 'next-element',
    description: 'Next element',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: 'ArrowUp',
    modifiers: [],
    action: 'previous-row',
    description: 'Previous row',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: 'ArrowDown',
    modifiers: [],
    action: 'next-row',
    description: 'Next row',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: 'ArrowUp',
    modifiers: [KeyModifier.CMD],
    action: 'move-up',
    description: 'Move up',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: 'ArrowDown',
    modifiers: [KeyModifier.CMD],
    action: 'move-down',
    description: 'Move down',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: '[',
    modifiers: [KeyModifier.CMD],
    action: 'move-up',
    description: 'Move up',
    context: [KeyboardMode.NAVIGATION],
  },
  {
    key: ']',
    modifiers: [KeyModifier.CMD],
    action: 'move-down',
    description: 'Move down',
    context: [KeyboardMode.NAVIGATION],
  },
];




