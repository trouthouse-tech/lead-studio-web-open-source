'use client';

import { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PanelLeft, PanelLeftClose, Rows3 } from 'lucide-react';
import { getAppSidebarSections } from './get-app-sidebar-sections';

/**
 * App shell sidebar (Luckee-style collapse, flat nav — same structure as `nextjs-to-download`).
 */
export const Sidebar = () => {
  const pathname = usePathname();
  const sections = useMemo(() => getAppSidebarSections(), []);
  const [collapsed, setCollapsed] = useState(false);

  const isActiveHref = useCallback(
    (href: string) => {
      if (href === '/') return pathname === '/';
      return pathname === href || pathname.startsWith(`${href}/`);
    },
    [pathname],
  );

  return (
    <aside className={styles.sidebar(collapsed)}>
      <div className={styles.logoArea}>
        <Link href="/" className={styles.logoLink}>
          <span className={styles.logoMark}>LS</span>
          {!collapsed && <span className={styles.logoText}>Lead Studio</span>}
        </Link>
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className={styles.collapseBtn}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className={styles.nav}>
        {sections.map((section) => (
          <div key={section.title || 'nav'} className={styles.navGroup}>
            {!collapsed && section.title.trim() ? (
              <p className={styles.navGroupTitle}>{section.title}</p>
            ) : null}
            <div className={styles.navGroupItems}>
              {section.links.map((link) => {
                const leafActive = isActiveHref(link.href);
                return (
                  <div key={link.href} className={styles.parentRow(leafActive)}>
                    <Link href={link.href} className={styles.parentLink(collapsed)} title={link.name}>
                      <Rows3 className={styles.icon(leafActive)} />
                      {!collapsed && <span className={styles.linkLabel}>{link.name}</span>}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        {!collapsed ? (
          <p className={styles.footerText}>Point NEXT_PUBLIC_SERVER_URL at lead-studio-express-server.</p>
        ) : null}
      </div>
    </aside>
  );
};

const styles = {
  sidebar: (collapsed: boolean) =>
    `${collapsed ? 'w-16' : 'w-56'} flex flex-col border-r border-zinc-800 bg-zinc-900 text-zinc-100 transition-all duration-200 min-h-screen shrink-0`,
  logoArea: `flex items-center justify-between px-3 py-4 border-b border-zinc-800 shrink-0`,
  logoLink: `flex items-center gap-2.5 min-w-0`,
  logoMark: `flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#ff7c1e] text-sm font-bold text-white`,
  logoText: `truncate text-base font-semibold tracking-tight text-zinc-50`,
  collapseBtn: `shrink-0 rounded p-1 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100`,
  nav: `min-h-0 flex-1 space-y-0.5 overflow-y-auto px-2 py-3`,
  navGroup: `space-y-1`,
  navGroupTitle: `px-2.5 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide text-zinc-500`,
  navGroupItems: `space-y-0.5`,
  parentRow: (active: boolean) =>
    `group flex items-center rounded-md ${
      active ? 'bg-zinc-800 text-zinc-50' : 'text-zinc-200 hover:bg-zinc-800/60'
    }`,
  parentLink: (collapsed: boolean) =>
    `flex min-w-0 flex-1 items-center gap-2 truncate px-2.5 py-2 text-sm font-medium ${
      collapsed ? 'justify-center' : ''
    }`,
  icon: (active: boolean) => `h-4 w-4 shrink-0 ${active ? 'text-orange-400' : 'text-zinc-500'}`,
  linkLabel: `truncate`,
  footer: `mt-auto shrink-0 border-t border-zinc-800 px-2 py-3`,
  footerText: `text-center text-[11px] leading-relaxed text-zinc-500`,
};
