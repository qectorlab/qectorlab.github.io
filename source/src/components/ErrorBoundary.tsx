import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

const RELOAD_FLAG = 'qector-chunk-reload';

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('QECTOR site error boundary caught:', error, info.componentStack);
    // A tab opened before a deploy can ask for a route chunk that has since
    // been replaced. Reload once to pick up the current build; the flag stops
    // a reload loop if the chunk is missing for another reason.
    const staleChunk = /dynamically imported module|Importing a module script failed|module script failed/i.test(error.message);
    if (!staleChunk) return;
    try {
      if (window.sessionStorage.getItem(RELOAD_FLAG)) return;
      window.sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      return;
    }
    window.location.reload();
  }

  handleReload = () => {
    this.setState({ hasError: false });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-void px-6">
          <div className="max-w-md text-center card-surface">
            <div className="w-12 h-12 rounded-full bg-cyan-300/10 border border-cyan-300/20 flex items-center justify-center mx-auto mb-4 text-cyan-300 text-xl">
              !
            </div>
            <h1 className="text-xl font-bold text-primary mb-2">Something went wrong</h1>
            <p className="text-secondary text-sm mb-6">
               This page hit an unexpected error. No page data was sent; check the browser console for the local error and reload.
            </p>
            <button onClick={this.handleReload} className="btn-cyan">
              Reload homepage
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
