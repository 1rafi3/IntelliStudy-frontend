import { useState } from 'react';

// ─── useLocalStorage ─────────────────────────────────────────────────────────
// Sync React state with localStorage. Initializes from stored value if present.
// Usage: const [token, setToken] = useLocalStorage<string>('access_token', '');

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.warn(`useLocalStorage: failed to set key "${key}"`, error);
    }
  };

  const removeValue = () => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`useLocalStorage: failed to remove key "${key}"`, error);
    }
  };

  return [storedValue, setValue, removeValue] as const;
}
