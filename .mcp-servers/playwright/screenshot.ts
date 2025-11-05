import { callMCP } from '../client';

export interface ScreenshotInput {
  fullPage?: boolean;       // Capture full scrollable page
  selector?: string;        // Screenshot specific element only
  path?: string;            // File path to save (optional)
}

export interface ScreenshotOutput {
  success: boolean;
  base64: string;           // Base64-encoded image
  path?: string;            // File path if saved
  width: number;
  height: number;
}

/**
 * Take a screenshot
 *
 * Captures a screenshot of the current page or specific element.
 * Returns base64-encoded image data.
 *
 * @example
 * const screenshot = await screenshot({
 *   fullPage: true,
 *   path: './screenshots/homepage.png'
 * });
 *
 * @example
 * // Screenshot specific element
 * const buttonImage = await screenshot({
 *   selector: 'button.compress-btn'
 * });
 */
export async function screenshot(
  input: ScreenshotInput = {}
): Promise<ScreenshotOutput> {
  return callMCP<ScreenshotOutput>('playwright__screenshot', input);
}
