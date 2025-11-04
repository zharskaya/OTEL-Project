import { ResourceSpan, TelemetryTree, DisplayAttribute, ModificationColor } from '@/types/telemetry-types';
import {
  Transformation,
  TransformationResult,
  TransformationType,
} from '@/types/transformation-types';
import { TelemetryParser } from '@/lib/telemetry/telemetry-parser';

/**
 * Transformation Engine
 * 
 * Executes transformations and returns the result
 */
export class TransformationEngine {
  static execute(
    inputData: ResourceSpan,
    transformations: Transformation[]
  ): TransformationResult {
    const startTime = performance.now();

    try {
      // Clone the input data
      let transformedData = JSON.parse(JSON.stringify(inputData));

      // Track modifications for highlighting
      const modifications = new Map<string, any[]>();

      // Apply transformations sequentially
      for (const transformation of transformations) {
        transformedData = this.applyTransformation(transformedData, transformation, modifications);
      }

      // Parse the transformed data into a tree for display
      const transformedTree = TelemetryParser.parse([transformedData]);
      
      // Apply modification metadata to the tree
      this.applyModificationsToTree(transformedTree, modifications, transformations);

      const endTime = performance.now();

      return {
        transformedData,
        transformedTree,
        appliedTransformations: transformations.length,
        executionTime: endTime - startTime,
        failedTransformations: [],
        warnings: [],
      };
    } catch (error) {
      const endTime = performance.now();
      return {
        transformedData: inputData,
        transformedTree: TelemetryParser.parse([inputData]),
        appliedTransformations: 0,
        executionTime: endTime - startTime,
        failedTransformations: [{
          transformationId: 'unknown',
          type: transformations[0]?.type || 'add-static' as any,
          message: error instanceof Error ? error.message : 'Unknown error',
        }],
        warnings: [],
      };
    }
  }

  private static applyTransformation(
    data: ResourceSpan,
    transformation: Transformation,
    modifications: Map<string, any[]>
  ): ResourceSpan {
    const params = transformation.params as any;
    
    // Track modifications based on transformation type
    switch (transformation.type) {
      case TransformationType.ADD_STATIC:
      case TransformationType.ADD_SUBSTRING: {
        // Add new attribute to appropriate section
        const sectionId = transformation.sectionId;
        const key = params.key || params.newKey;
        
        // Track as added
        const modKey = `${sectionId}:${key}`;
        if (!modifications.has(modKey)) {
          modifications.set(modKey, []);
        }
        modifications.get(modKey)!.push({
          transformationId: transformation.id,
          type: transformation.type,
          label: transformation.type === TransformationType.ADD_STATIC ? 'ADD' : 'NEW ATRBT',
          color: ModificationColor.GREEN,
        });
        
        // Actually add the attribute to the data
        if (sectionId.includes('resource')) {
          data.resource.attributes.push({
            key,
            value: { stringValue: params.value || 'demo-value' }
          });
        } else if (sectionId.includes('span-attributes')) {
          const span = data.scopeSpans[0]?.spans[0];
          if (span) {
            span.attributes.push({
              key,
              value: { stringValue: params.value || 'demo-value' }
            });
          }
        }
        break;
      }
      
      case TransformationType.DELETE: {
        // Delete the attribute
        const key = params.attributeKey;
        const sectionId = transformation.sectionId;
        
        if (sectionId.includes('resource')) {
          data.resource.attributes = data.resource.attributes.filter(attr => attr.key !== key);
        } else if (sectionId.includes('span-attributes')) {
          const span = data.scopeSpans[0]?.spans[0];
          if (span) {
            span.attributes = span.attributes.filter(attr => attr.key !== key);
          }
        }
        break;
      }
      
      case TransformationType.MASK: {
        // Mask the attribute value
        const key = params.attributeKey;
        const sectionId = transformation.sectionId;
        const maskStart = params.maskStart;
        const maskEnd = params.maskEnd;
        const maskChar = params.maskChar || '*';
        
        // Track as modified
        const modKey = `${sectionId}:${key}`;
        if (!modifications.has(modKey)) {
          modifications.set(modKey, []);
        }
        modifications.get(modKey)!.push({
          transformationId: transformation.id,
          type: transformation.type,
          label: 'MASK',
          color: ModificationColor.BLUE,
        });
        
        // Apply masking - always use 5 asterisks
        const applyMask = (attributes: any[]) => {
          const attr = attributes.find(a => a.key === key);
          if (attr && attr.value.stringValue) {
            const original = attr.value.stringValue;
            const endIdx = maskEnd === 'end' ? original.length : maskEnd;
            const masked = 
              original.substring(0, maskStart) +
              '*****' +
              original.substring(endIdx);
            attr.value.stringValue = masked;
          }
        };
        
        if (sectionId.includes('resource')) {
          applyMask(data.resource.attributes);
        } else if (sectionId.includes('span-attributes')) {
          const span = data.scopeSpans[0]?.spans[0];
          if (span) {
            applyMask(span.attributes);
          }
        }
        break;
      }
      
      case TransformationType.RENAME_KEY: {
        // Rename the attribute key
        const oldKey = params.oldKey;
        const newKey = params.newKey;
        const sectionId = transformation.sectionId;
        
        // Track as modified (use newKey for tracking)
        const modKey = `${sectionId}:${newKey}`;
        if (!modifications.has(modKey)) {
          modifications.set(modKey, []);
        }
        modifications.get(modKey)!.push({
          transformationId: transformation.id,
          type: transformation.type,
          label: 'RENAME',
          color: ModificationColor.BLUE,
        });
        
        // Apply rename
        const applyRename = (attributes: any[]) => {
          const attr = attributes.find(a => a.key === oldKey);
          if (attr) {
            attr.key = newKey;
          }
        };
        
        if (sectionId.includes('resource')) {
          applyRename(data.resource.attributes);
        } else if (sectionId.includes('span-attributes')) {
          const span = data.scopeSpans[0]?.spans[0];
          if (span) {
            applyRename(span.attributes);
          }
        }
        break;
      }
    }
    
    return data;
  }
  
  private static applyModificationsToTree(
    tree: TelemetryTree,
    modifications: Map<string, any[]>,
    transformations: Transformation[]
  ): void {
    // Apply modifications to each section's attributes and sort
    tree.sections.forEach(section => {
      section.attributes.forEach(attribute => {
        const modKey = `${section.id}:${attribute.key}`;
        if (modifications.has(modKey)) {
          attribute.modifications = modifications.get(modKey)!;
        }
      });
      
      // Sort attributes: only move added ones to the top, keep others in original position
      section.attributes.sort((a, b) => {
        const aIsAdded = a.modifications.some(m => 
          m.type === 'add-static' || m.type === 'add-substring'
        );
        const bIsAdded = b.modifications.some(m => 
          m.type === 'add-static' || m.type === 'add-substring'
        );
        
        // Added attributes go to the top
        if (aIsAdded && !bIsAdded) return -1;
        if (!aIsAdded && bIsAdded) return 1;
        
        // Everything else (modified and unchanged) stays in original order
        return 0;
      });
    });
  }
}

