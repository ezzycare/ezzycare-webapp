'use client';

import ImageUpload from '@/components/Base/ImageUpload';
import { Button } from '@/components/Ui/Button';
import FancyButton from '@/components/Ui/FancyButton';
import Modal from '@/components/Ui/Modal';
import TextArea from '@/components/Ui/TextArea';
import { TextInput } from '@/components/Ui/TextInput';
import { useToaster } from '@/hooks/useToaster';
import { cn } from '@/lib/utils';
import { HospitalType } from '@/types/hospitals';
import { CircleX, Plus } from 'lucide-react';
import React, { useState } from 'react';
import OperatingHours, { OperatingHour } from './OperatingHours';

const HospitalDetailsModal = ({
  data,
  openModal,
  setOpenModal,
}: {
  data: HospitalType;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [image, setImage] = useState<{
    file: File | null;
    url: string | null;
  } | null>(null);

  const [serviceList, setServiceList] = useState<string[]>([]);
  const [serviceText, setServiceText] = useState<string>('');
  const [operatinghours, setOperatingHours] = useState<OperatingHour[]>([]);

  const toaster = useToaster();

  const handleAddService = (service: string) => {
    if (serviceList.includes(service)) return;
    setServiceList([...serviceList, service]);
    setServiceText('');
  };

  const handleRemoveService = (service: string) => {
    setServiceList(serviceList.filter((s) => s !== service));
  };

  return (
    <div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        title={data.name}
        description={data.email}
        size="lg"
        containerClassName="justify-end p-0!"
        headerClassName="p-4 mt-4"
        className="min-h-screen max-h-screen rounded-none! p-0!"
      >
        <div
          className="space-y-4 flex w-full flex-col max-h-[calc(100vh-4rem)] overflow-auto px-5 pb-20"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#17C9ED #00398E12',
          }}
        >
          <div className="space-y-2 mt-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-text font-medium">Hospital logo</p>
              <p className="text-xs text-text-muted mt-0.75">
                Upload a profile photo or logo for this hospital
              </p>
            </div>

            <ImageUpload
              placeholder="Upload Logo"
              value={image}
              onChange={setImage}
            />
          </div>

          <div className="space-y-2.5 flex flex-col">
            <div>
              <p className="text-sm text-text font-medium">Description</p>
              <p className="text-xs text-text-muted mt-0.75">
                Enter a description for this hospital
              </p>
            </div>

            <TextArea
              placeholder="Enter description"
              className="bg-gray-3! text-text border-none! rounded-lg!"
            />
          </div>

          <div className="space-y-2.5 flex flex-col">
            <div>
              <p className="text-sm text-text font-medium">Services offered</p>
              <p className="text-xs text-text-muted mt-0.75">
                Services and procedures provided by this hospital
              </p>
            </div>

            <div className="flex items-center gap-2">
              <TextInput
                value={serviceText}
                placeholder="E.g. Chemotherapy"
                className="bg-gray-3! text-text h-10! border-none! rounded-lg!"
                onChange={(e) => setServiceText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddService(serviceText);
                }}
              />

              <Button
                className="p-2! h-10! w-10!"
                disabled={!serviceText}
                onClick={() => handleAddService(serviceText)}
              >
                <Plus size={18} className="text-white" />
              </Button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {serviceList.map((service) => (
                <p
                  key={service}
                  className={cn(`
                  w-fit bg-blue-3a px-2.5 py-1.5 flex items-center 
                  justify-between text-sm text-blue-11a mt-0.75
                  rounded-lg
                `)}
                >
                  <span>{service}</span>
                  <CircleX
                    size={16}
                    className="text-blue-11a ml-2 cursor-pointer"
                    onClick={() => handleRemoveService(service)}
                  />
                </p>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 flex flex-col">
            <div>
              <p className="text-sm text-text font-medium">Operating hours</p>
              <p className="text-xs text-text-muted mt-0.75">
                Weekly schedule and availability
              </p>
            </div>

            <div>
              <OperatingHours
                onChange={(value: OperatingHour[]) => setOperatingHours(value)}
              />
            </div>
          </div>

          <div className="flex w-full gap-3 mt-6">
            <FancyButton
              variant="primary"
              className="w-full"
              onClick={() => {
                toaster.success('Patient Updated successfully');
                setOpenModal(false);
              }}
            >
              Save changes
            </FancyButton>
            <FancyButton className="w-full" onClick={() => setOpenModal(false)}>
              Cancel
            </FancyButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default HospitalDetailsModal;
