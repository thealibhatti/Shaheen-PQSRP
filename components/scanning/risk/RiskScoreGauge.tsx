'use client';

import { RiskLevel } from '@/types';
import { getRiskLevelColor } from '@/lib/utils';

interface RiskScoreGaugeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

export function RiskScoreGauge({ score, level, size = 'md' }: RiskScoreGaugeProps) {
  const sizes = {
    sm: { width: 120, strokeWidth: 8, fontSize: 24 },
    md: { width: 160, strokeWidth: 10, fontSize: 36 },
    lg: { width: 200, strokeWidth: 12, fontSize: 48 },
  };

  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  const levelColors: Record<RiskLevel, string> = {
    LOW: '#22c55e',
    MEDIUM: '#eab308',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  };

  const color = levelColors[level];

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width, height: width }}>
        <svg width={width} height={width} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Progress circle */}
          <circle
            cx={width / 2}
            cy={width / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out gauge-fill"
            style={{ '--gauge-offset': offset } as React.CSSProperties}
          />
        </svg>
        {/* Score text */}
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ color }}
        >
          <span className="font-bold" style={{ fontSize }}>
            {score}
          </span>
          <span className="text-sm text-gray-500">/ 100</span>
        </div>
      </div>
      {/* Level label */}
      <div
        className="mt-2 px-3 py-1 rounded-full text-sm font-semibold"
        style={{
          backgroundColor: `${color}20`,
          color,
        }}
      >
        {level} RISK
      </div>
    </div>
  );
}