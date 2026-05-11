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

export const ridersStatusColors = {
  active: { border: '#D9F7BE', background: '#F6FFED', text: '#389E0D' },
  offline: { border: '#D9D9D9', background: '#F5F5F5', text: 'rgba(0, 0, 0, 0.65)' },
  busy: { border: '#FFF1B8', background: '#FFFBE6', text: '#FAAD14' },
};
