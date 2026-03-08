import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from '../_shared/cors.ts';
import { authenticateRequest } from '../_shared/auth.ts';
import { errorResponse, handleEdgeFunctionError } from '../_shared/errors.ts';
import { stockInsightsSchema } from '../_shared/validators.ts';
import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Popular Indian stock symbols mapping for validation
const INDIAN_STOCK_SUFFIXES = ['.NS', '.BO'];
const POPULAR_INDIAN_STOCKS: Record<string, { name: string; exchange: string }> = {
  'RELIANCE.NS': { name: 'Reliance Industries Ltd', exchange: 'NSE' },
  'TCS.NS': { name: 'Tata Consultancy Services Ltd', exchange: 'NSE' },
  'INFY.NS': { name: 'Infosys Ltd', exchange: 'NSE' },
  'HDFCBANK.NS': { name: 'HDFC Bank Ltd', exchange: 'NSE' },
  'ICICIBANK.NS': { name: 'ICICI Bank Ltd', exchange: 'NSE' },
  'HINDUNILVR.NS': { name: 'Hindustan Unilever Ltd', exchange: 'NSE' },
  'SBIN.NS': { name: 'State Bank of India', exchange: 'NSE' },
  'BHARTIARTL.NS': { name: 'Bharti Airtel Ltd', exchange: 'NSE' },
  'ITC.NS': { name: 'ITC Ltd', exchange: 'NSE' },
  'KOTAKBANK.NS': { name: 'Kotak Mahindra Bank Ltd', exchange: 'NSE' },
  'LT.NS': { name: 'Larsen & Toubro Ltd', exchange: 'NSE' },
  'HCLTECH.NS': { name: 'HCL Technologies Ltd', exchange: 'NSE' },
  'AXISBANK.NS': { name: 'Axis Bank Ltd', exchange: 'NSE' },
  'WIPRO.NS': { name: 'Wipro Ltd', exchange: 'NSE' },
  'BAJFINANCE.NS': { name: 'Bajaj Finance Ltd', exchange: 'NSE' },
  'MARUTI.NS': { name: 'Maruti Suzuki India Ltd', exchange: 'NSE' },
  'TATAMOTORS.NS': { name: 'Tata Motors Ltd', exchange: 'NSE' },
  'SUNPHARMA.NS': { name: 'Sun Pharmaceutical Industries Ltd', exchange: 'NSE' },
  'TITAN.NS': { name: 'Titan Company Ltd', exchange: 'NSE' },
  'ADANIENT.NS': { name: 'Adani Enterprises Ltd', exchange: 'NSE' },
  'TATASTEEL.NS': { name: 'Tata Steel Ltd', exchange: 'NSE' },
  'POWERGRID.NS': { name: 'Power Grid Corporation of India Ltd', exchange: 'NSE' },
  'NTPC.NS': { name: 'NTPC Ltd', exchange: 'NSE' },
  'ONGC.NS': { name: 'Oil & Natural Gas Corporation Ltd', exchange: 'NSE' },
  'ASIANPAINT.NS': { name: 'Asian Paints Ltd', exchange: 'NSE' },
};

