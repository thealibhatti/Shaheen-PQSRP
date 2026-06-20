/**
 * Mock Database Layer for Presentation Mode
 * Simulates a PostgreSQL database in localStorage.
 */

import { Scan, ScanDetail, Endpoint, RiskScore, RiskAssessment, Report, User } from '@/types';
import { AdminUser, AdminScan, SystemStats } from './admin';

// Helper to check if window is defined
const isClient = typeof window !== 'undefined';

const INITIAL_USERS: User[] = [
  {
    id: 1,
    email: 'sarmad@shaheenshield.com',
    full_name: 'Sarmad Abbas',
    organization_name: 'Shaheen Shield',
    is_active: true,
    is_superuser: true,
    is_verified: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
  },
  {
    id: 2,
    email: 'ali@example.com',
    full_name: 'Ali Iftikhar Bhatti',
    organization_name: 'University of Engineering',
    is_active: true,
    is_superuser: false,
    is_verified: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    last_login: new Date().toISOString(),
  }
];

// Initial Mock Scans
const INITIAL_SCANS: Scan[] = [
  {
    id: 1,
    name: 'ShaheenShield Core Audit',
    description: 'Security audit for primary corporate portal',
    status: 'COMPLETED',
    total_endpoints: 1,
    scanned_endpoints: 1,
    failed_endpoints: 0,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4200).toISOString(),
    error_message: null,
    progress_percentage: 100,
  },
  {
    id: 2,
    name: 'Google Infrastructure Check',
    description: 'TLS 1.3 and Post-Quantum Cryptography test',
    status: 'COMPLETED',
    total_endpoints: 1,
    scanned_endpoints: 1,
    failed_endpoints: 0,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    started_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000 + 3800).toISOString(),
    error_message: null,
    progress_percentage: 100,
  },
  {
    id: 3,
    name: 'GitHub Webhooks Verification',
    description: 'Verification scan of webhook endpoints',
    status: 'COMPLETED',
    total_endpoints: 1,
    scanned_endpoints: 1,
    failed_endpoints: 0,
    created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    started_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completed_at: new Date(Date.now() - 4 * 60 * 60 * 1000 + 5100).toISOString(),
    error_message: null,
    progress_percentage: 100,
  }
];

