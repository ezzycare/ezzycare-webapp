import Button from '@/components/Ui/Button';
import ArrowLeft from '@/icons/ArrowLeft';
import { useState } from 'react';
import BookForOthersPart1 from './BookForOthersPart1';
import BookForOthersPart2 from './BookForOthersPart2';

const BookOthers = ({
  goBack,
  action,
}: {
  goBack: () => void;
  action: () => void;
}) => {
  const states = ['part1', 'part2'];
  const [state, setState] = useState<string>(states[0]);

  const handleGoBack = () => {
    if (state === 'part2') {
      setState('part1');
    } else {
      goBack();
    }
  };

  return (
    <div className="flex flex-col -mt-5">
      <div className="flex flex-col">
        <div
          className="flex items-center gap-2 text-text-muted mb-4 cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft className="text-text-muted" />
          <p className="text-sm font-medium">Back</p>
        </div>
      </div>

      <h3 className="text-2xl text-text font-medium">Book Appointment</h3>
      <p className="text-sm text-text mt-1.5">Book for someone</p>

      <div className="max-h-[60vh] overflow-y-auto">
        {state === 'part1' && (
          <BookForOthersPart1 onSubmit={() => setState('part2')} />
        )}
        {state === 'part2' && <BookForOthersPart2 onSubmit={() => action()} />}
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full mt-2 text-blue-11 border-primary"
        onClick={goBack}
      >
        Book for yourself
      </Button>
    </div>
  );
};

export default BookOthers;
