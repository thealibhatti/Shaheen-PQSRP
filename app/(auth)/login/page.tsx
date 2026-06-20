'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Image from 'next/image';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { authApi } from '@/lib/api';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await authApi.login(data);
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
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
        <CardTitle className="text-3xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Outfit', sans-serif" }}>Welcome back</CardTitle>
        <CardDescription className="text-slate-400 text-sm">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-slate-300 font-medium text-sm">Email</Label>
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
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-slate-300 font-medium text-sm">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-red-400 hover:text-red-300 hover:underline font-semibold transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full h-11 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-all shadow-lg shadow-red-600/20" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sign in
          </Button>
          
          <p className="text-center text-sm text-slate-400 mt-2">
            Don't have an account?{' '}
            <Link href="/register" className="text-red-400 hover:text-red-300 hover:underline font-semibold transition-colors">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}