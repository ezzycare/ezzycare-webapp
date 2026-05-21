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
  | 'not assigned'
  | 'inactive';

const statuses = {
  pending: 'bg-warning-2a text-warning-11a',
  approved: 'bg-success/10 text-success',
  active: 'bg-success/10 text-success',
  upcoming: 'bg-blue-3a text-primary',
  completed: 'bg-success/10 text-success',
  suspended: 'bg-error-3a text-error',
  cancelled: 'bg-error-3a text-error',
  inactive: 'bg-error-3a text-error',
  'not assigned': 'bg-warning-2a text-warning-11a border border-warning-8a',
};

export const statusColor = (status: StatusType): string => {
  return statuses[status] as string;
};

export type RoleColorType =
  | 'operations manager'
  | 'finance manager'
  | 'hospital admin'
  | 'agent supervisor';
const roles: RoleColorType[] = [
  'operations manager',
  'finance manager',
  'hospital admin',
  'agent supervisor',
];
export const roleColor = (role: RoleColorType): string => {
  const roleColors = Object.values(statuses);

  const roleColor: Record<RoleColorType, string> = {} as Record<
    RoleColorType,
    string
  >;
  roles.forEach((r) => {
    roleColor[r] = roleColors[Math.floor(Math.random() * roleColors.length)];
  });
  return roleColor[role] as string;
};

// =============================== TEMP WILL REMOVE ===============================
type PaginateDataProps<T> = {
  currentPage: number;
  data: T[];
};

export const paginateData = <T>({
  currentPage,
  data,
}: PaginateDataProps<T>) => {
  const meta = {
    page: currentPage,
    pageSize: 10,
    pageCount: Math.ceil(data.length / 10),
    total: data.length,
  };

  const paginatedData = (): T[] => {
    const startIndex = (currentPage - 1) * meta.pageSize;
    const endIndex = startIndex + meta.pageSize;

    return data.slice(startIndex, endIndex);
  };

  return { meta, paginatedData };
};
// ==============================================================

export const tempRoles = [
  'operations manager',
  'finance manager',
  'hospital admin',
  'agent supervisor',
];
