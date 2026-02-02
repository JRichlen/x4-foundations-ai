/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { X4ApiClient, createX4ApiClient } from '../client/api-client.js';

describe('X4ApiClient', () => {
  let client: X4ApiClient;
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockFetch = vi.fn();
    client = createX4ApiClient({
      baseUrl: 'http://localhost:8080',
      timeout: 1000,
      fetch: mockFetch as unknown as typeof fetch,
    });
  });

  // Helper to create mock response
  function mockResponse(data: unknown, status = 200) {
    return Promise.resolve({
      ok: status >= 200 && status < 300,
      status,
      statusText: status === 200 ? 'OK' : 'Error',
      json: () => Promise.resolve(data),
    });
  }

  describe('health and status', () => {
    it('should call health endpoint', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ status: 'ok', timestamp: 123, connected: true })
      );

      const result = await client.health();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/health',
        expect.objectContaining({ method: 'GET' })
      );
      expect(result.success).toBe(true);
      expect(result.data?.status).toBe('ok');
    });

    it('should check game connection', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ status: 'ok', timestamp: 123, connected: true })
      );

      const connected = await client.isGameConnected();

      expect(connected).toBe(true);
    });

    it('should return false when not connected', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ status: 'ok', timestamp: 123, connected: false })
      );

      const connected = await client.isGameConnected();

      expect(connected).toBe(false);
    });
  });

  describe('player endpoints', () => {
    it('should get player info', async () => {
      const playerData = {
        id: 'player1',
        name: 'Test Player',
        money: 1000000,
        gameTime: 12345,
        currentSector: { id: 's1', name: 'Argon Prime' },
        faction: { id: 'player', name: 'Player' },
      };
      mockFetch.mockReturnValue(mockResponse(playerData));

      const result = await client.getPlayer();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/player',
        expect.any(Object)
      );
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe('Test Player');
    });

    it('should get player inventory', async () => {
      const inventory = {
        items: [
          { ware: { id: 'energycells', name: 'Energy Cells' }, amount: 1000 },
        ],
        totalValue: 15000,
      };
      mockFetch.mockReturnValue(mockResponse(inventory));

      const result = await client.getPlayerInventory();

      expect(result.success).toBe(true);
      expect(result.data?.items).toHaveLength(1);
    });
  });

  describe('faction endpoints', () => {
    it('should get all factions', async () => {
      const factions = [
        {
          id: 'argon',
          name: 'Argon',
          fullName: 'Argon Federation',
          race: 'argon',
        },
      ];
      mockFetch.mockReturnValue(mockResponse(factions));

      const result = await client.getFactions();

      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(1);
    });

    it('should get faction by id', async () => {
      const faction = {
        id: 'argon',
        name: 'Argon',
        fullName: 'Argon Federation',
        race: 'argon',
      };
      mockFetch.mockReturnValue(mockResponse(faction));

      const result = await client.getFaction('argon');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/factions/argon',
        expect.any(Object)
      );
      expect(result.data?.id).toBe('argon');
    });
  });

  describe('station endpoints', () => {
    it('should get all stations', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getStations();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/stations',
        expect.any(Object)
      );
    });

    it('should get stations with filters', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getStations({ sector: 's1', playerOwned: true });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/stations?sector=s1&playerOwned=true',
        expect.any(Object)
      );
    });

    it('should get player stations', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getPlayerStations();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/stations?playerOwned=true',
        expect.any(Object)
      );
    });
  });

  describe('ship endpoints', () => {
    it('should get all ships', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getShips();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/ships',
        expect.any(Object)
      );
    });

    it('should get player ships', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getPlayerShips();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/ships?playerOwned=true',
        expect.any(Object)
      );
    });
  });

  describe('trade endpoints', () => {
    it('should get trade offers', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getTradeOffers();

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/trade/offers',
        expect.any(Object)
      );
    });

    it('should get trade offers for specific ware', async () => {
      mockFetch.mockReturnValue(mockResponse([]));

      await client.getTradeOffers('energycells');

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/trade/offers?ware=energycells',
        expect.any(Object)
      );
    });
  });

  describe('command endpoints', () => {
    it('should submit command', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ success: true, commandId: 'cmd1' })
      );

      const result = await client.submitCommand({
        id: 'cmd1',
        type: 'create_trade_order',
        params: {},
        timestamp: Date.now(),
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/commands',
        expect.objectContaining({ method: 'POST' })
      );
      expect(result.success).toBe(true);
    });

    it('should create trade order', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ success: true, commandId: 'cmd1' })
      );

      await client.createTradeOrder({
        stationId: 's1',
        wareId: 'energycells',
        type: 'buy',
        price: 100,
        amount: 1000,
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/commands',
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('create_trade_order'),
        })
      );
    });

    it('should assign ship', async () => {
      mockFetch.mockReturnValue(
        mockResponse({ success: true, commandId: 'cmd1' })
      );

      await client.assignShip({
        shipId: 'ship1',
        commanderId: 'station1',
        role: 'trader',
      });

      expect(mockFetch).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/commands',
        expect.objectContaining({
          body: expect.stringContaining('assign_ship'),
        })
      );
    });
  });

  describe('error handling', () => {
    it('should handle HTTP errors', async () => {
      mockFetch.mockReturnValue(mockResponse({ error: 'Not found' }, 404));

      const result = await client.getPlayer();

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should handle network errors', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      const result = await client.getPlayer();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error');
    });

    it('should handle timeout', async () => {
      // Create a client with very short timeout
      const shortTimeoutClient = createX4ApiClient({
        baseUrl: 'http://localhost:8080',
        timeout: 50,
        fetch: (_, options) => {
          // Return a promise that gets aborted when the signal fires
          return new Promise((_, reject) => {
            const signal = options?.signal as AbortSignal;
            if (signal) {
              signal.addEventListener('abort', () => {
                const error = new Error('The operation was aborted');
                error.name = 'AbortError';
                reject(error);
              });
            }
          });
        },
      });

      const result = await shortTimeoutClient.getPlayer();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Request timeout');
    }, 10000);
  });
});
