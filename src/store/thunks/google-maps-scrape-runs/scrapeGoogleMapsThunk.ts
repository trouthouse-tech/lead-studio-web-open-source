import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import type { GoogleMapsScrapeNameDuplicate } from '@/model';
import { GoogleMapsScraperBuilderActions } from '@/store/builders/googleMapsScraperBuilder';
import { CurrentGoogleMapsScrapeRunActions } from '@/store/current/currentGoogleMapsScrapeRun';
import { GoogleMapsScrapeRunsActions } from '@/store/dumps/googleMapsScrapeRuns';
import {
  createGoogleMapsScrapeRun,
  triggerGoogleMapsScrape,
} from '@/api/google-maps-scrape-runs';
import { getAllLeadsThunk } from '../leads/getAllLeadsThunk';

type ResponseType = Promise<{
  success: boolean;
  error?: string;
  businessesScraped?: number;
  leadsCreated?: number;
  leadsSkippedDuplicateName?: number;
  nameDuplicates?: GoogleMapsScrapeNameDuplicate[];
  /** Present when scrape run was created and trigger completed successfully */
  scrapeRunId?: string;
}>;

/**
 * Creates scrape run → Express runs Places API text search (GOOGLE_MAPS_API_KEY) → leads inserted in DB.
 */
export const scrapeGoogleMapsThunk =
  (
    name: string,
    searchQuery: string,
    maxResults?: number
  ): AppThunk<ResponseType> =>
  async (dispatch, getState): ResponseType => {
    try {
      console.log('🚀 [web.scrapeGoogleMapsThunk] start', { name, searchQuery, maxResults });
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(true));

      const createResponse = await createGoogleMapsScrapeRun({
        name,
        searchQuery,
        status: 'in_progress',
        results_count: 0,
        businesses_imported: 0,
        max_results: maxResults ?? null,
      });

      console.log('📥 [web.scrapeGoogleMapsThunk] create scrape run', {
        success: createResponse.success,
        httpStatus: createResponse.httpStatus,
        error: createResponse.error,
        scrapeRunId: createResponse.data?.id,
        dataKeys: createResponse.data ? Object.keys(createResponse.data) : [],
      });

      if (!createResponse.success || !createResponse.data) {
        dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));
        return {
          success: false,
          error: createResponse.error || 'Failed to create scrape run',
        };
      }

      const scrapeRun = createResponse.data;
      dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(scrapeRun));
      dispatch(GoogleMapsScrapeRunsActions.addGoogleMapsScrapeRun(scrapeRun));

      const triggerResult = await triggerGoogleMapsScrape(scrapeRun.id);

      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));

      if (!triggerResult.success) {
        console.warn('⚠️ [web.scrapeGoogleMapsThunk] trigger failed', {
          scrapeRunId: scrapeRun.id,
          error: triggerResult.error,
        });
        if (triggerResult.scrapeRun) {
          dispatch(
            GoogleMapsScrapeRunsActions.updateGoogleMapsScrapeRun(
              triggerResult.scrapeRun
            )
          );
          dispatch(
            CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(
              triggerResult.scrapeRun
            )
          );
        }
        return {
          success: false,
          error: triggerResult.error,
        };
      }

      const {
        scrapeRun: updated,
        businessesScraped,
        leadsCreated,
        leadsSkippedDuplicateName,
        nameDuplicates,
      } = triggerResult.data;

      console.log('✅ [web.scrapeGoogleMapsThunk] trigger ok — refreshing leads', {
        scrapeRunId: updated.id,
        businessesScraped,
        leadsCreated,
        leadsSkippedDuplicateName,
      });

      dispatch(GoogleMapsScrapeRunsActions.updateGoogleMapsScrapeRun(updated));
      dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(updated));

      const leadsStatus = await dispatch(getAllLeadsThunk());
      const leadsInStore = Object.keys(getState().leads).length;
      const matchingBySearchRun = Object.values(getState().leads).filter(
        (l) => l.search_run_id === updated.id,
      ).length;
      const matchingByIdempotency = Object.values(getState().leads).filter(
        (l) =>
          typeof l.idempotency_key === 'string' &&
          l.idempotency_key.startsWith(`gmaps-places:${updated.id}:`),
      ).length;

      console.log('📊 [web.scrapeGoogleMapsThunk] leads after refresh', {
        leadsStatus,
        leadsInStore,
        matchingBySearchRun,
        matchingByIdempotency,
        sampleIdempotencyKeys: Object.values(getState().leads)
          .slice(0, 3)
          .map((l) => ({ id: l.id, search_run_id: l.search_run_id, idempotency_key: l.idempotency_key })),
      });

      return {
        success: true,
        businessesScraped,
        leadsCreated,
        leadsSkippedDuplicateName,
        nameDuplicates,
        scrapeRunId: updated.id,
      };
    } catch (error) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToScrapeGoogleMaps',
        message,
        stack,
        thunkName: 'scrapeGoogleMapsThunk',
      });
      console.error('❌ [web.scrapeGoogleMapsThunk] error:', error);
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };
