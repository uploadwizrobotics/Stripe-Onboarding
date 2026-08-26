import { useCallback, useEffect, useRef, useState } from 'react';

/** A single transient message that clears itself. */
export function useToast(duration = 2600) {
  const [message, setMessage] = useState(null);
  const timer = useRef(null);

  const showToast = useCallback(
    (text) => {
      clearTimeout(timer.current);
      setMessage(text);
      timer.current = setTimeout(() => setMessage(null), duration);
    },
    [duration],
  );

  const dismiss = useCallback(() => {
    clearTimeout(timer.current);
    setMessage(null);
  }, []);

  useEffect(() => () => clearTimeout(timer.current), []);

  return { message, showToast, dismiss };
}
