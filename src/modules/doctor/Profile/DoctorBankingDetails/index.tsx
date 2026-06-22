'use client';

import { useGetBankAccounts } from '@/apiQuery/wallet/getBankAccounts';
import { useGetBanks } from '@/apiQuery/wallet/getBanks';
import BounceLoader from '@/components/Base/BounceLoader';
import IconBase from '@/components/layout/IconBase';
import Button from '@/components/Ui/Button';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { Landmark, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { AddBankModal } from './AddBankModal';

const DoctorBankingDetails = () => {
  const [showAddBankModal, setShowAddBankModal] = useState(false);
  const [primaryAccount, setPrimaryAccount] = useState('');

  const { accounts, isFetching } = useGetBankAccounts();
  const bankAccounts = useMemo(() => {
    return !!accounts?.length ? accounts : [];
  }, [accounts]);

  const { banks } = useGetBanks();

  return (
    <div className="relative bg-surface-card rounded-[10px] p-4 sm:y-6.5 sm:px-10">
      <header className="flex items-center gap-3">
        <div>
          <p className="text-base font-medium text-text">Banking details</p>
          <p className="text-xs text-text-muted">Manage your bank details</p>
        </div>

        <Button
          className="text-xs gap-2 ml-auto py-3.5! px-4.25!"
          onClick={() => setShowAddBankModal(true)}
        >
          <Plus size={14} />
          Add payment method
        </Button>
      </header>

      {isFetching && <BounceLoader />}

      <div className="mt-6 space-y-3">
        {!!bankAccounts?.length &&
          bankAccounts?.map((account) => (
            <div
              key={account.id}
              className="grid grid-cols-[56px_1fr_45px] items-center gap-2 py-2.5 px-3 border border-border2 rounded-xl cursor-pointer"
              onClick={() => setPrimaryAccount(account.id)}
            >
              <IconBase
                className={
                  account.id === primaryAccount ? 'bg-blue-3a text-blue-11' : ''
                }
              >
                <Landmark size={20} />
              </IconBase>
              <div>
                <p className="text-xs font-medium text-text">
                  {account.bankName}
                </p>
                <p className="text-lg text-blue-11 font-medium">
                  {account.accountNumber}
                </p>
              </div>
              <RadioItem
                option={{ value: '' }}
                checked={account.id === primaryAccount}
                interactive={false}
                onChange={() => {}}
              />
            </div>
          ))}
      </div>
      <AddBankModal
        openModal={showAddBankModal}
        setOpenModal={setShowAddBankModal}
        banks={banks}
      />
    </div>
  );
};

export default DoctorBankingDetails;
