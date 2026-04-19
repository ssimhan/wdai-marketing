/**
 * Shared HTTP utilities for external API calls.
 * Handles timeout and error management.
 */

export interface HttpFetchOptions {
  method: 'POST' | 'PUT' | 'GET'
  headers: Record<string, string>
  body?: unknown
  timeoutMs?: number
}

/**
 * Fetch with automatic timeout and error handling.
 * @param url — API endpoint
 * @param options — HTTP options (method, headers, body, optional timeout)
 * @returns Response object if ok, throws otherwise
 * @throws Error if response is not ok or request times out
 */
export async function httpFetch(url: string, options: HttpFetchOptions): Promise<Response> {
  const timeoutMs = options.timeoutMs ?? 15_000
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(url, {
      method: options.method,
      headers: options.headers,
      body: options.body ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    })
  } finally {
    clearTimeout(timeout)
  }

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  return response
}
