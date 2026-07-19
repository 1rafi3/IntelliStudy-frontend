// ─── Global Utility Functions ─────────────────────────────────────────────────
// Pure helpers shared across all features.
// Feature-specific helpers live in their own feature/utils/index.ts.

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ─── Class Name Merger ────────────────────────────────────────────────────────
// Combines clsx (conditional classes) with tailwind-merge (deduplication).
// Use this instead of raw clsx() to prevent Tailwind class conflicts.
// Usage: cn('px-4 py-2', isActive && 'bg-primary-500', className)
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

// ─── Format Date ─────────────────────────────────────────────────────────────
export const formatDate = (date: string | Date, options?: Intl.DateTimeFormatOptions): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
};

// ─── Relative Time ───────────────────────────────────────────────────────────
export const relativeTime = (date: string | Date): string => {
  const now = new Date();
  const target = new Date(date);
  const diffMs = now.getTime() - target.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
};

// ─── Truncate Text ───────────────────────────────────────────────────────────
export const truncate = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
};

// ─── Capitalize First Letter ─────────────────────────────────────────────────
export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

// ─── Sleep (for testing/dev) ─────────────────────────────────────────────────
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));
