import React from 'react';
import { LucideIcon } from 'lucide-react';
import { CTAButton } from './CTAButton';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon,
  actionText,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-xl bg-white border border-dashed border-neutral-200 rounded-2xl max-w-lg mx-auto my-md">
      <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-500 mb-md">
        <Icon size={24} />
      </div>
      <h3 className="text-base font-bold text-neutral-800 mb-xs font-display">{title}</h3>
      <p className="text-neutral-500 text-sm leading-relaxed mb-lg max-w-sm">{description}</p>
      {actionText && onAction && (
        <CTAButton variant="primary" onClick={onAction}>
          {actionText}
        </CTAButton>
      )}
    </div>
  );
};
export default EmptyState;
