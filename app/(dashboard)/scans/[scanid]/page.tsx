'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link';
import {
  ArrowLeft,
  RefreshCw,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
} from 'lucide-react';
import { scansApi, riskApi, reportsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EndpointsTable } from '@/components/scanning/EndpointsTable';
import { RiskScoreGauge } from '@/components/scanning/risk/RiskScoreGauge';
import { RiskBreakdownChart } from '@/components/scanning/risk/RiskBreakdownChart';
import { useToast } from '@/components/ui/use-toast';
import {
  formatDateTime,
  formatDuration,
  getRiskLevelColor,
  getRiskLevelBgColor,
} from '@/lib/utils';

export async function generateStaticParams() {
  return Array.from({ length: 50 }, (_, i) => ({
    scanid: String(i + 1),
  }));
}

export const dynamicParams = false;

export default function ScanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const scanId = Number(params?.scanid || 0);

  // Fetch scan details
  const {
    data: scan,
    isLoading: scanLoading,
    isError: scanError,
    refetch: refetchScan,
  } = useQuery({
    queryKey: ['scan', scanId],
    queryFn: () => scansApi.get(scanId),
    refetchInterval: (data) => {
      // Auto-refresh while in progress
      if (data?.state.data?.status === 'IN_PROGRESS' || data?.state.data?.status === 'PENDING') {
        return 3000;
      }
      return false;
    },
  });

  // Fetch risk score (only if completed)
  const { data: riskScore, isLoading: riskLoading } = useQuery({
    queryKey: ['risk', scanId],
    queryFn: () => riskApi.getScore(scanId),
    enabled: scan?.status === 'COMPLETED',
  });

  // Fetch report status
  const { data: report } = useQuery({
    queryKey: ['report', scanId],
    queryFn: () => reportsApi.get(scanId),
    enabled: scan?.status === 'COMPLETED',
    retry: false,
  });

  const handleGenerateReport = async () => {
    try {
      await reportsApi.generate(scanId);
      // Small delay to let backend write the report record
      await new Promise(resolve => setTimeout(resolve, 1500));
      queryClient.invalidateQueries({ queryKey: ['report', scanId] });
      toast({
        title: '✅ Report generated!',
        description: 'Click "Download Report" to save your PDF.',
      });
    } catch (error: any) {
      toast({
        title: 'Failed to generate report',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDownloadReport = async () => {
    try {
      const blob = await reportsApi.download(scanId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `shaheenshield_report_scan_${scanId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.response?.data?.message || 'Could not download report',
        variant: 'destructive',
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-6 w-6 text-emerald-500" />;
      case 'IN_PROGRESS':
      case 'PENDING':
        return <Loader2 className="h-6 w-6 text-primary animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-6 w-6 text-destructive" />;
      case 'CANCELLED':
        return <XCircle className="h-6 w-6 text-muted-foreground" />;
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      COMPLETED: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25',
      IN_PROGRESS: 'bg-primary/10 text-primary border border-primary/25',
      PENDING: 'bg-amber-500/10 text-amber-500 border border-amber-500/25',
      FAILED: 'bg-destructive/10 text-destructive border border-destructive/25',
      CANCELLED: 'bg-muted text-muted-foreground border border-muted-foreground/20',
    };
    return variants[status] || 'bg-muted text-muted-foreground border';
  };

  if (scanLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (scanError || !scan) {
    return (
      <div className="text-center py-20 max-w-md mx-auto">
        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-extrabold text-foreground">Scan not found</h2>
        <p className="text-muted-foreground mt-2">
          The scan you're looking for doesn't exist or you don't have access.
        </p>
        <Link href="/scans">
          <Button className="mt-6">Back to Scans</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back button */}
      <Link href="/scans" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        Back to Scans
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          {getStatusIcon(scan.status)}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
              {scan.name || `Scan #${scan.id}`}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <Badge className={`${getStatusBadge(scan.status)} rounded-full font-medium text-xs px-2.5 py-0.5`}>
                {scan.status.replace('_', ' ')}
              </Badge>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Created {formatDateTime(scan.created_at)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => refetchScan()} className="h-9 px-4 rounded-lg border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/60 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          {scan.status === 'COMPLETED' && (
            <>
              {report?.status === 'COMPLETED' ? (
                <Button size="sm" onClick={handleDownloadReport} className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md shadow-red-600/20">
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
              ) : (
                <Button size="sm" onClick={handleGenerateReport} className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md shadow-red-600/20">
                  Generate Report
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Progress (if in progress) */}
      {(scan.status === 'IN_PROGRESS' || scan.status === 'PENDING') && (
        <Card className="border-red-500/20 bg-red-500/5 dark:bg-red-500/5 shadow-lg">
          <CardContent className="py-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 dark:text-white">Scan Progress</span>
              <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                {scan.scanned_endpoints} <span className="text-slate-400">/</span> {scan.total_endpoints} endpoints
              </span>
            </div>
            <Progress value={scan.progress_percentage} className="h-2" />
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-2.5 animate-pulse">
              {scan.status === 'PENDING' ? 'Waiting in queue...' : 'Currently executing TLS tests & scanning vulnerability layers...'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stats cards */}
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Total Endpoints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white group-hover:text-red-500 transition-colors duration-200">
              {scan.total_endpoints}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Scanned OK
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-emerald-500">
              {scan.scanned_endpoints}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Failed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-red-500">
              {scan.failed_endpoints}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 group">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatDuration(scan.duration_seconds)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk score (if completed) */}
      {scan.status === 'COMPLETED' && riskScore && (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Risk Score</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Overall post-quantum vulnerability assessment</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-4">
              <RiskScoreGauge score={riskScore.overall_score} level={riskScore.risk_level} />
            </CardContent>
          </Card>

          <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Risk Breakdown</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400">Post-Quantum vulnerability score by category</CardDescription>
            </CardHeader>
            <CardContent>
              <RiskBreakdownChart breakdown={riskScore.breakdown} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Summary (if completed) */}
      {scan.status === 'COMPLETED' && riskScore?.summary && (
        <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
          <CardHeader className="bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/50 dark:border-white/[0.05] py-4">
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{riskScore.summary}</p>

            {riskScore.recommendations.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-200/50 dark:border-white/[0.05]">
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-3">Critical Mitigations & Recommendations:</h4>
                <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {riskScore.recommendations.slice(0, 5).map((rec, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="text-red-500 font-bold mt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Endpoints table */}
      <Card className="glass-card shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Scanned Endpoints</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
            Detailed cryptographic parameters and vulnerability level for each endpoint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EndpointsTable endpoints={scan.endpoints} />
        </CardContent>
      </Card>
    </div>
  );
}