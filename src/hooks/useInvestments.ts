import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInvestments, createInvestment, updateInvestment, deleteInvestment } from '@/services/investments';
import { useAuth } from '@/contexts/AuthContext';
import type { CreateInvestmentDTO, UpdateInvestmentDTO } from '@/types';

export function useInvestments() {
  return useQuery({
    queryKey: ['investments'],
    queryFn: fetchInvestments,
    staleTime: 5 * 60 * 1000,
  });
}

export function useCreateInvestment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (dto: CreateInvestmentDTO) => createInvestment(dto, user!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });
}

export function useUpdateInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateInvestmentDTO) => updateInvestment(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });
}

export function useDeleteInvestment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteInvestment(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['investments'] }),
  });
}
