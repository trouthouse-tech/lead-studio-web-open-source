import type { LeadCostType } from '@/model/lead-cost';

export const LEAD_COST_TYPE_OPTIONS: { value: LeadCostType; label: string }[] = [
  { value: 'design_tool', label: 'Design tool (e.g. Lovable credits)' },
  { value: 'discovery', label: 'Discovery' },
  { value: 'website_scrape', label: 'Website scrape' },
  { value: 'ai_summary', label: 'AI summary' },
  { value: 'ai_email', label: 'AI email' },
  { value: 'ai_contact_extraction', label: 'AI contact extraction' },
  { value: 'other', label: 'Other' },
];

export const leadCostTypeLabel = (type: LeadCostType): string => {
  const found = LEAD_COST_TYPE_OPTIONS.find((o) => o.value === type);
  return found?.label ?? type;
};
