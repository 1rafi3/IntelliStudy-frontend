import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon: Icon }) => {
  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl p-md md:p-lg flex flex-col gap-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5">
      <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
        <Icon size={20} />
      </div>
      <div className="space-y-2xs">
        <h3 className="font-bold text-neutral-800 font-display leading-tight">{title}</h3>
        <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
};
export default FeatureCard;
