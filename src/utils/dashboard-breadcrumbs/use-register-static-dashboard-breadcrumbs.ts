'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type { AppLayoutBreadcrumb } from '@/components/app-layout-header';
import { useAppDispatch } from '@/store/hooks';
import { resetDashboardBreadcrumbTrail, setStaticDashboardBreadcrumbTrailFromLegacyProps } from './set-static-dashboard-breadcrumb-trail-from-legacy-props';

/**
 * Keeps the Redux breadcrumb trail in sync with legacy static crumbs for the current pathname.
 */
export const useRegisterStaticDashboardBreadcrumbs = (legacyBreadcrumbs: AppLayoutBreadcrumb[]): void => {
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setStaticDashboardBreadcrumbTrailFromLegacyProps(dispatch, pathname, legacyBreadcrumbs);
    return () => {
      resetDashboardBreadcrumbTrail(dispatch);
    };
  }, [dispatch, pathname, legacyBreadcrumbs]);
};
