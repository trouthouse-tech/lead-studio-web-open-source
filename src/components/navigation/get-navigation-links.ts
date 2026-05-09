import { pathnameMatchesActivePathPrefix } from './pathname-matches-active-path-prefix';
import { getAppSidebarSections } from '../sidebar/get-app-sidebar-sections';

export type NavigationLinkChild = {
  name: string;
  href: string;
  /** When set, child is active for these paths (exact or under prefix), e.g. `/blog-studio` for View all → `/blogs`. */
  activePathPrefix?: string | readonly string[];
};

/**
 * Whether a sidebar child link should show as active for the current pathname.
 */
export const isNavigationChildActive = (pathname: string, child: NavigationLinkChild): boolean => {
  if (pathname === child.href || pathname.startsWith(`${child.href}/`)) return true;
  if (child.activePathPrefix) {
    return pathnameMatchesActivePathPrefix(pathname, child.activePathPrefix);
  }
  return false;
};

/** Parent row is label + chevron only (no destination). */
export type NavigationSection = {
  name: string;
  children: NavigationLinkChild[];
};

/** Top-level link, optional nested children (e.g. Knowledge). */
export type NavigationRoute = {
  name: string;
  href: string;
  children?: NavigationLinkChild[];
  /** Sidebar active when pathname matches any prefix (exact or nested under `prefix/`). */
  activePathPrefix?: string | readonly string[];
};

export type NavigationLink = NavigationSection | NavigationRoute;

/**
 * Ordered flat list of sidebar nav rows (same order as `getAppSidebarSections`).
 * Used for breadcrumbs and any code that walks the dashboard nav tree.
 */
export const getNavigationLinks = (): NavigationLink[] =>
  getAppSidebarSections().flatMap((section) => section.links);
