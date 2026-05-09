'use client';

import type { Lead } from '@/model';

type Props = {
  lead: Lead;
};

export const OnboardingLeadRow = (props: Props) => {
  const { lead } = props;
  const rating =
    lead.quality_score != null ? String(lead.quality_score) : null;

  return (
    <tr className={styles.tr}>
      <td className={styles.tdPrimary}>{lead.business_name}</td>
      <td className={styles.tdMuted}>{lead.address ?? '—'}</td>
      <td className={styles.tdMuted}>{rating ?? '—'}</td>
    </tr>
  );
};

const styles = {
  tr: `
    border-t border-slate-200
  `,
  tdPrimary: `
    px-4 py-2.5 text-sm font-medium text-slate-900
  `,
  tdMuted: `
    px-4 py-2.5 text-sm text-slate-600
  `,
};
