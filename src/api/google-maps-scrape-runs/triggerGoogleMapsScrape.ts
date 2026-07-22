import { API_CONFIG } from '@/config/api';
import { requestApi } from '../_shared';
import type { GoogleMapsScrapeNameDuplicate, GoogleMapsScrapeRun } from '@/model';

const toModel = (row: Record<string, unknown>): GoogleMapsScrapeRun => ({
  id: row.id as string,
  name: row.name as string,
  searchQuery: row.search_query as string,
  status: row.status as GoogleMapsScrapeRun['status'],
  resultsCount: row.results_count as number,
  businessesImported: row.businesses_imported as number,
  maxResults: (row.max_results as number | null) ?? undefined,
  createdAt: new Date(row.created_at as string),
  completedAt: row.completed_at
    ? new Date(row.completed_at as string)
    : undefined,
  error: (row.error as string | null) ?? undefined,
  duration: (row.duration as number | null) ?? undefined,
});

type TriggerPayload = {
  scrapeRun: Record<string, unknown>;
  businessesScraped?: number;
  leadsCreated?: number;
  leadsSkippedDuplicateName?: number;
  nameDuplicates?: unknown;
  durationMs?: number;
};

export type TriggerGoogleMapsScrapeResponse = {
  scrapeRun: GoogleMapsScrapeRun;
  businessesScraped: number;
  leadsCreated: number;
  leadsSkippedDuplicateName: number;
  nameDuplicates: GoogleMapsScrapeNameDuplicate[];
  durationMs: number;
};

export type TriggerGoogleMapsScrapeResult =
  | { success: true; data: TriggerGoogleMapsScrapeResponse }
  | { success: false; error: string; scrapeRun?: GoogleMapsScrapeRun };

/**
 * Trigger Places scrape for an existing scrape-run id.
 * Server: `{ success, data: { scrapeRun, businessesScraped, ... } }`.
 */
export const triggerGoogleMapsScrape = async (
  scrapeRunId: string
): Promise<TriggerGoogleMapsScrapeResult> => {
  console.log('📥 [web.triggerGoogleMapsScrape] POST trigger', { scrapeRunId });

  const result = await requestApi<TriggerPayload>(
    `${API_CONFIG.SERVER_URL}/api/data/google-maps-scrape-runs/trigger`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scrape_run_id: scrapeRunId }),
    },
  );

  console.log('📤 [web.triggerGoogleMapsScrape] raw ApiResult', {
    scrapeRunId,
    success: result.success,
    httpStatus: result.httpStatus,
    error: result.error,
    dataKeys: result.data ? Object.keys(result.data) : [],
    dataBusinessesScraped: result.data?.businessesScraped,
    dataLeadsCreated: result.data?.leadsCreated,
    dataHasScrapeRun: !!result.data?.scrapeRun,
    scrapeRunIdFromData:
      result.data?.scrapeRun && typeof result.data.scrapeRun === 'object'
        ? (result.data.scrapeRun as { id?: string }).id
        : undefined,
  });

  // 422 failure body puts scrapeRun on the root (not under data).
  const rootScrapeRun = (result as { scrapeRun?: Record<string, unknown> }).scrapeRun;

  if (!result.success || result.httpStatus >= 400) {
    const row = rootScrapeRun ?? result.data?.scrapeRun;
    console.warn('⚠️ [web.triggerGoogleMapsScrape] treating as failure', {
      scrapeRunId,
      httpStatus: result.httpStatus,
      error: result.error,
      hasRootScrapeRun: !!rootScrapeRun,
      hasDataScrapeRun: !!result.data?.scrapeRun,
    });
    return {
      success: false,
      error: result.error || `HTTP ${result.httpStatus}`,
      scrapeRun: row ? toModel(row) : undefined,
    };
  }

  const payload = result.data;
  if (!payload?.scrapeRun) {
    console.error('❌ [web.triggerGoogleMapsScrape] missing scrapeRun on data', {
      scrapeRunId,
      data: result.data,
    });
    return { success: false, error: 'Invalid response from server' };
  }

  const rawDupes = payload.nameDuplicates;
  const nameDuplicates: GoogleMapsScrapeNameDuplicate[] = Array.isArray(rawDupes)
    ? rawDupes.map((row) => {
        const r = row as Record<string, unknown>;
        return {
          googleMapsDisplayName: String(r.googleMapsDisplayName ?? ''),
          existingLeadId: String(r.existingLeadId ?? ''),
          existingLeadName: String(r.existingLeadName ?? ''),
        };
      })
    : [];

  const mapped = {
    scrapeRun: toModel(payload.scrapeRun),
    businessesScraped: payload.businessesScraped ?? 0,
    leadsCreated: payload.leadsCreated ?? 0,
    leadsSkippedDuplicateName: payload.leadsSkippedDuplicateName ?? 0,
    nameDuplicates,
    durationMs: payload.durationMs ?? 0,
  };

  console.log('✅ [web.triggerGoogleMapsScrape] mapped success', {
    scrapeRunId: mapped.scrapeRun.id,
    businessesScraped: mapped.businessesScraped,
    leadsCreated: mapped.leadsCreated,
    resultsCount: mapped.scrapeRun.resultsCount,
    businessesImported: mapped.scrapeRun.businessesImported,
  });

  return { success: true, data: mapped };
};
