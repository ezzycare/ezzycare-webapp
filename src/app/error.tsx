'use client';

import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import { AlertTriangle, Lock, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string; status?: number };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    // Log the error to a service (Sentry, LogRocket, etc.)
    console.error(error);
  }, [error]);

  let title = 'Something went wrong';
  let message = 'An unexpected error occurred. Please try again.';
  let icon = <AlertTriangle className="w-8 h-8 text-error" />;

  // Handle common HTTP status codes if provided
  if ('status' in error) {
    switch (error.status) {
      case 401:
        title = 'Unauthorized';
        message = 'You do not have permission to view this page. Please login.';
        icon = <Lock className="w-8 h-8 text-warning" />;
        break;
      case 403:
        title = 'Forbidden';
        message = 'Access to this resource is denied.';
        icon = <Lock className="w-8 h-8 text-warning" />;
        break;
      case 500:
      default:
        title = 'Server Error';
        message = 'Something went wrong on our end. Please try again.';
        icon = <AlertTriangle className="w-8 h-8 text-error" />;
        break;
    }
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-[70vh] bg-surface-card text-text p-6 rounded-2xl shadow-md">
      <div className="flex flex-col items-center gap-4 text-center">
        {icon}
        <h2 className="text-2xl font-bold">{title}</h2>
        <p className="text-sm text-text-muted max-w-md">{message}</p>

        {/* Retry Button */}
        <Button
          className={cn(
            'mt-4 flex items-center gap-2 bg-primary text-surface-card hover:bg-primary/90'
          )}
          onClick={() => unstable_retry()}
        >
          <RefreshCw className="w-4 h-4" /> Try Again
        </Button>

        {/* Optional: Show error digest for debugging */}
        {error.digest && (
          <p className="mt-2 text-xs text-text-muted">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
