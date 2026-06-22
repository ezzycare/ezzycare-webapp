'use client';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface UseHorizontalScrollParams {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  itemCount: number;
}

export const useHorizontalScroll = ({
  scrollRef,
  itemCount,
}: UseHorizontalScrollParams) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(activeIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.offsetWidth);
    setActiveIndex(index);
  }, [scrollRef]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollRef]);

  const scrollTo = useCallback(
    (direction: 'left' | 'right') => {
      const el = scrollRef.current;
      if (!el) return;
      const currentIdx = activeIndexRef.current;
      const newIndex =
        direction === 'left'
          ? Math.max(0, currentIdx - 1)
          : Math.min(itemCount - 1, currentIdx + 1);
      el.children[newIndex]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
      });
    },
    [itemCount, scrollRef]
  );

  const canScrollLeft = activeIndex > 0;
  const canScrollRight = activeIndex < itemCount - 1;

  const hasMultipleItems = itemCount > 1;

  const arrowButtonClass =
    'absolute top-1/2 -translate-y-1/2 z-10 bg-background/80 dark:bg-background/60 backdrop-blur-sm rounded-full p-1.5 shadow-md border border-border1';

  const LeftArrow = hasMultipleItems ? (
    <button
      className={cn(arrowButtonClass, 'left-0', !canScrollLeft && 'opacity-30')}
      onClick={() => canScrollLeft && scrollTo('left')}
    >
      <ChevronLeft size={20} className="text-text" />
    </button>
  ) : null;

  const RightArrow = hasMultipleItems ? (
    <button
      className={cn(
        arrowButtonClass,
        'right-0',
        !canScrollRight && 'opacity-30'
      )}
      onClick={() => canScrollRight && scrollTo('right')}
    >
      <ChevronRight size={20} className="text-text" />
    </button>
  ) : null;

  const Indicators = hasMultipleItems ? (
    <div className="flex items-center justify-center gap-1.5 mt-3">
      {Array.from({ length: itemCount }).map((_, idx) => (
        <button
          key={idx}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            idx === activeIndex
              ? 'w-4 bg-primary'
              : 'w-1.5 bg-gray-300 dark:bg-gray-600'
          }`}
          onClick={() => {
            scrollRef.current?.children[idx]?.scrollIntoView({
              behavior: 'smooth',
              inline: 'center',
            });
          }}
        />
      ))}
    </div>
  ) : null;

  return {
    activeIndex,
    LeftArrow,
    RightArrow,
    Indicators,
    scrollTo,
  };
};
