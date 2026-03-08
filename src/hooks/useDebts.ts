import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchDebts, createDebt, updateDebt, deleteDebt } from '@/services/debts';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateDebtDTO, UpdateDebtDTO } from '@/types';

export function useDebts() {
  return useQuery({
    queryKey: ['debts'],
    queryFn: fetchDebts,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateDebt() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dto: CreateDebtDTO) => createDebt(dto, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });
}

export function useUpdateDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateDebtDTO) => updateDebt(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });
}

export function useDeleteDebt() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteDebt(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['debts'] }),
  });
}
