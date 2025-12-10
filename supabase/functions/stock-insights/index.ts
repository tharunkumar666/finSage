import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface StockInsightsRequest {
  symbol: string;
  action?: 'validate' | 'insights' | 'price' | 'all';
  userBudget?: number;
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

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Invalid authentication token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { symbol, action = 'all', userBudget } = await req.json() as StockInsightsRequest;

    if (!symbol) {
      return new Response(
        JSON.stringify({ error: 'Symbol is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch stock data from Yahoo Finance
    const stockUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
    
    const stockResponse = await fetch(stockUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });

    if (!stockResponse.ok) {
      return new Response(
        JSON.stringify({ 
          error: 'Invalid stock symbol or data unavailable',
          isValid: false 
        }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stockData = await stockResponse.json();
    const result = stockData.chart.result[0];
    const meta = result.meta;
    
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose;
    const priceChange = currentPrice - previousClose;
    const priceChangePercent = (priceChange / previousClose) * 100;
    const currency = meta.currency;
    const exchangeName = meta.exchangeName;
    const longName = meta.longName || symbol;

    // If only validation or price is requested
    if (action === 'validate') {
      return new Response(
        JSON.stringify({ 
          isValid: true,
          symbol: meta.symbol,
          name: longName,
          exchange: exchangeName
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (action === 'price') {
      return new Response(
        JSON.stringify({ 
          currentPrice,
          previousClose,
          priceChange,
          priceChangePercent,
          currency,
          name: longName
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get AI insights using Lovable AI (Gemini)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return new Response(
        JSON.stringify({ error: 'AI service not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const marketCap = meta.marketCap;
    const fiftyTwoWeekHigh = meta.fiftyTwoWeekHigh;
    const fiftyTwoWeekLow = meta.fiftyTwoWeekLow;

    const aiPrompt = `Analyze this stock and provide investment insights:

Stock: ${longName} (${symbol})
Exchange: ${exchangeName}
Current Price: ${currentPrice} ${currency}
Previous Close: ${previousClose} ${currency}
Price Change: ${priceChangePercent.toFixed(2)}%
${marketCap ? `Market Cap: ${marketCap}` : ''}
${fiftyTwoWeekHigh ? `52 Week High: ${fiftyTwoWeekHigh}` : ''}
${fiftyTwoWeekLow ? `52 Week Low: ${fiftyTwoWeekLow}` : ''}

Provide a concise analysis (max 150 words) covering:
1. Brief company overview
2. Current market sentiment (based on price movement)
3. Risk assessment (Low/Moderate/High)
4. Investment recommendation for Indian investors
5. Key factors to consider

Be specific and actionable.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: 'You are a financial advisor specializing in Indian stock markets. Provide clear, concise investment insights.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.7,
        max_tokens: 500
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI service requires payment. Please add credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      console.error('AI API error:', aiResponse.status);
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices?.[0]?.message?.content || 'Unable to generate insights at this time.';

    // Check if user can invest
    let canInvest = true;
    let affordableShares = 0;
    if (userBudget && userBudget > 0) {
      canInvest = userBudget >= currentPrice;
      affordableShares = Math.floor(userBudget / currentPrice);
    }

    const responseData = {
      isValid: true,
      symbol: meta.symbol,
      name: longName,
      exchange: exchangeName,
      currentPrice,
      previousClose,
      priceChange,
      priceChangePercent,
      currency,
      marketCap,
      fiftyTwoWeekHigh,
      fiftyTwoWeekLow,
      insights,
      canInvest,
      affordableShares,
      userBudget
    };

    return new Response(
      JSON.stringify(responseData),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in stock-insights:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An error occurred',
        isValid: false
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
