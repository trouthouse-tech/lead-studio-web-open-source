'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  getAllLeadContactsThunk,
  getAllLeadSentEmailsThunk,
  getAllLeadsThunk,
} from '@/store/thunks';
import { LeadSentEmailsFilters } from './LeadSentEmailsFilters';
import { LeadSentEmailsList } from './LeadSentEmailsList';

export { LeadSentEmailRow } from './LeadSentEmailRow';

/**
 * Sent outbound emails: filters and history table.
 */
export const LeadSentEmailsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(getAllLeadSentEmailsThunk());
    void dispatch(getAllLeadsThunk());
    void dispatch(getAllLeadContactsThunk());
  }, [dispatch]);

  return (
    <div className={styles.pageContainer}>
      <LeadSentEmailsFilters />
      <LeadSentEmailsList />
    </div>
  );
};

const styles = {
  pageContainer: `
    w-full space-y-3
  `,
};
