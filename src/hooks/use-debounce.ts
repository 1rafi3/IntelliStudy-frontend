import { useState, useEffect } from 'react';

// ─── useDebounce ──────────────────────────────────────────────────────────────
// Delays updating the returned value until the user has stopped changing it.
// Essential for search inputs to prevent excessive API calls.
// Usage: const debouncedQuery = useDebounce(searchQuery, 400);

export function useDebounce<T>(value: T, delay = 300): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
