/**
 * Formats a cost type with emoji for display
 * @param type - LeadCostType or string
 * @returns Formatted string with emoji
 */
export const formatCostType = (type: string): string => {
  switch (type) {
    case 'discovery':
      return '🔍 Discovery';
    case 'website_scrape':
      return '🌐 Website Scrape';
    case 'ai_summary':
      return '✨ AI Summary';
    case 'ai_email':
      return '📧 AI Email';
    case 'ai_contact_extraction':
      return '👥 Contact Extraction';
    case 'other':
      return '📋 Other';
    default:
      return type;
  }
};
