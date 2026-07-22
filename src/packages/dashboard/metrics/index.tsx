'use client';

import { TotalLeads } from './total-leads';
import { SentEmails } from './sent-emails';
import { UniqueOpens } from './unique-opens';
import { QueuedCalls } from './queued-calls';

/**
 * Four engagement KPI tiles for the dashboard.
 */
export const DashboardMetrics = () => {
  return (
    <div className={styles.grid}>
      <TotalLeads />
      <SentEmails />
      <UniqueOpens />
      <QueuedCalls />
    </div>
  );
};

const styles = {
  grid: `
    grid gap-3 grid-cols-2 lg:grid-cols-4
  `,
} as const;
