'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { reportUiError } from '@/api/ui-errors';

type Props = {
  children: ReactNode;
  componentName?: string;
};

type State = {
  hasError: boolean;
};

/**
 * Catches render errors in the dashboard tree and reports them via `reportUiError`.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    const routePath =
      typeof window !== 'undefined' ? window.location.pathname : '';
    reportUiError({
      event: 'dashboardErrorBoundary',
      message: error.message || 'Unknown render error',
      stack: error.stack ?? info.componentStack ?? null,
      routePath,
      componentName: this.props.componentName ?? 'ErrorBoundary',
      severity: 'fatal',
    });
    console.error('❌ ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles.wrap}>
          <h1 className={styles.title}>Something went wrong</h1>
          <p className={styles.body}>
            This page hit an unexpected error. Refresh to try again, or go back
            to the dashboard.
          </p>
          <button
            type="button"
            className={styles.button}
            onClick={() => {
              this.setState({ hasError: false });
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}
          >
            Refresh page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const styles = {
  wrap: `
    mx-auto flex max-w-lg flex-col items-start gap-3 px-6 py-16
  `,
  title: `text-lg font-semibold text-gray-900`,
  body: `text-sm text-gray-600 leading-relaxed`,
  button: `
    rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium
    text-gray-800 hover:bg-gray-50
  `,
};
