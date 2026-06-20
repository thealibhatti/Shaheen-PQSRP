'use client';

import { useQuery } from '@tanstack/react-query';
import { 
  Shield, 
  Scan, 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Plus,
  ArrowRight,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { scansApi, riskApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScanTable } from '@/components/scanning/ScanTable';
import { RiskScoreGauge } from '@/components/scanning/risk/RiskScoreGauge';
import { formatRelativeTime } from '@/lib/utils';
import { Scan as ScanType } from '@/types';

export default function DashboardPage() {
  // Fetch recent scans
  const { data: scansData, isLoading: scansLoading } = useQuery({
    queryKey: ['scans', 1, 5],
    queryFn: () => scansApi.list(1, 5),
  });

  const recentScans = scansData?.items || [];
  const totalScans = scansData?.total || 0;

  // Calculate statistics
  const completedScans = recentScans.filter(s => s.status === 'COMPLETED').length;
  const inProgressScans = recentScans.filter(s => s.status === 'IN_PROGRESS' || s.status === 'PENDING').length;

  const statCards = [
    {
      num: '01',
      title: 'Total Scans',
      value: totalScans,
      subtitle: 'All time assessments',
      icon: Scan,
      accentColor: 'text-red-500',
      glowFrom: 'from-red-500/5',
    },
    {
      num: '02',
      title: 'In Progress',
      value: inProgressScans,
      subtitle: 'Currently running',
      icon: TrendingUp,
      accentColor: 'text-amber-500',
      glowFrom: 'from-amber-500/5',
    },
    {
      num: '03',
      title: 'Completed',
      value: completedScans,
      subtitle: 'Ready for review',
      icon: CheckCircle,
      accentColor: 'text-emerald-500',
      glowFrom: 'from-emerald-500/5',
    },
    {
      num: '04',
      title: 'Endpoints',
      value: recentScans.reduce((acc, s) => acc + s.total_endpoints, 0),
      subtitle: 'In recent scans',
      icon: Shield,
      accentColor: 'text-sky-500',
      glowFrom: 'from-sky-500/5',
    },
  ];

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="badge-pill mb-3">COMMAND CENTER</div>
          <h1 className="text-3xl font-black tracking-tight text-foreground"
            style={{ fontFamily: "'Outfit', sans-serif", letterSpacing: '-0.02em' }}
          >
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Overview of your quantum vulnerability assessments
          </p>
        </div>
        <Link href="/scans/new">
          <Button className="shadow-lg shadow-red-600/20 font-semibold">
            <Plus className="mr-2 h-4 w-4" />
            New Scan
          </Button>
        </Link>
      </div>

      {/* Stats cards — Glassmorphic with numbered indicators */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card) => (
          <Card key={card.num} className="relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 hover:shadow-xl dark:hover:shadow-2xl dark:hover:shadow-black/30">
            <div className={`absolute inset-0 bg-gradient-to-r ${card.glowFrom} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-black ${card.accentColor} opacity-60`}
                  style={{ fontFamily: "'Outfit', sans-serif" }}
                >
                  {card.num}
                </span>
                <CardTitle className="text-xs font-bold tracking-wider uppercase text-muted-foreground">
                  {card.title}
                </CardTitle>
              </div>
              <card.icon className={`h-4 w-4 ${card.accentColor} opacity-50 group-hover:opacity-100 transition-opacity duration-200`} />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black tracking-tight text-foreground"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                {card.value}
              </div>
              <p className="text-[11px] text-muted-foreground/70 mt-1 font-medium">
                {card.subtitle}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions & Recent scans */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick actions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Quick Actions</CardTitle>
            <CardDescription>Common platform workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/scans/new" className="block group/item">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-primary/5 hover:border-primary/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 text-primary rounded-xl group-hover/item:scale-105 transition-transform">
                    <Plus className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground/90 group-hover/item:text-primary transition-colors">Start New Scan</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:translate-x-0.5 group-hover/item:text-primary transition-all" />
              </div>
            </Link>

            <Link href="/scans" className="block group/item">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-emerald-500/5 hover:border-emerald-500/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl group-hover/item:scale-105 transition-transform">
                    <Scan className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground/90 group-hover/item:text-emerald-500 transition-colors">View All Scans</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:translate-x-0.5 group-hover/item:text-emerald-500 transition-all" />
              </div>
            </Link>

            <Link href="/reports" className="block group/item">
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-border/60 bg-card hover:bg-sky-500/5 hover:border-sky-500/30 transition-all duration-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-500/10 text-sky-500 rounded-xl group-hover/item:scale-105 transition-transform">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="font-semibold text-sm text-foreground/90 group-hover/item:text-sky-500 transition-colors">View Reports</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover/item:translate-x-0.5 group-hover/item:text-sky-500 transition-all" />
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Recent scans */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold" style={{ fontFamily: "'Outfit', sans-serif" }}>Recent Scans</CardTitle>
              <CardDescription>Your latest vulnerability assessments</CardDescription>
            </div>
            <Link href="/scans">
              <Button variant="outline" size="sm" className="font-semibold">
                View All
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {scansLoading ? (
              <div className="text-center py-12 text-muted-foreground animate-pulse">
                Loading scans...
              </div>
            ) : recentScans.length === 0 ? (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No scans yet</p>
                <Link href="/scans/new">
                  <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Start Your First Scan
                  </Button>
                </Link>
              </div>
            ) : (
              <ScanTable scans={recentScans} compact />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Information banner */}
      <Card className="relative overflow-hidden border-primary/15 dark:border-primary/20 bg-gradient-to-r from-red-500/[0.03] via-primary/[0.04] to-transparent">
        <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none -mr-24 -mt-24" />
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-6 relative z-10">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-lg shadow-primary/10">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-lg" style={{ fontFamily: "'Outfit', sans-serif" }}>
              Protect Against Quantum Threats
            </h3>
            <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
              Quantum computers could break current cryptographic standard encryption within 10-15 years. 
              Assess and align your network infrastructure today to ensure long-term data security.
            </p>
          </div>
          <Link href="/scans/new" className="w-full sm:w-auto mt-4 sm:mt-0">
            <Button variant="outline" className="w-full sm:w-auto font-semibold">
              Scan Now
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}