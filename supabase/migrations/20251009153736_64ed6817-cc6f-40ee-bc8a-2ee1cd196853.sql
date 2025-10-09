-- Add CHECK constraints for numeric field validation

-- Investments table: Ensure positive values for shares and prices
ALTER TABLE public.investments
  ADD CONSTRAINT investments_shares_positive CHECK (shares > 0),
  ADD CONSTRAINT investments_current_price_positive CHECK (current_price > 0),
  ADD CONSTRAINT investments_purchase_price_positive CHECK (purchase_price IS NULL OR purchase_price > 0);

-- Debts table: Ensure positive balance and valid interest rate range
ALTER TABLE public.debts
  ADD CONSTRAINT debts_balance_positive CHECK (balance >= 0),
  ADD CONSTRAINT debts_interest_rate_valid CHECK (interest_rate >= 0 AND interest_rate <= 100),
  ADD CONSTRAINT debts_minimum_payment_positive CHECK (minimum_payment IS NULL OR minimum_payment >= 0);

-- Financial goals table: Ensure positive target amounts
ALTER TABLE public.financial_goals
  ADD CONSTRAINT financial_goals_target_amount_positive CHECK (target_amount > 0),
  ADD CONSTRAINT financial_goals_current_amount_positive CHECK (current_amount >= 0);