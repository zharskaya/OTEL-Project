'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTransformationActions } from '@/lib/state/hooks';
import { TransformationType, TransformationStatus } from '@/types/transformation-types';

interface SubstringAttributeFormProps {
  sourceKey: string;
  sourcePath: string;
  sectionId: string;
  substringStart: number;
  substringEnd: number | 'end';
  onCancel: () => void;
  onSave: () => void;
}

export function SubstringAttributeForm({
  sourceKey,
  sourcePath,
  sectionId,
  substringStart,
  substringEnd,
  onCancel,
  onSave,
}: SubstringAttributeFormProps) {
  const [newKey, setNewKey] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTransformation } = useTransformationActions();

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = newKey.trim();
    if (trimmed === '') {
      alert('Cannot add attribute. Key cannot be empty');
      return;
    }

    // Create ADD_SUBSTRING transformation
    addTransformation({
      id: `t-${Date.now()}`,
      type: TransformationType.ADD_SUBSTRING,
      order: 0,
      sectionId,
      createdAt: new Date(),
      status: TransformationStatus.ACTIVE,
      params: {
        type: TransformationType.ADD_SUBSTRING,
        sourceAttributePath: sourcePath,
        sourceKey,
        newKey: trimmed,
        substringStart,
        substringEnd,
        insertionPoint: sectionId,
      },
    });

    onSave();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    }
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      // Click outside: save if key is not empty, cancel if empty
      if (newKey.trim() === '') {
        onCancel();
      } else {
        handleSave();
      }
    }
  };

  const range = substringEnd === 'end' ? `${substringStart}..end` : `${substringStart}..${substringEnd}`;

  return (
    <div
      className="relative flex items-center gap-2 border-b border-gray-100 bg-gray-200 px-4 py-2"
      onClick={handleClickOutside}
    >
      {/* Key field (editable) */}
      <input
        ref={inputRef}
        type="text"
        value={newKey}
        onChange={(e) => setNewKey(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter new_key"
        className="w-[360px] rounded-md border border-gray-300 bg-white px-3 py-1.5 font-mono text-xs text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-tight"
      />

      {/* Value display */}
      <span className="flex-1 font-mono text-xs text-gray-700 leading-tight">
        = SUBSTR({sourceKey}, {range})
      </span>

      {/* Buttons overlaying value area */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <button
          onClick={handleSave}
          className="rounded-md px-2 py-1.5 bg-gray-900 text-white text-xs whitespace-nowrap transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 leading-tight"
          title="Save (Enter)"
        >
          Save ↵
        </button>
        <button
          onClick={onCancel}
          className="rounded-md px-2 py-1.5 bg-white text-gray-700 text-xs border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 leading-tight"
          title="Cancel (Esc)"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

