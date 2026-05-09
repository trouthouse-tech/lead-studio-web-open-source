import { defineConfig, globalIgnores } from 'eslint/config';
import nextTs from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';

/** @see https://nextjs.org/docs/app/api-reference/config/eslint */
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
  {
    rules: {
      // Incrementally tighten: existing patterns use `any` in API wrappers.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Many legitimate “sync local state from props” flows trigger false positives.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]);

export default eslintConfig;
