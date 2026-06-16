import { ApiResponse } from '@/apiQuery/types';

export interface ConversationPeer {
  id: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface LastMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  peer: ConversationPeer;
  lastMessage: LastMessage | null;
  unreadCount: number;
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

export interface ChatMessageSender {
  firstName: string;
  lastName: string;
  profileImage: string | null;
}

export interface ChatMessage {
  id: string;
  message: string;
  senderId: string;
  receiverId: string;
  isRead: boolean;
  createdAt: string;
  sender: ChatMessageSender;
}

export type ChatHistoryResponse = ApiResponse<ChatMessage[]>;

export interface SendMessageParams {
  receiverId: number;
  message: string;
  sender?: ChatMessageSender;
}

export interface SendMessageData {
  id: string;
  createdAt: string;
}

export type SendMessageResponse = ApiResponse<SendMessageData>;
