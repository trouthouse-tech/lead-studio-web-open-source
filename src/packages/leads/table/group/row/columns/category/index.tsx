'use client';

import { useRef, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateLeadThunk } from '@/store/thunks/leads';
import { createLeadCategoryThunk } from '@/store/thunks/lead-categories';
import type { Lead } from '@/model';
import { normalizeLeadCategoryName } from '@/utils/leads';
import { leadsTableRowColumnStyles as styles } from '../styles';
import {
  getCategoryMenuPlacement,
  type CategoryMenuPlacement,
} from '../category-menu-placement';

type LeadsTableRowCategoryColumnProps = {
  lead: Lead;
};

export const LeadsTableRowCategoryColumn = (
  props: LeadsTableRowCategoryColumnProps
) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const leadCategories = useAppSelector((state) => state.leadCategories);
  const categoryContainerRef = useRef<HTMLDivElement | null>(null);
  const categoryMenuPortalRef = useRef<HTMLDivElement | null>(null);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [categoryMenuPlacement, setCategoryMenuPlacement] =
    useState<CategoryMenuPlacement | null>(null);
  const [categoryQuery, setCategoryQuery] = useState(lead.category_name ?? '');

  useEffect(() => {
    if (!isCategoryMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (categoryContainerRef.current?.contains(target)) return;
      if (categoryMenuPortalRef.current?.contains(target)) return;
      setIsCategoryMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryMenuOpen]);

  useLayoutEffect(() => {
    if (!isCategoryMenuOpen) {
      setCategoryMenuPlacement(null);
      return;
    }

    const updatePlacement = () => {
      const el = categoryContainerRef.current;
      if (!el) return;
      setCategoryMenuPlacement(
        getCategoryMenuPlacement(el.getBoundingClientRect())
      );
    };

    updatePlacement();
    window.addEventListener('scroll', updatePlacement, true);
    window.addEventListener('resize', updatePlacement);
    return () => {
      window.removeEventListener('scroll', updatePlacement, true);
      window.removeEventListener('resize', updatePlacement);
    };
  }, [isCategoryMenuOpen]);

  const handleCategorySelect = async (
    categoryId: string | null,
    categoryName?: string
  ) => {
    const selectedCategory = categoryId
      ? leadCategories.find((c) => c.id === categoryId) ?? null
      : null;
    const nextCategoryName = categoryName ?? selectedCategory?.name ?? undefined;
    await dispatch(
      updateLeadThunk(lead.id, {
        category_id: categoryId || undefined,
        category_name: nextCategoryName,
      })
    );
    setCategoryQuery(nextCategoryName ?? '');
    setIsCategoryMenuOpen(false);
  };

  const handleAddCategory = async () => {
    const trimmed = categoryQuery.trim();
    if (!trimmed) return;
    const created = await dispatch(createLeadCategoryThunk(trimmed));
    if (created !== 200) return;
    await handleCategorySelect(null, trimmed);
  };

  const filteredCategories = useMemo(() => {
    const query = categoryQuery.trim().toLowerCase();
    if (!query) return leadCategories;
    return leadCategories.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    );
  }, [leadCategories, categoryQuery]);
  const canAddCategory =
    categoryQuery.trim().length > 0 &&
    !leadCategories.some(
      (cat) =>
        normalizeLeadCategoryName(cat.name) ===
        normalizeLeadCategoryName(categoryQuery)
    );

  return (
    <td className={styles.tableCellCenter} onClick={(e) => e.stopPropagation()}>
      <div className={styles.categoryInputContainer} ref={categoryContainerRef}>
        <input
          value={categoryQuery}
          onFocus={() => setIsCategoryMenuOpen(true)}
          onChange={(e) => {
            setCategoryQuery(e.target.value);
            setIsCategoryMenuOpen(true);
          }}
          placeholder="Search categories"
          className={styles.categorySelect}
        />
      </div>
      {isCategoryMenuOpen &&
        categoryMenuPlacement &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={categoryMenuPortalRef}
            className={styles.categoryMenuPortal}
            style={{
              position: 'fixed',
              left: categoryMenuPlacement.left,
              width: categoryMenuPlacement.width,
              maxHeight: categoryMenuPlacement.maxHeight,
              ...(categoryMenuPlacement.top !== undefined
                ? { top: categoryMenuPlacement.top }
                : { bottom: categoryMenuPlacement.bottom }),
            }}
          >
            <button
              type="button"
              onClick={() => handleCategorySelect(null)}
              className={styles.categoryMenuItem}
            >
              —
            </button>
            {filteredCategories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategorySelect(cat.id)}
                className={styles.categoryMenuItem}
              >
                {cat.name}
              </button>
            ))}
            {canAddCategory && (
              <button
                type="button"
                onClick={handleAddCategory}
                className={styles.categoryMenuItemAdd}
              >
                + Add &quot;{categoryQuery.trim()}&quot;
              </button>
            )}
          </div>,
          document.body
        )}
    </td>
  );
};
