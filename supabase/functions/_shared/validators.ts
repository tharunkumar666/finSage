import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

export const aiAdvisorSchema = z.object({
  query: z.string().min(1, 'Query is required').max(2000, 'Query too long').trim(),
  context: z.object({
    investments: z.array(z.any()).optional(),
    debts: z.array(z.any()).optional(),
    goals: z.array(z.any()).optional(),
    riskProfile: z.string().optional(),
  }).optional(),
});

export const stockInsightsSchema = z.object({
  symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.]+$/, 'Invalid symbol format'),
  action: z.enum(['validate', 'insights', 'price', 'all']).default('all'),
  userBudget: z.number().positive().optional(),
});

export const financialDataSchema = z.object({
  symbol: z.string().min(1).max(20).regex(/^[A-Za-z0-9.]+$/, 'Invalid symbol format'),
  period: z.enum(['1d', '5d', '1mo', '3mo', '6mo', '1y']).default('1mo'),
  interval: z.enum(['1m', '5m', '15m', '1h', '1d']).default('1d'),
});
