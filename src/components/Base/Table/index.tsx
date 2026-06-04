'use client';

import Button from '@/components/Ui/Button';
/* eslint-disable @typescript-eslint/no-explicit-any */
import Dropdown from '@/components/Ui/Dropdown';
import { TextInput } from '@/components/Ui/TextInput';
import { cn } from '@/lib/utils';
import { BaseTableProps, FilterGroup, SortDirection } from '@/types/table';
import { Cross1Icon } from '@radix-ui/react-icons';
import { SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import { MobileTable } from './MobileTable';

export default function BaseTable<T extends Record<string, any>>({
  titleComponent,
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
  searchContainerClassName,
}: BaseTableProps<T>) {
  const [search, setSearch] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<
    Record<string, string>
  >({});
  const [appliedFilters, setAppliedFilters] = useState<Record<string, string>>(
    {}
  );

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
    if (filters.length > 0) {
      rows = rows.filter((row) => {
        return filters.every((filterGroup) => {
          const value = appliedFilters[filterGroup.key];

          if (!value || value === 'all') return true;

          return filterGroup.fn(row, value);
        });
      });
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
  }, [data, columns, filters, search, appliedFilters, sortConfig]);

  return (
    <div
      className={`w-full rounded-2xl bg-surface-card overflow-hidden -z-1 min-h-75 ${className}`}
    >
      {/* TOP BAR */}
      <div
        className={cn(
          `flex flex-col gap-4 p-4 pb-6
          md:flex-row md:items-center md:justify-between`
        )}
      >
        <div className="flex flex-1 items-center gap-3 flex-wrap">
          {titleComponent && <div className="mr-auto">{titleComponent}</div>}

          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            {searchable && (
              <div
                className={`flex items-center w-full min-w-50 sm:max-w-76.5 ${searchContainerClassName} ${titleComponent ? 'ml-auto' : ''} `}
              >
                <TextInput
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  leftIcon={
                    <SearchIcon size={18} className="text-text-muted ml-2" />
                  }
                  className={cn(`
                  h-9! rounded-xl border border-border2 bg-surface-card 
                  px-4 pl-10! text-sm text-text outline-none focus:border-primary
                  w-full
                `)}
                />
              </div>
            )}

            {filters.length > 0 && (
              <div className="flex items-center gap-3">
                {filters.map((filterGroup: FilterGroup<T>) => (
                  <Dropdown
                    key={filterGroup.key}
                    placeholder={filterGroup.label}
                    options={filterGroup.options}
                    value={selectedFilters[filterGroup.key] || 'all'}
                    onChange={(value) =>
                      setSelectedFilters((prev) => ({
                        ...prev,
                        [filterGroup.key]: String(value),
                      }))
                    }
                  />
                ))}

                <Button
                  className="h-9! bg-blue-3a! text-primary! text-xs font-semibold whitespace-nowrap"
                  onClick={() => setAppliedFilters(selectedFilters)}
                >
                  Apply Filters
                </Button>
                {Object.values(appliedFilters)?.length > 0 && (
                  <Button
                    className="h-9! bg-error-3a! text-error! text-xs font-semibold"
                    onClick={() => {
                      setSelectedFilters({});
                      setAppliedFilters({});
                    }}
                  >
                    <Cross1Icon className="w-4 h-4 font-semibold" />
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {children}
      </div>

      <div className="hidden lg:block overflow-x-auto w-full">
        <table
          className="w-full border-collapse table-fixed min-w-md"
          style={{ tableLayout: 'fixed' }}
        >
          {/* COLUMN WIDTHS (replaces gridTemplateColumns) */}
          <colgroup>
            {columns.map((col) => (
              <col
                key={String(col.field)}
                style={{ width: col.width || 'auto' }}
              />
            ))}
          </colgroup>

          {/* HEADER */}
          <thead>
            <tr className="border-b border-gray-3 bg-gray-2 text-text-muted rounded-xl">
              {columns.map((column) => {
                const isSorted = sortConfig.field === column.field;

                return (
                  <th
                    key={String(column.field)}
                    className={cn(
                      `min-w-32.5 first:pl-4 last:pr-4 py-3 text-left text-xs font-semibold 
                      capitalize tracking-wide text-text-muted overflow-visible`,
                      column.sortable
                        ? 'cursor-pointer hover:text-text'
                        : 'cursor-default',
                      column.className || ''
                    )}
                    onClick={() =>
                      column.sortable && handleSort(String(column.field))
                    }
                  >
                    <div className="flex items-center gap-2 ">
                      {column.headerRender
                        ? column.headerRender()
                        : column.label}

                      {column.sortable && (
                        <span className="text-[10px]">
                          {!isSorted && '↕'}
                          {isSorted && sortConfig.direction === 'asc' && '↑'}
                          {isSorted && sortConfig.direction === 'desc' && '↓'}
                        </span>
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-gray-3">
            {processedData.length === 0 && (
              <tr>
                <td colSpan={columns.length}>
                  <div className="flex items-center justify-center py-3 text-sm text-text">
                    {emptyState}
                  </div>
                </td>
              </tr>
            )}

            {processedData.map((row, index) => {
              if (rowRender) {
                return (
                  <tr key={index}>
                    <td colSpan={columns.length}>
                      {rowRender(row, columns, index)}
                    </td>
                  </tr>
                );
              }

              return (
                <tr
                  key={index}
                  onClick={() => onRowClick?.(row)}
                  className="hover:bg-primary/10 transition-colors"
                >
                  {columns.map((column) => {
                    const value = row[column.field as keyof T];

                    return (
                      <td
                        key={String(column.field)}
                        className={cn(
                          `first:pl-4 last:pr-4 py-3 text-sm text-text-muted`,
                          column.className || ''
                        )}
                      >
                        <div className="relative group w-full min-w-0">
                          {/* truncated text */}
                          <div className="truncate whitespace-nowrap overflow-hidden">
                            {column.render
                              ? column.render(value, row, index)
                              : String(value ?? '-')}
                          </div>

                          {/* tooltip */}
                          {String(value)?.length > 20 && (
                            <div
                              className={cn(`
                                pointer-events-none
                                absolute left-0 top-full z-50 mt-1
                                hidden group-hover:block
                                w-max max-w-xs
                                whitespace-normal wrap-break-word
                                rounded-md bg-surface-card text-text-muted text-xs
                                px-3 py-2 shadow-lg`)}
                            >
                              {column.render
                                ? column.render(value, row, index)
                                : String(value ?? '-')}
                            </div>
                          )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="block lg:hidden overflow-x-auto w-full">
        <MobileTable
          data={processedData}
          columns={columns}
          rowRender={rowRender}
          onRowClick={onRowClick}
          emptyState={emptyState}
        />
      </div>
    </div>
  );
}
