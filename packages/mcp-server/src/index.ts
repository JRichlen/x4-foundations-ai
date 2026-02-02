/**
 * MCP Server for X4 Foundations AI Assistant
 *
 * This server implements the Model Context Protocol to provide AI-accessible
 * tools for X4 game data via the X4 REST Server.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { config } from 'dotenv';

// Load environment variables
config();

interface EchoArgs {
  message?: string;
}

/**
 * MCP Server Implementation
 * Phase 2: This will be expanded with X4 REST API integration
 */
class X4MCPServer {
  private server: Server;

  constructor() {
    this.server = new Server(
      {
        name: 'x4-foundations-mcp',
        version: '0.1.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, () => {
      return {
        tools: [
          {
            name: 'echo',
            description: 'Echo back the input (placeholder tool)',
            inputSchema: {
              type: 'object',
              properties: {
                message: {
                  type: 'string',
                  description: 'Message to echo back',
                },
              },
              required: ['message'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'echo': {
          const echoArgs = args as EchoArgs;
          const message = echoArgs?.message ?? 'No message provided';
          return {
            content: [
              {
                type: 'text',
                text: `Echo: ${message}`,
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    });
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('X4 MCP Server running on stdio');
  }
}

// Start the server
const server = new X4MCPServer();
server.start().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
