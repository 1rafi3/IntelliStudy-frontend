import React from 'react';
import { BarChart3, BookOpen, MessageCircle, Bookmark, Bot, TrendingUp, Target, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, AreaChart, Area, Legend,
} from 'recharts';
import { PageHeader } from '@components/ui/PageHeader';
import { StatCard } from '@components/ui/StatCard';
import { DashboardCard } from '@components/ui/DashboardCard';
import { useAnalyticsQuery } from '@features/analytics/hooks';
import { useAuth } from '@features/auth/hooks';

const CHART_COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6'];

const INSIGHT_STYLES: Record<string, { icon: any; border: string; bg: string }> = {
  positive: { icon: CheckCircle2, border: 'border-green-200', bg: 'bg-green-50' },
  info: { icon: Lightbulb, border: 'border-blue-200', bg: 'bg-blue-50' },
  warning: { icon: AlertTriangle, border: 'border-amber-200', bg: 'bg-amber-50' },
};

export const AnalyticsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { data, isLoading, isError, refetch } = useAnalyticsQuery(isAuthenticated);

  if (isLoading) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader title="Analytics & Insights" description="Your personalized learning analytics." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200/60 rounded-2xl p-4 space-y-3 animate-pulse shadow-sm">
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200/60 rounded-2xl p-5 space-y-4 animate-pulse shadow-sm">
              <div className="h-5 bg-neutral-200 rounded w-1/3" />
              <div className="h-48 bg-neutral-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="space-y-6 pb-16">
        <PageHeader title="Analytics & Insights" description="Your personalized learning analytics." />
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-8 text-center shadow-sm">
          <BarChart3 size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="font-bold text-neutral-700 text-lg mb-1">Failed to Load Analytics</h3>
          <p className="text-sm text-neutral-500 mb-4">Something went wrong. Please try again.</p>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-primary-600 px-4 py-2 rounded-xl hover:bg-primary-700 transition"
          >
            Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const { overview, roadmapProgressDistribution, roadmapStatusDistribution, roadmapDifficultyDistribution, bookmarkDistribution, recommendationCategoryDistribution, chatActivity, insights } = data;

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="Analytics & Insights"
        description="Your personalized learning analytics and study insights."
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Roadmaps" value={overview.totalRoadmaps} icon={BookOpen} iconColor="text-primary-500" iconBg="bg-primary-50" />
        <StatCard title="Active Roadmaps" value={overview.activeRoadmaps} icon={TrendingUp} iconColor="text-green-500" iconBg="bg-green-50" />
        <StatCard title="Chat Sessions" value={overview.totalChatSessions} icon={MessageCircle} iconColor="text-accent-500" iconBg="bg-accent-50" />
        <StatCard title="Avg Progress" value={`${overview.averageRoadmapProgress}%`} icon={Target} iconColor="text-amber-500" iconBg="bg-amber-50" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Completed Roadmaps" value={overview.completedRoadmaps} icon={CheckCircle2} iconColor="text-green-500" iconBg="bg-green-50" />
        <StatCard title="Bookmarks" value={overview.totalBookmarks} icon={Bookmark} iconColor="text-yellow-500" iconBg="bg-yellow-50" />
        <StatCard title="AI Generations" value={overview.totalAiGenerations} icon={Bot} iconColor="text-indigo-500" iconBg="bg-indigo-50" />
        <StatCard title="Profile" value={`${overview.profileCompletion}%`} icon={Target} iconColor="text-primary-500" iconBg="bg-primary-50" />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roadmap Progress Distribution */}
        <DashboardCard title="Roadmap Progress Distribution" subtitle="How far along each roadmap is">
          <div className="h-64 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roadmapProgressDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="range" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Roadmap Status Distribution */}
        <DashboardCard title="Roadmap Status Overview" subtitle="Current status of all roadmaps">
          <div className="h-72 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 20 }}>
                <Pie
                  data={roadmapStatusDistribution.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="45%"
                  outerRadius={75}
                  innerRadius={45}
                  label={false}
                >
                  {roadmapStatusDistribution.filter((d) => d.count > 0).map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[idx % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [`${value} (${((value / roadmapStatusDistribution.filter((d) => d.count > 0).reduce((s, d) => s + d.count, 0)) * 100).toFixed(0)}%)`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  wrapperStyle={{ fontSize: '11px', fontWeight: 500, paddingTop: '8px' }}
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      'not-started': 'Not Started',
                      'in-progress': 'In Progress',
                      completed: 'Completed',
                      paused: 'Paused',
                    };
                    return labels[value] || value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Chat Activity */}
        <DashboardCard title="Chat Activity (7 Days)" subtitle="Messages exchanged per day">
          <div className="h-64 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chatActivity} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="chatGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Area type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#chatGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Bookmark Distribution */}
        <DashboardCard title="Bookmark Distribution" subtitle="Types of saved items">
          <div className="h-72 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ bottom: 20 }}>
                <Pie
                  data={bookmarkDistribution.filter((d) => d.count > 0)}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="45%"
                  outerRadius={75}
                  innerRadius={45}
                  label={false}
                >
                  {bookmarkDistribution.filter((d) => d.count > 0).map((_, idx) => (
                    <Cell key={idx} fill={CHART_COLORS[(idx + 2) % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                  formatter={(value: number, name: string) => [`${value} (${((value / bookmarkDistribution.filter((d) => d.count > 0).reduce((s, d) => s + d.count, 0)) * 100).toFixed(0)}%)`, name]}
                />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal"
                  wrapperStyle={{ fontSize: '11px', fontWeight: 500, paddingTop: '8px' }}
                  formatter={(value: string) => {
                    const labels: Record<string, string> = {
                      'chat-response': 'Chat Response',
                      'manual-roadmap': 'Manual Roadmap',
                      'ai-roadmap': 'AI Roadmap',
                      recommendation: 'Recommendation',
                    };
                    return labels[value] || value;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Recommendation Categories */}
        <DashboardCard title="Recommendation Categories" subtitle="Types of recommendations received">
          <div className="h-64 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={recommendationCategoryDistribution.filter((d) => d.count > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="category" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>

        {/* Difficulty Distribution */}
        <DashboardCard title="Roadmap Difficulty" subtitle="Distribution by difficulty level">
          <div className="h-64 mt-2 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={roadmapDifficultyDistribution.filter((d) => d.count > 0)} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="difficulty" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" fill="#f59e0b" radius={[6, 6, 0, 0]} maxBarSize={60} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </DashboardCard>
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">Smart Insights</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {insights.map((insight, idx) => {
              const style = INSIGHT_STYLES[insight.type] || INSIGHT_STYLES.info;
              const Icon = style.icon;
              return (
                <div
                  key={idx}
                  className={`bg-white border ${style.border} rounded-2xl p-4 shadow-sm flex gap-3 items-start`}
                >
                  <div className={`w-8 h-8 rounded-xl ${style.bg} flex items-center justify-center shrink-0`}>
                    <Icon size={16} className="text-neutral-600" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-neutral-800">{insight.title}</h4>
                    <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty state when no data */}
      {overview.totalRoadmaps === 0 && overview.totalChatSessions === 0 && overview.totalBookmarks === 0 && (
        <div className="bg-white border border-neutral-200/60 rounded-2xl p-8 text-center shadow-sm">
          <BarChart3 size={48} className="mx-auto text-neutral-300 mb-4" />
          <h3 className="font-bold text-neutral-700 text-lg mb-1">No Data Yet</h3>
          <p className="text-sm text-neutral-500 mb-4">
            Start creating roadmaps, chatting with the AI Coach, and bookmarking resources to see your analytics.
          </p>
        </div>
      )}
    </div>
  );
};
export default AnalyticsPage;
