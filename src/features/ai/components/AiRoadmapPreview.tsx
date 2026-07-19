import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Clock,
  CheckCircle2,
  BookOpen,
  Save,
  RefreshCw,
  Target,
  BarChart3,
  Zap,
  Loader2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { GeneratedRoadmapData, SaveRoadmapDto } from '../types';
import { useSaveRoadmapMutation } from '../hooks';

interface AiRoadmapPreviewProps {
  data: GeneratedRoadmapData;
  onRegenerate: () => void;
}

const DIFFICULTY_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  beginner: {
    pill: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    dot: 'bg-emerald-500',
    label: 'Beginner',
  },
  intermediate: {
    pill: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    dot: 'bg-amber-500',
    label: 'Intermediate',
  },
  advanced: {
    pill: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800',
    dot: 'bg-red-500',
    label: 'Advanced',
  },
};

const PHASE_COLORS = [
  'from-indigo-500 to-violet-500',
  'from-violet-500 to-purple-500',
  'from-blue-500 to-indigo-500',
  'from-sky-500 to-blue-500',
  'from-teal-500 to-cyan-500',
  'from-emerald-500 to-teal-500',
];

const PHASE_BG = [
  'bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900',
  'bg-violet-50 dark:bg-violet-950/30 border-violet-100 dark:border-violet-900',
  'bg-blue-50 dark:bg-blue-950/30 border-blue-100 dark:border-blue-900',
  'bg-sky-50 dark:bg-sky-950/30 border-sky-100 dark:border-sky-900',
  'bg-teal-50 dark:bg-teal-950/30 border-teal-100 dark:border-teal-900',
  'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900',
];

