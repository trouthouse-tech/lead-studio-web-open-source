'use client';

import { useState } from 'react';
import { MapPin, X, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { DashboardBuilderActions } from '@/store/builders/dashboardBuilder';
import { runOnboardingMapsScrapesThunk } from '@/store/thunks/dashboard';
import {
  DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH,
} from '@/utils/dashboard';
import { OnboardingSearching } from './searching';
import { OnboardingLeadsPreview } from './leads';

export const NewUser = () => {
  const dispatch = useAppDispatch();
  const phase = useAppSelector((s) => s.dashboardBuilder.onboardingPhase);
  const hydrated = useAppSelector(
    (s) => s.dashboardBuilder.onboardingHydrated
  );
  const showWizard = useAppSelector(
    (s) => s.dashboardBuilder.showOnboardingWizard
  );
  const postalCode = useAppSelector((s) => s.dashboardBuilder.draftPostalCode);
  const types = useAppSelector(
    (s) => s.dashboardBuilder.draftBusinessTypes
  );
  const error = useAppSelector((s) => s.dashboardBuilder.onboardingError);

  const [typeInput, setTypeInput] = useState('');

  if (!hydrated || !showWizard) {
    return null;
  }

  if (phase === 'idle') {
    return null;
  }

  if (phase === 'searching') {
    return <OnboardingSearching />;
  }

  if (phase === 'preview') {
    return <OnboardingLeadsPreview />;
  }

  const addType = () => {
    const trimmed = typeInput.trim();
    if (!trimmed || types.includes(trimmed)) return;
    dispatch(
      DashboardBuilderActions.setDraftBusinessTypes([...types, trimmed])
    );
    setTypeInput('');
  };

  const removeType = (t: string) => {
    dispatch(
      DashboardBuilderActions.setDraftBusinessTypes(
        types.filter((x) => x !== t)
      )
    );
  };

  const canSubmit =
    postalCode.trim().length >= DASHBOARD_ONBOARDING_MIN_POSTAL_LENGTH &&
    types.length > 0;

  const handleFind = async () => {
    await dispatch(runOnboardingMapsScrapesThunk());
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.title}>Tell us what to find</h2>
        <p className={styles.description}>
          Enter your postal code and the kinds of businesses you want to reach.
          We search Google Maps and save matches as leads.
        </p>
      </div>
      <div className={styles.cardBody}>
        {error && (
          <div className={styles.errorBanner} role="alert">
            {error}
          </div>
        )}
        <div className={styles.grid}>
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
                value={postalCode}
                onChange={(e) =>
                  dispatch(
                    DashboardBuilderActions.setDraftPostalCode(e.target.value)
                  )
                }
                className={styles.inputWithIcon}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label htmlFor="onboarding-biz-type" className={styles.label}>
              Business types
            </label>
            <div className={styles.typeRow}>
              <input
                id="onboarding-biz-type"
                type="text"
                placeholder="e.g. plumbers"
                value={typeInput}
                onChange={(e) => setTypeInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addType();
                  }
                }}
                className={styles.input}
              />
              <button
                type="button"
                onClick={addType}
                disabled={!typeInput.trim()}
                className={styles.addBtn}
              >
                Add
              </button>
            </div>
          </div>
        </div>
        {types.length > 0 && (
          <div className={styles.chips}>
            {types.map((t) => (
              <span key={t} className={styles.chip}>
                {t}
                <button
                  type="button"
                  onClick={() => removeType(t)}
                  className={styles.chipRemove}
                  aria-label={`Remove ${t}`}
                >
                  <X className={styles.chipIcon} />
                </button>
              </span>
            ))}
          </div>
        )}
        <p className={styles.hint}>
          We run one Maps search per type near your postal code.
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
    </div>
  );
};

const styles = {
  card: `
    rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden
  `,
  cardHeader: `
    px-5 py-4 border-b border-slate-100 bg-slate-50
  `,
  title: `
    text-lg font-semibold text-slate-900
  `,
  description: `
    mt-1 text-sm text-slate-600
  `,
  cardBody: `
    px-5 py-5 space-y-5
  `,
  errorBanner: `
    rounded-lg bg-red-50 text-red-800 text-sm px-3 py-2 border border-red-100
  `,
  grid: `
    grid sm:grid-cols-2 gap-4
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
  typeRow: `
    flex gap-2
  `,
  input: `
    flex-1 min-w-0 rounded-lg border border-slate-200 px-3 py-2 text-sm
    text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/30
  `,
  addBtn: `
    shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium
    text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:pointer-events-none
  `,
  chips: `
    flex flex-wrap gap-2
  `,
  chip: `
    inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-800 text-sm pl-3 pr-1 py-1
  `,
  chipRemove: `
    rounded-full p-0.5 hover:bg-slate-200 text-slate-600
  `,
  chipIcon: `
    h-3.5 w-3.5
  `,
  hint: `
    text-xs text-slate-500
  `,
  primaryBtn: `
    inline-flex items-center gap-1.5 rounded-lg bg-slate-900 text-white text-sm font-medium
    px-4 py-2.5 hover:bg-slate-800 disabled:opacity-40 disabled:pointer-events-none
  `,
  btnIcon: `
    h-4 w-4
  `,
};
