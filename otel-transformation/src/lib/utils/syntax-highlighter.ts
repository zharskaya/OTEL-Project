/**
 * Syntax Highlighter Utilities
 * 
 * Tokenizes values for syntax highlighting
 */

export interface Token {
  type: 'string' | 'number' | 'boolean' | 'null' | 'keyword' | 'text';
  value: string;
}

export function tokenizeValue(value: string): Token[] {
  const tokens: Token[] = [];
  
  // Simple tokenization - treat everything as text for now
  // In production, would parse JSON, detect types, etc.
  if (value === 'true' || value === 'false') {
    tokens.push({ type: 'boolean', value });
  } else if (value === 'null') {
    tokens.push({ type: 'null', value });
  } else if (!isNaN(Number(value)) && value !== '') {
    tokens.push({ type: 'number', value });
  } else {
    tokens.push({ type: 'text', value });
  }
  
  return tokens;
}

export function getTokenColorClass(tokenType: string): string {
  const colorMap: Record<string, string> = {
    string: 'text-emerald-600',
    number: 'text-blue-600',
    boolean: 'text-purple-600',
    null: 'text-gray-500',
    keyword: 'text-pink-600',
    text: 'text-gray-900',
  };
  
  return colorMap[tokenType] || 'text-gray-900';
}

