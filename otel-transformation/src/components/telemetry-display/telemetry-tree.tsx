'use client';

import React from 'react';
import { TelemetryTree as TelemetryTreeType } from '@/types/telemetry-types';
import { TreeSection } from './tree-section';

interface TelemetryTreeProps {
  tree: TelemetryTreeType;
}

export function TelemetryTree({ tree }: TelemetryTreeProps) {
  return (
    <div>
      {tree.sections.map((section) => (
        <TreeSection key={section.id} section={section} />
      ))}
    </div>
  );
}

