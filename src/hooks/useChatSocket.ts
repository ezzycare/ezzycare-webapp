'use client';

import type { ChatMessage } from '@/apiQuery/chat/types';
import { getAuthToken } from '@/services/getAuthToken';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/+$/, '');

interface ServerToClientEvents {
  receive_message: (data: { message: string; senderId: string }) => void;
  message_sent: (data: { id: string; createdAt: string }) => void;
  messages_read: (data: { peerId: string; readerId: string }) => void;
  user_online: (data: { userId: string }) => void;
  user_offline: (data: { userId: string }) => void;
  typing: (data: { peerId: string; isTyping: boolean; userId: string }) => void;
}

interface ClientToServerEvents {
  send_message: (data: { receiverId: number; message: string }) => void;
  mark_read: (data: { peerId: string }) => void;
  typing: (data: { peerId: string; isTyping: boolean }) => void;
}

export const useChatSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = getAuthToken();
    const namespace = `${SOCKET_URL}/chat`;

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      namespace,
      {
        auth: { token },
        transports: ['polling', 'websocket'],
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

    socket.on(
      'receive_message',
      (data: { message: string; senderId: string }) => {
        const peerId = data.senderId;

        queryClient.setQueryData<{ success: boolean; data: ChatMessage[] }>(
          ['chat', 'history', peerId],
          (old) => {
            const newMsg: ChatMessage = {
              id: crypto.randomUUID(),
              message: data.message,
              senderId: data.senderId,
              receiverId: '',
              isRead: false,
              createdAt: new Date().toISOString(),
              sender: { firstName: '', lastName: '', profileImage: null },
            };

            if (!old) {
              return { success: true, message: '', data: [newMsg] };
            }
            return {
              ...old,
              data: [...old.data, newMsg],
            };
          }
        );

        queryClient.setQueryData<{
          pages: {
            data?: {
              items: { peer: { id: string }; lastMessage?: object }[];
            };
          }[];
        }>(['chat', 'conversations', 'infinite'], (old) => {
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
                              id: crypto.randomUUID(),
                              senderId: data.senderId,
                              receiverId: '',
                              message: data.message,
                              isRead: false,
                              createdAt: new Date().toISOString(),
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
        });

        if (document.hidden && Notification.permission === 'granted') {
          new Notification('New message', {
            body: data.message,
            tag: data.senderId,
          });
        }
      }
    );

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

    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  const sendMessage = useCallback((receiverId: number, message: string) => {
    socketRef.current?.emit('send_message', { receiverId, message });
  }, []);

  const markAsRead = useCallback((peerId: string) => {
    socketRef.current?.emit('mark_read', { peerId });
  }, []);

  const sendTyping = useCallback((peerId: string, isTyping: boolean) => {
    socketRef.current?.emit('typing', { peerId, isTyping });
  }, []);

  return {
    isConnected,
    onlineUsers,
    typingUsers,
    sendMessage,
    markAsRead,
    sendTyping,
  };
};
