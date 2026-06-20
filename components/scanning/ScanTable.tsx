'use client';

import Link from 'next/link';
import {
  CheckCircle,
  Clock,
  Loader2,
  XCircle,
  ArrowRight,
  MoreHorizontal,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatRelativeTime, formatDateTime } from '@/lib/utils';
import { Scan, ScanStatus } from '@/types';

interface ScanTableProps {
  scans: Scan[];
  compact?: boolean;
}

const statusConfig: Record<ScanStatus, { icon: React.ElementType; color: string; bgColor: string }> = {
  COMPLETED: { icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-500' },
  IN_PROGRESS: { icon: Loader2, color: 'text-primary', bgColor: 'bg-primary/10 border-primary/25 text-primary' },
  PENDING: { icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10 border-amber-500/25 text-amber-500' },
  FAILED: { icon: XCircle, color: 'text-destructive', bgColor: 'bg-destructive/10 border-destructive/25 text-destructive' },
  CANCELLED: { icon: XCircle, color: 'text-muted-foreground', bgColor: 'bg-muted border-muted-foreground/20 text-muted-foreground' },
};

export function ScanTable({ scans, compact = false }: ScanTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
      <table className="min-w-full divide-y divide-slate-200/50 dark:divide-white/[0.05]">
        <thead className="bg-slate-50 dark:bg-slate-950/40">
          <tr>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Scan Name
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Endpoints
            </th>
            {!compact && (
              <th className="px-6 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                Created
              </th>
            )}
            <th className="px-6 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.05] bg-transparent">
          {scans.map((scan) => {
            const status = statusConfig[scan.status];
            const StatusIcon = status.icon;

            return (
              <tr key={scan.id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.02] transition-colors duration-150 group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <Link href={`/scans/${scan.id}`} className="block">
                    <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-red-500 dark:group-hover:text-red-500 transition-colors">
                      {scan.name || `Scan #${scan.id}`}
                    </div>
                    {scan.description && (
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                        {scan.description}
                      </div>
                    )}
                  </Link>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <StatusIcon
                      className={`h-4 w-4 ${status.color} ${
                        scan.status === 'IN_PROGRESS' ? 'animate-spin' : ''
                      }`}
                    />
                    <Badge className={`${status.bgColor} text-xs font-medium px-2 py-0.5 rounded-full border`}>
                      {scan.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  {scan.status === 'IN_PROGRESS' && (
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 font-medium pl-6">
                      {scan.progress_percentage.toFixed(0)}% complete
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-slate-900 dark:text-white font-medium">
                    {scan.scanned_endpoints} <span className="text-slate-400 dark:text-slate-500">/</span> {scan.total_endpoints}
                  </div>
                  {scan.failed_endpoints > 0 && (
                    <div className="text-xs text-red-500 dark:text-red-400 font-medium mt-0.5">
                      {scan.failed_endpoints} failed
                    </div>
                  )}
                </td>
                {!compact && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    <div className="font-medium text-slate-700 dark:text-slate-300">{formatRelativeTime(scan.created_at)}</div>
                    <div className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{formatDateTime(scan.created_at)}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/scans/${scan.id}`}>
                      <Button variant="ghost" size="sm" className="hover:text-red-500 dark:hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300">
                        View
                        <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Button>
                    </Link>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-red-500 dark:hover:text-red-500 hover:bg-slate-100 dark:hover:bg-white/5 text-slate-600 dark:text-slate-300">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900">
                        <DropdownMenuItem asChild className="focus:bg-slate-100 dark:focus:bg-white/5 focus:text-slate-900 dark:focus:text-white cursor-pointer">
                          <Link href={`/scans/${scan.id}`}>View Details</Link>
                        </DropdownMenuItem>
                        {scan.status === 'COMPLETED' && (
                          <DropdownMenuItem asChild className="focus:bg-slate-100 dark:focus:bg-white/5 focus:text-slate-900 dark:focus:text-white cursor-pointer">
                            <Link href={`/reports?scan=${scan.id}`}>
                              View Report
                            </Link>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}