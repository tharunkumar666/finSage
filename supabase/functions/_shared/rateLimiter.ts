import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export interface RateLimitConfig {
  perMinute: number;
  daily: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfter?: number;
}

const TIER_LIMITS: Record<string, { free: RateLimitConfig; premium: RateLimitConfig }> = {
  'ai-advisor': { free: { perMinute: 3, daily: 5 }, premium: { perMinute: 10, daily: 50 } },
  'stock-insights': { free: { perMinute: 5, daily: 10 }, premium: { perMinute: 15, daily: 100 } },
  'financial-data': { free: { perMinute: 10, daily: 50 }, premium: { perMinute: 30, daily: 200 } },
};

export function getLimitsForEndpoint(endpoint: string, isPremium = false): RateLimitConfig {
  const config = TIER_LIMITS[endpoint];
  if (!config) return { perMinute: 5, daily: 20 };
  return isPremium ? config.premium : config.free;
}

export async function checkRateLimit(
  supabaseClient: ReturnType<typeof createClient>,
  userId: string,
  endpoint: string,
  isPremium = false
): Promise<RateLimitResult> {
  const limits = getLimitsForEndpoint(endpoint, isPremium);

  // Check per-minute limit
  const { data: minuteAllowed, error: minuteError } = await supabaseClient.rpc('check_rate_limit', {
    p_user_id: userId,
    p_endpoint: `${endpoint}_per_minute`,
    p_max_requests: limits.perMinute,
    p_window_seconds: 60,
  });

  if (minuteError) {
    console.error('Rate limit check error (minute):', minuteError);
    // Fail open — allow request if rate limit check itself fails
    return { allowed: true };
  }

  if (!minuteAllowed) {
    return { allowed: false, retryAfter: 60 };
  }

  // Check daily limit
  const { data: dailyAllowed, error: dailyError } = await supabaseClient.rpc('check_rate_limit', {
    p_user_id: userId,
    p_endpoint: `${endpoint}_daily`,
    p_max_requests: limits.daily,
    p_window_seconds: 86400,
  });

  if (dailyError) {
    console.error('Rate limit check error (daily):', dailyError);
    return { allowed: true };
  }

  if (!dailyAllowed) {
    return { allowed: false, retryAfter: 3600 };
  }

  return { allowed: true };
}
