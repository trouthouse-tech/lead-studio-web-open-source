'use client';

import { useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  resolveEntitySwitcherBreadcrumb,
  type EntitySwitcherResolveContext,
} from '@/utils/dashboard-breadcrumbs/resolve-entity-switcher-breadcrumb';
import type { AppLayoutBreadcrumb } from './app-layout-breadcrumb';

/**
 * Resolves `breadcrumbBuilder` + lead list into header-ready breadcrumbs (includes `onSelect` handlers).
 */
export const useResolvedDashboardBreadcrumbs = (): AppLayoutBreadcrumb[] => {
  const dispatch = useAppDispatch();
  const breadcrumbBuilder = useAppSelector((state) => state.breadcrumbBuilder);
  const base = breadcrumbBuilder.base;
  const segments = breadcrumbBuilder.segments;

  const leads = useAppSelector((state) => state.leads);

  return useMemo(() => {
    const hasTrail = base !== null || segments.length > 0;
    if (!hasTrail) {
      return [];
    }

    const items: AppLayoutBreadcrumb[] = [];

    if (base) {
      items.push({ label: base.label, href: base.href });
    }

    const entityCtx: EntitySwitcherResolveContext = {
      dispatch,
      leads,
    };

    for (const segment of segments) {
      if (segment.kind === 'staticLink') {
        items.push({ label: segment.label, href: segment.href });
        continue;
      }

      if (segment.kind === 'plainText') {
        items.push({ label: segment.label });
        continue;
      }

      if (segment.kind === 'entitySwitcher') {
        items.push(resolveEntitySwitcherBreadcrumb(entityCtx, segment));
      }
    }

    return items;
  }, [base, segments, leads, dispatch]);
};
