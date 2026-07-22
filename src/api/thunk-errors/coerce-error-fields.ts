/**
 * Coerces unknown thrown values into message + stack for error reporting.
 */
export const coerceErrorFields = (error: unknown): { message: string; stack: string | null } => {
  if (error instanceof Error) {
    return { message: error.message, stack: error.stack ?? null };
  }

  if (typeof error === 'string') {
    return { message: error, stack: null };
  }

  try {
    return { message: JSON.stringify(error), stack: null };
  } catch {
    return { message: String(error), stack: null };
  }
};
