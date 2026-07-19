import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Clock, CheckCircle2, BookOpen, Save, RefreshCw } from 'lucide-react';
import { CTAButton } from '@components/ui/CTAButton';
import { GeneratedRoadmapData, SaveRoadmapDto } from '../types';
import { useSaveRoadmapMutation } from '../hooks';

interface AiRoadmapPreviewProps {
  data: GeneratedRoadmapData;
  onRegenerate: () => void;
}

export const AiRoadmapPreview: React.FC<AiRoadmapPreviewProps> = ({ data, onRegenerate }) => {
  const navigate = useNavigate();
  const saveMutation = useSaveRoadmapMutation();

  const handleSave = () => {
    const payload: SaveRoadmapDto = {
      title: data.title,
      subject: data.title, // Use title as fallback subject if not explicitly returned
      description: data.summary,
      goal: data.goal,
      difficulty: data.difficulty,
      estimatedDuration: parseInt(data.estimatedDuration) || 1,
      tags: ['AI-Generated'],
    };

    saveMutation.mutate(payload, {
      onSuccess: (response) => {
        // Redirect to the newly created roadmap details page
        if (response.data && response.data.id) {
          navigate(`/dashboard/roadmaps/${response.data.id}`);
        } else {
          navigate('/dashboard/roadmaps');
        }
      },
    });
  };

  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl shadow-sm p-lg overflow-hidden relative">
      
      {/* Action Bar (Sticky) */}
      <div className="sticky top-0 -mx-lg -mt-lg px-lg py-sm bg-white/80 backdrop-blur-md border-b border-neutral-100 flex items-center justify-between z-10 mb-md">
        <h3 className="font-bold text-neutral-800">Generated Preview</h3>
        <div className="flex gap-sm">
          <CTAButton variant="secondary" size="sm" onClick={onRegenerate} disabled={saveMutation.isPending} className="gap-2xs">
            <RefreshCw size={14} /> Regenerate
          </CTAButton>
          <CTAButton variant="primary" size="sm" onClick={handleSave} disabled={saveMutation.isPending} className="gap-2xs">
            <Save size={14} /> Save Roadmap
          </CTAButton>
        </div>
      </div>

      {/* Header Info */}
      <div className="space-y-sm mb-lg border-b border-neutral-100 pb-lg">
        <div className="flex items-center gap-xs mb-sm">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-primary-50 text-primary-600 border border-primary-100">
            {data.difficulty}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
            {data.estimatedDuration}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded bg-neutral-100 text-neutral-500 border border-neutral-200">
            {data.weeklyHours}
          </span>
        </div>
        <h2 className="text-2xl font-black text-neutral-900 font-display leading-tight">{data.title}</h2>
        <p className="text-sm text-neutral-500 font-medium">🎯 {data.goal}</p>
        <p className="text-sm text-neutral-600 leading-relaxed bg-neutral-50 p-sm rounded-xl border border-neutral-100 mt-md">
          {data.summary}
        </p>
      </div>

      {/* Curriculum / Phases Timeline */}
      <div className="space-y-sm">
        <h3 className="text-sm font-bold text-neutral-800 uppercase tracking-widest flex items-center gap-2xs mb-md">
          <Compass size={18} className="text-primary-500" /> Curriculum Blueprint
        </h3>

        <div className="relative border-l-2 border-neutral-100 pl-md ml-xs space-y-lg">
          {data.phases.map((phase, idx) => (
            <div key={idx} className="relative">
              {/* Timeline Node */}
              <div className="w-5 h-5 rounded-full bg-white border-4 border-neutral-200 absolute -left-[27px] top-1 flex items-center justify-center shrink-0" />
              
              <div className="bg-white border border-neutral-200/60 rounded-xl p-md shadow-2xs hover:shadow-sm transition-micro group">
                {/* Phase Header */}
                <div className="flex justify-between items-start gap-xs mb-sm">
                  <div>
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider mb-2xs block">
                      Phase {idx + 1}
                    </span>
                    <h4 className="font-bold text-neutral-800 text-md">{phase.title}</h4>
                  </div>
                  <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-xs py-3xs rounded-md flex items-center gap-2xs shrink-0">
                    <Clock size={12} /> {phase.estimatedWeeks} Weeks
                  </span>
                </div>
                
                <p className="text-xs text-neutral-600 leading-relaxed mb-md">{phase.description}</p>
                
                {/* Topics & Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm border-t border-neutral-100">
                  
                  {/* Topics */}
                  <div>
                    <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-sm flex items-center gap-2xs">
                      <CheckCircle2 size={12} /> Key Topics
                    </h5>
                    <ul className="space-y-xs">
                      {phase.topics.map((topic, tidx) => (
                        <li key={tidx} className="text-xs text-neutral-600 flex items-start gap-xs">
                          <span className="text-neutral-300 mt-[2px]">•</span> {topic}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Resources */}
                  <div>
                    <h5 className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-sm flex items-center gap-2xs">
                      <BookOpen size={12} /> Recommended Resources
                    </h5>
                    <ul className="space-y-xs">
                      {phase.resources.map((resource, ridx) => (
                        <li key={ridx} className="text-xs text-neutral-600 flex items-start gap-xs bg-neutral-50 p-2xs rounded border border-neutral-100">
                          <span className="text-primary-400 shrink-0">→</span> {resource}
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
