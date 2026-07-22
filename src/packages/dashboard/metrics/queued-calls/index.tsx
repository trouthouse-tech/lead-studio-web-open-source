'use client';

import { useMemo } from 'react';
import { Phone } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';
import { dashboardPanelRoot } from '@/packages/dashboard/dashboardPanelRoot';

/**
 * Dashboard KPI: call log entries still queued.
 */
export const QueuedCalls = () => {
  const toCallLogs = useAppSelector((state) => state.toCallLogs);

  const count = useMemo(
    () =>
      Object.values(toCallLogs).filter((entry) => entry.call_status === 'queued')
        .length,
    [toCallLogs]
  );

  return (
    <div className={dashboardPanelRoot}>
      <div className={styles.content}>
        <div className={styles.labelRow}>
          <p className={styles.label}>Queued Calls</p>
          <Phone className={styles.icon} aria-hidden />
        </div>
        <p className={styles.value}>{count.toLocaleString()}</p>
        <p className={styles.sub}>Ready to dial</p>
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
