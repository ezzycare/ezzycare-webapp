/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { BaseTableProps } from '@/types/table';
import { Cross1Icon } from '@radix-ui/react-icons';
import { useState } from 'react';

export function MobileTable<T extends Record<string, any>>({
  data,
  columns,
  rowRender,
  onRowClick,
  emptyState = 'No data available',
}: Pick<
  BaseTableProps<T>,
  'data' | 'columns' | 'rowRender' | 'onRowClick' | 'emptyState'
>) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  if (!data.length) {
    return (
      <div className="flex items-center justify-center py-6 text-sm text-text">
        {emptyState}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {data.map((row, index) => {
        const isExpanded = expandedIndex === index;
        const firstTwoColumns = columns.slice(0, 2);
        const remainingColumns = columns.slice(2);
        const statusColumn = columns.find((col) => col.field === 'status');

        return (
          <div
            key={index}
            className="border border-gray-3 rounded-xl bg-surface-card overflow-hidden"
          >
            {/* Header */}
            <button
              onClick={() => setExpandedIndex(isExpanded ? null : index)}
              className="w-full flex justify-between items-center px-4 py-3 text-left"
            >
              <div className="flex flex-col gap-1 truncate w-[90%]">
                {firstTwoColumns.map((col, index) => {
                  const value = row[col.field as keyof T];
                  return (
                    <div
                      key={String(col.field)}
                      className="flex gap-1 justify-between items-center w-full"
                    >
                      <span className="text-sm font-medium text-text truncate">
                        {col.render
                          ? col.render(value, row, index)
                          : String(value ?? '-')}
                      </span>
                      {index === 0 && (
                        <span>
                          {statusColumn?.render
                            ? statusColumn.render(row.status, row, index)
                            : String(row.status ?? '-')}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <span className="text-text-muted">{isExpanded ? '−' : '+'}</span>
            </button>

            {/* Accordion Body */}
            {isExpanded && (
              <div className="px-4 py-2 flex flex-col gap-2 border-t border-gray-3">
                {remainingColumns.map((col) => {
                  const value = row[col.field as keyof T];
                  return (
                    <div
                      key={String(col.field)}
                      className="flex justify-between text-sm text-text-muted"
                    >
                      <span className="font-medium capitalize">
                        {col.label}
                      </span>
                      <span>
                        {col.render
                          ? col.render(value, row, index)
                          : String(value ?? '-')}
                      </span>
                    </div>
                  );
                })}

                {/* Optional custom row render */}
                {rowRender && (
                  <div className="mt-2">{rowRender(row, columns, index)}</div>
                )}

                {/* Optional row click handler */}
                {onRowClick && (
                  <button
                    onClick={() => onRowClick(row)}
                    className="mt-2 text-blue-600 text-sm font-medium flex items-center gap-1"
                  >
                    Click for action <Cross1Icon className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
