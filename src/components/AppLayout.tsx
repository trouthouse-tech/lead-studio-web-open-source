'use client';

import { usePathname } from 'next/navigation';
import { useLayoutEffect, useMemo, useState } from 'react';
import {
  AppLayoutHeader,
  type AppLayoutBreadcrumb,
  useResolvedDashboardBreadcrumbs,
} from './app-layout-header';
import { resolveDefaultNavBreadcrumbForPathname } from './navigation';
import { Sidebar } from './sidebar';
import { BreadcrumbBuilderActions } from '@/store/builders';
import { useAppDispatch } from '@/store/hooks';

const SIDEBAR_VISIBLE_KEY = 'luckee-sidebar-visible';

const getStoredSidebarVisible = (): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const stored = localStorage.getItem(SIDEBAR_VISIBLE_KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
};

type AppLayoutProps = {
  children: React.ReactNode;
  fullWidth?: boolean;
};

export const AppLayout = (props: AppLayoutProps) => {
  const { children, fullWidth = false } = props;

  const dispatch = useAppDispatch();
  const [isSidebarVisible, setIsSidebarVisible] = useState(getStoredSidebarVisible);
  const pathname = usePathname();

  useLayoutEffect(() => {
    dispatch(BreadcrumbBuilderActions.reset());
  }, [dispatch, pathname]);

  const defaultNavCrumb = useMemo(
    () => resolveDefaultNavBreadcrumbForPathname(pathname),
    [pathname],
  );

  const navOnlyBreadcrumbItems = useMemo((): AppLayoutBreadcrumb[] => {
    if (!defaultNavCrumb) {
      return [];
    }
    const item: AppLayoutBreadcrumb = { label: defaultNavCrumb.label };
    if (defaultNavCrumb.href) {
      item.href = defaultNavCrumb.href;
    }
    return [item];
  }, [defaultNavCrumb]);

  const reduxBreadcrumbItems = useResolvedDashboardBreadcrumbs();

  const breadcrumbItems = useMemo(
    () => (reduxBreadcrumbItems.length > 0 ? reduxBreadcrumbItems : navOnlyBreadcrumbItems),
    [reduxBreadcrumbItems, navOnlyBreadcrumbItems],
  );

  const handleToggleSidebar = () => {
    setIsSidebarVisible((previous) => {
      const next = !previous;
      try {
        localStorage.setItem(SIDEBAR_VISIBLE_KEY, String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  return (
    <div className={styles.appShell}>
      {isSidebarVisible && <Sidebar />}
      <div className={styles.mainColumn}>
        <AppLayoutHeader
          isSidebarVisible={isSidebarVisible}
          onToggleSidebar={handleToggleSidebar}
          breadcrumbItems={breadcrumbItems}
        />
        <div className={fullWidth ? styles.contentFullWidth : styles.contentStandard}>
          <div className={fullWidth ? styles.innerFullWidth : styles.innerStandard}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  appShell: `flex h-screen overflow-hidden bg-gray-50`,
  mainColumn: `flex flex-1 flex-col min-h-0 overflow-y-auto`,
  contentStandard: `flex-1 p-2`,
  contentFullWidth: `flex-1 min-h-0 flex flex-col p-3`,
  innerStandard: `w-full`,
  innerFullWidth: `w-full flex-1 min-h-0 flex flex-col min-w-0`,
};
