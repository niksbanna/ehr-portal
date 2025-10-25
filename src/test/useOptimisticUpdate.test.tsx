import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useOptimisticUpdate } from '../hooks/useOptimisticUpdate';

interface TestData {
  id?: number;
  name: string;
}

describe('useOptimisticUpdate', () => {
  it('should handle optimistic updates correctly', async () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
      },
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const mockMutationFn = vi.fn().mockResolvedValue({ id: 1, name: 'Updated' });
    const mockUpdater = vi.fn((old: TestData | undefined, vars: TestData) => ({
      ...old,
      name: vars.name,
    }));

    const { result } = renderHook(
      () =>
        useOptimisticUpdate({
          mutationFn: mockMutationFn,
          queryKey: ['test-key'],
          updater: mockUpdater,
        }),
      { wrapper }
    );

    // Trigger mutation
    result.current.mutate({ name: 'Test' });

    await waitFor(() => {
      expect(mockMutationFn).toHaveBeenCalled();
      expect(mockUpdater).toHaveBeenCalled();
    });
  });
});
