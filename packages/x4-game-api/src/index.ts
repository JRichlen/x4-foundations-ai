/**
 * X4 Foundations Game API
 *
 * A comprehensive API for X4 Foundations game data integration.
 *
 * This package provides:
 * - Type definitions for X4 game data structures
 * - HTTP server to receive data from X4 game extension
 * - REST API endpoints for MCP server and other clients
 * - API client for consuming the REST API
 *
 * Architecture:
 * ```
 * X4 Game Extension (Lua/MD) → HTTP POST → X4 Game API Server
 *                                              ↓
 *                                         State Manager
 *                                              ↓
 * MCP Server / Clients ← HTTP GET ← REST API Endpoints
 * ```
 *
 * @packageDocumentation
 */

// Export types
export * from './types/index.js';

// Export server
export * from './server/index.js';

// Export client
export * from './client/index.js';
