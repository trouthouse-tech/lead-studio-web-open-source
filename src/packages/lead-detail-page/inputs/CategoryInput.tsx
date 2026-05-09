'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadActions } from '@/store/current';
import { createLeadCategoryThunk } from '@/store/thunks/lead-categories';
import { runLeadAutoCategorizeThunk, updateLeadThunk } from '@/store/thunks/leads';
import { normalizeLeadCategoryName } from '@/utils/leads';

export const CategoryInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);
  const leadCategories = useAppSelector((state) => state.leadCategories);

  const [query, setQuery] = useState(currentLead.category_name ?? '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
  const [autoCategoryLabel, setAutoCategoryLabel] = useState('');
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setQuery(currentLead.category_name ?? '');
  }, [currentLead.category_name]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMenuOpen]);

  const filteredCategories = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return leadCategories;
    return leadCategories.filter((category) => category.name.toLowerCase().includes(trimmed));
  }, [leadCategories, query]);

  const canAddCategory =
    query.trim().length > 0 &&
    !leadCategories.some(
      (category) =>
        normalizeLeadCategoryName(category.name) === normalizeLeadCategoryName(query)
    );

  const handleCategorySelect = async (
    categoryId: string | null,
    categoryName?: string
  ): Promise<void> => {
    if (!currentLead.id) return;

    const selectedCategory = categoryId
      ? leadCategories.find((category) => category.id === categoryId) ?? null
      : null;
    const nextCategoryName = categoryName ?? selectedCategory?.name ?? undefined;

    const status = await dispatch(
      updateLeadThunk(currentLead.id, {
        category_id: categoryId || null,
        category_name: nextCategoryName ?? null,
      })
    );

    if (status !== 200) {
      window.alert('Unable to update category right now.');
      return;
    }

    setQuery(nextCategoryName ?? '');
    setIsMenuOpen(false);
  };

  const handleAddCategory = async (): Promise<void> => {
    const trimmed = query.trim();
    if (!trimmed || !currentLead.id) return;

    const created = await dispatch(createLeadCategoryThunk(trimmed));
    if (created !== 200) {
      window.alert('Unable to create category right now.');
      return;
    }

    await handleCategorySelect(null, trimmed);
  };

  const handleAutoCategorize = async (): Promise<void> => {
    if (!currentLead.id || isAutoCategorizing) return;

    setIsAutoCategorizing(true);
    setAutoCategoryLabel('');
    const result = await dispatch(runLeadAutoCategorizeThunk());
    setIsAutoCategorizing(false);

    if (!result.ok) {
      window.alert(result.message || result.error || 'Auto-categorize failed.');
      return;
    }

    const confidencePercent = Math.round(result.confidence * 100);
    setAutoCategoryLabel(`${result.categoryName} (${confidencePercent}% confidence)`);
    setQuery(result.categoryName);
  };

  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.labelRow}>
          <span className={styles.label}>Category</span>
        </div>

        <div className={styles.inputRow} ref={containerRef}>
          <input
            value={query}
            onFocus={() => setIsMenuOpen(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setIsMenuOpen(true);
            }}
            placeholder="Search categories"
            className={styles.input}
          />
          <button
            type="button"
            onClick={handleAutoCategorize}
            disabled={isAutoCategorizing || !currentLead.id}
            className={styles.refreshButton}
            title="Auto-categorize with AI"
          >
            {isAutoCategorizing ? '...' : '↻'}
          </button>

          {isMenuOpen && (
            <div className={styles.menu}>
              <button
                type="button"
                onClick={() => handleCategorySelect(null)}
                className={styles.menuItem}
              >
                -
              </button>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                  className={styles.menuItem}
                >
                  {category.name}
                </button>
              ))}
              {canAddCategory && (
                <button
                  type="button"
                  onClick={handleAddCategory}
                  className={styles.menuItemAdd}
                >
                  + Add &quot;{query.trim()}&quot;
                </button>
              )}
            </div>
          )}
        </div>

        {autoCategoryLabel ? (
          <p className={styles.hint}>AI suggestion applied: {autoCategoryLabel}</p>
        ) : (
          <p className={styles.hint}>Search existing categories, create one, or auto-categorize.</p>
        )}
      </div>

      <div>
        <div className={styles.labelRow}>
          <span className={styles.label}>Website</span>
        </div>
        <input
          type="text"
          value={currentLead?.website ?? ''}
          onChange={(e) =>
            dispatch(
              CurrentLeadActions.updateCurrentLead({
                website: e.target.value || null,
              })
            )
          }
          placeholder="https://…"
          className={styles.websiteInput}
        />
        <p className={styles.hint}>Saved with the lead when you click Save.</p>
      </div>
    </div>
  );
};

const styles = {
  root: `flex flex-col gap-4`,
  container: `relative`,
  labelRow: `flex items-center justify-between`,
  label: `text-xs font-medium uppercase tracking-wide text-gray-500`,
  inputRow: `relative mt-1 flex items-center gap-2`,
  input: `
    px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    hover:border-gray-400 transition-colors w-full
  `,
  refreshButton: `
    w-8 h-8 inline-flex items-center justify-center text-sm text-gray-700 bg-white border border-gray-300 rounded
    hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer
  `,
  menu: `
    absolute z-20 top-full left-0 mt-1 w-full rounded border border-gray-300 bg-white shadow-lg
    max-h-56 overflow-y-auto
  `,
  menuItem: `
    w-full text-left px-2 py-1.5 text-sm text-gray-800 hover:bg-gray-50
    border-none bg-transparent cursor-pointer
  `,
  menuItemAdd: `
    w-full text-left px-2 py-1.5 text-sm text-blue-700 hover:bg-blue-50
    border-none bg-transparent cursor-pointer font-medium
  `,
  hint: `mt-1 text-xs text-gray-500`,
  websiteInput: `
    mt-1 w-full px-2 py-1 text-sm border border-gray-300 rounded bg-white
    focus:ring-1 focus:ring-blue-500 focus:border-blue-500 focus:outline-none
    hover:border-gray-400 transition-colors
  `,
};
