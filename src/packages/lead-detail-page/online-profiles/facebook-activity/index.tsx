'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Gauge, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadLeadFacebookResearchThunk,
  runLeadFacebookPostsResearchThunk,
} from '@/store/thunks/leads';
import { pickFacebookActivityFromPostsPayload } from '@/utils/facebook-research';

const LABEL = 'Facebook activity';

/**
 * Activity score from stored posts research (posts are stored server-side but not listed here).
 */
export const OnlineProfilesFacebookActivityRow = () => {
  const dispatch = useAppDispatch();
  const lead = useAppSelector((state) => state.currentLead);
  const [loadBusy, setLoadBusy] = useState(false);
  const [fetchBusy, setFetchBusy] = useState(false);
  const [scoreBusy, setScoreBusy] = useState(false);
  const [postsPayload, setPostsPayload] = useState<unknown | null>(null);

  const leadId = lead?.id ?? null;
  const hasFacebookUrl = Boolean(lead?.facebook_url?.trim());

  const loadPayload = useCallback(async () => {
    if (!leadId) {
      setPostsPayload(null);
      return;
    }
    setLoadBusy(true);
    try {
      const res = await dispatch(loadLeadFacebookResearchThunk(leadId));
      if (res.status !== 200 || !res.data.posts?.payload) {
        setPostsPayload(null);
        return;
      }
      setPostsPayload(res.data.posts.payload);
    } finally {
      setLoadBusy(false);
    }
  }, [dispatch, leadId]);

  useEffect(() => {
    void loadPayload();
  }, [loadPayload]);

  const activity = pickFacebookActivityFromPostsPayload(postsPayload);
  const busy = fetchBusy || scoreBusy || loadBusy;

  const scoreLine = (() => {
    if (!hasFacebookUrl) {
      return <span className={styles.profileMissing}>Add a Facebook URL first</span>;
    }
    if (activity.score !== null) {
      return (
        <span className={styles.scoreText}>
          <span className={styles.scoreValue}>{activity.score}</span>
          <span className={styles.scoreOutOf}>/100</span>
          {activity.confidence ? (
            <span className={styles.scoreMeta}> · {activity.confidence}</span>
          ) : null}
        </span>
      );
    }
    if (activity.scoreError) {
      return <span className={styles.profileMissing}>Score unavailable</span>;
    }
    return <span className={styles.profileMissing}>Not scored yet — run Score activity</span>;
  })();

  return (
    <div className={styles.profileChip}>
      <span className={styles.profileIcon}>📊</span>
      <div className="min-w-0 flex-1">
        <div className={styles.profileLabelRow}>
          <span className={styles.profileLabel}>{LABEL}</span>
          <div className={styles.actions}>
            <button
              type="button"
              className={styles.iconButton}
              disabled={loadBusy || fetchBusy || !leadId || !hasFacebookUrl}
              title="Retrieve recent posts from Facebook (Apify) — saved on server, not listed here"
              aria-label="Retrieve Facebook posts"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!leadId || !hasFacebookUrl || fetchBusy) return;
                setFetchBusy(true);
                try {
                  const outcome = await dispatch(
                    runLeadFacebookPostsResearchThunk(undefined, { step: 'fetch_posts' })
                  );
                  if (!outcome.ok) {
                    toast.error(outcome.message);
                    return;
                  }
                  toast.success('Facebook posts retrieved and saved');
                  await loadPayload();
                } finally {
                  setFetchBusy(false);
                }
              }}
            >
              {fetchBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Download className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
            <button
              type="button"
              className={styles.iconButton}
              disabled={loadBusy || scoreBusy || !leadId || !hasFacebookUrl}
              title="Compute activity score from saved posts (AI, no new scrape)"
              aria-label="Score Facebook activity"
              onClick={async (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!leadId || !hasFacebookUrl || scoreBusy) return;
                setScoreBusy(true);
                try {
                  const outcome = await dispatch(
                    runLeadFacebookPostsResearchThunk(undefined, { step: 'score_posts' })
                  );
                  if (!outcome.ok) {
                    toast.error(outcome.message);
                    return;
                  }
                  toast.success('Activity score updated');
                  await loadPayload();
                } finally {
                  setScoreBusy(false);
                }
              }}
            >
              {scoreBusy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
              ) : (
                <Gauge className="h-3.5 w-3.5" aria-hidden />
              )}
            </button>
          </div>
        </div>
        {scoreLine}
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
  actions: `inline-flex shrink-0 items-center gap-0.5`,
  iconButton: `
    inline-flex items-center justify-center rounded p-0.5 text-gray-500
    hover:text-[#FF7C1E] hover:bg-orange-50 disabled:opacity-40 disabled:cursor-not-allowed
  `,
  profileMissing: `text-sm text-gray-500 italic`,
  scoreText: `text-sm text-gray-900`,
  scoreValue: `text-lg font-semibold text-[#FF7C1E]`,
  scoreOutOf: `text-sm text-gray-500`,
  scoreMeta: `text-xs text-gray-500`,
};