// Initial Endpoints
const MOCK_ENDPOINTS: Record<number, Endpoint[]> = {
  1: [
    {
      id: 101,
      domain: 'shaheenshield.com',
      port: 443,
      status: 'COMPLETED',
      ip_address: '66.29.146.194',
      tls_version: 'TLS 1.3',
      cipher_suite: 'TLS_AES_256_GCM_SHA384',
      key_exchange: 'ECDHE',
      key_size: 2048,
      signature_algorithm: 'SHA256',
      hash_algorithm: 'SHA384',
      certificate_issuer: 'C=GB, O=Sectigo Limited, CN=Sectigo Public Server Authentication CA DV R36',
      certificate_subject: 'CN=shaheenshield.com',
      certificate_expiry: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), // 120 days from now
      certificate_serial: '3200928304928340283048203',
      certificate_version: '3',
      supported_protocols: ['TLS 1.2', 'TLS 1.3'],
      supported_ciphers: ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256', 'ECDHE-RSA-AES256-GCM-SHA384'],
      has_weak_ciphers: 0,
      scanned_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      scan_duration_ms: 2450,
      error_message: null,
      raw_output: `CONNECTED(00000003)
---
Certificate chain
 0 s:CN = shaheenshield.com
   i:C = GB, O = Sectigo Limited, CN = Sectigo Public Server Authentication CA DV R36
   a:PKEY: rsaEncryption, 2048 (sha256WithRSAEncryption)
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 2048 bit
Secure Renegotiation IS NOT supported
Compression: NONE
Expansion: NONE
No ALPN negotiated
Early data was not sent
Verify return code: 0 (ok)
---
`
    }
  ],
  2: [
    {
      id: 102,
      domain: 'google.com',
      port: 443,
      status: 'COMPLETED',
      ip_address: '142.250.180.14',
      tls_version: 'TLS 1.3',
      cipher_suite: 'TLS_AES_128_GCM_SHA256',
      key_exchange: 'ECDHE',
      key_size: 256,
      signature_algorithm: 'ECDSA',
      hash_algorithm: 'SHA256',
      certificate_issuer: 'C=US, O=Google Trust Services, CN=GTS CA 1C3',
      certificate_subject: 'CN=*.google.com',
      certificate_expiry: new Date(Date.now() + 82 * 24 * 60 * 60 * 1000).toISOString(),
      certificate_serial: '99201928301928301',
      certificate_version: '3',
      supported_protocols: ['TLS 1.2', 'TLS 1.3'],
      supported_ciphers: ['TLS_AES_128_GCM_SHA256', 'ECDHE-ECDSA-AES128-GCM-SHA256'],
      has_weak_ciphers: 0,
      scanned_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      scan_duration_ms: 1820,
      error_message: null,
      raw_output: `CONNECTED(00000003)
---
Certificate chain
 0 s:CN = *.google.com
   i:C = US, O = Google Trust Services, CN = GTS CA 1C3
   a:PKEY: id-ecPublicKey, 256 (ecdsa-with-SHA256)
---
New, TLSv1.3, Cipher is TLS_AES_128_GCM_SHA256
Server public key is 256 bit (ECDSA)
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
ALPN negotiated: h2
Verify return code: 0 (ok)
---
`
    }
  ],
  3: [
    {
      id: 103,
      domain: 'github.com',
      port: 443,
      status: 'COMPLETED',
      ip_address: '140.82.121.4',
      tls_version: 'TLS 1.3',
      cipher_suite: 'TLS_AES_256_GCM_SHA384',
      key_exchange: 'ECDHE',
      key_size: 256,
      signature_algorithm: 'ECDSA',
      hash_algorithm: 'SHA384',
      certificate_issuer: 'C=US, O=DigiCert Inc, CN=DigiCert TLS Hybrid ECC SHA384 2020 CA1',
      certificate_subject: 'CN=github.com',
      certificate_expiry: new Date(Date.now() + 290 * 24 * 60 * 60 * 1000).toISOString(),
      certificate_serial: '081290381029302193',
      certificate_version: '3',
      supported_protocols: ['TLS 1.2', 'TLS 1.3'],
      supported_ciphers: ['TLS_AES_256_GCM_SHA384', 'ECDHE-ECDSA-AES256-GCM-SHA384'],
      has_weak_ciphers: 0,
      scanned_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      scan_duration_ms: 2980,
      error_message: null,
      raw_output: `CONNECTED(00000003)
---
Certificate chain
 0 s:CN = github.com
   i:C = US, O = DigiCert Inc, CN = DigiCert TLS Hybrid ECC SHA384 2020 CA1
   a:PKEY: id-ecPublicKey, 256 (ecdsa-with-SHA384)
---
New, TLSv1.3, Cipher is TLS_AES_256_GCM_SHA384
Server public key is 256 bit (ECDSA)
Secure Renegotiation IS supported
Compression: NONE
Expansion: NONE
Verify return code: 0 (ok)
---
`
    }
  ]
};

