import { create } from 'zustand';
import { ResourceSpan } from '@/types/telemetry-types';
import {
  Transformation,
  TransformationResult,
} from '@/types/transformation-types';
import { TransformationEngine } from '@/lib/transformations/transformation-engine';

interface TransformationStore {
  transformations: Transformation[];
  lastExecutionResult: TransformationResult | null;
  attributeOrder: Map<string, string[]>; // sectionId -> ordered attribute KEYS (not IDs)

  // Actions
  addTransformation: (transformation: Transformation) => void;
  updateTransformation: (
    id: string,
    params: Partial<Transformation>
  ) => void;
  removeTransformation: (id: string) => void;
  reorderTransformations: (sourceId: string, destinationIndex: number) => void;
  executeTransformations: (inputData: ResourceSpan) => TransformationResult;
  clearAll: () => void;
  setAttributeOrder: (sectionId: string, order: string[]) => void;

  // Selectors
  getTransformationsBySection: (sectionId: string) => Transformation[];
  getUpdateCount: (sectionId: string) => number;
  canReorderTo: (transformationId: string, sectionId: string) => boolean;
}

export const useTransformationStore = create<TransformationStore>(
  (set, get) => ({
    transformations: [],
    lastExecutionResult: null,
    attributeOrder: new Map(),

    addTransformation: (transformation) =>
      set((state) => ({
        transformations: [
          ...state.transformations,
          { ...transformation, order: state.transformations.length },
        ],
      })),

    updateTransformation: (id, params) =>
      set((state) => ({
        transformations: state.transformations.map((t) =>
          t.id === id ? { ...t, ...params } : t
        ),
      })),

    removeTransformation: (id) =>
      set((state) => ({
        transformations: state.transformations
          .filter((t) => t.id !== id)
          .map((t, index) => ({ ...t, order: index })),
      })),

    reorderTransformations: (sourceId, destinationIndex) =>
      set((state) => {
        const transformations = [...state.transformations];
        const sourceIndex = transformations.findIndex((t) => t.id === sourceId);

        if (sourceIndex === -1) return state;

        const [removed] = transformations.splice(sourceIndex, 1);
        transformations.splice(destinationIndex, 0, removed);

        return {
          transformations: transformations.map((t, index) => ({
            ...t,
            order: index,
          })),
        };
      }),

    executeTransformations: (inputData) => {
      const result = TransformationEngine.execute(
        inputData,
        get().transformations,
        get().attributeOrder
      );
      set({ lastExecutionResult: result });
      return result;
    },

    clearAll: () =>
      set({
        transformations: [],
        lastExecutionResult: null,
        attributeOrder: new Map(),
      }),

    setAttributeOrder: (sectionId, order) =>
      set((state) => {
        const newOrder = new Map(state.attributeOrder);
        newOrder.set(sectionId, order);
        return { attributeOrder: newOrder };
      }),

    getTransformationsBySection: (sectionId) => {
      return get().transformations.filter((t) => t.sectionId === sectionId);
    },

    getUpdateCount: (sectionId) => {
      return get().transformations.filter((t) => t.sectionId === sectionId)
        .length;
    },

    canReorderTo: (transformationId, sectionId) => {
      const transformation = get().transformations.find(
        (t) => t.id === transformationId
      );
      if (!transformation) return false;

      // ADD and RAW_OTTL can go anywhere
      if (
        transformation.type === 'add-static' ||
        transformation.type === 'add-substring' ||
        transformation.type === 'raw-ottl'
      ) {
        return true;
      }

      // Others must stay in same section
      return transformation.sectionId === sectionId;
    },
  })
);

