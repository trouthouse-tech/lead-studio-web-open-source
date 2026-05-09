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
  async (dispatch): ResponseType => {
    try {
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(true));

      const createResponse = await createGoogleMapsScrapeRun({
        name,
        searchQuery,
        status: 'in_progress',
        results_count: 0,
        businesses_imported: 0,
        max_results: maxResults ?? null,
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

      dispatch(GoogleMapsScrapeRunsActions.updateGoogleMapsScrapeRun(updated));
      dispatch(CurrentGoogleMapsScrapeRunActions.setGoogleMapsScrapeRun(updated));

      await dispatch(getAllLeadsThunk());

      return {
        success: true,
        businessesScraped,
        leadsCreated,
        leadsSkippedDuplicateName,
        nameDuplicates,
        scrapeRunId: updated.id,
      };
    } catch (error) {
      dispatch(GoogleMapsScraperBuilderActions.setIsScraping(false));
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  };
