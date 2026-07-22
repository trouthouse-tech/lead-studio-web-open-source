import { coerceErrorFields, reportThunkError } from '@/api/thunk-errors';
import type { AppThunk } from '../../store';
import { DashboardBuilderActions } from '@/store/builders/dashboardBuilder';
import { getAllLeadsThunk } from '@/store/thunks/leads/getAllLeadsThunk';

type ResponseType = Promise<200 | 400 | 500>;

/**
 * Loads leads, then sets onboarding phase: empty pipeline → collect_intent; otherwise idle.
 */
export const initializeDashboardOnboardingThunk =
  (): AppThunk<ResponseType> => {
    return async (dispatch, getState): ResponseType => {
      try {
        const leadsStatus = await dispatch(getAllLeadsThunk());
        if (leadsStatus !== 200) {
          dispatch(DashboardBuilderActions.setOnboardingHydrated(true));
          dispatch(
            DashboardBuilderActions.setOnboardingPhase('collect_intent')
          );
          return leadsStatus;
        }

        const leadCount = Object.keys(getState().leads).length;
        if (leadCount === 0) {
          dispatch(
            DashboardBuilderActions.setOnboardingPhase('collect_intent')
          );
        } else {
          dispatch(DashboardBuilderActions.setOnboardingPhase('idle'));
          dispatch(
            DashboardBuilderActions.setShowOnboardingWizard(false)
          );
        }

        dispatch(DashboardBuilderActions.setOnboardingHydrated(true));

        return 200;
      } catch (e) {
        const { message, stack } = coerceErrorFields(e);
        reportThunkError({
          event: 'failedToInitializeDashboardOnboarding',
          message,
          stack,
          thunkName: 'initializeDashboardOnboardingThunk',
        });
        console.error('initializeDashboardOnboardingThunk', e);
        dispatch(DashboardBuilderActions.setOnboardingHydrated(true));
        dispatch(DashboardBuilderActions.setOnboardingPhase('collect_intent'));
        return 500;
      }
    };
  };
