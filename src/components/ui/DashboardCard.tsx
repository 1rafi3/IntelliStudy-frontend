import React from 'react';

interface DashboardCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  children,
  className = '',
  title,
  subtitle,
  action,
}) => {
  return (
    <div className={`bg-white border border-neutral-200/60 rounded-2xl shadow-sm p-md md:p-lg flex flex-col gap-md ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between gap-sm border-b border-neutral-100 pb-sm">
          <div>
            {title && <h3 className="font-bold text-neutral-800 font-display leading-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-neutral-400 mt-2xs">{subtitle}</p>}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
};
export default DashboardCard;
