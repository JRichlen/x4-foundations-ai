# @x4-ai/x4-game-api

X4 Foundations Game API - HTTP server and client for game data integration.

## Overview

This package provides a comprehensive API for accessing X4 Foundations game data through an HTTP server that communicates with an in-game extension via the `djfhe_http` mod.

### Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                       X4: Foundations Game                           │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ x4_ai_connector extension (Lua/MD)                           │    │
│  │   - Collects game data (player, stations, ships, etc.)       │    │
│  │   - Executes commands from API server                        │    │
│  │   - Uses djfhe_http for HTTP communication                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                           HTTP POST (data push)
                           HTTP GET (poll commands)
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    X4 Game API Server (Node.js)                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ State Manager - In-memory game state store                   │    │
│  │   - Players, factions, stations, ships, trade, missions      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │ REST API Endpoints                                           │    │
│  │   - Data ingestion (from game extension)                     │    │
│  │   - Data query (for MCP server / clients)                    │    │
│  │   - Command submission (to game extension)                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                              HTTP REST API
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    MCP Server / Other Clients                        │
│  - Uses X4ApiClient to query game data                              │
│  - Submits commands for game actions                                 │
└─────────────────────────────────────────────────────────────────────┘
```

## Installation

```bash
pnpm add @x4-ai/x4-game-api
```

## Quick Start

### Starting the Server

```typescript
import { startServer } from '@x4-ai/x4-game-api';

const { server, stateManager } = startServer({
  port: 8080,
  host: '0.0.0.0',
});

// The server is now running at http://localhost:8080
```

### Using the Client

```typescript
import { createX4ApiClient } from '@x4-ai/x4-game-api';

const client = createX4ApiClient({
  baseUrl: 'http://localhost:8080',
});

// Check if game is connected
const connected = await client.isGameConnected();

// Get player info
const player = await client.getPlayer();
if (player.success) {
  console.log(`Player: ${player.data.name}, Credits: ${player.data.money}`);
}

// Get player stations
const stations = await client.getPlayerStations();

// Get trade offers for a ware
const offers = await client.getTradeOffers('energycells');

// Create a trade order
await client.createTradeOrder({
  stationId: 'station-123',
  wareId: 'energycells',
  type: 'buy',
  price: 15,
  amount: 1000,
});
```

## API Endpoints

### Status

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Health check |
| `/status` | GET | Server and game status |

### Data Ingestion (from game extension)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/game/state` | POST | Update game state |
| `/api/v1/player` | POST | Update player info |
| `/api/v1/player/inventory` | POST | Update player inventory |
| `/api/v1/factions` | POST | Update factions |
| `/api/v1/factions/relations` | POST | Update faction relations |
| `/api/v1/stations` | POST | Update stations |
| `/api/v1/ships` | POST | Update ships |
| `/api/v1/wares` | POST | Update wares |
| `/api/v1/trade/offers` | POST | Update trade offers |
| `/api/v1/trade/orders` | POST | Update trade orders |
| `/api/v1/missions/offers` | POST | Update mission offers |
| `/api/v1/missions/active` | POST | Update active missions |
| `/api/v1/logbook` | POST | Update logbook |
| `/api/v1/commands/result` | POST | Submit command result |

### Data Query (for clients)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/game/state` | GET | Get current game state |
| `/api/v1/player` | GET | Get player info |
| `/api/v1/player/inventory` | GET | Get player inventory |
| `/api/v1/factions` | GET | Get all factions |
| `/api/v1/factions/:id` | GET | Get faction by ID |
| `/api/v1/factions/relations` | GET | Get faction relations |
| `/api/v1/sectors` | GET | Get all sectors |
| `/api/v1/sectors/:id` | GET | Get sector by ID |
| `/api/v1/stations` | GET | Get stations (?sector, ?playerOwned) |
| `/api/v1/stations/:id` | GET | Get station by ID |
| `/api/v1/ships` | GET | Get ships (?sector, ?playerOwned) |
| `/api/v1/ships/:id` | GET | Get ship by ID |
| `/api/v1/wares` | GET | Get all wares |
| `/api/v1/wares/:id` | GET | Get ware by ID |
| `/api/v1/trade/offers` | GET | Get trade offers (?ware) |
| `/api/v1/trade/orders` | GET | Get trade orders |
| `/api/v1/trade/orders/:id` | GET | Get trade order by ID |
| `/api/v1/missions/offers` | GET | Get mission offers |
| `/api/v1/missions/active` | GET | Get active missions |
| `/api/v1/logbook` | GET | Get logbook (?limit) |

### Commands

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/commands` | POST | Submit a command |
| `/api/v1/commands/pending` | GET | Get pending commands |
| `/api/v1/commands/results` | GET | Get command results |

## Game Extension Installation

The `extension/` folder contains the X4 game extension that communicates with this server.

### Requirements

1. **djfhe_http mod** - HTTP client library for X4 Lua
   - Download from: https://github.com/djfhe/x4_http
   - Install to: `<X4>/extensions/djfhe_http/`

2. **Disable Protected UI Mode** - In X4 Settings > Extensions

### Installation

1. Copy the `extension/` folder contents to `<X4>/extensions/x4_ai_connector/`
2. The extension will automatically connect to the API server when loaded

## Types

The package exports comprehensive TypeScript types for all X4 game data:

```typescript
import type {
  PlayerInfo,
  Faction,
  Station,
  Ship,
  Ware,
  TradeOffer,
  Mission,
  LogbookEntry,
  Command,
  // ... and many more
} from '@x4-ai/x4-game-api/types';
```

## Development

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Run tests
pnpm test

# Build
pnpm build

# Type check
pnpm typecheck
```

## License

MIT
