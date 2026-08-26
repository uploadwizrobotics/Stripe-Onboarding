import { useCallback, useMemo, useState } from 'react';

/**
 * Tracks which row is open in a detail view. Holds the id rather than the
 * object so the selection stays live as the underlying list changes.
 */
export function useSelection(items) {
  const [selectedId, setSelectedId] = useState(null);

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) || null,
    [items, selectedId],
  );

  const select = useCallback((item) => setSelectedId(item?.id ?? null), []);
  const clear = useCallback(() => setSelectedId(null), []);

  return { selected, selectedId, select, clear, isOpen: selected !== null };
}
