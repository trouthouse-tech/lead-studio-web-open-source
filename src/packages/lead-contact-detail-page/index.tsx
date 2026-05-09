'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadLeadContactDetailThunk } from '@/store/thunks/lead-contacts';
import { LEAD_DETAIL_PATH } from '@/config/routes';
import { LeadContactChatColumn } from './chat-column';
import { LeadContactBuilderColumn } from './builder-column';
import { LeadContactEditModal } from './edit';
import { LeadContactEmailModal } from './email-modal';

type Props = {
  leadId: string;
  contactId: string;
};

/**
 * Lead contact studio: chat column + builder column (session context = `currentLeadContact`).
 */
export const LeadContactDetailPage = (props: Props) => {
  const { leadId, contactId } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setNotFound(false);
      const code = await dispatch(loadLeadContactDetailThunk(leadId, contactId));
      setLoading(false);
      if (code === 404) setNotFound(true);
    };
    void run();
  }, [dispatch, leadId, contactId]);

  if (loading) {
    return (
      <div className={styles.fallback}>
        <p className={styles.muted}>Loading contact…</p>
      </div>
    );
  }

  if (notFound || !currentLeadContact.id) {
    return (
      <div className={styles.fallback}>
        <p className={styles.muted}>Contact not found.</p>
        <button
          type="button"
          className={styles.linkBtn}
          onClick={() => router.push(LEAD_DETAIL_PATH)}
        >
          Back to lead
        </button>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      <div className={styles.shell}>
        <div className={styles.chatPane}>
          <LeadContactChatColumn />
        </div>
        <div className={styles.divider} aria-hidden />
        <div className={styles.builderPane}>
          <LeadContactBuilderColumn />
        </div>
      </div>
      <LeadContactEditModal />
      <LeadContactEmailModal />
    </div>
  );
};

const styles = {
  fallback: `w-full space-y-4`,
  muted: `text-center text-gray-500 py-12`,
  linkBtn: `
    mt-2 text-sm text-blue-600 hover:underline block mx-auto border-none bg-transparent cursor-pointer
  `,
  root: `
    flex w-full min-w-0 flex-col
    max-lg:flex-none max-lg:min-h-0
    lg:min-h-0 lg:flex-1
  `,
  shell: `
    flex w-full min-w-0 flex-col gap-4 bg-zinc-50
    lg:flex-1 lg:min-h-0 lg:flex-row lg:gap-5 lg:overflow-hidden
  `,
  chatPane: `
    flex min-w-0 flex-col border border-gray-200
    max-lg:w-full max-lg:flex-none max-lg:shrink-0
    lg:min-h-0 lg:flex-1 lg:max-w-[55%]
  `,
  divider: `
    hidden lg:block w-px shrink-0 bg-gray-300 self-stretch
  `,
  builderPane: `
    flex min-w-0 flex-col overflow-hidden rounded-sm flex-1
    max-lg:w-full max-lg:flex-none max-lg:shrink-0
    lg:h-full lg:w-[45%] lg:max-w-[45%] lg:min-h-0
  `,
} as const;
