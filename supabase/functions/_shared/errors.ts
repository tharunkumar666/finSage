export function errorResponse(
  status: number,
  message: string,
  corsHeaders: Record<string, string>
): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

export function handleEdgeFunctionError(
  error: unknown,
  corsHeaders: Record<string, string>
): Response {
  const status = typeof error === 'object' && error !== null && 'status' in error
    ? (error as { status: number }).status
    : 500;
  const message = typeof error === 'object' && error !== null && 'message' in error
    ? (error as { message: string }).message
    : 'An unexpected error occurred';

  return errorResponse(status, message, corsHeaders);
}
