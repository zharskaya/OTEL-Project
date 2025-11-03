'use client';

import React, { useState } from 'react';
import { PanelDivider } from './panel-divider';

interface SplitPanelProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  initialLeftWidth?: number; // percentage
}

export function SplitPanel({
  leftPanel,
  rightPanel,
  initialLeftWidth = 50,
}: SplitPanelProps) {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const rightWidth = 100 - leftWidth;

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div
        className="flex flex-col overflow-hidden"
        style={{ flexBasis: `${leftWidth}%` }}
      >
        {leftPanel}
      </div>
      <PanelDivider onResize={setLeftWidth} />
      <div
        className="flex flex-col overflow-hidden"
        style={{ flexBasis: `${rightWidth}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
}

