import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AppLayout } from '@components/layout/AppLayout';
import { DashboardPage } from '@/pages/DashboardPage';
import { RoadmapsPage } from '@/pages/RoadmapsPage';
import { ChatPage } from '@/pages/ChatPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { NotFound } from '@/pages/NotFound';
import { RecommendationsPage } from '@/pages/RecommendationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { BookmarksPage } from '@/pages/BookmarksPage';
import { RoadmapDetailPage } from '@/pages/RoadmapDetailPage';
import { AiGeneratorPage } from '@/pages/AiGeneratorPage';
import { AnalyticsPage } from '@/pages/AnalyticsPage';

import { ProtectedRoute } from '@components/layout/ProtectedRoute';

import { LandingPage } from '@/pages/LandingPage';

// ─── Browser Router Configuration ────────────────────────────────────────────
// Defines all root routes, public layout routes, authenticated layout routes,
// and wildcards for 404s.
const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'roadmaps',
        element: <RoadmapsPage />,
      },
      {
        path: 'ai-generator',
        element: <AiGeneratorPage />,
      },
      {
        path: 'roadmaps/:id',
        element: <RoadmapDetailPage />,
      },
      {
        path: 'chat',
        element: <ChatPage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'bookmarks',
        element: <BookmarksPage />,
      },
      {
        path: 'analytics',
        element: <AnalyticsPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
