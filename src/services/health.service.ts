import { api } from '@lib/axios';
import type { ApiResponse } from '@/types';

// ─── Health Service ───────────────────────────────────────────────────────────
// Checks backend connectivity. Used in app initialization or status indicators.

interface HealthData {
  environment: string;
  timestamp: string;
}

export const healthService = {
  check: () => api.get<ApiResponse<HealthData>>('/health'),
};
