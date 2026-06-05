import { LANDING_CONTENT } from '../content';

/**
 * Landing section 02 — Pipeline with grouped-table mock.
 */
export const Pipeline = () => {
  const c = LANDING_CONTENT.pipeline;

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div>
            <span className={`mono-label ${styles.kicker}`}>{c.kicker}</span>
            <h2 className={styles.title}>{c.title}</h2>
            <p className={styles.body}>{c.body}</p>
          </div>
          <div className={styles.tableCard}>
            {c.groups.map((group) => (
              <div key={group.name} className={styles.group}>
                <div className={styles.groupHeader}>
                  <span className={`mono-label ${styles.groupLabel}`}>
                    {group.name} ({group.count})
                  </span>
                  <span className={styles.chevron}>▾</span>
                </div>
                <div className={styles.groupRows}>
                  {group.rows.map((row) => (
                    <div key={row} className={styles.row}>
                      <div className={styles.rowLeft}>
                        <input type="checkbox" readOnly className={styles.checkbox} />
                        <span className={styles.rowName}>{row}</span>
                      </div>
                      <span className={`mono-label ${styles.rowStatus}`}>New</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
  tableCard: `
    rounded-xl border border-border bg-card p-2
  `,
  group: `
    overflow-hidden rounded-md
  `,
  groupHeader: `
    flex items-center justify-between bg-secondary/60 px-4 py-2
  `,
  groupLabel: `
    text-muted-foreground
  `,
  chevron: `
    text-xs text-muted-foreground
  `,
  groupRows: `
    divide-y divide-border
  `,
  row: `
    flex items-center justify-between px-4 py-3 text-sm
  `,
  rowLeft: `
    flex items-center gap-3
  `,
  checkbox: `
    h-3.5 w-3.5 accent-primary
  `,
  rowName: `
    font-medium
  `,
  rowStatus: `
    text-muted-foreground
  `,
};
