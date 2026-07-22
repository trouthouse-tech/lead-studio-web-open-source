'use client';

import { useAppSelector } from '@/store/hooks';
import { useRouter } from 'next/navigation';
import { LEAD_DETAIL_PATH } from '@/config/routes';
import { LeadContactChatColumn } from './chat-column';
import { LeadContactBuilderColumn } from './builder-column';
import { LeadContactEditModal } from './edit';
import { LeadContactEmailModal } from './email-modal';

/**
 * Lead contact studio: chat column + builder column (session context = `currentLeadContact`).
 * Open via `openLeadContactDetailThunk` then `router.push(LEAD_CONTACT_DETAIL_PATH)` (ADR 008).
 */
export const LeadContactDetailPage = () => {
  const router = useRouter();
  const currentLeadContact = useAppSelector((s) => s.currentLeadContact);

  if (!currentLeadContact.id) {
    return (
      <div className={styles.fallback}>
        <p className={styles.muted}>No contact selected.</p>
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
