import { supabase } from '@/integrations/supabase/client';
import type { Investment, CreateInvestmentDTO, UpdateInvestmentDTO } from '@/types';

export async function fetchInvestments(): Promise<Investment[]> {
  const { data, error } = await supabase
    .from('investments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as Investment[];
}

export async function createInvestment(dto: CreateInvestmentDTO, userId: string): Promise<Investment> {
  const { data, error } = await supabase
    .from('investments')
    .insert({ ...dto, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Investment;
}

export async function updateInvestment(dto: UpdateInvestmentDTO): Promise<Investment> {
  const { id, ...fields } = dto;
  const { data, error } = await supabase
    .from('investments')
    .update(fields)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Investment;
}

export async function deleteInvestment(id: string): Promise<void> {
  const { error } = await supabase
    .from('investments')
    .delete()
    .eq('id', id);

  if (error) throw new Error(error.message);
}
