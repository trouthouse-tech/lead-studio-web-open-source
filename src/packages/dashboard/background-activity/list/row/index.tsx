'use client';

import { useRouter } from 'next/navigation';
import type { RecentLeadRow } from '@/store/selectors';
import { useAppDispatch } from '@/store/hooks';
import { setCurrentLeadThunk } from '@/store/thunks/leads';
import { LEAD_DETAIL_PATH } from '@/config';
import { formatDateMonDayYear } from '@/utils/date-time';
import { RecentLeadsListRowBusiness } from './business';
import { RecentLeadsListRowContact } from './contact';

type RecentLeadsListRowProps = {
  row: RecentLeadRow;
};

export const RecentLeadsListRow = (props: RecentLeadsListRowProps) => {
  const { row } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleOpenLead = () => {
    void dispatch(setCurrentLeadThunk(row.leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpenLead();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className={styles.card}
      onClick={handleOpenLead}
      onKeyDown={handleKeyDown}
    >
      <div className={styles.body}>
        <RecentLeadsListRowBusiness
          leadName={row.leadName}
          leadSummary={row.leadSummary}
        />
        <RecentLeadsListRowContact leadId={row.leadId} />
      </div>
      <div className={styles.footer}>
        <span className={styles.lastActivity}>
          {formatDateMonDayYear(row.lastActivityAt)}
        </span>
      </div>
    </div>
  );
};

const styles = {
  card: `
    flex w-full cursor-pointer flex-col rounded-lg border border-slate-200 bg-white
    px-4 pb-4 pt-4 text-left shadow-sm transition-shadow
    hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-400
  `,
  body: `
    flex min-h-0 flex-1 flex-col gap-3
  `,
  footer: `
    mt-auto pt-2 text-right
  `,
  lastActivity: `
    text-[11px] text-slate-500
  `,
};
