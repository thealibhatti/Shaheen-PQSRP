'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ShieldAlert,
  Search,
  Loader2,
  ExternalLink,
  User,
  Clock,
  Globe,
  Filter,
} from 'lucide-react';
import Link from 'next/link';
import { adminApi, AdminScan } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/25',
  IN_PROGRESS: 'bg-red-500/10 text-red-500 border-red-500/25',
  COMPLETED: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/25',
  FAILED: 'bg-red-500/10 text-red-500 border-red-500/25',
  CANCELLED: 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-white/10',
};

const STATUS_OPTIONS = ['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED'];

export default function AdminScansPage() {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const { data: scans, isLoading } = useQuery({
    queryKey: ['admin-scans', statusFilter],
    queryFn: () =>
      adminApi.listScans(0, 200, statusFilter === 'ALL' ? undefined : statusFilter),
  });

  const filteredScans = (scans || []).filter(
    (s) =>
      (s.name && s.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.user_email && s.user_email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.user_full_name &&
        s.user_full_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <ShieldAlert className="h-8 w-8 text-amber-500" />
            All Scans
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage scans across all users
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 shrink-0">
          <Globe className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-500">
            {scans?.length || 0} Scans
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
          <Input
            type="text"
            placeholder="Search by scan name or user..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 focus-visible:ring-amber-500"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">Filter:</span>
          {STATUS_OPTIONS.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                statusFilter === st
                  ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-white/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Scans Table */}
      {isLoading ? (
        <div className="text-center py-20 animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-semibold">Loading scans...</p>
        </div>
      ) : filteredScans.length === 0 ? (
        <Card className="glass-card shadow-lg">
          <CardContent className="text-center py-16">
            <ShieldAlert className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 opacity-40" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No scans found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white/50 dark:bg-slate-900/30 backdrop-blur-md shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200/50 dark:divide-white/[0.05]">
              <thead className="bg-slate-50 dark:bg-slate-950/40">
                <tr>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Scan Name
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Endpoints
                  </th>
                  <th className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/40 dark:divide-white/[0.05] bg-transparent">
                {filteredScans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-slate-100/50 dark:hover:bg-white/[0.02] transition-colors duration-150 group">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white text-sm">
                          {scan.name || `Scan #${scan.id}`}
                        </p>
                        {scan.description && (
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate max-w-[200px]">
                            {scan.description}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                          {(scan.user_full_name || scan.user_email || '?')[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            {scan.user_full_name || 'N/A'}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">{scan.user_email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          STATUS_COLORS[scan.status] || STATUS_COLORS.PENDING
                        }`}
                      >
                        {scan.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white font-medium">
                      {scan.scanned_endpoints} <span className="text-slate-400 dark:text-slate-500">/</span> {scan.total_endpoints}
                      {scan.failed_endpoints > 0 && (
                        <span className="text-red-500 font-semibold ml-1.5">
                          ({scan.failed_endpoints} failed)
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        {new Date(scan.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Link href={`/scans/${scan.id}`}>
                        <Button variant="outline" size="sm" className="h-9 px-4 rounded-lg border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-slate-900/30 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-600 dark:text-slate-300">
                          <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                          View
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
