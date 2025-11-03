import { create } from 'zustand';
import {
  UIState,
  PanelState,
  SelectionState,
  KeyboardState,
  DragDropState,
  KeyboardMode,
  TextSelection,
} from '@/types/ui-state-types';

interface UIStore {
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

const initialState: UIState = {
  panels: {
    inputPanelWidth: 50,
    outputPanelWidth: 50,
    isDragging: false,
  },
  selection: {
    selectedAttributeId: null,
    selectedText: null,
    hoveredAttributeId: null,
    focusedElementId: null,
  },
  keyboard: {
    mode: KeyboardMode.NAVIGATION,
    activeElement: null,
    hintBarVisible: true,
  },
  dragDrop: {
    draggingTransformationId: null,
    dropTargetSectionId: null,
    dropIndex: null,
  },
};

export const useUIStore = create<UIStore>((set) => ({
  state: initialState,

  setPanelWidth: (inputWidth) =>
    set((state) => ({
      state: {
        ...state.state,
        panels: {
          ...state.state.panels,
          inputPanelWidth: inputWidth,
          outputPanelWidth: 100 - inputWidth,
        },
      },
    })),

  startPanelDrag: () =>
    set((state) => ({
      state: {
        ...state.state,
        panels: {
          ...state.state.panels,
          isDragging: true,
        },
      },
    })),

  endPanelDrag: () =>
    set((state) => ({
      state: {
        ...state.state,
        panels: {
          ...state.state.panels,
          isDragging: false,
        },
      },
    })),

  selectAttribute: (attributeId) =>
    set((state) => ({
      state: {
        ...state.state,
        selection: {
          ...state.state.selection,
          selectedAttributeId: attributeId,
        },
      },
    })),

  selectText: (selection) =>
    set((state) => ({
      state: {
        ...state.state,
        selection: {
          ...state.state.selection,
          selectedText: selection,
        },
      },
    })),

  clearSelection: () =>
    set((state) => ({
      state: {
        ...state.state,
        selection: {
          ...state.state.selection,
          selectedAttributeId: null,
          selectedText: null,
        },
      },
    })),

  setHoveredAttribute: (attributeId) =>
    set((state) => ({
      state: {
        ...state.state,
        selection: {
          ...state.state.selection,
          hoveredAttributeId: attributeId,
        },
      },
    })),

  setKeyboardMode: (mode) =>
    set((state) => ({
      state: {
        ...state.state,
        keyboard: {
          ...state.state.keyboard,
          mode,
        },
      },
    })),

  setActiveElement: (elementId) =>
    set((state) => ({
      state: {
        ...state.state,
        keyboard: {
          ...state.state.keyboard,
          activeElement: elementId,
        },
      },
    })),

  moveFocus: (direction) => {
    // Implementation would depend on DOM structure
    console.log(`Moving focus: ${direction}`);
  },

  setHintBarVisible: (visible) =>
    set((state) => ({
      state: {
        ...state.state,
        keyboard: {
          ...state.state.keyboard,
          hintBarVisible: visible,
        },
      },
    })),

  startDrag: (transformationId) =>
    set((state) => ({
      state: {
        ...state.state,
        dragDrop: {
          ...state.state.dragDrop,
          draggingTransformationId: transformationId,
        },
      },
    })),

  updateDropTarget: (sectionId, index) =>
    set((state) => ({
      state: {
        ...state.state,
        dragDrop: {
          ...state.state.dragDrop,
          dropTargetSectionId: sectionId,
          dropIndex: index,
        },
      },
    })),

  endDrag: () =>
    set((state) => ({
      state: {
        ...state.state,
        dragDrop: {
          draggingTransformationId: null,
          dropTargetSectionId: null,
          dropIndex: null,
        },
      },
    })),
}));

