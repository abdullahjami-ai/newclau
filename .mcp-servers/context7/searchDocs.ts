import { callMCP } from '../client';

export interface SearchDocsInput {
  library: string;    // e.g., "sharp", "react", "express"
  query: string;      // e.g., "image compression", "hooks"
  version?: string;   // Optional: specific version
}

export interface SearchDocsOutput {
  content: string;    // Documentation content
  url: string;        // Source URL
  version: string;    // Documentation version
}

/**
 * Search documentation for a specific library
 *
 * Uses Context7 MCP to fetch up-to-date, version-specific documentation
 * from official sources. This helps avoid hallucinations and outdated APIs.
 *
 * @example
 * const docs = await searchDocs({
 *   library: 'sharp',
 *   query: 'resize images batch processing'
 * });
 * console.log(docs.content);
 *
 * @example
 * // Get React hooks documentation
 * const reactDocs = await searchDocs({
 *   library: 'react',
 *   query: 'useState useEffect',
 *   version: '18.2.0'
 * });
 */
export async function searchDocs(
  input: SearchDocsInput
): Promise<SearchDocsOutput> {
  return callMCP<SearchDocsOutput>('context7__search_docs', input);
}
