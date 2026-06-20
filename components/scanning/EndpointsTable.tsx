'use client';

import React, { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  formatDateTime,
  getStatusColor,
  getStatusBgColor,
  getStatusLabel,
  truncateText,
} from '@/lib/utils';
import { Endpoint, ScanStatus, VulnerabilityStatus } from '@/types';

interface EndpointsTableProps {
  endpoints: Endpoint[];
}

export function EndpointsTable({ endpoints }: EndpointsTableProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getStatusIcon = (status: ScanStatus) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      case 'PENDING':
      case 'IN_PROGRESS':
        return <Clock className="h-4 w-4 text-amber-500" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getVulnerabilityBadge = (status: VulnerabilityStatus | null | undefined) => {
    if (!status) return null;
    
    const colors: Record<VulnerabilityStatus, string> = {
      QUANTUM_BROKEN: 'bg-red-500/10 text-red-500 border-red-500/25',
      QUANTUM_VULNERABLE: 'bg-orange-500/10 text-orange-500 border-orange-500/25',
      QUANTUM_RESISTANT: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
      UNKNOWN: 'bg-muted text-muted-foreground border-muted-foreground/20',
    };

    return (
      <Badge className={`${colors[status]} border text-xs font-semibold rounded-full px-2.5 py-0.5`}>
        {getStatusLabel(status)}
      </Badge>
    );
  };

  if (endpoints.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No endpoints to display
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-border/80 bg-card">
      <table className="min-w-full divide-y divide-border/60">
        <thead className="bg-muted/40">
          <tr>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Endpoint
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Status
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              TLS Version
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Key Exchange
            </th>
            <th className="px-5 py-3.5 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Cipher
            </th>
            <th className="px-5 py-3.5 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Details
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50 bg-card">
          {endpoints.map((endpoint) => (
            <React.Fragment key={endpoint.id}>
              <tr className="hover:bg-accent/30 transition-colors duration-150 group">
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(endpoint.status)}
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {endpoint.domain}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Port {endpoint.port}
                        {endpoint.ip_address && ` • ${endpoint.ip_address}`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <Badge
                    className={
                      endpoint.status === 'COMPLETED'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25 px-2.5 py-0.5 text-xs font-semibold rounded-full'
                        : endpoint.status === 'FAILED'
                        ? 'bg-destructive/10 text-destructive border border-destructive/25 px-2.5 py-0.5 text-xs font-semibold rounded-full'
                        : 'bg-muted text-muted-foreground border border-muted-foreground/20 px-2.5 py-0.5 text-xs font-semibold rounded-full'
                    }
                  >
                    {endpoint.status}
                  </Badge>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-sm text-foreground font-medium">
                  {endpoint.tls_version || '-'}
                </td>
                <td className="px-5 py-4 whitespace-nowrap">
                  <div className="text-sm text-foreground font-medium">
                    {endpoint.key_exchange || '-'}
                  </div>
                  {endpoint.key_exchange && (
                    <div className="text-[10px] text-destructive font-semibold flex items-center gap-1 mt-0.5">
                      <AlertTriangle className="h-3 w-3" />
                      Quantum Vulnerable
                    </div>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="text-sm text-foreground/80 max-w-xs truncate font-mono text-xs">
                    {endpoint.cipher_suite
                      ? truncateText(endpoint.cipher_suite, 30)
                      : '-'}
                  </div>
                </td>
                <td className="px-5 py-4 whitespace-nowrap text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-primary group-hover:bg-primary/5 transition-all"
                    onClick={() => toggleExpand(endpoint.id)}
                  >
                    {expandedId === endpoint.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                </td>
              </tr>

              {/* Expanded details */}
              {expandedId === endpoint.id && (
                <tr className="bg-muted/20">
                  <td colSpan={6} className="px-6 py-5 border-t border-b border-border/40">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-5 text-sm">
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Cipher Suite</div>
                        <div className="text-foreground font-mono text-xs mt-1.5 break-all max-w-xs">
                          {endpoint.cipher_suite || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Key Size</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.key_size ? `${endpoint.key_size} bits` : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Signature Algorithm</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.signature_algorithm || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hash Algorithm</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.hash_algorithm || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Certificate Issuer</div>
                        <div className="text-foreground font-medium mt-1.5 break-all max-w-xs">
                          {endpoint.certificate_issuer || 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Certificate Expiry</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.certificate_expiry
                            ? formatDateTime(endpoint.certificate_expiry)
                            : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scan Duration</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.scan_duration_ms
                            ? `${endpoint.scan_duration_ms}ms`
                            : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Scanned At</div>
                        <div className="text-foreground font-medium mt-1.5">
                          {endpoint.scanned_at
                            ? formatDateTime(endpoint.scanned_at)
                            : 'N/A'}
                        </div>
                      </div>
                      {endpoint.error_message && (
                        <div className="col-span-4 mt-2">
                          <div className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Error Details</div>
                          <div className="text-destructive bg-destructive/10 border border-destructive/20 p-3.5 rounded-xl font-medium text-xs">
                            {endpoint.error_message}
                          </div>
                        </div>
                      )}
                      {endpoint.supported_protocols && endpoint.supported_protocols.length > 0 && (
                        <div className="col-span-4 mt-2">
                          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            Supported Protocols
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {endpoint.supported_protocols.map((proto, i) => (
                              <Badge key={i} variant="outline" className="border-border/85 bg-card/50">
                                {proto}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}