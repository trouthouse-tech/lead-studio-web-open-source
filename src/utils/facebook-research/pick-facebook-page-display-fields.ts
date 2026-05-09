import { unwrapResearchPayloadData } from './unwrap-research-payload-data';

export type FacebookPageDisplay = {
  name: string;
  category: string | null;
  about: string | null;
  email: string | null;
  followers: string | null;
  likes: string | null;
  rawFallback: string | null;
};

const asTrimmedString = (v: unknown): string | null => {
  if (v === null || v === undefined) return null;
  if (typeof v === 'number' && !Number.isNaN(v)) return v.toLocaleString();
  if (typeof v === 'string' && v.trim()) return v.trim();
  return null;
};

/**
 * Best-effort display fields from arbitrary Facebook page webhook JSON.
 */
export const pickFacebookPageDisplayFields = (
  payload: unknown
): FacebookPageDisplay => {
  const root = unwrapResearchPayloadData(payload);
  if (root === null || root === undefined) {
    return {
      name: 'Facebook page',
      category: null,
      about: null,
      email: null,
      followers: null,
      likes: null,
      rawFallback: null,
    };
  }
  if (typeof root !== 'object') {
    return {
      name: 'Facebook page',
      category: null,
      about: typeof root === 'string' ? root : null,
      email: null,
      followers: null,
      likes: null,
      rawFallback:
        typeof root === 'string' ? null : String(root).slice(0, 2000),
    };
  }
  const o = root as Record<string, unknown>;
  const str = (k: string) => asTrimmedString(o[k]);
  const name =
    str('name') ??
    str('pageName') ??
    str('title') ??
    str('page_title') ??
    str('pageTitle') ??
    'Facebook page';
  const about =
    str('about') ?? str('description') ?? str('bio') ?? str('intro') ?? null;
  const category =
    str('category') ?? str('type') ?? str('page_category') ?? null;
  const email = str('email') ?? str('businessEmail') ?? str('contactEmail') ?? null;
  const followers =
    str('followers') ??
    str('fan_count') ??
    str('fans') ??
    str('followersCount') ??
    str('intlFollowersCount') ??
    null;
  const likes =
    str('likes') ??
    str('page_likes') ??
    str('like_count') ??
    str('likesCount') ??
    str('intlLikesCount') ??
    null;
  const hasStructured =
    name !== 'Facebook page' || about || category || followers || likes || email;
  const rawFallback =
    hasStructured
      ? null
      : (() => {
          try {
            return JSON.stringify(o, null, 2).slice(0, 4000);
          } catch {
            return 'Unable to display page payload';
          }
        })();
  return { name, category, about, email, followers, likes, rawFallback };
};
