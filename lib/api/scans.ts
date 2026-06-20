/**
 * Mock Scans API for Presentation Mode
 */

import { Scan, ScanDetail, ScanCreateRequest, ScanListResponse, Endpoint } from '@/types';
import { mockDb } from './mockDb';

export const scansApi = {
  /**
   * Create a new scan
   */
  create: async (data: ScanCreateRequest): Promise<Scan> => {
    // Delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 600));
    
    const newScan = mockDb.createScan(data.domains, data.name, data.description);
    return newScan;
  },

  /**
   * Get list of scans
   */
  list: async (page: number = 1, pageSize: number = 20): Promise<ScanListResponse> => {
    // Delay to simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const scans = mockDb.getScans();
    const startIndex = (page - 1) * pageSize;
    const items = scans.slice(startIndex, startIndex + pageSize);
    
    return {
      items,
      total: scans.length,
      page,
      page_size: pageSize,
      pages: Math.ceil(scans.length / pageSize),
    };
  },

  /**
   * Get scan by ID
   */
  get: async (scanId: number): Promise<ScanDetail> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const scan = mockDb.getScanById(scanId);
    if (!scan) {
      throw new Error(`Scan ${scanId} not found`);
    }

    const endpoints = mockDb.getEndpointsForScan(scanId);

    const duration_seconds = (scan.completed_at && scan.started_at)
      ? Math.round((new Date(scan.completed_at).getTime() - new Date(scan.started_at).getTime()) / 1000)
      : 0;

    return {
      ...scan,
      endpoints,
      duration_seconds,
    };
  },

  /**
   * Get scan status
   */
  getStatus: async (scanId: number): Promise<Scan> => {
    const scan = mockDb.getScanById(scanId);
    if (!scan) {
      throw new Error(`Scan ${scanId} not found`);
    }
    return scan;
  },

  /**
   * Cancel a scan
   */
  cancel: async (scanId: number): Promise<Scan> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const scans = mockDb.getScans();
    const index = scans.findIndex(s => s.id === scanId);
    if (index >= 0) {
      scans[index].status = 'CANCELLED';
      localStorage.setItem('pqc_scans', JSON.stringify(scans));
      return scans[index];
    }
    throw new Error(`Scan ${scanId} not found`);
  },

  /**
   * Delete a scan
   */
  delete: async (scanId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    mockDb.deleteScan(scanId);
  },

  /**
   * Get endpoint details
   */
  getEndpoint: async (scanId: number, endpointId: number): Promise<Endpoint> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const endpoints = mockDb.getEndpointsForScan(scanId);
    const endpoint = endpoints.find(e => e.id === endpointId);
    if (!endpoint) {
      throw new Error(`Endpoint ${endpointId} not found`);
    }
    return endpoint;
  },

  /**
   * Rescan an endpoint
   */
  rescanEndpoint: async (scanId: number, endpointId: number): Promise<Endpoint> => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const endpoints = mockDb.getEndpointsForScan(scanId);
    const index = endpoints.findIndex(e => e.id === endpointId);
    if (index >= 0) {
      // Toggle state to completed/fail or make it completed
      endpoints[index].status = 'COMPLETED';
      endpoints[index].scanned_at = new Date().toISOString();
      const map = mockDb.getEndpointsMap();
      map[scanId] = endpoints;
      localStorage.setItem('pqc_endpoints', JSON.stringify(map));
      return endpoints[index];
    }
    throw new Error(`Endpoint ${endpointId} not found`);
  },
};