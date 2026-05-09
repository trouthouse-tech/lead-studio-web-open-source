export const getQualityScoreColor = (score: number | undefined | null): string => {
  if (score === undefined || score === null) return 'text-gray-400';
  if (score >= 80) return 'text-green-600 font-semibold';
  if (score >= 60) return 'text-yellow-600 font-semibold';
  return 'text-red-600 font-semibold';
};

export const qualityScoreOptions = [
  { value: '', label: '—' },
  ...Array.from({ length: 10 }, (_, i) => {
    const score = (i + 1) * 10;
    return { value: score.toString(), label: score.toString() };
  }),
];