export const AiRoadmapPreview: React.FC<AiRoadmapPreviewProps> = ({ data, onRegenerate }) => {
  const navigate = useNavigate();
  const saveMutation = useSaveRoadmapMutation();
  const [expandedPhases, setExpandedPhases] = useState<Set<number>>(new Set([0]));

  const difficultyStyle = DIFFICULTY_STYLES[data.difficulty] || DIFFICULTY_STYLES.beginner;

  const togglePhase = (idx: number) => {
    setExpandedPhases((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  const handleSave = () => {
    const payload: SaveRoadmapDto = {
      title: data.title,
      subject: data.title,
      description: data.summary,
      goal: data.goal,
      difficulty: data.difficulty,
      estimatedDuration: parseInt(data.estimatedDuration) || 1,
      tags: ['AI-Generated'],
    };

    saveMutation.mutate(payload, {
      onSuccess: (response) => {
        if (response.data && response.data.id) {
          navigate(`/dashboard/roadmaps/${response.data.id}`);
        } else {
          navigate('/dashboard/roadmaps');
        }
      },
    });
  };

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden animate-[fadeInUp_0.35s_ease-out]">
      {/* Sticky Action Bar */}
      <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <Compass size={15} className="text-white" />
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-sm">Generated Roadmap</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onRegenerate}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-100 dark:bg-gray-900 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-gray-200 dark:border-gray-800 hover:border-indigo-200 dark:hover:border-indigo-800 px-3 py-2 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Regenerate roadmap"
          >
            <RefreshCw size={13} />
            Edit & Retry
          </button>
          <button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-3 py-2 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Save roadmap to dashboard"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 size={13} className="animate-spin" />
                Saving…
              </>
            ) : (
              <>
                <Save size={13} />
                Save Roadmap
              </>
            )}
          </button>
        </div>
      </div>

      {/* Header Info Card */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-900">
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${difficultyStyle.pill}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${difficultyStyle.dot}`} />
            {difficultyStyle.label}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
            <Clock size={12} />
            {data.estimatedDuration}
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400">
            <Zap size={12} />
            {data.weeklyHours}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight mb-3">
          {data.title}
        </h2>

        {/* Goal */}
        <div className="flex items-start gap-2 mb-4">
          <Target size={16} className="text-indigo-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">{data.goal}</p>
        </div>

        {/* Summary */}
        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-900/60 px-4 py-3.5 rounded-xl border border-gray-100 dark:border-gray-900">
          {data.summary}
        </p>

        {/* Stats Row */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { icon: <BarChart3 size={16} />, label: 'Difficulty', value: difficultyStyle.label },
            { icon: <Clock size={16} />, label: 'Duration', value: data.estimatedDuration },
            { icon: <Zap size={16} />, label: 'Weekly Hours', value: data.weeklyHours },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-2.5 bg-gray-50 dark:bg-gray-900/50 rounded-xl p-3 border border-gray-100 dark:border-gray-800"
            >
              <span className="text-indigo-500 dark:text-indigo-400">{stat.icon}</span>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phases / Timeline */}
      <div className="px-6 py-6">
        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-5">
          <Compass size={15} className="text-indigo-500" />
          Curriculum Blueprint — {data.phases.length} Phase{data.phases.length !== 1 ? 's' : ''}
        </h3>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-300 via-violet-200 to-transparent dark:from-indigo-800 dark:via-violet-900 rounded-full" />

          <div className="space-y-4">
            {data.phases.map((phase, idx) => {
              const isExpanded = expandedPhases.has(idx);
              const colorGradient = PHASE_COLORS[idx % PHASE_COLORS.length];
              const phaseBg = PHASE_BG[idx % PHASE_BG.length];

              return (
                <div key={idx} className="relative pl-10">
                  {/* Timeline Node */}
                  <div
                    className={`absolute left-0 top-3.5 w-9 h-9 rounded-xl bg-gradient-to-br ${colorGradient} flex items-center justify-center shadow-md text-white font-bold text-xs flex-shrink-0 z-10`}
                  >
                    {idx + 1}
                  </div>

                  {/* Phase Card */}
                  <div
                    className={`border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 ${phaseBg}`}
                  >
                    {/* Card Header (Always Visible) */}
                    <button
                      onClick={() => togglePhase(idx)}
                      className="w-full flex items-start justify-between gap-3 px-4 py-3.5 text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-400"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                          Phase {idx + 1}
                        </span>
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-snug mt-0.5 truncate">
                          {phase.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-white/70 dark:bg-gray-900/50 px-2.5 py-1 rounded-lg border border-white/50 dark:border-gray-800 flex items-center gap-1.5">
                          <Clock size={11} />
                          {phase.estimatedWeeks}w
                        </span>
                        {isExpanded ? (
                          <ChevronUp size={16} className="text-gray-400" />
                        ) : (
                          <ChevronDown size={16} className="text-gray-400" />
                        )}
                      </div>
                    </button>

                    {/* Expandable Content */}
                    {isExpanded && (
                      <div className="px-4 pb-4 border-t border-white/50 dark:border-gray-800/50">
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed pt-3 pb-3">
                          {phase.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Key Topics */}
                          <div>
                            <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <CheckCircle2 size={11} className="text-emerald-500" />
                              Key Topics
                            </h5>
                            <ul className="space-y-1.5">
                              {phase.topics.map((topic, tidx) => (
                                <li
                                  key={tidx}
                                  className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2"
                                >
                                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                                  {topic}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Resources */}
                          <div>
                            <h5 className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                              <BookOpen size={11} className="text-blue-500" />
                              Resources
                            </h5>
                            <ul className="space-y-1.5">
                              {phase.resources.map((resource, ridx) => (
                                <li
                                  key={ridx}
                                  className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-2 bg-white/60 dark:bg-gray-900/40 px-2.5 py-1.5 rounded-lg border border-white/40 dark:border-gray-800"
                                >
                                  <span className="text-indigo-400 flex-shrink-0 mt-0.5">→</span>
                                  {resource}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Save Footer CTA */}
      <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-100 dark:border-gray-900 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Happy with this roadmap? Save it to your dashboard to track your progress.
        </p>
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 px-5 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex-shrink-0"
        >
          {saveMutation.isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving to Dashboard…
            </>
          ) : (
            <>
              <Save size={16} />
              Save to Dashboard
            </>
          )}
        </button>
      </div>
    </div>
  );
};
