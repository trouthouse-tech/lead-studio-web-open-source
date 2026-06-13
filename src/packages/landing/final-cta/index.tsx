import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import {
  DASHBOARD_PATH,
  LUCKEE_URL,
  OSS_QUICKSTART_URL,
} from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

/**
 * Landing final CTA band.
 */
export const FinalCta = () => {
  const c = LANDING_CONTENT.finalCta;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
        <h2 className={styles.title}>{c.title}</h2>
        <div className={styles.ctaRow}>
          <Link href={DASHBOARD_PATH} className={styles.primaryCta}>
            {c.primaryCta}
            <ArrowRight className={`cta-arrow h-4 w-4`} />
          </Link>
          <a
            href={OSS_QUICKSTART_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.outlineCta}
          >
            {c.secondaryCta}
          </a>
          <a
            href={LUCKEE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.tertiaryCta}
          >
            {c.tertiaryCta}
            <ArrowRight className={`cta-arrow h-4 w-4`} />
          </a>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    px-6 pb-24
  `,
  inner: `
    mx-auto max-w-6xl rounded-2xl bg-ink px-8 py-20 text-center text-ink-foreground
    sm:px-14 sm:py-28
  `,
  kicker: `
    text-primary
  `,
  title: `
    mx-auto mt-5 max-w-2xl text-4xl font-medium tracking-tight
    sm:text-5xl
  `,
  ctaRow: `
    mt-10 flex flex-wrap items-center justify-center gap-3
  `,
  primaryCta: `
    inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
  outlineCta: `
    inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-medium
    text-white transition-colors hover:border-white
  `,
  tertiaryCta: `
    inline-flex items-center gap-2 px-3 py-3 text-sm font-medium text-white/70 transition-colors
    hover:text-white
  `,
};
