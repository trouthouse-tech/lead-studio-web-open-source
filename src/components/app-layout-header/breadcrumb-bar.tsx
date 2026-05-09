'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type BreadcrumbBarProps = {
  items: AppLayoutBreadcrumb[];
  /** When this value changes (e.g. sidebar toggled), any open dropdown closes. */
  dismissMenusSignal?: boolean;
};

/**
 * Dashboard breadcrumb trail with optional per-crumb dropdown menus.
 */
export const BreadcrumbBar = (props: BreadcrumbBarProps) => {
  const { items, dismissMenusSignal } = props;

  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);
  const breadcrumbRefs = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    setOpenMenuIndex(null);
  }, [dismissMenusSignal]);

  useEffect(() => {
    const pendingIndex = items.findIndex((item) => item.isPendingSelection);
    setOpenMenuIndex((current) => {
      if (pendingIndex !== -1) {
        return pendingIndex;
      }

      if (current !== null && items[current]?.isPendingSelection) {
        return null;
      }

      if (current !== null && current >= items.length) {
        return null;
      }

      return current;
    });
  }, [items]);

  useEffect(() => {
    if (openMenuIndex === null) {
      return undefined;
    }

    const handleClickOutside = (event: MouseEvent) => {
      const currentMenuElement = breadcrumbRefs.current[openMenuIndex];
      if (currentMenuElement && !currentMenuElement.contains(event.target as Node)) {
        setOpenMenuIndex(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuIndex]);

  const handleMenuToggle = (index: number) => {
    setOpenMenuIndex((current) => (current === index ? null : index));
  };

  const handleMenuItemSelect = (onSelect: () => void) => {
    onSelect();
    setOpenMenuIndex(null);
  };

  const hasItems = items.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <>
      {items.map((item, index) => {
        const breadcrumbIndex = index;
        const isMenu = Boolean(item.menuItems && item.menuItems.length > 0);
        const isMenuOpen = openMenuIndex === breadcrumbIndex;
        const separator = index > 0;

        return (
          <li
            key={`${item.label}-${breadcrumbIndex}-${item.href ?? ''}`}
            className={styles.breadcrumbItem}
            ref={(element) => {
              breadcrumbRefs.current[breadcrumbIndex] = element;
            }}
          >
            {separator && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
            {isMenu ? (
              <div className={styles.dropdownWrapper}>
                <button
                  type="button"
                  className={`${styles.breadcrumbButton} ${
                    item.isPendingSelection ? styles.breadcrumbButtonPending : ''
                  }`}
                  onClick={() => handleMenuToggle(breadcrumbIndex)}
                  aria-expanded={isMenuOpen}
                >
                  <span>{item.label}</span>
                  <svg
                    className={`${styles.breadcrumbChevron} ${isMenuOpen ? styles.breadcrumbChevronOpen : ''}`}
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 8L10 12L14 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                {isMenuOpen && item.menuItems && (
                  <div className={styles.dropdownMenu} role="menu">
                    {item.menuItems.map((menuItem, menuIndex) => (
                      <button
                        key={`${menuItem.label}-${menuIndex}`}
                        type="button"
                        className={`${styles.dropdownMenuItem} ${
                          menuItem.isActive ? styles.dropdownMenuItemActive : ''
                        }`}
                        onClick={() => handleMenuItemSelect(menuItem.onSelect)}
                        role="menuitem"
                        disabled={menuItem.isDisabled}
                      >
                        {menuItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : item.onSelect ? (
              <button type="button" className={styles.breadcrumbAction} onClick={item.onSelect}>
                {item.label}
              </button>
            ) : item.href ? (
              <Link href={item.href} className={styles.breadcrumbLink}>
                {item.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{item.label}</span>
            )}
          </li>
        );
      })}
    </>
  );
};

const styles = {
  breadcrumbSeparator: `
    text-xs font-normal text-gray-400
  `,
  breadcrumbItem: `
    relative flex min-w-0 items-center gap-2 text-xs font-medium text-gray-600
  `,
  dropdownWrapper: `
    relative flex items-center
  `,
  breadcrumbButton: `
    flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-gray-700
    transition-colors hover:text-gray-900 hover:bg-gray-100/80 focus:outline-none
  `,
  breadcrumbButtonPending: `
    text-gray-500 italic
  `,
  breadcrumbChevron: `
    h-3.5 w-3.5 text-gray-500 transition-transform duration-150 ease-linear
  `,
  breadcrumbChevronOpen: `
    rotate-180
  `,
  dropdownMenu: `
    absolute left-0 top-full z-50 mt-1.5 min-w-[16rem] overflow-visible rounded-lg border border-gray-200 bg-white shadow-lg
  `,
  dropdownMenuItem: `
    flex w-full items-center justify-between px-3 py-2 text-left text-xs text-gray-700 transition-colors
    hover:bg-blue-50 hover:text-blue-600
  `,
  dropdownMenuItemActive: `
    bg-blue-100 text-blue-700 font-semibold
  `,
  breadcrumbAction: `
    truncate text-xs font-medium text-gray-600 transition-colors cursor-pointer
    hover:text-gray-900 focus:outline-none
  `,
  breadcrumbLink: `
    truncate text-xs font-medium text-gray-600 transition-colors hover:text-gray-900 focus:outline-none
  `,
  breadcrumbCurrent: `
    truncate text-xs font-medium text-gray-900
  `,
};
