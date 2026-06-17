'use client';

import type { ChatMessage, ChatMessageSender } from '@/apiQuery/chat/types';
import { getAuthToken } from '@/services/getAuthToken';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { io, type Socket } from 'socket.io-client';

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || '';
const SOCKET_PATH = '/chat';

interface ServerToClientEvents {
  new_message: (message: ChatMessage) => void;
  messages_read: (data: { peerId: string; readerId: string }) => void;
  user_online: (data: { userId: string }) => void;
  user_offline: (data: { userId: string }) => void;
  typing: (data: { peerId: string; isTyping: boolean; userId: string }) => void;
}

interface ClientToServerEvents {
  send_message: (data: {
    receiverId: number;
    message: string;
    sender: ChatMessageSender;
  }) => void;
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

    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      SOCKET_URL,
      {
        path: `${SOCKET_PATH}/socket.io`,
        auth: { token },
        transports: ['websocket'],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 10000,
      }
    );

    socketRef.current = socket;

    // ── Connection ──
    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));

    // ── New message ──
    socket.on('new_message', (message: ChatMessage) => {
      const peerId = message.senderId;

      // Push into chat history cache
      queryClient.setQueryData<{ success: boolean; data: ChatMessage[] }>(
        ['chat', 'history', peerId],
        (old) => {
          if (!old) {
            return { success: true, message: '', data: [message] };
          }
          const exists = old.data.some((m) => m.id === message.id);
          if (exists) return old;
          return {
            ...old,
            data: [...old.data, message],
          };
        }
      );

      // Update conversations sidebar
      queryClient.setQueryData<{
        pages: {
          data?: { items: { peer: { id: string }; lastMessage?: object }[] };
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
                            id: message.id,
                            senderId: message.senderId,
                            receiverId: message.receiverId,
                            message: message.message,
                            isRead: message.isRead,
                            createdAt: message.createdAt,
                          },
                          unreadCount:
                            c.peer.id === peerId
                              ? ((c as { unreadCount?: number }).unreadCount ??
                                  0) + 1
                              : (c as { unreadCount?: number }).unreadCount,
                        }
                      : c
                  ),
                }
              : page.data,
          })),
        };
      });

      // Browser notification for background tabs
      if (document.hidden && Notification.permission === 'granted') {
        const senderName = message.sender
          ? `${message.sender.firstName} ${message.sender.lastName}`
          : 'Someone';
        new Notification(`New message from ${senderName}`, {
          body: message.message,
          icon: message.sender?.profileImage ?? undefined,
          tag: message.id,
        });
      }
    });

    // ── Read receipts ──
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

    // ── Presence ──
    socket.on('user_online', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: true }));
    });
    socket.on('user_offline', ({ userId }) => {
      setOnlineUsers((prev) => ({ ...prev, [userId]: false }));
    });

    // ── Typing ──
    socket.on('typing', ({ peerId, isTyping }) => {
      setTypingUsers((prev) => ({ ...prev, [peerId]: isTyping }));
    });

    // Request notification permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, [queryClient]);

  // ── Actions ──

  const sendMessage = useCallback(
    (receiverId: number, message: string, sender: ChatMessageSender) => {
      socketRef.current?.emit('send_message', { receiverId, message, sender });
    },
    []
  );

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
