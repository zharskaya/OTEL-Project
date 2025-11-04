'use client';

import { useState, useEffect, RefObject } from 'react';

export interface TextSelection {
  text: string;
  start: number;
  end: number;
  fullText: string;
}

/**
 * Hook to track text selection within a specific element
 */
export function useTextSelection(ref: RefObject<HTMLElement | null>) {
  const [selection, setSelection] = useState<TextSelection | null>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const sel = window.getSelection();
      if (!sel || sel.rangeCount === 0) {
        setSelection(null);
        return;
      }

      const range = sel.getRangeAt(0);
      const selectedText = sel.toString().trim();

      // Check if selection is within our element
      if (
        ref.current &&
        ref.current.contains(range.commonAncestorContainer)
      ) {
        if (selectedText.length > 0) {
          let fullText = ref.current.textContent || '';
          
          // Use anchor and focus to determine actual selection direction
          // anchor = where selection started, focus = where it currently is
          const anchorNode = sel.anchorNode;
          const anchorOffset = sel.anchorOffset;
          const focusNode = sel.focusNode;
          const focusOffset = sel.focusOffset;
          
          // Calculate anchor position
          const beforeAnchorRange = document.createRange();
          beforeAnchorRange.selectNodeContents(ref.current);
          beforeAnchorRange.setEnd(anchorNode!, anchorOffset);
          const anchorPos = beforeAnchorRange.toString().length;
          
          // Calculate focus position
          const beforeFocusRange = document.createRange();
          beforeFocusRange.selectNodeContents(ref.current);
          beforeFocusRange.setEnd(focusNode!, focusOffset);
          const focusPos = beforeFocusRange.toString().length;
          
          // Normalize: start is always the smaller position, end is always the larger
          let start = Math.min(anchorPos, focusPos);
          let end = Math.max(anchorPos, focusPos);

          // Check if fullText is wrapped in quotes (e.g., "MyService")
          // If so, adjust positions to exclude quotes
          if (fullText.startsWith('"') && fullText.endsWith('"') && fullText.length > 2) {
            // Strip quotes from fullText
            fullText = fullText.slice(1, -1);
            // Adjust start and end positions (subtract 1 to account for opening quote)
            start = Math.max(0, start - 1);
            end = Math.max(0, end - 1);
            // Cap end at fullText length (in case full string with both quotes was selected)
            end = Math.min(end, fullText.length);
          }

          setSelection({
            text: selectedText,
            start,
            end,
            fullText,
          });
        } else {
          setSelection(null);
        }
      } else {
        setSelection(null);
      }
    };

    document.addEventListener('selectionchange', handleSelectionChange);
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, [ref]);

  const clearSelection = () => {
    window.getSelection()?.removeAllRanges();
    setSelection(null);
  };

  return { selection, clearSelection };
}

