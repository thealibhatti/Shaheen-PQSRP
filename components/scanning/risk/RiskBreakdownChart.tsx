'use client';

import { RiskBreakdown } from '@/types';

interface RiskBreakdownChartProps {
  breakdown: RiskBreakdown;
}

const categories = [
  { key: 'key_exchange', label: 'Key Exchange', weight: 35 },
  { key: 'tls_version', label: 'TLS Version', weight: 20 },
  { key: 'cipher', label: 'Cipher', weight: 15 },
  { key: 'hash', label: 'Hash', weight: 15 },
  { key: 'signature', label: 'Signature', weight: 15 },
];

function getScoreColor(score: number): string {
  if (score <= 20) return 'bg-green-500';
  if (score <= 40) return 'bg-yellow-500';
  if (score <= 60) return 'bg-orange-500';
  return 'bg-red-500';
}

function getScoreBgColor(score: number): string {
  if (score <= 20) return 'bg-green-100';
  if (score <= 40) return 'bg-yellow-100';
  if (score <= 60) return 'bg-orange-100';
  return 'bg-red-100';
}

function getScoreTextColor(score: number): string {
  if (score <= 20) return 'text-green-700';
  if (score <= 40) return 'text-yellow-700';
  if (score <= 60) return 'text-orange-700';
  return 'text-red-700';
}

function getScoreLabel(score: number): string {
  if (score <= 20) return 'Good';
  if (score <= 40) return 'Fair';
  if (score <= 60) return 'Poor';
  return 'Critical';
}

export function RiskBreakdownChart({ breakdown }: RiskBreakdownChartProps) {
  return (
    <div className="space-y-4">
      {categories.map((category) => {
        const score = breakdown[category.key as keyof RiskBreakdown] || 0;
        const percentage = Math.min(100, score);

        return (
          <div key={category.key} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">
                  {category.label}
                </span>
                <span className="text-xs text-gray-400">
                  ({category.weight}% weight)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${getScoreBgColor(
                    score
                  )} ${getScoreTextColor(score)}`}
                >
                  {getScoreLabel(score)}
                </span>
                <span className="text-sm font-semibold text-gray-900">
                  {score}/100
                </span>
              </div>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getScoreColor(
                  score
                )}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 mb-2">Score Legend:</div>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-xs text-gray-600">0-20: Good</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <span className="text-xs text-gray-600">21-40: Fair</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-600">41-60: Poor</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">61-100: Critical</span>
          </div>
        </div>
      </div>
    </div>
  );
}