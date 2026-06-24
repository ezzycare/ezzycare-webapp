'use client';

import { handleLogout } from '@/apiQuery/auth/logout';
import Button from '@/components/Ui/Button';
import { cn } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

const LogoutConfirmation = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const confirmLogout = async () => {
    setLoading(true);
    await handleLogout();
  };

  return (
    <div className="bg-surface-card rounded-[10px] p-7.5">
      <div className="flex flex-col items-center justify-center text-center max-w-200 mx-auto min-h-[70vh] -translate-y-20">
        <div
          className={cn(
            'w-18 h-18 rounded-full flex items-center justify-center mb-8',
            'bg-red-50 dark:bg-red-500/10'
          )}
        >
          <LogOut size={32} className="text-red-400" />
        </div>

        <h3 className="text-lg font-semibold text-text mb-1.5">
          Sign out of Ezzycare?
        </h3>
        <p className="text-sm text-text-muted max-w-100">
          You can always sign back in at any time. If you just want to switch
          accounts, you can add a new account instead.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full mt-10">
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setShowConfirm(false)}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="w-full"
            loading={loading}
            onClick={confirmLogout}
          >
            {loading ? 'Signing out…' : 'Sign out'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmation;
