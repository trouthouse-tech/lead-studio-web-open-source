'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchLeadCostsForLeadThunk,
  postLeadCostThunk,
} from '@/store/thunks/lead-costs';
import type {
  LeadAiExchangeCostRow,
  LeadCostLine,
  LeadCostType,
  LlmModel,
} from '@/model';
import type { LeadCost } from '@/model/lead-cost';
import type { PostLeadCostBody } from '@/api/lead-costs';

export type LeadAiCostDisplayRow = {
  id: string;
  label: string;
  created_at: string;
  cost_cents: number;
  input_tokens: number;
  output_tokens: number;
  model_used: string;
  input_cost_per_million_usd: number | null;
  output_cost_per_million_usd: number | null;
};

export type CostsForCurrentLead = {
  leadId: string;
  costs: LeadCostLine[];
  isLoading: boolean;
  isSaving: boolean;
  refresh: () => Promise<void>;
  createManualCost: (body: Omit<PostLeadCostBody, 'lead_id'>) => Promise<boolean>;
};

const computeCostCents = (
  inputTokens: number,
  outputTokens: number,
  modelUsed: string,
  llmModels: Record<string, LlmModel>,
): number => {
  const pricing = modelUsed ? llmModels[modelUsed] : undefined;
  if (!pricing) return 0;
  const usd =
    (inputTokens / 1_000_000) * Number(pricing.input_cost_per_million_usd) +
    (outputTokens / 1_000_000) * Number(pricing.output_cost_per_million_usd);
  return usd * 100;
};

const isLeadCostType = (value: string): value is LeadCostType => {
  return (
    value === 'discovery' ||
    value === 'website_scrape' ||
    value === 'ai_summary' ||
    value === 'ai_email' ||
    value === 'ai_contact_extraction' ||
    value === 'design_tool' ||
    value === 'other'
  );
};

const mapLedgerToLine = (row: LeadCost): LeadCostLine => {
  const ledgerType: LeadCostType = isLeadCostType(row.type) ? row.type : 'other';
  const description = row.description?.trim() || '(No description)';
  const entrySource = row.entry_source === 'ai' ? 'ai' : 'user';
  return {
    kind: 'ledger',
    id: `ledger:${row.id}`,
    label: description,
    created_at: row.created_at,
    cost_cents: row.cost_cents,
    entry_source: entrySource,
    ledger_type: ledgerType,
    description,
  };
};

/**
 * Loads merged AI + manual lead costs for `currentLead` from Redux (no React context).
 */
export const useCostsForCurrentLead = (): CostsForCurrentLead => {
  const dispatch = useAppDispatch();
  const leadId = useAppSelector((state) => state.currentLead.id);
  const llmModels = useAppSelector((state) => state.llmModels);

  const [aiRows, setAiRows] = useState<LeadAiExchangeCostRow[]>([]);
  const [ledgerRows, setLedgerRows] = useState<LeadCost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const refresh = useCallback(async () => {
    if (!leadId) {
      setAiRows([]);
      setLedgerRows([]);
      return;
    }
    setIsLoading(true);
    const result = await dispatch(fetchLeadCostsForLeadThunk(leadId));
    setIsLoading(false);
    if (result === 500) {
      setAiRows([]);
      setLedgerRows([]);
      return;
    }
    setAiRows(result.aiRows);
    setLedgerRows(result.ledgerRows);
  }, [dispatch, leadId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createManualCost = useCallback(
    async (body: Omit<PostLeadCostBody, 'lead_id'>): Promise<boolean> => {
      if (!leadId) return false;
      setIsSaving(true);
      const status = await dispatch(
        postLeadCostThunk({
          lead_id: leadId,
          type: body.type,
          description: body.description,
          cost_cents: body.cost_cents,
        }),
      );
      setIsSaving(false);
      if (status !== 200) {
        return false;
      }
      await refresh();
      return true;
    },
    [dispatch, leadId, refresh],
  );

  const costs = useMemo((): LeadCostLine[] => {
    const aiLines: LeadCostLine[] = aiRows.map((r) => {
      const costCents = computeCostCents(
        r.input_tokens,
        r.output_tokens,
        r.model_used,
        llmModels,
      );
      return {
        kind: 'ai_exchange',
        id: `ai:${r.id}`,
        label: r.label,
        created_at: r.created_at,
        cost_cents: costCents,
        input_tokens: r.input_tokens,
        output_tokens: r.output_tokens,
        model_used: r.model_used,
        input_cost_per_million_usd: llmModels[r.model_used]
          ? Number(llmModels[r.model_used].input_cost_per_million_usd)
          : null,
        output_cost_per_million_usd: llmModels[r.model_used]
          ? Number(llmModels[r.model_used].output_cost_per_million_usd)
          : null,
      };
    });

    const ledgerLines = ledgerRows.map(mapLedgerToLine);
    const merged = [...aiLines, ...ledgerLines];
    merged.sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    return merged;
  }, [aiRows, ledgerRows, llmModels]);

  return useMemo(
    (): CostsForCurrentLead => ({
      leadId,
      costs,
      isLoading,
      isSaving,
      refresh,
      createManualCost,
    }),
    [leadId, costs, isLoading, isSaving, refresh, createManualCost],
  );
};
