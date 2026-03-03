import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[Lumina ErrorBoundary]', error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-8">
          <div className="max-w-md w-full bg-[#0f0f0f] border border-red-500/20 rounded-2xl p-8 text-center shadow-[0_0_60px_-20px_rgba(239,68,68,0.3)]">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-500/10 rounded-full border border-red-500/20">
                <AlertTriangle size={28} className="text-red-400" />
              </div>
            </div>
            <h2 className="text-xl font-light text-white mb-2">Something went wrong</h2>
            <p className="text-neutral-500 text-sm mb-1">
              {this.state.error?.message ?? 'An unexpected error occurred.'}
            </p>
            <p className="text-neutral-700 text-xs font-mono mb-6 break-all">
              {this.state.error?.name}
            </p>
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-semibold rounded-xl hover:bg-neutral-200 transition-colors"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
