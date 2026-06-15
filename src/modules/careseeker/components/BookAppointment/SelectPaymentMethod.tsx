import ArrowLeft from '@/icons/ArrowLeft';
import { ArrowRight, Loader2 } from 'lucide-react';
import { PaymentMethodType } from '.';

const SelectPaymentMethod = ({
  goBack,
  action,
  isLoading,
  paymentMethods,
}: {
  goBack: () => void;
  action: (value: string) => void;
  isLoading?: boolean;
  paymentMethods: PaymentMethodType[];
}) => {
  return (
    <div className="flex flex-col -mt-5 pb-5">
      <div className="flex flex-col">
        <div
          className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
          onClick={goBack}
        >
          <ArrowLeft className="text-text-muted" />
          <p className="text-sm font-medium">Back</p>
        </div>
      </div>

      <h3 className="text-base text-text">Select payment method</h3>
      <div className="w-full flex flex-col gap-3 mt-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`w-full flex items-center gap-3.75 p-3 rounded-xl shadow-md cursor-pointer${isLoading ? ' pointer-events-none opacity-50' : ''}`}
            onClick={() => action(method.slug)}
          >
            <div className="w-full flex items-center gap-2">
              {method.icon}
              <p className="text-sm text-text font-medium">{method.name}</p>
              {isLoading ? (
                <Loader2 className="text-text-muted ml-auto animate-spin" />
              ) : (
                <ArrowRight className="text-text-muted ml-auto" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SelectPaymentMethod;
