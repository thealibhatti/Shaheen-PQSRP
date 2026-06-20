'use client';

import { RiskLevel } from '@/types';
import { cn } from '@/lib/utils';

interface RiskLevelBadgeProps {
  level: RiskLevel;
  showScore?: boolean;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
}

const levelConfig: Record<
  RiskLevel,
  {
    label: string;
    bgColor: string;
    textColor: string;
    borderColor: string;
  }
> = {
  LOW: {
    label: 'Low Risk',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  MEDIUM: {
    label: 'Medium Risk',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  HIGH: {
    label: 'High Risk',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  CRITICAL: {
    label: 'Critical Risk',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function RiskLevelBadge({
  level,
  showScore = false,
  score,
  size = 'md',
}: RiskLevelBadgeProps) {
  const config = levelConfig[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses[size]
      )}
    >
      {config.label}
      {showScore && score !== undefined && (
        <span className="font-normal">({score}/100)</span>
      )}
    </span>
  );
}