/**
 * X4 Game API - Client
 *
 * HTTP client for consuming the X4 Game API from the MCP server or other clients.
 */

import type {
  GameState,
  PlayerInfo,
  PlayerInventory,
  Faction,
  FactionRelation,
  Sector,
  Station,
  Ship,
  Ware,
  TradeOffer,
  TradeOrder,
  Mission,
  LogbookEntry,
  Command,
  CommandResult,
  EntityId,
  CreateTradeOrderParams,
  ModifyTradeOrderParams,
  AssignShipParams,
  SetTradeRuleParams,
} from '../types/game-types.js';

export interface X4ApiClientConfig {
  /** Base URL of the X4 Game API server */
  baseUrl: string;
  /** Request timeout in milliseconds (default: 5000) */
  timeout?: number;
  /** Custom fetch implementation (for testing) */
  fetch?: typeof fetch;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * X4 Game API Client
 *
 * Provides a typed interface for interacting with the X4 Game API server.
 */
export class X4ApiClient {
  private baseUrl: string;
  private timeout: number;
  private fetchFn: typeof fetch;

  constructor(config: X4ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.timeout = config.timeout ?? 5000;
    this.fetchFn = config.fetch ?? fetch;
  }

  // ===========================================================================
  // Private Helpers
  // ===========================================================================

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await this.fetchFn(`${this.baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        return {
          success: false,
          error:
            errorData.error ||
            `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      const data = (await response.json()) as T;
      return { success: true, data };
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return { success: false, error: 'Request timeout' };
        }
        return { success: false, error: error.message };
      }
      return { success: false, error: 'Unknown error' };
    }
  }

  private async get<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path);
  }

  private async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  // ===========================================================================
  // Health & Status
  // ===========================================================================

  /**
   * Check if the API server is healthy
   */
  async health(): Promise<
    ApiResponse<{ status: string; timestamp: number; connected: boolean }>
  > {
    return this.get('/health');
  }

  /**
   * Get server and game status
   */
  async status(): Promise<
    ApiResponse<{
      server: { version: string; uptime: number };
      game: {
        connected: boolean;
        lastUpdate: number;
        gameTime?: number;
        isPaused?: boolean;
        gameVersion?: string;
      };
      data: Record<string, number>;
    }>
  > {
    return this.get('/status');
  }

  /**
   * Check if the game is connected (received recent update)
   */
  async isGameConnected(): Promise<boolean> {
    const result = await this.health();
    return result.success && result.data?.connected === true;
  }

  // ===========================================================================
  // Game State
  // ===========================================================================

  /**
   * Get current game state
   */
  async getGameState(): Promise<ApiResponse<GameState>> {
    return this.get('/api/v1/game/state');
  }

  // ===========================================================================
  // Player
  // ===========================================================================

  /**
   * Get player info
   */
  async getPlayer(): Promise<ApiResponse<PlayerInfo>> {
    return this.get('/api/v1/player');
  }

  /**
   * Get player inventory
   */
  async getPlayerInventory(): Promise<ApiResponse<PlayerInventory>> {
    return this.get('/api/v1/player/inventory');
  }

  // ===========================================================================
  // Factions
  // ===========================================================================

  /**
   * Get all factions
   */
  async getFactions(): Promise<ApiResponse<Faction[]>> {
    return this.get('/api/v1/factions');
  }

  /**
   * Get faction by ID
   */
  async getFaction(id: EntityId): Promise<ApiResponse<Faction>> {
    return this.get(`/api/v1/factions/${encodeURIComponent(id)}`);
  }

  /**
   * Get faction relations with player
   */
  async getFactionRelations(): Promise<ApiResponse<FactionRelation[]>> {
    return this.get('/api/v1/factions/relations');
  }

  // ===========================================================================
  // Sectors
  // ===========================================================================

  /**
   * Get all sectors
   */
  async getSectors(): Promise<ApiResponse<Sector[]>> {
    return this.get('/api/v1/sectors');
  }

  /**
   * Get sector by ID
   */
  async getSector(id: EntityId): Promise<ApiResponse<Sector>> {
    return this.get(`/api/v1/sectors/${encodeURIComponent(id)}`);
  }

  // ===========================================================================
  // Stations
  // ===========================================================================

  /**
   * Get all stations
   */
  async getStations(options?: {
    sector?: EntityId;
    playerOwned?: boolean;
  }): Promise<ApiResponse<Station[]>> {
    const params = new URLSearchParams();
    if (options?.sector) {
      params.set('sector', options.sector);
    }
    if (options?.playerOwned !== undefined) {
      params.set('playerOwned', String(options.playerOwned));
    }
    const query = params.toString();
    return this.get(`/api/v1/stations${query ? `?${query}` : ''}`);
  }

  /**
   * Get station by ID
   */
  async getStation(id: EntityId): Promise<ApiResponse<Station>> {
    return this.get(`/api/v1/stations/${encodeURIComponent(id)}`);
  }

  /**
   * Get player-owned stations
   */
  async getPlayerStations(): Promise<ApiResponse<Station[]>> {
    return this.getStations({ playerOwned: true });
  }

  // ===========================================================================
  // Ships
  // ===========================================================================

  /**
   * Get all ships
   */
  async getShips(options?: {
    sector?: EntityId;
    playerOwned?: boolean;
  }): Promise<ApiResponse<Ship[]>> {
    const params = new URLSearchParams();
    if (options?.sector) {
      params.set('sector', options.sector);
    }
    if (options?.playerOwned !== undefined) {
      params.set('playerOwned', String(options.playerOwned));
    }
    const query = params.toString();
    return this.get(`/api/v1/ships${query ? `?${query}` : ''}`);
  }

  /**
   * Get ship by ID
   */
  async getShip(id: EntityId): Promise<ApiResponse<Ship>> {
    return this.get(`/api/v1/ships/${encodeURIComponent(id)}`);
  }

  /**
   * Get player-owned ships
   */
  async getPlayerShips(): Promise<ApiResponse<Ship[]>> {
    return this.getShips({ playerOwned: true });
  }

  // ===========================================================================
  // Wares & Trade
  // ===========================================================================

  /**
   * Get all wares
   */
  async getWares(): Promise<ApiResponse<Ware[]>> {
    return this.get('/api/v1/wares');
  }

  /**
   * Get ware by ID
   */
  async getWare(id: string): Promise<ApiResponse<Ware>> {
    return this.get(`/api/v1/wares/${encodeURIComponent(id)}`);
  }

  /**
   * Get trade offers
   */
  async getTradeOffers(wareId?: string): Promise<ApiResponse<TradeOffer[]>> {
    if (wareId) {
      return this.get(
        `/api/v1/trade/offers?ware=${encodeURIComponent(wareId)}`
      );
    }
    return this.get('/api/v1/trade/offers');
  }

  /**
   * Get trade orders
   */
  async getTradeOrders(): Promise<ApiResponse<TradeOrder[]>> {
    return this.get('/api/v1/trade/orders');
  }

  /**
   * Get trade order by ID
   */
  async getTradeOrder(id: EntityId): Promise<ApiResponse<TradeOrder>> {
    return this.get(`/api/v1/trade/orders/${encodeURIComponent(id)}`);
  }

  // ===========================================================================
  // Missions
  // ===========================================================================

  /**
   * Get mission offers
   */
  async getMissionOffers(): Promise<ApiResponse<Mission[]>> {
    return this.get('/api/v1/missions/offers');
  }

  /**
   * Get active missions
   */
  async getActiveMissions(): Promise<ApiResponse<Mission[]>> {
    return this.get('/api/v1/missions/active');
  }

  // ===========================================================================
  // Logbook
  // ===========================================================================

  /**
   * Get logbook entries
   */
  async getLogbook(limit?: number): Promise<ApiResponse<LogbookEntry[]>> {
    if (limit) {
      return this.get(`/api/v1/logbook?limit=${limit}`);
    }
    return this.get('/api/v1/logbook');
  }

  // ===========================================================================
  // Commands
  // ===========================================================================

  /**
   * Submit a command to the game
   */
  async submitCommand(
    command: Command
  ): Promise<ApiResponse<{ commandId: string }>> {
    return this.post('/api/v1/commands', command);
  }

  /**
   * Get command results
   */
  async getCommandResults(
    limit?: number
  ): Promise<ApiResponse<CommandResult[]>> {
    if (limit) {
      return this.get(`/api/v1/commands/results?limit=${limit}`);
    }
    return this.get('/api/v1/commands/results');
  }

  // ===========================================================================
  // High-Level Command Helpers
  // ===========================================================================

  /**
   * Create a trade order on a station
   */
  async createTradeOrder(
    params: CreateTradeOrderParams
  ): Promise<ApiResponse<{ commandId: string }>> {
    const command: Command = {
      id: crypto.randomUUID(),
      type: 'create_trade_order',
      params: params as unknown as Record<string, unknown>,
      timestamp: Date.now(),
    };
    return this.submitCommand(command);
  }

  /**
   * Modify an existing trade order
   */
  async modifyTradeOrder(
    params: ModifyTradeOrderParams
  ): Promise<ApiResponse<{ commandId: string }>> {
    const command: Command = {
      id: crypto.randomUUID(),
      type: 'modify_trade_order',
      params: params as unknown as Record<string, unknown>,
      timestamp: Date.now(),
    };
    return this.submitCommand(command);
  }

  /**
   * Cancel a trade order
   */
  async cancelTradeOrder(
    orderId: EntityId
  ): Promise<ApiResponse<{ commandId: string }>> {
    const command: Command = {
      id: crypto.randomUUID(),
      type: 'cancel_trade_order',
      params: { orderId },
      timestamp: Date.now(),
    };
    return this.submitCommand(command);
  }

  /**
   * Assign a ship to a commander (station or ship)
   */
  async assignShip(
    params: AssignShipParams
  ): Promise<ApiResponse<{ commandId: string }>> {
    const command: Command = {
      id: crypto.randomUUID(),
      type: 'assign_ship',
      params: params as unknown as Record<string, unknown>,
      timestamp: Date.now(),
    };
    return this.submitCommand(command);
  }

  /**
   * Set trade rules for a station
   */
  async setTradeRule(
    params: SetTradeRuleParams
  ): Promise<ApiResponse<{ commandId: string }>> {
    const command: Command = {
      id: crypto.randomUUID(),
      type: 'set_trade_rule',
      params: params as unknown as Record<string, unknown>,
      timestamp: Date.now(),
    };
    return this.submitCommand(command);
  }
}

/**
 * Create an X4 API client instance
 */
export function createX4ApiClient(config: X4ApiClientConfig): X4ApiClient {
  return new X4ApiClient(config);
}
