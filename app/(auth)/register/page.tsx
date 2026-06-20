'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Loader2, Eye, EyeOff, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

const registerSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  full_name: z.string().min(2, 'Name must be at least 2 characters').optional().or(z.literal('')),
  organization_name: z.string().optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

const passwordRequirements = [
  { regex: /.{8,}/, label: 'At least 8 characters' },
  { regex: /[A-Z]/, label: 'One uppercase letter' },
  { regex: /[a-z]/, label: 'One lowercase letter' },
  { regex: /[0-9]/, label: 'One number' },
  { regex: /[^A-Za-z0-9]/, label: 'One special character' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch('password', '');

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      await authApi.register(data);
      toast({
        title: 'Account created!',
        description: 'Please log in with your new credentials.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        title: 'Registration failed',
        description: error.response?.data?.message || 'An error occurred during registration',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="glass-card border border-white/[0.08] shadow-2xl p-2 bg-slate-900/40 backdrop-blur-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="flex justify-center mb-4 lg:hidden">
          <Image src="/logo.svg" alt="ShaheenShield" width={52} height={52} className="rounded-xl" style={{ filter: 'drop-shadow(0 2px 8px rgba(239, 68, 68, 0.3))' }} />
        </div>
        <CardTitle className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Create an account</CardTitle>
        <CardDescription className="text-slate-400 text-sm">
          Start assessing your quantum vulnerability risk today
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium text-sm">Email *</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register('email')}
              disabled={isLoading}
              className={errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-slate-300 font-medium text-sm">Full Name</Label>
              <Input
                id="full_name"
                type="text"
                placeholder="John Doe"
                {...register('full_name')}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="organization_name" className="text-slate-300 font-medium text-sm">Organization</Label>
              <Input
                id="organization_name"
                type="text"
                placeholder="Acme Inc."
                {...register('organization_name')}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-slate-300 font-medium text-sm">Password *</Label>
            <div className="relative flex items-center">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                {...register('password')}
                disabled={isLoading}
                className={errors.password ? 'border-red-500 pr-12 focus-visible:ring-red-500' : 'pr-12'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-slate-400 hover:text-white transition-colors border-0 bg-transparent p-1 outline-none focus:outline-none flex items-center justify-center rounded-lg hover:bg-white/5"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password requirements */}
            <div className="grid grid-cols-2 gap-1 mt-2">
              {passwordRequirements.map((req, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-1 text-xs ${
                    req.regex.test(password) ? 'text-green-400 font-semibold' : 'text-slate-500'
                  }`}
                >
                  {req.regex.test(password) ? (
                    <Check className="h-3 w-3 text-green-400" />
                  ) : (
                    <X className="h-3 w-3 text-slate-500" />
                  )}
                  {req.label}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confirm_password" className="text-slate-300 font-medium text-sm">Confirm Password *</Label>
            <Input
              id="confirm_password"
              type="password"
              placeholder="••••••••"
              {...register('confirm_password')}
              disabled={isLoading}
              className={errors.confirm_password ? 'border-red-500 focus-visible:ring-red-500' : ''}
            />
            {errors.confirm_password && (
              <p className="text-xs text-red-500 mt-1">{errors.confirm_password.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create account
          </Button>
          
          <p className="text-center text-sm text-slate-400 mt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-red-400 hover:text-red-300 hover:underline font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}