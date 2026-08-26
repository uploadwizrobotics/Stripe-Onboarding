import { useCallback, useEffect, useRef, useState } from 'react';

/** Copy text, with a `copied` flag that resets shortly after. */
export function useClipboard(resetAfter = 1600) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
      } catch {
        // Clipboard API needs a secure context; fall back to a temp selection.
        const el = document.createElement('textarea');
        el.value = text;
        el.style.position = 'fixed';
        el.style.opacity = '0';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      clearTimeout(timer.current);
      setCopied(true);
      timer.current = setTimeout(() => setCopied(false), resetAfter);
      return true;
    },
    [resetAfter],
  );

  useEffect(() => () => clearTimeout(timer.current), []);

  return { copied, copy };
}
