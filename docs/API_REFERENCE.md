# API Reference

## X4 Foundations AI Assistant

**Version:** 1.0.0  
**Status:** Work in Progress  
**Last Updated:** 2026-02-02

---

## Overview

This document provides API reference documentation for the X4 Foundations AI Assistant components.

---

## MCP Server API

### Status: To Be Implemented (Phase 2)

The MCP Server will implement the Model Context Protocol to provide AI-accessible tools for X4 game data.

#### Planned Tools

##### `get_player_info`

Get information about the player character.

**Parameters:** None

**Returns:**

```typescript
{
  name: string;
  credits: number;
  faction: string;
  reputation: Record<string, number>;
}
```

**Status:** Not implemented

---

##### `list_stations`

List all stations in the game.

**Parameters:**

```typescript
{
  sector?: string;  // Optional sector filter
  owner?: string;   // Optional owner filter
}
```

**Returns:**

```typescript
{
  stations: Array<{
    id: string;
    name: string;
    sector: string;
    owner: string;
    type: string;
  }>;
}
```

**Status:** Not implemented

---

##### `get_station_details`

Get detailed information about a specific station.

**Parameters:**

```typescript
{
  stationId: string;
}
```

**Returns:**

```typescript
{
  id: string;
  name: string;
  sector: string;
  owner: string;
  modules: Array<{
    type: string;
    count: number;
  }>;
  storage: Record<string, number>;
}
```

**Status:** Not implemented

---

##### `list_ships`

List ships owned by the player.

**Parameters:**

```typescript
{
  type?: string;     // Optional ship type filter
  sector?: string;   // Optional sector filter
}
```

**Returns:**

```typescript
{
  ships: Array<{
    id: string;
    name: string;
    type: string;
    sector: string;
    status: string;
  }>;
}
```

**Status:** Not implemented

---

##### `get_ship_details`

Get detailed information about a specific ship.

**Parameters:**

```typescript
{
  shipId: string;
}
```

**Returns:**

```typescript
{
  id: string;
  name: string;
  type: string;
  sector: string;
  hull: number;
  shields: number;
  cargo: Record<string, number>;
  crew: number;
}
```

**Status:** Not implemented

---

## X4 REST Client

### Status: To Be Implemented (Phase 2)

TypeScript client for communicating with X4 REST Server.

#### Planned Methods

##### `connect()`

Establish connection to X4 REST Server.

**Parameters:**

```typescript
{
  baseUrl: string;
  apiKey?: string;
}
```

**Returns:** `Promise<void>`

**Status:** Not implemented

---

##### `request()`

Make a REST API request.

**Parameters:**

```typescript
{
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: unknown;
}
```

**Returns:** `Promise<T>`

**Status:** Not implemented

---

## Overlay Components

### Status: To Be Implemented (Phase 3)

React components for the browser overlay.

#### Planned Components

##### `<ChatInterface />`

Main chat interface component.

**Props:**

```typescript
{
  onMessage: (message: string) => void;
  messages: Message[];
  isLoading?: boolean;
}
```

**Status:** Not implemented

---

##### `<DataDisplay />`

Component for displaying game data.

**Props:**

```typescript
{
  data: Record<string, unknown>;
  type: 'station' | 'ship' | 'player';
}
```

**Status:** Not implemented

---

## WebSocket Events

### Status: To Be Implemented (Phase 3)

WebSocket events for overlay communication.

#### Client → Server

##### `chat_message`

Send a chat message.

**Payload:**

```typescript
{
  message: string;
  context?: Record<string, unknown>;
}
```

---

##### `subscribe_updates`

Subscribe to real-time updates.

**Payload:**

```typescript
{
  type: 'station' | 'ship' | 'player';
  id?: string;
}
```

---

#### Server → Client

##### `chat_response`

Receive AI response.

**Payload:**

```typescript
{
  message: string;
  toolCalls?: Array<{
    tool: string;
    result: unknown;
  }>;
}
```

---

##### `data_update`

Receive data update.

**Payload:**

```typescript
{
  type: string;
  id: string;
  data: Record<string, unknown>;
}
```

---

## Error Handling

### Error Types

All APIs will use consistent error types:

```typescript
interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}
```

### Common Error Codes

- `CONNECTION_ERROR`: Cannot connect to service
- `AUTHENTICATION_ERROR`: Invalid credentials
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Invalid input parameters
- `TIMEOUT`: Request timeout
- `INTERNAL_ERROR`: Internal server error

---

## Rate Limiting

### MCP Server

- Default: 100 requests/minute per client
- Burst: 10 requests/second

### X4 REST API

- Follows X4 REST Server limits
- Implements exponential backoff

---

## Authentication

### To Be Determined (Phase 2)

Authentication mechanism to be defined based on X4 REST Server capabilities.

Possible approaches:

- API key authentication
- Session tokens
- OAuth (if supported)

---

## Versioning

### API Versioning Strategy

- Semantic versioning (semver)
- Breaking changes increment major version
- Backward compatibility maintained for one major version

---

## Examples

### Example: Get Player Info (Planned)

```typescript
import { MCPClient } from '@x4-ai/mcp-server';

const client = new MCPClient({ baseUrl: 'http://localhost:3000' });

const playerInfo = await client.executeTool('get_player_info', {});
console.log(playerInfo);
// Output: { name: "Player", credits: 1000000, ... }
```

### Example: React Component (Planned)

```typescript
import { useChat } from '@ai-sdk/react';
import { ChatInterface } from '@x4-ai/overlay';

export function MyOverlay() {
  const { messages, input, handleSubmit } = useChat({
    api: '/api/chat',
  });

  return <ChatInterface messages={messages} onMessage={handleSubmit} />;
}
```

---

## Testing

### API Testing Guidelines

- All public APIs must have unit tests
- Integration tests for API interactions
- Mock X4 REST Server for testing
- Test error scenarios

---

## Contributing

When adding new APIs:

1. Update this document with API specification
2. Include TypeScript types
3. Add examples
4. Write comprehensive tests
5. Update CHANGELOG

---

## References

- [PRD Document](./PRD.md)
- [Architecture Documentation](./ARCHITECTURE.md)
- [X4 REST Server API](https://github.com/Alia5/X4-rest-server)
- [MCP Specification](https://modelcontextprotocol.io/)

---

**Note:** This document will be continuously updated as APIs are implemented through Phases 2-5.

---

**Next Update:** During Phase 2 (MCP Server implementation)
