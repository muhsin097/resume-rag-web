import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// Mocked before importing the module under test so apiFetch/apiFetchJson
// never touch the real NextAuth config (which needs real provider env
// vars) -- this is a unit test of the request-shaping/error-handling
// logic, not an integration test of NextAuth itself.
const mockAuth = vi.fn();
vi.mock('@/auth', () => ({ auth: mockAuth }));

const { apiFetch, apiFetchJson, isApiUnavailable } = await import('./api');

describe('isApiUnavailable', () => {
  it('is true only for the specific API_UNAVAILABLE sentinel error', () => {
    expect(isApiUnavailable(new Error('API_UNAVAILABLE'))).toBe(true);
    expect(isApiUnavailable(new Error('something else'))).toBe(false);
    expect(isApiUnavailable('API_UNAVAILABLE')).toBe(false); // not an Error instance
    expect(isApiUnavailable(null)).toBe(false);
  });
});

describe('apiFetch', () => {
  const originalFetch = global.fetch;
  const originalBaseUrl = process.env.RESUME_API_BASE_URL;

  beforeEach(() => {
    process.env.RESUME_API_BASE_URL = 'https://api.test.invalid';
    mockAuth.mockReset();
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.RESUME_API_BASE_URL = originalBaseUrl;
  });

  it('attaches the session access token as a Bearer header when present', async () => {
    mockAuth.mockResolvedValue({ accessToken: 'test-token-123' });
    const fetchSpy = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    global.fetch = fetchSpy;

    await apiFetch('/users/me');

    const [url, init] = fetchSpy.mock.calls[0]!;
    expect(url).toBe('https://api.test.invalid/users/me');
    const headers = init.headers as Headers;
    expect(headers.get('Authorization')).toBe('Bearer test-token-123');
  });

  it('sends no Authorization header when there is no session', async () => {
    mockAuth.mockResolvedValue(null);
    const fetchSpy = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    global.fetch = fetchSpy;

    await apiFetch('/public/thing');

    const [, init] = fetchSpy.mock.calls[0]!;
    const headers = init.headers as Headers;
    expect(headers.has('Authorization')).toBe(false);
  });

  it('sets Content-Type: application/json for a plain body', async () => {
    mockAuth.mockResolvedValue(null);
    const fetchSpy = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    global.fetch = fetchSpy;

    await apiFetch('/thing', { method: 'POST', body: JSON.stringify({ a: 1 }) });

    const [, init] = fetchSpy.mock.calls[0]!;
    const headers = init.headers as Headers;
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('leaves Content-Type unset for a FormData body (fetch sets its own multipart boundary)', async () => {
    mockAuth.mockResolvedValue(null);
    const fetchSpy = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    global.fetch = fetchSpy;

    await apiFetch('/upload', { method: 'POST', body: new FormData() });

    const [, init] = fetchSpy.mock.calls[0]!;
    const headers = init.headers as Headers;
    expect(headers.has('Content-Type')).toBe(false);
  });

  it('throws the API_UNAVAILABLE sentinel when fetch itself throws (DNS/connection failure)', async () => {
    mockAuth.mockResolvedValue(null);
    global.fetch = vi.fn().mockRejectedValue(new TypeError('fetch failed'));

    await expect(apiFetch('/anything')).rejects.toThrow('API_UNAVAILABLE');
  });

  it('does NOT treat a real HTTP error response (4xx/5xx) as API_UNAVAILABLE', async () => {
    mockAuth.mockResolvedValue(null);
    global.fetch = vi.fn().mockResolvedValue(new Response('{"message":"nope"}', { status: 404 }));

    const res = await apiFetch('/missing');
    expect(res.status).toBe(404);
  });
});

describe('apiFetchJson', () => {
  const originalFetch = global.fetch;
  const originalBaseUrl = process.env.RESUME_API_BASE_URL;

  beforeEach(() => {
    process.env.RESUME_API_BASE_URL = 'https://api.test.invalid';
    mockAuth.mockReset();
    mockAuth.mockResolvedValue(null);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.RESUME_API_BASE_URL = originalBaseUrl;
  });

  it('returns the parsed body on a 2xx response', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response(JSON.stringify({ hello: 'world' }), { status: 200 }));

    const result = await apiFetchJson<{ hello: string }>('/thing');
    expect(result).toEqual({ hello: 'world' });
  });

  // This is the exact production bug this function was written to
  // prevent: an unchecked 401 JSON error body ({message, statusCode})
  // used to parse "successfully" and crash far away at the point it was
  // actually used (e.g. "items.filter is not a function"), with nothing
  // pointing back at the real cause. apiFetchJson must throw immediately
  // at the call site instead.
  it('throws a clear error (not the raw error body) on a non-ok response', async () => {
    // A fresh Response per call -- Response bodies are single-use
    // streams, so reusing one instance across two awaited calls would
    // make the second .json() read silently fail.
    global.fetch = vi
      .fn()
      .mockImplementation(
        async () => new Response(JSON.stringify({ message: 'Unauthorized', statusCode: 401 }), { status: 401 }),
      );

    await expect(apiFetchJson('/users/me')).rejects.toThrow(/401/);
    await expect(apiFetchJson('/users/me')).rejects.toThrow(/Unauthorized/);
  });

  it('still throws a clear error if the non-ok response body is not valid JSON', async () => {
    global.fetch = vi.fn().mockResolvedValue(new Response('<html>502</html>', { status: 502 }));

    await expect(apiFetchJson('/users/me')).rejects.toThrow(/502/);
  });
});
