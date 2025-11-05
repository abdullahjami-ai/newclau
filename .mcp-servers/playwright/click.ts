import { callMCP } from '../client';

export interface ClickInput {
  selector: string;         // CSS selector or text
  timeout?: number;         // Timeout in ms (default: 30000)
  waitForNavigation?: boolean;  // Wait for page navigation after click
}

export interface ClickOutput {
  success: boolean;
  clicked: boolean;
  selector: string;
  navigated?: boolean;
}

/**
 * Click an element on the page
 *
 * Finds an element by selector and clicks it.
 * Uses Playwright's accessibility tree for reliable targeting.
 *
 * @example
 * await click({
 *   selector: 'button[type="submit"]',
 *   waitForNavigation: true
 * });
 *
 * @example
 * // Click by text
 * await click({
 *   selector: 'text=Compress Image'
 * });
 */
export async function click(
  input: ClickInput
): Promise<ClickOutput> {
  return callMCP<ClickOutput>('playwright__click', input);
}
