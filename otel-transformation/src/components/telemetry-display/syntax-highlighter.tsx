'use client';

import React from 'react';
import { tokenizeValue, getTokenColorClass } from '@/lib/utils/syntax-highlighter';
import { ValueType } from '@/types/telemetry-types';

interface SyntaxHighlighterProps {
  value: string;
  valueType?: ValueType;
  className?: string;
}

export function SyntaxHighlighter({ value, valueType, className = '' }: SyntaxHighlighterProps) {
  const tokens = tokenizeValue(value);
  
  // Only add quotes if the value type is explicitly STRING
  const shouldAddQuotes = valueType === ValueType.STRING;

  return (
    <span className={className}>
      {shouldAddQuotes && <span className={getTokenColorClass('string')}>"</span>}
      {tokens.map((token, index) => (
        <span key={index} className={getTokenColorClass(shouldAddQuotes ? 'string' : token.type)}>
          {token.value}
        </span>
      ))}
      {shouldAddQuotes && <span className={getTokenColorClass('string')}>"</span>}
    </span>
  );
}

