import type { LeadContact } from '@/model/lead-contact';

const byCreatedAt = (a: LeadContact, b: LeadContact) =>
  new Date(a.created_at).getTime() - new Date(b.created_at).getTime();

/**
 * First non-empty email on contacts for this lead (oldest contact first).
 */
export const getPrimaryEmailFromLeadContacts = (
  contacts: LeadContact[]
): string | null => {
  for (const c of [...contacts].sort(byCreatedAt)) {
    const e = c.email?.trim();
    if (e) return e;
  }
  return null;
};

/**
 * First non-empty phone on contacts for this lead (oldest contact first).
 */
export const getPrimaryPhoneFromLeadContacts = (
  contacts: LeadContact[]
): string | null => {
  for (const c of [...contacts].sort(byCreatedAt)) {
    const p = c.phone?.trim();
    if (p) return p;
  }
  return null;
};
