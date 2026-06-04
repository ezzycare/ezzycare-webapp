'use client';

import Button from '@/components/Ui/Button';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { useEffect } from 'react';

export default function DashboardError({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string; status?: number };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center h-[70vh] bg-surface-card p-6 m-6 rounded-2xl">
      <AlertTriangle className="w-10 h-10 text-error mb-4" />
      <h2 className="text-2xl font-bold mb-2">{error.name}</h2>
      <p className="text-text-muted mb-4 max-w-sm mx-auto text-center">
        {error.message || 'Something went wrong in the dashboard.'}
      </p>
      <Button
        onClick={() => unstable_retry()}
        className="flex items-center gap-2"
      >
        <RefreshCw className="w-4 h-4" /> Retry
      </Button>
    </div>
  );
}
