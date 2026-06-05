import { ArrowRight } from 'lucide-react';
import { LUCKEE_URL } from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

/**
 * Landing Luckee ecosystem callout.
 */
export const Ecosystem = () => {
  const c = LANDING_CONTENT.ecosystem;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.card}>
          <div>
            <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
            <p className={styles.body}>{c.body}</p>
          </div>
          <a
            href={LUCKEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {c.linkLabel}
            <ArrowRight className={`cta-arrow h-4 w-4`} />
          </a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    px-6 py-20
    sm:py-28
  `,
  inner: `
    mx-auto max-w-6xl
  `,
  card: `
    flex flex-col items-start justify-between gap-6 rounded-xl border border-border bg-orange-tint/60 p-8
    sm:flex-row sm:items-center
  `,
  kicker: `
    text-primary
  `,
  body: `
    mt-3 max-w-xl text-foreground
  `,
  link: `
    inline-flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary
  `,
};
