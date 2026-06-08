'use client';

import Link from 'next/link';
import { LEAD_EMAIL_QUEUE_PATH, LEAD_SENT_EMAILS_PATH } from '@/config/routes';
import { LeadContactEmailQueueList } from '@/packages/lead-email-queue/LeadContactEmailQueueList';
import { LeadSentEmailsList } from '@/packages/lead-sent-emails/LeadSentEmailsList';

/**
 * Dashboard: outbound queue and sent history stacked vertically.
 */
export const DashboardEmailOverview = () => {
  return (
    <div className={styles.root}>
      <section className={styles.section} aria-labelledby="dash-email-queue-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="dash-email-queue-heading" className={styles.title}>
              Email queue
            </h2>
            <p className={styles.sub}>Scheduled and in-flight outbound messages.</p>
          </div>
          <Link href={LEAD_EMAIL_QUEUE_PATH} className={styles.link}>
            Open queue page
          </Link>
        </div>
        <div className={styles.scroll}>
          <LeadContactEmailQueueList />
        </div>
      </section>

      <section className={styles.section} aria-labelledby="dash-sent-emails-heading">
        <div className={styles.sectionHeader}>
          <div>
            <h2 id="dash-sent-emails-heading" className={styles.title}>
              Sent emails
            </h2>
            <p className={styles.sub}>Recent delivery history (same filters as the full page when set).</p>
          </div>
          <Link href={LEAD_SENT_EMAILS_PATH} className={styles.link}>
            Open sent page
          </Link>
        </div>
        <div className={styles.scroll}>
          <LeadSentEmailsList />
        </div>
      </section>
    </div>
  );
};

const styles = {
  root: `
    flex flex-col gap-8 w-full min-w-0
  `,
  section: `
    min-w-0 flex flex-col w-full
  `,
  sectionHeader: `
    flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4 shrink-0 pb-3 mb-3
  `,
  title: `
    text-sm font-semibold text-slate-900
  `,
  sub: `
    text-xs text-slate-500 mt-0.5 max-w-prose
  `,
  link: `
    text-xs font-medium text-orange-600 hover:text-orange-700 hover:underline shrink-0
  `,
  scroll: `
    min-h-0 flex-1 overflow-auto max-h-[min(55vh,480px)]
  `,
};
