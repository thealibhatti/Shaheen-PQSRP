'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Shield,
  ShieldOff,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  Loader2,
  UserCog,
  Mail,
  Building2,
  Calendar,
  Scan as ScanIcon,
} from 'lucide-react';
import { adminApi, AdminUser, AdminUserUpdate } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function AdminUsersPage() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => adminApi.listUsers(0, 200),
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, data }: { userId: number; data: AdminUserUpdate }) =>
      adminApi.updateUser(userId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      setConfirmDelete(null);
    },
  });

  const filteredUsers = (users || []).filter(
    (u) =>
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.full_name && u.full_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (u.organization_name &&
         u.organization_name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleToggle = (user: AdminUser, field: keyof AdminUserUpdate) => {
    const currentValue = user[field as keyof AdminUser];
    updateMutation.mutate({
      userId: user.id,
      data: { [field]: !currentValue },
    });
  };

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5" style={{ fontFamily: "'Outfit', sans-serif" }}>
            <UserCog className="h-8 w-8 text-amber-500" />
            User Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage platform users, roles, and security access
          </p>
        </div>
        <div className="flex items-center gap-2 bg-amber-500/10 px-4 py-2 rounded-xl border border-amber-500/20 shrink-0">
          <Users className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold text-amber-500">
            {users?.length || 0} Total Users
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
        <Input
          type="text"
          placeholder="Search users by email, name, or org..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 focus-visible:ring-amber-500"
        />
      </div>

      {/* Users List */}
      {isLoading ? (
        <div className="text-center py-20 animate-pulse">
          <Loader2 className="h-10 w-10 animate-spin text-amber-500 mx-auto" />
          <p className="mt-3 text-slate-500 dark:text-slate-400 font-semibold">Loading users...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <Card className="glass-card shadow-lg">
          <CardContent className="text-center py-16">
            <Users className="h-12 w-12 text-slate-400 dark:text-slate-500 mx-auto mb-4 opacity-40" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">No users found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <Card
              key={user.id}
              className={`glass-card shadow-lg hover:shadow-xl hover:translate-y-0 transition-all duration-300 overflow-hidden ${
                !user.is_active ? 'opacity-65 border-red-500/25 bg-red-500/5' : ''
              }`}
            >
              <CardContent className="p-5">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0 select-none shadow-sm ${
                        user.is_superuser
                          ? 'bg-gradient-to-br from-amber-500 to-orange-600'
                          : 'bg-gradient-to-br from-red-500 to-red-700'
                      }`}
                    >
                      {(user.full_name || user.email)[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                          {user.full_name || 'No Name'}
                        </h3>
                        {user.is_superuser && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/25">
                            <Shield className="h-3 w-3" /> Admin
                          </span>
                        )}
                        {!user.is_active && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/25">
                            <XCircle className="h-3 w-3" /> Disabled
                          </span>
                        )}
                        {user.is_verified && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                            <CheckCircle className="h-3 w-3" /> Verified
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> {user.email}
                        </span>
                        {user.organization_name && (
                          <span className="flex items-center gap-1.5">
                            <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> {user.organization_name}
                          </span>
                        )}
                        <span className="flex items-center gap-1.5">
                          <ScanIcon className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" /> {user.scan_count} scans
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />{' '}
                          {new Date(user.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-end md:self-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(user, 'is_active')}
                      disabled={updateMutation.isPending}
                      className={cn(
                        'h-9 rounded-lg border transition-colors',
                        user.is_active
                          ? 'text-red-500 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/40 bg-white/50 dark:bg-slate-900/30'
                          : 'text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/10 hover:border-emerald-500/40 bg-white/50 dark:bg-slate-900/30'
                      )}
                      title={user.is_active ? 'Deactivate user' : 'Activate user'}
                    >
                      {user.is_active ? (
                        <>
                          <XCircle className="h-4 w-4 mr-1.5" /> Disable
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1.5" /> Enable
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggle(user, 'is_superuser')}
                      disabled={updateMutation.isPending}
                      className={cn(
                        'h-9 rounded-lg border transition-all',
                        user.is_superuser
                          ? 'text-amber-500 border-amber-500/25 bg-amber-500/5 hover:bg-amber-500/10 hover:border-amber-500/40'
                          : 'text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/5 bg-white/50 dark:bg-slate-900/30'
                      )}
                      title={
                        user.is_superuser
                          ? 'Remove admin role'
                          : 'Grant admin role'
                      }
                    >
                      {user.is_superuser ? (
                        <>
                          <ShieldOff className="h-4 w-4 mr-1.5" /> Revoke Admin
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-1.5" /> Make Admin
                        </>
                      )}
                    </Button>

                    {confirmDelete === user.id ? (
                      <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950/40 p-1 rounded-lg border border-slate-200 dark:border-white/10">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteMutation.mutate(user.id)}
                          disabled={deleteMutation.isPending}
                          className="h-8 px-3 text-xs bg-red-600 hover:bg-red-700"
                        >
                          {deleteMutation.isPending ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            'Confirm'
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmDelete(null)}
                          className="h-8 px-3 text-xs border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setConfirmDelete(user.id)}
                        className="h-9 px-3 rounded-lg text-red-500 border-red-500/20 bg-white/50 dark:bg-slate-900/30 hover:bg-red-500/10 hover:border-red-500/40"
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
