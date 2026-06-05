import {
  DOCS_HUB_URL,
  GITHUB_WEB_REPO_URL,
  LUCKEE_URL,
} from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

const FOOTER_HREFS: Record<string, string> = {
  GitHub: GITHUB_WEB_REPO_URL,
  Docs: DOCS_HUB_URL,
  Luckee: LUCKEE_URL,
};

/**
 * Landing footer.
 */
export const Footer = () => {
  const c = LANDING_CONTENT;

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.links}>
          <span className={styles.brand}>{c.brandName}</span>
          {c.footer.links.map((link) => (
            <a
              key={link.label}
              href={FOOTER_HREFS[link.label]}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
            >
              {link.label}
            </a>
          ))}
        </div>
        <div className={styles.tags}>
          {c.footer.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </footer>
  );
};

const styles = {
  footer: `
    border-t border-border
  `,
  inner: `
    mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-6 py-10 text-sm text-muted-foreground
    sm:flex-row sm:items-center
  `,
  links: `
    flex flex-wrap items-center gap-x-6 gap-y-2
  `,
  brand: `
    font-medium text-foreground
  `,
  link: `
    hover:text-foreground
  `,
  tags: `
    flex flex-wrap items-center gap-x-4 gap-y-2 text-xs
  `,
};
