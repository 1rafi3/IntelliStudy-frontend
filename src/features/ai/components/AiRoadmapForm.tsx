import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Sparkles,
  ArrowRight,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Palette,
  Globe,
  Loader2,
} from 'lucide-react';
import { GenerateRoadmapDto } from '../types';

const generateFormSchema = z.object({
  learningGoal: z
    .string()
    .min(5, 'Please provide at least 5 characters.')
    .max(300, 'Keep your goal under 300 characters.'),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z
    .number({ invalid_type_error: 'Enter a valid number.' })
    .int()
    .min(1, 'Minimum 1 week.')
    .max(52, 'Maximum 52 weeks.'),
  weeklyHours: z
    .number({ invalid_type_error: 'Enter a valid number.' })
    .int()
    .min(1, 'Minimum 1 hour per week.')
    .max(80, 'Maximum 80 hours per week.'),
  learningStyle: z.string().min(2, 'Required.').max(50),
  language: z.string().min(2, 'Required.').max(50),
});

type GenerateFormInputs = z.infer<typeof generateFormSchema>;

interface AiRoadmapFormProps {
  onSubmit: (data: GenerateRoadmapDto) => void;
  isGenerating: boolean;
  initialData?: Partial<GenerateRoadmapDto>;
}

const TIPS = [
  'Crafting your personalized phase-by-phase curriculum…',
  'Analyzing your learning style and goals…',
  'Mapping out optimal resource recommendations…',
  'Structuring milestones for your skill level…',
  'Finalizing your roadmap blueprint…',
];

const fieldClass = (hasError: boolean) =>
  `block w-full px-4 py-3 bg-white dark:bg-gray-900 border ${
    hasError
      ? 'border-red-400 focus:ring-red-200 dark:focus:ring-red-900'
      : 'border-gray-200 dark:border-gray-800 focus:ring-indigo-200 dark:focus:ring-indigo-900'
  } rounded-xl text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 transition focus:outline-none focus:ring-4 focus:border-indigo-400 dark:focus:border-indigo-600`;

const LabelRow: React.FC<{ icon: React.ReactNode; label: string; hint?: string }> = ({
  icon,
  label,
  hint,
}) => (
  <div className="flex items-center gap-2 mb-2">
    <span className="text-indigo-500 dark:text-indigo-400 flex-shrink-0">{icon}</span>
    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
    {hint && <span className="text-xs text-gray-400 ml-auto">{hint}</span>}
  </div>
);

export const AiRoadmapForm: React.FC<AiRoadmapFormProps> = ({
  onSubmit,
  isGenerating,
  initialData,
}) => {
  const [tipIndex, setTipIndex] = useState(0);

  React.useEffect(() => {
    if (!isGenerating) return;
    setTipIndex(0);
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GenerateFormInputs>({
    resolver: zodResolver(generateFormSchema),
    defaultValues: {
      learningGoal: initialData?.learningGoal || '',
      currentLevel: initialData?.currentLevel || 'beginner',
      duration: initialData?.duration || 12,
      weeklyHours: initialData?.weeklyHours || 10,
      learningStyle: initialData?.learningStyle || 'practical and project-based',
      language: initialData?.language || 'English',
    },
  });

  return (
    <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-100 dark:border-gray-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md flex-shrink-0">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-base">
              AI Roadmap Generator
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Describe your goals and our AI will build a complete study curriculum.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-6 pt-5 space-y-5">
        {/* Learning Goal */}
        <div>
          <LabelRow
            icon={<Target size={15} />}
            label="What do you want to learn?"
            hint="Be specific for better results"
          />
          <textarea
            rows={3}
            placeholder="e.g., I want to master React and Node.js to build full-stack web applications, focusing on real-world projects."
            className={`${fieldClass(!!errors.learningGoal)} resize-none`}
            disabled={isGenerating}
            {...register('learningGoal')}
          />
          {errors.learningGoal && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.learningGoal.message}</p>
          )}
        </div>

        {/* Grid: Level + Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Skill Level */}
          <div>
            <LabelRow icon={<BarChart3 size={15} />} label="Current Skill Level" />
            <select
              className={fieldClass(!!errors.currentLevel)}
              disabled={isGenerating}
              {...register('currentLevel')}
            >
              <option value="beginner">🟢 Beginner — Just starting out</option>
              <option value="intermediate">🟡 Intermediate — Some experience</option>
              <option value="advanced">🔴 Advanced — Solidifying expertise</option>
            </select>
            {errors.currentLevel && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.currentLevel.message}</p>
            )}
          </div>

          {/* Duration */}
          <div>
            <LabelRow icon={<Calendar size={15} />} label="Target Duration" hint="in weeks" />
            <input
              type="number"
              min={1}
              max={52}
              placeholder="12"
              className={fieldClass(!!errors.duration)}
              disabled={isGenerating}
              {...register('duration', { valueAsNumber: true })}
            />
            {errors.duration && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.duration.message}</p>
            )}
          </div>

          {/* Weekly Hours */}
          <div>
            <LabelRow icon={<Clock size={15} />} label="Study Time" hint="hours per week" />
            <input
              type="number"
              min={1}
              max={80}
              placeholder="10"
              className={fieldClass(!!errors.weeklyHours)}
              disabled={isGenerating}
              {...register('weeklyHours', { valueAsNumber: true })}
            />
            {errors.weeklyHours && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.weeklyHours.message}</p>
            )}
          </div>

          {/* Learning Style */}
          <div>
            <LabelRow icon={<Palette size={15} />} label="Learning Style" />
            <input
              type="text"
              placeholder="e.g. visual, project-based, theoretical"
              className={fieldClass(!!errors.learningStyle)}
              disabled={isGenerating}
              {...register('learningStyle')}
            />
            {errors.learningStyle && (
              <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.learningStyle.message}</p>
            )}
          </div>
        </div>

        {/* Language — full width */}
        <div>
          <LabelRow icon={<Globe size={15} />} label="Output Language" />
          <input
            type="text"
            placeholder="e.g. English, Spanish, French"
            className={fieldClass(!!errors.language)}
            disabled={isGenerating}
            {...register('language')}
          />
          {errors.language && (
            <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.language.message}</p>
          )}
        </div>

        {/* Submit */}
        <div className="pt-1">
          {isGenerating ? (
            <div className="w-full flex flex-col items-center gap-3 py-4">
              <div className="flex items-center gap-3">
                <Loader2 size={20} className="animate-spin text-indigo-500" />
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                  Generating your personalized roadmap…
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 text-center animate-pulse transition-all duration-700">
                {TIPS[tipIndex]}
              </p>
              <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full animate-[progress_2.5s_ease-in-out_infinite]" />
              </div>
            </div>
          ) : (
            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-semibold py-3 px-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-4 focus:ring-indigo-300 dark:focus:ring-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Sparkles size={17} />
              Generate My Roadmap
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
