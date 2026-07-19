// ─── Global Services ─────────────────────────────────────────────────────────
// Axios-based API callers shared across features.
// Feature-specific API calls live in feature/services/index.ts.
//
// Usage pattern (in a feature service):
//   import { api } from '@lib/axios';
//   export const fetchRoadmaps = () => api.get<ApiResponse<Roadmap[]>>('/roadmaps');

export * from './health.service';
