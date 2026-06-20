/**
 * Mock Admin API for Presentation Mode
 */

import { mockDb } from './mockDb';
export interface AdminUser {
  id: number;
  email: string;
  full_name: string | null;
  organization_name: string | null;
  is_active: boolean;
  is_superuser: boolean;
  is_verified: boolean;
  created_at: string;
  last_login: string | null;
  scan_count: number;
}

export interface AdminUserUpdate {
  full_name?: string;
  organization_name?: string;
  is_active?: boolean;
  is_superuser?: boolean;
  is_verified?: boolean;
}

export interface AdminScan {
  id: number;
  name: string | null;
  description: string | null;
  status: string;
  total_endpoints: number;
  scanned_endpoints: number;
  failed_endpoints: number;
  created_at: string;
  started_at: string | null;
  completed_at: string | null;
  error_message: string | null;
  user_id: number;
  user_email: string | null;
  user_full_name: string | null;
}

export interface SystemStats {
  total_users: number;
  active_users: number;
  total_scans: number;
  completed_scans: number;
  failed_scans: number;
  in_progress_scans: number;
  total_endpoints: number;
  scans_by_status: Record<string, number>;
  recent_signups: number;
}
export const adminApi = {
  /**
   * Get all users
   */
  listUsers: async (skip = 0, limit = 50): Promise<AdminUser[]> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const users = mockDb.getUsers();
    const scans = mockDb.getScans();
    
    return users.map(user => {
      // Calculate how many scans belong to this user (for presentation we associate id 1 with admin and id 2 with ali)
      const userScansCount = user.id === 1 ? scans.length : 0;
      
      return {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        organization_name: user.organization_name,
        is_active: user.is_active,
        is_superuser: user.is_superuser,
        is_verified: user.is_verified,
        created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        last_login: new Date().toISOString(),
        scan_count: userScansCount,
      };
    });
  },

  /**
   * Update a user
   */
  updateUser: async (userId: number, data: AdminUserUpdate): Promise<AdminUser> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const users = mockDb.getUsers();
    const user = users.find(u => u.id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const updatedUser = {
      ...user,
      ...data,
    };
    
    mockDb.saveUser(updatedUser);
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      full_name: updatedUser.full_name,
      organization_name: updatedUser.organization_name,
      is_active: updatedUser.is_active,
      is_superuser: updatedUser.is_superuser,
      is_verified: updatedUser.is_verified,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_login: new Date().toISOString(),
      scan_count: updatedUser.id === 1 ? 3 : 0,
    };
  },

  /**
   * Delete a user
   */
  deleteUser: async (userId: number): Promise<void> => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    
    const users = mockDb.getUsers().filter(u => u.id !== userId);
    localStorage.setItem('pqc_users', JSON.stringify(users));
  },

  /**
   * Get all scans (cross-user)
   */
  listScans: async (skip = 0, limit = 50, status?: string): Promise<AdminScan[]> => {
    await new Promise((resolve) => setTimeout(resolve, 450));
    
    const scans = mockDb.getScans();
    const users = mockDb.getUsers();
    
    let filteredScans = scans;
    if (status) {
      filteredScans = scans.filter(s => s.status === status);
    }
    
    return filteredScans.map(scan => {
      // Associate with admin user (id 1) for visual simplicity
      const user = users.find(u => u.id === 1) || users[0];
      return {
        id: scan.id,
        name: scan.name,
        description: scan.description,
        status: scan.status,
        total_endpoints: scan.total_endpoints,
        scanned_endpoints: scan.scanned_endpoints,
        failed_endpoints: scan.failed_endpoints,
        created_at: scan.created_at,
        started_at: scan.started_at,
        completed_at: scan.completed_at,
        error_message: scan.error_message,
        user_id: user.id,
        user_email: user.email,
        user_full_name: user.full_name,
      };
    });
  },

  /**
   * Get system statistics
   */
  getStats: async (): Promise<SystemStats> => {
    await new Promise((resolve) => setTimeout(resolve, 400));
    return mockDb.getStats();
  },
};
