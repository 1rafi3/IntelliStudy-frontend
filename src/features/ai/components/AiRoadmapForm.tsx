import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Sparkles, ArrowRight } from 'lucide-react';
import { CTAButton } from '@components/ui/CTAButton';
import { GenerateRoadmapDto } from '../types';

const generateFormSchema = z.object({
  learningGoal: z.string().min(5, 'Please provide more detail (min 5 characters)').max(300),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  duration: z.number().int().min(1).max(52),
  weeklyHours: z.number().int().min(1).max(168),
  learningStyle: z.string().min(2).max(50),
  language: z.string().min(2).max(50),
});

type GenerateFormInputs = z.infer<typeof generateFormSchema>;

interface AiRoadmapFormProps {
  onSubmit: (data: GenerateRoadmapDto) => void;
  isGenerating: boolean;
  initialData?: Partial<GenerateRoadmapDto>;
}

export const AiRoadmapForm: React.FC<AiRoadmapFormProps> = ({ onSubmit, isGenerating, initialData }) => {
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
    <div className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm p-lg">
      <div className="mb-md">
        <h3 className="font-bold text-neutral-800 font-display flex items-center gap-xs">
          <Sparkles className="text-primary-500" size={20} /> AI Roadmap Generator
        </h3>
        <p className="text-xs text-neutral-500 mt-2xs">
          Describe your learning goals and preferences, and our AI will build a complete, phase-by-phase curriculum for you.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-md">
        {/* Learning Goal */}
        <div>
          <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
            What do you want to learn?
          </label>
          <textarea
            rows={3}
            placeholder="e.g., I want to become a full-stack developer using React and Node.js, focusing on building scalable web apps."
            className={`block w-full px-md py-sm bg-neutral-50 border ${
              errors.learningGoal ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
            } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4 resize-none`}
            {...register('learningGoal')}
          />
          {errors.learningGoal && <p className="mt-xs text-xs text-red-500 font-medium">{errors.learningGoal.message}</p>}
        </div>

        {/* Configuration Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
          {/* Current Level */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Current Skill Level
            </label>
            <select
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('currentLevel')}
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
            {errors.currentLevel && <p className="mt-xs text-xs text-red-500 font-medium">{errors.currentLevel.message}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Target Duration (Weeks)
            </label>
            <input
              type="number"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('duration', { valueAsNumber: true })}
            />
            {errors.duration && <p className="mt-xs text-xs text-red-500 font-medium">{errors.duration.message}</p>}
          </div>

          {/* Weekly Hours */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Study Time (Hours/Week)
            </label>
            <input
              type="number"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('weeklyHours', { valueAsNumber: true })}
            />
            {errors.weeklyHours && <p className="mt-xs text-xs text-red-500 font-medium">{errors.weeklyHours.message}</p>}
          </div>

          {/* Learning Style */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Learning Style
            </label>
            <input
              type="text"
              placeholder="e.g. Visual, Project-based"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('learningStyle')}
            />
            {errors.learningStyle && <p className="mt-xs text-xs text-red-500 font-medium">{errors.learningStyle.message}</p>}
          </div>

          {/* Language */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Output Language
            </label>
            <input
              type="text"
              placeholder="e.g. English, Spanish, French"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('language')}
            />
            {errors.language && <p className="mt-xs text-xs text-red-500 font-medium">{errors.language.message}</p>}
          </div>
        </div>

        {/* Submit Action */}
        <div className="pt-sm flex justify-end">
          <CTAButton type="submit" variant="primary" disabled={isGenerating} className="w-full sm:w-auto gap-xs">
            {isGenerating ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Generating Curriculum...
              </>
            ) : (
              <>
                Generate Roadmap <ArrowRight size={16} />
              </>
            )}
          </CTAButton>
        </div>
      </form>
    </div>
  );
};
