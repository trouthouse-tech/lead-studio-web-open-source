'use client';

import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadsFiltersActions } from '@/store/filters';

type Props = {
  variant?: 'default' | 'bar';
  /** Tighter padding and type for toolbar rows (~20% smaller than default bar). */
  dense?: boolean;
};

export const LeadsFiltersSearchInput = (props: Props) => {
  const { variant = 'default', dense = false } = props;
  const dispatch = useAppDispatch();
  const searchFilter = useAppSelector((state) => state.leadsFilters.searchFilter);
  const [localSearch, setLocalSearch] = useState(searchFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(LeadsFiltersActions.setSearchFilter(localSearch));
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, dispatch]);

  useEffect(() => {
    setLocalSearch(searchFilter);
  }, [searchFilter]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearch(e.target.value);
    },
    []
  );

  const containerClass =
    variant === 'bar'
      ? dense
        ? styles.searchContainerBarDense
        : styles.searchContainerBar
      : styles.searchContainer;
  const inputClass =
    variant === 'bar'
      ? dense
        ? styles.searchInputBarDense
        : styles.searchInputBar
      : styles.searchInput;

  const iconClass = dense && variant === 'bar' ? styles.searchIconDense : styles.searchIcon;
  const clearClass =
    dense && variant === 'bar' ? styles.clearSearchButtonDense : styles.clearSearchButton;

  return (
    <div className={containerClass}>
      <span className={iconClass}>🔍</span>
      <input
        type="text"
        value={localSearch}
        onChange={handleSearchChange}
        placeholder="Search business name or website..."
        className={inputClass}
      />
      {localSearch ? (
        <button type="button" onClick={() => setLocalSearch('')} className={clearClass}>
          ✕
        </button>
      ) : null}
    </div>
  );
};

const styles = {
  searchContainer: `relative flex items-center border border-gray-300 rounded px-2 py-1.5 bg-white`,
  searchContainerBar: `
    relative flex flex-1 min-w-[12rem] items-center border border-gray-300 rounded-md px-2 py-2 bg-white
    shadow-sm
  `,
  searchContainerBarDense: `
    relative flex flex-1 min-w-[10rem] max-w-xl items-center border border-gray-300 rounded-md px-1.5 py-1.5 bg-white
    shadow-sm
  `,
  searchIcon: `text-gray-400 mr-1 shrink-0`,
  searchIconDense: `text-gray-400 mr-0.5 text-xs shrink-0`,
  searchInput: `w-48 text-sm border-none outline-none bg-transparent`,
  searchInputBar: `flex-1 min-w-0 text-sm border-none outline-none bg-transparent`,
  searchInputBarDense: `flex-1 min-w-0 text-xs border-none outline-none bg-transparent`,
  clearSearchButton: `text-gray-400 hover:text-gray-600 text-xs cursor-pointer border-none bg-transparent p-0.5`,
  clearSearchButtonDense: `text-gray-400 hover:text-gray-600 text-[10px] cursor-pointer border-none bg-transparent p-0`,
};
