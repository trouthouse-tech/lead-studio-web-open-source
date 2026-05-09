import type { LeadCategory } from '@/model';

export type PostLeadAutoCategorizeBatchCategoryPayload = Pick<
  LeadCategory,
  'id' | 'name' | 'normalized_name'
>;

export type PostLeadAutoCategorizeBatchLeadPayload = {
  id: string;
  business_name: string;
  description: string | null;
  website: string | null;
  address: string | null;
  summary: unknown | null;
};

export type PostLeadAutoCategorizeBatchAssignment = {
  leadId: string;
  categoryId: string | null;
};

export type PostLeadAutoCategorizeBatchResponseBody = {
  success?: boolean;
  error?: string;
  requestId?: string;
  assignments?: PostLeadAutoCategorizeBatchAssignment[];
};
