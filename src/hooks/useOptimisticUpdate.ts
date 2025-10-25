import { useMutation, useQueryClient } from '@tanstack/react-query';

interface OptimisticUpdateOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  queryKey: string[];
  updater: (oldData: TData | undefined, variables: TVariables) => TData;
  onSuccess?: (data: TData) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for optimistic updates with React Query
 * Immediately updates the UI while the mutation is in progress
 */
export function useOptimisticUpdate<TData, TVariables>({
  mutationFn,
  queryKey,
  updater,
  onSuccess,
  onError,
}: OptimisticUpdateOptions<TData, TVariables>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables: TVariables) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<TData>(queryKey);

      // Optimistically update to the new value
      queryClient.setQueryData<TData>(queryKey, (old) => updater(old, variables));

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      onError?.(err as Error);
    },
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the server state
      queryClient.invalidateQueries({ queryKey });
    },
  });
}
