import type { Lead, LeadContact } from '@/model';

export type RecentLeadRow = {
  leadId: string;
  leadName: string;
  leadSummary: string;
  lastActivityAt: string;
};

export type DashboardLatestLeadRow = RecentLeadRow & {
  status: Lead['status'];
  topContactName: string | null;
  topContactEmail: string | null;
};

const DASHBOARD_LATEST_LEADS_LIMIT = 6;

/**
 * Primary contact for a lead (most recently updated).
 */
export const getPrimaryContactForLead = (
  leadId: string,
  leadContacts: Record<string, LeadContact>,
): LeadContact | undefined => {
  return Object.values(leadContacts)
    .filter((contact) => contact.lead_id === leadId)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )[0];
};

/**
 * Six most recently updated leads for the home dashboard table.
 */
export const buildDashboardLatestLeadRows = (
  leads: Record<string, Lead>,
  leadContacts: Record<string, LeadContact>,
): DashboardLatestLeadRow[] => {
  return Object.values(leads)
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, DASHBOARD_LATEST_LEADS_LIMIT)
    .map((lead) => {
      const topContact = getPrimaryContactForLead(lead.id, leadContacts);

      return {
        leadId: lead.id,
        leadName: lead.business_name || lead.name?.trim() || 'Unnamed lead',
        leadSummary:
          lead.description?.trim() ||
          lead.summary?.content?.trim() ||
          'No summary yet.',
        lastActivityAt: lead.updated_at,
        status: lead.status,
        topContactName: topContact?.name ?? null,
        topContactEmail: topContact?.email?.trim() || null,
      };
    });
};

/**
 * Recent leads ordered by latest lead activity.
 */
export const buildRecentLeadRows = (
  leadActivities: Record<string, { lead_id: string; created_at: string }>,
  leads: Record<string, Lead>,
): RecentLeadRow[] => {
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
        new Date(b.lastActivityAt).getTime() -
        new Date(a.lastActivityAt).getTime(),
    );
};
