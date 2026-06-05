import Link from 'next/link';
import {
  DASHBOARD_PATH,
  DOCS_HUB_URL,
  GITHUB_WEB_REPO_URL,
} from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

/**
 * Floating landing header: wordmark + GitHub, Docs, Open app.
 */
export const Header = () => {
  const c = LANDING_CONTENT;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand}>
          {c.brandName}
        </Link>
        <nav className={styles.nav}>
          <a
            href={GITHUB_WEB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            GitHub
          </a>
          <a
            href={DOCS_HUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.navLink}
          >
            Docs
          </a>
          <Link href={DASHBOARD_PATH} className={styles.openApp}>
            Open app
          </Link>
        </nav>
      </div>
    </header>
  );
};

const styles = {
  header: `
    absolute inset-x-0 top-0 z-20
  `,
  inner: `
    mx-auto flex max-w-6xl items-center justify-between px-6 py-6
  `,
  brand: `
    text-base font-semibold tracking-tight
  `,
  nav: `
    flex items-center gap-6 text-sm
  `,
  navLink: `
    hidden text-muted-foreground transition-colors
    hover:text-foreground
    sm:inline
  `,
  openApp: `
    inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
};
