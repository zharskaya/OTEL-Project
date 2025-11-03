'use client';

import React, { useState } from 'react';
import { DisplayAttribute } from '@/types/telemetry-types';
import { AttributeRow } from './attribute-row';

interface AttributeGroupProps {
  attribute: DisplayAttribute;
  onRequestSubstring?: (params: {
    sourceKey: string;
    sourcePath: string;
    sectionId: string;
    substringStart: number;
    substringEnd: number | 'end';
  }) => void;
}

export function AttributeGroup({ attribute, onRequestSubstring }: AttributeGroupProps) {
  const [isExpanded, setIsExpanded] = useState(attribute.isExpanded || false);

  if (!attribute.isGroup || !attribute.children) {
    return null;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div
        className="flex items-center py-1.5 mb-0.5 transition-colors hover:bg-gray-50 cursor-pointer leading-none"
        onClick={toggleExpand}
      >
        {/* Key - fixed width container with indented content */}
        <div className="w-[360px] flex-shrink-0 flex items-center pr-4 leading-none">
          <div style={{ paddingLeft: `${40 + attribute.depth * 16}px` }} className="flex items-center gap-3 leading-none">
            {/* Chevron */}
            <span className="text-gray-500 text-sm leading-none">
              {isExpanded ? '▾' : '▸'}
            </span>
            
            {/* Group name */}
            <span className="font-mono text-xs font-medium text-gray-900 leading-none">
              {attribute.key}
            </span>
          </div>
        </div>

        {/* Count indicator - always starts at the same position as values */}
        <div className="flex-1 min-w-0 leading-none">
          <span className="text-xs text-gray-500 leading-none">
            ▸ {attribute.groupCount} {attribute.groupCount === 1 ? 'key' : 'keys'}
          </span>
        </div>
      </div>

      {/* Children */}
      {isExpanded &&
        attribute.children.map((child) => (
          <AttributeRow
            key={child.id}
            attribute={child}
            onRequestSubstring={onRequestSubstring}
          />
        ))}
    </>
  );
}

