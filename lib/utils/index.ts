/**
 * Utility Functions
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';
import { RiskLevel, VulnerabilityStatus } from '@/types';

/**
 * Merge Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy');
}

/**
 * Format date with time
 */
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return format(new Date(date), 'MMM d, yyyy HH:mm');
}

/**
 * Format relative time
 */
export function formatRelativeTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number | null | undefined): string {
  if (!bytes) return 'N/A';
  
  const units = ['B', 'KB', 'MB', 'GB'];
  let unitIndex = 0;
  let size = bytes;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

/**
 * Format duration
 */
export function formatDuration(seconds: number | null | undefined): string {
  if (!seconds) return 'N/A';
  
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  }
}

/**
 * Get risk level color
 */
export function getRiskLevelColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: 'text-green-600',
    MEDIUM: 'text-yellow-600',
    HIGH: 'text-orange-600',
    CRITICAL: 'text-red-600',
  };
  return colors[level] || 'text-gray-600';
}

/**
 * Get risk level background color
 */
export function getRiskLevelBgColor(level: RiskLevel): string {
  const colors: Record<RiskLevel, string> = {
    LOW: 'bg-green-100',
    MEDIUM: 'bg-yellow-100',
    HIGH: 'bg-orange-100',
    CRITICAL: 'bg-red-100',
  };
  return colors[level] || 'bg-gray-100';
}

/**
 * Get vulnerability status color
 */
export function getStatusColor(status: VulnerabilityStatus): string {
  const colors: Record<VulnerabilityStatus, string> = {
    QUANTUM_BROKEN: 'text-red-600',
    QUANTUM_VULNERABLE: 'text-orange-600',
    QUANTUM_RESISTANT: 'text-green-600',
    UNKNOWN: 'text-gray-600',
  };
  return colors[status] || 'text-gray-600';
}

/**
 * Get vulnerability status background color
 */
export function getStatusBgColor(status: VulnerabilityStatus): string {
  const colors: Record<VulnerabilityStatus, string> = {
    QUANTUM_BROKEN: 'bg-red-100',
    QUANTUM_VULNERABLE: 'bg-orange-100',
    QUANTUM_RESISTANT: 'bg-green-100',
    UNKNOWN: 'bg-gray-100',
  };
  return colors[status] || 'bg-gray-100';
}

/**
 * Get status label
 */
export function getStatusLabel(status: VulnerabilityStatus): string {
  const labels: Record<VulnerabilityStatus, string> = {
    QUANTUM_BROKEN: 'Quantum Broken',
    QUANTUM_VULNERABLE: 'Quantum Vulnerable',
    QUANTUM_RESISTANT: 'Quantum Resistant',
    UNKNOWN: 'Unknown',
  };
  return labels[status] || status;
}

/**
 * Truncate text
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Validate email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate domain
 */
export function isValidDomain(domain: string): boolean {
  const domainRegex = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)*[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/;
  return domainRegex.test(domain);
}

/**
 * Parse domains from text
 */
export function parseDomains(text: string): string[] {
  return text
    .split(/[\n,\s]+/)
    .map((d) => d.trim().toLowerCase())
    .filter((d) => d.length > 0)
    .filter((d, i, arr) => arr.indexOf(d) === i); // Remove duplicates
}