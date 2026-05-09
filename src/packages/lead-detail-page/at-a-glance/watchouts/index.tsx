'use client';

import { useAppSelector } from '@/store/hooks';

export const WatchoutsSection = () => {
  const concerns = useAppSelector(
    (state) => state.currentLead.summary?.concerns?.filter((c) => c?.trim()) ?? [],
  );

  if (concerns.length === 0) {
    return null;
  }

  return (
    <div>
      <p className={styles.miniLabel}>Watchouts</p>
      <ul className={styles.bulletList}>
        {concerns.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  miniLabel: `text-xs font-medium text-gray-500 mb-1.5`,
  bulletList: `list-disc list-inside space-y-1 text-sm text-gray-700`,
};
