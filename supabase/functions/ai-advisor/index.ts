import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AIAdvisorRequest {
  query: string;
  context?: {
    investments?: any[];
    debts?: any[];
    goals?: any[];
    riskProfile?: string;
  };
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

    const { query, context } = await req.json() as AIAdvisorRequest;
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
        model: 'google/gemini-2.5-flash',
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
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
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
    
    let errorMessage = 'An error occurred while processing your request';
    if (error.message === 'AI_SERVICE_UNAVAILABLE') {
      errorMessage = 'AI service is temporarily unavailable. Please try again later.';
    } else if (error.message === 'AI_NO_RESPONSE') {
      errorMessage = 'Unable to generate a response. Please try again.';
    } else if (error.message === 'LOVABLE_API_KEY is not configured') {
      errorMessage = 'Service configuration error. Please contact support.';
    } else if (error.message === 'Query is required') {
      errorMessage = 'Please provide a question for the AI advisor.';
    }
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
