'use client';

import { useAppSelector } from '@/store/hooks';
import { hasWebsiteFactsContent } from '@/utils/leads';
import { BusinessModelFact } from '../business-model';
import { CertificationsOrLicensesFact } from '../certifications-or-licenses';
import { PrimaryServicesFact } from '../primary-services';
import { ResidentialVsCommercialFact } from '../residential-vs-commercial';
import { ServiceAreaFact } from '../service-area';
import { TeamSizeFact } from '../team-size';
import { YearsInBusinessFact } from '../years-in-business';

/**
 * Renders the “Key facts” block when any website fact field is populated on `currentLead`.
 */
export const KeyFactsSection = () => {
  const lead = useAppSelector((state) => state.currentLead);

  if (!hasWebsiteFactsContent(lead)) {
    return null;
  }

  return (
    <div>
      <p className={styles.miniLabel}>Key facts</p>
      <dl className={styles.factsGrid}>
        <ResidentialVsCommercialFact />
        <BusinessModelFact />
        <PrimaryServicesFact />
        <ServiceAreaFact />
        <YearsInBusinessFact />
        <TeamSizeFact />
        <CertificationsOrLicensesFact />
      </dl>
    </div>
  );
};

const styles = {
  miniLabel: `text-xs font-medium text-gray-500 mb-1.5`,
  factsGrid: `space-y-2`,
};
