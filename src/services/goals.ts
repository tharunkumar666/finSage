import { supabase } from '@/integrations/supabase/client';
import type { FinancialGoal, CreateGoalDTO, UpdateGoalDTO } from '@/types';

export async function fetchGoals(): Promise<FinancialGoal[]> {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as FinancialGoal[];
}

export async function createGoal(dto: CreateGoalDTO, userId: string): Promise<FinancialGoal> {
  const { data, error } = await supabase
    .from('financial_goals')
    .insert({ ...dto, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FinancialGoal;
}

export async function updateGoal(dto: UpdateGoalDTO): Promise<FinancialGoal> {
  const { id, ...fields } = dto;
  const { data, error } = await supabase
    .from('financial_goals')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as FinancialGoal;
}

export async function deleteGoal(id: string): Promise<void> {
  const { error } = await supabase
    .from('financial_goals')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
