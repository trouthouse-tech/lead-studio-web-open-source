import { unwrapResearchPayloadData } from './unwrap-research-payload-data';

export type FacebookPostHighlight = {
  text: string;
  date: string | null;
  engagement: string | null;
};

export type FacebookPostsDisplay = {
  postCount: number | null;
  themes: string[];
  sentiment: string | null;
  highlights: FacebookPostHighlight[];
  rawFallback: string | null;
};

const collectPostObjects = (data: unknown): unknown[] => {
  const root = unwrapResearchPayloadData(data);
  if (Array.isArray(root)) return root;
  if (root && typeof root === 'object') {
    const o = root as Record<string, unknown>;
    const keys = ['posts', 'data', 'items', 'results', 'feed'] as const;
    for (const k of keys) {
      const v = o[k];
      if (Array.isArray(v)) return v;
    }
  }
  return [];
};

const UNIX_SECONDS_VS_MS_THRESHOLD = 1e12;

const parseNumericEpochToIso = (n: number): string | null => {
  if (!Number.isFinite(n) || n <= 0) return null;
  const ms = n < UNIX_SECONDS_VS_MS_THRESHOLD ? n * 1000 : n;
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString();
};

const parseStringDateToIso = (raw: string): string | null => {
  const t = raw.trim();
  if (!t) return null;
  const parsed = Date.parse(t);
  if (Number.isNaN(parsed)) return null;
  return new Date(parsed).toISOString();
};

const pickDisplayPublishedAt = (o: Record<string, unknown>): string | null => {
  const stringKeys = [
    'time',
    'created_time',
    'createdTime',
    'date',
    'postedAt',
    'postTime',
  ] as const;
  for (const k of stringKeys) {
    const v = o[k];
    if (typeof v === 'string') {
      const iso = parseStringDateToIso(v);
      if (iso) return iso;
    }
  }
  const numericKeys = ['timestamp', 'created_time', 'time', 'date'] as const;
  for (const k of numericKeys) {
    const v = o[k];
    if (typeof v === 'number') {
      const iso = parseNumericEpochToIso(v);
      if (iso) return iso;
    }
  }
  return null;
};

const pickPostFields = (post: unknown): FacebookPostHighlight | null => {
  if (post === null || post === undefined) return null;
  if (typeof post === 'string') {
    return { text: post.slice(0, 2000), date: null, engagement: null };
  }
  if (typeof post !== 'object') return null;
  const o = post as Record<string, unknown>;
  const text =
    (typeof o.message === 'string' && o.message) ||
    (typeof o.text === 'string' && o.text) ||
    (typeof o.story === 'string' && o.story) ||
    (typeof o.content === 'string' && o.content) ||
    (typeof o.body === 'string' && o.body) ||
    '';
  if (!text.trim()) return null;
  const date = pickDisplayPublishedAt(o);
  let engagement: string | null = null;
  if (typeof o.engagement === 'string') engagement = o.engagement;
  else if (o.reactions || o.comments || o.shares) {
    const parts: string[] = [];
    const r = o.reactions;
    const c = o.comments;
    const s = o.shares;
    if (typeof r === 'number') parts.push(`${r} reactions`);
    if (typeof c === 'number') parts.push(`${c} comments`);
    if (typeof s === 'number') parts.push(`${s} shares`);
    if (parts.length) engagement = parts.join(' · ');
  }
  return { text: text.trim().slice(0, 2000), date, engagement };
};

/**
 * Best-effort summary + post list from arbitrary Facebook posts webhook JSON.
 */
export const pickFacebookPostsDisplay = (payload: unknown): FacebookPostsDisplay => {
  const root = unwrapResearchPayloadData(payload);
  const objects = collectPostObjects(payload);
  const highlights = objects
    .map((p) => pickPostFields(p))
    .filter((x): x is FacebookPostHighlight => x !== null)
    .slice(0, 12);

  let themes: string[] = [];
  let sentiment: string | null = null;
  if (root && typeof root === 'object' && !Array.isArray(root)) {
    const o = root as Record<string, unknown>;
    const th = o.themes ?? o.topThemes;
    if (Array.isArray(th)) {
      themes = th.filter((x): x is string => typeof x === 'string').slice(0, 12);
    }
    const sent = o.sentiment ?? o.sentiment_summary ?? o.overallSentiment;
    if (typeof sent === 'string') sentiment = sent;
  }

  const postCount = objects.length > 0 ? objects.length : null;

  const rawFallback =
    highlights.length > 0 || themes.length > 0 || sentiment
      ? null
      : (() => {
          try {
            const sample = unwrapResearchPayloadData(payload);
            return JSON.stringify(sample, null, 2).slice(0, 6000);
          } catch {
            return 'Unable to display posts payload';
          }
        })();

  return {
    postCount,
    themes,
    sentiment,
    highlights,
    rawFallback,
  };
};
