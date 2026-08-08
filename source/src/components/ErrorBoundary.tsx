import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('QECTOR site error boundary caught:', error, info.componentStack);
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
              This page hit an unexpected error. This has been logged locally - reloading usually resolves it.
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
