import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, MessageCircle, Sparkles, TrendingUp, 
  Calendar, CheckSquare, Clock, Flame, Plus, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { useAuth } from '@features/auth/hooks';
import { StatCard } from '@components/ui/StatCard';
import { DashboardCard } from '@components/ui/DashboardCard';

// ─── Dummy Data for Progress Chart ────────────────────────────────────────────
const chartData = [
  { name: 'Mon', hrs: 1.5 },
  { name: 'Tue', hrs: 2.2 },
  { name: 'Wed', hrs: 0.8 },
  { name: 'Thu', hrs: 3.0 },
  { name: 'Fri', hrs: 2.5 },
  { name: 'Sat', hrs: 4.2 },
  { name: 'Sun', hrs: 1.8 },
];

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Dynamic Greeting based on time of day
  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good morning';
    if (hours < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="space-y-lg pb-xl">
      
      {/* ── Welcome Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-sm">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 tracking-tight font-display">
            {getGreeting()}, {user?.name || 'Learner'}
          </h1>
          <p className="text-neutral-500 text-sm">Here is your learning summary for today.</p>
        </div>
        <div className="flex items-center gap-xs text-xs font-semibold text-neutral-500 bg-white border border-neutral-200/60 px-sm py-[10px] rounded-xl shadow-2xs">
          <Calendar size={16} className="text-primary-500" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
      </div>

      {/* ── Statistics Cards Grid ──────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        <StatCard 
          title="Study Sessions" 
          value="12" 
          change={20} 
          icon={Clock} 
        />
        <StatCard 
          title="Active Roadmaps" 
          value="3" 
          change={0} 
          icon={BookOpen} 
          iconColor="text-accent-500"
          iconBg="bg-accent-50"
        />
        <StatCard 
          title="AI Coach Chats" 
          value="48" 
          change={15} 
          icon={MessageCircle} 
        />
        <StatCard 
          title="Weekly Progress" 
          value="16.0 hrs" 
          change={8} 
          icon={TrendingUp} 
        />
      </div>

      {/* ── Main Layout: 2 Columns ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Left Column: Chart & Quick Actions */}
        <div className="lg:col-span-8 space-y-lg">
          
          {/* Progress Chart Card */}
          <DashboardCard title="Weekly Progress Overview" subtitle="Total hours studied per day this week">
            <div className="h-64 mt-md w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorHrs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#ffffff', 
                      border: '1px solid #e2e8f0', 
                      borderRadius: '12px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '12px'
                    }} 
                  />
                  <Area type="monotone" dataKey="hrs" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorHrs)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </DashboardCard>

          {/* Quick Actions Grid */}
          <div className="space-y-sm">
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
              <div 
                onClick={() => navigate('/dashboard/ai-generator')} 
                className="bg-white border border-neutral-200/60 rounded-2xl p-md flex items-center justify-between shadow-2xs hover:shadow-sm hover:border-neutral-300/80 transition-micro cursor-pointer group"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Plus size={20} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-neutral-800 text-sm">Create Roadmap</p>
                    <p className="text-xs text-neutral-400 mt-2xs">Generate a new AI syllabus</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-xs transition-transform" />
              </div>

              <div 
                onClick={() => navigate('/dashboard/chat')} 
                className="bg-white border border-neutral-200/60 rounded-2xl p-md flex items-center justify-between shadow-2xs hover:shadow-sm hover:border-neutral-300/80 transition-micro cursor-pointer group"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-neutral-800 text-sm">Open AI Coach</p>
                    <p className="text-xs text-neutral-400 mt-2xs">Ask questions or start quizzes</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-xs transition-transform" />
              </div>

              <div 
                onClick={() => navigate('/dashboard/recommendations')} 
                className="bg-white border border-neutral-200/60 rounded-2xl p-md flex items-center justify-between shadow-2xs hover:shadow-sm hover:border-neutral-300/80 transition-micro cursor-pointer group"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                    <Sparkles size={20} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-neutral-800 text-sm">View Suggestions</p>
                    <p className="text-xs text-neutral-400 mt-2xs">Get recommended resources</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-xs transition-transform" />
              </div>

              <div 
                onClick={() => navigate('/dashboard/roadmaps')} 
                className="bg-white border border-neutral-200/60 rounded-2xl p-md flex items-center justify-between shadow-2xs hover:shadow-sm hover:border-neutral-300/80 transition-micro cursor-pointer group"
              >
                <div className="flex items-center gap-sm">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 text-neutral-500 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div className="leading-tight">
                    <p className="font-bold text-neutral-800 text-sm">Continue Learning</p>
                    <p className="text-xs text-neutral-400 mt-2xs">Resume your last active module</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-neutral-400 group-hover:translate-x-xs transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Streaks, Goals & Activity */}
        <div className="lg:col-span-4 space-y-lg">
          
          {/* Learning Streak Card */}
          <div className="bg-gradient-to-tr from-orange-500 to-amber-500 text-white rounded-2xl p-md shadow-sm relative overflow-hidden flex items-center justify-between">
            <div className="space-y-xs relative z-10">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-xs py-2xs rounded">Learning Streak</span>
              <h4 className="text-xl font-extrabold font-display">5 Days Streak!</h4>
              <p className="text-white/80 text-xs leading-relaxed max-w-[180px]">Keep studying to unlock your best 7-day streak goal.</p>
            </div>
            <Flame size={64} className="text-white/20 absolute -right-2 -bottom-2 shrink-0 relative z-10" />
          </div>

          {/* Upcoming Goals / Checklist */}
          <DashboardCard title="Upcoming Goals" subtitle="Task completion list">
            <div className="space-y-sm mt-xs">
              <div className="flex items-start gap-xs">
                <CheckSquare size={18} className="text-primary-500 shrink-0 mt-3xs" />
                <span className="text-xs font-semibold text-neutral-700">Finish Javascript Promises module</span>
              </div>
              <div className="flex items-start gap-xs opacity-60">
                <div className="w-[18px] h-[18px] border-2 border-neutral-300 rounded shrink-0 mt-3xs" />
                <span className="text-xs font-medium text-neutral-500">Solve 3 LeetCode exercises</span>
              </div>
              <div className="flex items-start gap-xs opacity-60">
                <div className="w-[18px] h-[18px] border-2 border-neutral-300 rounded shrink-0 mt-3xs" />
                <span className="text-xs font-medium text-neutral-500">Read HTTP cache-control specs</span>
              </div>
            </div>
          </DashboardCard>

          {/* Recent Activity Timeline */}
          <DashboardCard title="Recent Activity" subtitle="Updates and study records">
            <div className="relative border-l border-neutral-100 pl-md ml-xs space-y-md mt-xs">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-primary-500 absolute -left-[21px] top-1" />
                <p className="text-xs font-bold text-neutral-800">Generated Roadmap</p>
                <p className="text-[10px] text-neutral-400">Created: "Node.js Microservices" roadmap</p>
              </div>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-accent-500 absolute -left-[21px] top-1" />
                <p className="text-xs font-bold text-neutral-800">Coach Quiz Complete</p>
                <p className="text-[10px] text-neutral-400">Answered: 4 questions correctly on Flexbox</p>
              </div>
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-neutral-300 absolute -left-[21px] top-1" />
                <p className="text-xs font-bold text-neutral-800">Bookmarked Article</p>
                <p className="text-[10px] text-neutral-400">Saved: "Understanding Mongoose Middlewares"</p>
              </div>
            </div>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
};
export default DashboardPage;
