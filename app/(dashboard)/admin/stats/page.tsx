'use client';

import { useQuery } from '@tanstack/react-query';
import {
  BarChart3,
  Users,
  Scan,
  Globe,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Loader2,
  UserPlus,
  Activity,
} from 'lucide-react';
import { adminApi, SystemStats } from '@/lib/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const STATUS_ICONS: Record<string, { icon: typeof CheckCircle; color: string }> = {
  COMPLETED: { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border border-emerald-500/20' },
  FAILED: { icon: XCircle, color: 'text-destructive bg-destructive/10 border border-destructive/20' },
  IN_PROGRESS: { icon: Activity, color: 'text-primary bg-primary/10 border border-primary/20' },
  PENDING: { icon: Clock, color: 'text-amber-500 bg-amber-500/10 border border-amber-500/20' },
  CANCELLED: { icon: XCircle, color: 'text-muted-foreground bg-muted border border-muted-foreground/20' },
};

export default function AdminStatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: adminApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 animate-pulse">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="mt-4 text-muted-foreground font-semibold">Loading system statistics...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-24">
        <BarChart3 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
        <p className="text-muted-foreground font-medium">Could not load system statistics</p>
      </div>
    );
  }

  const userActivity =
    stats.total_users > 0
      ? Math.round((stats.active_users / stats.total_users) * 100)
      : 0;

  const scanSuccess =
    stats.total_scans > 0
      ? Math.round((stats.completed_scans / stats.total_scans) * 100)
      : 0;

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
          <BarChart3 className="h-8 w-8 text-amber-500" />
          System Statistics
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Platform-wide metrics and health overview
        </p>
      </div>

      {/* Primary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 border-l-4 border-l-amber-500/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Total Users
            </CardTitle>
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Users className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.total_users}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              {stats.active_users} active ({userActivity}%)
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 border-l-4 border-l-emerald-500/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Total Scans
            </CardTitle>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
              <Scan className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.total_scans}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              {stats.completed_scans} completed ({scanSuccess}%)
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 border-l-4 border-l-red-500/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Total Endpoints
            </CardTitle>
            <div className="p-2 rounded-lg bg-red-500/10 text-red-500">
              <Globe className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.total_endpoints}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              Across all scans
            </p>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 border-l-4 border-l-indigo-500/80 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold tracking-wider uppercase text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Recent Signups
            </CardTitle>
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500">
              <UserPlus className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {stats.recent_signups}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 font-medium">
              In the last 7 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Scan Status Breakdown */}
      <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <TrendingUp className="h-5 w-5 text-amber-500" />
            Scan Status Breakdown
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
            Distribution of scans by their current execution status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {Object.entries(stats.scans_by_status).map(([status, count]) => {
              const config = STATUS_ICONS[status] || STATUS_ICONS.PENDING;
              const Icon = config.icon;
              const percentage =
                stats.total_scans > 0
                  ? Math.round(((count as number) / stats.total_scans) * 100)
                  : 0;

              return (
                <div
                  key={status}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-white/[0.05] bg-white/40 dark:bg-slate-900/20 backdrop-blur-md hover:border-red-500/20 dark:hover:border-red-500/40 hover:shadow-md hover:translate-y-0 transition-all duration-300"
                >
                  <div className={`p-2 rounded-xl shrink-0 ${config.color.split(' border')[0]}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900 dark:text-white">{count as number}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider mt-0.5">
                      {status.replace('_', ' ')}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500/70 font-medium mt-0.5">
                      {percentage}% of total
                    </p>
                  </div>
                </div>
              );
            })}

            {Object.keys(stats.scans_by_status).length === 0 && (
              <p className="text-slate-500 dark:text-slate-400 text-sm col-span-full text-center py-4">
                No scan data available yet
              </p>
            )}
          </div>

          {/* Visual bar */}
          {stats.total_scans > 0 && (
            <div className="mt-6">
              <div className="flex rounded-full overflow-hidden h-4 bg-slate-100 dark:bg-slate-950/60">
                {stats.scans_by_status.COMPLETED > 0 && (
                  <div
                    className="bg-emerald-500 transition-all"
                    style={{
                      width: `${(stats.scans_by_status.COMPLETED / stats.total_scans) * 100}%`,
                    }}
                    title={`Completed: ${stats.scans_by_status.COMPLETED}`}
                  />
                )}
                {stats.scans_by_status.IN_PROGRESS > 0 && (
                  <div
                    className="bg-red-600 transition-all animate-pulse"
                    style={{
                      width: `${(stats.scans_by_status.IN_PROGRESS / stats.total_scans) * 100}%`,
                    }}
                    title={`In Progress: ${stats.scans_by_status.IN_PROGRESS}`}
                  />
                )}
                {stats.scans_by_status.PENDING > 0 && (
                  <div
                    className="bg-amber-500 transition-all"
                    style={{
                      width: `${(stats.scans_by_status.PENDING / stats.total_scans) * 100}%`,
                    }}
                    title={`Pending: ${stats.scans_by_status.PENDING}`}
                  />
                )}
                {stats.scans_by_status.FAILED > 0 && (
                  <div
                    className="bg-red-500 transition-all"
                    style={{
                      width: `${(stats.scans_by_status.FAILED / stats.total_scans) * 100}%`,
                    }}
                    title={`Failed: ${stats.scans_by_status.FAILED}`}
                  />
                )}
                {stats.scans_by_status.CANCELLED > 0 && (
                  <div
                    className="bg-slate-400 dark:bg-slate-600 transition-all"
                    style={{
                      width: `${(stats.scans_by_status.CANCELLED / stats.total_scans) * 100}%`,
                    }}
                    title={`Cancelled: ${stats.scans_by_status.CANCELLED}`}
                  />
                )}
              </div>
              <div className="flex items-center gap-4 mt-3.5 text-xs text-slate-500 dark:text-slate-400 flex-wrap font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Completed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse" /> In Progress
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Pending
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-500" /> Failed
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-slate-400 dark:bg-slate-600" /> Cancelled
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Health Summary */}
      <Card className="glass-card shadow-lg border-amber-500/20 bg-gradient-to-r from-amber-500/5 via-amber-500/10 to-transparent relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <CardContent className="flex items-center gap-4 py-6 relative z-10">
          <div className="p-3 bg-amber-500/10 text-amber-500 rounded-xl">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>Platform Health</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
              {stats.in_progress_scans > 0
                ? `${stats.in_progress_scans} scan(s) currently running. `
                : 'No scans currently running. '}
              {stats.failed_scans > 0
                ? `${stats.failed_scans} scan(s) have failed and may need attention.`
                : 'All completed scans succeeded.'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
