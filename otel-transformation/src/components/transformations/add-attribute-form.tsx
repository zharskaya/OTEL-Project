'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTransformationActions } from '@/lib/state/hooks';
import { TransformationType, TransformationStatus } from '@/types/transformation-types';

interface AddAttributeFormProps {
  sectionId: string;
  onCancel: () => void;
  onSave: () => void;
}

export function AddAttributeForm({
  sectionId,
  onCancel,
  onSave,
}: AddAttributeFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTransformation } = useTransformationActions();

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = input.trim();
    
    // Rule 4: Empty line -> show error
    if (trimmed === '') {
      alert('Cannot add attribute. Key cannot be empty');
      return;
    }

    // Parse input with separators: "=", ",", " " (space)
    // Rule 1: Use these separators to split key and value
    // Rule 3: If multiple separators, ignore everything after second separator
    
    // Find the first separator
    const separators = ['=', ',', ' '];
    let firstSepIndex = -1;
    
    for (const sep of separators) {
      const index = trimmed.indexOf(sep);
      if (index !== -1 && (firstSepIndex === -1 || index < firstSepIndex)) {
        firstSepIndex = index;
      }
    }
    
    let key: string;
    let value: string;
    
    if (firstSepIndex === -1) {
      // Rule 2: No separator -> entire input is key, value is empty string
      key = trimmed;
      value = '';
    } else {
      // Split at first separator
      key = trimmed.substring(0, firstSepIndex).trim();
      const afterFirst = trimmed.substring(firstSepIndex + 1);
      
      // Rule 3: Check for second separator
      let secondSepIndex = -1;
      for (const sep of separators) {
        const index = afterFirst.indexOf(sep);
        if (index !== -1 && (secondSepIndex === -1 || index < secondSepIndex)) {
          secondSepIndex = index;
        }
      }
      
      if (secondSepIndex === -1) {
        // No second separator
        value = afterFirst.trim();
      } else {
        // Ignore everything after second separator
        value = afterFirst.substring(0, secondSepIndex).trim();
      }
    }
    
    // Validate key is not empty
    if (!key) {
      alert('Cannot add attribute. Key cannot be empty');
      return;
    }

    // Create transformation
    addTransformation({
      id: `t-${Date.now()}`,
      type: TransformationType.ADD_STATIC,
      order: 0, // Will be assigned by store
      sectionId,
      createdAt: new Date(),
      status: TransformationStatus.ACTIVE,
      params: {
        type: TransformationType.ADD_STATIC,
        key,
        value,
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
      if (input.trim() === '') {
        onCancel();
      } else {
        handleSave();
      }
    }
  };

  return (
    <div
      className="flex items-center gap-1 border-b border-gray-100 bg-gray-200 px-4 py-2"
      onClick={handleClickOutside}
    >
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter key=value or key,value or key value"
        className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-1.5 font-mono text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-tight"
      />
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
  );
}

