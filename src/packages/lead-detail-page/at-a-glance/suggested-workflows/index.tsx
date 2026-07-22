'use client';

import { useAppSelector } from '@/store/hooks';

export const SuggestedWorkflowsSection = () => {
  const currentLead = useAppSelector((state) => state.currentLead);
  const workflows =
    currentLead.summary?.recommended_workflows?.filter((w) => w?.workflow_name?.trim()) ??
    [];

  if (workflows.length === 0) {
    return null;
  }

  return (
    <div>
      <p className={styles.miniLabel}>Suggested workflows</p>
      <ul className={styles.workflowList}>
        {workflows.map((w) => (
          <li key={w.workflow_name} className={styles.workflowItem}>
            <span className={styles.workflowName}>{w.workflow_name}</span>
            {w.reason?.trim() ? (
              <span className={styles.workflowReason}>{w.reason.trim()}</span>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles = {
  miniLabel: `text-xs font-medium text-gray-500 mb-1.5`,
  workflowList: `space-y-2`,
  workflowItem: `text-sm text-gray-800`,
  workflowName: `font-medium text-gray-900`,
  workflowReason: `block text-xs text-gray-600 mt-0.5`,
};
