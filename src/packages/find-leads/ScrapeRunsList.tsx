'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { getAllLeadsThunk } from '@/store/thunks/leads/getAllLeadsThunk';
import { setCurrentLeadThunk } from '@/store/thunks/leads';
import { getAllGoogleMapsScrapeRunsThunk } from '@/store/thunks/google-maps-scrape-runs';
import { filterLeadsFromGoogleMapsScrapeRun } from '@/utils/leads';
import { LEAD_DETAIL_PATH } from '@/config/routes';
import type { GoogleMapsScrapeRun, GoogleMapsScrapeRunStatus, Lead } from '@/model';

const statusConfig: Record<
  GoogleMapsScrapeRunStatus,
  { label: string; className: string }
> = {
  pending: {
    label: 'Pending',
    className: 'bg-gray-100 text-gray-700',
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-yellow-100 text-yellow-800',
  },
  completed: {
    label: 'Completed',
    className: 'bg-green-100 text-green-800',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-100 text-red-800',
  },
};

const StatusBadge = (props: { status: GoogleMapsScrapeRunStatus }) => {
  const config = statusConfig[props.status];
  return (
    <span className={`${styles.badge} ${config.className}`}>
      {props.status === 'in_progress' && (
        <Loader2 className={styles.badgeSpinner} aria-hidden />
      )}
      {config.label}
    </span>
  );
};

type ScrapeRunLeadsPanelProps = {
  scrapeRun: GoogleMapsScrapeRun;
  leadsForRun: Lead[];
};

