import {
  NotificationDarkIconLocal,
  NotificationIconLocal,
} from '@/icons/DashboardNavIcons';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Dot } from 'lucide-react';
import { useState } from 'react';

const Noti = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div className="bg-gray-2 w-10 h-10 rounded-full flex items-center justify-center ml-3 mr-2 cursor-pointer">
          <NotificationDarkIconLocal />
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-117 p-0 relative">
        <div className="w-full relative pt-12 pb-5 overflow-hidden">
          <Cross1Icon
            className="absolute top-6 right-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <h3 className="px-8.5 text-2xl font-medium">Notifications</h3>

          <div
            className="mt-3.25 max-h-[70vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--primary) transparent',
            }}
          >
            {notifications?.map((item) => (
              <div
                key={item.id}
                className="px-7 py-4.25 border-b border-gray-3 grid grid-cols-[40px_1fr] gap-3.5 cursor-pointer"
              >
                <div
                  className={cn(`
                    w-10 h-10 rounded-full flex items-center justify-center relative
                    ${
                      !item.isRead
                        ? 'bg-blue-3a text-blue-12a'
                        : 'bg-gray-3a text-text-alt'
                    }
                  `)}
                >
                  {!item.isRead && (
                    <Dot
                      size={34}
                      className="text-red-500 absolute -top-px right-0"
                    />
                  )}

                  <NotificationIconLocal />
                </div>

                <div>
                  <div className="flex items-center w-full justify-between">
                    <p className="flex items-center gap-2">
                      <span className="text-sm text-text font-medium">
                        {item.title}
                      </span>

                      {!item.isRead && (
                        <span
                          className="
                            w-fit text-white text-xs bg-primary rounded-full
                            py-0.5 px-1.5 flex items-center justify-center
                          "
                        >
                          New
                        </span>
                      )}
                    </p>

                    <p className="text-sm text-blue-11">
                      {dayjs(item.createdAt).format('DD MMMM, YYYY')}
                    </p>
                  </div>

                  <p className="text-sm text-muted mt-0.5">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Noti;

interface Notification {
  id: string;
  title: string;
  content: string;
  isNew: boolean;
  isRead: boolean;
  createdAt: string;
}

export const notifications: Notification[] = [
  {
    id: 'notif-001',
    title: 'Appointment Confirmed',
    content:
      'Your appointment with Dr. Amina Bello has been confirmed for May 28 at 10:00 AM.',
    isNew: true,
    isRead: false,
    createdAt: '2026-05-25T08:30:00Z',
  },
  {
    id: 'notif-002',
    title: 'Video Consultation Reminder',
    content:
      'Your video consultation starts in 30 minutes. Please join on time.',
    isNew: true,
    isRead: false,
    createdAt: '2026-05-25T09:00:00Z',
  },
  {
    id: 'notif-003',
    title: 'Prescription Ready',
    content: 'Your prescription has been uploaded by Dr. Chinedu Okafor.',
    isNew: false,
    isRead: true,
    createdAt: '2026-05-24T14:20:00Z',
  },
  {
    id: 'notif-004',
    title: 'Appointment Cancelled',
    content:
      'Your appointment scheduled for May 26 has been cancelled. Please reschedule.',
    isNew: false,
    isRead: false,
    createdAt: '2026-05-24T16:10:00Z',
  },
  {
    id: 'notif-005',
    title: 'Payment Successful',
    content: 'Your payment of ₦15,000 for clinic consultation was successful.',
    isNew: true,
    isRead: false,
    createdAt: '2026-05-25T07:15:00Z',
  },
  {
    id: 'notif-006',
    title: 'New Health Tip',
    content:
      'Stay hydrated and maintain at least 30 minutes of physical activity daily.',
    isNew: false,
    isRead: true,
    createdAt: '2026-05-23T11:45:00Z',
  },
  {
    id: 'notif-007',
    title: 'Doctor Availability Updated',
    content:
      'Dr. Femi Adeyemi has updated available consultation hours for this week.',
    isNew: true,
    isRead: false,
    createdAt: '2026-05-25T10:05:00Z',
  },
  {
    id: 'notif-008',
    title: 'Lab Results Available',
    content:
      'Your recent lab test results are now available in your medical records.',
    isNew: false,
    isRead: true,
    createdAt: '2026-05-22T18:30:00Z',
  },
  {
    id: 'notif-009',
    title: 'Profile Verification Complete',
    content: 'Your account verification has been completed successfully.',
    isNew: false,
    isRead: true,
    createdAt: '2026-05-21T09:50:00Z',
  },
  {
    id: 'notif-010',
    title: 'Upcoming Home Visit',
    content: 'Your scheduled home consultation is tomorrow at 2:00 PM.',
    isNew: true,
    isRead: false,
    createdAt: '2026-05-25T06:40:00Z',
  },
];
