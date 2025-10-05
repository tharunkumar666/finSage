-- Create tables for investments, debts, and goals with RLS
CREATE TABLE public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  shares NUMERIC NOT NULL CHECK (shares > 0),
  current_price NUMERIC NOT NULL CHECK (current_price > 0),
  purchase_price NUMERIC,
  purchase_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.debts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  balance NUMERIC NOT NULL CHECK (balance >= 0),
  interest_rate NUMERIC NOT NULL CHECK (interest_rate >= 0 AND interest_rate <= 100),
  minimum_payment NUMERIC CHECK (minimum_payment >= 0),
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  target_amount NUMERIC NOT NULL CHECK (target_amount > 0),
  current_amount NUMERIC DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  category TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.debts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for investments
CREATE POLICY "Users can view their own investments"
  ON public.investments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own investments"
  ON public.investments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own investments"
  ON public.investments FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own investments"
  ON public.investments FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for debts
CREATE POLICY "Users can view their own debts"
  ON public.debts FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own debts"
  ON public.debts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own debts"
  ON public.debts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own debts"
  ON public.debts FOR DELETE
  USING (auth.uid() = user_id);

-- Create RLS policies for goals
CREATE POLICY "Users can view their own goals"
  ON public.financial_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own goals"
  ON public.financial_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON public.financial_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON public.financial_goals FOR DELETE
  USING (auth.uid() = user_id);

-- Create update triggers for timestamp management
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_investments_updated_at
  BEFORE UPDATE ON public.investments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_debts_updated_at
  BEFORE UPDATE ON public.debts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON public.financial_goals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();