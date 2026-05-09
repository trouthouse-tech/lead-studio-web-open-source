import type { Lead } from '@/model';
import { createEmptyLead } from '../../current/create-empty-lead';

/**
 * Placeholder `Lead` used only while the manual-create modal is open.
 * The server assigns real ids and timestamps on POST.
 */
export const buildManualLeadCreationDraftLead = (): Lead => createEmptyLead();
