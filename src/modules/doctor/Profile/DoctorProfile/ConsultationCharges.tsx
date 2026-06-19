import { User } from '@/apiQuery/auth/types';
import { DoctorProfile } from '@/apiQuery/doctor/getSingleDoctor';
import { Banknote } from 'lucide-react';
import { useState } from 'react';

const ConsultationCharges = ({
  user,
  onChange,
}: {
  user: DoctorProfile | User;
  onChange: (value: { key: string; value: string }[]) => void;
}) => {
  const [consultationCharges, setConsultationCharges] = useState({
    homeConsultationCharge: String(user?.userDetails?.homeConsultationCharge),
    clinicConsultationCharge: String(
      user?.userDetails?.clinicConsultationCharge
    ),
    videoConsultationCharge: String(user?.userDetails?.videoConsultationCharge),
  });

  const handleChargeChange = (key: string, value: string) => {
    const updatedCharges = {
      ...consultationCharges,
      [key]: value,
    };
    setConsultationCharges(updatedCharges);
    onChange(
      Object.entries(updatedCharges).map(([key, value]) => ({
        key,
        value,
      }))
    );
  };

  const chargeItems = [
    {
      title: 'Home consultation charge',
      key: 'homeConsultationCharge',
    },
    {
      title: 'Clinic consultation charge',
      key: 'clinicConsultationCharge',
    },
    {
      title: 'Video consultation charge',
      key: 'videoConsultationCharge',
    },
  ];

  return (
    <div>
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-sm font-semibold text-text">
            Consultation charges
          </h3>
        </div>
        <div className="space-y-2.5 bg-gray-1 border border-border2 rounded-xl py-3.5 px-3.75 text-sm text-text-alt leading-relaxed">
          {chargeItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-[1fr_116px] items-center justify-between gap-2 text-sm text-text"
            >
              <p className="flex items-center gap-2">
                <Banknote size={14} className="text-text-muted" />
                {item.title}
              </p>
              <label
                htmlFor={`charge-${item.key}`}
                className="flex items-center gap-2 rounded-sm border border-border2 bg-surface-card px-4 py-1.5 has-[input:focus]:border-blue-10"
              >
                <input
                  id={`charge-${item.key}`}
                  type="text"
                  inputMode="decimal"
                  pattern="[0-9]*\.?[0-9]*"
                  value={
                    consultationCharges[
                      item.key as keyof typeof consultationCharges
                    ] ?? ''
                  }
                  onChange={(e) => handleChargeChange(item.key, e.target.value)}
                  placeholder="0"
                  aria-label="Consultation charge per minute"
                  className="min-w-0 flex-1 bg-transparent text-right text-xs leading-relaxed text-text outline-none"
                />
                <span className="shrink-0 text-xs text-text-muted">/Min</span>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ConsultationCharges;
