'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Dialog, Transition } from '@headlessui/react';
import {
  X,
  LayoutDashboard,
  Scan,
  FileText,
  Settings,
  HelpCircle,
  Users,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { User } from '@/types';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Scans', href: '/scans', icon: Scan },
  { name: 'Reports', href: '/reports', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
];

const adminNavigation = [
  { name: 'User Management', href: '/admin/users', icon: Users },
  { name: 'All Scans', href: '/admin/scans', icon: ShieldAlert },
  { name: 'System Stats', href: '/admin/stats', icon: BarChart3 },
];

const secondaryNavigation = [
  { name: 'Help & Support', href: '#', icon: HelpCircle },
];

function SidebarContent({ user }: { user?: User }) {
  const pathname = usePathname() || '';
  const isAdmin = user?.is_superuser === true;

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto px-5 pb-4"
      style={{
        background: 'hsl(var(--sidebar-bg))',
        borderRight: '1px solid hsl(var(--sidebar-border))',
      }}
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3">
        <Image
          src="/logo.svg"
          alt="ShaheenShield Logo"
          width={34}
          height={34}
          className="rounded-lg shrink-0"
          style={{ filter: 'drop-shadow(0 2px 6px rgba(239, 68, 68, 0.25))' }}
        />
        <div>
          <span className="text-[15px] font-black tracking-wide leading-none block"
            style={{ fontFamily: "'Outfit', sans-serif" }}
          >
            <span className="text-foreground">SHAHEEN</span>
            <span className="text-red-500">SHIELD</span>
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground block mt-0.5 font-semibold">
            Breach the Unbreachable
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-6">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        isActive
                          ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm shadow-primary/5'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/5 border border-transparent',
                        'group flex gap-x-3 rounded-xl p-2.5 text-sm leading-6 font-semibold transition-all duration-200'
                      )}
                    >
                      <item.icon
                        className={cn(
                          isActive
                            ? 'text-primary'
                            : 'text-muted-foreground group-hover:text-primary',
                          'h-5 w-5 shrink-0 transition-colors duration-200'
                        )}
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </li>

          {/* Admin Section */}
          {isAdmin && (
            <li>
              <div className="text-[10px] font-bold leading-6 text-muted-foreground uppercase tracking-[0.15em] px-2 mb-1"
                style={{ fontFamily: "'Outfit', sans-serif" }}
              >
                Admin Panel
              </div>
              <ul role="list" className="-mx-2 space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={cn(
                          isActive
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm shadow-amber-500/5'
                            : 'text-muted-foreground hover:text-amber-500 hover:bg-amber-500/5 border border-transparent',
                          'group flex gap-x-3 rounded-xl p-2.5 text-sm leading-6 font-semibold transition-all duration-200'
                        )}
                      >
                        <item.icon
                          className={cn(
                            isActive
                              ? 'text-amber-500'
                              : 'text-muted-foreground group-hover:text-amber-500',
                            'h-5 w-5 shrink-0 transition-colors duration-200'
                          )}
                          aria-hidden="true"
                        />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          )}

          {/* Secondary navigation */}
          <li className="mt-auto">
            <div className="border-t border-[hsl(var(--sidebar-border))] pt-4">
              <ul role="list" className="-mx-2 space-y-1">
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="group flex gap-x-3 rounded-xl p-2.5 text-sm font-semibold leading-6 text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200 border border-transparent"
                    >
                      <item.icon
                        className="h-5 w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-200"
                        aria-hidden="true"
                      />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export function Sidebar({ open, onClose, user }: SidebarProps) {
  return (
    <>
      {/* Mobile sidebar */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <span className="sr-only">Close sidebar</span>
                      <X className="h-6 w-6 text-white" aria-hidden="true" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent user={user} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent user={user} />
      </div>
    </>
  );
}