import { DateTime } from 'luxon';
import type { LeadContactEmailQueue } from '@/model/lead-contact-email-queue';

const EST = 'America/New_York';

/**
 * Counts queued items per Eastern calendar day (YYYY-MM-DD) from scheduled_at.
 */
export const countQueuedByEstDay = (
  items: Iterable<LeadContactEmailQueue>
): Map<string, number> => {
  const map = new Map<string, number>();
  for (const item of items) {
    if (item.status !== 'queued') continue;
    const key = DateTime.fromISO(item.scheduled_at, { zone: 'utc' })
      .setZone(EST)
      .toFormat('yyyy-MM-dd');
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return map;
};
