import type { Hono } from 'hono';
import { describe, it, expect, beforeAll, beforeEach } from 'vitest';

import { createServer } from '../server/http-server.js';
import { GameStateManager } from '../server/state-manager.js';

describe('HTTP Server', () => {
  let app: Hono;
  let stateManager: GameStateManager;

  beforeAll(() => {
    stateManager = new GameStateManager();
    const server = createServer({
      cors: true,
      logging: false, // Disable logging for tests
      stateManager,
    });
    app = server.app;
  });

  beforeEach(() => {
    stateManager.reset();
  });

  describe('health and status endpoints', () => {
    it('GET /health should return ok status', async () => {
      const res = await app.request('/health');
      expect(res.status).toBe(200);

      const json = (await res.json()) as { status: string; connected: boolean };
      expect(json.status).toBe('ok');
      expect(json.connected).toBe(false);
    });

    it('GET /status should return server info', async () => {
      const res = await app.request('/status');
      expect(res.status).toBe(200);

      const json = (await res.json()) as {
        server: { version: string };
        game: unknown;
        data: unknown;
      };
      expect(json.server).toBeDefined();
      expect(json.server.version).toBe('0.1.0');
      expect(json.game).toBeDefined();
      expect(json.data).toBeDefined();
    });
  });

  describe('data ingestion endpoints', () => {
    it('POST /api/v1/game/state should accept valid game state', async () => {
      const gameState = {
        timestamp: Date.now(),
        gameTime: 12345,
        player: {
          id: 'player1',
          name: 'Test Player',
          money: 1000000,
          gameTime: 12345,
          currentSector: { id: 'sector1', name: 'Argon Prime' },
          faction: { id: 'player', name: 'Player' },
        },
        isPaused: false,
      };

      const res = await app.request('/api/v1/game/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(gameState),
      });

      expect(res.status).toBe(200);
      const json = (await res.json()) as { success: boolean };
      expect(json.success).toBe(true);

      // Verify state was stored
      const stored = stateManager.getGameState();
      expect(stored?.gameTime).toBe(12345);
    });

    it('POST /api/v1/game/state should reject invalid data', async () => {
      const invalidState = {
        timestamp: 'not a number', // Should be number
        gameTime: 12345,
      };

      const res = await app.request('/api/v1/game/state', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invalidState),
      });

      expect(res.status).toBe(400);
      const json = (await res.json()) as { error: string };
      expect(json.error).toBeDefined();
    });

    it('POST /api/v1/factions should accept faction array', async () => {
      const factions = [
        {
          id: 'argon',
          name: 'Argon',
          fullName: 'Argon Federation',
          race: 'argon',
        },
        {
          id: 'paranid',
          name: 'Paranid',
          fullName: 'Holy Order',
          race: 'paranid',
        },
      ];

      const res = await app.request('/api/v1/factions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(factions),
      });

      expect(res.status).toBe(200);
      expect(stateManager.getAllFactions()).toHaveLength(2);
    });

    it('POST /api/v1/stations should accept station array', async () => {
      const stations = [
        {
          id: 'station1',
          name: 'My Station',
          owner: { id: 'player', name: 'Player' },
          type: 'trading',
          sector: { id: 'sector1', name: 'Argon Prime' },
          position: { x: 0, y: 0, z: 0 },
          hull: 100,
          isPlayerOwned: true,
        },
      ];

      const res = await app.request('/api/v1/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(stations),
      });

      expect(res.status).toBe(200);
      expect(stateManager.getAllStations()).toHaveLength(1);
    });

    it('POST /api/v1/logbook should accept logbook entries', async () => {
      const entries = [
        {
          id: 'log1',
          time: 12345,
          category: 'general',
          title: 'Test Entry',
          text: 'This is a test',
          importance: 'medium',
          isRead: false,
        },
      ];

      const res = await app.request('/api/v1/logbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entries),
      });

      expect(res.status).toBe(200);
      expect(stateManager.getLogbook()).toHaveLength(1);
    });
  });

  describe('data query endpoints', () => {
    beforeEach(async () => {
      // Seed some data
      await app.request('/api/v1/factions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          {
            id: 'argon',
            name: 'Argon',
            fullName: 'Argon Federation',
            race: 'argon',
          },
        ]),
      });

      await app.request('/api/v1/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([
          {
            id: 'station1',
            name: 'My Station',
            owner: { id: 'player', name: 'Player' },
            type: 'trading',
            sector: { id: 'sector1', name: 'Argon Prime' },
            position: { x: 0, y: 0, z: 0 },
            hull: 100,
            isPlayerOwned: true,
          },
        ]),
      });
    });

    it('GET /api/v1/factions should return all factions', async () => {
      const res = await app.request('/api/v1/factions');
      expect(res.status).toBe(200);

      const factions = (await res.json()) as Array<{ id: string }>;
      expect(factions).toHaveLength(1);
      expect(factions[0]?.id).toBe('argon');
    });

    it('GET /api/v1/factions/:id should return specific faction', async () => {
      const res = await app.request('/api/v1/factions/argon');
      expect(res.status).toBe(200);

      const faction = (await res.json()) as { id: string };
      expect(faction.id).toBe('argon');
    });

    it('GET /api/v1/factions/:id should return 404 for missing faction', async () => {
      const res = await app.request('/api/v1/factions/nonexistent');
      expect(res.status).toBe(404);
    });

    it('GET /api/v1/stations should return all stations', async () => {
      const res = await app.request('/api/v1/stations');
      expect(res.status).toBe(200);

      const stations = await res.json();
      expect(stations).toHaveLength(1);
    });

    it('GET /api/v1/stations?playerOwned=true should filter player stations', async () => {
      const res = await app.request('/api/v1/stations?playerOwned=true');
      expect(res.status).toBe(200);

      const stations = await res.json();
      expect(stations).toHaveLength(1);
    });

    it('GET /api/v1/stations/:id should return specific station', async () => {
      const res = await app.request('/api/v1/stations/station1');
      expect(res.status).toBe(200);

      const station = (await res.json()) as { id: string };
      expect(station.id).toBe('station1');
    });

    it('GET /api/v1/game/state should return 404 when no state', async () => {
      const res = await app.request('/api/v1/game/state');
      expect(res.status).toBe(404);
    });
  });

  describe('command endpoints', () => {
    it('POST /api/v1/commands should accept command', async () => {
      const command = {
        id: 'cmd1',
        type: 'create_trade_order',
        params: {
          stationId: 's1',
          wareId: 'energycells',
          type: 'buy',
          price: 100,
          amount: 1000,
        },
        timestamp: Date.now(),
      };

      const res = await app.request('/api/v1/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
      });

      expect(res.status).toBe(200);
      const json = (await res.json()) as {
        success: boolean;
        commandId: string;
      };
      expect(json.success).toBe(true);
      expect(json.commandId).toBe('cmd1');
    });

    it('GET /api/v1/commands/pending should return and clear pending commands', async () => {
      // Add a command
      const command = {
        id: 'cmd1',
        type: 'create_trade_order',
        params: {},
        timestamp: Date.now(),
      };

      await app.request('/api/v1/commands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(command),
      });

      // Get pending commands
      const res1 = await app.request('/api/v1/commands/pending');
      expect(res1.status).toBe(200);

      const commands = await res1.json();
      expect(commands).toHaveLength(1);

      // Get again - should be empty (cleared)
      const res2 = await app.request('/api/v1/commands/pending');
      const commands2 = await res2.json();
      expect(commands2).toHaveLength(0);
    });

    it('POST /api/v1/commands/result should accept command result', async () => {
      const result = {
        commandId: 'cmd1',
        success: true,
        timestamp: Date.now(),
      };

      const res = await app.request('/api/v1/commands/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      expect(res.status).toBe(200);
    });

    it('GET /api/v1/commands/results should return command results', async () => {
      // Add a result
      await app.request('/api/v1/commands/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commandId: 'cmd1',
          success: true,
          timestamp: Date.now(),
        }),
      });

      const res = await app.request('/api/v1/commands/results');
      expect(res.status).toBe(200);

      const results = await res.json();
      expect(results).toHaveLength(1);
    });
  });
});
