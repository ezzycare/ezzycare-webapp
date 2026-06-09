import ArrowLeft from '@/icons/ArrowLeft';

const SelectPaymentMethod = ({ goBack }: { goBack: () => void }) => {
  return (
    <div className="flex flex-col -mt-5">
      <div className="flex flex-col">
        <div
          className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
          onClick={goBack}
        >
          <ArrowLeft className="text-text-muted" />
          <p className="text-sm font-medium">Back</p>
        </div>
      </div>

      <h3 className="text-2xl text-text font-medium">Select payment method</h3>
      <div></div>
    </div>
  );
};

export default SelectPaymentMethod;
