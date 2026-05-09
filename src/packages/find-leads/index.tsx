'use client';

import { GoogleMapsScraperForm } from './GoogleMapsScraperForm';
import { SearchResultsPreview } from './SearchResultsPreview';
import { ScrapeRunsList } from './ScrapeRunsList';

export { GoogleMapsScraperForm, SearchResultsPreview, ScrapeRunsList };

export const FindLeads = () => {
  return (
    <div className={styles.wrap}>
      <p className={styles.intro}>
        Search Google Maps for local businesses. Matches are saved as leads in your pipeline
        automatically.
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
