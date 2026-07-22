'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useAppSelector } from '@/store/hooks';

type BusinessTypeComboboxProps = {
  value: string;
  onChange: (next: string) => void;
  id?: string;
};

/**
 * Searchable business-type input backed by lead categories (seeded taxonomy).
 * Custom "+ Add …" still allowed for types not yet in the catalog.
 */
export const BusinessTypeCombobox = (props: BusinessTypeComboboxProps) => {
  const { value, onChange, id = 'onboarding-biz-type' } = props;
  const leadCategories = useAppSelector((s) => s.leadCategories);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);

  const categoryNames = useMemo(
    () =>
      [...leadCategories]
        .map((c) => c.name)
        .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
    [leadCategories],
  );

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      setIsOpen(false);
      setQuery(value);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, value]);

  const filteredTypes = useMemo(() => {
    const q = query.trim().toLowerCase();
    const selected = value.trim().toLowerCase();
    const isBrowsingSelected = selected.length > 0 && q === selected;
    const base =
      !q || isBrowsingSelected
        ? categoryNames
        : categoryNames.filter((type) => type.toLowerCase().includes(q));

    if (
      selected.length > 0 &&
      !categoryNames.some((type) => type.toLowerCase() === selected) &&
      !base.some((type) => type.toLowerCase() === selected)
    ) {
      return [value.trim(), ...base];
    }

    return base;
  }, [query, value, categoryNames]);

  const canAddCustom =
    query.trim().length > 0 &&
    !categoryNames.some(
      (type) => type.toLowerCase() === query.trim().toLowerCase(),
    ) &&
    query.trim().toLowerCase() !== value.trim().toLowerCase();

  const selectType = (next: string) => {
    onChange(next);
    setQuery(next);
    setIsOpen(false);
  };

  return (
    <div className={styles.container} ref={containerRef}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        autoComplete="off"
        placeholder="e.g. Restaurants, Electricians…"
        value={query}
        onFocus={() => setIsOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        className={styles.input}
      />
      {isOpen && (
        <div id={`${id}-listbox`} role="listbox" className={styles.menu}>
          {filteredTypes.map((type) => (
            <button
              key={type}
              type="button"
              role="option"
              aria-selected={type === value}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectType(type)}
              className={styles.menuItem}
            >
              {type}
            </button>
          ))}
          {canAddCustom && (
            <button
              type="button"
              role="option"
              aria-selected={false}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => selectType(query.trim())}
              className={styles.menuItemAdd}
            >
              + Add &quot;{query.trim()}&quot;
            </button>
          )}
          {filteredTypes.length === 0 && !canAddCustom && (
            <p className={styles.empty}>
              {categoryNames.length === 0
                ? 'No categories yet — seed lead_categories or type to add one'
                : 'No matching types'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: `
    relative w-full
  `,
  input: `
    w-full rounded-lg border border-slate-200 px-3 py-2 text-sm
    text-slate-900 placeholder:text-slate-400
    focus:outline-none focus:ring-2 focus:ring-slate-400/30
  `,
  menu: `
    absolute z-20 mt-1 w-full max-h-56 overflow-y-auto
    rounded-lg border border-slate-200 bg-white shadow-lg
  `,
  menuItem: `
    w-full text-left px-3 py-2 text-sm text-slate-800
    hover:bg-slate-50 border-none bg-transparent cursor-pointer
  `,
  menuItemAdd: `
    w-full text-left px-3 py-2 text-sm text-blue-700 font-medium
    hover:bg-blue-50 border-none bg-transparent cursor-pointer
    border-t border-slate-100
  `,
  empty: `
    px-3 py-2 text-sm text-slate-500 m-0
  `,
} as const;
