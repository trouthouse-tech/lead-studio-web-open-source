import type { AppLayoutBreadcrumb } from '@/components/app-layout-header';
import { resolveDefaultNavBreadcrumbForPathname } from '@/components/navigation';
import type { BreadcrumbSegment } from '@/model/breadcrumb';
import { BreadcrumbBuilderActions } from '@/store/builders';
import type { AppDispatch } from '@/store';

const legacyItemsToSegments = (items: AppLayoutBreadcrumb[]): BreadcrumbSegment[] =>
  items.map((item) => {
    if (item.href) {
      return { kind: 'staticLink', label: item.label, href: item.href };
    }
    return { kind: 'plainText', label: item.label };
  });

/**
 * Registers a Redux breadcrumb trail equivalent to legacy `AppLayout` `breadcrumbs` prop merging.
 */
export const setStaticDashboardBreadcrumbTrailFromLegacyProps = (
  dispatch: AppDispatch,
  pathname: string,
  legacyBreadcrumbs: AppLayoutBreadcrumb[],
): void => {
  const navBase = resolveDefaultNavBreadcrumbForPathname(pathname);
  dispatch(
    BreadcrumbBuilderActions.setTrail({
      base: navBase,
      segments: legacyItemsToSegments(legacyBreadcrumbs),
    }),
  );
};

export const resetDashboardBreadcrumbTrail = (dispatch: AppDispatch): void => {
  dispatch(BreadcrumbBuilderActions.reset());
};
