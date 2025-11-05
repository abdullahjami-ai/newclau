import { callMCP } from '../client';

export interface NavigateToInput {
  url: string;              // URL to navigate to
  waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
  timeout?: number;         // Timeout in ms (default: 30000)
}

export interface NavigateToOutput {
  success: boolean;
  url: string;              // Final URL (after redirects)
  title: string;            // Page title
  loadTime: number;         // Load time in ms
}

/**
 * Navigate to a URL
 *
 * Opens a webpage in a browser controlled by Playwright.
 * Useful for testing web applications.
 *
 * @example
 * const result = await navigateTo({
 *   url: 'https://front-end-production-8703.up.railway.app',
 *   waitUntil: 'networkidle'
 * });
 * console.log(`Loaded ${result.title} in ${result.loadTime}ms`);
 */
export async function navigateTo(
  input: NavigateToInput
): Promise<NavigateToOutput> {
  return callMCP<NavigateToOutput>('playwright__navigate_to', input);
}
