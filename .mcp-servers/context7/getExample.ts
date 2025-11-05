import { callMCP } from '../client';

export interface GetExampleInput {
  library: string;    // e.g., "express", "sharp"
  topic: string;      // e.g., "file upload middleware", "image resize"
  language?: string;  // e.g., "typescript", "javascript"
}

export interface GetExampleOutput {
  code: string;       // Example code
  explanation: string;// Code explanation
  source: string;     // Source URL
}

/**
 * Get code examples for a specific library/topic
 *
 * Fetches real, working code examples from official documentation
 * and trusted sources.
 *
 * @example
 * const example = await getExample({
 *   library: 'express',
 *   topic: 'file upload with multer',
 *   language: 'typescript'
 * });
 * console.log(example.code);
 *
 * @example
 * // Get Sharp image compression example
 * const sharpExample = await getExample({
 *   library: 'sharp',
 *   topic: 'compress jpeg with quality'
 * });
 */
export async function getExample(
  input: GetExampleInput
): Promise<GetExampleOutput> {
  return callMCP<GetExampleOutput>('context7__get_example', input);
}
