/**
 * Mock Reports API for Presentation Mode
 */

import { Report, ReportGenerateRequest } from '@/types';
import { mockDb } from './mockDb';

export const reportsApi = {
  /**
   * Generate a report
   */
  generate: async (scanId: number, data?: ReportGenerateRequest): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDb.getReport(scanId);
  },

  /**
   * Get report info
   */
  get: async (scanId: number): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.getReport(scanId);
  },

  /**
   * Get report download URL
   */
  getDownloadUrl: (scanId: number): string => {
    return '/sample_report.pdf';
  },

  /**
   * Download report
   */
  download: async (scanId: number): Promise<Blob> => {
    // Fetch the pre-baked presentation PDF from our public directory
    const response = await fetch('/sample_report.pdf');
    if (!response.ok) {
      throw new Error('Failed to download presentation report');
    }
    return await response.blob();
  },

  /**
   * Regenerate report
   */
  regenerate: async (scanId: number, data?: ReportGenerateRequest): Promise<Report> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return mockDb.getReport(scanId);
  },

  /**
   * Delete report
   */
  delete: async (scanId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
  },

  /**
   * List all reports
   */
  list: async (skip: number = 0, limit: number = 20): Promise<Report[]> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    const scans = mockDb.getScans().filter(s => s.status === 'COMPLETED');
    return scans.map(s => mockDb.getReport(s.id));
  },
};