import { useState, useEffect } from 'react';

// ─── useMediaQuery ────────────────────────────────────────────────────────────
// Returns true when the given CSS media query matches.
// Usage: const isMobile = useMediaQuery('(max-width: 768px)');
//        const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQueryList = window.matchMedia(query);
    setMatches(mediaQueryList.matches);

    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQueryList.addEventListener('change', listener);
    return () => {
      mediaQueryList.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}
