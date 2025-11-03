'use client';

import React from 'react';
import { TelemetryTree } from '@/types/telemetry-types';
import { ReadOnlyTreeSection } from './read-only-tree-section';

interface ReadOnlyTelemetryTreeProps {
  tree: TelemetryTree;
}

export function ReadOnlyTelemetryTree({ tree }: ReadOnlyTelemetryTreeProps) {
  return (
    <div className="flex flex-col">
      {tree.sections.map((section) => (
        <ReadOnlyTreeSection key={section.id} section={section} />
      ))}
    </div>
  );
}

