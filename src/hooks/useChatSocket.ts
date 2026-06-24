'use client';

import { useChatSocketContext } from '@/providers/ChatSocketProvider';
import type { Conversation } from '@/apiQuery/chat/types';
import { useEffect, useMemo } from 'react';

export const useChatSocket = (
  conversations: Conversation[],
  activePeerId: string | null
) => {
  const ctx = useChatSocketContext();

  useEffect(() => {
    ctx.setConversations(conversations);
  }, [conversations, ctx.setConversations]);

  useEffect(() => {
    ctx.setActivePeerId(activePeerId);
  }, [activePeerId, ctx.setActivePeerId]);

  return useMemo(
    () => ({
      isConnected: ctx.isConnected,
      onlineUsers: ctx.onlineUsers,
      typingUsers: ctx.typingUsers,
      sendMessage: ctx.sendMessage,
      markAsRead: ctx.markAsRead,
      sendTyping: ctx.sendTyping,
    }),
    [
      ctx.isConnected,
      ctx.onlineUsers,
      ctx.typingUsers,
      ctx.sendMessage,
      ctx.markAsRead,
      ctx.sendTyping,
    ]
  );
};
