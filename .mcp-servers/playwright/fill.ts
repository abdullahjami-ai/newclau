import { callMCP } from '../client';

export interface FillInput {
  selector: string;         // CSS selector for input field
  value: string;            // Value to fill
  timeout?: number;         // Timeout in ms
}

export interface FillOutput {
  success: boolean;
  filled: boolean;
  selector: string;
  value: string;
}

/**
 * Fill an input field
 *
 * Types text into an input, textarea, or contenteditable element.
 *
 * @example
 * await fill({
 *   selector: 'input[type="email"]',
 *   value: 'test@example.com'
 * });
 *
 * @example
 * // Fill by label
 * await fill({
 *   selector: 'text=Email Address',
 *   value: 'user@test.com'
 * });
 */
export async function fill(
  input: FillInput
): Promise<FillOutput> {
  return callMCP<FillOutput>('playwright__fill', input);
}
