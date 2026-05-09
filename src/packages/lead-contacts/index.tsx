'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getAllLeadContactsThunk } from '@/store/thunks/lead-contacts';
import { LeadContactsFilters } from './filters';
import { LeadContactsTable } from './table';

export const LeadContactsPage = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllLeadContactsThunk());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <LeadContactsFilters />
      <LeadContactsTable />
    </div>
  );
};

const styles = {
  container: `
    w-full space-y-3
  `,
};
