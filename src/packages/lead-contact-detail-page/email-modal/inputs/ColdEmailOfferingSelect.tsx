'use client';

import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { COLD_EMAIL_OFFERINGS_PATH } from '@/config/routes';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { getAllColdEmailOfferingsThunk } from '@/store/thunks/cold-email-offerings';
import { ColdEmailOfferingReference } from './ColdEmailOfferingReference';

type Props = {
  variant: 'modal' | 'fab' | 'drawer';
};

/**
 * Picker plus visible reference for the cold email offering used to shape this draft.
 */
export const ColdEmailOfferingSelect = (props: Props) => {
  const { variant } = props;
  const dispatch = useAppDispatch();
  const currentEmail = useAppSelector((state) => state.currentLeadContactEmail);
  const offeringsById = useAppSelector((state) => state.coldEmailOfferings);

  const offerings = useMemo(
    () =>
      Object.values(offeringsById)
        .filter((row) => !row.is_archived)
        .sort((a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title)),
    [offeringsById],
  );

  const selected = currentEmail.cold_email_offering_id
    ? offeringsById[currentEmail.cold_email_offering_id]
    : undefined;

  useEffect(() => {
    void dispatch(getAllColdEmailOfferingsThunk());
  }, [dispatch]);

  return (
    <section className={styles.section(variant)}>
      <div className={styles.headerRow}>
        <label className={styles.label} htmlFor="cold-email-offering-select">
          Outreach offering
        </label>
        <Link href={COLD_EMAIL_OFFERINGS_PATH} className={styles.manageLink}>
          Manage offerings
        </Link>
      </div>

      {offerings.length === 0 ? (
        <div className={styles.emptyBox}>
          <p className={styles.emptyTitle}>No offerings loaded</p>
          <p className={styles.emptyText}>
            Create outreach angles on the offerings page (or run the seed SQL), then pick one here
            while you write.
          </p>
          <Link href={COLD_EMAIL_OFFERINGS_PATH} className={styles.emptyCta}>
            Go to cold email offerings
          </Link>
        </div>
      ) : (
        <>
          <select
            id="cold-email-offering-select"
            className={styles.select}
            value={currentEmail.cold_email_offering_id}
            onChange={(e) =>
              dispatch(
                CurrentLeadContactEmailActions.updateFields({
                  cold_email_offering_id: e.target.value,
                }),
              )
            }
          >
            <option value="">Choose an offering…</option>
            {offerings.map((offering) => (
              <option key={offering.id} value={offering.id}>
                {offering.title}
              </option>
            ))}
          </select>

          {selected ? (
            <ColdEmailOfferingReference offering={selected} variant={variant} />
          ) : (
            <p className={styles.pickPrompt}>
              Select an offering above to see the hook and context while you draft subject and
              body.
            </p>
          )}
        </>
      )}
    </section>
  );
};

const styles = {
  section: (variant: Props['variant']) =>
    `rounded-lg border border-zinc-200 bg-zinc-50/80 p-3 space-y-2 ${
      variant === 'fab' ? 'mb-2' : 'mb-3'
    }`,
  headerRow: `flex items-center justify-between gap-2`,
  label: `text-xs font-semibold uppercase tracking-wide text-zinc-600`,
  manageLink: `text-xs font-medium text-blue-700 hover:text-blue-900 hover:underline shrink-0`,
  select: `w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900`,
  pickPrompt: `text-xs leading-relaxed text-zinc-500`,
  emptyBox: `rounded-md border border-amber-200 bg-amber-50 px-3 py-2.5 space-y-1.5`,
  emptyTitle: `text-sm font-semibold text-amber-950`,
  emptyText: `text-xs leading-relaxed text-amber-900`,
  emptyCta: `inline-block text-xs font-semibold text-amber-950 underline hover:no-underline`,
};
