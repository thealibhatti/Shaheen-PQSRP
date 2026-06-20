/**
 * Mock Risk API for Presentation Mode
 */

import { RiskScore, RiskAssessment, EndpointRisk } from '@/types';
import { mockDb } from './mockDb';

export const riskApi = {
  /**
   * Get risk score for a scan
   */
  getScore: async (scanId: number): Promise<RiskScore> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return mockDb.getRiskScore(scanId);
  },

  /**
   * Trigger risk assessment
   */
  assess: async (scanId: number): Promise<RiskScore> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockDb.getRiskScore(scanId);
  },

  /**
   * Reassess risk (recalculate)
   */
  reassess: async (scanId: number): Promise<RiskScore> => {
    await new Promise((resolve) => setTimeout(resolve, 600));
    return mockDb.getRiskScore(scanId);
  },

  /**
   * Get full risk assessment
   */
  getFullAssessment: async (scanId: number): Promise<RiskAssessment> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.getFullAssessment(scanId);
  },

  /**
   * Get endpoint risk
   */
  getEndpointRisk: async (endpointId: number): Promise<EndpointRisk> => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return {
      endpoint_id: endpointId,
      risk_score: 15,
      risk_level: 'LOW',
      status: 'QUANTUM_RESISTANT',
      vulnerabilities: [],
      recommendations: [],
    } as any;
  },
};