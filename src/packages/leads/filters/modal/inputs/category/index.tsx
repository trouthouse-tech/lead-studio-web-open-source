'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';
import { LeadsFiltersCategoryMenu } from './menu';
import { LeadsFiltersCategoryMenuOption } from './menu/option';

export const LeadsFiltersCategoryInput = () => {
  const dispatch = useAppDispatch();
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const selectedCategoryIds = useAppSelector(
    (state) => state.leadsFilters.selectedCategoryIds
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categoryQuery, setCategoryQuery] = useState('');

  const sortedCategories = useMemo(
    () => [...leadCategories].sort((a, b) => a.name.localeCompare(b.name)),
    [leadCategories]
  );

  const filterableOptions = useMemo(
    () => [
      { id: 'uncategorized' as const, name: 'Uncategorized' },
      ...sortedCategories.map((c) => ({ id: c.id, name: c.name })),
    ],
    [sortedCategories]
  );

  const filteredOptions = useMemo(() => {
    const q = categoryQuery.trim().toLowerCase();
    if (!q) {
      return filterableOptions;
    }
    return filterableOptions.filter((opt) =>
      opt.name.toLowerCase().includes(q)
    );
  }, [filterableOptions, categoryQuery]);

  const handleToggleCategory = useCallback(
    (categoryId: string) => {
      dispatch(LeadsFiltersActions.toggleCategorySelection(categoryId));
    },
    [dispatch]
  );

  const handleClearAllCategories = useCallback(() => {
    dispatch(LeadsFiltersActions.setSelectedCategoryIds([]));
  }, [dispatch]);

  const handleCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const displayedOptions = useMemo(() => {
    const selectedSet = new Set(selectedCategoryIds);
    const selected = filteredOptions.filter((o) => selectedSet.has(o.id));
    const unselected = filteredOptions.filter((o) => !selectedSet.has(o.id));
    return { selected, unselected };
  }, [filteredOptions, selectedCategoryIds]);

  const selectedCount = selectedCategoryIds.length;

  return (
    <div className={styles.wrap}>
      <div className={styles.inputRow} ref={containerRef}>
        <input
          value={categoryQuery}
          onFocus={() => setIsMenuOpen(true)}
          onChange={(e) => {
            setCategoryQuery(e.target.value);
            setIsMenuOpen(true);
          }}
          placeholder="Search categories"
          className={styles.input}
          aria-label="Filter by category"
        />
        {selectedCount > 0 ? (
          <>
            <span className={styles.countBadge} title="Categories selected">
              ({selectedCount})
            </span>
            <button
              type="button"
              className={styles.clearInline}
              onMouseDown={(e) => e.preventDefault()}
              onClick={handleClearAllCategories}
              title="Clear all category filters"
            >
              Clear
            </button>
          </>
        ) : null}
      </div>
      <LeadsFiltersCategoryMenu
        open={isMenuOpen}
        onClose={handleCloseMenu}
        anchorRef={containerRef}
      >
        {filteredOptions.length === 0 ? (
          <div className={styles.emptyHint}>No matching categories</div>
        ) : (
          <>
            {selectedCount > 0 ? (
              <div className={styles.menuToolbar}>
                <button
                  type="button"
                  className={styles.menuClearAll}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={handleClearAllCategories}
                >
                  Clear all ({selectedCount})
                </button>
              </div>
            ) : null}
            {displayedOptions.selected.map((opt) => (
              <LeadsFiltersCategoryMenuOption
                key={opt.id}
                name={opt.name}
                checked={selectedCategoryIds.includes(opt.id)}
                onToggle={() => handleToggleCategory(opt.id)}
              />
            ))}
            {displayedOptions.unselected.length > 0 && displayedOptions.selected.length > 0 ? (
              <div className={styles.menuDivider} role="separator" />
            ) : null}
            {displayedOptions.unselected.map((opt) => (
              <LeadsFiltersCategoryMenuOption
                key={opt.id}
                name={opt.name}
                checked={selectedCategoryIds.includes(opt.id)}
                onToggle={() => handleToggleCategory(opt.id)}
              />
            ))}
          </>
        )}
      </LeadsFiltersCategoryMenu>
    </div>
  );
};

const styles = {
  wrap: `relative min-w-[11rem] max-w-xs`,
  inputRow: `
    flex items-center gap-1.5 border border-gray-300 rounded px-2 py-1.5 bg-white
    hover:border-gray-400 transition-colors
  `,
  input: `
    min-w-0 flex-1 text-sm border-none outline-none bg-transparent
    placeholder:text-gray-400
  `,
  countBadge: `shrink-0 text-xs text-gray-500 tabular-nums`,
  clearInline: `
    shrink-0 text-xs font-medium text-gray-600 hover:text-gray-900 cursor-pointer
    border-none bg-transparent px-1 py-0 underline-offset-2 hover:underline
  `,
  menuToolbar: `sticky top-0 z-[1] border-b border-gray-100 bg-white px-1 py-1`,
  menuClearAll: `
    w-full rounded px-2 py-1.5 text-left text-sm font-medium text-gray-700
    hover:bg-gray-50 cursor-pointer border-none bg-transparent
  `,
  menuDivider: `my-1 border-t border-gray-100`,
  emptyHint: `px-2 py-2 text-sm text-gray-500`,
};
