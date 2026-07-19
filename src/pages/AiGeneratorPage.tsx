import React, { useState } from 'react';
import { Bot, ChevronLeft } from 'lucide-react';
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
    setInitialParams(data); // save for regenerate/edit
    generateMutation.mutate(data, {
      onSuccess: (res) => {
        // res is ApiResponse<Record<string,any>> — use .data to get the actual payload
        setActiveRoadmap(res.data as unknown as GeneratedRoadmapData);
      },
    });
  };

  const handleLoadHistory = (prompt: GenerateRoadmapDto, roadmap: GeneratedRoadmapData) => {
    setInitialParams(prompt);
    setActiveRoadmap(roadmap);
  };

  const handleRegenerate = () => {
    setActiveRoadmap(null);
  };

  return (
    <div className="space-y-lg pb-xl">
      <PageHeader 
        title="AI Roadmap Generator" 
        description="Let our AI learning coach build a personalized, phase-by-phase curriculum based on your specific goals and schedule."
        action={
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-accent-500 flex items-center justify-center shadow-md">
            <Bot className="text-white" size={20} />
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg items-start">
        
        {/* Main Content Area (Form or Preview) */}
        <div className="lg:col-span-8 order-2 lg:order-1 space-y-md">
          {activeRoadmap && (
            <button 
              onClick={() => setActiveRoadmap(null)}
              className="inline-flex items-center gap-2xs text-xs font-semibold text-neutral-500 hover:text-neutral-800 transition-micro mb-xs"
            >
              <ChevronLeft size={16} /> Edit Parameters
            </button>
          )}

          {activeRoadmap ? (
            <AiRoadmapPreview 
              data={activeRoadmap} 
              onRegenerate={handleRegenerate} 
            />
          ) : (
            <AiRoadmapForm 
              onSubmit={handleGenerate}
              isGenerating={generateMutation.isPending}
              initialData={initialParams}
            />
          )}
        </div>

        {/* Sidebar (History) */}
        <div className="lg:col-span-4 order-1 lg:order-2 space-y-md">
          <div>
            <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest mb-sm">
              Generation History
            </h3>
            <p className="text-xs text-neutral-500 mb-md leading-relaxed">
              Quickly load your previously generated roadmaps. Saving a roadmap moves it to your main dashboard.
            </p>
          </div>
          
          <div className="bg-neutral-50 border border-neutral-200/60 rounded-2xl p-sm">
            <AiHistorySidebar onSelectHistory={handleLoadHistory} />
          </div>
        </div>

      </div>
    </div>
  );
};
export default AiGeneratorPage;
