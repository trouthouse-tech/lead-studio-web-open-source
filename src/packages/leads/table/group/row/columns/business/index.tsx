'use client';

import type { Lead } from '@/model';
import { leadsTableRowColumnStyles as styles } from '../styles';

type LeadsTableRowBusinessColumnProps = {
  lead: Lead;
};

export const LeadsTableRowBusinessColumn = (
  props: LeadsTableRowBusinessColumnProps
) => {
  const { lead } = props;

  const handleWebsiteClick = (e: React.MouseEvent, website: string) => {
    e.stopPropagation();
    const url = website.startsWith('http') ? website : `https://${website}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <td className={styles.clickableCell}>
      <div className={styles.businessName}>
        {lead.business_name || 'Unnamed Business'}
      </div>
      {lead.website && (
        <button
          type="button"
          onClick={(e) => handleWebsiteClick(e, lead.website!)}
          className={styles.websiteLink}
        >
          {lead.website}
        </button>
      )}
    </td>
  );
};
