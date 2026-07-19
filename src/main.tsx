import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from '@lib/query-client';
import { AppRouter } from '@/router/AppRouter';
import { ErrorBoundary } from '@components/ui/ErrorBoundary';
import { AuthProvider } from '@/features/auth/context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
        {/* Toast Notification Provider */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#ffffff',
              color: '#334155', // neutral-700
              border: '1px solid #e2e8f0', // neutral-200
              borderRadius: '12px', // xl radius
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
