'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authApi, clearTokens, getRefreshToken } from '@/lib/api';
import { User as UserType } from '@/types';

interface HeaderProps {
  user: UserType;
  onMenuClick: () => void;
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Sync with the current state of the document class
    const dark = document.documentElement.classList.contains('dark');
    setIsDark(dark);
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.remove('dark');
      localStorage.setItem('shaheen-theme', 'light');
      setIsDark(false);
    } else {
      html.classList.add('dark');
      localStorage.setItem('shaheen-theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      className="relative p-2 text-muted-foreground hover:text-primary transition-all duration-200 rounded-xl hover:bg-primary/10 group"
    >
      <span className="sr-only">Toggle theme</span>
      <div className="relative h-5 w-5">
        <Sun
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
          aria-hidden="true"
        />
        <Moon
          className={`absolute inset-0 h-5 w-5 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
          }`}
          aria-hidden="true"
        />
      </div>
    </button>
  );
}

export function Header({ user, onMenuClick }: HeaderProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        await authApi.logout(refreshToken);
      }
    } catch (error) {
      // Ignore errors during logout
    } finally {
      clearTokens();
      router.push('/login');
    }
  };

  const userInitial = user.full_name?.charAt(0) || user.email.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b px-4 sm:gap-x-6 sm:px-6 lg:px-8 transition-all duration-300"
      style={{
        background: 'hsl(var(--card) / 0.8)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderColor: 'hsl(var(--border) / 0.6)',
      }}
    >
      {/* Mobile menu button */}
      <button
        type="button"
        className="p-2 text-muted-foreground hover:text-primary transition-colors duration-200 lg:hidden rounded-xl hover:bg-primary/10"
        onClick={onMenuClick}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Separator */}
      <div className="h-5 w-px bg-border/60 lg:hidden" aria-hidden="true" />

      {/* Left: Badge pill */}
      <div className="hidden lg:block">
        <span className="badge-pill">POST-QUANTUM READINESS</span>
      </div>

      {/* Right side */}
      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6 justify-end">
        <div className="flex items-center gap-x-2 lg:gap-x-3">

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notifications */}
          <button
            type="button"
            className="p-2 text-muted-foreground hover:text-primary transition-all duration-200 rounded-xl hover:bg-primary/10"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-5 w-5" aria-hidden="true" />
          </button>

          {/* Separator */}
          <div
            className="hidden lg:block lg:h-5 lg:w-px lg:bg-border/60"
            aria-hidden="true"
          />

          {/* Profile dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-primary/10 transition-all duration-200">
                <span className="sr-only">Open user menu</span>
                <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center ring-2 ring-primary/20 shrink-0 shadow-lg shadow-primary/20">
                  <span className="text-sm font-bold text-white">
                    {userInitial}
                  </span>
                </div>
                <span className="hidden lg:flex lg:items-center">
                  <span
                    className="text-sm font-semibold leading-6 text-foreground"
                    aria-hidden="true"
                  >
                    {user.full_name || user.email}
                  </span>
                  <ChevronDown
                    className="ml-1.5 h-4 w-4 text-muted-foreground"
                    aria-hidden="true"
                  />
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user.full_name || 'User'}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {isLoggingOut ? 'Logging out...' : 'Log out'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}