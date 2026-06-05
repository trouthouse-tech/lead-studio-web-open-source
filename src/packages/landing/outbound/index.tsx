import { LANDING_CONTENT } from '../content';

/**
 * Landing section 03 — Outbound feature cards.
 */
export const Outbound = () => {
  const c = LANDING_CONTENT.outbound;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
        <h2 className={styles.title}>{c.title}</h2>
        <div className={styles.cards}>
          {c.cards.map((card) => (
            <div key={card.tag} className={styles.card}>
              <span className={`mono-label ${styles.cardTag}`}>{card.tag}</span>
              <h3 className={styles.cardTitle}>{card.title}</h3>
              <p className={styles.cardBody}>{card.body}</p>
            </div>
          ))}
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
  kicker: `
    text-primary
  `,
  title: `
    mt-4 max-w-2xl text-4xl font-medium tracking-tight
    sm:text-5xl
  `,
  cards: `
    mt-12 grid gap-6
    md:grid-cols-3
  `,
  card: `
    rounded-xl border border-border bg-card p-8 transition-colors
    hover:border-foreground/40
  `,
  cardTag: `
    text-muted-foreground
  `,
  cardTitle: `
    mt-6 text-xl font-medium
  `,
  cardBody: `
    mt-3 text-sm leading-relaxed text-muted-foreground
  `,
};
