/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from 'react';

export type SortDirection = 'asc' | 'desc' | null;

export type Column<T> = {
  field: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  className?: string;
  render?: (value: any, row: T, index: number) => ReactNode;
  headerRender?: () => ReactNode;
  filterFn?: (row: T, query: string) => boolean;
};

// export type FilterOption<T> = {
//   label: string;
//   value: string;
//   fn: (row: T) => boolean;
// };
export type FilterGroup<T> = {
  key: string; // e.g. "status", "role", "category"
  label: string;
  options: {
    label: string;
    value: string;
  }[];
  fn: (row: T, value: string) => boolean;
};

export type BaseTableProps<T> = {
  titleComponent?: ReactNode;
  data: T[];
  columns: Column<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  filterLabel?: string;
  // filters?: FilterOption<T>[];
  filters?: FilterGroup<T>[];
  rowRender?: (row: T, columns: Column<T>[], index: number) => ReactNode;
  children?: ReactNode;
  emptyState?: ReactNode;
  onRowClick?: (row: T) => void;
  className?: string;
  searchContainerClassName?: string;
};