const ScrapeRunLeadsPanel = (props: ScrapeRunLeadsPanelProps) => {
  const { scrapeRun, leadsForRun } = props;
  const dispatch = useAppDispatch();
  const router = useRouter();

  const sortedLeads = useMemo(
    () =>
      [...leadsForRun].sort((a, b) => {
        const nameA = (a.business_name || a.name || '').toLowerCase();
        const nameB = (b.business_name || b.name || '').toLowerCase();
        return nameA.localeCompare(nameB);
      }),
    [leadsForRun],
  );

  const openLead = (leadId: string) => {
    dispatch(setCurrentLeadThunk(leadId));
    router.push(LEAD_DETAIL_PATH);
  };

  if (sortedLeads.length === 0) {
    return (
      <div className={styles.detailInner}>
        <p className={styles.detailTitle}>Leads from this scrape</p>
        <p className={styles.detailEmpty}>
          No leads in your workspace match this run yet. New imports use an internal key tied to
          the run; open the Leads page once to refresh the list, or this run may not have created
          any rows (failed run, or every result matched an existing business name).
        </p>
      </div>
    );
  }

  return (
    <div className={styles.detailInner}>
      <p className={styles.detailTitle}>
        Leads from &ldquo;{scrapeRun.name}&rdquo; ({sortedLeads.length})
      </p>
      <ul className={styles.leadList}>
        {sortedLeads.map((lead) => (
          <li key={lead.id} className={styles.leadRow}>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openLead(lead.id);
              }}
              className={styles.leadButton}
            >
              <span className={styles.leadName}>
                {lead.business_name || lead.name || 'Unnamed'}
              </span>
              {lead.address ? (
                <span className={styles.leadMeta}>{lead.address}</span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ScrapeRunsList = () => {
  const dispatch = useAppDispatch();
  const scrapeRunsObj = useAppSelector((s) => s.googleMapsScrapeRuns);
  const scrapeRuns = Object.values(scrapeRunsObj);
  const leadsRecord = useAppSelector((s) => s.leads);
  const [expandedRunId, setExpandedRunId] = useState<string | null>(null);

  useEffect(() => {
    void dispatch(getAllGoogleMapsScrapeRunsThunk());
    void dispatch(getAllLeadsThunk());
  }, [dispatch]);

  const sortedRuns = [...scrapeRuns].sort((a, b) => {
    const tA = a.createdAt instanceof Date ? a.createdAt.getTime() : new Date(a.createdAt).getTime();
    const tB = b.createdAt instanceof Date ? b.createdAt.getTime() : new Date(b.createdAt).getTime();
    return tB - tA;
  });

  const formatDate = (date: Date | string) =>
    new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date instanceof Date ? date : new Date(date));

  const handleRowActivate = (runId: string) => {
    setExpandedRunId((current) => (current === runId ? null : runId));
  };

  const allLeads = useMemo(() => Object.values(leadsRecord), [leadsRecord]);

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Past scrape runs</h2>

      {sortedRuns.length === 0 ? (
        <div className={styles.emptyState}>
          <Search className={styles.emptyIcon} aria-hidden />
          <p className={styles.emptyTitle}>No scrapes yet</p>
          <p className={styles.emptyDescription}>
            Run your first Google Maps search above to start finding leads.
          </p>
        </div>
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr className={styles.theadRow}>
                <th className={styles.thIcon} aria-hidden />
                <th className={styles.th}>Search name</th>
                <th className={styles.th}>Query</th>
                <th className={styles.th}>Status</th>
                <th className={styles.thRight}>Found</th>
                <th className={styles.thRight}>Imported</th>
                <th className={styles.th}>Date</th>
              </tr>
            </thead>
            <tbody>
              {sortedRuns.map((run) => {
                const isOpen = expandedRunId === run.id;
                const leadsForRun = filterLeadsFromGoogleMapsScrapeRun(allLeads, run.id);
                return (
                  <Fragment key={run.id}>
                    <tr
                      className={`${styles.tr} ${isOpen ? styles.trExpanded : ''}`}
                      onClick={() => handleRowActivate(run.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleRowActivate(run.id);
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-expanded={isOpen}
                      aria-label={`${run.name}, ${run.status}. Click to ${isOpen ? 'hide' : 'show'} leads from this scrape.`}
                    >
                      <td className={styles.tdIcon}>
                        <ChevronDown
                          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
                          aria-hidden
                        />
                      </td>
                      <td className={styles.tdName}>{run.name}</td>
                      <td className={styles.tdMuted}>{run.searchQuery}</td>
                      <td className={styles.td}>
                        <StatusBadge status={run.status} />
                      </td>
                      <td className={styles.tdRight}>{run.resultsCount || '—'}</td>
                      <td className={styles.tdRight}>{run.businessesImported || '—'}</td>
                      <td className={styles.tdDate}>{formatDate(run.createdAt)}</td>
                    </tr>
                    {isOpen ? (
                      <tr className={styles.detailTr}>
                        <td colSpan={7} className={styles.detailTd}>
                          <ScrapeRunLeadsPanel scrapeRun={run} leadsForRun={leadsForRun} />
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  section: `space-y-3`,
  sectionTitle: `text-base font-semibold text-gray-900`,
  emptyState: `
    flex flex-col items-center justify-center py-16 rounded-lg border border-gray-200 bg-white
  `,
  emptyIcon: `h-8 w-8 text-gray-300 mb-2`,
  emptyTitle: `text-sm font-medium text-gray-900`,
  emptyDescription: `text-xs text-gray-500 mt-1 text-center max-w-sm px-4`,
  tableWrap: `border border-gray-200 rounded-lg overflow-x-auto bg-white shadow-sm`,
  table: `w-full text-sm border-collapse`,
  theadRow: `bg-gray-50 border-b border-gray-200`,
  th: `
    px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
  `,
  thIcon: `w-10 px-2 py-3`,
  thRight: `
    px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider
  `,
  tr: `
    border-b border-gray-100 last:border-0 hover:bg-gray-50/80 transition-colors cursor-pointer
  `,
  trExpanded: `bg-blue-50/60 hover:bg-blue-50/80`,
  td: `px-3 py-3 text-sm text-gray-700`,
  tdIcon: `px-2 py-3 w-10 align-middle`,
  tdName: `px-3 py-3 text-sm font-medium text-gray-900`,
  tdMuted: `px-3 py-3 text-sm text-gray-600`,
  tdRight: `px-3 py-3 text-sm text-gray-900 text-right tabular-nums`,
  tdDate: `px-3 py-3 text-sm text-gray-500 whitespace-nowrap`,
  chevron: `h-4 w-4 text-gray-400 transition-transform shrink-0`,
  chevronOpen: `rotate-180`,
  detailTr: `bg-gray-50/90 border-b border-gray-100`,
  detailTd: `px-3 py-4`,
  detailInner: `space-y-2 max-w-3xl`,
  detailTitle: `text-xs font-semibold text-gray-700 uppercase tracking-wide`,
  detailEmpty: `text-sm text-gray-600 leading-relaxed`,
  leadList: `space-y-1 list-none pl-0`,
  leadRow: ``,
  leadButton: `
    w-full text-left rounded-md border border-gray-200 bg-white px-3 py-2
    hover:border-blue-300 hover:bg-blue-50/50 transition-colors
  `,
  leadName: `text-sm font-medium text-gray-900 block`,
  leadMeta: `text-xs text-gray-500 block mt-0.5`,
  badge: `
    inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
  `,
  badgeSpinner: `h-3 w-3 animate-spin`,
};
