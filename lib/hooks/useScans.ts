'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { scansApi } from '@/lib/api';
import { ScanCreateRequest } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export function useScans(page: number = 1, pageSize: number = 20) {
  return useQuery({
    queryKey: ['scans', page, pageSize],
    queryFn: () => scansApi.list(page, pageSize),
  });
}

export function useScan(scanId: number) {
  return useQuery({
    queryKey: ['scan', scanId],
    queryFn: () => scansApi.get(scanId),
    refetchInterval: (data) => {
      const status = data?.state.data?.status;
      if (status === 'IN_PROGRESS' || status === 'PENDING') {
        return 3000;
      }
      return false;
    },
  });
}

export function useScanStatus(scanId: number) {
  return useQuery({
    queryKey: ['scanStatus', scanId],
    queryFn: () => scansApi.getStatus(scanId),
    refetchInterval: (data) => {
      const status = data?.state.data?.status;
      if (status === 'IN_PROGRESS' || status === 'PENDING') {
        return 2000;
      }
      return false;
    },
  });
}

export function useCreateScan() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: ScanCreateRequest) => scansApi.create(data),
    onSuccess: (scan) => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      toast({
        title: 'Scan started',
        description: `Scanning ${scan.total_endpoints} endpoints...`,
      });
      router.push(`/scans/${scan.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create scan',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
}

export function useCancelScan() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (scanId: number) => scansApi.cancel(scanId),
    onSuccess: (scan) => {
      queryClient.invalidateQueries({ queryKey: ['scan', scan.id] });
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      toast({
        title: 'Scan cancelled',
        description: 'The scan has been cancelled.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to cancel scan',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteScan() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (scanId: number) => scansApi.delete(scanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scans'] });
      toast({
        title: 'Scan deleted',
        description: 'The scan has been deleted.',
      });
      router.push('/scans');
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to delete scan',
        description: error.response?.data?.message || 'An error occurred',
        variant: 'destructive',
      });
    },
  });
}