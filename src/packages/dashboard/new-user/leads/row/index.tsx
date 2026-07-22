'use client';

import type { Lead } from '@/model';

type Props = {
  lead: Lead;
};

/**
 * One lead row in the onboarding preview table.
 */
export const OnboardingLeadRow = (props: Props) => {
  const { lead } = props;
  const website = lead.website?.trim() || null;

  return (
    <tr className={styles.tr}>
      <td className={styles.tdPrimary}>{lead.business_name}</td>
      <td className={styles.tdMuted}>{lead.address ?? '—'}</td>
      <td className={styles.tdMuted}>
        {website ? (
          <a
            href={website.startsWith('http') ? website : `https://${website}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            {website.replace(/^https?:\/\//i, '')}
          </a>
        ) : (
          '—'
        )}
      </td>
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
    px-4 py-2.5 text-sm text-slate-600 max-w-[18rem] truncate
  `,
  link: `
    text-slate-900 underline underline-offset-2 hover:text-slate-700
  `,
};
