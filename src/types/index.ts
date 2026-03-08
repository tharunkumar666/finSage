// === Database row types ===

export interface Investment {
  id: string;
  user_id: string;
  name: string;
  symbol: string;
  shares: number;
  current_price: number;
  purchase_price: number | null;
  purchase_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface Debt {
  id: string;
  user_id: string;
  name: string;
  type: string;
  balance: number;
  interest_rate: number;
  minimum_payment: number | null;
  due_date: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface FinancialGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number | null;
  target_date: string | null;
  category: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  action: string;
  description: string;
  category: string;
  metadata: Record<string, any> | null;
  created_at: string | null;
}

// === DTO types (for creating/updating) ===

export interface CreateInvestmentDTO {
  name: string;
  symbol: string;
  shares: number;
  current_price: number;
  purchase_price?: number;
  purchase_date?: string;
}

export interface UpdateInvestmentDTO extends Partial<CreateInvestmentDTO> {
  id: string;
}

export interface CreateDebtDTO {
  name: string;
  type: string;
  balance: number;
  interest_rate: number;
  minimum_payment?: number;
  due_date?: string;
}

export interface UpdateDebtDTO extends Partial<CreateDebtDTO> {
  id: string;
}

export interface CreateGoalDTO {
  name: string;
  target_amount: number;
  current_amount?: number;
  target_date?: string;
  category?: string;
}

export interface UpdateGoalDTO extends Partial<CreateGoalDTO> {
  id: string;
}

// === API types ===

export interface AIAdvisorRequest {
  query: string;
  context?: {
    investments?: Investment[];
    debts?: Debt[];
    goals?: FinancialGoal[];
    riskProfile?: string;
  };
}

export interface AIAdvisorResponse {
  advice: string;
}

export interface StockInsightsRequest {
  symbol: string;
  action?: 'validate' | 'insights' | 'price' | 'all';
  userBudget?: number;
}

export interface StockInsightsResponse {
  isValid: boolean;
  symbol: string;
  shortName: string;
  name: string;
  exchange: string;
  currentPrice: number;
  previousClose: number;
  priceChange: number;
  priceChangePercent: number;
  currency: string;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  insights?: string;
  canInvest?: boolean;
  affordableShares?: number;
  userBudget?: number;
}

// === Computed/UI types ===

export interface InvestmentWithMetrics extends Investment {
  totalValue: number;
  gainLoss: number;
  gainLossPercent: number;
}

export interface DashboardData {
  investments: Investment[];
  debts: Debt[];
  goals: FinancialGoal[];
  activities: ActivityLog[];
}
