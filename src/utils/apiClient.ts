/**
 * Safe API client helper that prevents crashes from empty or invalid JSON responses.
 * Strictly adheres to response validation:
 * 1. Checks response.ok before parsing body.
 * 2. Prevents crashes on empty or non-JSON responses.
 * 3. Logs detailed errors only in the console.
 * 4. Returns user-friendly error messages.
 */
export async function postApiJson<T = any>(
  endpoint: string,
  payload: any,
  defaultErrorMessage = 'Unable to generate prompt. Please try again.'
): Promise<T> {
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    // Check response.ok BEFORE attempting JSON parse
    if (!response.ok) {
      let userFriendlyMessage = defaultErrorMessage;
      try {
        const errText = await response.text();
        if (errText && errText.trim().length > 0) {
          const errJson = JSON.parse(errText);
          if (errJson && typeof errJson.error === 'string') {
            userFriendlyMessage = errJson.error;
          }
        }
      } catch (parseErr) {
        console.error('Error parsing error response text:', parseErr);
      }
      throw new Error(userFriendlyMessage);
    }

    // Response is OK; read text safely to prevent unexpected end of JSON input
    const text = await response.text();
    if (!text || text.trim().length === 0) {
      throw new Error(defaultErrorMessage);
    }

    let data: any;
    try {
      data = JSON.parse(text);
    } catch (jsonErr) {
      console.error('Failed to parse response body as JSON:', jsonErr);
      throw new Error(defaultErrorMessage);
    }

    if (data && data.success === false) {
      throw new Error(data.error || defaultErrorMessage);
    }

    return data as T;
  } catch (err: any) {
    // Log detailed technical error strictly in console
    console.error(`API Call Exception [${endpoint}]:`, err);
    throw new Error(
      typeof err?.message === 'string' && err.message.trim().length > 0
        ? err.message
        : defaultErrorMessage
    );
  }
}
