import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import PageSkeleton from '../components/PageSkeleton';

describe('PageSkeleton', () => {
  it('should render loading skeleton', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should have proper structure', () => {
    const { container } = render(<PageSkeleton />);
    const skeleton = container.querySelector('.min-h-screen');
    expect(skeleton).toBeInTheDocument();
    expect(skeleton).toHaveClass('bg-gray-50');
  });
});
