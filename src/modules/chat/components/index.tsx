/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import SearchInput from '@/components/Ui/SearchInput';
import { ChatTailIconLocal } from '@/icons/DashboardIcons';
import { cn } from '@/lib/utils'; // or wherever your cn helper lives
import { BadgeCheck, ChevronLeft, Mic, Send } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type Conversation = {
  id: string;
  name: string;
  preview: string;
  date: string;
  unread?: number;
};

type Message = {
  id: string;
  text: string;
  time: string;
  fromMe: boolean;
};

// ... your conversations and messages arrays ...

// Small hook to detect mobile viewport
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

export default function MessagesPage({
  conversations,
  messages,
}: {
  conversations: Conversation[];
  messages: Message[];
}) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const isMobile = useIsMobile();

  // On desktop, default to first conversation. On mobile, start at list.
  useEffect(() => {
    if (!isMobile && !activeId) setActiveId(conversations[0]?.id ?? null);
  }, [isMobile, activeId]);

  const activeConversation = conversations.find((c) => c.id === activeId);

  // On mobile: when no conversation selected → show list. When selected → show chat.
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

      <ul className="flex flex-col gap-2">
        {conversations.map((c) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setActiveId(c.id)}
              className={cn(
                `w-full flex items-center gap-3 p-3 border border-blue-3a
                transition-colors text-left rounded-xl shadow-md`,
                activeId === c.id && !isMobile ? 'bg-blue-2' : 'hover:bg-gray-2'
              )}
            >
              <div className="relative w-10 h-10 shrink-0">
                <Image
                  src={`https://unsplash.it/300/300?random=${c.id}`}
                  alt={c.name}
                  fill
                  className="rounded-full object-cover"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text truncate">
                  {c.name}
                </p>
                <p className="text-xs text-text-muted truncate mt-0.5">
                  {c.preview}
                </p>
              </div>

              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-[11px] text-text-muted whitespace-nowrap">
                  {c.date}
                </span>
                {c.unread ? (
                  <span className="min-w-4.5 h-4.5 px-1 rounded-full bg-blue-10 text-foreground text-[10px] font-semibold flex items-center justify-center">
                    {c.unread}
                  </span>
                ) : null}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );

  const ChatView = (
    <section className="bg-blue-2 md:rounded-2xl flex flex-col overflow-hidden h-full">
      {/* Header */}
      <header className="bg-surface-card md:mx-5 md:mt-5 md:rounded-2xl px-4 md:px-5 py-3.5 flex items-center gap-3">
        {/* Mobile back button */}
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
            src={`https://unsplash.it/300/300?random=${activeId}`}
            alt={activeConversation?.name ?? ''}
            fill
            className="rounded-full object-cover"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm font-bold text-text">
              {activeConversation?.name ?? 'Comfort Jackson'}
            </h2>
            <BadgeCheck className="w-4 h-4 text-green-10 fill-green-10 stroke-foreground" />
          </div>
          <p className="text-xs text-text-muted">Cardiologist</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 md:px-5 py-6 flex flex-col gap-5">
        <div className="flex justify-center">
          <span className="px-3.5 py-1 rounded-full bg-neutral-3a text-xs text-text-muted">
            Today
          </span>
        </div>

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex items-start gap-2',
              m.fromMe ? 'justify-end' : 'justify-start'
            )}
          >
            {!m.fromMe && (
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={`https://unsplash.it/300/300?random=${m.id}`}
                  alt=""
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}

            <div
              className={cn(
                'flex flex-col gap-1 max-w-[75%] md:max-w-[60%]',
                m.fromMe ? 'items-end' : 'items-start'
              )}
            >
              <div
                className={cn(
                  'px-4 py-3 rounded-2xl text-sm leading-relaxed relative',
                  m.fromMe
                    ? 'bg-blue-10 text-foreground rounded-br-md'
                    : 'bg-surface-card text-text rounded-bl-md'
                )}
              >
                {m.text}
                <ChatTailIconLocal
                  className={cn(
                    'absolute -bottom-1',
                    m.fromMe
                      ? 'rotate-y-180 -right-1.5 text-blue-10'
                      : '-left-1.5 text-surface-card'
                  )}
                />
              </div>
              <span
                className={cn(
                  'text-[11px] text-text-muted px-1',
                  m.fromMe ? 'self-end' : 'self-start'
                )}
              >
                {m.time}
              </span>
            </div>

            {m.fromMe && (
              <div className="relative w-8 h-8 shrink-0">
                <Image
                  src={`https://unsplash.it/300/300?random=${m.id}`}
                  alt=""
                  fill
                  className="rounded-full object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="px-4 md:px-5 pb-4 md:pb-5 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!input.trim()) return;
            setInput('');
          }}
          className="flex items-center gap-3"
        >
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
              onChange={(e) => setInput(e.target.value)}
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
