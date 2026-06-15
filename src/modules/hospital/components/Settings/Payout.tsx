'use client';

import Button from '@/components/Ui/Button';
import { RadioItem } from '@/components/Ui/RadioGroup';
import { TextInput } from '@/components/Ui/TextInput';
import { useState } from 'react';

const Payout = () => {
  const payoutMethods = ['Hospital Managed Payout', 'Platform Managed Payout'];
  const [selectedPayout, setSelectedPayout] = useState(payoutMethods[0]);
  return (
    <div className="w-full">
      <div className="w-full">
        <p className="text-base font-medium text-text">Payouts</p>
        <p className="text-sm text-text-muted">
          Manage payouts on your account
        </p>
      </div>
      <div className="mt-7.5 w-full">
        <p className="text-base font-medium text-text">PAYOUT METHODS</p>
        <div className="mt-5 flex items-center gap-4.5">
          {payoutMethods.map((method, index) => (
            <div key={index} className="flex items-center gap-2">
              <RadioItem
                name="department"
                checked={selectedPayout === method}
                option={{ value: method }}
                onChange={() => {
                  setSelectedPayout(method);
                }}
              />
              <p className="text-sm text-text">{method}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedPayout === payoutMethods[1] && (
        <>
          <div className="mt-6">
            <p className="text-base font-medium text-text">CONSULTATION FEES</p>

            <div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-text-alt">
                  Video consultation (per minute)
                </p>
                <div className="w-52.25">
                  <TextInput
                    type="number"
                    className="mt-2 h-8! bg-gray-2!"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-text-alt">
                  Clinic consultation (per minute)
                </p>
                <div className="w-52.25">
                  <TextInput
                    type="number"
                    className="mt-2 h-8! bg-gray-2!"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-text-alt">
                  Home consultation (per minute)
                </p>
                <div className="w-52.25">
                  <TextInput
                    type="number"
                    className="mt-2 h-8! bg-gray-2!"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-base font-medium text-text">PAYOUT PERCENTAGE</p>

            <div>
              <div className="w-full flex items-center justify-between">
                <p className="text-sm text-text-alt">
                  Doctor payout percentage
                </p>
                <div className="w-52.25">
                  <TextInput
                    type="number"
                    className="mt-2 h-8! bg-gray-2!"
                    placeholder="0.00"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      <div className="mt-6">
        <Button variant="primary">Save changes</Button>
      </div>
    </div>
  );
};

export default Payout;
