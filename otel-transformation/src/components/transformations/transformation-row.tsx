'use client';

import React from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Transformation, TransformationType } from '@/types/transformation-types';
import { useTransformationActions } from '@/lib/state/hooks';

interface TransformationRowProps {
  transformation: Transformation;
}

export function TransformationRow({ transformation }: TransformationRowProps) {
  const { removeTransformation } = useTransformationActions();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: transformation.id });

  const getLabel = () => {
    switch (transformation.type) {
      case TransformationType.ADD_STATIC:
        return 'ADD';
      case TransformationType.DELETE:
        return 'DELETE';
      case TransformationType.MASK:
        return 'MASK';
      case TransformationType.RENAME_KEY:
        return 'RENAME KEY';
      case TransformationType.ADD_SUBSTRING:
        return 'NEW ATRBT';
      case TransformationType.RAW_OTTL:
        return 'OTTL';
      default:
        return '';
    }
  };

  const getLabelColor = () => {
    switch (transformation.type) {
      case TransformationType.ADD_STATIC:
      case TransformationType.ADD_SUBSTRING:
        return 'bg-green-100 text-green-800';
      case TransformationType.DELETE:
        return 'bg-red-100 text-red-800';
      case TransformationType.MASK:
      case TransformationType.RENAME_KEY:
        return 'bg-blue-100 text-blue-800';
      case TransformationType.RAW_OTTL:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getBgColor = () => {
    switch (transformation.type) {
      case TransformationType.ADD_STATIC:
      case TransformationType.ADD_SUBSTRING:
        return 'bg-green-50';
      case TransformationType.DELETE:
        return 'bg-red-50';
      case TransformationType.MASK:
      case TransformationType.RENAME_KEY:
        return 'bg-blue-50';
      case TransformationType.RAW_OTTL:
        return 'bg-purple-50';
      default:
        return 'bg-gray-50';
    }
  };

  const getDisplayText = () => {
    switch (transformation.type) {
      case TransformationType.ADD_STATIC: {
        const params = transformation.params as any;
        return `${params.key} = ${params.value}`;
      }
      case TransformationType.DELETE: {
        const params = transformation.params as any;
        return `Delete ${params.attributeKey}`;
      }
      case TransformationType.MASK: {
        const params = transformation.params as any;
        const range =
          params.maskEnd === 'end'
            ? `[${params.maskStart}..end]`
            : `[${params.maskStart}..${params.maskEnd}]`;
        return `Mask ${params.attributeKey} ${range}`;
      }
      case TransformationType.RENAME_KEY: {
        const params = transformation.params as any;
        return `${params.oldKey} → ${params.newKey}`;
      }
      case TransformationType.ADD_SUBSTRING: {
        const params = transformation.params as any;
        return `${params.newKey} = ${params.sourceKey}[${params.substringStart}..${params.substringEnd}]`;
      }
      case TransformationType.RAW_OTTL: {
        const params = transformation.params as any;
        return params.statement;
      }
      default:
        return '';
    }
  };

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 border-b border-gray-100 px-4 py-2 transition-colors hover:brightness-95 ${getBgColor()}`}
    >
      {/* Drag handle */}
      <div
        className="cursor-grab active:cursor-grabbing touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Label */}
      <span
        className={`rounded px-1.5 py-0.5 text-xs font-medium ${getLabelColor()}`}
      >
        {getLabel()}
      </span>

      {/* Display text */}
      <span className="flex-1 font-mono text-sm text-gray-900">
        {getDisplayText()}
      </span>

      {/* Delete button */}
      <button
        onClick={() => removeTransformation(transformation.id)}
        className="rounded-md p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        aria-label="Delete transformation"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

