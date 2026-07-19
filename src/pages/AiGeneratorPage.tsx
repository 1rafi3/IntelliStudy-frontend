import React, { useState } from 'react';
import { Bot, ChevronLeft, History, Sparkles } from 'lucide-react';
import { PageHeader } from '@components/ui/PageHeader';
import { AiRoadmapForm } from '@features/ai/components/AiRoadmapForm';
import { AiRoadmapPreview } from '@features/ai/components/AiRoadmapPreview';
import { AiHistorySidebar } from '@features/ai/components/AiHistorySidebar';
import { useGenerateRoadmapMutation } from '@features/ai/hooks';
import { GenerateRoadmapDto, GeneratedRoadmapData } from '@features/ai/types';

export const AiGeneratorPage: React.FC = () => {
  const [activeRoadmap, setActiveRoadmap] = useState<GeneratedRoadmapData | null>(null);
  const [initialParams, setInitialParams] = useState<Partial<GenerateRoadmapDto>>({});
  const generateMutation = useGenerateRoadmapMutation();

  const handleGenerate = (data: GenerateRoadmapDto) => {
    setInitialParams(data);
    generateMutation.mutate(data, {
      onSuccess: (res) => {
        setActiveRoadmap(res.data as unknown as GeneratedRoadmapData);
        // Scroll to top of main content on mobile when preview appears
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };

  const handleLoadHistory = (prompt: GenerateRoadmapDto, roadmap: GeneratedRoadmapData) => {
    setInitialParams(prompt);
    setActiveRoadmap(roadmap);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRegenerate = () => {
    setActiveRoadmap(null);
  };

  return (
    <div className="space-y-6 pb-16">
      <PageHeader
        title="AI Roadmap Generator"
        description="Let our AI learning coach build a personalized, phase-by-phase curriculum based on your specific goals and schedule."
        action={
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-md">
            <Bot className="text-white" size={20} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Main Content ── */}
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-4">
          {/* Back button when viewing preview */}
          {activeRoadmap && (
            <button
              onClick={() => setActiveRoadmap(null)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400 rounded-md"
            >
              <ChevronLeft size={16} />
              Back to Form
            </button>
          )}

          {/* Main view: Preview or Form */}
          {activeRoadmap ? (
            <AiRoadmapPreview data={activeRoadmap} onRegenerate={handleRegenerate} />
          ) : (
            <>
              <AiRoadmapForm
                onSubmit={handleGenerate}
                isGenerating={generateMutation.isPending}
                initialData={initialParams}
              />

              {/* Empty preview placeholder — only show when no roadmap yet */}
              {!generateMutation.isPending && (
                <div className="bg-white dark:bg-gray-950 border border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center py-14 px-6 text-center space-y-3">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-400 shadow-sm">
                    <Sparkles size={26} />
                  </div>
                  <h3 className="text-base font-bold text-gray-800 dark:text-white">
                    Your roadmap will appear here
                  </h3>
                  <p className="text-sm text-gray-400 dark:text-gray-500 max-w-sm leading-relaxed">
                    Fill in your learning goals above and click{' '}
                    <span className="font-semibold text-indigo-500">Generate My Roadmap</span> to receive a
                    full, AI-crafted study curriculum.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Sidebar: History ── */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-3">
          {/* Sidebar Header */}
          <div className="bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-100 dark:border-gray-900">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-500">
                <History size={16} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                  Generation History
                </h3>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  Click to reload a previous roadmap
                </p>
              </div>
            </div>
            <div className="p-3">
              <AiHistorySidebar onSelectHistory={handleLoadHistory} />
            </div>
          </div>

          {/* Tips card */}
          <div className="bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-4">
            <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wider mb-2">
              💡 Pro Tips
            </p>
            <ul className="space-y-2 text-xs text-indigo-700 dark:text-indigo-300">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                Be specific about your goals — "Learn React for e-commerce apps" beats "Learn React".
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                Set realistic weekly hours — 8–15 h/week is a sweet spot for working professionals.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-indigo-400">•</span>
                Save a roadmap to your dashboard to track progress phase by phase.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
export default AiGeneratorPage;
