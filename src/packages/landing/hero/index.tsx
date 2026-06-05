import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import {
  DASHBOARD_PATH,
  GITHUB_WEB_REPO_URL,
} from '@/config/landing-links';
import { LANDING_CONTENT } from '../content';

/**
 * Landing hero with CTAs, stats bar, and dashboard mock.
 */
export const Hero = () => {
  const c = LANDING_CONTENT;
  const mock = c.dashboardMock;

  return (
    <section className={styles.section}>
      <div className={`hero-grid-bg ${styles.gridBg}`} aria-hidden />
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <span className={`mono-label ${styles.kicker}`}>{c.hero.kicker}</span>
            <h1 className={styles.title}>
              {c.hero.titleLines.map((line) => (
                <span key={line} className={styles.titleLine}>
                  {line}
                </span>
              ))}
            </h1>
            <p className={styles.subhead}>{c.hero.subhead}</p>
            <div className={styles.ctaRow}>
              <Link href={DASHBOARD_PATH} className={styles.primaryCta}>
                {c.hero.primaryCta}
                <ArrowRight className={`cta-arrow h-4 w-4`} />
              </Link>
              <a
                href={GITHUB_WEB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.outlineCta}
              >
                <Github className="h-4 w-4" />
                {c.hero.secondaryCta}
              </a>
            </div>
            <div className={styles.stats}>
              {c.hero.stats.map((stat) => (
                <div key={stat.label}>
                  <div className={styles.statLabel}>{stat.label}</div>
                  <div className={styles.statValue}>{stat.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.mockWrap}>
            <div className={styles.mockCard}>
              <div className={styles.mockTopBar}>
                <div className={styles.mockDots}>
                  <span className={styles.mockDot} />
                  <span className={styles.mockDot} />
                  <span className={styles.mockDot} />
                </div>
                <span className={`mono-label ${styles.mockTitle}`}>{mock.title}</span>
                <span className={styles.mockBadge}>
                  <span className={styles.mockBadgeDot} />
                  {mock.queuedLabel}
                </span>
              </div>
              <div className={styles.mockChips}>
                {mock.chips.map((chip, i) => (
                  <span key={chip} className={i === 0 ? styles.mockChipActive : styles.mockChip}>
                    {chip}
                  </span>
                ))}
              </div>
              <div className={styles.mockGroupHeader}>
                <span className={`mono-label ${styles.mockGroupLabel}`}>{mock.groupLabel}</span>
              </div>
              <div className={styles.mockRows}>
                {mock.rows.map((row) => (
                  <div key={row.name} className={styles.mockRow}>
                    <div className={styles.mockRowLeft}>
                      <span className={styles.mockRowDot} />
                      <span className={styles.mockRowName}>{row.name}</span>
                      <span className={styles.mockRowCategory}>· {row.category}</span>
                    </div>
                    <span className={`mono-label ${styles.mockRowStatus}`}>{row.status}</span>
                  </div>
                ))}
              </div>
              <div className={styles.mockFooter}>
                <span>{mock.footerLeft}</span>
                <span className={styles.mockFooterLink}>{mock.footerRight}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const styles = {
  section: `
    relative overflow-hidden pt-32 pb-20
    sm:pt-40 sm:pb-28
  `,
  gridBg: `
    absolute inset-0 -z-10
  `,
  inner: `
    mx-auto max-w-6xl px-6
  `,
  grid: `
    grid items-center gap-16
    lg:grid-cols-[1.05fr_1fr]
  `,
  kicker: `
    text-primary
  `,
  title: `
    mt-6 text-5xl font-medium leading-[1.05] tracking-tight
    sm:text-6xl
  `,
  titleLine: `
    block
  `,
  subhead: `
    mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground
  `,
  ctaRow: `
    mt-8 flex flex-wrap items-center gap-3
  `,
  primaryCta: `
    inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium
    text-primary-foreground transition-colors hover:bg-primary-hover
  `,
  outlineCta: `
    inline-flex items-center gap-2 rounded-md border border-border px-5 py-3 text-sm font-medium
    text-foreground transition-colors hover:border-foreground
  `,
  stats: `
    mt-12 grid grid-cols-3 gap-6 border-t border-border pt-6
  `,
  statLabel: `
    text-sm font-medium
  `,
  statValue: `
    mt-1 text-xs text-muted-foreground
  `,
  mockWrap: `
    relative
  `,
  mockCard: `
    rounded-xl border border-border bg-card shadow-sm
  `,
  mockTopBar: `
    flex items-center justify-between border-b border-border px-5 py-3
  `,
  mockDots: `
    flex items-center gap-2
  `,
  mockDot: `
    h-2.5 w-2.5 rounded-full bg-border
  `,
  mockTitle: `
    text-muted-foreground
  `,
  mockBadge: `
    inline-flex items-center gap-1.5 rounded-md bg-orange-tint px-2 py-1 text-xs font-medium text-primary
  `,
  mockBadgeDot: `
    h-1.5 w-1.5 rounded-full bg-primary
  `,
  mockChips: `
    flex flex-wrap gap-2 border-b border-border px-5 py-3
  `,
  mockChipActive: `
    rounded-md border border-foreground bg-foreground px-2.5 py-1 text-xs text-background
  `,
  mockChip: `
    rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground
  `,
  mockGroupHeader: `
    border-b border-border bg-secondary/60 px-5 py-2
  `,
  mockGroupLabel: `
    text-muted-foreground
  `,
  mockRows: `
    divide-y divide-border
  `,
  mockRow: `
    flex items-center justify-between px-5 py-3 text-sm
  `,
  mockRowLeft: `
    flex items-center gap-3
  `,
  mockRowDot: `
    h-1.5 w-1.5 rounded-full bg-primary
  `,
  mockRowName: `
    font-medium
  `,
  mockRowCategory: `
    text-muted-foreground
  `,
  mockRowStatus: `
    text-muted-foreground
  `,
  mockFooter: `
    flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground
  `,
  mockFooterLink: `
    text-primary
  `,
};
