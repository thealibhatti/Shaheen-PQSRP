'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { authApi, getAccessToken } from '@/lib/api';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Check authentication
  const { data: user, isLoading, isError } = useQuery({
    queryKey: ['currentUser'],
    queryFn: authApi.getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    if (isError) {
      router.push('/login');
    }
  }, [isError, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dot-grid-bg">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-muted-foreground text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background dot-grid-bg transition-colors duration-300">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} user={user} />
      
      <div className="lg:pl-64">
        <Header user={user} onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 animate-slide-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}