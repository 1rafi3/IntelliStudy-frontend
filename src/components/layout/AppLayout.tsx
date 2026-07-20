import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { BookOpen, MessageCircle, LayoutDashboard, Sparkles, User, Bookmark, BarChart3, LogOut, Bot } from 'lucide-react';
import { useAuth } from '@features/auth/hooks';

// ─── Navigation Items ─────────────────────────────────────────────────────────
const navItems = [
  { path: '/dashboard',                label: 'Dashboard',       icon: LayoutDashboard },
  { path: '/dashboard/roadmaps',       label: 'Roadmaps',         icon: BookOpen },
  { path: '/dashboard/ai-generator',   label: 'AI Generator',     icon: Bot },
  { path: '/dashboard/chat',           label: 'AI Coach',         icon: MessageCircle },
  { path: '/dashboard/recommendations',label: 'Recommendations',  icon: Sparkles },
  { path: '/dashboard/analytics',      label: 'Analytics',        icon: BarChart3 },
  { path: '/dashboard/profile',        label: 'Profile',          icon: User },
  { path: '/dashboard/bookmarks',      label: 'Bookmarks',        icon: Bookmark },
];

// ─── App Layout ───────────────────────────────────────────────────────────────
// Wraps all authenticated pages with a sidebar + main content area.
// Uses React Router <Outlet /> to render the matched child route.
export const AppLayout: React.FC = () => {
  const location = useLocation();
  const { logout, user } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 flex">

      {/* ── Sidebar ─────────────────────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-white border-r border-neutral-200/60 flex flex-col justify-between p-md hidden md:flex">
        <div className="flex flex-col gap-lg">
          {/* Brand */}
          <div className="flex items-center gap-sm px-xs pt-xs">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-sm">
              <span className="text-white font-extrabold text-base font-display">I</span>
            </div>
            <div className="leading-none">
              <p className="text-sm font-bold text-neutral-800">{user?.name || 'IntelliStudy'}</p>
              <p className="text-[10px] text-neutral-400 font-medium tracking-wide">Your AI Coach</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col gap-xs">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive =
                path === '/dashboard'
                  ? location.pathname === '/dashboard'
                  : location.pathname.startsWith(path);

              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-sm px-sm py-[10px] rounded-xl text-sm font-medium transition-micro ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-800'
                  }`}
                >
                  <Icon
                    size={18}
                    className={isActive ? 'text-primary-600' : 'text-neutral-400'}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer — Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-sm px-sm py-[10px] rounded-xl text-sm font-medium text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-micro w-full text-left"
        >
          <LogOut size={18} className="text-neutral-400 hover:text-red-500" />
          Logout
        </button>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────────── */}
      <main className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <div className="flex-1 p-md md:p-lg">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
