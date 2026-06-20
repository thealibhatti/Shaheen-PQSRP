'use client';

import { useQuery } from '@tanstack/react-query';
import { FileText, Download, Loader2, AlertCircle } from 'lucide-react';
import { reportsApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDateTime, formatFileSize } from '@/lib/utils';
import { Report } from '@/types';

export default function ReportsPage() {
  const { data: reports, isLoading, isError } = useQuery({
    queryKey: ['reports'],
    queryFn: () => reportsApi.list(0, 50),
  });

  const handleDownload = (scanId: number) => {
    window.open(reportsApi.getDownloadUrl(scanId), '_blank');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      COMPLETED: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25',
      GENERATING: 'bg-red-500/10 text-red-500 border border-red-500/25 animate-pulse',
      PENDING: 'bg-amber-500/10 text-amber-500 border border-amber-500/25',
      FAILED: 'bg-red-500/10 text-red-500 border border-red-500/25',
    };
    return variants[status] || 'bg-slate-100 dark:bg-slate-800 text-slate-500 border';
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          Reports
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Download and manage your assessment reports
        </p>
      </div>

      {/* Reports list */}
      <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Generated Reports</CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
            PDF reports from your completed scans
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-10 w-10 animate-spin text-red-500" />
            </div>
          ) : isError ? (
            <div className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-300 font-semibold">Failed to load reports</p>
            </div>
          ) : !reports || reports.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 opacity-40" />
              <p className="text-slate-700 dark:text-slate-300 mb-1 font-semibold">No reports generated yet</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed font-medium">
                Complete a security scan first and trigger PDF generation to access your assessments here.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report: Report) => (
                <div
                  key={report.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-slate-200/50 dark:border-white/[0.05] rounded-xl bg-white/40 dark:bg-slate-900/20 backdrop-blur-md hover:bg-slate-100/65 dark:hover:bg-white/[0.02] transition-all duration-200 gap-4 hover:translate-x-1"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-500/10 text-red-500 rounded-xl shrink-0">
                      <FileText className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {report.file_name || `Report for Scan #${report.scan_id}`}
                        </span>
                        <Badge className={`${getStatusBadge(report.status)} text-[10px] font-semibold rounded-full px-2 py-0.5`}>
                          {report.status}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                        <span>Scan #{report.scan_id}</span>
                        <span className="text-slate-400 dark:text-slate-600">•</span>
                        <span>{formatDateTime(report.created_at)}</span>
                        {report.file_size && (
                          <>
                            <span className="text-slate-400 dark:text-slate-600">•</span>
                            <span>{formatFileSize(report.file_size)}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center justify-end">
                    {report.status === 'COMPLETED' ? (
                      <Button
                        size="sm"
                        onClick={() => handleDownload(report.scan_id)}
                        className="h-9 px-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md shadow-red-600/20"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : report.status === 'GENERATING' ? (
                      <Button size="sm" disabled className="h-9 px-4 rounded-lg border border-slate-200 dark:border-white/10 text-slate-400 bg-slate-100 dark:bg-slate-950/40">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </Button>
                    ) : report.status === 'FAILED' ? (
                      <Button size="sm" variant="outline" disabled className="h-9 px-4 rounded-lg text-red-500 border border-red-500/20 bg-red-500/5 cursor-not-allowed">
                        <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                        Failed
                      </Button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}