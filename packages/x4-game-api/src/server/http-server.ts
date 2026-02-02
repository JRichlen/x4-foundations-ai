/**
 * X4 Game API - HTTP Server
 *
 * HTTP server that receives data from the X4 game extension and exposes
 * REST API endpoints for the MCP server and other clients.
 *
 * Architecture:
 * - Game extension (Lua) → HTTP POST → This server → State Manager
 * - MCP Server → HTTP GET → This server → State Manager
 */

import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { z } from 'zod';

import type { Command } from '../types/game-types.js';
import {
  CommandResultSchema,
  CommandSchema,
  FactionRelationSchema,
  FactionSchema,
  GameStateSchema,
  LogbookEntrySchema,
  MissionSchema,
  PlayerInfoSchema,
  PlayerInventorySchema,
  ShipSchema,
  StationSchema,
  TradeOfferSchema,
  TradeOrderSchema,
  WareSchema,
} from '../types/schemas.js';

import { GameStateManager, gameStateManager } from './state-manager.js';

// Helper to safely get JSON from request body
async function getJsonBody(c: {
  req: { json: () => Promise<unknown> };
}): Promise<unknown> {
  return c.req.json();
}

export interface ServerConfig {
  /** Server port (default: 8080) */
  port: number;
  /** Host to bind to (default: '0.0.0.0') */
  host: string;
  /** Enable CORS (default: true) */
  cors: boolean;
  /** Enable request logging (default: true) */
  logging: boolean;
  /** Game state manager instance (default: singleton) */
  stateManager?: GameStateManager;
}

const defaultConfig: ServerConfig = {
  port: 8080,
  host: '0.0.0.0',
  cors: true,
  logging: true,
};

/**
 * Create the X4 Game API HTTP server
 */
