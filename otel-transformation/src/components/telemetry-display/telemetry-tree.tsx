'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { TelemetryTree as TelemetryTreeType, DisplayAttribute } from '@/types/telemetry-types';
import { TreeSection } from './tree-section';
import { AttributeRow } from './attribute-row';
import { useTransformations, useTransformationActions } from '@/lib/state/hooks';
import { useTransformationStore } from '@/lib/state/transformation-store';
import { TransformationType, TransformationStatus } from '@/types/transformation-types';

interface TelemetryTreeProps {
  tree: TelemetryTreeType;
}

export function TelemetryTree({ tree }: TelemetryTreeProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [dropIndicatorId, setDropIndicatorId] = useState<string | null>(null);
  const [pendingCrossSectionId, setPendingCrossSectionId] = useState<string | null>(null);
  
  const transformations = useTransformations();
  const { addTransformation, setAttributeOrder } = useTransformationActions();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Extract section ID and attribute ID from a composite ID (format: "sectionId:attributeId")
  const parseId = (id: string): { sectionId: string; attributeId: string } | null => {
    const parts = id.split(':');
    if (parts.length !== 2) return null;
    return { sectionId: parts[0], attributeId: parts[1] };
  };

  // Get the dragged attribute for the overlay
  const getDraggedAttribute = () => {
    if (!activeId) return null;
    
    const parsed = parseId(activeId);
    if (!parsed) return null;
    
    const section = tree.sections.find(s => s.id === parsed.sectionId);
    if (!section) return null;
    
    // Check both original attributes and added attributes (transformations)
    const attr = section.attributes.find(a => a.id === parsed.attributeId);
    return attr || null;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
    setPendingCrossSectionId(null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setDropIndicatorId(over ? (over.id as string) : null);

    const { active } = event;
    if (!over) {
      setPendingCrossSectionId(null);
      return;
    }

    const activeInfo = parseId(active.id as string);
    const overInfo = parseId(over.id as string);
    if (!activeInfo || !overInfo) {
      setPendingCrossSectionId(null);
      return;
    }

    if (activeInfo.sectionId !== overInfo.sectionId) {
      setPendingCrossSectionId(active.id as string);
    } else {
      setPendingCrossSectionId(null);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setDropIndicatorId(null);
    setActiveId(null);
    setPendingCrossSectionId(null);
    
    const { active, over } = event;
    if (!over || active.id === over.id) {
      return;
    }

    const activeInfo = parseId(active.id as string);
    const overInfo = parseId(over.id as string);
    
    if (!activeInfo || !overInfo) return;

    // Check if dragging between different sections
    if (activeInfo.sectionId !== overInfo.sectionId) {
      // Cross-section drag detected
      // Find the attribute being dragged
      const sourceSection = tree.sections.find(s => s.id === activeInfo.sectionId);
      const destSection = tree.sections.find(s => s.id === overInfo.sectionId);
      
      if (!sourceSection || !destSection) return;
      
      // Find the attribute in source section
      const draggedAttr = sourceSection.attributes.find(a => a.id === activeInfo.attributeId);
      if (!draggedAttr) return;
      
      // Find the drop target attribute in destination section
      const dropTargetAttr = destSection.attributes.find(a => a.id === overInfo.attributeId);
      
      // Check if the attribute is already deleted - deleted attributes cannot be moved between sections
      const isDeleted = transformations.some(
        t => t.type === TransformationType.DELETE &&
          (t.params as any).attributeKey === draggedAttr.key &&
          (t.params as any).attributePath === draggedAttr.path
      );
      
      if (isDeleted) {
        // Don't allow cross-section drag for deleted attributes
        return;
      }
      
      // Get current order of destination section attributes (read from store without subscribing)
      const attributeOrder = useTransformationStore.getState().attributeOrder;
      const destSectionOrder = attributeOrder.get(overInfo.sectionId)
        ? [...(attributeOrder.get(overInfo.sectionId) as string[])]
        : destSection.attributes.map(a => a.key);
      
      // Find the index where we should insert
      // Remove the key if it already exists in the destination order (should not happen but keeps things safe)
      const existingIndex = destSectionOrder.indexOf(draggedAttr.key);
      if (existingIndex !== -1) {
        destSectionOrder.splice(existingIndex, 1);
      }

      let insertIndex = destSectionOrder.length;
      if (dropTargetAttr) {
        insertIndex = destSectionOrder.indexOf(dropTargetAttr.key);
        if (insertIndex === -1) insertIndex = destSectionOrder.length;
      }
      
      // Create new order with the dragged attribute inserted at the drop position
      const newOrder = [...destSectionOrder];
      newOrder.splice(insertIndex, 0, draggedAttr.key);
      
      // Create DELETE transformation in source section
      addTransformation({
        id: `t-${Date.now()}-delete`,
        type: TransformationType.DELETE,
        order: 0,
        sectionId: activeInfo.sectionId,
        createdAt: new Date(),
        status: TransformationStatus.ACTIVE,
        params: {
          type: TransformationType.DELETE,
          attributePath: draggedAttr.path,
          attributeKey: draggedAttr.key,
        },
      });
      
      // Create ADD transformation in destination section
      addTransformation({
        id: `t-${Date.now()}-add`,
        type: TransformationType.ADD_STATIC,
        order: 0,
        sectionId: overInfo.sectionId,
        createdAt: new Date(),
        status: TransformationStatus.ACTIVE,
        params: {
          type: TransformationType.ADD_STATIC,
          insertionPoint: destSection.id,
          key: draggedAttr.key,
          value: draggedAttr.value,
        },
      });
      
      // Update the visual order to place the attribute at the drop position
      setAttributeOrder(overInfo.sectionId, newOrder);
    } else {
      // Same section reordering
      const attributeOrder = useTransformationStore.getState().attributeOrder;
      const currentOrder = attributeOrder.get(activeInfo.sectionId)
        ? [...(attributeOrder.get(activeInfo.sectionId) as string[])]
        : undefined;

      if (!currentOrder || currentOrder.length === 0) {
        // TreeSection will initialize and we can try again after state settles
        return;
      }

      const activeSortable = (active.data.current as any)?.sortable;
      const overSortable = (over.data.current as any)?.sortable;
      const fromIndex = typeof activeSortable?.index === 'number' ? activeSortable.index : -1;
      const toIndex = typeof overSortable?.index === 'number' ? overSortable.index : -1;

      if (fromIndex === -1 || toIndex === -1) {
        return;
      }

      const newOrder = arrayMove(currentOrder, fromIndex, toIndex);

      if (newOrder.join(',') === currentOrder.join(',')) {
        return;
      }

      setAttributeOrder(activeInfo.sectionId, newOrder);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div>
        {tree.sections.map((section) => (
          <TreeSection 
            key={section.id} 
            section={section}
            dropIndicatorId={dropIndicatorId}
            activeId={activeId}
            pendingDeletionId={pendingCrossSectionId}
          />
        ))}
      </div>
      
      {/* Drag overlay for cross-section dragging */}
      <DragOverlay>
        {activeId ? (() => {
          const draggedAttr = getDraggedAttribute();
          if (!draggedAttr) return null;
          
          return (
            <div className="cursor-grabbing bg-gray-200 shadow-lg rounded border border-gray-300">
              <AttributeRow
                attribute={draggedAttr}
                isDraggable={false}
              />
            </div>
          );
        })() : null}
      </DragOverlay>
    </DndContext>
  );
}

