import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, action }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-sm mb-lg">
      <div className="space-y-xs">
        <h1 className="text-2xl font-bold text-neutral-800 tracking-tight font-display">{title}</h1>
        {description && <p className="text-neutral-500 text-sm leading-relaxed">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};
export default PageHeader;
