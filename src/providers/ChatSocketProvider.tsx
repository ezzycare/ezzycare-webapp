'use client';

import { ACCOUNT_TYPE } from '@/apiQuery/auth/types';
import type { ChatMessage, Conversation } from '@/apiQuery/chat/types';
import { useGetAccountType } from '@/hooks/useGetAccountType';
import { toaster } from '@/lib/toaster';
import { getAuthToken } from '@/services/getAuthToken';
import { useCallStore } from '@/stores/callStore';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { io, type Socket } from 'socket.io-client';

const CONVERSATIONS_KEY_PREFIX = ['chat', 'conversations', 'infinite'];
const SOCKET_URL = (process.env.NEXT_PUBLIC_BASE_URL || '').replace(/\/+$/, '');

type IncomingMessage = {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

type IncomingCallData = {
  roomName: string;
  roomToken: string;
  uid: number;
  role?: ACCOUNT_TYPE;
  callerName?: string;
  callerAvatar?: string;
  appointmentId: number;
};

interface ServerToClientEvents {
  receive_message: (data: IncomingMessage) => void;
  message_sent: (data: { id: string; createdAt: string }) => void;
  messages_read: (data: { peerId: string; readerId: string }) => void;
  user_online: (data: { userId: string }) => void;
  user_offline: (data: { userId: string }) => void;
  typing: (data: { peerId: string; isTyping: boolean; userId: string }) => void;
  incoming_call: (data: IncomingCallData) => void;
}

interface ClientToServerEvents {
  send_message: (data: { receiverId: number; message: string }) => void;
  mark_read: (data: { peerId: string }) => void;
  typing: (data: { peerId: string; isTyping: boolean }) => void;
}

type ConversationsResponse = {
  success: boolean;
  data: {
    items: Conversation[];
  };
};

export interface ChatSocketContextValue {
  isConnected: boolean;
  onlineUsers: Record<string, boolean>;
  typingUsers: Record<string, boolean>;
  sendMessage: (receiverId: number, message: string) => void;
  markAsRead: (peerId: string) => void;
  sendTyping: (peerId: string, isTyping: boolean) => void;
  setConversations: (conversations: Conversation[]) => void;
  setActivePeerId: (peerId: string | null) => void;
}

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

export function ChatSocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const conversationsRef = useRef<Conversation[]>([]);
  const activePeerIdRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const setConversations = useCallback((conversations: Conversation[]) => {
    conversationsRef.current = conversations;
  }, []);

  const setActivePeerId = useCallback((peerId: string | null) => {
    activePeerIdRef.current = peerId;
  }, []);

  const { accountType } = useGetAccountType();

  const token = getAuthToken();

  useEffect(() => {
    if (!token) return;

    const namespace = `${SOCKET_URL}/chat`;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      namespace,
      {
        auth: { token },
        transports: ['websocket', 'polling'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
        withCredentials: true,
      }
    );

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });
    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.warn('[chat-socket] disconnected:', reason);
    });
    socket.on('connect_error', (err) => {
      console.error('[chat-socket] connection error:', err.message, err);
    });

    socket.on('receive_message', (data: IncomingMessage) => {
      const peerId = data.senderId;

      const senderPeer = conversationsRef.current.find(
        (c) => c.peer.id === peerId
      )?.peer;

      queryClient.setQueryData<{ success: boolean; data: ChatMessage[] }>(
        ['chat', 'history', peerId],
        (old) => {
          const newMsg: ChatMessage = {
            ...data,
            sender: senderPeer
              ? {
                  firstName: senderPeer.firstName,
                  lastName: senderPeer.lastName,
                  profileImage: senderPeer.profileImage,
                }
              : { firstName: '', lastName: '', profileImage: null },
          };

          if (!old) {
            return { success: true, message: '', data: [newMsg] };
          }

          if (old.data.some((m) => m.id === data.id)) {
            return old;
          }

          return {
            ...old,
            data: [...old.data, newMsg],
          };
        }
      );

      const results = queryClient.getQueriesData<
        InfiniteData<ConversationsResponse>
      >({
        queryKey: CONVERSATIONS_KEY_PREFIX,
        exact: false,
      });

      for (const [key] of results) {
        queryClient.setQueryData<InfiniteData<ConversationsResponse>>(
          key,
          (old) => {
            if (!old) return old;
            return {
              ...old,
              pages: old.pages.map((page) => ({
                ...page,
                data: page.data
                  ? {
                      ...page.data,
                      items: page.data.items.map((c) =>
                        c.peer.id === peerId
                          ? {
                              ...c,
                              lastMessage: {
                                id: data.id,
                                senderId: data.senderId,
                                receiverId: data.receiverId,
                                message: data.message,
                                isRead: data.isRead,
                                createdAt: data.createdAt,
                              },
                              unreadCount:
                                ((c as { unreadCount?: number }).unreadCount ??
                                  0) + 1,
                            }
                          : c
                      ),
                    }
                  : page.data,
              })),
            };
          }
        );
      }

      if (activePeerIdRef.current !== peerId) {
        const senderName = senderPeer
          ? `${senderPeer.firstName} ${senderPeer.lastName}`
          : 'Someone';

        toaster.info(data.message, senderName);
      }

      if (document.hidden && Notification.permission === 'granted') {
        new Notification('New message', {
          body: data.message,
          tag: data.senderId,
        });
      }
    });

    socket.on('messages_read', ({ peerId, readerId }) => {
      queryClient.setQueryData<{ success: boolean; data: ChatMessage[] }>(
        ['chat', 'history', peerId],
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: old.data.map((m) =>
              m.receiverId === readerId ? { ...m, isRead: true } : m
            ),
          };
        }
      );
    });

    socket.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    });
    socket.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
    });
    socket.on('typing', ({ peerId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [peerId]: isTyping }));
    });

    socket.on('incoming_call', (data: IncomingCallData) => {
      console.log({ incomingCallData: data });
      useCallStore.getState().setIncomingCall({
        roomName: data.roomName,
        token: data.roomToken,
        uid: data.uid,
        role: accountType ?? 'SEEKER',
        callerName: data.callerName,
        appointmentId: data.appointmentId,
      });
    });

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [token, queryClient]);

  const sendMessage = useCallback((receiverId: number, message: string) => {
    if (!socketRef.current?.connected) return;
    socketRef.current.emit('send_message', { receiverId, message });
  }, []);

  const markAsRead = useCallback((peerId: string) => {
    socketRef.current?.emit('mark_read', { peerId });
  }, []);

  const sendTyping = useCallback((peerId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { peerId, isTyping });
  }, []);

  const value = useMemo<ChatSocketContextValue>(
    () => ({
      isConnected,
      onlineUsers,
      typingUsers,
      sendMessage,
      markAsRead,
      sendTyping,
      setConversations,
      setActivePeerId,
    }),
    [
      isConnected,
      onlineUsers,
      typingUsers,
      sendMessage,
      markAsRead,
      sendTyping,
      setConversations,
      setActivePeerId,
    ]
  );

  return (
    <ChatSocketContext.Provider value={value}>
      {children}
    </ChatSocketContext.Provider>
  );
}

export function useChatSocketContext() {
  const ctx = useContext(ChatSocketContext);
  if (!ctx) {
    throw new Error(
      'useChatSocketContext must be used within <ChatSocketProvider>'
    );
  }
  return ctx;
}
