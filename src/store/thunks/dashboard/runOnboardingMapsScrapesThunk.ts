import type { AppThunk } from '../../store';
import { DashboardBuilderActions } from '@/store/builders/dashboardBuilder';
import { scrapeGoogleMapsThunk } from '@/store/thunks/google-maps-scrape-runs';
import {
  buildOnboardingMapsSearchQuery,
  buildOnboardingScrapeRunName,
  DASHBOARD_ONBOARDING_MAX_RESULTS_PER_TYPE,
  DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH,
} from '@/utils/dashboard';

type ResponseType = Promise<{ success: boolean; error?: string }>;

/**
 * Runs one Google Maps scrape per draft business type (sequential).
 * Fail-fast: stops on first failed scrape and returns to collect_intent with an error message.
 */
export const runOnboardingMapsScrapesThunk = (): AppThunk<ResponseType> => {
  return async (dispatch, getState): ResponseType => {
    const {
      draftPostalCode,
      draftBusinessTypes,
    } = getState().dashboardBuilder;

    const postal = draftPostalCode.trim();
    if (postal.length < DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH) {
      return {
        success: false,
        error: `Enter a postal code (at least ${DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH} characters).`,
      };
    }

    const types = draftBusinessTypes.map((t) => t.trim()).filter(Boolean);
    if (types.length === 0) {
      return {
        success: false,
        error: 'Add at least one business type.',
      };
    }

    dispatch(DashboardBuilderActions.setOnboardingError(null));
    dispatch(DashboardBuilderActions.resetOnboardingScrapeRunIds());
    dispatch(DashboardBuilderActions.setOnboardingPhase('searching'));
    dispatch(DashboardBuilderActions.setOnboardingScrapeIndex(0));

    for (let i = 0; i < types.length; i += 1) {
      const businessType = types[i];
      dispatch(DashboardBuilderActions.setOnboardingScrapeIndex(i + 1));

      const searchQuery = buildOnboardingMapsSearchQuery(businessType, postal);
      const name = buildOnboardingScrapeRunName(businessType);

      console.log('🚀 [web.runOnboardingMapsScrapes] scrape type', {
        index: i + 1,
        of: types.length,
        businessType,
        searchQuery,
        name,
      });

      const result = await dispatch(
        scrapeGoogleMapsThunk(
          name,
          searchQuery,
          DASHBOARD_ONBOARDING_MAX_RESULTS_PER_TYPE
        )
      );

      console.log('📥 [web.runOnboardingMapsScrapes] scrape result', {
        businessType,
        success: result.success,
        scrapeRunId: result.scrapeRunId,
        businessesScraped: result.businessesScraped,
        leadsCreated: result.leadsCreated,
        error: result.error,
      });

      if (!result.success || !result.scrapeRunId) {
        const message =
          result.error ?? 'Search failed. Try again or adjust your criteria.';
        dispatch(DashboardBuilderActions.setOnboardingError(message));
        dispatch(DashboardBuilderActions.setOnboardingPhase('collect_intent'));
        return { success: false, error: message };
      }

      dispatch(
        DashboardBuilderActions.appendOnboardingScrapeRunId(result.scrapeRunId)
      );
    }

    const runIds = getState().dashboardBuilder.onboardingScrapeRunIds;
    console.log('✅ [web.runOnboardingMapsScrapes] moving to preview', {
      runIds,
      leadsInStore: Object.keys(getState().leads).length,
    });

    dispatch(DashboardBuilderActions.setOnboardingScrapeIndex(0));
    dispatch(DashboardBuilderActions.setOnboardingPhase('preview'));
    return { success: true };
  };
};
