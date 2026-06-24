/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { getPayouts } from '@/apiQuery/wallet/getPayouts';
import type { Payout, PayoutsResponse } from '@/apiQuery/wallet/types';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/helper';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const payoutStatus: any = {
  ACTIVE: 'paid',
  INACTIVE: 'pending',
};

const PayoutItem = ({
  payout,
  onClick,
}: {
  payout: Payout;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-3 py-3.25 px-2.75 rounded-xl shadow-sm w-full text-left cursor-pointer hover:bg-gray-1 transition-colors"
  >
    <div className="bg-blue-3a rounded-full w-10 h-10 flex items-center justify-center text-blue-11 text-sm shrink-0">
      &#8358;
    </div>

    <div className="min-w-0">
      <p className="text-sm text-text truncate">You got paid!</p>
      <p className="text-xs text-text-muted">
        {dayjs(payout.createdAt).format('DD MMMM, YYYY')}
      </p>
    </div>

    <div className="ml-auto text-right shrink-0">
      <p className="text-sm text-text font-medium">
        {formatCurrency(payout.amount)}
      </p>
      <span
        className={cn(
          'inline-block w-fit text-xs rounded-xl p-1 px-2 capitalize',
          payout.status === 'ACTIVE'
            ? 'text-success-11a bg-green-3a'
            : payout.status === 'INACTIVE'
              ? 'text-warning bg-yellow-3a'
              : 'text-text-muted bg-gray-3a'
        )}
      >
        {payoutStatus[payout.status as any]}
      </span>
    </div>
  </button>
);

const PAGE_SIZE = 10;

const PayoutHistory = () => {
  const [page, setPage] = useState(1);
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);

  const { data, isLoading, isFetching } = useQuery<PayoutsResponse>({
    queryKey: ['wallet', 'payouts', page],
    queryFn: () => getPayouts({ page, limit: PAGE_SIZE }),
  });

  const payouts = data?.data?.items ?? [];
  const meta = data?.data?.meta;

  const goToPrev = () => setPage((p) => Math.max(1, p - 1));
  const goToNext = () => setPage((p) => p + 1);

  return (
    <section className="bg-surface-card rounded-[10px] p-7.5">
      {selectedPayout ? (
        <SelectedPayoutItem
          payout={selectedPayout}
          onBack={() => setSelectedPayout(null)}
        />
      ) : (
        <>
          <header className="flex items-center gap-3 justify-between">
            <div>
              <h3 className="font-medium text-text">Payout history</h3>
              <p className="text-sm text-text">View payment history</p>
            </div>

            <div className="flex items-center gap-3.5 text-text-muted">
              <button
                type="button"
                onClick={goToPrev}
                disabled={page <= 1 || isFetching}
                className={cn(
                  'flex items-center gap-0.5 text-sm cursor-pointer',
                  (page <= 1 || isFetching) && 'opacity-40 cursor-not-allowed'
                )}
              >
                <ChevronLeft size={14} /> Prev
              </button>
              <button
                type="button"
                onClick={goToNext}
                disabled={!meta?.hasNextPage || isFetching}
                className={cn(
                  'flex items-center gap-0.5 text-sm cursor-pointer',
                  (!meta?.hasNextPage || isFetching) &&
                    'opacity-40 cursor-not-allowed'
                )}
              >
                Next <ChevronRight size={14} />
              </button>
            </div>
          </header>

          <div className="mt-3.75 flex flex-col gap-1">
            {isLoading && (
              <p className="text-sm text-text-muted py-6 text-center">
                Loading payouts...
              </p>
            )}

            {!isLoading && payouts.length === 0 && (
              <p className="text-sm text-text-muted py-6 text-center">
                No payouts yet
              </p>
            )}

            {payouts.map((payout, index) => (
              <PayoutItem
                key={index}
                payout={payout}
                onClick={() => setSelectedPayout(payout)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default PayoutHistory;

const SelectedPayoutItem = ({
  payout,
  onBack,
}: {
  payout: Payout;
  onBack: () => void;
}) => {
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-text mb-5 cursor-pointer"
      >
        <ChevronLeft size={16} />
        Back
      </button>

      <div className="py-3.5 px-5 space-y-2 border-b border-gray-3a">
        <p className="font-medium text-sm text-text-muted">Name</p>
        <p className="text-xs text-text">{payout.accountName}</p>
      </div>
      <div className="py-3.5 px-5 space-y-2 border-b border-gray-3a">
        <p className="font-medium text-sm text-text-muted">Bank name</p>
        <p className="text-xs text-text">{payout.bankName}</p>
      </div>
      <div className="py-3.5 px-5 space-y-2 border-b border-gray-3a">
        <p className="font-medium text-sm text-text-muted">Account number</p>
        <p className="text-xs text-text">{payout.accountNumber}</p>
      </div>
      <div className="py-3.5 px-5 space-y-2">
        <p className="font-medium text-sm text-text-muted">Amount</p>
        <p className="text-xs text-text">{formatCurrency(payout.amount)}</p>
      </div>
    </div>
  );
};
