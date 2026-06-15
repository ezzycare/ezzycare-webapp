import IconBase from '@/components/layout/IconBase';
import Payout from '@/modules/hospital/components/Settings/Payout';
import { ChevronRight, Settings } from 'lucide-react';

const page = () => {
  return (
    <div className="m-7.5 p-7.5 min-h-[60vh] grid grid-cols1 md:grid-cols-[353px_1fr] gap-7.5 bg-surface-card rounded-[16px]">
      <div className="flex-flex-col">
        <div className="flex items-center gap-3 px-5 py-3.25 border border-blue-3a rounded-[12px] cursor-pointer">
          <IconBase className="h-10 w-10">
            <Settings size={16} />
          </IconBase>

          <div>
            <p className="text-base font-medium text-text">
              Configuration settings
            </p>
            <p className="text-sm text-text-muted">Manage account settings</p>
          </div>

          <ChevronRight size={16} className="ml-auto" />
        </div>

        <p className="mt-5 bg-gray-2 py-2.5 px-4 rounded-[12px] font-medium cursor-pointer flex items-center">
          Payout
        </p>
        <p className="mt-3 py-2.5 px-4 rounded-[12px] font-medium cursor-pointer">
          Notification preference
        </p>
      </div>

      <div className="rounded-[12px] bg-blue-2 p-3">
        <div className="bg-surface-card rounded-[10px] h-full py-7.5 px-7">
          <Payout />
        </div>
      </div>
    </div>
  );
};

export default page;
