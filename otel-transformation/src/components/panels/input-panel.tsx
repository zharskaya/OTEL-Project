'use client';

import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface InputPanelProps {
  children: React.ReactNode;
  onRun: () => void;
  hasChanges?: boolean;
}

export function InputPanel({
  children,
  onRun,
  hasChanges = false,
}: InputPanelProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center justify-between bg-gray-900 px-4 py-3">
        <h2 className="font-semibold text-white">INPUT</h2>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={onRun}
                className="flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-900 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900 cursor-pointer"
              >
                Run
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Run transformation (⌘/Ctrl + Enter) to preview the output</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto bg-white p-4">{children}</div>

      {/* Status indicator for changes - disabled for now */}
      {/* {hasChanges && (
        <div className="border-t border-yellow-200 bg-yellow-50 px-4 py-2 text-xs text-yellow-800">
          Changes made. Click Run to see results.
        </div>
      )} */}
    </div>
  );
}

