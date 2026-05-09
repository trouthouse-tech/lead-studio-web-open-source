import type { AppThunk } from '@/store';
import { getLeadAiExchangeCostsForLead } from '@/api/leads';
import { getLeadCostsByLeadId } from '@/api/lead-costs';
import type { LeadAiExchangeCostRow } from '@/model';
import type { LeadCost } from '@/model/lead-cost';

export type FetchLeadCostsForLeadSuccess = {
  status: 200;
  aiRows: LeadAiExchangeCostRow[];
  ledgerRows: LeadCost[];
};

type ResponseType = Promise<FetchLeadCostsForLeadSuccess | 500>;

/**
 * Loads AI exchange cost rows and manual ledger rows for a lead (parallel GETs).
 * Mirrors prior hook behavior: empty arrays when an endpoint does not return data.
 */
export const fetchLeadCostsForLeadThunk = (leadId: string): AppThunk<ResponseType> => {
  return async (): ResponseType => {
    try {
      const [aiRes, ledgerRes] = await Promise.all([
        getLeadAiExchangeCostsForLead(leadId),
        getLeadCostsByLeadId(leadId),
      ]);

      const aiRows = aiRes.success && aiRes.data ? aiRes.data : [];
      const ledgerRows =
        ledgerRes.success && ledgerRes.data ? ledgerRes.data : [];

      return { status: 200, aiRows, ledgerRows };
    } catch (error: unknown) {
      console.error('❌ fetchLeadCostsForLeadThunk error:', error);
      return 500;
    }
  };
};
