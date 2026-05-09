'use client';

type RecentLeadsListRowBusinessProps = {
  leadName: string;
  leadSummary: string;
};

export const RecentLeadsListRowBusiness = (
  props: RecentLeadsListRowBusinessProps
) => {
  const { leadName, leadSummary } = props;

  return (
    <div className={styles.wrap}>
      <h3 className={styles.leadName}>{leadName}</h3>
      <p className={styles.summary}>{leadSummary}</p>
    </div>
  );
};

const styles = {
  wrap: `
    min-w-0 space-y-0
  `,
  leadName: `
    truncate text-sm font-semibold text-slate-900
  `,
  summary: `
    mt-2 line-clamp-2 text-xs leading-relaxed text-slate-500
  `,
};
