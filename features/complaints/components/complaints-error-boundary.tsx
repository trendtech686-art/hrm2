'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary for Complaints Feature
 * Catches errors in component tree and displays a fallback UI
 */
export class ComplaintsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error for debugging
    console.error('[ComplaintsErrorBoundary]', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8">
          <div className="bg-destructive/10 rounded-full p-4 mb-4">
            <AlertTriangle className="h-12 w-12 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Đã xảy ra lỗi</h2>
          <p className="text-muted-foreground text-center mb-6 max-w-md">
            {this.state.error?.message || 'Có lỗi không mong muốn xảy ra khi tải khiếu nại.'}
          </p>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/complaints'}
            >
              Quay lại danh sách
            </Button>
            <Button
              onClick={this.handleReset}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook to handle errors with toast notification
 */
export function useComplaintErrorHandler() {
  const handleError = (error: Error, context?: string) => {
    console.error(`[Complaints] Error${context ? ` in ${context}` : ''}:`, error);
    toast.error(
      <div className="flex flex-col gap-1">
        <span className="font-semibold">Đã xảy ra lỗi</span>
        <span className="text-sm text-muted-foreground">{error.message}</span>
      </div>,
      { duration: 5000 }
    );
  };

  return { handleError };
}
