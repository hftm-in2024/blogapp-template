import { app, HttpRequest, HttpResponseInit } from '@azure/functions';
import { proxyToBackend } from '../lib/proxy.js';
import { checkCsrf } from '../lib/csrf.js';
import { corsHeaders, handlePreflight } from '../lib/cors.js';

async function proxyEntryById(request: HttpRequest): Promise<HttpResponseInit> {
  const preflight = handlePreflight(request);
  if (preflight) return preflight;

  if (request.method === 'POST' || request.method === 'PUT' || request.method === 'DELETE') {
    const csrfError = checkCsrf(request);
    if (csrfError) return { ...csrfError, headers: corsHeaders };
  }

  const entryId = request.params.id;
  const path = `/entries/${entryId}`;

  const result = await proxyToBackend(request, path, request.method);

  return {
    status: result.status,
    jsonBody: result.body,
    headers: corsHeaders,
    cookies: result.cookies.length > 0 ? result.cookies : undefined,
  };
}

app.http('proxy-entry-by-id', {
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  authLevel: 'anonymous',
  route: 'entries/{id}',
  handler: proxyEntryById,
});