export function createServer(config: Partial<ServerConfig> = {}) {
  const cfg = { ...defaultConfig, ...config };
  const stateManager = cfg.stateManager ?? gameStateManager;

  const app = new Hono();

  // Middleware
  if (cfg.cors) {
    app.use('*', cors());
  }
  if (cfg.logging) {
    app.use('*', logger());
  }

  // ===========================================================================
  // Health & Status Endpoints
  // ===========================================================================

  /**
   * Health check endpoint
   */
  app.get('/health', (c) => {
    return c.json({
      status: 'ok',
      timestamp: Date.now(),
      connected: stateManager.isConnected(),
    });
  });

  /**
   * Get server and game status summary
   */
  app.get('/status', (c) => {
    const summary = stateManager.getSummary();
    const gameState = stateManager.getGameState();
    return c.json({
      server: {
        version: '0.1.0',
        uptime: process.uptime(),
      },
      game: {
        connected: summary.connected,
        lastUpdate: summary.lastUpdate,
        gameTime: gameState?.gameTime,
        isPaused: gameState?.isPaused,
        gameVersion: gameState?.gameVersion,
      },
      data: summary.counts,
    });
  });

  // ===========================================================================
  // Data Ingestion Endpoints (from Game Extension)
  // ===========================================================================

  /**
   * Receive game state update from extension
   */
  app.post('/api/v1/game/state', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = GameStateSchema.safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid game state data', details: result.error.issues },
          400
        );
      }
      stateManager.updateGameState(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive player info update
   */
  app.post('/api/v1/player', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = PlayerInfoSchema.safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid player data', details: result.error.issues },
          400
        );
      }
      stateManager.updatePlayer(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive player inventory update
   */
  app.post('/api/v1/player/inventory', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = PlayerInventorySchema.safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid inventory data', details: result.error.issues },
          400
        );
      }
      stateManager.updateInventory(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive factions update
   */
  app.post('/api/v1/factions', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(FactionSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid factions data', details: result.error.issues },
          400
        );
      }
      stateManager.updateFactions(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive faction relations update
   */
  app.post('/api/v1/factions/relations', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(FactionRelationSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid relations data', details: result.error.issues },
          400
        );
      }
      stateManager.updateFactionRelations(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive stations update
   */
  app.post('/api/v1/stations', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(StationSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid stations data', details: result.error.issues },
          400
        );
      }
      stateManager.updateStations(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive ships update
   */
  app.post('/api/v1/ships', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(ShipSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid ships data', details: result.error.issues },
          400
        );
      }
      stateManager.updateShips(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive wares update
   */
  app.post('/api/v1/wares', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(WareSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid wares data', details: result.error.issues },
          400
        );
      }
      stateManager.updateWares(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive trade offers update
   */
  app.post('/api/v1/trade/offers', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(TradeOfferSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid trade offers data', details: result.error.issues },
          400
        );
      }
      stateManager.updateTradeOffers(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive trade orders update
   */
  app.post('/api/v1/trade/orders', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(TradeOrderSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid trade orders data', details: result.error.issues },
          400
        );
      }
      stateManager.updateTradeOrders(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive mission offers update
   */
  app.post('/api/v1/missions/offers', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(MissionSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid mission offers data',
            details: result.error.issues,
          },
          400
        );
      }
      stateManager.updateMissionOffers(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive active missions update
   */
  app.post('/api/v1/missions/active', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(MissionSchema).safeParse(body);
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid active missions data',
            details: result.error.issues,
          },
          400
        );
      }
      stateManager.updateActiveMissions(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive logbook entries update
   */
  app.post('/api/v1/logbook', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = z.array(LogbookEntrySchema).safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid logbook data', details: result.error.issues },
          400
        );
      }
      stateManager.updateLogbook(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Receive command result from game
   */
  app.post('/api/v1/commands/result', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = CommandResultSchema.safeParse(body);
      if (!result.success) {
        return c.json(
          {
            error: 'Invalid command result data',
            details: result.error.issues,
          },
          400
        );
      }
      stateManager.addCommandResult(result.data);
      return c.json({ success: true });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  // ===========================================================================
  // Data Query Endpoints (for MCP Server / Clients)
  // ===========================================================================

  /**
   * Get current game state
   */
  app.get('/api/v1/game/state', (c) => {
    const state = stateManager.getGameState();
    if (!state) {
      return c.json({ error: 'No game state available' }, 404);
    }
    return c.json(state);
  });

  /**
   * Get player info
   */
  app.get('/api/v1/player', (c) => {
    const player = stateManager.getPlayer();
    if (!player) {
      return c.json({ error: 'No player data available' }, 404);
    }
    return c.json(player);
  });

  /**
   * Get player inventory
   */
  app.get('/api/v1/player/inventory', (c) => {
    const inventory = stateManager.getInventory();
    if (!inventory) {
      return c.json({ error: 'No inventory data available' }, 404);
    }
    return c.json(inventory);
  });

  /**
   * Get all factions
   */
  app.get('/api/v1/factions', (c) => {
    return c.json(stateManager.getAllFactions());
  });

  /**
   * Get faction by ID
   */
  app.get('/api/v1/factions/:id', (c) => {
    const faction = stateManager.getFaction(c.req.param('id'));
    if (!faction) {
      return c.json({ error: 'Faction not found' }, 404);
    }
    return c.json(faction);
  });

  /**
   * Get faction relations
   */
  app.get('/api/v1/factions/relations', (c) => {
    return c.json(stateManager.getFactionRelations());
  });

  /**
   * Get all sectors
   */
  app.get('/api/v1/sectors', (c) => {
    return c.json(stateManager.getAllSectors());
  });

  /**
   * Get sector by ID
   */
  app.get('/api/v1/sectors/:id', (c) => {
    const sector = stateManager.getSector(c.req.param('id'));
    if (!sector) {
      return c.json({ error: 'Sector not found' }, 404);
    }
    return c.json(sector);
  });

  /**
   * Get all stations
   */
  app.get('/api/v1/stations', (c) => {
    const sectorId = c.req.query('sector');
    const playerOwned = c.req.query('playerOwned');

    let stations = stateManager.getAllStations();

    if (sectorId) {
      stations = stations.filter((s) => s.sector.id === sectorId);
    }
    if (playerOwned === 'true') {
      stations = stations.filter((s) => s.isPlayerOwned);
    }

    return c.json(stations);
  });

  /**
   * Get station by ID
   */
  app.get('/api/v1/stations/:id', (c) => {
    const station = stateManager.getStation(c.req.param('id'));
    if (!station) {
      return c.json({ error: 'Station not found' }, 404);
    }
    return c.json(station);
  });

  /**
   * Get all ships
   */
  app.get('/api/v1/ships', (c) => {
    const sectorId = c.req.query('sector');
    const playerOwned = c.req.query('playerOwned');

    let ships = stateManager.getAllShips();

    if (sectorId) {
      ships = ships.filter((s) => s.sector.id === sectorId);
    }
    if (playerOwned === 'true') {
      ships = ships.filter((s) => s.isPlayerOwned);
    }

    return c.json(ships);
  });

  /**
   * Get ship by ID
   */
  app.get('/api/v1/ships/:id', (c) => {
    const ship = stateManager.getShip(c.req.param('id'));
    if (!ship) {
      return c.json({ error: 'Ship not found' }, 404);
    }
    return c.json(ship);
  });

  /**
   * Get all wares
   */
  app.get('/api/v1/wares', (c) => {
    return c.json(stateManager.getAllWares());
  });

  /**
   * Get ware by ID
   */
  app.get('/api/v1/wares/:id', (c) => {
    const ware = stateManager.getWare(c.req.param('id'));
    if (!ware) {
      return c.json({ error: 'Ware not found' }, 404);
    }
    return c.json(ware);
  });

  /**
   * Get trade offers
   */
  app.get('/api/v1/trade/offers', (c) => {
    const wareId = c.req.query('ware');
    if (wareId) {
      return c.json(stateManager.getTradeOffersForWare(wareId));
    }
    return c.json(stateManager.getTradeOffers());
  });

  /**
   * Get trade orders
   */
  app.get('/api/v1/trade/orders', (c) => {
    return c.json(stateManager.getAllTradeOrders());
  });

  /**
   * Get trade order by ID
   */
  app.get('/api/v1/trade/orders/:id', (c) => {
    const order = stateManager.getTradeOrder(c.req.param('id'));
    if (!order) {
      return c.json({ error: 'Trade order not found' }, 404);
    }
    return c.json(order);
  });

  /**
   * Get mission offers
   */
  app.get('/api/v1/missions/offers', (c) => {
    return c.json(stateManager.getMissionOffers());
  });

  /**
   * Get active missions
   */
  app.get('/api/v1/missions/active', (c) => {
    return c.json(stateManager.getActiveMissions());
  });

  /**
   * Get logbook entries
   */
  app.get('/api/v1/logbook', (c) => {
    const limitStr = c.req.query('limit');
    const limit = limitStr ? parseInt(limitStr, 10) : undefined;
    return c.json(stateManager.getLogbook(limit));
  });

  // ===========================================================================
  // Command Endpoints (for sending commands to game)
  // ===========================================================================

  /**
   * Submit a command to be executed by the game extension
   */
  app.post('/api/v1/commands', async (c) => {
    try {
      const body = await getJsonBody(c);
      const result = CommandSchema.safeParse(body);
      if (!result.success) {
        return c.json(
          { error: 'Invalid command data', details: result.error.issues },
          400
        );
      }
      stateManager.addCommand(result.data as Command);
      return c.json({ success: true, commandId: result.data.id });
    } catch (error) {
      return c.json({ error: 'Failed to parse request body' }, 400);
    }
  });

  /**
   * Get pending commands (for game extension to poll)
   */
  app.get('/api/v1/commands/pending', (c) => {
    const commands = stateManager.getPendingCommands();
    // Clear pending after retrieval (extension will process them)
    stateManager.clearPendingCommands();
    return c.json(commands);
  });

  /**
   * Get command results
   */
  app.get('/api/v1/commands/results', (c) => {
    const limitStr = c.req.query('limit');
    const limit = limitStr ? parseInt(limitStr, 10) : undefined;
    return c.json(stateManager.getCommandResults(limit));
  });

  return { app, stateManager };
}

/**
 * Start the HTTP server
 */
export function startServer(config: Partial<ServerConfig> = {}) {
  const cfg = { ...defaultConfig, ...config };
  const { app, stateManager } = createServer(cfg);

  const server = serve({
    fetch: app.fetch,
    port: cfg.port,
    hostname: cfg.host,
  });

  // eslint-disable-next-line no-console
  console.log(`X4 Game API Server running at http://${cfg.host}:${cfg.port}`);

  return { app, stateManager, server };
}
