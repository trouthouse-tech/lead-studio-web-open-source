import type { LovableDesignPromptResult } from '@/model';

export const postLeadLovableDesignPromptForLead = async (
  leadId: string,
  notes: string
): Promise<LovableDesignPromptResult> => {
  const response = await fetch(
    `/api/leads/${encodeURIComponent(leadId)}/lovable-design-prompt`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes }),
    }
  );

  const raw = await response.text();
  let json: { success?: boolean; error?: string; prompt?: string };
  try {
    json = JSON.parse(raw) as { success?: boolean; error?: string; prompt?: string };
  } catch {
    throw new Error(
      response.status === 404
        ? 'Lovable design prompt route was not found. Set EXPRESS_SERVER_URL to your mentorai-server base (e.g. http://localhost:3005) and restart both servers.'
        : 'Server returned a non-JSON response. Check the Network tab and EXPRESS_SERVER_URL.'
    );
  }

  if (!response.ok || !json.success || typeof json.prompt !== 'string' || !json.prompt.trim()) {
    throw new Error(json.error ?? 'Failed to generate Lovable design prompt');
  }

  return { prompt: json.prompt.trim() };
};
