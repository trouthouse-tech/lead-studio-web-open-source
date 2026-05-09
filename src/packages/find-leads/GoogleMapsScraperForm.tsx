'use client';

import { useMemo, useState } from 'react';
import { Loader2, MapPin, Search, X } from 'lucide-react';
import type { GoogleMapsScrapeNameDuplicate } from '@/model';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { scrapeGoogleMapsThunk } from '@/store/thunks/google-maps-scrape-runs';

const generateSearchName = (query: string, city: string) => {
  const parts = [city, query].filter(Boolean).join(' ');
  const date = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  return parts ? `${parts} – ${date}` : '';
};

export const GoogleMapsScraperForm = () => {
  const dispatch = useAppDispatch();
  const isScraping = useAppSelector((s) => s.googleMapsScraperBuilder.isScraping);
  const [query, setQuery] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [maxResults, setMaxResults] = useState(50);
  const [error, setError] = useState<string | null>(null);
  const [nameDuplicates, setNameDuplicates] = useState<GoogleMapsScrapeNameDuplicate[]>([]);

  const fullQuery = useMemo(
    () => [query, city, state].filter(Boolean).join(', '),
    [query, city, state],
  );

  const handleScrape = async () => {
    if (!query.trim() || !city.trim()) {
      setError('Query and city are required.');
      return;
    }
    setError(null);
    setNameDuplicates([]);
    const searchName = generateSearchName(query.trim(), city.trim());
    const result = await dispatch(scrapeGoogleMapsThunk(searchName, fullQuery.trim(), maxResults));

    if (result.success) {
      setQuery('');
      setCity('');
      setState('');
      setMaxResults(50);
      setNameDuplicates(result.nameDuplicates ?? []);
    } else {
      setError(result.error ?? 'Something went wrong.');
    }
  };

  return (
    <div className={styles.outer}>
      {error && (
        <div className={styles.errorBanner}>
          <p className={styles.errorText}>{error}</p>
          <button
            type="button"
            onClick={() => setError(null)}
            className={styles.errorDismiss}
            aria-label="Dismiss error"
          >
            <X className={styles.iconSm} />
          </button>
        </div>
      )}

      {nameDuplicates.length > 0 ? (
        <div className={styles.dupBanner}>
          <div className={styles.dupHeader}>
            <p className={styles.dupTitle}>
              Skipped {nameDuplicates.length} result
              {nameDuplicates.length === 1 ? '' : 's'} — same business name as an existing lead
              (trimmed, case-insensitive match).
            </p>
            <button
              type="button"
              onClick={() => setNameDuplicates([])}
              className={styles.dupDismiss}
              aria-label="Dismiss duplicate notice"
            >
              <X className={styles.iconSm} />
            </button>
          </div>
          <ul className={styles.dupList}>
            {nameDuplicates.map((row) => (
              <li key={`${row.existingLeadId}:${row.googleMapsDisplayName}`} className={styles.dupRow}>
                <span className={styles.dupMapsName}>{row.googleMapsDisplayName}</span>
                <span className={styles.dupArrow}>→</span>
                <span className={styles.dupExisting}>
                  {row.existingLeadName}{' '}
                  <code className={styles.dupId}>{row.existingLeadId}</code>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleRow}>
            <MapPin className={styles.iconPrimary} aria-hidden />
            <span className={styles.cardTitle}>Scrape Google Maps</span>
          </div>
          {fullQuery ? (
            <p className={styles.previewHint}>
              Will search: <span className={styles.previewQuery}>{fullQuery}</span>
            </p>
          ) : null}
        </div>

        <div className={styles.fieldsRow}>
          <div className={styles.fieldGrow}>
            <label className={styles.label}>Query</label>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. interior designers"
              disabled={isScraping}
              className={styles.input}
            />
          </div>
          <div className={styles.fieldCity}>
            <label className={styles.label}>City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Philadelphia"
              disabled={isScraping}
              className={styles.input}
            />
          </div>
          <div className={styles.fieldState}>
            <label className={styles.label}>State</label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="e.g. PA"
              disabled={isScraping}
              className={styles.input}
            />
          </div>
          <div className={styles.fieldMax}>
            <label className={styles.label}>Max results</label>
            <p className={styles.fieldHint}>
              Google Text Search returns at most 60 places per query (paginated on the server).
            </p>
            <select
              value={maxResults}
              onChange={(e) => setMaxResults(Number(e.target.value))}
              disabled={isScraping}
              className={styles.select}
            >
              {Array.from({ length: 6 }, (_, i) => (i + 1) * 10).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={handleScrape}
            disabled={isScraping}
            className={styles.submit}
          >
            {isScraping ? (
              <>
                <Loader2 className={styles.iconSpin} aria-hidden />
                Scraping…
              </>
            ) : (
              <>
                <Search className={styles.iconMd} aria-hidden />
                Scrape Google Maps
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  outer: `w-full mb-4 space-y-3`,
  errorBanner: `
    flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3
  `,
  errorText: `text-sm text-red-800 flex-1`,
  errorDismiss: `
    text-red-500 hover:text-red-700 p-1 rounded shrink-0
  `,
  dupBanner: `
    rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 space-y-2
  `,
  dupHeader: `flex items-start gap-2`,
  dupTitle: `text-sm text-amber-950 flex-1 leading-snug`,
  dupList: `text-sm space-y-1.5 list-none pl-0 max-h-48 overflow-y-auto`,
  dupRow: `flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-amber-950`,
  dupMapsName: `font-medium`,
  dupArrow: `text-amber-700 shrink-0`,
  dupExisting: `text-amber-900`,
  dupId: `text-xs text-amber-800 bg-amber-100/80 px-1 py-0.5 rounded`,
  dupDismiss: `
    text-amber-700 hover:text-amber-900 p-1 rounded shrink-0
  `,
  iconSm: `h-4 w-4`,
  card: `
    rounded-lg border border-gray-200 bg-white p-5 shadow-sm space-y-4
  `,
  cardHeader: `
    flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between
  `,
  cardTitleRow: `flex items-center gap-2 text-sm font-medium text-gray-900`,
  iconPrimary: `h-4 w-4 text-blue-600 shrink-0`,
  cardTitle: ``,
  previewHint: `text-xs text-gray-500 sm:text-right`,
  previewQuery: `font-medium text-gray-900`,
  fieldsRow: `
    flex flex-wrap items-end gap-3
  `,
  fieldGrow: `space-y-1.5 flex-1 min-w-[160px]`,
  fieldCity: `space-y-1.5 min-w-[140px] flex-1 sm:flex-initial`,
  fieldState: `space-y-1.5 w-full min-[480px]:w-[100px]`,
  fieldMax: `space-y-1.5 w-full min-[480px]:w-[140px]`,
  fieldHint: `text-[10px] leading-snug text-gray-500`,
  label: `text-xs font-medium text-gray-600`,
  input: `
    w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500
    disabled:opacity-50
  `,
  select: `
    w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
    focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50
  `,
  submit: `
    inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5
    text-sm font-medium text-white hover:bg-blue-700 transition-colors
    disabled:opacity-50 shrink-0 w-full min-[480px]:w-auto
  `,
  iconMd: `h-4 w-4`,
  iconSpin: `h-4 w-4 animate-spin`,
};
