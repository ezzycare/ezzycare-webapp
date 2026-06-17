import { create } from 'zustand';

import type { Notification } from '@/apiQuery/notifications/types';

interface NotificationsState {
  notifications: Notification[];

  setNotifications: (items: Notification[]) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useNotificationsStore = create<NotificationsState>()((set) => ({
  notifications: [],

  setNotifications: (items) => set({ notifications: items }),

  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, isRead: true } : n
      ),
    })),

  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
    })),
}));
