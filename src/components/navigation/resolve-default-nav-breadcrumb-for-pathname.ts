import { DASHBOARD_PATH } from '@/config/routes';
import { getNavigationLinks, type NavigationLink, type NavigationRoute } from './get-navigation-links';

const isNavigationRoute = (link: NavigationLink): link is NavigationRoute => 'href' in link;

export type DefaultNavBreadcrumb = {
  label: string;
  href?: string;
};

/**
 * Matches the default (non-override) first breadcrumb derived from the sidebar nav, same rules as `AppLayout`.
 */
export const resolveDefaultNavBreadcrumbForPathname = (pathname: string): DefaultNavBreadcrumb | null => {
  const navigationLinks = getNavigationLinks();

  let activeNavigationLink: NavigationLink | undefined;
  for (const link of navigationLinks) {
    if (isNavigationRoute(link)) {
      if (link.href === DASHBOARD_PATH) {
        if (pathname === DASHBOARD_PATH) {
          activeNavigationLink = link;
          break;
        }
        continue;
      }
      if (pathname === link.href || pathname.startsWith(`${link.href}/`)) {
        activeNavigationLink = link;
        break;
      }
    }
    if (link.children) {
      const childMatch = link.children.some(
        (child) => pathname === child.href || pathname.startsWith(`${child.href}/`),
      );
      if (childMatch) {
        activeNavigationLink = link;
        break;
      }
    }
  }

  if (!activeNavigationLink) {
    return null;
  }

  if (!isNavigationRoute(activeNavigationLink)) {
    return { label: activeNavigationLink.name };
  }

  return { label: activeNavigationLink.name, href: activeNavigationLink.href };
};