async function fetchStockData(symbol: string) {
  const symbolsToTry = [symbol];
  if (!symbol.includes('.')) {
    symbolsToTry.push(`${symbol}.NS`, `${symbol}.BO`);
  }

  for (const sym of symbolsToTry) {
    try {
      const stockUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?interval=1d&range=5d`;
      const stockResponse = await fetch(stockUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      });

      if (stockResponse.ok) {
        const stockData = await stockResponse.json();
        const result = stockData.chart?.result?.[0];
        if (result && result.meta) {
          return { result, queriedSymbol: sym };
        }
      }
    } catch (e) {
      console.error(`Failed to fetch ${sym}:`, e);
    }
  }
  return null;
}

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

    let parsed;
    try {
      parsed = stockInsightsSchema.parse(await req.json());
    } catch (e) {
      if (e instanceof z.ZodError) {
        return errorResponse(400, e.issues[0].message, corsHeaders);
      }
      throw e;
    }
    const { symbol, action, userBudget } = parsed;

    // Fetch stock data with fallback symbol resolution
    const stockResult = await fetchStockData(symbol.toUpperCase());

    if (!stockResult) {
      return errorResponse(400, `Stock symbol "${symbol}" not found. For Indian stocks, try: RELIANCE, TCS, INFY, HDFCBANK, SBIN, ITC, etc.`, corsHeaders);
    }

    const { result, queriedSymbol } = stockResult;
    const meta = result.meta;
    
    const currentPrice = meta.regularMarketPrice;
    const previousClose = meta.previousClose || meta.chartPreviousClose;
    const priceChange = currentPrice - previousClose;
    const priceChangePercent = previousClose ? (priceChange / previousClose) * 100 : 0;
    const currency = meta.currency || 'INR';
    const exchangeName = meta.exchangeName || 'NSE';
    const longName = meta.longName || POPULAR_INDIAN_STOCKS[queriedSymbol]?.name || queriedSymbol.replace('.NS', '').replace('.BO', '');
    const shortName = meta.shortName || longName;

    // If only validation is requested
    if (action === 'validate') {
      return new Response(
        JSON.stringify({ 
          isValid: true,
          symbol: queriedSymbol,
          shortName,
          name: longName,
          exchange: exchangeName
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If only price is requested
    if (action === 'price') {
      return new Response(
        JSON.stringify({ 
          isValid: true,
          symbol: queriedSymbol,
          shortName,
          currentPrice,
          previousClose,
          priceChange,
          priceChangePercent,
          currency,
          name: longName,
          exchange: exchangeName
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get AI insights using Lovable AI (Gemini)
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY not configured');
      return errorResponse(500, 'AI service not configured', corsHeaders);
    }

    const marketCap = meta.marketCap;
    const fiftyTwoWeekHigh = meta.fiftyTwoWeekHigh;
    const fiftyTwoWeekLow = meta.fiftyTwoWeekLow;

    const aiPrompt = `Analyze this Indian stock and provide investment insights:

Stock: ${longName} (${queriedSymbol})
Short Name: ${shortName}
Exchange: ${exchangeName}
Current Price: ₹${currentPrice}
Previous Close: ₹${previousClose}
Price Change: ${priceChangePercent.toFixed(2)}%
Currency: ${currency}
${marketCap ? `Market Cap: ₹${(marketCap / 10000000).toFixed(2)} Cr` : ''}
${fiftyTwoWeekHigh ? `52 Week High: ₹${fiftyTwoWeekHigh}` : ''}
${fiftyTwoWeekLow ? `52 Week Low: ₹${fiftyTwoWeekLow}` : ''}
${userBudget ? `User's Investment Budget: ₹${userBudget}` : ''}

Provide a concise analysis (max 200 words) covering:
1. Brief company overview (what the company does)
2. Current market sentiment (bullish/bearish/neutral based on price movement and 52-week range)
3. Risk assessment (Low/Moderate/High) with reason
4. Whether the user can invest with their budget and how many shares they can buy
5. Key factors to watch (upcoming events, sector trends, etc.)
6. Investment recommendation for Indian investors (Buy/Hold/Wait)

Be specific, actionable, and use ₹ for all amounts.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: 'You are a SEBI-registered financial advisor specializing in Indian stock markets (NSE/BSE). Provide clear, concise investment insights in simple language. Always use ₹ for currency. Always mention the stock\'s full name and ticker symbol.' },
          { role: 'user', content: aiPrompt }
        ],
        temperature: 0.7,
        max_tokens: 600
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return errorResponse(429, 'Rate limit exceeded. Please try again later.', corsHeaders);
      }
      if (aiResponse.status === 402) {
        return errorResponse(402, 'AI service requires payment. Please add credits.', corsHeaders);
      }
      console.error('AI API error:', aiResponse.status);
      return errorResponse(500, 'AI service error', corsHeaders);
    }

    const aiData = await aiResponse.json();
    const insights = aiData.choices?.[0]?.message?.content || 'Unable to generate insights at this time.';

    // Calculate affordability
    let canInvest = true;
    let affordableShares = 0;
    if (userBudget && userBudget > 0) {
      canInvest = userBudget >= currentPrice;
      affordableShares = Math.floor(userBudget / currentPrice);
    }

    const responseData = {
      isValid: true,
      symbol: queriedSymbol,
      shortName,
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
    return handleEdgeFunctionError(error, corsHeaders);
  }
});
