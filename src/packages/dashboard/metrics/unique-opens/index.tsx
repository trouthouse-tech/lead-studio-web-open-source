'use client';

import { useMemo } from 'react';
import { MailOpen } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import type { LeadSentEmail } from '@/model/lead-sent-email';
import { dashboardPanelRoot } from '@/packages/dashboard/dashboardPanelRoot';

/**
 * Dashboard KPI: unique contacts who opened at least one email.
 * Matches UniqueOpensStatCard (delivery_status === 'opened', unique by lead_contact_id).
 */
export const UniqueOpens = () => {
  const leadSentEmails = useAppSelector((state) => state.leadSentEmails);

  const count = useMemo(() => {
    const allEmails = Object.values(leadSentEmails) as LeadSentEmail[];
    const opened = allEmails.filter((e) => e.delivery_status === 'opened');
    const seenContacts = new Set<string>();
    return opened.filter((e) => {
      if (seenContacts.has(e.lead_contact_id)) return false;
      seenContacts.add(e.lead_contact_id);
      return true;
    }).length;
  }, [leadSentEmails]);

  return (
    <div className={dashboardPanelRoot}>
      <div className={styles.content}>
        <div className={styles.labelRow}>
          <p className={styles.label}>Unique Opens</p>
          <MailOpen className={styles.icon} aria-hidden />
        </div>
        <p className={styles.value}>{count.toLocaleString()}</p>
        <p className={styles.sub}>Contacts who opened</p>
      </div>
    </div>
  );
};

const styles = {
  content: `p-4`,
  labelRow: `flex items-center justify-between mb-2`,
  label: `text-xs font-medium text-slate-500 uppercase tracking-wider`,
  icon: `h-4 w-4 text-slate-400`,
  value: `text-2xl font-bold text-slate-900`,
  sub: `text-xs text-slate-500 mt-1`,
} as const;
