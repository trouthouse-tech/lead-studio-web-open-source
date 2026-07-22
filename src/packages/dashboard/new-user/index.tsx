'use client';

import { MapPin, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DashboardBuilderActions } from '@/store/builders/dashboardBuilder';
import { runOnboardingMapsScrapesThunk } from '@/store/thunks/dashboard';
import { DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH } from '@/utils/dashboard';
import { OnboardingSearching } from './searching';
import { OnboardingLeadsPreview } from './leads';
import { BusinessTypeCombobox } from './business-type-combobox';

const MODAL_TITLE_ID = 'onboarding-welcome-title';

/**
 * Non-dismissible empty-pipeline onboarding modal:
 * welcome + business type + postal → searching → retrieved leads preview.
 */
export const NewUser = () => {
  const dispatch = useAppDispatch();
  const {
    onboardingPhase,
    onboardingHydrated,
    showOnboardingWizard,
    draftPostalCode,
    draftBusinessTypes,
    onboardingError,
  } = useAppSelector((s) => s.dashboardBuilder);

  if (!onboardingHydrated || !showOnboardingWizard) {
    return null;
  }

  if (onboardingPhase === 'idle') {
    return null;
  }

  const selectedType = draftBusinessTypes[0] ?? '';

  const canSubmit =
    draftPostalCode.trim().length >= DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH &&
    selectedType.trim().length > 0;

  const handleBusinessTypeChange = (next: string) => {
    const trimmed = next.trim();
    dispatch(
      DashboardBuilderActions.setDraftBusinessTypes(trimmed ? [trimmed] : [])
    );
  };

  const handleFind = async () => {
    await dispatch(runOnboardingMapsScrapesThunk());
  };

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-labelledby={MODAL_TITLE_ID}
    >
      <div className={styles.modal}>
        {onboardingPhase === 'searching' && <OnboardingSearching />}
        {onboardingPhase === 'preview' && <OnboardingLeadsPreview />}
        {onboardingPhase === 'collect_intent' && (
          <>
            <div className={styles.header}>
              <h2 id={MODAL_TITLE_ID} className={styles.title}>
                Welcome to Lead Studio
              </h2>
              <p className={styles.description}>
                Pick a business type and your postal code. We search Google Maps
                and save matches as leads so you can start outreach.
              </p>
            </div>
            <div className={styles.body}>
              {onboardingError && (
                <div className={styles.errorBanner} role="alert">
                  {onboardingError}
                </div>
              )}
              <div className={styles.fields}>
                <div className={styles.field}>
                  <label htmlFor="onboarding-biz-type" className={styles.label}>
                    Lead category
                  </label>
                  <BusinessTypeCombobox
                    value={selectedType}
                    onChange={handleBusinessTypeChange}
                  />
                </div>
                <div className={styles.field}>
                  <label htmlFor="onboarding-postal" className={styles.label}>
                    Postal code
                  </label>
                  <div className={styles.inputWrap}>
                    <MapPin className={styles.inputIcon} aria-hidden />
                    <input
                      id="onboarding-postal"
                      type="text"
                      autoComplete="postal-code"
                      placeholder="e.g. 19103"
                      value={draftPostalCode}
                      onChange={(e) =>
                        dispatch(
                          DashboardBuilderActions.setDraftPostalCode(
                            e.target.value
                          )
                        )
                      }
                      className={styles.inputWithIcon}
                    />
                  </div>
                </div>
              </div>
              <p className={styles.hint}>
                Choose a lead category (same list as on the Leads table), or type
                your own to add one.
              </p>
              <button
                type="button"
                disabled={!canSubmit}
                onClick={handleFind}
                className={styles.primaryBtn}
              >
                Find businesses
                <ArrowRight className={styles.btnIcon} aria-hidden />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const styles = {
  overlay: `
    fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4
  `,
  modal: `
    bg-white rounded-xl shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto
  `,
  header: `
    px-5 py-4 border-b border-slate-100 bg-slate-50
  `,
  title: `
    text-lg font-semibold text-slate-900
  `,
  description: `
    mt-1 text-sm text-slate-600
  `,
  body: `
    px-5 py-5 space-y-5
  `,
  errorBanner: `
    rounded-lg bg-red-50 text-red-800 text-sm px-3 py-2 border border-red-100
  `,
  fields: `
    flex flex-col gap-4
  `,
  field: `
    space-y-1.5
  `,
  label: `
    block text-sm font-medium text-slate-700
  `,
  inputWrap: `
    relative
  `,
  inputIcon: `
    absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none
  `,
  inputWithIcon: `
    w-full rounded-lg border border-slate-200 pl-9 pr-3 py-2 text-sm
    text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30
  `,
  hint: `
    text-xs text-slate-500
  `,
  primaryBtn: `
    inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium
    px-4 py-2.5 hover:bg-slate-800 cursor-pointer
    disabled:opacity-40 disabled:pointer-events-none disabled:cursor-not-allowed
  `,
  btnIcon: `
    h-4 w-4
  `,
} as const;
