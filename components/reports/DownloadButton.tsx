'use client';

import { useState } from 'react';
import { Download, Loader2, FileText, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { reportsApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import { Report, ReportStatus } from '@/types';

interface DownloadButtonProps {
  scanId: number;
  report?: Report | null;
  onGenerated?: () => void;
}

export function DownloadButton({ scanId, report, onGenerated }: DownloadButtonProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await reportsApi.generate(scanId);
      toast({
        title: 'Report generation started',
        description: 'Your PDF report is being generated...',
      });
      onGenerated?.();
    } catch (error: any) {
      toast({
        title: 'Failed to generate report',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const blob = await reportsApi.download(scanId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = report?.file_name || `shaheenshield_report_${scanId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Download started',
        description: 'Your report is being downloaded...',
      });
    } catch (error: any) {
      toast({
        title: 'Download failed',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsDownloading(false);
    }
  };

  // No report exists - show generate button
  if (!report) {
    return (
      <Button onClick={handleGenerate} disabled={isGenerating}>
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </>
        )}
      </Button>
    );
  }

  // Report is being generated
  if (report.status === 'GENERATING' || report.status === 'PENDING') {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Generating...
      </Button>
    );
  }

  // Report generation failed
  if (report.status === 'FAILED') {
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Retrying...
            </>
          ) : (
            <>
              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
              Retry Generation
            </>
          )}
        </Button>
      </div>
    );
  }

  // Report is ready - show download button
  return (
    <Button onClick={handleDownload} disabled={isDownloading}>
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Downloading...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Report
        </>
      )}
    </Button>
  );
}