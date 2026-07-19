import React from 'react';
import { LucideIcon } from 'lucide-react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number; // percentage change, e.g. +12 or -5
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon: Icon,
  iconColor = 'text-primary-500',
  iconBg = 'bg-primary-50',
}) => {
  const isPositive = change && change >= 0;

  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl p-md flex justify-between items-start shadow-sm">
      <div className="space-y-sm">
        <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">{title}</p>
        <h4 className="text-2xl font-bold text-neutral-800 font-display tracking-tight leading-none">{value}</h4>
        
        {change !== undefined && (
          <div className="flex items-center gap-xs text-xs">
            <span className={`inline-flex items-center font-bold gap-2xs ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-neutral-400 font-medium">{changeLabel}</span>
          </div>
        )}
      </div>
      <div className={`w-10 h-10 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}>
        <Icon size={20} />
      </div>
    </div>
  );
};
export default StatCard;
