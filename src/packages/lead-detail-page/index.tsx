'use client';

import { useAppSelector } from '@/store/hooks';
import { DetailHeader } from './header';
import { EditModal } from './edit';
import { Contacts } from './contacts';
import { ResearchSummarySection } from './at-a-glance';
import { ResearchOnlineProfilesSection } from './online-profiles';
import { CostsTable } from './costs';
import { EmailFab } from './email-fab';

export const LeadDetailPage = () => {
  const lead = useAppSelector((state) => state.currentLead);

  if (!lead.id) {
    return (
      <div className={styles.wrap}>
        <p className={styles.empty}>
          Lead not found. It may not be loaded yet or the ID may be invalid.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.wrap}>
      <DetailHeader />

      <div className={styles.researchGrid}>
        <ResearchSummarySection />
        <ResearchOnlineProfilesSection />
      </div>

      <div className={styles.twoCol}>
        <Contacts />
        <CostsTable />
      </div>
      <EditModal />
      <EmailFab />
    </div>
  );
};

const styles = {
  wrap: `w-full space-y-6`,
  empty: `text-gray-500 py-4`,
  researchGrid: `grid grid-cols-1 lg:grid-cols-2 gap-5`,
  twoCol: `grid grid-cols-1 lg:grid-cols-2 gap-6`,
};
