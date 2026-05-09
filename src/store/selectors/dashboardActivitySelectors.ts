import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../store';

export type DashboardActivityRow = {
  customerId: string;
  customerName: string;
  activityCount: number;
  lastActivityAt: string;
};

export type RecentLeadRow = {
  leadId: string;
  leadName: string;
  leadSummary: string;
  lastActivityAt: string;
};

const sortRows = (rows: DashboardActivityRow[]): DashboardActivityRow[] => {
  return rows.sort((a, b) => {
    if (b.activityCount !== a.activityCount) {
      return b.activityCount - a.activityCount;
    }
    return (
      new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
    );
  });
};

export const selectLeadActivityRows = createSelector(
  [(state: RootState) => state.leadActivities],
  (leadActivities): DashboardActivityRow[] => {
    const grouped = new Map<string, DashboardActivityRow>();
    Object.values(leadActivities).forEach((activity) => {
      const existing = grouped.get(activity.customer_id);
      if (!existing) {
        grouped.set(activity.customer_id, {
          customerId: activity.customer_id,
          customerName: activity.customer_name || 'Unknown customer',
          activityCount: 1,
          lastActivityAt: activity.created_at,
        });
        return;
      }
      existing.activityCount += 1;
      if (
        new Date(activity.created_at).getTime() >
        new Date(existing.lastActivityAt).getTime()
      ) {
        existing.lastActivityAt = activity.created_at;
      }
    });
    return sortRows(Array.from(grouped.values()));
  }
);

export const selectLeadContactActivityRows = createSelector(
  [(state: RootState) => state.leadContactActivities],
  (leadContactActivities): DashboardActivityRow[] => {
    const grouped = new Map<string, DashboardActivityRow>();
    Object.values(leadContactActivities).forEach((activity) => {
      const existing = grouped.get(activity.customer_id);
      if (!existing) {
        grouped.set(activity.customer_id, {
          customerId: activity.customer_id,
          customerName: activity.customer_name || 'Unknown customer',
          activityCount: 1,
          lastActivityAt: activity.created_at,
        });
        return;
      }
      existing.activityCount += 1;
      if (
        new Date(activity.created_at).getTime() >
        new Date(existing.lastActivityAt).getTime()
      ) {
        existing.lastActivityAt = activity.created_at;
      }
    });
    return sortRows(Array.from(grouped.values()));
  }
);

const DASHBOARD_LATEST_LEADS_LIMIT = 6;

/**
 * Six most recently updated leads (by `updated_at`) for the home dashboard grid.
 */
export const selectDashboardLatestLeadRows = createSelector(
  [(state: RootState) => state.leads],
  (leads): RecentLeadRow[] => {
    return Object.values(leads)
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      )
      .slice(0, DASHBOARD_LATEST_LEADS_LIMIT)
      .map((lead) => ({
        leadId: lead.id,
        leadName: lead.business_name || lead.name?.trim() || 'Unnamed lead',
        leadSummary:
          lead.description?.trim() ||
          lead.summary?.content?.trim() ||
          'No summary yet.',
        lastActivityAt: lead.updated_at,
      }));
  }
);

export const selectRecentLeadRows = createSelector(
  [
    (state: RootState) => state.leadActivities,
    (state: RootState) => state.leads,
  ],
  (leadActivities, leads): RecentLeadRow[] => {
    const leadGroups = new Map<
      string,
      { activityCount: number; lastActivityAt: string }
    >();

    Object.values(leadActivities).forEach((activity) => {
      const existing = leadGroups.get(activity.lead_id);
      if (!existing) {
        leadGroups.set(activity.lead_id, {
          activityCount: 1,
          lastActivityAt: activity.created_at,
        });
        return;
      }
      existing.activityCount += 1;
      if (
        new Date(activity.created_at).getTime() >
        new Date(existing.lastActivityAt).getTime()
      ) {
        existing.lastActivityAt = activity.created_at;
      }
    });

    return Array.from(leadGroups.entries())
      .map(([leadId, leadGroup]): RecentLeadRow | null => {
        const lead = leads[leadId];
        if (!lead) return null;

        return {
          leadId,
          leadName: lead.business_name || 'Unnamed lead',
          leadSummary:
            lead.description?.trim() ||
            lead.summary?.content?.trim() ||
            'No summary yet.',
          lastActivityAt: leadGroup.lastActivityAt,
        };
      })
      .filter((row): row is RecentLeadRow => row !== null)
      .sort(
        (a, b) =>
          new Date(b.lastActivityAt).getTime() - new Date(a.lastActivityAt).getTime()
      );
  }
);
