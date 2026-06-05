import { Check } from 'lucide-react';
import { LANDING_CONTENT } from '../content';

/**
 * Landing section 01 — Discover.
 */
export const Discover = () => {
  const c = LANDING_CONTENT.discover;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
            <h2 className={styles.title}>{c.title}</h2>
            <p className={styles.body}>{c.body}</p>
          </div>
          <div className={styles.card}>
            <ul className={styles.list}>
              {c.bullets.map((bullet) => (
                <li key={bullet} className={styles.listItem}>
                  <span className={styles.checkWrap}>
                    <Check className={styles.checkIcon} strokeWidth={3} />
                  </span>
                  <span className={styles.bulletText}>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
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
  grid: `
    grid gap-12
    lg:grid-cols-2 lg:gap-20
  `,
  kicker: `
    text-primary
  `,
  title: `
    mt-4 text-4xl font-medium tracking-tight
    sm:text-5xl
  `,
  body: `
    mt-5 max-w-md text-muted-foreground
  `,
  card: `
    rounded-xl border border-border bg-card p-8 transition-colors
    hover:border-foreground/40
  `,
  list: `
    space-y-4
  `,
  listItem: `
    flex items-start gap-3
  `,
  checkWrap: `
    mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-orange-tint
  `,
  checkIcon: `
    h-3 w-3 text-primary
  `,
  bulletText: `
    text-sm
  `,
};
