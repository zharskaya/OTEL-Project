import { useTransformationStore } from './transformation-store';
import { useUIStore } from './ui-store';
import { useMemo } from 'react';

/**
 * Custom hooks for accessing store state
 */

// Transformation store hooks
export function useTransformations() {
  return useTransformationStore((state) => state.transformations);
}

export function useLastExecutionResult() {
  return useTransformationStore((state) => state.lastExecutionResult);
}

export function useTransformationActions() {
  const addTransformation = useTransformationStore((state) => state.addTransformation);
  const updateTransformation = useTransformationStore((state) => state.updateTransformation);
  const removeTransformation = useTransformationStore((state) => state.removeTransformation);
  const reorderTransformations = useTransformationStore((state) => state.reorderTransformations);
  const executeTransformations = useTransformationStore((state) => state.executeTransformations);
  const clearAll = useTransformationStore((state) => state.clearAll);
  const setAttributeOrder = useTransformationStore((state) => state.setAttributeOrder);

  return useMemo(
    () => ({
      addTransformation,
      updateTransformation,
      removeTransformation,
      reorderTransformations,
      executeTransformations,
      clearAll,
      setAttributeOrder,
    }),
    [addTransformation, updateTransformation, removeTransformation, reorderTransformations, executeTransformations, clearAll, setAttributeOrder]
  );
}

export function useTransformationsBySection(sectionId: string) {
  const allTransformations = useTransformationStore((state) => state.transformations);
  
  return useMemo(
    () => allTransformations.filter((t) => t.sectionId === sectionId),
    [allTransformations, sectionId]
  );
}

export function useUpdateCount(sectionId: string) {
  const allTransformations = useTransformationStore((state) => state.transformations);

  return useMemo(
    () => allTransformations.filter((t) => t.sectionId === sectionId).length,
    [allTransformations, sectionId]
  );
}

export function useAttributeOrder() {
  return useTransformationStore((state) => state.attributeOrder);
}

// UI store hooks
export function useUIState() {
  return useUIStore((state) => state.state);
}

export function usePanelState() {
  return useUIStore((state) => state.state.panels);
}

export function useSelectionState() {
  return useUIStore((state) => state.state.selection);
}

export function useKeyboardState() {
  return useUIStore((state) => state.state.keyboard);
}

export function useDragDropState() {
  return useUIStore((state) => state.state.dragDrop);
}

export function useUIActions() {
  const setPanelWidth = useUIStore((state) => state.setPanelWidth);
  const startPanelDrag = useUIStore((state) => state.startPanelDrag);
  const endPanelDrag = useUIStore((state) => state.endPanelDrag);
  const selectAttribute = useUIStore((state) => state.selectAttribute);
  const selectText = useUIStore((state) => state.selectText);
  const clearSelection = useUIStore((state) => state.clearSelection);
  const setHoveredAttribute = useUIStore((state) => state.setHoveredAttribute);
  const setKeyboardMode = useUIStore((state) => state.setKeyboardMode);
  const setActiveElement = useUIStore((state) => state.setActiveElement);
  const moveFocus = useUIStore((state) => state.moveFocus);
  const setHintBarVisible = useUIStore((state) => state.setHintBarVisible);
  const startDrag = useUIStore((state) => state.startDrag);
  const updateDropTarget = useUIStore((state) => state.updateDropTarget);
  const endDrag = useUIStore((state) => state.endDrag);
  
  return useMemo(
    () => ({
      setPanelWidth,
      startPanelDrag,
      endPanelDrag,
      selectAttribute,
      selectText,
      clearSelection,
      setHoveredAttribute,
      setKeyboardMode,
      setActiveElement,
      moveFocus,
      setHintBarVisible,
      startDrag,
      updateDropTarget,
      endDrag,
    }),
    [setPanelWidth, startPanelDrag, endPanelDrag, selectAttribute, selectText, clearSelection, setHoveredAttribute, setKeyboardMode, setActiveElement, moveFocus, setHintBarVisible, startDrag, updateDropTarget, endDrag]
  );
}

