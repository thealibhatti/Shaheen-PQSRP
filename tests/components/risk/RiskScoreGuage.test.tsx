import { render, screen } from '@testing-library/react';
import { RiskScoreGauge } from '@/components/risk/RiskScoreGauge';

describe('RiskScoreGauge', () => {
  it('renders score correctly', () => {
    render(<RiskScoreGauge score={75} level="HIGH" />);
    
    expect(screen.getByText('75')).toBeInTheDocument();
    expect(screen.getByText('/ 100')).toBeInTheDocument();
  });

  it('renders risk level label', () => {
    render(<RiskScoreGauge score={75} level="HIGH" />);
    
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();
  });

  it('renders different risk levels', () => {
    const { rerender } = render(<RiskScoreGauge score={15} level="LOW" />);
    expect(screen.getByText('LOW RISK')).toBeInTheDocument();

    rerender(<RiskScoreGauge score={35} level="MEDIUM" />);
    expect(screen.getByText('MEDIUM RISK')).toBeInTheDocument();

    rerender(<RiskScoreGauge score={65} level="HIGH" />);
    expect(screen.getByText('HIGH RISK')).toBeInTheDocument();

    rerender(<RiskScoreGauge score={90} level="CRITICAL" />);
    expect(screen.getByText('CRITICAL RISK')).toBeInTheDocument();
  });

  it('renders different sizes', () => {
    const { container, rerender } = render(
      <RiskScoreGauge score={50} level="MEDIUM" size="sm" />
    );
    
    let svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '120');

    rerender(<RiskScoreGauge score={50} level="MEDIUM" size="md" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '160');

    rerender(<RiskScoreGauge score={50} level="MEDIUM" size="lg" />);
    svg = container.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
  });
});