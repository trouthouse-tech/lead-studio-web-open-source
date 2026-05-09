'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { getAllLeadsThunk } from '@/store/thunks/leads/getAllLeadsThunk';
import { loadSavedFiltersThunk } from '@/store/thunks/saved-filters';
import { LeadsFilters } from './filters';
import { LeadsTable } from './table';
import { CreateLeadModal } from './create';

export const Leads = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllLeadsThunk());
    dispatch(loadSavedFiltersThunk());
  }, [dispatch]);

  return (
    <div className={styles.pageContainer}>
      <LeadsFilters />
      <LeadsTable />
      <CreateLeadModal />
    </div>
  );
};

const styles = {
  pageContainer: `w-full`,
};