// Initialize Database in LocalStorage
export function initMockDb() {
  if (!isClient) return;

  if (!localStorage.getItem('pqc_users')) {
    localStorage.setItem('pqc_users', JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem('pqc_scans')) {
    localStorage.setItem('pqc_scans', JSON.stringify(INITIAL_SCANS));
  }
  if (!localStorage.getItem('pqc_endpoints')) {
    localStorage.setItem('pqc_endpoints', JSON.stringify(MOCK_ENDPOINTS));
  }
}

// Ensure DB is initialized
initMockDb();

// ----------------------------------------------------
// DATABASE SERVICES IMPLEMENTATIONS
// ----------------------------------------------------

export const mockDb = {
  // --- USERS TABLE ---
  getUsers: (): User[] => {
    if (!isClient) return INITIAL_USERS;
    return JSON.parse(localStorage.getItem('pqc_users') || '[]');
  },

  saveUser: (user: User) => {
    if (!isClient) return;
    const users = mockDb.getUsers();
    const index = users.findIndex(u => u.id === user.id);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    localStorage.setItem('pqc_users', JSON.stringify(users));
  },

  // --- SCANS TABLE ---
  getScans: (): Scan[] => {
    if (!isClient) return INITIAL_SCANS;
    const scans = JSON.parse(localStorage.getItem('pqc_scans') || '[]');
    
    // Simulate real-time progress updates based on time elapsed!
    let updated = false;
    const now = Date.now();
    const processedScans = scans.map((scan: Scan) => {
      if (scan.status === 'PENDING' || scan.status === 'IN_PROGRESS') {
        const createdTime = new Date(scan.created_at).getTime();
        const diffSeconds = (now - createdTime) / 1000;
        
        if (diffSeconds > 10) {
          // Complete the scan!
          scan.status = 'COMPLETED';
          scan.completed_at = new Date().toISOString();
          scan.scanned_endpoints = scan.total_endpoints;
          scan.progress_percentage = 100;
          
          // Generate mock endpoints for it
          mockDb.generateEndpointsForScan(scan.id);
          updated = true;
        } else if (diffSeconds > 3 && scan.status === 'PENDING') {
          // Transition to In Progress
          scan.status = 'IN_PROGRESS';
          scan.started_at = new Date().toISOString();
          scan.progress_percentage = 30;
          updated = true;
        } else if (scan.status === 'IN_PROGRESS') {
          scan.progress_percentage = Math.min(99, Math.floor((diffSeconds / 10) * 100));
        }
      }
      return scan;
    });

    if (updated) {
      localStorage.setItem('pqc_scans', JSON.stringify(processedScans));
    }
    
    // Sort scans by ID descending
    return processedScans.sort((a: Scan, b: Scan) => b.id - a.id);
  },

  getScanById: (id: number): Scan | null => {
    const scans = mockDb.getScans();
    return scans.find(s => s.id === id) || null;
  },

  createScan: (domains: string[], name?: string, description?: string): Scan => {
    const scans = mockDb.getScans();
    const newId = scans.length > 0 ? Math.max(...scans.map(s => s.id)) + 1 : 1;
    
    const newScan: Scan = {
      id: newId,
      name: name || `Scan for ${domains[0]}` + (domains.length > 1 ? ` and ${domains.length - 1} others` : ''),
      description: description || 'Asynchronous quantum safety check',
      status: 'PENDING',
      total_endpoints: domains.length,
      scanned_endpoints: 0,
      failed_endpoints: 0,
      created_at: new Date().toISOString(),
      started_at: null,
      completed_at: null,
      error_message: null,
      progress_percentage: 0,
    };

    scans.push(newScan);
    if (isClient) {
      localStorage.setItem('pqc_scans', JSON.stringify(scans));
      
      // Store raw domains to create endpoints later when completed
      localStorage.setItem(`pqc_raw_domains_${newId}`, JSON.stringify(domains));
    }

    return newScan;
  },

  deleteScan: (id: number) => {
    if (!isClient) return;
    const scans = mockDb.getScans().filter(s => s.id !== id);
    localStorage.setItem('pqc_scans', JSON.stringify(scans));
  },

  // --- ENDPOINTS TABLE ---
  getEndpointsMap: (): Record<number, Endpoint[]> => {
    if (!isClient) return MOCK_ENDPOINTS;
    return JSON.parse(localStorage.getItem('pqc_endpoints') || '{}');
  },

  getEndpointsForScan: (scanId: number): Endpoint[] => {
    const map = mockDb.getEndpointsMap();
    return map[scanId] || [];
  },

  generateEndpointsForScan: (scanId: number) => {
    if (!isClient) return;
    const map = mockDb.getEndpointsMap();
    
    // Check if endpoints already exist
    if (map[scanId]) return;

    // Get original domains
    const domainsStr = localStorage.getItem(`pqc_raw_domains_${scanId}`);
    const domains: string[] = domainsStr ? JSON.parse(domainsStr) : ['target.com'];

    const newEndpoints: Endpoint[] = domains.map((domain, index) => {
      // Pick a random realistic config based on domain
      const isWeak = domain.includes('weak') || domain.includes('expired');
      const isbroken = domain.includes('broken');
      
      return {
        id: scanId * 1000 + index,
        domain: domain,
        port: 443,
        status: isWeak ? 'FAILED' : 'COMPLETED',
        ip_address: '104.22.4.218',
        tls_version: isWeak ? 'TLS 1.0' : 'TLS 1.3',
        cipher_suite: isWeak ? 'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA' : 'TLS_AES_256_GCM_SHA384',
        key_exchange: isWeak ? 'RSA' : 'ECDHE',
        key_size: isWeak ? 1024 : 2048,
        signature_algorithm: isWeak ? 'SHA1' : 'SHA256',
        hash_algorithm: isWeak ? 'SHA1' : 'SHA384',
        certificate_issuer: isWeak 
          ? 'C=US, O=Let\'s Encrypt, CN=R3' 
          : 'C=US, O=DigiCert Inc, CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1',
        certificate_subject: `CN=${domain}`,
        certificate_expiry: isWeak 
          ? new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // expired 5 days ago
          : new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        certificate_serial: Math.floor(Math.random() * 100000000).toString(),
        certificate_version: '3',
        supported_protocols: isWeak ? ['TLS 1.0', 'TLS 1.1'] : ['TLS 1.2', 'TLS 1.3'],
        supported_ciphers: isWeak ? ['TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA'] : ['TLS_AES_256_GCM_SHA384', 'TLS_CHACHA20_POLY1305_SHA256'],
        has_weak_ciphers: isWeak ? 1 : 0,
        scanned_at: new Date().toISOString(),
        scan_duration_ms: 1500 + Math.floor(Math.random() * 2000),
        error_message: isWeak ? 'Weak TLS version detected. Certificate has expired.' : null,
        raw_output: `CONNECTED(00000003)
---
Certificate chain
 0 s:CN = ${domain}
   i:C = US, O = DigiCert Inc, CN = DigiCert Global G2 TLS RSA SHA256 2020 CA1
   a:PKEY: rsaEncryption, ${isWeak ? '1024' : '2048'} bit
---
New, ${isWeak ? 'TLSv1.0' : 'TLSv1.3'}, Cipher is ${isWeak ? 'TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA' : 'TLS_AES_256_GCM_SHA384'}
Verify return code: ${isWeak ? '10 (certificate has expired)' : '0 (ok)'}
---
`
      };
    });

    map[scanId] = newEndpoints;
    localStorage.setItem('pqc_endpoints', JSON.stringify(map));
    localStorage.removeItem(`pqc_raw_domains_${scanId}`); // Clean up
  },

  // --- RISK ASSESSMENT LAYER ---
  getRiskScore: (scanId: number): RiskScore => {
    const endpoints = mockDb.getEndpointsForScan(scanId);
    
    if (endpoints.length === 0) {
      return {
        id: Math.floor(Math.random() * 1000),
        scan_id: scanId,
        overall_score: 0,
        risk_level: 'LOW',
        vulnerable_endpoints: 0,
        total_endpoints: 0,
        vulnerability_percentage: 0,
        breakdown: {
          key_exchange: 0,
          signature: 0,
          cipher: 0,
          hash: 0,
          tls_version: 0,
        },
        summary: 'No endpoints scanned yet.',
        recommendations: [],
        created_at: new Date().toISOString(),
        level: 'LOW',
        status: 'UNKNOWN',
      } as any;
    }

    const hasFailed = endpoints.some(e => e.status === 'FAILED');
    const hasTls13 = endpoints.some(e => e.tls_version === 'TLS 1.3');

    let overall_score = 15; // default low risk
    let level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let status: 'QUANTUM_RESISTANT' | 'QUANTUM_VULNERABLE' | 'QUANTUM_BROKEN' | 'UNKNOWN' = 'QUANTUM_RESISTANT';

    if (hasFailed) {
      overall_score = 88;
      level = 'CRITICAL';
      status = 'QUANTUM_BROKEN';
    } else if (!hasTls13) {
      overall_score = 55;
      level = 'MEDIUM';
      status = 'QUANTUM_VULNERABLE';
    }

    const vulnerable_endpoints = hasFailed ? 1 : 0;
    const total_endpoints = endpoints.length;
    const vulnerability_percentage = total_endpoints > 0 ? (vulnerable_endpoints / total_endpoints) * 100 : 0;

    const breakdown = {
      key_exchange: hasFailed ? 90 : 10,
      signature: hasFailed ? 80 : 15,
      cipher: hasFailed ? 70 : 12,
      hash: hasFailed ? 60 : 10,
      tls_version: hasTls13 ? 10 : 60,
    };

    const summary = hasFailed 
      ? 'Critical post-quantum vulnerabilities detected. Legacy protocols, expired certificates, or weak keys need immediate remediation.'
      : !hasTls13
        ? 'Moderate post-quantum vulnerabilities detected. Consider upgrading legacy TLS protocol configurations.'
        : 'All scanned endpoints are quantum-safe. The system is using robust cryptographic algorithms.';

    const recommendations = hasFailed
      ? [
          'Renew the SSL certificate immediately.',
          'Disable TLS 1.0 and TLS 1.1 in web server configuration. Enable TLS 1.2 and TLS 1.3.',
          'Upgrade keys to 2048-bit RSA or 256-bit ECDSA.'
        ]
      : !hasTls13
        ? [
            'Disable legacy TLS versions.',
            'Upgrade to TLS 1.3 preferred suites.'
          ]
        : [
            'Maintain current settings.',
            'Monitor new post-quantum standard announcements.'
          ];

    return {
      id: scanId + 1000,
      scan_id: scanId,
      overall_score,
      risk_level: level,
      vulnerable_endpoints,
      total_endpoints,
      vulnerability_percentage,
      breakdown,
      summary,
      recommendations,
      created_at: new Date().toISOString(),
      level,
      status,
    } as any;
  },

  getFullAssessment: (scanId: number): RiskAssessment => {
    const score = mockDb.getRiskScore(scanId);
    const endpoints = mockDb.getEndpointsForScan(scanId);
    
    const endpointRisks = endpoints.map(e => {
      const isWeak = e.status === 'FAILED';
      return {
        endpoint_id: e.id,
        domain: e.domain,
        risk_score: isWeak ? 85 : 12,
        risk_level: isWeak ? 'HIGH' : 'LOW' as any,
        status: isWeak ? 'QUANTUM_VULNERABLE' : 'QUANTUM_RESISTANT' as any,
        vulnerabilities: isWeak ? [
          'Expired Certificate: The TLS certificate for this endpoint is expired.',
          'Legacy Protocol: TLS 1.0 is deprecated and vulnerable to POODLE attacks.',
          'RSA Key Size: 1024-bit RSA key is weak and vulnerable to quantum factorisation.'
        ] : [],
        recommendations: isWeak ? [
          'Renew the SSL certificate immediately.',
          'Disable TLS 1.0 and TLS 1.1 in web server configuration. Enable TLS 1.2 and TLS 1.3.',
          'Upgrade keys to 2048-bit RSA or 256-bit ECDSA.'
        ] : []
      };
    });

    return {
      scan_id: scanId,
      overall_score: score.overall_score,
      overall_level: score.level,
      status: score.status,
      assessed_at: new Date().toISOString(),
      endpoints: endpointRisks,
    } as any;
  },

  // --- REPORTS LAYER ---
  getReport: (scanId: number): Report => {
    const scan = mockDb.getScanById(scanId);
    return {
      id: scanId * 10,
      scan_id: scanId,
      status: 'COMPLETED',
      file_name: `shaheenshield_report_scan_${scanId}.pdf`,
      file_size: 154820,
      report_type: 'full',
      error_message: null,
      created_at: scan?.completed_at || new Date().toISOString(),
      updated_at: scan?.completed_at || new Date().toISOString(),
    };
  },

  // --- ADMIN SYSTEMS ---
  getStats: (): SystemStats => {
    const users = mockDb.getUsers();
    const scans = mockDb.getScans();
    const endpointsMap = mockDb.getEndpointsMap();
    let totalEndpoints = 0;
    Object.values(endpointsMap).forEach(arr => {
      totalEndpoints += arr.length;
    });

    const completed = scans.filter(s => s.status === 'COMPLETED').length;
    const progress = scans.filter(s => s.status === 'PENDING' || s.status === 'IN_PROGRESS').length;
    const failed = scans.filter(s => s.status === 'FAILED').length;

    return {
      total_users: users.length,
      active_users: users.filter(u => u.is_active).length,
      total_scans: scans.length,
      completed_scans: completed,
      failed_scans: failed,
      in_progress_scans: progress,
      total_endpoints: totalEndpoints || scans.reduce((acc, s) => acc + s.total_endpoints, 0),
      scans_by_status: {
        COMPLETED: completed,
        FAILED: failed,
        PENDING: scans.filter(s => s.status === 'PENDING').length,
        IN_PROGRESS: scans.filter(s => s.status === 'IN_PROGRESS').length,
      },
      recent_signups: users.length,
    };
  }
};
