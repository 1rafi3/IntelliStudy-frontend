// ─── Global Shared Types ──────────────────────────────────────────────────────
// Types used across multiple features belong here.
// Feature-specific types live in their own feature/types/index.ts.

// ─── API Response Shape ───────────────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string | Record<string, unknown>;
}

// ─── Paginated Response ───────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// ─── Auth User (from JWT context) ────────────────────────────────────────────
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
}

// ─── Select Option ────────────────────────────────────────────────────────────
export interface SelectOption {
  label: string;
  value: string;
}

// ─── ID ───────────────────────────────────────────────────────────────────────
export type Id = string;

// ─── Nullable / Optional helpers ─────────────────────────────────────────────
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
