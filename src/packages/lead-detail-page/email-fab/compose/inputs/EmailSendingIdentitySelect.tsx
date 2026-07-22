'use client';

import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { CurrentLeadContactEmailActions } from '@/store/current';
import { getAllEmailSendingIdentitiesThunk } from '@/store/thunks/email-sending-identities';

/**
 * From-address picker when email_sending_identities rows exist on the server.
 */
export const EmailSendingIdentitySelect = () => {
  const dispatch = useAppDispatch();
  const currentLeadContactEmail = useAppSelector((s) => s.currentLeadContactEmail);
  const selectedId = currentLeadContactEmail.email_sending_identity_id;
  const identitiesRecord = useAppSelector((s) => s.emailSendingIdentities);
  const identities = useMemo(
    () =>
      Object.values(identitiesRecord).sort(
        (a, b) => a.sort_order - b.sort_order || a.label.localeCompare(b.label),
      ),
    [identitiesRecord],
  );

  useEffect(() => {
    void dispatch(getAllEmailSendingIdentitiesThunk());
  }, [dispatch]);

  if (identities.length === 0) {
    return (
      <p className={styles.hint}>
        Default From uses <code className={styles.code}>GMAIL_SEND_AS_EMAIL</code> on
        lead-studio-express-server. See Settings → Email setup.
      </p>
    );
  }

  return (
    <label className={styles.label}>
      <span className={styles.labelText}>From</span>
      <select
        className={styles.select}
        value={selectedId}
        onChange={(e) =>
          dispatch(
            CurrentLeadContactEmailActions.updateFields({
              email_sending_identity_id: e.target.value,
            })
          )
        }
      >
        <option value="">Server default (GMAIL_SEND_AS_EMAIL)</option>
        {identities.map((row) => (
          <option key={row.id} value={row.id}>
            {row.label} ({row.from_email})
          </option>
        ))}
      </select>
    </label>
  );
};

const styles = {
  hint: `text-xs text-gray-500 leading-relaxed`,
  code: `font-mono text-[11px] bg-gray-100 px-1 rounded`,
  label: `flex flex-col gap-1`,
  labelText: `text-xs font-medium text-gray-600`,
  select: `
    rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm text-gray-900
  `,
};
