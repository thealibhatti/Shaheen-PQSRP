import { render, screen } from '@testing-library/react';
import { ScanTable } from '@/components/scanning/ScanTable';
import { Scan } from '@/types';

const mockScans: Scan[] = [
  {
    id: 1,
    name: 'Test Scan 1',
    description: 'Description 1',
    status: 'COMPLETED',
    total_endpoints: 5,
    scanned_endpoints: 5,
    failed_endpoints: 0,
    progress_percentage: 100,
    created_at: '2024-01-01T00:00:00Z',
    started_at: '2024-01-01T00:00:01Z',
    completed_at: '2024-01-01T00:05:00Z',
    error_message: null,
  },
  {
    id: 2,
    name: 'Test Scan 2',
    description: null,
    status: 'IN_PROGRESS',
    total_endpoints: 10,
    scanned_endpoints: 5,
    failed_endpoints: 1,
    progress_percentage: 50,
    created_at: '2024-01-02T00:00:00Z',
    started_at: '2024-01-02T00:00:01Z',
    completed_at: null,
    error_message: null,
  },
];

describe('ScanTable', () => {
  it('renders scans correctly', () => {
    render(<ScanTable scans={mockScans} />);
    
    expect(screen.getByText('Test Scan 1')).toBeInTheDocument();
    expect(screen.getByText('Test Scan 2')).toBeInTheDocument();
  });

  it('displays scan status', () => {
    render(<ScanTable scans={mockScans} />);
    
    expect(screen.getByText('COMPLETED')).toBeInTheDocument();
    expect(screen.getByText('IN PROGRESS')).toBeInTheDocument();
  });

  it('shows endpoint counts', () => {
    render(<ScanTable scans={mockScans} />);
    
    expect(screen.getByText('5/5')).toBeInTheDocument();
    expect(screen.getByText('5/10')).toBeInTheDocument();
  });

  it('shows failed endpoints count', () => {
    render(<ScanTable scans={mockScans} />);
    
    expect(screen.getByText('1 failed')).toBeInTheDocument();
  });

  it('shows progress for in-progress scans', () => {
    render(<ScanTable scans={mockScans} />);
    
    expect(screen.getByText('50% complete')).toBeInTheDocument();
  });

  it('renders view buttons', () => {
    render(<ScanTable scans={mockScans} />);
    
    const viewButtons = screen.getAllByText('View');
    expect(viewButtons).toHaveLength(2);
  });

  it('renders compact mode correctly', () => {
    render(<ScanTable scans={mockScans} compact />);
    
    // In compact mode, created date column should not be visible
    expect(screen.queryByText('Created')).not.toBeInTheDocument();
  });
});