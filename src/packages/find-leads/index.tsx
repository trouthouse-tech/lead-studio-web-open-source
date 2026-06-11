'use client';

import { GoogleMapsScraperForm } from './GoogleMapsScraperForm';
import { SearchResultsPreview } from './SearchResultsPreview';
import { ScrapeRunsList } from './ScrapeRunsList';

export { GoogleMapsScraperForm, SearchResultsPreview, ScrapeRunsList };

export const FindLeads = () => {
  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Search Google Maps by category and city. What you pick lands in Commercial Leads — one flow,
        no copy-paste across tabs.
      </p>
      <SearchResultsPreview />
      <GoogleMapsScraperForm />
      <ScrapeRunsList />
    </div>
  );
};

const styles = {
  wrap: `w-full`,
  intro: `text-sm text-gray-600 mb-4`,
};
