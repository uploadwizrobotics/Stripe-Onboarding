import { useCallback, useMemo, useState } from 'react';

/**
 * Single-select filtering over a list.
 * `match(item, activeId)` decides what belongs; 'all' is always the reset.
 */
export function useFilters(items, match, initial = 'all') {
  const [activeId, setActiveId] = useState(initial);

  const visible = useMemo(
    () => (activeId === 'all' ? items : items.filter((item) => match(item, activeId))),
    [items, match, activeId],
  );

  const clear = useCallback(() => setActiveId('all'), []);

  return { activeId, setActiveId, visible, clear, isFiltered: activeId !== 'all' };
}
