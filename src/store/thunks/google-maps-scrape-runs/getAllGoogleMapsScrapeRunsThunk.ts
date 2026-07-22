import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import { mapApiFailureToThunkStatus } from '@/api/_shared';
import { getAllGoogleMapsScrapeRuns } from '@/api/google-maps-scrape-runs';
import type { AppThunk } from '../../store';
import { GoogleMapsScrapeRunsActions } from '@/store/dumps/googleMapsScrapeRuns';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads all Google Maps scrape runs into the `googleMapsScrapeRuns` dump.
 */
export const getAllGoogleMapsScrapeRunsThunk = (): AppThunk<ResponseType> => {
  return async (dispatch): ResponseType => {
    try {
      const response = await getAllGoogleMapsScrapeRuns();

      if (response.success && response.data) {
        dispatch(GoogleMapsScrapeRunsActions.setGoogleMapsScrapeRuns(response.data));
        return 200;
      }

      return mapApiFailureToThunkStatus(response);
    } catch (error: unknown) {
      const { message, stack } = coerceErrorFields(error);
      reportThunkError({
        event: 'failedToGetAllGoogleMapsScrapeRuns',
        message,
        stack,
        thunkName: 'getAllGoogleMapsScrapeRunsThunk',
      });
      console.error('❌ getAllGoogleMapsScrapeRunsThunk error:', error);
      return 500;
    }
  };
};
