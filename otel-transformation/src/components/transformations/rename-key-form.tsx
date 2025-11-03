'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTransformationActions } from '@/lib/state/hooks';
import { TransformationType, TransformationStatus } from '@/types/transformation-types';

interface RenameKeyFormProps {
  oldKey: string;
  attributePath: string;
  sectionId: string;
  onCancel: () => void;
  onSave: () => void;
}

export function RenameKeyForm({
  oldKey,
  attributePath,
  sectionId,
  onCancel,
  onSave,
}: RenameKeyFormProps) {
  const [newKey, setNewKey] = useState(oldKey);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTransformation } = useTransformationActions();

  // Focus on mount and select all text
  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  const handleSave = () => {
    const trimmed = newKey.trim();
    if (trimmed === '') {
      alert('Key name is required');
      return;
    }

    if (trimmed === oldKey) {
      // No change, just cancel
      onCancel();
      return;
    }

    // Create RENAME_KEY transformation
    addTransformation({
      id: `t-${Date.now()}`,
      type: TransformationType.RENAME_KEY,
      order: 0,
      sectionId,
      createdAt: new Date(),
      status: TransformationStatus.ACTIVE,
      params: {
        type: TransformationType.RENAME_KEY,
        attributePath,
        oldKey,
        newKey: trimmed,
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

  const handleBlur = () => {
    // Save on blur if changed, cancel if unchanged
    if (newKey.trim() !== '' && newKey.trim() !== oldKey) {
      handleSave();
    } else {
      onCancel();
    }
  };

  return (
    <div className="flex items-center gap-1">
      <input
        ref={inputRef}
        type="text"
        value={newKey}
        onChange={(e) => setNewKey(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-[200px] rounded-md border border-blue-300 bg-white px-2 py-1 font-mono text-xs text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 leading-tight"
      />
      <button
        onMouseDown={(e) => e.preventDefault()} // Prevent blur
        onClick={handleSave}
        className="rounded-md px-2 py-1 bg-gray-900 text-white text-xs whitespace-nowrap transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 leading-tight"
        title="Save (Enter)"
      >
        Save ↵
      </button>
      <button
        onMouseDown={(e) => e.preventDefault()} // Prevent blur
        onClick={onCancel}
        className="rounded-md px-2 py-1 bg-white text-gray-700 text-xs border border-gray-300 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 leading-tight"
        title="Cancel (Esc)"
      >
        Cancel
      </button>
    </div>
  );
}

