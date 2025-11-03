'use client';

import React from 'react';
import { Download } from 'lucide-react';

interface OutputPanelProps {
  children: React.ReactNode;
  isEmpty?: boolean;
  hasChanges?: boolean;
  executionTime?: number;
}

export function OutputPanel({
  children,
  isEmpty = false,
  hasChanges = false,
  executionTime,
}: OutputPanelProps) {
  const handleDownload = () => {
    alert('Not included in this demo');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
        <div className="flex items-center gap-3">
          <h2 className="font-semibold text-white">OUTPUT</h2>
        </div>
        <div className="flex gap-2">
          {!isEmpty && (
            <button
              onClick={handleDownload}
              className="rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
              title="Download as JSON"
            >
              Export
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-auto bg-white">
        {isEmpty ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-gray-500">
              Run transformation (⌘ + Enter) to preview the output
            </p>
          </div>
        ) : (
          <>
            {/* Info message when changes are made */}
            {hasChanges && (
              <div className="sticky top-0 z-10 border-b border-blue-200 bg-blue-50 px-4 py-2 text-xs text-blue-800">
                Change made. Run (⌘ + Enter) to preview updates.
              </div>
            )}
            {/* Output content with reduced opacity when changes exist */}
            <div className={`p-4 ${hasChanges ? 'opacity-60' : ''}`}>
              {children}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

