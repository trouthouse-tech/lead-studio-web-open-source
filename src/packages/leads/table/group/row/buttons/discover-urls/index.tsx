'use client';

import { Loader2, Search } from 'lucide-react';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeadBuilderActions } from '@/store/builders';
import {
  refreshLeadRecordThunk,
  runLeadPlaywrightWebsiteUrlDiscoveryThunk,
} from '@/store/thunks/leads';
import type { Lead } from '@/model';
import {
  getLeadResearchIndicators,
  getPrimaryWebsiteForLead,
  PLAYWRIGHT_WEBSITE_URL_DISCOVERY_RUN_DISABLED_TITLE,
} from '@/utils/leads';
import { leadsTableResearchStyles as rs } from '../research-styles';

type Props = {
  lead: Lead;
};

export const LeadsTableRowResearchDiscoverUrls = (props: Props) => {
  const { lead } = props;
  const dispatch = useAppDispatch();
  const researchBusyKind = useAppSelector(
    (s) => s.leadBuilder.leadsTableRowResearchBusyByLeadId[lead.id]
  );
  const researchIndicators = getLeadResearchIndicators(lead);
  const primaryWebsite = getPrimaryWebsiteForLead(lead);
  const canRunGoogleDiscovery = !!primaryWebsite;
  const playwrightDiscoveryAlreadyUsed =
    lead.playwright_website_url_discovery_attempted === true;
  const researchBusy = researchBusyKind !== undefined;

  const handleGoogleDiscovery = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canRunGoogleDiscovery || playwrightDiscoveryAlreadyUsed || researchBusy) return;
    dispatch(
      LeadBuilderActions.setLeadsTableRowResearchBusy({
        leadId: lead.id,
        kind: 'siteUrls',
      })
    );
    try {
      const result = await dispatch(
        runLeadPlaywrightWebsiteUrlDiscoveryThunk(lead.id)
      );
      if (!result.ok) {
        if (result.error === 'playwright_website_url_discovery_already_attempted') {
          toast.error(
            result.message ??
              'Site page URL discovery can only be run once per lead. Edit URLs on the lead manually if needed.'
          );
          return;
        }
        toast.error(result.message ?? 'Site page URL discovery failed');
        return;
      }

      const refreshStatus = await dispatch(refreshLeadRecordThunk(lead.id));
      if (refreshStatus !== 200) {
        toast.error('Site page discovery finished but refreshing the lead failed');
        return;
      }

      if (result.leadUpdated) {
        toast.success(
          `Found ${result.linkCount} page URL${result.linkCount === 1 ? '' : 's'} from the site`
        );
      } else {
        toast.success('Site page discovery finished — no new URLs added');
      }
    } finally {
      dispatch(
        LeadBuilderActions.setLeadsTableRowResearchBusy({
          leadId: lead.id,
          kind: null,
        })
      );
    }
  };

  const isSiteUrlsSpinning = researchBusyKind === 'siteUrls';

  return (
    <span className={rs.researchButtonWrap}>
      <button
        type="button"
        className={rs.researchIconButton}
        disabled={
          !canRunGoogleDiscovery || playwrightDiscoveryAlreadyUsed || researchBusy
        }
        title={
          !canRunGoogleDiscovery
            ? 'Add a website on the lead before discovering extra page URLs'
            : playwrightDiscoveryAlreadyUsed
              ? PLAYWRIGHT_WEBSITE_URL_DISCOVERY_RUN_DISABLED_TITLE
              : researchIndicators.googleDiscovery
                ? 'Discover page URLs from nav/footer (Playwright) · Extra URLs on lead'
                : 'Discover page URLs from nav/footer (Playwright)'
        }
        aria-label="Discover site page URLs with Playwright"
        onClick={handleGoogleDiscovery}
      >
        {isSiteUrlsSpinning ? (
          <Loader2 className={`${rs.researchIcon} animate-spin`} aria-hidden />
        ) : (
          <Search className={rs.researchIcon} aria-hidden />
        )}
      </button>
      {researchIndicators.googleDiscovery && !isSiteUrlsSpinning ? (
        <span
          className={rs.researchDataDot}
          title="Same-domain URLs on lead"
          aria-hidden
        />
      ) : null}
    </span>
  );
};
