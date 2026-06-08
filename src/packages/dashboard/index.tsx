'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { AppLayout } from '@/components';
import { initializeDashboardOnboardingThunk } from '@/store/thunks/dashboard';
import {
  getAllLeadContactEmailQueueThunk,
  getAllLeadContactsThunk,
  getAllLeadSentEmailsThunk,
  getAllLeadsThunk,
  getAllToCallLogThunk,
} from '@/store/thunks';
import { NewUser } from './new-user';
import { DashboardQueuedCallLogPanel } from './queued-call-log-panel';
import { DashboardLatestLeadsGrid } from './latest-leads-grid';
import { DashboardEmailOverview } from './email-overview';

export const Dashboard = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(initializeDashboardOnboardingThunk());
    void dispatch(getAllLeadsThunk());
    void dispatch(getAllLeadContactsThunk());
    void dispatch(getAllToCallLogThunk());
    void dispatch(getAllLeadContactEmailQueueThunk());
    void dispatch(getAllLeadSentEmailsThunk());
  }, [dispatch]);

  return (
    <>
      <AppLayout fullWidth={true}>
        <div className={styles.page}>
          <NewUser />

          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>Dashboard</h1>
              <p className={styles.subtitle}>Pipeline snapshot, call queue, and outbound email.</p>
            </div>
          </header>

          <div className={styles.sections}>
            <DashboardLatestLeadsGrid />
            <DashboardQueuedCallLogPanel />
            <DashboardEmailOverview />
          </div>
        </div>
      </AppLayout>
    </>
  );
};

const styles = {
  page: `
    w-full py-6 px-4 md:px-6 lg:px-8 space-y-8
  `,
  header: `
    flex items-start justify-between gap-4
  `,
  sections: `
    flex flex-col gap-8 w-full min-w-0
  `,
  title: `
    text-2xl font-semibold text-slate-900
  `,
  subtitle: `
    text-sm text-slate-500 mt-1 max-w-2xl
  `,
};
