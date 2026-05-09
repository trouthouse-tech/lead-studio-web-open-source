'use client';

import { LeadsHeaderAddLeadButton } from './add-lead';
import { LeadsHeaderAutoCategorizeUncategorizedButton } from './auto-categorize-uncategorized';
import { LeadsHeaderResearchLeadsButton } from './research-leads';

export const LeadsHeaderButtons = () => {
  return (
    <div className={styles.row}>
      <LeadsHeaderAutoCategorizeUncategorizedButton />
      <LeadsHeaderResearchLeadsButton />
      <LeadsHeaderAddLeadButton />
    </div>
  );
};

const styles = {
  row: `flex flex-wrap items-center justify-end gap-1.5 shrink-0`,
};
