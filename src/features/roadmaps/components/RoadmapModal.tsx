import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, HelpCircle } from 'lucide-react';
import { RoadmapResponse, CreateRoadmapDto, UpdateRoadmapDto } from '../types';
import { useCreateRoadmapMutation, useUpdateRoadmapMutation } from '../hooks';
import { CTAButton } from '@components/ui/CTAButton';

const roadmapFormSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be under 120 characters')
    .trim(),
  subject: z
    .string()
    .min(2, 'Subject must be at least 2 characters')
    .max(80, 'Subject must be under 80 characters')
    .trim(),
  description: z
    .string()
    .max(1000, 'Description must be under 1000 characters')
    .trim()
    .optional(),
  goal: z
    .string()
    .max(500, 'Goal must be under 500 characters')
    .trim()
    .optional(),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced'], {
    errorMap: () => ({ message: 'Please select a difficulty level' }),
  }),
  estimatedDuration: z
    .number()
    .int('Weeks must be a whole number')
    .min(1, 'Duration must be at least 1 week')
    .max(104, 'Duration cannot exceed 104 weeks')
    .optional()
    .nullable(),
  tagsInput: z.string().trim().optional(),
});

type RoadmapFormInputs = z.infer<typeof roadmapFormSchema>;

interface RoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  roadmapToEdit?: RoadmapResponse | null;
}

export const RoadmapModal: React.FC<RoadmapModalProps> = ({ isOpen, onClose, roadmapToEdit }) => {
  const createMutation = useCreateRoadmapMutation();
  const updateMutation = useUpdateRoadmapMutation();
  const isEditing = !!roadmapToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RoadmapFormInputs>({
    resolver: zodResolver(roadmapFormSchema),
  });

  // Pre-populate fields on edit
  React.useEffect(() => {
    if (isOpen) {
      if (roadmapToEdit) {
        reset({
          title: roadmapToEdit.title,
          subject: roadmapToEdit.subject,
          description: roadmapToEdit.description || '',
          goal: roadmapToEdit.goal || '',
          difficulty: roadmapToEdit.difficulty,
          estimatedDuration: roadmapToEdit.estimatedDuration || null,
          tagsInput: roadmapToEdit.tags?.join(', ') || '',
        });
      } else {
        reset({
          title: '',
          subject: '',
          description: '',
          goal: '',
          difficulty: 'beginner',
          estimatedDuration: null,
          tagsInput: '',
        });
      }
    }
  }, [isOpen, roadmapToEdit, reset]);

  if (!isOpen) return null;

  const onSubmit = (data: RoadmapFormInputs) => {
    const parsedTags = data.tagsInput
      ? data.tagsInput.split(',').map((t) => t.trim()).filter((t) => t.length > 0)
      : [];

    const baseDto = {
      title: data.title,
      subject: data.subject,
      description: data.description || undefined,
      goal: data.goal || undefined,
      difficulty: data.difficulty,
      estimatedDuration: data.estimatedDuration || undefined,
      tags: parsedTags,
    };

    if (isEditing && roadmapToEdit) {
      updateMutation.mutate(
        { id: roadmapToEdit.id, data: baseDto as UpdateRoadmapDto },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createMutation.mutate(baseDto as CreateRoadmapDto, {
        onSuccess: () => {
          onClose();
        },
      });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-md">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="bg-white rounded-2xl border border-neutral-200 shadow-xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-md py-sm border-b border-neutral-100 flex items-center justify-between">
          <h3 className="font-bold text-neutral-800 font-display">
            {isEditing ? 'Edit Study Roadmap' : 'Create New Study Roadmap'}
          </h3>
          <button 
            onClick={onClose}
            className="p-xs text-neutral-400 hover:text-neutral-700 hover:bg-neutral-50 rounded-lg transition-micro"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit(onSubmit)} className="overflow-y-auto p-md flex-1 space-y-md">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Roadmap Title
            </label>
            <input
              type="text"
              placeholder="e.g. Master Backend Engineering with Node.js"
              className={`block w-full px-md py-sm bg-neutral-50 border ${
                errors.title ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
              } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
              {...register('title')}
            />
            {errors.title && <p className="mt-xs text-xs text-red-500 font-medium">{errors.title.message}</p>}
          </div>

          {/* Subject */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Subject
            </label>
            <input
              type="text"
              placeholder="e.g. Computer Science, Math, Design"
              className={`block w-full px-md py-sm bg-neutral-50 border ${
                errors.subject ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
              } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
              {...register('subject')}
            />
            {errors.subject && <p className="mt-xs text-xs text-red-500 font-medium">{errors.subject.message}</p>}
          </div>

          {/* Difficulty & Estimated Duration Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-md">
            {/* Difficulty */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                Difficulty Level
              </label>
              <select
                className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
                {...register('difficulty')}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              {errors.difficulty && <p className="mt-xs text-xs text-red-500 font-medium">{errors.difficulty.message}</p>}
            </div>

            {/* Estimated Duration */}
            <div>
              <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
                Duration (Weeks)
              </label>
              <input
                type="number"
                placeholder="e.g. 12"
                className={`block w-full px-md py-sm bg-neutral-50 border ${
                  errors.estimatedDuration ? 'border-red-400 focus:ring-red-200' : 'border-neutral-200 focus:ring-primary-200'
                } rounded-xl text-sm transition-micro focus:outline-none focus:ring-4`}
                {...register('estimatedDuration', { valueAsNumber: true })}
              />
              {errors.estimatedDuration && <p className="mt-xs text-xs text-red-500 font-medium">{errors.estimatedDuration.message}</p>}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Give a brief summary of what this curriculum covers..."
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4 resize-none"
              {...register('description')}
            />
            {errors.description && <p className="mt-xs text-xs text-red-500 font-medium">{errors.description.message}</p>}
          </div>

          {/* Ultimate Goal */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs">
              Learning Goal
            </label>
            <input
              type="text"
              placeholder="e.g. Deploy 3 production apps and pass certification exam"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('goal')}
            />
            {errors.goal && <p className="mt-xs text-xs text-red-500 font-medium">{errors.goal.message}</p>}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-xs flex items-center gap-2xs">
              Tags (Comma separated) <HelpCircle size={14} className="text-neutral-400" />
            </label>
            <input
              type="text"
              placeholder="e.g. javascript, nodejs, db"
              className="block w-full px-md py-sm bg-neutral-50 border border-neutral-200 focus:ring-primary-200 rounded-xl text-sm focus:outline-none focus:ring-4"
              {...register('tagsInput')}
            />
          </div>

          {/* Action Row */}
          <div className="pt-sm border-t border-neutral-100 flex items-center justify-end gap-sm">
            <CTAButton type="button" variant="secondary" onClick={onClose} disabled={isPending}>
              Cancel
            </CTAButton>
            <CTAButton type="submit" variant="primary" disabled={isPending}>
              {isPending ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Roadmap'}
            </CTAButton>
          </div>
        </form>
      </div>
    </div>
  );
};
export default RoadmapModal;
