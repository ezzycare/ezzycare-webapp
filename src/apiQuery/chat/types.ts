import { ApiResponse } from '@/apiQuery/types';

export interface Conversation {
  id: string;
  name: string;
  preview: string;
  date: string;
  unread?: number;
  avatar?: string;
}

export interface ConversationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ConversationsData {
  items: Conversation[];
  meta: ConversationMeta;
}

export type ConversationsResponse = ApiResponse<ConversationsData>;

export interface ChatMessage {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
  senderId: string;
  receiverId: string;
  createdAt: string;
}

export interface ChatHistoryMeta {
  hasMore: boolean;
  lastId: string | null;
}

export interface ChatHistoryData {
  items: ChatMessage[];
  meta: ChatHistoryMeta;
}

export type ChatHistoryResponse = ApiResponse<ChatHistoryData>;

export interface SendMessageParams {
  receiverId: number;
  message: string;
}

export interface SendMessageData {
  id: string;
  createdAt: string;
}

export type SendMessageResponse = ApiResponse<SendMessageData>;
