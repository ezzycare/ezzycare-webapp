'use client';

import { useGetWalletTransactionsInfiniteQuery } from '@/apiQuery/wallet/getWalletTransactions';
import DoctorWallet from '@/modules/doctor/Profile/DoctorWallet';

const Page = () => {
  const { transactions, isFetching } = useGetWalletTransactionsInfiniteQuery();

  return (
    <div className="p-7.5">
      <DoctorWallet transactions={transactions} isFetching={isFetching} />
    </div>
  );
};

export default Page;
