'use client';

import { useState } from 'react';
import { ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { getPrimaryWebsiteForLead } from '@/utils/leads';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  refreshCurrentLeadThunk,
  runLeadGoogleSearchResearchThunk,
} from '@/store/thunks/leads';

const LABEL = 'LinkedIn';

export const OnlineProfilesLinkedinRow = () => {
  const dispatch = useAppDispatch();
  const lead = useAppSelector((state) => state.currentLead);
  const [isSearching, setIsSearching] = useState(false);

  const website = lead ? getPrimaryWebsiteForLead(lead) : null;
  const url = lead?.linkedin_url?.trim() || null;
  const busy = isSearching;
  const isMissingRequiredWebsite = !website;

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>💼</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{LABEL}</span>
          <button
            type="button"
            className={styles.refreshButton}
            disabled={isMissingRequiredWebsite || busy}
            title={
              isMissingRequiredWebsite
                ? 'Add a website on the lead to search Google for this profile'
                : 'Search Google for this business’s LinkedIn page'
            }
            aria-label={`Find ${LABEL} via Google`}
            onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();

              if (!lead?.id || !website || isSearching) {
                return;
              }

              setIsSearching(true);
              try {
                const result = await dispatch(runLeadGoogleSearchResearchThunk('linkedin'));
                if (!result.ok) {
                  if (result.error === 'website_required') {
                    toast.error(
                      result.message ??
                        'Add a website on this lead before searching for profile links.'
                    );
                  } else {
                    toast.error(result.message ?? 'LinkedIn search failed');
                  }
                  return;
                }

                const refreshStatus = await dispatch(refreshCurrentLeadThunk(lead.id));
                if (refreshStatus !== 200) {
                  toast.error('Search finished but refreshing the lead failed');
                  return;
                }

                if (result.leadUpdated) {
                  toast.success('Profile link updated from Google');
                } else {
                  toast.success('Search finished — no matching LinkedIn URL found');
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
