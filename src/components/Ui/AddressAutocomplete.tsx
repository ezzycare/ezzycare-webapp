'use client';

import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import {
  type Control,
  Controller,
  type FieldError,
  type FieldValues,
  type Path,
} from 'react-hook-form';

interface Suggestion {
  place_id: string;
  description: string;
}

export interface PlaceDetails {
  place_id: string;
  formatted_address: string;
  latitude: number | null;
  longitude: number | null;
  state: string;
  country: string;
}

interface AddressAutocompleteProps<T extends FieldValues = FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  leftIcon?: React.ReactNode;
  error?: string | FieldError | undefined;
  className?: string;
  onPlaceSelect?: (place: PlaceDetails) => void;
}

const AddressAutocomplete = <T extends FieldValues = FieldValues>({
  control,
  name,
  label,
  placeholder = 'Search address',
  leftIcon,
  error,
  className = '',
  onPlaceSelect,
}: AddressAutocompleteProps<T>) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleEscape);

    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setIsOpen(false);

      return;
    }

    try {
      setIsSearching(true);

      const response = await fetch(
        `/api/places/autocomplete?query=${encodeURIComponent(query)}`
      );

      const data = await response.json();

      setSuggestions(data.predictions || []);
      setIsOpen((data.predictions || []).length > 0);
    } catch (error) {
      console.error('Failed to fetch address suggestions:', error);
      setSuggestions([]);
      setIsOpen(false);
    } finally {
      setIsSearching(false);
    }
  };

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
  };

  const handleSuggestionClick = async (
    suggestion: Suggestion,
    onChange: (value: string) => void
  ) => {
    onChange(suggestion.description);
    setSuggestions([]);
    setIsOpen(false);

    if (!onPlaceSelect) return;

    try {
      setFetchingDetails(true);

      const response = await fetch(
        `/api/places/details?place_id=${encodeURIComponent(suggestion.place_id)}`
      );

      const data = await response.json();

      if (!data.error) {
        onPlaceSelect(data as PlaceDetails);
      }
    } catch (error) {
      console.error('Failed to fetch place details:', error);
    } finally {
      setFetchingDetails(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <div className="w-full flex flex-col gap-2" ref={wrapperRef}>
          {label && (
            <label className="text-sm font-medium text-text tracking-wide">
              {label}
            </label>
          )}

          <div className="relative w-full">
            {leftIcon && (
              <div className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-11a z-10">
                {leftIcon}
              </div>
            )}

            <input
              autoComplete="off"
              placeholder={placeholder}
              value={value || ''}
              onChange={(e) => {
                onChange(e.target.value);
                handleSearch(e.target.value);
              }}
              onFocus={() => {
                if (suggestions.length > 0) setIsOpen(true);
              }}
              className={cn(
                'w-full border border-neutral-3a h-14 bg-surface-card',
                'text-text text-sm rounded-xl px-4 py-4 outline-none',
                'focus:border-primary transition placeholder:text-neutral-8a',
                leftIcon && 'pl-8',
                className
              )}
            />

            {isSearching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <span className="block h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              </div>
            )}
          </div>

          {isOpen && suggestions.length > 0 && (
            <div className="relative">
              <div className="absolute z-50 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-neutral-3a bg-surface-card shadow-lg">
                {suggestions.map((item) => (
                  <button
                    key={item.place_id}
                    type="button"
                    className={clsx(
                      'w-full border-b border-neutral-3a px-4 py-3 text-left text-sm',
                      'hover:bg-blue-2a transition last:border-b-0'
                    )}
                    onClick={() => {
                      handleSuggestionClick(item, onChange);
                    }}
                  >
                    {item.description}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <span className="text-sm text-error">
              {typeof error === 'string' ? error : error?.message}
            </span>
          )}
        </div>
      )}
    />
  );
};

export default AddressAutocomplete;
