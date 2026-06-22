'use client';

import { useGetNotificationsInfiniteQuery } from '@/apiQuery/notifications/getNotifications';
import { useReadAllNotificationsMutation } from '@/apiQuery/notifications/readAllNotifications';
import { useReadNotificationMutation } from '@/apiQuery/notifications/readNotification';
import dayjs from 'dayjs';
import { useCallback, useRef, useEffect, useMemo } from 'react';
import { NotificationIconLocal } from '@/icons/DashboardNavIcons';
import SpiralLoader from '@/components/Base/SpiralLoader';
import { cn } from '@/lib/utils';
import { Dot } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const NotificationsPage = () => {
  const {
    notifications,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetNotificationsInfiniteQuery({ limit: 20 });
  const queryClient = useQueryClient();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const { mutate: markRead } = useReadNotificationMutation();
  const { mutate: markAllRead } = useReadAllNotificationsMutation();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const handleMarkAsRead = useCallback(
    (id: string) => {
      markRead(
        { id },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['notifications', 'infinite'],
            });
          },
        }
      );
    },
    [markRead, queryClient]
  );

  const handleMarkAllAsRead = useCallback(() => {
    markAllRead(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['notifications', 'infinite'],
        });
      },
    });
  }, [markAllRead, queryClient]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="w-full h-[60vh] flex items-center justify-center">
        <SpiralLoader />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-medium text-text">Notifications</h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-primary font-medium hover:underline cursor-pointer"
          >
            Mark all as read
          </button>
        )}
      </div>

      <div className="rounded-xl border border-gray-5 overflow-hidden">
        {notifications.length === 0 && (
          <p className="text-center text-sm text-text-muted py-16">
            No notifications
          </p>
        )}

        {notifications.map((item, index) => (
          <div
            key={item.id}
            className={cn(
              'px-5 py-4 border-gray-3 grid grid-cols-[40px_1fr] gap-3.5 cursor-pointer',
              index !== notifications.length - 1 && 'border-b'
            )}
            onClick={() => {
              if (!item.isRead) handleMarkAsRead(item.id);
            }}
          >
            <div
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center relative shrink-0',
                !item.isRead
                  ? 'bg-blue-3a text-blue-12a'
                  : 'bg-gray-3a text-text-alt'
              )}
            >
              {!item.isRead && (
                <Dot
                  size={34}
                  className="text-red-500 absolute -top-px right-0"
                />
              )}
              <NotificationIconLocal />
            </div>

            <div className="min-w-0">
              <div className="flex items-center w-full justify-between gap-2">
                <p className="flex items-center gap-2 min-w-0">
                  <span className="text-sm text-text font-medium truncate">
                    {item.title}
                  </span>
                  {!item.isRead && (
                    <span className="shrink-0 text-[10px] text-white bg-primary rounded-full py-0.5 px-1.5">
                      New
                    </span>
                  )}
                </p>
                <p className="text-xs text-blue-11 shrink-0">
                  {dayjs(item.createdAt).format('DD MMM, YYYY')}
                </p>
              </div>
              <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                {item.message}
              </p>
            </div>
          </div>
        ))}

        <div ref={sentinelRef} className="h-px" />

        {isFetchingNextPage && (
          <div className="flex items-center justify-center py-4">
            <SpiralLoader />
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsPage;
