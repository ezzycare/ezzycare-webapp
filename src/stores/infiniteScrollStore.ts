import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface Identifiable {
  id: string | number;
}

interface ListEntry {
  items: Identifiable[];
  firstPageSnapshot: { firstId: string | number; count: number } | null;
}

interface InfiniteScrollStoreState {
  lists: Record<string, ListEntry>;

  mergeItems: (listKey: string, incoming: Identifiable[]) => void;
  resetIfFirstPageChanged: (
    listKey: string,
    firstPageItems: Identifiable[]
  ) => boolean;
  clearList: (listKey: string) => void;
}

export const useInfiniteScrollStore = create<InfiniteScrollStoreState>()(
  devtools(
    (set, get) => ({
      lists: {},

      mergeItems: (listKey, incoming) => {
        set((state) => {
          const current = state.lists[listKey];
          const existing = current?.items ?? [];

          if (existing.length === 0) {
            return {
              lists: {
                ...state.lists,
                [listKey]: { ...current, items: incoming },
              },
            };
          }

          const existingIds = new Set(existing.map((item) => item.id));
          const newItems = incoming.filter((item) => !existingIds.has(item.id));

          if (newItems.length === 0) return state;

          return {
            lists: {
              ...state.lists,
              [listKey]: {
                ...current,
                items: [...existing, ...newItems],
              },
            },
          };
        });
      },

      resetIfFirstPageChanged: (listKey, firstPageItems) => {
        const current = get().lists[listKey];
        const firstId = firstPageItems[0]?.id;
        const count = firstPageItems.length;

        if (!current?.firstPageSnapshot) {
          set((state) => ({
            lists: {
              ...state.lists,
              [listKey]: {
                items: firstPageItems,
                firstPageSnapshot: { firstId, count },
              },
            },
          }));
          return false;
        }

        const snapshot = current.firstPageSnapshot;
        const changed =
          firstId !== snapshot.firstId || count !== snapshot.count;

        if (changed) {
          set((state) => ({
            lists: {
              ...state.lists,
              [listKey]: {
                items: firstPageItems,
                firstPageSnapshot: { firstId, count },
              },
            },
          }));
        }

        return changed;
      },

      clearList: (listKey) => {
        set((state) => {
          const { [listKey]: _, ...rest } = state.lists;
          return { lists: rest };
        });
      },
    }),
    {
      name: 'infiniteScrollStore',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);
