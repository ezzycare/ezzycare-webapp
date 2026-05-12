/* eslint-disable @typescript-eslint/no-explicit-any */
export function debounce<F extends (...args: any[]) => void>(
  func: F,
  delay = 300,
  immediate = false
): (...args: Parameters<F>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null;

  return (...args: Parameters<F>) => {
    const callNow = immediate && !timeoutId;

    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      timeoutId = null;
      if (!immediate) func(...args);
    }, delay);

    if (callNow) func(...args);
  };
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getInitials = (name: string) => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

export type StatusType =
  | 'pending'
  | 'approved'
  | 'active'
  | 'suspended'
  | 'inactive';
export const statusColor = (status: StatusType): string => {
  const statuses = {
    pending: 'bg-warning-2a text-warning-11a',
    approved: 'bg-success/10 text-success',
    active: 'bg-success/10 text-success',
    suspended: 'bg-error-3a text-error',
    inactive: 'bg-error-3a text-error',
  };

  return statuses[status] as string;
};
