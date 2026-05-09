import type { PersistedLeadsFilters } from '@/utils/leads';

export type SavedFilter = {
  id: string;
  user_id: string;
  name: string;
  filters: PersistedLeadsFilters;
  created_at: string;
  updated_at: string;
};
