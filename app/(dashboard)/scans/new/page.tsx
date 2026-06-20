'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Loader2, Plus, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { scansApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { parseDomains, isValidDomain } from '@/lib/utils';

const scanSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  domainsText: z.string().min(1, 'At least one domain is required'),
});

type ScanFormData = z.infer<typeof scanSchema>;

export default function NewScanPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [domains, setDomains] = useState<string[]>([]);
  const [domainInput, setDomainInput] = useState('');
  const [domainErrors, setDomainErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ScanFormData>({
    resolver: zodResolver(scanSchema),
  });

  const createMutation = useMutation({
    mutationFn: scansApi.create,
    onSuccess: (scan) => {
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

  const handleAddDomains = () => {
    const rawDomains = parseDomains(domainInput);
    const validDomains: string[] = [];
    const errors: string[] = [];

    rawDomains.forEach((rawDomain) => {
      // Clean up protocol (e.g. http://, https://)
      let domain = rawDomain.trim().toLowerCase();
      if (domain.startsWith('http://')) {
        domain = domain.substring(7);
      } else if (domain.startsWith('https://')) {
        domain = domain.substring(8);
      }

      // Remove trailing path or slashes
      domain = domain.split('/')[0];

      // Remove port if present
      domain = domain.split(':')[0];

      if (domains.includes(domain)) {
        errors.push(`${domain} is already added`);
      } else if (!isValidDomain(domain)) {
        errors.push(`${domain} is not a valid domain`);
      } else {
        validDomains.push(domain);
      }
    });

    if (validDomains.length > 0) {
      const updatedDomains = [...domains, ...validDomains];
      setDomains(updatedDomains);
      setValue('domainsText', updatedDomains.join('\n'));
      setDomainInput('');
    }

    setDomainErrors(errors);
  };

  const handleRemoveDomain = (domain: string) => {
    const updatedDomains = domains.filter((d) => d !== domain);
    setDomains(updatedDomains);
    setValue('domainsText', updatedDomains.join('\n'));
  };

  const onSubmit = (data: ScanFormData) => {
    if (domains.length === 0) {
      toast({
        title: 'No domains',
        description: 'Please add at least one domain to scan',
        variant: 'destructive',
      });
      return;
    }

    if (domains.length > 50) {
      toast({
        title: 'Too many domains',
        description: 'Maximum 50 domains per scan',
        variant: 'destructive',
      });
      return;
    }

    createMutation.mutate({
      domains,
      name: data.name || undefined,
      description: data.description || undefined,
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Back button */}
      <Link href="/scans" className="inline-flex items-center text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-medium text-sm transition-colors group">
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-0.5 transition-transform" />
        Back to Scans
      </Link>

      {/* Page header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
          New Scan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Enter domains to scan for quantum vulnerabilities
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left column - Domain input */}
          <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Domains to Scan</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                Add up to 50 domains. Enter one per line or comma-separated.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="example.com&#10;api.example.com&#10;secure.example.org"
                  value={domainInput}
                  onChange={(e) => setDomainInput(e.target.value)}
                  rows={4}
                  className="flex-1"
                />
                <Button
                  type="button"
                  onClick={handleAddDomains}
                  disabled={!domainInput.trim()}
                  size="icon"
                  className="h-11 w-11 shrink-0 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-md shadow-red-600/10"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Domain errors */}
              {domainErrors.length > 0 && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-red-500 mt-0.5" />
                    <div className="text-sm text-red-500 font-medium">
                      {domainErrors.map((error, i) => (
                        <div key={i}>{error}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Added domains */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Added Domains ({domains.length}/50)
                </Label>
                {domains.length === 0 ? (
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No domains added yet
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1">
                    {domains.map((domain) => (
                      <div
                        key={domain}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-white/5 rounded-full text-sm font-medium text-slate-800 dark:text-slate-200 transition-all"
                      >
                        {domain}
                        <button
                          type="button"
                          onClick={() => handleRemoveDomain(domain)}
                          className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hidden field for validation */}
              <input type="hidden" {...register('domainsText')} />
            </CardContent>
          </Card>

          {/* Right column - Scan details */}
          <Card className="glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-slate-900 dark:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>Scan Details</CardTitle>
              <CardDescription className="text-slate-500 dark:text-slate-400 text-sm">
                Optional identification details for this assessment
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-700 dark:text-slate-300 text-sm">Scan Name</Label>
                <Input
                  id="name"
                  placeholder="Q4 2024 Security Audit"
                  {...register('name')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-slate-700 dark:text-slate-300 text-sm">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Regular quarterly scan of production endpoints..."
                  rows={3}
                  {...register('description')}
                />
              </div>

              <div className="pt-4 border-t border-slate-200/50 dark:border-white/[0.05]">
                <h4 className="font-semibold text-sm mb-2 text-slate-800 dark:text-slate-200">What will be scanned?</h4>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1.5 font-medium">
                  <li className="flex items-center gap-2">• TLS/SSL configuration (port 443)</li>
                  <li className="flex items-center gap-2">• Key exchange algorithms</li>
                  <li className="flex items-center gap-2">• Cipher suites</li>
                  <li className="flex items-center gap-2">• Certificate details</li>
                  <li className="flex items-center gap-2">• Quantum vulnerability assessment</li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full mt-2 h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20"
                disabled={createMutation.isPending || domains.length === 0}
              >
                {createMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Start Scan ({domains.length} {domains.length === 1 ? 'domain' : 'domains'})
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  );
}