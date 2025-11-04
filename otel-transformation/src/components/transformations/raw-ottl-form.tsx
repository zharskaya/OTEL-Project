'use client';

import React, { useState, useRef, useEffect } from 'react';
import { SquareTerminal } from 'lucide-react';
import { useTransformationActions } from '@/lib/state/hooks';
import { TransformationType, TransformationStatus } from '@/types/transformation-types';

interface RawOTTLFormProps {
  sectionId: string;
  onCancel: () => void;
  onSave: () => void;
}

export function RawOTTLForm({ sectionId, onCancel, onSave }: RawOTTLFormProps) {
  const [input, setInput] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTransformation } = useTransformationActions();

  useEffect(() => {
    // Focus input when form mounts
    inputRef.current?.focus();
  }, []);

  const handleSave = () => {
    const trimmed = input.trim();
    
    if (!trimmed) {
      alert('Cannot add attribute. Key cannot be empty');
      return;
    }

    // Parse input with separators: "=", " ", ",", ":", ";" and sequential combinations
    // Rule 1: Split by any of these separators (including sequential combinations)
    const separatorRegex = /[=\s,:;]+/;
    const tokens = trimmed.split(separatorRegex).filter(t => t.length > 0);
    
    let key: string;
    let value: string;
    
    if (tokens.length === 0) {
      // Empty after splitting (shouldn't happen due to trim check above)
      alert('Cannot add attribute. Key cannot be empty');
      return;
    } else if (tokens.length === 1) {
      // Rule 3: Only one string -> use as key, value is empty string
      key = tokens[0];
      value = '';
    } else {
      // Rule 2: More than one string -> first is key, second is value
      key = tokens[0];
      value = tokens[1];
    }

    // Create raw OTTL transformation (stored as key-value)
    addTransformation({
      id: `t-${Date.now()}`,
      type: TransformationType.RAW_OTTL,
      order: 0, // Will be assigned by store
      sectionId,
      createdAt: new Date(),
      status: TransformationStatus.ACTIVE,
      params: {
        type: TransformationType.RAW_OTTL,
        statement: trimmed, // Keep original for display
        key,
        value,
        insertionPoint: sectionId,
      },
    });

    onSave();
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    // Only cancel if clicking on the background div itself
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onCancel();
    } else if (e.key === 'Tab') {
      // Allow Tab to work normally
    }
  };

  return (
    <div
      className="flex items-center gap-1 border-b border-gray-100 bg-gray-200 px-4 py-2"
      onClick={handleClickOutside}
    >
      <SquareTerminal className="h-4 w-4 text-gray-600 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter key=value or key:value or key value"
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

