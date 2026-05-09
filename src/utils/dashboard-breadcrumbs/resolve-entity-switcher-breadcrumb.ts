import type { AppLayoutBreadcrumb } from '@/components/app-layout-header/app-layout-breadcrumb';
import type {
  BreadcrumbSegmentEntitySwitcher,
} from '@/model/breadcrumb';
import type { Lead } from '@/model/lead';
import type { AppDispatch } from '@/store';
import { setCurrentLeadThunk } from '@/store/thunks/leads/setCurrentLeadThunk';

const leadMenuLabel = (lead: Lead): string =>
  lead.business_name?.trim() || lead.name?.trim() || 'Lead';

const sortLeadsByMenuLabel = (rows: Lead[]): Lead[] =>
  [...rows].sort((a, b) => leadMenuLabel(a).localeCompare(leadMenuLabel(b)));

/**
 * Dumps + dispatch needed to resolve an `entitySwitcher` segment into a header breadcrumb with menus.
 */
export type EntitySwitcherResolveContext = {
  dispatch: AppDispatch;
  leads: Record<string, Lead>;
};

/**
 * Builds one header breadcrumb (with dropdown) for a lead `entitySwitcher` segment.
 */
export const resolveEntitySwitcherBreadcrumb = (
  ctx: EntitySwitcherResolveContext,
  segment: BreadcrumbSegmentEntitySwitcher,
): AppLayoutBreadcrumb => {
  const { dispatch, leads } = ctx;
  const { currentId, isPendingSelection } = segment;
  const list = sortLeadsByMenuLabel(Object.values(leads));
  const current = leads[currentId] ?? null;
  const label = current ? leadMenuLabel(current) : '…';
  return {
    label,
    isPendingSelection,
    menuItems: list.map((row) => ({
      label: leadMenuLabel(row),
      isActive: row.id === currentId,
      onSelect: () => void dispatch(setCurrentLeadThunk(row.id)),
    })),
  };
};
