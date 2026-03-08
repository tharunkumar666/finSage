import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from '../_shared/cors.ts';
import { authenticateRequest } from '../_shared/auth.ts';
import { errorResponse, handleEdgeFunctionError } from '../_shared/errors.ts';
import { checkRateLimit } from '../_shared/rateLimiter.ts';
import { financialDataSchema } from '../_shared/validators.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const contentLength = parseInt(req.headers.get('Content-Length') || '0', 10);
    if (contentLength > 10240) {
      return errorResponse(413, 'Request too large', corsHeaders);
    }

    const { user, supabaseClient } = await authenticateRequest(req);

    // Rate limit check
    const rateCheck = await checkRateLimit(supabaseClient, user.id, 'financial-data');
    if (!rateCheck.allowed) {
      return errorResponse(429, 'Rate limit exceeded. Try again later.', {
        ...corsHeaders,
        'Retry-After': String(rateCheck.retryAfter || 60),
      });
    }

    let parsed;
    try {
      parsed = financialDataSchema.parse(await req.json());
    } catch (e) {
      if (e instanceof z.ZodError) {
        return errorResponse(400, e.issues[0].message, corsHeaders);
      }
      throw e;
    }
    const { symbol, period, interval } = parsed;

    // Try symbol with .NS suffix for Indian stocks
    const symbolsToTry = [symbol];
    if (!symbol.includes('.')) {
      symbolsToTry.push(`${symbol}.NS`, `${symbol}.BO`);
    }

    let data = null;
    for (const sym of symbolsToTry) {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=${interval}&range=${period}`;
      const response = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (response.ok) {
        const json = await response.json();
        if (json.chart?.result?.[0]) {
          data = json;
          break;
        }
      }
    }

    if (!data) {
      throw new Error('FINANCIAL_DATA_UNAVAILABLE');
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp;
    const quote = result.indicators.quote[0];
    
    const formattedData = timestamps.map((timestamp: number, index: number) => ({
      date: new Date(timestamp * 1000).toISOString(),
      open: quote.open[index],
      high: quote.high[index],
      low: quote.low[index],
      close: quote.close[index],
      volume: quote.volume[index],
    }));

    const metadata = {
      symbol: result.meta.symbol,
      currency: result.meta.currency,
      exchangeName: result.meta.exchangeName,
      regularMarketPrice: result.meta.regularMarketPrice,
      previousClose: result.meta.previousClose,
      chartPreviousClose: result.meta.chartPreviousClose,
    };

    return new Response(
      JSON.stringify({ data: formattedData, metadata }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching financial data:', error);
    
    if (error.message === 'FINANCIAL_DATA_UNAVAILABLE') {
      return errorResponse(500, 'Unable to fetch financial data. For Indian stocks, try symbols like RELIANCE, TCS, INFY, HDFCBANK', corsHeaders);
    }
    
    return handleEdgeFunctionError(error, corsHeaders);
  }
});
