import { APIResponse } from '@playwright/test';

// Assertion failure messages for response.ok() checks otherwise just say
// "Received: false" with no indication of the actual status/body, which
// makes CI failures hard to diagnose without re-running locally.
export async function describeResponse(response: APIResponse): Promise<string> {
  const body = await response.text();
  return `status=${response.status()} ${response.statusText()} body=${body.slice(0, 500)}`;
}
