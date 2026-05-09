export type PostLeadAutoCategorizeResponseBody = {
  success?: boolean;
  error?: string;
  leadId?: string;
  categoryName?: string;
  matchedExisting?: boolean;
  matchedCategoryId?: string | null;
  confidence?: number;
  reason?: string;
};
