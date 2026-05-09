/**
 * Mirrors mentorai-server `DEPLOYMENT_PROFILE` for client-side boot behavior.
 * Set `NEXT_PUBLIC_DEPLOYMENT_PROFILE=luckee-core` when the API uses a minimal route set; the open-source
 * Lead Studio UI currently uses the same sidebar for both profiles unless you branch on
 * {@link isLuckeeCoreWebDeployment} in navigation code.
 */

export type PublicDeploymentProfile = 'mentorai-full' | 'luckee-core';

export const getPublicDeploymentProfile = (): PublicDeploymentProfile => {
  const raw = process.env.NEXT_PUBLIC_DEPLOYMENT_PROFILE?.trim().toLowerCase();
  if (raw === 'luckee-core' || raw === 'luckee_core') {
    return 'luckee-core';
  }
  return 'mentorai-full';
};

export const isLuckeeCoreWebDeployment = (): boolean => {
  return getPublicDeploymentProfile() === 'luckee-core';
};
