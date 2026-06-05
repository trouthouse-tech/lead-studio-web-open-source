import { LANDING_CONTENT } from '../content';

/**
 * Landing how-it-works four-step grid.
 */
export const HowItWorks = () => {
  const c = LANDING_CONTENT.howItWorks;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
        <h2 className={styles.title}>{c.title}</h2>
        <div className={styles.grid}>
          {c.steps.map((step, index) => (
            <div key={step.title} className={styles.cell}>
              <span className={`mono-label ${styles.stepNum}`}>
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className={styles.stepTitle}>{step.title}</div>
              <p className={styles.stepBody}>{step.body}</p>
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
  grid: `
    mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border
    md:grid-cols-4
  `,
  cell: `
    bg-background p-8
  `,
  stepNum: `
    text-primary
  `,
  stepTitle: `
    mt-4 text-lg font-medium
  `,
  stepBody: `
    mt-2 text-sm text-muted-foreground
  `,
};
