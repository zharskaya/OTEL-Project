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
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { TelemetrySection, ValueType, ModificationColor, DisplayAttribute } from '@/types/telemetry-types';
import { AttributeRow } from './attribute-row';
import { SectionHeader } from '@/components/section-header/section-header';
import { AddAttributeForm } from '@/components/transformations/add-attribute-form';
import { SubstringAttributeForm } from '@/components/transformations/substring-attribute-form';
import { RawOTTLForm } from '@/components/transformations/raw-ottl-form';
import { useTransformations, useTransformationActions } from '@/lib/state/hooks';

interface TreeSectionProps {
  section: TelemetrySection;
}

export function TreeSection({ section }: TreeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.expanded);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showOTTLForm, setShowOTTLForm] = useState(false);
  const [showSubstringForm, setShowSubstringForm] = useState(false);
  const [substringParams, setSubstringParams] = useState<{
    sourceKey: string;
    sourcePath: string;
    sectionId: string;
    substringStart: number;
    substringEnd: number | 'end';
    sourceAttributePath: string;
  } | null>(null);
  
  // Track visual order of attributes (separate from transformation execution order)
  const [visualOrder, setVisualOrder] = useState<string[]>([]);
  
  // Track drop indicator position
  const [dropIndicatorId, setDropIndicatorId] = useState<string | null>(null);
  
  // Track active dragged item
  const [activeId, setActiveId] = useState<string | null>(null);

  const transformations = useTransformations();
  const { reorderTransformations, setAttributeOrder } = useTransformationActions();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  // Get transformations for this section to create sortable IDs
  const sectionTransformations = transformations.filter(t => t.sectionId === section.id);
  
  // Get attributes that have transformations applied
  const modifiedAttributePaths = new Set(
    sectionTransformations
      .filter(t => t.type === 'delete' || t.type === 'mask' || t.type === 'rename-key')
      .map(t => (t.params as any).attributePath)
  );

  // Get newly added attributes from transformations
  const addedAttributes = React.useMemo(() => {
    return sectionTransformations
      .filter(t => t.type === 'add-static' || t.type === 'add-substring' || t.type === 'raw-ottl')
      .map(t => {
        const params = t.params as any;
        
        // For raw OTTL, display the statement as both key and value
        if (t.type === 'raw-ottl') {
          return {
            id: `added-${t.id}`,
            path: `${params.insertionPoint}.ottl-${t.id}`,
            sectionId: section.id,
            key: 'OTTL',
            value: params.statement,
            valueType: ValueType.STRING,
            depth: 0,
            isRawOTTL: true, // Mark as raw OTTL for special rendering
            sourceAttributePath: undefined, // No source
            modifications: [{
              transformationId: t.id,
              type: t.type,
              label: 'ADD',
              color: ModificationColor.GREEN,
            }],
          };
        }
        
        // For substring attributes, compute the extracted value
        let displayValue = params.value || '';
        let sourceAttrPath = undefined;
        if (t.type === 'add-substring') {
          // Find the source attribute
          const sourceAttr = section.attributes.find(attr => attr.key === params.sourceKey);
          if (sourceAttr) {
            // Get the raw value (strip quotes if it's a string type)
            let rawValue = sourceAttr.value;
            if (sourceAttr.valueType === ValueType.STRING && typeof rawValue === 'string') {
              // If value is stored with quotes, strip them for substring extraction
              if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
                rawValue = rawValue.slice(1, -1);
              }
            }
            const end = params.substringEnd === 'end' ? rawValue.length : params.substringEnd;
            displayValue = rawValue.substring(params.substringStart, end);
            sourceAttrPath = sourceAttr.path; // Track source attribute path
          }
        }
        
        return {
          id: `added-${t.id}`,
          path: `${params.insertionPoint}.${params.newKey || params.key}`,
          sectionId: section.id,
          key: params.newKey || params.key,
          value: displayValue,
          valueType: ValueType.STRING,
          depth: 0,
          sourceAttributePath: sourceAttrPath, // Track which attribute this was derived from
          modifications: [{
            transformationId: t.id,
            type: t.type,
            label: 'ADD',
            color: ModificationColor.GREEN,
          }],
        };
      });
  }, [sectionTransformations, section.id, section.attributes]);

  // Combine original attributes with added attributes based on creation logic
  const baseAttributes = React.useMemo(() => {
    const result: DisplayAttribute[] = [];
    const substringAttrs = addedAttributes.filter(a => a.sourceAttributePath);
    const otherAddedAttrs = addedAttributes.filter(a => !a.sourceAttributePath);
    
    // Add non-substring attributes at the top (newest first - most recent addition goes to position 0)
    result.push(...[...otherAddedAttrs].reverse());
    
    // Then add original attributes (they stay in their original order)
    result.push(...section.attributes);
    
    // Note: substring attributes are added inline with their source, handled separately
    // For now, we'll add them at the end
    result.push(...substringAttrs);
    
    return result;
  }, [addedAttributes, section.attributes]);
  
  // Update visual order when base attributes change
  React.useEffect(() => {
    const newIds = baseAttributes.map(a => a.id);
    const newIdsStr = newIds.join(',');
    
    setVisualOrder(prev => {
      const prevStr = prev.join(',');
      
      // If nothing changed, return previous state to avoid re-render
      if (prevStr === newIdsStr) {
        return prev;
      }
      
      // Find what's new and what's removed
      const prevSet = new Set(prev);
      const newIdsSet = new Set(newIds);
      const added = newIds.filter(id => !prevSet.has(id));
      const removed = prev.filter(id => !newIdsSet.has(id));
      
      // If no changes, keep existing order
      if (added.length === 0 && removed.length === 0) {
        return prev;
      }
      
      // CRITICAL: Keep exact order of existing attributes, only add new ones at the top
      const result: string[] = [];
      
      // 1. Add new attributes at the top (in the order they appear in baseAttributes)
      result.push(...added);
      
      // 2. Add existing attributes in their EXACT current order (from prev/visualOrder)
      prev.forEach(id => {
        if (newIdsSet.has(id)) {
          result.push(id);
        }
      });
      
      // Save order to store by KEYS (not IDs) so OUTPUT can match them
      const idToKey = new Map(baseAttributes.map(a => [a.id, a.key]));
      const keyOrder = result.map(id => idToKey.get(id)).filter((k): k is string => k !== undefined);
      setAttributeOrder(section.id, keyOrder);
      
      return result;
    });
  }, [baseAttributes, section.id, setAttributeOrder]);
  
  // Sort attributes by visual order
  const allAttributes = React.useMemo(() => {
    if (visualOrder.length === 0) return baseAttributes;
    
    // Create a map for quick lookup
    const attrMap = new Map(baseAttributes.map(a => [a.id, a]));
    
    // Sort by visual order
    return visualOrder
      .map(id => attrMap.get(id))
      .filter((a): a is DisplayAttribute => a !== undefined);
  }, [baseAttributes, visualOrder]);

  // Create sortable items list including modified attributes and added attributes
  const sortableItems = allAttributes
    .filter(attr => 
      modifiedAttributePaths.has(attr.path) || 
      attr.modifications.some(m => m.type === 'add-static' || m.type === 'add-substring' || m.type === 'raw-ottl')
    )
    .map(attr => attr.id);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    setDropIndicatorId(over ? (over.id as string) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Clear drop indicator and active item
    setDropIndicatorId(null);
    setActiveId(null);
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = visualOrder.indexOf(active.id as string);
    const newIndex = visualOrder.indexOf(over.id as string);

    if (oldIndex === -1 || newIndex === -1) return;

    // Update visual order using arrayMove
    const newVisualOrder = arrayMove(visualOrder, oldIndex, newIndex);
    setVisualOrder(newVisualOrder);
    
    // CRITICAL: Save the new order to the store by KEYS so OUTPUT panel can use it
    const idToKey = new Map(allAttributes.map(a => [a.id, a.key]));
    const keyOrder = newVisualOrder.map(id => idToKey.get(id)).filter((k): k is string => k !== undefined);
    setAttributeOrder(section.id, keyOrder);

    // Now update transformation execution order based on new visual order
    // Find all transformations for modified/added attributes in this section
    const orderedTransformations = newVisualOrder
      .map(attrId => {
        const attr = allAttributes.find(a => a.id === attrId);
        if (!attr || attr.modifications.length === 0) return null;
        return attr.modifications[0].transformationId;
      })
      .filter((id): id is string => id !== null);

    // Reorder each transformation to match its position in visual order
    orderedTransformations.forEach((transformationId, visualIndex) => {
      const globalIndex = transformations.findIndex(t => t.id === transformationId);
      if (globalIndex !== -1 && globalIndex !== visualIndex) {
        reorderTransformations(transformationId, visualIndex);
      }
    });
  };

  const handleAddStatic = () => {
    setShowAddForm(true);
    setShowOTTLForm(false);
    setShowSubstringForm(false);
  };

  const handleAddRawOTTL = () => {
    setShowOTTLForm(true);
    setShowAddForm(false);
    setShowSubstringForm(false);
  };

  const handleRequestSubstring = (params: {
    sourceKey: string;
    sourcePath: string;
    sectionId: string;
    substringStart: number;
    substringEnd: number | 'end';
  }) => {
    setSubstringParams({
      ...params,
      sourceAttributePath: params.sourcePath,
    });
    setShowSubstringForm(true);
    setShowAddForm(false);
    setShowOTTLForm(false);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setShowOTTLForm(false);
    setShowSubstringForm(false);
    setSubstringParams(null);
  };

  return (
    <div className="mb-3">
      {/* Section Header */}
      <SectionHeader
        sectionId={section.id}
        title={section.label}
        isExpanded={isExpanded}
        onToggleExpand={toggleExpand}
        onAddStatic={handleAddStatic}
        onAddRawOTTL={handleAddRawOTTL}
      />

      {/* Section Content */}
      {isExpanded && (
        <>

          {/* Add form */}
          {showAddForm && (
            <AddAttributeForm
              sectionId={section.id}
              onCancel={handleFormClose}
              onSave={handleFormClose}
            />
          )}

          {/* Raw OTTL form */}
          {showOTTLForm && (
            <RawOTTLForm
              sectionId={section.id}
              onCancel={handleFormClose}
              onSave={handleFormClose}
            />
          )}

          {/* Attributes */}
          <div className="border-t border-gray-100">
            {allAttributes.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 leading-tight">
                No attributes
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sortableItems}
                  strategy={verticalListSortingStrategy}
                >
                  <div>
                    {allAttributes.map((attribute) => (
                      <React.Fragment key={attribute.id}>
                        {/* Show substring form right above the source attribute */}
                        {showSubstringForm && substringParams && substringParams.sourceAttributePath === attribute.path && (
                          <SubstringAttributeForm
                            sourceKey={substringParams.sourceKey}
                            sourcePath={substringParams.sourcePath}
                            sectionId={substringParams.sectionId}
                            substringStart={substringParams.substringStart}
                            substringEnd={substringParams.substringEnd}
                            onCancel={handleFormClose}
                            onSave={handleFormClose}
                          />
                        )}
                        <AttributeRow
                          attribute={attribute}
                          onRequestSubstring={handleRequestSubstring}
                          isDraggable={
                            modifiedAttributePaths.has(attribute.path) || 
                            attribute.modifications.some(m => m.type === 'add-static' || m.type === 'add-substring' || m.type === 'raw-ottl')
                          }
                          showDropIndicator={dropIndicatorId === attribute.id}
                        />
                      </React.Fragment>
                    ))}
                  </div>
                </SortableContext>
                
                {/* Drag overlay - shows the dragged item */}
                <DragOverlay>
                  {activeId ? (
                    <div className="cursor-grabbing bg-white shadow-lg rounded border border-gray-200">
                      {(() => {
                        const draggedAttr = allAttributes.find(a => a.id === activeId);
                        if (!draggedAttr) return null;
                        return (
                          <AttributeRow
                            attribute={draggedAttr}
                            isDraggable={true}
                            onRequestSubstring={handleRequestSubstring}
                          />
                        );
                      })()}
                    </div>
                  ) : null}
                </DragOverlay>
              </DndContext>
            )}
          </div>
        </>
      )}
    </div>
  );
}

