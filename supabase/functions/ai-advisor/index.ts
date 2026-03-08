import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { getCorsHeaders } from '../_shared/cors.ts';
import { authenticateRequest } from '../_shared/auth.ts';
import { errorResponse, handleEdgeFunctionError } from '../_shared/errors.ts';
import { aiAdvisorSchema } from '../_shared/validators.ts';
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

    let parsed;
    try {
      parsed = aiAdvisorSchema.parse(await req.json());
    } catch (e) {
      if (e instanceof z.ZodError) {
        return errorResponse(400, e.issues[0].message, corsHeaders);
      }
      throw e;
    }
    const { query, context } = parsed;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Build context string from user data
    let contextString = '';
    if (context) {
      if (context.riskProfile) {
        contextString += `User's risk profile: ${context.riskProfile}\n`;
      }
      if (context.investments && context.investments.length > 0) {
        contextString += `Current investments: ${JSON.stringify(context.investments)}\n`;
      }
      if (context.debts && context.debts.length > 0) {
        contextString += `Current debts: ${JSON.stringify(context.debts)}\n`;
      }
      if (context.goals && context.goals.length > 0) {
        contextString += `Financial goals: ${JSON.stringify(context.goals)}\n`;
      }
    }

    const systemPrompt = `You are a professional financial advisor AI assistant specializing in the Indian financial market. Provide clear, actionable financial advice tailored for Indian investors and the Indian economy.

INDIAN MARKET CONTEXT:
- Focus on Indian investment instruments: NSE/BSE stocks, mutual funds, PPF, EPF, NPS, Indian bonds, gold, fixed deposits
- Consider Indian tax regulations: Section 80C deductions, LTCG/STCG tax rates, tax-saving instruments
- Reference Indian financial institutions: SEBI, RBI, Indian banks, AMCs
- Use INR (₹) for all monetary values and examples
- Consider Indian inflation rates, GDP growth, and economic indicators
- Recommend Indian-specific platforms and services when relevant
- Be aware of Indian financial regulations and compliance requirements

INVESTMENT RECOMMENDATIONS:
- Suggest diversification across Indian equity, debt, gold, and real estate
- Recommend tax-efficient investment strategies under Indian tax laws
- Consider Indian mutual fund categories: large-cap, mid-cap, small-cap, ELSS, debt funds
- Advise on SIP (Systematic Investment Plans) as a primary investment method
- Factor in Indian market volatility and sector-specific risks

Always consider risk management, rupee cost averaging, and diversification. Never guarantee returns or make promises about investment performance. Provide advice compliant with SEBI regulations.

${contextString}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: query }
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      console.error('AI Gateway error:', response.status);
      
      if (response.status === 429) {
        return errorResponse(429, 'Rate limit exceeded. Please try again later.', corsHeaders);
      }
      
      if (response.status === 402) {
        return errorResponse(402, 'Payment required. Please add credits to your workspace.', corsHeaders);
      }

      throw new Error('AI_SERVICE_UNAVAILABLE');
    }

    const data = await response.json();
    const advice = data.choices?.[0]?.message?.content;

    if (!advice) {
      throw new Error('AI_NO_RESPONSE');
    }

    return new Response(
      JSON.stringify({ advice }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI advisor function:', error);
    
    if (error.message === 'AI_SERVICE_UNAVAILABLE') {
      return errorResponse(500, 'AI service is temporarily unavailable. Please try again later.', corsHeaders);
    } else if (error.message === 'AI_NO_RESPONSE') {
      return errorResponse(500, 'Unable to generate a response. Please try again.', corsHeaders);
    } else if (error.message === 'LOVABLE_API_KEY is not configured') {
      return errorResponse(500, 'Service configuration error. Please contact support.', corsHeaders);
    }
    
    return handleEdgeFunctionError(error, corsHeaders);
  }
});
