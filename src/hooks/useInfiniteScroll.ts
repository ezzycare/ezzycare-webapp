'use client';
import { useInfiniteScrollStore } from '@/stores/infiniteScrollStore';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface Identifiable {
  id: string | number;
}

interface UseInfiniteScrollParams {
  listKey: string;
  items: Identifiable[] | undefined;
  firstPageItems: Identifiable[] | undefined;
  fetchNextPage: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
}

export const useInfiniteScroll = ({
  listKey,
  items,
  firstPageItems,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: UseInfiniteScrollParams) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const mergeItems = useInfiniteScrollStore((s) => s.mergeItems);
  const resetIfFirstPageChanged = useInfiniteScrollStore(
    (s) => s.resetIfFirstPageChanged
  );
  const clearList = useInfiniteScrollStore((s) => s.clearList);
  const storedItems = useInfiniteScrollStore((s) => s.lists[listKey]?.items);

  useEffect(() => {
    return () => {
      clearList(listKey);
    };
  }, [listKey, clearList]);

  useEffect(() => {
    if (firstPageItems?.length) {
      resetIfFirstPageChanged(listKey, firstPageItems);
    }
  }, [listKey, firstPageItems, resetIfFirstPageChanged]);

  useEffect(() => {
    if (items?.length) {
      mergeItems(listKey, items);
    }
  }, [listKey, items, mergeItems]);

  const accumulatedItems = useMemo(() => {
    return (storedItems as Identifiable[]) ?? [];
  }, [storedItems]);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage]
  );

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(handleIntersect, {
      rootMargin: '200px',
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [handleIntersect]);

  return {
    accumulatedItems,
    sentinelRef,
  };
};
