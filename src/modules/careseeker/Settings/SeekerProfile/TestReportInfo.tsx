import { User } from '@/apiQuery/auth/types';
import { EmptyCalendarIconLocal } from '@/icons/DashboardIcons';
import { Button } from '@heroui/react';

const TestReportInfo = ({ user }: { user: User }) => {
  return (
    <div className="w-full flex flex-col items-center justify-center h-full min-h-[60vh]">
      <EmptyCalendarIconLocal />
      <p className="font-medium text-text text-center mt-2.5">
        No report available
      </p>
      <p className="max-w-55.75 mx-auto text-sm text-text-muted mt-1 text-center">
        Once you upload test results, they will appear here.
      </p>

      <Button className="mt-8">Add test report</Button>
    </div>
  );
};

export default TestReportInfo;
