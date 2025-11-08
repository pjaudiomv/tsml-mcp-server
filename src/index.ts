#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { TsmlApiClient } from './client.js';
import { createTsmlTools, handleToolCall } from './tools.js';

// Server configuration
const SERVER_NAME = 'tsml-mcp-server';
const SERVER_VERSION = '1.0.0';

async function main() {
  // Get configuration from environment variables
  const wordpressUrl = process.env.TSML_WORDPRESS_URL;
  
  if (!wordpressUrl) {
    console.error('Error: TSML_WORDPRESS_URL environment variable is required');
    console.error('Example: TSML_WORDPRESS_URL=https://example.org');
    process.exit(1);
  }

  // Initialize TSML API client
  const client = new TsmlApiClient({
    wordpressUrl,
    apiKey: process.env.TSML_API_KEY, // Optional API key
    timeout: parseInt(process.env.TSML_TIMEOUT || '30000', 10),
    userAgent: process.env.TSML_USER_AGENT || `${SERVER_NAME}/${SERVER_VERSION}`
  });

  // Create MCP server
  const server = new Server(
    {
      name: SERVER_NAME,
      version: SERVER_VERSION,
    },
    {
      capabilities: {
        tools: {},
      },
    }
  );

  // Get available tools
  const tools = createTsmlTools(client);

  // List tools handler
  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools,
    };
  });

  // Call tool handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      const result = await handleToolCall(client, name, args || {});
      
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    } catch (error) {
      console.error(`Error calling tool ${name}:`, error);
      
      if (error instanceof Error) {
        throw new McpError(
          ErrorCode.InternalError,
          `Failed to call tool ${name}: ${error.message}`
        );
      }
      
      throw new McpError(
        ErrorCode.InternalError,
        `Unknown error calling tool ${name}`
      );
    }
  });

  // Error handling
  server.onerror = (error) => {
    console.error('[MCP Error]', error);
  };

  process.on('SIGINT', async () => {
    console.log('Shutting down TSML MCP server...');
    await server.close();
    process.exit(0);
  });

  // Start server
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  console.error(`TSML MCP Server started successfully!`);
  console.error(`Connected to WordPress site: ${wordpressUrl}`);
  console.error(`Available tools: ${tools.length}`);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

// Run the server
main().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
