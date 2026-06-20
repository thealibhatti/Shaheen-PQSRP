/**
 * TypeScript type definitions for ShaheenShield frontend
 */

// ============================================
// Auth Types
// ============================================

export interface User {
  id: number;
  email: string;
  full_name: string | null;
  organization_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  confirm_password: string;
  full_name?: string;
  organization_name?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

// ============================================
// Scan Types
// ============================================

export type ScanStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface ScanCreateRequest {
  domains: string[];
  name?: string;
  description?: string;
}

export interface Scan {
  id: number;
  name: string | null;
  description: string | null;
  status: ScanStatus;
  total_endpoints: number;
  scanned_endpoints: number;
  failed_endpoints: number;
  progress_percentage: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
}

export interface Endpoint {
  id: number;
  domain: string;
  port: number;
  ip_address: string | null;
  status: ScanStatus;
  tls_version: string | null;
  cipher_suite: string | null;
  key_exchange: string | null;
  key_size: number | null;
  signature_algorithm: string | null;
  hash_algorithm: string | null;
  certificate_issuer: string | null;
  certificate_subject: string | null;
  certificate_expiry: string | null;
  certificate_serial?: string | null;
  certificate_version?: string | null;
  supported_protocols: string[] | null;
  supported_ciphers?: string[] | null;
  has_weak_ciphers: number;
  scanned_at: string | null;
  scan_duration_ms: number | null;
  error_message: string | null;
  raw_output?: string | null;
}

export interface ScanDetail extends Scan {
  endpoints: Endpoint[];
  duration_seconds: number;
}

export interface ScanListResponse {
  items: Scan[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

// ============================================
// Risk Types
// ============================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type VulnerabilityStatus = 'QUANTUM_BROKEN' | 'QUANTUM_VULNERABLE' | 'QUANTUM_RESISTANT' | 'UNKNOWN';

export interface RiskBreakdown {
  key_exchange: number;
  signature: number;
  cipher: number;
  hash: number;
  tls_version: number;
}

export interface RiskScore {
  id: number;
  scan_id: number;
  overall_score: number;
  risk_level: RiskLevel;
  vulnerable_endpoints: number;
  total_endpoints: number;
  vulnerability_percentage: number;
  breakdown: RiskBreakdown;
  summary: string | null;
  recommendations: string[];
  created_at: string;
  level?: string;
  status?: string;
}

export interface ComponentRisk {
  component: string;
  value: string | null;
  status: VulnerabilityStatus;
  score: number;
  reason: string | null;
  recommendation: string | null;
}

export interface EndpointRisk {
  id: number;
  endpoint_id: number;
  risk_score: number;
  risk_level: RiskLevel;
  key_exchange_status: VulnerabilityStatus | null;
  signature_status: VulnerabilityStatus | null;
  cipher_status: VulnerabilityStatus | null;
  hash_status: VulnerabilityStatus | null;
  tls_status: VulnerabilityStatus | null;
  findings: string[];
  recommendations: string[];
  domain: string;
  port: number;
  tls_version: string | null;
  cipher_suite: string | null;
  key_exchange: string | null;
  components: ComponentRisk[];
}

export interface RiskAssessment {
  scan_id: number;
  overall: RiskScore;
  endpoints: EndpointRisk[];
  statistics: Record<string, any>;
}

// ============================================
// Report Types
// ============================================

export type ReportStatus = 'PENDING' | 'GENERATING' | 'COMPLETED' | 'FAILED';

export interface Report {
  id: number;
  scan_id: number;
  status: ReportStatus;
  file_name: string | null;
  file_size: number | null;
  report_type: string;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface ReportGenerateRequest {
  report_type?: 'full' | 'executive' | 'technical';
  include_raw_data?: boolean;
}

// ============================================
// API Response Types
// ============================================

export interface ApiError {
  error: string;
  message: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
}