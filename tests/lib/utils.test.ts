import {
  cn,
  formatDate,
  formatDateTime,
  formatRelativeTime,
  formatPercentage,
  formatFileSize,
  formatDuration,
  getRiskLevelColor,
  getStatusColor,
  truncateText,
  isValidEmail,
  isValidDomain,
  parseDomains,
} from '@/lib/utils';

describe('cn utility', () => {
  it('merges class names correctly', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
    expect(cn('foo', { bar: true })).toBe('foo bar');
    expect(cn('foo', { bar: false })).toBe('foo');
  });

  it('handles tailwind class conflicts', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = '2024-01-15T00:00:00Z';
    expect(formatDate(date)).toBe('Jan 15, 2024');
  });

  it('handles null/undefined', () => {
    expect(formatDate(null)).toBe('N/A');
    expect(formatDate(undefined)).toBe('N/A');
  });
});

describe('formatDateTime', () => {
  it('formats datetime correctly', () => {
    const date = '2024-01-15T14:30:00Z';
    expect(formatDateTime(date)).toContain('Jan 15, 2024');
    expect(formatDateTime(date)).toContain('14:30');
  });

  it('handles null/undefined', () => {
    expect(formatDateTime(null)).toBe('N/A');
  });
});

describe('formatPercentage', () => {
  it('formats percentage correctly', () => {
    expect(formatPercentage(75.5)).toBe('75.5%');
    expect(formatPercentage(100)).toBe('100.0%');
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('respects decimal places', () => {
    expect(formatPercentage(75.555, 2)).toBe('75.56%');
    expect(formatPercentage(75.555, 0)).toBe('76%');
  });
});

describe('formatFileSize', () => {
  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 B');
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(1048576)).toBe('1.0 MB');
    expect(formatFileSize(1073741824)).toBe('1.0 GB');
  });

  it('handles null/undefined', () => {
    expect(formatFileSize(null)).toBe('N/A');
    expect(formatFileSize(undefined)).toBe('N/A');
  });
});

describe('formatDuration', () => {
  it('formats seconds correctly', () => {
    expect(formatDuration(30)).toBe('30s');
    expect(formatDuration(90)).toBe('1m 30s');
    expect(formatDuration(3661)).toBe('1h 1m');
  });

  it('handles null/undefined', () => {
    expect(formatDuration(null)).toBe('N/A');
  });
});

describe('getRiskLevelColor', () => {
  it('returns correct colors', () => {
    expect(getRiskLevelColor('LOW')).toBe('text-green-600');
    expect(getRiskLevelColor('MEDIUM')).toBe('text-yellow-600');
    expect(getRiskLevelColor('HIGH')).toBe('text-orange-600');
    expect(getRiskLevelColor('CRITICAL')).toBe('text-red-600');
  });
});

describe('getStatusColor', () => {
  it('returns correct colors', () => {
    expect(getStatusColor('QUANTUM_BROKEN')).toBe('text-red-600');
    expect(getStatusColor('QUANTUM_VULNERABLE')).toBe('text-orange-600');
    expect(getStatusColor('QUANTUM_RESISTANT')).toBe('text-green-600');
    expect(getStatusColor('UNKNOWN')).toBe('text-gray-600');
  });
});

describe('truncateText', () => {
  it('truncates long text', () => {
    const longText = 'This is a very long text that should be truncated';
    expect(truncateText(longText, 20)).toBe('This is a very lo...');
  });

  it('does not truncate short text', () => {
    const shortText = 'Short';
    expect(truncateText(shortText, 20)).toBe('Short');
  });
});

describe('isValidEmail', () => {
  it('validates correct emails', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
  });

  it('rejects invalid emails', () => {
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('invalid@')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
  });
});

describe('isValidDomain', () => {
  it('validates correct domains', () => {
    expect(isValidDomain('example.com')).toBe(true);
    expect(isValidDomain('sub.example.com')).toBe(true);
    expect(isValidDomain('example.co.uk')).toBe(true);
  });

  it('rejects invalid domains', () => {
    expect(isValidDomain('not a domain')).toBe(false);
    expect(isValidDomain('-invalid.com')).toBe(false);
  });
});

describe('parseDomains', () => {
  it('parses newline-separated domains', () => {
    const input = 'example.com\ntest.org\nfoo.bar';
    expect(parseDomains(input)).toEqual(['example.com', 'test.org', 'foo.bar']);
  });

  it('parses comma-separated domains', () => {
    const input = 'example.com, test.org, foo.bar';
    expect(parseDomains(input)).toEqual(['example.com', 'test.org', 'foo.bar']);
  });

  it('removes duplicates', () => {
    const input = 'example.com\nexample.com\ntest.org';
    expect(parseDomains(input)).toEqual(['example.com', 'test.org']);
  });

  it('trims whitespace and converts to lowercase', () => {
    const input = '  EXAMPLE.COM  \n  Test.Org  ';
    expect(parseDomains(input)).toEqual(['example.com', 'test.org']);
  });
});