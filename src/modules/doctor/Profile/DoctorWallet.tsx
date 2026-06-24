'use client';
import { useGetWalletTransactionsInfiniteQuery } from '@/apiQuery/wallet/getWalletTransactions';
import { WalletTransaction } from '@/apiQuery/wallet/types';
import SpiralLoader from '@/components/Base/SpiralLoader';
import Button from '@/components/Ui/Button';
import Dropdown from '@/components/Ui/Dropdown';
import Modal from '@/components/Ui/Modal';
import { TextInput } from '@/components/Ui/TextInput';
import { BoldWalletIcon } from '@/icons/DashboardIcons';
import { TopUpIconLocal } from '@/icons/SettingsIcons';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/authStore';
import { formatCurrency, getInitials } from '@/utils/helper';
import { Cross1Icon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Dot, EyeIcon, EyeOffIcon, SearchIcon } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

const DoctorWallet = () => {
  const user = useAuthStore((state) => state.doctorUser);
  const { transactions: allTransactions, isFetching } =
    useGetWalletTransactionsInfiniteQuery();

  const [showBalance, setShowBalance] = useState(false);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [appliedFilter, setAppliedFilter] = useState('all');

  const transactions = useMemo(() => {
    let filtered = allTransactions ?? [];

    if (appliedFilter !== 'all') {
      filtered = filtered.filter((t) => t.type === appliedFilter);
    }

    if (search.trim()) {
      const query = search.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.reference?.toLowerCase().includes(query) ||
          t.description?.toLowerCase().includes(query) ||
          String(t.amount).includes(query)
      );
    }

    return filtered;
  }, [allTransactions, appliedFilter, search]);

  const initials = user
    ? getInitials(`${user.firstName} ${user.lastName}`)
    : '';

  const handleShowBalance = () => {
    const value = !showBalance;
    setShowBalance(value);
    localStorage.setItem('showCareSeekerBalance', String(value));
  };

  const handleTopUpWallet = () => {
    console.log('top up wallet');
    setShowTopUpModal(false);
  };

  return (
    <div className="bg-surface-card rounded-[10px] p-7.5">
      <header className="flex items-center gap-3">
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.firstName}
            width={40}
            height={40}
          />
        ) : (
          <p
            className={cn(
              `bg-blue-11a w-10 h-10 rounded-full flex items-center justify-center
                  uppercase text-sm text-surface-card tracking-wider`
            )}
          >
            {initials}
          </p>
        )}

        <div>
          <p className="text-base font-medium text-text">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-text-muted">{user.email}</p>
        </div>

        <Button
          className="min-w-37.5 ml-auto"
          onClick={() => setShowTopUpModal(true)}
        >
          Withdraw
        </Button>
      </header>

      <div className="flex flex-col sm:flex-row items-center gap-3 mt-5">
        <div className="w-full sm:w-1/2 p-2 bg-blue-3a rounded-lg">
          <div className="flex items-center gap-6.25 max-w-72">
            <BoldWalletIcon />
            <div>
              <p className="text-xs text-accent-12">Available Balance</p>
              <h2 className="text-lg text-blue-12 font-semibold">
                {showBalance
                  ? formatCurrency(user.walletBalance || 0)
                  : '*********'}
              </h2>
            </div>

            <div className="ml-auto text-text mr-3" onClick={handleShowBalance}>
              {showBalance ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
            </div>
          </div>
        </div>
        <div className="w-full sm:w-1/2 p-2 bg-blue-3a rounded-lg">
          <div className="flex items-center gap-6.25 max-w-72">
            <BoldWalletIcon />
            <div>
              <p className="text-xs text-accent-12">Locked Balance</p>
              <h2 className="text-lg text-blue-12 font-semibold">
                {showBalance
                  ? formatCurrency(user.lockWalletBalance || 0)
                  : '*********'}
              </h2>
            </div>

            <div className="ml-auto text-text mr-3" onClick={handleShowBalance}>
              {showBalance ? <EyeOffIcon size={24} /> : <EyeIcon size={24} />}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-6">
            <p className="text-text-muted font-medium">Transactions</p>
            <p className="text-sm text-primary">View All</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <TextInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search payments"
              leftIcon={
                <SearchIcon size={16} className="text-text-muted ml-1" />
              }
              className="h-8! rounded-lg border border-border2 bg-surface-card px-3 pl-9! text-xs text-text outline-none w-44"
            />
            <Dropdown
              placeholder="Type"
              options={[
                { label: 'All', value: 'all' },
                { label: 'Credit', value: 'CREDIT' },
                { label: 'Debit', value: 'DEBIT' },
              ]}
              value={selectedType}
              onChange={(value) => setSelectedType(String(value))}
            />
            <Button
              className="h-8! bg-blue-3a! text-primary! text-xs font-semibold whitespace-nowrap"
              onClick={() => setAppliedFilter(selectedType)}
            >
              Apply
            </Button>
            {appliedFilter !== 'all' && (
              <Button
                className="h-8! bg-error-3a! text-error! text-xs font-semibold"
                onClick={() => {
                  setSelectedType('all');
                  setAppliedFilter('all');
                }}
              >
                <Cross1Icon className="w-3.5 h-3.5" />
              </Button>
            )}
          </div>
        </div>
        {isFetching && (
          <div className="w-full h-[50vh] flex items-center justify-center">
            <SpiralLoader />
          </div>
        )}
        {!!transactions?.length && !isFetching && (
          <div className="mt-6.75 flex flex-col gap-2">
            {transactions?.map((transaction: WalletTransaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>

      <TopUpWalletModal
        openModal={showTopUpModal}
        setOpenModal={setShowTopUpModal}
        loading={false}
        action={handleTopUpWallet}
      />
    </div>
  );
};

export default DoctorWallet;

export const TopUpWalletModal = ({
  openModal,
  setOpenModal,
  loading,
  action,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  action: (value: string) => void;
}) => {
  const [inputValue, setInputValue] = useState('');
  return (
    <Modal open={openModal} onClose={() => setOpenModal(false)} size="sm">
      <div className="flex flex-col gap-4">
        <h3 className="font-bold text-text text-center">
          How much do you want to top up
        </h3>

        <div className="min-h-11 flex flex-wrap gap-2 items-center mt-7">
          <TextInput
            type="text"
            placeholder="Enter amount"
            label="Amount"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-1 min-w-24 text-sm outline-none bg-transparent text-text placeholder:text-text-muted"
          />
        </div>
      </div>

      <Button
        loading={loading}
        disabled={!inputValue?.length || loading}
        className="mt-8 w-full"
        onClick={() => action(inputValue)}
      >
        Add Amount
      </Button>
    </Modal>
  );
};

const TransactionItem = ({
  transaction,
}: {
  transaction: WalletTransaction;
}) => {
  return (
    <div className="flex items-center gap-6.25 w-full p-2 py-3 border-b border-gray-4">
      <TopUpIconLocal />
      <div>
        <h2 className="text-sm text-blue-12 font-medium">
          {transaction.type === 'CREDIT' ? 'Added to wallet' : 'Payment'}
        </h2>
        <p className="text-xs text-accent-12 flex items-center gap-1">
          <span>{transaction.reference}</span>
          <Dot size={14} />
          <span>{dayjs(transaction.createdAt).format('DD MMMM, YYYY')}</span>
        </p>
      </div>

      <p className="ml-auto text-xs text-primary font-medium">
        {formatCurrency(transaction.amount)}
      </p>
    </div>
  );
};
