import { ApiResponse } from '@/apiQuery/types';

export interface Notification {
  id: string;
  receiverId: string;
  title: string;
  message: string;
  parameter: string | null;
  msgType: number;
  isRead: boolean;
  isAdminSend: boolean;
  generalNotificationType: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface NotificationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface NotificationsData {
  items: Notification[];
  meta: NotificationMeta;
}

export type NotificationsResponse = ApiResponse<NotificationsData>;

export interface GetNotificationsParams {
  page?: number;
  limit?: number;
}
