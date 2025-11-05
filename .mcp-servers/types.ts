/**
 * Shared TypeScript types for MCP servers
 */

export interface MCPToolMetadata {
  name: string;
  description: string;
  server: string;
  parameters: Record<string, any>;
}

export interface MCPError {
  code: string;
  message: string;
  details?: any;
}

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export interface SecurityVulnerability {
  package: string;
  version: string;
  severity: Severity;
  title: string;
  description?: string;
  fixAvailable: boolean;
  fix?: string;
  cve?: string;
}
