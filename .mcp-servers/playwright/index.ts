/**
 * Playwright MCP Server
 *
 * Provides browser automation and UI testing capabilities.
 * Uses Playwright's accessibility tree for reliable element targeting.
 *
 * **Available Tools:**
 * - navigateTo: Navigate to a URL
 * - click: Click an element
 * - fill: Fill an input field
 * - screenshot: Take a screenshot
 *
 * **Installation:**
 * ```bash
 * npx @playwright/mcp@latest
 * ```
 *
 * **Cost:** FREE
 *
 * @see https://github.com/microsoft/playwright-mcp
 */

export { navigateTo, type NavigateToInput, type NavigateToOutput } from './navigateTo';
export { click, type ClickInput, type ClickOutput } from './click';
export { fill, type FillInput, type FillOutput } from './fill';
export { screenshot, type ScreenshotInput, type ScreenshotOutput } from './screenshot';
