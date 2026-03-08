import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

interface FinancialDataRequest {
  symbol: string;
  period?: string;
  interval?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify authentication and validate JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      console.error('JWT validation failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid or expired authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { symbol, period = '1mo', interval = '1d' } = await req.json() as FinancialDataRequest;

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

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
    const errorMessage = error.message === 'FINANCIAL_DATA_UNAVAILABLE' 
      ? 'Unable to fetch financial data. For Indian stocks, try symbols like RELIANCE, TCS, INFY, HDFCBANK'
      : 'An error occurred while processing your request';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
