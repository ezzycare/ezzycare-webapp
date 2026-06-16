/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import { useGetChatHistoryQuery } from '@/apiQuery/chat/getChatHistory';
import { useGetConversationsInfiniteQuery } from '@/apiQuery/chat/getConversations';
import { useMarkChatReadMutation } from '@/apiQuery/chat/markRead';
import { useSendMessageMutation } from '@/apiQuery/chat/sendMessage';
import BounceLoader from '@/components/Base/BounceLoader';
import SearchInput from '@/components/Ui/SearchInput';
import { useChatSocket } from '@/hooks/useChatSocket';
import { ChatTailIconLocal } from '@/icons/DashboardIcons';
import { cn } from '@/lib/utils';
import { AuthStore, useAuthStore } from '@/stores/authStore';
import dayjs from 'dayjs';
import {
  BadgeCheck,
  ChevronLeft,
  Mic,
  Send,
  Wifi,
  WifiOff,
} from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener('change', update);
    return () => mql.removeEventListener('change', update);
  }, [breakpoint]);

  return isMobile;
}

export default function MessagesPage() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const isMobile = useIsMobile();
  const userId = useAuthStore((state: AuthStore) => state.user?.id);
  const user = useAuthStore((state: AuthStore) => state.user);
  const searchParams = useSearchParams();

  const { conversations, fetchNextPage, hasNextPage, isFetching } =
    useGetConversationsInfiniteQuery();
  const { mutate: sendMessage } = useSendMessageMutation();
  const { mutate: markReadREST } = useMarkChatReadMutation();

  const {
    isConnected,
    onlineUsers,
    typingUsers,
    markAsRead: markAsReadSocket,
    sendTyping,
  } = useChatSocket();

  const activeConversation = conversations.find((c) => c.peer.id === activeId);

  // Open conversation from URL query param (e.g. /dashboard/messages?peerId=123)
  useEffect(() => {
    const peerId = searchParams.get('peerId');
    if (peerId) {
      setActiveId(peerId);
    }
  }, [searchParams]);

  const { messages, isFetching: isLoadingMessages } = useGetChatHistoryQuery(
    { peerId: activeId ?? '' },
    { enabled: !!activeId }
  );

  // Mark conversation as read when selected
  useEffect(() => {
    if (activeId) {
      markReadREST({ peerId: activeId });
      markAsReadSocket(activeId);
    }
  }, [activeId, markReadREST, markAsReadSocket]);

  // On desktop, default to first conversation (unless URL peerId is set)
  useEffect(() => {
    if (
      !isMobile &&
      !activeId &&
      conversations.length > 0 &&
      !searchParams.get('peerId')
    ) {
      setActiveId(conversations[0].peer.id);
    }
  }, [isMobile, activeId, conversations, searchParams]);

  const messagesRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Infinite scroll for conversations list
  const listRef = useRef<HTMLUListElement>(null);
  useEffect(() => {
    const el = listRef.current;
    if (!el || !hasNextPage || isFetching) return;

    const handleScroll = () => {
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
        fetchNextPage();
      }
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [hasNextPage, isFetching, fetchNextPage]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInput(e.target.value);
      if (activeId) {
        sendTyping(activeId, e.target.value.length > 0);
      }
    },
    [activeId, sendTyping]
  );

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !activeId) return;

    sendMessage(
      {
        receiverId: Number(activeId),
        message: input.trim(),
        sender: {
          firstName: user?.firstName ?? '',
          lastName: user?.lastName ?? '',
          profileImage: user?.profileImage ?? null,
        },
      },
      { onSuccess: () => setInput('') }
    );
    if (activeId) sendTyping(activeId, false);
  };

  const showList = isMobile ? !activeId : true;
  const showChat = isMobile ? !!activeId : true;

  const ListView = (
    <aside className="flex flex-col gap-4 w-full">
      <div className="w-full flex items-center">
        <SearchInput
          type="text"
          placeholder="Search here"
          className="w-full h-10 bg-gray-1 text-text-muted outline-none"
          inputClassName="placeholder:text-sm text-sm placeholder:text-text-muted"
          onChange={() => {}}
          onOpenFilter={() => {}}
        />
      </div>

      <ul
        ref={listRef}
        className="flex flex-col gap-2 overflow-y-auto max-h-[70vh] rounded-xl relative"
      >
        {conversations.map((c) => (
          <li key={c.peer.id} className="rounded-xl bg-transparent">
            <button
              type="button"
              onClick={() => setActiveId(c.peer.id)}
              className={cn(
                `w-full flex items-center gap-3 p-3 border border-blue-3a
                transition-colors text-left rounded-xl shadow-md`,
                activeId === c.peer.id && !isMobile
                  ? 'bg-blue-2'
                  : 'hover:bg-gray-2'
              )}
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={
                    c.peer.profileImage ??
                    `https://unsplash.it/300/300?random=${c.peer.id}`
                  }
                  alt={`${c.peer.firstName} ${c.peer.lastName}`}
                  fill
                  className="rounded-full object-cover"
                />
                {onlineUsers[c.peer.id] && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-10 border-2 border-surface-card rounded-full" />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {c.peer.firstName} {c.peer.lastName}
                </p>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {c.lastMessage?.message}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                  {c.lastMessage?.createdAt
                    ? dayjs(c.lastMessage.createdAt).format('DD MMM, YYYY')
                    : ''}
                </span>
                {c.unreadCount > 0 ? (
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-blue-10 text-foreground text-[10px] font-semibold flex items-center justify-center">
                    {c.unreadCount}
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        ))}
        {isFetching && <BounceLoader />}
      </ul>
    </aside>
  );

  const ChatView = (
    <section className="bg-blue-2 md:rounded-2xl flex flex-col max-h-[70vh] overflow-hidden h-full relative">
      <header className="bg-surface-card md:mx-5 md:mt-5 md:rounded-2xl px-4 md:px-5 py-3.5 flex items-center gap-3">
        {isMobile && (
          <button
            type="button"
            onClick={() => setActiveId(null)}
            className="-ml-1 p-1 text-text hover:bg-gray-2 rounded-full transition-colors"
            aria-label="Back to conversations"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <div className="relative w-10 h-10 shrink-0">
          <Image
            src={
              activeConversation?.peer.profileImage ??
              `https://unsplash.it/300/300?random=${activeId}`
            }
            alt={`${activeConversation?.peer.firstName ?? ''} ${activeConversation?.peer.lastName ?? ''}`}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-text">
              {activeConversation
                ? `${activeConversation.peer.firstName} ${activeConversation.peer.lastName}`
                : 'Unknown'}
            </h2>
            <BadgeCheck className="w-4 h-4 text-green-10 fill-green-10 stroke-foreground" />
          </div>
          <p className="text-xs text-text-muted">
            {activeId && typingUsers[activeId]
              ? 'typing...'
              : activeId && onlineUsers[activeId]
                ? 'online'
                : activeId
                  ? 'offline'
                  : ''}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          {isConnected ? (
            <Wifi size={14} className="text-green-10" />
          ) : (
            <WifiOff size={14} className="text-red-500" />
          )}
        </div>
      </header>

      <div
        ref={messagesRef}
        className="flex-1 px-4 md:px-5 py-6 flex flex-col gap-5 max-h[50vh] overflow-y-auto"
      >
        <div className="flex justify-center">
          <span className="px-3.5 py-1 rounded-full bg-neutral-3a text-xs text-text-muted">
            Today
          </span>
        </div>

        {isLoadingMessages && <BounceLoader />}

        {messages
          ?.sort(
            (a, b) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix()
          )
          .map((m) => {
            const fromMe = m.senderId === userId;

            return (
              <div
                key={m.id}
                className={cn(
                  'flex items-start gap-2',
                  fromMe ? 'justify-end' : 'justify-start'
                )}
              >
                {!fromMe && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={
                        m.sender?.profileImage ??
                        `https://unsplash.it/300/300?random=${m.id}`
                      }
                      alt=""
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}

                <div
                  className={cn(
                    'flex flex-col gap-1 max-w-[75%] md:max-w-[60%]',
                    fromMe ? 'items-end' : 'items-start'
                  )}
                >
                  <div
                    className={cn(
                      'px-4 py-3 rounded-2xl text-sm leading-relaxed relative',
                      fromMe
                        ? 'bg-blue-10 text-foreground rounded-br-md'
                        : 'bg-surface-card text-text rounded-bl-md'
                    )}
                  >
                    {m.message}
                    <ChatTailIconLocal
                      className={cn(
                        'absolute -bottom-1',
                        fromMe
                          ? 'rotate-y-180 -right-1.5 text-blue-10'
                          : '-left-1.5 text-surface-card'
                      )}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-[11px] text-text-muted px-1',
                      fromMe ? 'self-end' : 'self-start'
                    )}
                  >
                    {dayjs(m.createdAt).format('hh:mm A')}
                  </span>
                </div>

                {fromMe && (
                  <div className="relative w-8 h-8 shrink-0">
                    <Image
                      src={
                        m.sender?.profileImage ??
                        `https://unsplash.it/300/300?random=${m.id}`
                      }
                      alt=""
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
      </div>

      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
        <form onSubmit={handleSend} className="flex items-center gap-3">
          <div
            className={cn(
              'flex-1 md:max-w-141 md:mx-auto bg-surface-card rounded-full h-11',
              'px-4 flex items-center gap-3 border border-border2'
            )}
          >
            <button
              type="button"
              className="text-text-muted hover:text-text-alt transition-colors"
              aria-label="Voice message"
            >
              <Mic className="w-4 h-4" />
            </button>
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type here"
              className={cn(
                'flex-1 bg-transparent outline-none text-sm text-text',
                'placeholder:text-text-muted border-r border-border2'
              )}
            />
            <button
              type="submit"
              className={cn(
                'w-5 h-5 rounded-sm bg-blue-10 flex items-center justify-center',
                'hover:bg-blue-11 transition-colors disabled:opacity-50 cursor-pointer'
              )}
              disabled={!input.trim()}
              aria-label="Send"
            >
              <Send className="w-3 h-3 text-foreground" />
            </button>
          </div>
        </form>
      </div>
    </section>
  );

  return (
    <div className="md:grid md:grid-cols-[340px_1fr] md:gap-5 max-h-[90vh] md:overflow-y-auto h-dvh md:h-auto">
      {showList && (
        <div
          className={cn(
            'flex flex-col',
            isMobile ? 'h-full px-4 pt-4 pb-2' : ''
          )}
        >
          {ListView}
        </div>
      )}
      {showChat && (
        <div className={cn(isMobile ? 'h-full flex flex-col' : '')}>
          {ChatView}
        </div>
      )}
    </div>
  );
}
