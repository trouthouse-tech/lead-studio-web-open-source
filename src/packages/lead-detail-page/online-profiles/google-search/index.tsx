'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import {
  getPrimaryWebsiteForLead,
  PLAYWRIGHT_WEBSITE_URL_DISCOVERY_RUN_DISABLED_TITLE,
} from '@/utils/leads';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  refreshCurrentLeadThunk,
  runLeadPlaywrightWebsiteUrlDiscoveryThunk,
} from '@/store/thunks/leads';
import type { Lead } from '@/model';

const ROW_LABEL = 'Site pages';

const buildGoogleSearchQuery = (lead: Lead) => {
  const name = lead.business_name?.trim() || lead.name?.trim() || '';
  const location = lead.address?.trim() || '';
  const parts = [name, location].filter((p) => p.length > 0);
  if (parts.length === 0) return null;
  return parts.join(' ');
};

export const OnlineProfilesGoogleSearchRow = () => {
  const dispatch = useAppDispatch();
  const lead = useAppSelector((state) => state.currentLead);
  const [isSearching, setIsSearching] = useState(false);

  const website = getPrimaryWebsiteForLead(lead);
  const discoveredWebsiteUrls = (lead.website_urls ?? []).filter((url) => {
    if (!url?.trim()) return false;
    if (!website) return true;
    return url.trim() !== website.trim();
  });

  const busy = isSearching;
  const isMissingRequiredWebsite = !website;
  const playwrightDiscoveryAlreadyUsed =
    lead.playwright_website_url_discovery_attempted === true;

  const googleQuery = buildGoogleSearchQuery(lead);
  const googleSearchUrl = googleQuery
    ? `https://www.google.com/search?q=${encodeURIComponent(googleQuery)}`
    : null;

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>🔎</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{ROW_LABEL}</span>
          <div className={styles.actionButtons}>
            {googleSearchUrl ? (
              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noreferrer"
                className={styles.refreshButton}
                title={`Open Google (manual): ${googleQuery}`}
                aria-label="Open Google search for business name and address in a new tab"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            ) : (
              <button
                type="button"
                disabled
                className={styles.googleSearchDisabled}
                title="Add a business name or address to open a Google search"
                aria-label="Add business name or address to search Google"
              >
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </button>
            )}
          <button
            type="button"
            className={styles.refreshButton}
            disabled={isMissingRequiredWebsite || playwrightDiscoveryAlreadyUsed || busy}
            title={
              isMissingRequiredWebsite
                ? 'Add a website on the lead before discovering extra page URLs'
                : playwrightDiscoveryAlreadyUsed
                  ? PLAYWRIGHT_WEBSITE_URL_DISCOVERY_RUN_DISABLED_TITLE
                  : 'Discover extra page URLs from this site’s navigation and footer (Playwright)'
            }
            aria-label="Discover site page URLs with Playwright"
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!lead.id || !website || isSearching || playwrightDiscoveryAlreadyUsed) {
                return;
              }

              setIsSearching(true);
              try {
                const result = await dispatch(runLeadPlaywrightWebsiteUrlDiscoveryThunk());
                if (!result.ok) {
                  if (result.error === 'playwright_website_url_discovery_already_attempted') {
                    toast.error(
                      result.message ??
                        'Site page URL discovery can only be run once per lead. Edit URLs on the lead manually if needed.'
                    );
                    return;
                  }
                  toast.error(result.message ?? 'Site page URL discovery failed');
                  return;
                }

                const refreshStatus = await dispatch(refreshCurrentLeadThunk(lead.id));
                if (refreshStatus !== 200) {
                  toast.error('Site page discovery finished but refreshing the lead failed');
                  return;
                }

                if (result.leadUpdated) {
                  toast.success(
                    `Found ${result.linkCount} page URL${result.linkCount === 1 ? '' : 's'} from the site`
                  );
                } else {
                  toast.success('Site page discovery finished — no new URLs added');
                }
              } finally {
                setIsSearching(false);
              }
            }}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" aria-hidden />
            )}
          </button>
          </div>
        </div>
        {discoveredWebsiteUrls.length > 0 ? (
          <span className={styles.discoveryTooltipWrap}>
            <a
              href={discoveredWebsiteUrls[0]}
              target="_blank"
              rel="noreferrer"
              className={styles.discoveryFoundLink}
            >
              {discoveredWebsiteUrls.length} website
              {discoveredWebsiteUrls.length === 1 ? '' : 's'} found
            </a>
            <span className={styles.discoveryTooltip}>
              {discoveredWebsiteUrls.map((url) => (
                <a
                  key={url}
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.discoveryTooltipLink}
                >
                  {url}
                </a>
              ))}
            </span>
          </span>
        ) : (
          <span className={styles.profileMissing}>No pages found yet</span>
        )}
      </div>
    </div>
  );
};

const styles = {
  profileChip: `
    flex items-start gap-2.5 rounded-md border border-gray-200 p-3
  `,
  profileIcon: `text-base leading-none mt-0.5`,
  profileLabelRow: `
    flex items-center justify-between gap-1 min-w-0
  `,
  profileLabel: `text-xs font-medium text-gray-500 truncate`,
  actionButtons: `flex shrink-0 items-center gap-0.5`,
  googleSearchDisabled: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-400
    opacity-40 cursor-not-allowed disabled:opacity-40
  `,
  refreshButton: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  discoveryTooltipWrap: `relative inline-flex group`,
  discoveryFoundLink: `text-sm text-blue-600 hover:underline`,
  discoveryTooltip: `
    hidden group-hover:block absolute z-20 left-0 top-full mt-1 min-w-[280px] max-w-[420px]
    rounded-md border border-gray-200 bg-white p-2 shadow-lg
  `,
  discoveryTooltipLink: `
    block text-xs text-blue-600 hover:underline break-all py-0.5
  `,
  profileMissing: `text-sm text-gray-500 italic`,
};
