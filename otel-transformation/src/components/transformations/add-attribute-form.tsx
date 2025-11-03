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
    if (trimmed === '') {
      onCancel();
      return;
    }

    // Parse key = value format
    const match = trimmed.match(/^([^=]+)=(.+)$/);
    if (!match) {
      alert('Invalid format. Use: key = value');
      return;
    }

    const key = match[1].trim();
    const value = match[2].trim();

    if (!key || !value) {
      alert('Both key and value are required');
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
        placeholder="Enter new_key = new_value"
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

