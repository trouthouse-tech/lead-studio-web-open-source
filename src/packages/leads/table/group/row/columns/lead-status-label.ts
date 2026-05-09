import type { Lead } from '@/model';

export const getLeadStatusLabel = (status: Lead['status']): string =>
  status
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
