'use client';

import { useMemo } from 'react';
import { Mail, Phone } from 'lucide-react';
import { useAppSelector } from '@/store/hooks';

type RecentLeadsListRowContactProps = {
  leadId: string;
};

export const RecentLeadsListRowContact = (
  props: RecentLeadsListRowContactProps
) => {
  const { leadId } = props;
  const leadContactActivities = useAppSelector((state) => state.leadContactActivities);
  const leadContacts = useAppSelector((state) => state.leadContacts);

  const topContact = useMemo(() => {
    const contactActivityByContactId = new Map<
      string,
      { count: number; lastActivityAt: string }
    >();

    Object.values(leadContactActivities).forEach((activity) => {
      if (activity.lead_id !== leadId) return;
      const existing = contactActivityByContactId.get(activity.lead_contact_id);
      if (!existing) {
        contactActivityByContactId.set(activity.lead_contact_id, {
          count: 1,
          lastActivityAt: activity.created_at,
        });
        return;
      }
      existing.count += 1;
      if (
        new Date(activity.created_at).getTime() >
        new Date(existing.lastActivityAt).getTime()
      ) {
        existing.lastActivityAt = activity.created_at;
      }
    });

    const topContactActivity = Array.from(contactActivityByContactId.entries()).sort(
      (a, b) => {
        if (b[1].count !== a[1].count) {
          return b[1].count - a[1].count;
        }
        return (
          new Date(b[1].lastActivityAt).getTime() -
          new Date(a[1].lastActivityAt).getTime()
        );
      }
    )[0];

    return topContactActivity ? leadContacts[topContactActivity[0]] : undefined;
  }, [leadContactActivities, leadContacts, leadId]);

  if (!topContact) {
    return (
      <div className={styles.contactBlock}>
        <span className={styles.contactLabel}>No contacts</span>
      </div>
    );
  }

  const email = topContact.email?.trim() || null;
  const phone = topContact.phone?.trim() || null;

  return (
    <div className={styles.contactBlock}>
      <span className={styles.contactLabel}>Top contact</span>
      <p className={styles.contactName}>{topContact.name}</p>
      {email && (
        <span className={styles.contactDetail}>
          <Mail className={styles.icon} aria-hidden />
          {email}
        </span>
      )}
      {phone && (
        <span className={styles.contactDetail}>
          <Phone className={styles.icon} aria-hidden />
          {phone}
        </span>
      )}
    </div>
  );
};

const styles = {
  contactBlock: `
    space-y-0.5 border-t border-slate-200 pt-2
  `,
  contactLabel: `
    text-[10px] font-medium uppercase tracking-wider text-slate-500
  `,
  contactName: `
    text-sm font-medium text-slate-900
  `,
  contactDetail: `
    flex items-center gap-1.5 text-xs text-slate-500
  `,
  icon: `
    h-3 w-3 shrink-0
  `,
};
