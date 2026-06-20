'use client';

import Link from 'next/link';
import { FileText, Download, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DownloadButton } from './DownloadButton';
import { formatDateTime, formatFileSize, formatRelativeTime } from '@/lib/utils';
import { Report } from '@/types';

interface ReportCardProps {
  report: Report;
  onRefresh?: () => void;
}

export function ReportCard({ report, onRefresh }: ReportCardProps) {
  const getStatusIcon = () => {
    switch (report.status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'GENERATING':
      case 'PENDING':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'FAILED':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = () => {
    const variants: Record<string, string> = {
      COMPLETED: 'bg-green-100 text-green-800',
      GENERATING: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      FAILED: 'bg-red-100 text-red-800',
    };
    return variants[report.status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium text-gray-900">
                  {report.file_name || `Report for Scan #${report.scan_id}`}
                </span>
                <Badge className={getStatusBadge()}>{report.status}</Badge>
              </div>
              <div className="text-sm text-gray-500 space-y-0.5">
                <div>Scan #{report.scan_id}</div>
                <div className="flex items-center gap-3">
                  <span>{formatRelativeTime(report.created_at)}</span>
                  {report.file_size && (
                    <>
                      <span>•</span>
                      <span>{formatFileSize(report.file_size)}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="capitalize">{report.report_type}</span>
                </div>
              </div>
              {report.error_message && (
                <div className="mt-2 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                  {report.error_message}
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href={`/scans/${report.scan_id}`}>
              <Button variant="outline" size="sm">
                View Scan
              </Button>
            </Link>
            <DownloadButton
              scanId={report.scan_id}
              report={report}
              onGenerated={onRefresh}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}