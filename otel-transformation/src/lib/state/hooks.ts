import { useTransformationStore } from './transformation-store';
import { useMemo } from 'react';

/**
 * Custom hooks for accessing transformation store state
 */
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
