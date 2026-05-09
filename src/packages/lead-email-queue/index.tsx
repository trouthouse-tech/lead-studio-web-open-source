'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  getAllLeadContactEmailQueueThunk,
  getAllLeadContactsThunk,
  getAllLeadsThunk,
} from '@/store/thunks';
import { LeadContactEmailQueueList } from './LeadContactEmailQueueList';

/**
 * Outbound email queue: scheduled sends, status, and queue actions.
 */
export const LeadEmailQueuePage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    void dispatch(getAllLeadContactEmailQueueThunk());
    void dispatch(getAllLeadsThunk());
    void dispatch(getAllLeadContactsThunk());
  }, [dispatch]);

  return (
    <div className={styles.root}>
      <LeadContactEmailQueueList />
    </div>
  );
};

const styles = {
  root: `
    w-full
  `,
};
