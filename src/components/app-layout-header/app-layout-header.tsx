'use client';

import { useMemo } from 'react';
import { BreadcrumbBar } from './breadcrumb-bar';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

type AppLayoutHeaderProps = {
  isSidebarVisible: boolean;
  onToggleSidebar: () => void;
  breadcrumbItems: AppLayoutBreadcrumb[];
};

export const AppLayoutHeader = (props: AppLayoutHeaderProps) => {
  const { isSidebarVisible, onToggleSidebar, breadcrumbItems } = props;

  const hasBreadcrumbItems = breadcrumbItems.length > 0;

  const toggleButtonLabel = useMemo(
    () => (isSidebarVisible ? 'Hide sidebar' : 'Show sidebar'),
    [isSidebarVisible],
  );

  const handleToggleSidebar = () => {
    onToggleSidebar();
  };

  return (
    <header className={styles.header}>
      <nav className={styles.breadcrumbNav} aria-label="Breadcrumb">
        <ol className={styles.breadcrumbList}>
          <li className={styles.breadcrumbToggleItem}>
            <button
              type="button"
              onClick={handleToggleSidebar}
              className={styles.toggleButton}
              aria-pressed={isSidebarVisible}
              aria-label={toggleButtonLabel}
            >
              <span className={styles.toggleIcon} aria-hidden="true">
                <span className={styles.toggleIconBar}></span>
                <span className={styles.toggleIconBar}></span>
                <span className={styles.toggleIconBar}></span>
              </span>
            </button>
            {hasBreadcrumbItems && (
              <span className={styles.breadcrumbSeparator} aria-hidden="true">
                /
              </span>
            )}
          </li>
          <BreadcrumbBar dismissMenusSignal={isSidebarVisible} items={breadcrumbItems} />
        </ol>
      </nav>
    </header>
  );
};

const styles = {
  header: `
    flex items-center justify-between gap-3 border-b border-gray-200/60 bg-transparent px-4 py-2.5
  `,
  breadcrumbNav: `
    flex flex-1 items-center overflow-visible
  `,
  breadcrumbList: `
    flex min-w-0 items-center gap-2
  `,
  breadcrumbToggleItem: `
    flex items-center gap-2 text-xs text-gray-500
  `,
  toggleButton: `
    flex h-6 w-6 items-center justify-center rounded-md bg-transparent text-gray-700
    transition-colors hover:bg-gray-100 focus:outline-none cursor-pointer
  `,
  toggleIcon: `
    flex h-3 w-4 flex-col items-center justify-between
  `,
  toggleIconBar: `
    h-0.5 w-full rounded-full bg-gray-700 transition-colors
  `,
  breadcrumbSeparator: `
    text-xs font-normal text-gray-400
  `,
};
