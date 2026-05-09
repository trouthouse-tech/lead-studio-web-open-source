'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  refreshCurrentLeadThunk,
  runLeadGoogleSearchResearchThunk,
} from '@/store/thunks/leads';
import { getLeadContactsByLeadIdThunk } from '@/store/thunks/lead-contacts';

const LABEL = 'Facebook';

/**
 * Manual Facebook discovery from lead detail: same SERP + AI + Apify as the leads list row, but repeatable here.
 */
export const OnlineProfilesFacebookRow = () => {
  const dispatch = useAppDispatch();
  const lead = useAppSelector((state) => state.currentLead);
  const [isSearching, setIsSearching] = useState(false);

  const url = lead?.facebook_url?.trim() || null;
  const busy = isSearching;

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>📘</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{LABEL}</span>
          <button
            type="button"
            className={styles.refreshButton}
            disabled={busy}
            title="Search for Facebook page (Google index via Programmable Search). You can run this again from this page."
            aria-label={`Find ${LABEL} page using Google index search`}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!lead?.id || isSearching) {
                return;
              }

              setIsSearching(true);
              try {
                const result = await dispatch(runLeadGoogleSearchResearchThunk('facebook'));
                if (!result.ok) {
                  if (result.error === 'website_required') {
                    toast.error(
                      result.message ??
                        'Add a website on this lead before searching for profile links.'
                    );
                  } else if (
                    result.error === 'facebook_search_already_attempted' ||
                    result.error === 'facebook_search_already_completed'
                  ) {
                    toast.error(
                      result.message ??
                        'This request was treated as a list-row run. Refresh the page and try again.'
                    );
                  } else {
                    toast.error(result.message ?? 'Facebook search failed');
                  }
                  return;
                }

                const refreshStatus = await dispatch(refreshCurrentLeadThunk(lead.id));
                if (refreshStatus !== 200) {
                  toast.error('Search finished but refreshing the lead failed');
                  return;
                }

                if (result.facebookApifySkipped === 'lead_has_complete_contact') {
                  toast.info(
                    'Facebook page scrape skipped — a contact already has both email and phone.'
                  );
                } else if (result.facebookApifySkipped === 'lead_has_contacts') {
                  toast.info(
                    'Facebook page scrape skipped — this lead already has contacts. Run website research first to capture email/phone from the site.'
                  );
                } else if (result.facebookApifyError) {
                  toast.warning(
                    `Search finished; Facebook page scrape failed: ${result.facebookApifyError}`
                  );
                } else {
                  if (result.facebookContactCreated || result.facebookContactMerged) {
                    await dispatch(getLeadContactsByLeadIdThunk(lead.id));
                  }
                  if (result.leadUpdated) {
                    toast.success(
                      result.facebookContactCreated
                        ? 'Facebook URL updated and contact saved from Facebook page'
                        : result.facebookContactMerged
                          ? 'Facebook URL updated — merged email/phone onto existing contact'
                          : 'Profile link updated from search'
                    );
                  } else {
                    const lc = result.linkCount;
                    const noSerpLinks = typeof lc === 'number' && lc === 0;
                    const hadCandidates =
                      typeof lc === 'number' && lc > 0 && result.hasProfiles !== true;

                    if (noSerpLinks) {
                      toast.info(
                        'No Facebook URLs in this search — Programmable Search may not include facebook.com, or nothing matched in Google’s index.',
                        { duration: 8000 }
                      );
                    } else if (hadCandidates) {
                      toast.info(
                        `Search returned ${lc} candidate link${lc === 1 ? '' : 's'}; none were chosen as this business’s Facebook page.`,
                        { duration: 8000 }
                      );
                    } else {
                      toast.success(
                        result.facebookContactCreated
                          ? 'Contact saved from Facebook page'
                          : result.facebookContactMerged
                            ? 'Updated an existing contact with Facebook details'
                            : 'Search finished — no matching Facebook URL found'
                      );
                    }
                  }
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
        {url ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className={styles.profileUrl}
          >
            Visit {LABEL}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ) : (
          <span className={styles.profileMissing}>Not found</span>
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
  refreshButton: `
    inline-flex shrink-0 items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  profileUrl: `
    flex items-center gap-1 text-sm text-blue-600 hover:underline break-all
  `,
  profileMissing: `text-sm text-gray-500 italic`,
};
