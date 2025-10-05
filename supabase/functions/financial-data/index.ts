import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
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

    // Use Yahoo Finance API to get financial data
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${interval}&range=${period}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
    });

    if (!response.ok) {
      console.error('Yahoo Finance API error:', response.status);
      throw new Error('FINANCIAL_DATA_UNAVAILABLE');
    }

    const data = await response.json();
    
    // Extract and format the data
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
      ? 'Unable to fetch financial data at this time'
      : 'An error occurred while processing your request';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
