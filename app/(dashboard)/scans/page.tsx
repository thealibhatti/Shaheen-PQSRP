'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { scansApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanTable } from '@/components/scanning/ScanTable';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ScansPage() {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['scans', page, pageSize],
    queryFn: () => scansApi.list(page, pageSize),
  });

  const scans = data?.items || [];
  const totalPages = data?.pages || 1;

  // Filter scans by status (client-side for simplicity)
  const filteredScans = statusFilter === 'all' 
    ? scans 
    : scans.filter(s => s.status === statusFilter);

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
            Scans
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage and view your TLS vulnerability scans
          </p>
        </div>
        <Link href="/scans/new">
          <Button className="h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20 px-6">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300">
        <CardContent className="py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
              <Input
                placeholder="Search scans..."
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] h-11 rounded-xl border border-slate-200 dark:border-white/10 bg-white/70 dark:bg-slate-950/60 text-slate-800 dark:text-slate-200 focus:ring-red-500">
                <Filter className="h-4 w-4 mr-2 text-slate-400 dark:text-slate-500" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="FAILED">Failed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Scans table */}
      <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>All Scans</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground animate-pulse">
              Loading scans...
            </div>
          ) : isError ? (
            <div className="text-center py-12 text-destructive font-medium">
              Failed to load scans. Please try again.
            </div>
          ) : filteredScans.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No scans found</p>
              <Link href="/scans/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Scan
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <ScanTable scans={filteredScans} />
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/60">
                  <p className="text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}