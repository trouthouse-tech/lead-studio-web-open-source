'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateLeadThunk } from '@/store/thunks/leads';

const SCORE_OPTIONS = [
  { value: '', label: 'Score —' },
  ...Array.from({ length: 10 }, (_, i) => {
    const score = (i + 1) * 10;
    return { value: score.toString(), label: `Score ${score}` };
  }),
];

export const ScoreInput = () => {
  const dispatch = useAppDispatch();
  const currentLead = useAppSelector((state) => state.currentLead);

  const value = currentLead.quality_score;
  const selectValue = value === undefined || value === null ? '' : value.toString();

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextScore =
      e.target.value === '' ? undefined : parseInt(e.target.value, 10);
    const current = value === undefined || value === null ? undefined : value;
    if (nextScore === current) return;
    await dispatch(updateLeadThunk(currentLead.id, { quality_score: nextScore }));
  };

  return (
    <select
      value={selectValue}
      onChange={(e) => {
        void handleChange(e);
      }}
      className={styles.select}
      title="Update quality score"
      aria-label="Lead quality score"
    >
      {SCORE_OPTIONS.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

const styles = {
  select: `
    h-7 rounded border border-gray-300 bg-white px-2 text-[11px] font-medium text-gray-800
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
    hover:border-gray-400 transition-colors
  `,
};
