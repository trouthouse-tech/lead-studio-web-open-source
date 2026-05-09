/**
 * True when `pathname` equals any prefix or is nested under it (`/prefix/...`).
 */
export const pathnameMatchesActivePathPrefix = (
  pathname: string,
  prefix: string | readonly string[] | undefined,
): boolean => {
  if (prefix === undefined) return false;
  const prefixes = typeof prefix === 'string' ? [prefix] : prefix;
  return prefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`));
};
