import SetAvailability from '../components/Availability/SetAvailability';

const TimeSettings = () => {
  return (
    <div className="bg-surface-card rounded-[10px] p-7.5">
      <h3 className="font-medium text-text">Set Availability</h3>
      <p className="text-sm text-text-muted mt-1 mb-2">
        Set your work availability to help us match you with suitable tasks
      </p>

      <SetAvailability onSave={() => {}} />
    </div>
  );
};

export default TimeSettings;
