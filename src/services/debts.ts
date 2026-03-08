import { supabase } from '@/integrations/supabase/client';
import type { Debt, CreateDebtDTO, UpdateDebtDTO } from '@/types';

export async function fetchDebts(): Promise<Debt[]> {
  const { data, error } = await supabase
    .from('debts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Debt[];
}

export async function createDebt(dto: CreateDebtDTO, userId: string): Promise<Debt> {
  const { data, error } = await supabase
    .from('debts')
    .insert({ ...dto, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Debt;
}

export async function updateDebt(dto: UpdateDebtDTO): Promise<Debt> {
  const { id, ...fields } = dto;
  const { data, error } = await supabase
    .from('debts')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Debt;
}

export async function deleteDebt(id: string): Promise<void> {
  const { error } = await supabase
    .from('debts')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
