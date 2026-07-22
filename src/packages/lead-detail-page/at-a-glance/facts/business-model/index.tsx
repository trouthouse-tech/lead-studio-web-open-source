'use client';

import { useAppSelector } from '@/store/hooks';

const LABEL = 'Business model';

export const BusinessModelFact = () => {
  const currentLead = useAppSelector((s) => s.currentLead);
  const raw = currentLead.summary?.facts?.business_model;
  const value = typeof raw === 'string' ? raw.trim() : '';
  if (!value) return null;

  return (
    <div className={styles.factRow}>
      <dt className={styles.factLabel}>{LABEL}</dt>
      <dd className={styles.factValue}>{value}</dd>
    </div>
  );
};

const styles = {
  factRow: `grid grid-cols-1 sm:grid-cols-[minmax(0,11rem)_1fr] gap-x-3 gap-y-0.5 text-sm`,
  factLabel: `text-gray-500 shrink-0`,
  factValue: `text-gray-900 min-w-0`,
};
