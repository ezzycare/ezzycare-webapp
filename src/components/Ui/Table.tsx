/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useMemo, useState } from 'react';
import Dropdown from './Dropdown';

type SortDirection = 'asc' | 'desc' | null;

type Column<T> = {
  field: keyof T | string;
  label: string;
  sortable?: boolean;
  width?: string;
  className?: string;

  /**
   * Custom cell renderer
   */
  render?: (value: any, row: T, index: number) => ReactNode;

  /**
   * Custom header renderer
   */
  headerRender?: () => ReactNode;

  /**
   * Filter function for this column
   */
  filterFn?: (row: T, query: string) => boolean;
};

type FilterOption<T> = {
  label: string;
  value: string;
  fn: (row: T) => boolean;
};

type BaseTableProps<T> = {
  data: T[];
  columns: Column<T>[];

  /**
   * Global Search
   */
  searchable?: boolean;
  searchPlaceholder?: string;

  /**
   * Filters
   */
  filters?: FilterOption<T>[];

  /**
   * Custom Row Renderer
   */
  rowRender?: (row: T, columns: Column<T>[], index: number) => ReactNode;

  /**
   * Extra content
   */
  children?: ReactNode;

  /**
   * Empty state
   */
  emptyState?: ReactNode;

  /**
   * Row click
   */
  onRowClick?: (row: T) => void;

  /**
   * Styling
   */
  className?: string;
};

export default function BaseTable<T extends Record<string, any>>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Search...',
  filters = [],
  rowRender,
  children,
  emptyState = 'No data available',
  onRowClick,
  className = '',
}: BaseTableProps<T>) {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const [sortConfig, setSortConfig] = useState<{
    field: string | null;
    direction: SortDirection;
  }>({
    field: null,
    direction: null,
  });

  const handleSort = (field: string) => {
    setSortConfig((prev) => {
      if (prev.field !== field) {
        return {
          field,
          direction: 'asc',
        };
      }

      if (prev.direction === 'asc') {
        return {
          field,
          direction: 'desc',
        };
      }

      return {
        field: null,
        direction: null,
      };
    });
  };

  const processedData = useMemo(() => {
    let rows = [...data];

    /**
     * FILTER
     */
    if (activeFilter !== 'all') {
      const currentFilter = filters.find((f) => f.value === activeFilter);

      if (currentFilter) {
        rows = rows.filter(currentFilter.fn);
      }
    }

    /**
     * SEARCH
     */
    if (search.trim()) {
      const query = search.toLowerCase();

      rows = rows.filter((row) =>
        columns.some((col) => {
          if (col.filterFn) {
            return col.filterFn(row, query);
          }

          const value = row[col.field as keyof T];

          return String(value ?? '')
            .toLowerCase()
            .includes(query);
        })
      );
    }

    /**
     * SORT
     */
    if (sortConfig.field && sortConfig.direction) {
      rows.sort((a, b) => {
        const aValue = a[sortConfig.field as keyof T];
        const bValue = b[sortConfig.field as keyof T];

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }

        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }

        return 0;
      });
    }

    return rows;
  }, [data, columns, filters, search, activeFilter, sortConfig]);

  const gridTemplateColumns = columns
    .map((col) => col.width || '1fr')
    .join(' ');

  return (
    <div
      className={`w-full rounded-2xl bg-surface-card overflow-hidden -z-1 min-h-75 ${className}`}
    >
      {/* TOP BAR */}
      {/* <div className="flex flex-col gap-4 border-b border-border p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          {searchable && (
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="h-11 w-full rounded-xl border border-border bg-white px-4 text-sm text-text outline-none focus:border-primary"
            />
          )}

          {filters.length > 0 && (
            <Dropdown
              options={filters}
              value={activeFilter}
              onChange={(value) => setActiveFilter(String(value))}
            />
          )}
        </div>

        {children}
      </div> */}

      {/* HEADER */}
      <div
        className="grid border-b border-gray-3 bg-gray-2 px-4 py-4 text-text-muted"
        style={{
          gridTemplateColumns,
        }}
      >
        {columns.map((column) => {
          const isSorted = sortConfig.field === column.field;

          return (
            <button
              key={String(column.field)}
              disabled={!column.sortable}
              onClick={() =>
                column.sortable && handleSort(String(column.field))
              }
              className={`bg-gray-2 flex items-center gap-2 text-left text-text-muted text-xs font-semibold uppercase tracking-wide ${
                column.sortable
                  ? 'cursor-pointer hover:text-text'
                  : 'cursor-default'
              } ${column.className || ''}`}
            >
              {column.headerRender ? column.headerRender() : column.label}

              {column.sortable && (
                <span className="text-[10px]">
                  {!isSorted && '↕'}

                  {isSorted && sortConfig.direction === 'asc' && '↑'}

                  {isSorted && sortConfig.direction === 'desc' && '↓'}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* BODY */}
      <div className="divide-y divide-gray-3">
        {processedData.length === 0 && (
          <div className="flex items-center justify-center py-3 text-sm text-text">
            {emptyState}
          </div>
        )}

        {processedData.map((row, index) => {
          if (rowRender) {
            return <div key={index}>{rowRender(row, columns, index)}</div>;
          }

          return (
            <div
              key={index}
              onClick={() => onRowClick?.(row)}
              className="grid items-center px-4 py-3 transition-colors hover:bg-primary/10"
              style={{
                gridTemplateColumns,
              }}
            >
              {columns.map((column) => {
                const value = row[column.field as keyof T];

                return (
                  <div
                    key={String(column.field)}
                    className={`text-sm text-text-muted ${column.className || ''}`}
                  >
                    {column.render
                      ? column.render(value, row, index)
                      : String(value ?? '-')}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
