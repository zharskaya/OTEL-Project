'use client';

import React, { useState, useRef, useEffect } from 'react';
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
    const statement = input.trim();
    
    if (!statement) {
      onCancel();
      return;
    }

    // Create raw OTTL transformation
    addTransformation({
      id: `t-${Date.now()}`,
      type: TransformationType.RAW_OTTL,
      order: 0, // Will be assigned by store
      sectionId,
      createdAt: new Date(),
      status: TransformationStatus.ACTIVE,
      params: {
        type: TransformationType.RAW_OTTL,
        statement,
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
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter OTTL statement"
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

