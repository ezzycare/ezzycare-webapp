import { Button, Popover, PopoverContent, PopoverTrigger } from '@heroui/react';

import clsx from 'clsx';
import { Search, SlidersHorizontal } from 'lucide-react';
import React, { ReactNode, useMemo, useState } from 'react';

export interface SearchFilter {
  key: string;
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  className?: string;
  inputClassName?: string;
  filters?: SearchFilter[];
  onFilterChange?: (filter: SearchFilter, activeFilters: string[]) => void;
}

const SearchInput = ({
  label,
  className = '',
  inputClassName = '',
  filters = [],
  onFilterChange,
  ...props
}: SearchInputProps) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const hasFilters = useMemo(() => filters.length > 0, [filters]);

  const handleFilterClick = (filter: SearchFilter) => {
    setSelectedFilters((prev) => {
      const exists = prev.includes(filter.key);

      const updated = exists
        ? prev.filter((item) => item !== filter.key)
        : [...prev, filter.key];

      onFilterChange?.(filter, updated);

      return updated;
    });

    filter.onClick?.();
  };

  return (
    <div className={clsx('w-full space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium text-text tracking-wide">
          {label}
        </label>
      )}

      <div
        className={clsx(
          'flex items-center w-full h-14',
          'rounded-full overflow-hidden',
          'border border-neutral-3a',
          'bg-surface-card'
        )}
      >
        {/* Input Area */}
        <div className="relative flex-1 h-full">
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-11a">
            <Search size={20} />
          </div>

          <input
            {...props}
            className={clsx(
              'w-full h-full bg-gray-1 outline-none',
              'pl-14 pr-4',
              'text-[17px] text-text',
              'placeholder:text-neutral-8a',
              inputClassName
            )}
          />
        </div>

        {/* Filters */}
        {hasFilters && (
          <>
            <div className="h-full w-px bg-neutral-3a" />

            <Popover>
              <PopoverTrigger>
                <Button
                  isIconOnly
                  className={clsx(
                    'h-full min-w-16',
                    'rounded-none bg-gray-1',
                    'text-neutral-11a',
                    'hover:bg-transparent',
                    selectedFilters.length > 0 && 'text-primary'
                  )}
                >
                  <SlidersHorizontal size={20} />
                </Button>
              </PopoverTrigger>

              <PopoverContent className="min-w-56 p-0">
                <div className="w-full">
                  {filters.map((filter) => {
                    const isActive = selectedFilters.includes(filter.key);

                    return (
                      <button
                        key={filter.key}
                        type="button"
                        onClick={() => handleFilterClick(filter)}
                        className={clsx(
                          'flex w-full items-center justify-between px-3 py-3',
                          'hover:bg-default-100 transition-colors'
                        )}
                      >
                        <div className="flex items-center gap-2">
                          {filter.icon}
                          <span>{filter.label}</span>
                        </div>

                        {isActive && (
                          <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchInput;
