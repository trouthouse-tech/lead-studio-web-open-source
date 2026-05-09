export type StructuredResponseBodyItem = {
  id: string;
  type: 'paragraph' | 'list' | 'plan' | 'subheader';
  content?: string;
  items?: string[];
};

export type StructuredResponseSection = {
  id: string;
  header: string;
  summary?: string;
  body: StructuredResponseBodyItem[];
};

