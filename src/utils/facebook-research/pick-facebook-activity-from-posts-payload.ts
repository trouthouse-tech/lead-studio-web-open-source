export type FacebookActivityScoreDisplay = {
  score: number | null;
  confidence: string | null;
  postingPattern: string | null;
  evidence: string | null;
  limitations: string | null;
  scoreError: string | null;
};

const emptyDisplay = (): FacebookActivityScoreDisplay => ({
  score: null,
  confidence: null,
  postingPattern: null,
  evidence: null,
  limitations: null,
  scoreError: null,
});

/**
 * Reads activity score fields from `lead_facebook_posts_research.payload` (server JSONB).
 */
export const pickFacebookActivityFromPostsPayload = (
  payload: unknown
): FacebookActivityScoreDisplay => {
  if (!payload || typeof payload !== 'object') {
    return emptyDisplay();
  }
  const o = payload as Record<string, unknown>;
  const scoreError =
    typeof o.activityScoreError === 'string' && o.activityScoreError.trim()
      ? o.activityScoreError.trim()
      : null;

  const block = o.activityScore;
  if (!block || typeof block !== 'object') {
    return { ...emptyDisplay(), scoreError };
  }
  const a = block as Record<string, unknown>;
  const scoreRaw = a.activityScore;
  const score =
    typeof scoreRaw === 'number' && Number.isFinite(scoreRaw)
      ? Math.round(Math.min(100, Math.max(0, scoreRaw)))
      : null;
  const confidence = typeof a.confidence === 'string' ? a.confidence : null;
  const postingPattern =
    typeof a.postingPattern === 'string' ? a.postingPattern : null;
  const evidence = typeof a.evidence === 'string' ? a.evidence : null;
  const limitations = typeof a.limitations === 'string' ? a.limitations : null;

  return {
    score,
    confidence,
    postingPattern,
    evidence,
    limitations,
    scoreError,
  };
};
