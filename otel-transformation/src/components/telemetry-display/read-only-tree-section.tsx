'use client';

import React, { useState } from 'react';
import { TelemetrySection } from '@/types/telemetry-types';
import { ReadOnlyAttributeRow } from './read-only-attribute-row';

interface ReadOnlyTreeSectionProps {
  section: TelemetrySection;
}

export function ReadOnlyTreeSection({ section }: ReadOnlyTreeSectionProps) {
  const [isExpanded, setIsExpanded] = useState(section.expanded);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mb-3">
      {/* Section Header */}
      <button
        onClick={toggleExpand}
        className="w-full flex items-center bg-gray-200 px-4 py-2 min-h-[44px] text-left hover:bg-gray-300 transition-colors cursor-pointer"
      >
        <span className="mr-2 text-gray-700 text-sm leading-tight">
          {isExpanded ? '▾' : '▸'}
        </span>
        <span className="font-semibold text-sm text-gray-900 leading-tight">
          {section.label}
        </span>
      </button>

      {/* Section Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {section.attributes.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 leading-tight">
              No attributes
            </div>
          ) : (
            <div>
              {section.attributes.map((attribute, index) => (
                <ReadOnlyAttributeRow
                  key={`${attribute.id}-${attribute.path}-${index}`}
                  attribute={attribute}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

