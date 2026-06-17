import {
  NotificationDarkIconLocal,
  NotificationIconLocal,
} from '@/icons/DashboardNavIcons';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@heroui/react';
import { Cross1Icon } from '@radix-ui/react-icons';
import dayjs from 'dayjs';
import { Dot } from 'lucide-react';
import { useMemo, useState } from 'react';

import { useReadAllNotificationsMutation } from '@/apiQuery/notifications/readAllNotifications';
import { useReadNotificationMutation } from '@/apiQuery/notifications/readNotification';
import { useNotificationsStore } from '@/stores/notificationsStore';

const Noti = () => {
  const [isOpen, setIsOpen] = useState(false);

  const notifications = useNotificationsStore((state) => state.notifications);
  const markAsReadLocal = useNotificationsStore((state) => state.markAsRead);
  const markAllAsReadLocal = useNotificationsStore(
    (state) => state.markAllAsRead
  );

  const { mutate: markRead } = useReadNotificationMutation();
  const { mutate: markAllRead } = useReadAllNotificationsMutation();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = (id: string) => {
    markAsReadLocal(id);
    markRead({ id });
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadLocal();
    markAllRead();
  };

  return (
    <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <div className="bg-gray-2 w-10 h-10 rounded-full flex items-center justify-center ml-3 mr-2 cursor-pointer relative">
          <NotificationDarkIconLocal />
          {unreadCount > 0 && (
            <span className="absolute -top-px -right-px w-5 h-5 bg-primary text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-117 p-0 relative">
        <div className="w-full relative pt-12 pb-5 overflow-hidden">
          <Cross1Icon
            className="absolute top-6 right-6 cursor-pointer"
            onClick={() => setIsOpen(false)}
          />

          <div className="px-8.5 flex items-center justify-between">
            <h3 className="text-2xl font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-primary font-medium hover:underline cursor-pointer"
              >
                Mark all as read
              </button>
            )}
          </div>

          <div
            className="mt-3.25 max-h-[70vh] overflow-y-auto"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: 'var(--primary) transparent',
            }}
          >
            {notifications.length === 0 && (
              <p className="text-center text-sm text-text-muted py-8">
                No notifications
              </p>
            )}

            {notifications.map((item) => (
              <div
                key={item.id}
                className="px-7 py-4.25 border-b border-gray-3 grid grid-cols-[40px_1fr] gap-3.5 cursor-pointer"
                onClick={() => {
                  if (!item.isRead) handleMarkAsRead(item.id);
                }}
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

                  <p className="text-sm text-muted mt-0.5">{item.message}</p>
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
