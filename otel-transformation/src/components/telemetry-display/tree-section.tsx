'use client';

import React, { useState } from 'react';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TelemetrySection, ValueType, ModificationColor, DisplayAttribute } from '@/types/telemetry-types';
import { TransformationType } from '@/types/transformation-types';
import { AttributeRow } from './attribute-row';
import { SectionHeader } from '@/components/section-header/section-header';
import { AddAttributeForm } from '@/components/transformations/add-attribute-form';
import { SubstringAttributeForm } from '@/components/transformations/substring-attribute-form';
import { RawOTTLForm } from '@/components/transformations/raw-ottl-form';
import { useTransformations, useTransformationActions } from '@/lib/state/hooks';
import { useTransformationStore } from '@/lib/state/transformation-store';

interface TreeSectionProps {
  section: TelemetrySection;
  dropIndicatorId: string | null;
  activeId: string | null;
}

export function TreeSection({ section, dropIndicatorId, activeId }: TreeSectionProps) {
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

  const transformations = useTransformations();
  const { reorderTransformations, setAttributeOrder } = useTransformationActions();

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
      .map((t, idx) => {
        const params = t.params as any;
        // Create unique ID using stable transformation ID
        // The transformation ID already contains timestamp, so it's unique
        const key = params.newKey || params.key || 'OTTL';
        const uniqueId = `added-${section.id}-${key}-${t.id}-idx${idx}`;
        
        // For raw OTTL, display the statement as entered (no parsing)
        if (t.type === 'raw-ottl') {
          return {
            id: uniqueId,
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
          id: uniqueId,
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
    
    // Then add original attributes with substring attributes inserted ABOVE their source
    for (const attr of section.attributes) {
      // Find any substring attributes that were extracted from this attribute
      const substringsBefore = substringAttrs.filter(sa => sa.sourceAttributePath === attr.path);
      
      // Insert substring attributes ABOVE (before) their source attribute
      result.push(...substringsBefore);
      
      // Then add the original attribute
      result.push(attr);
    }
    
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
      
      // Check if there's a pre-set order in the store (from cross-section drag)
      const storedOrder = useTransformationStore.getState().attributeOrder.get(section.id);
      const keyToId = new Map(baseAttributes.map(a => [a.key, a.id]));
      
      if (storedOrder && added.length > 0) {
        // Use stored order to position new attributes
        const result: string[] = [];
        for (const key of storedOrder) {
          const id = keyToId.get(key);
          if (id && newIdsSet.has(id)) {
            result.push(id);
          }
        }
        // Add any attributes not in stored order (shouldn't happen, but just in case)
        for (const id of newIds) {
          if (!result.includes(id)) {
            result.push(id);
          }
        }
        return result;
      }
      
      // Default behavior: Use baseAttributes order directly when there are new items
      // This respects the positioning logic in baseAttributes:
      // - Static/OTTL attributes at top
      // - Substring attributes above their source
      // - Original attributes in original positions
      const result: string[] = [];
      const addedSet = new Set(added);
      
      for (const id of newIds) {
        if (addedSet.has(id)) {
          // New attribute - add in its natural position from baseAttributes
          result.push(id);
        } else if (prev.includes(id)) {
          // Existing attribute - only add if we haven't added it yet
          if (!result.includes(id)) {
            result.push(id);
          }
        }
      }
      
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

  // Get all deleted attribute paths for this section
  const deletedAttributePaths = new Set(
    transformations
      .filter(t => t.type === TransformationType.DELETE && t.sectionId === section.id)
      .map(t => (t.params as any).attributePath)
  );

  // Create sortable items list - all attributes except deleted ones get composite IDs
  const sortableItems = allAttributes.map(attr => `${section.id}:${attr.id}`);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
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
              <SortableContext
                items={sortableItems}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {allAttributes.map((attribute) => {
                    const compositeId = `${section.id}:${attribute.id}`;
                    const isDeleted = deletedAttributePaths.has(attribute.path);
                    
                    return (
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
                          sortableId={compositeId}
                          onRequestSubstring={handleRequestSubstring}
                          isDraggable={true} // All attributes are draggable
                          showDropIndicator={dropIndicatorId === compositeId}
                        />
                      </React.Fragment>
                    );
                  })}
                </div>
              </SortableContext>
            )}
          </div>
        </>
      )}
    </div>
  );
}

