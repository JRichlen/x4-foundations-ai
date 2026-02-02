/**
 * X4 Game API - Game State Store
 *
 * In-memory store for game state data received from the X4 extension.
 * The game extension pushes data to the server, which stores it here
 * for consumption by the MCP server and other clients.
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
  Mission,
  LogbookEntry,
  TradeOffer,
  TradeOrder,
  Ware,
  Command,
  CommandResult,
  EntityId,
} from '../types/game-types.js';

export interface GameStateStore {
  // Core state
  gameState: GameState | null;
  lastUpdate: number;

  // Player data
  player: PlayerInfo | null;
  inventory: PlayerInventory | null;

  // Universe data
  factions: Map<EntityId, Faction>;
  factionRelations: FactionRelation[];
  sectors: Map<EntityId, Sector>;
  stations: Map<EntityId, Station>;
  ships: Map<EntityId, Ship>;

  // Trade data
  wares: Map<string, Ware>;
  tradeOffers: TradeOffer[];
  tradeOrders: Map<EntityId, TradeOrder>;

  // Mission data
  missionOffers: Mission[];
  activeMissions: Mission[];

  // Logbook
  logbook: LogbookEntry[];

  // Commands
  pendingCommands: Map<string, Command>;
  commandResults: CommandResult[];
}

/**
 * Creates a new empty game state store
 */
export function createGameStateStore(): GameStateStore {
  return {
    gameState: null,
    lastUpdate: 0,

    player: null,
    inventory: null,

    factions: new Map(),
    factionRelations: [],
    sectors: new Map(),
    stations: new Map(),
    ships: new Map(),

    wares: new Map(),
    tradeOffers: [],
    tradeOrders: new Map(),

    missionOffers: [],
    activeMissions: [],

    logbook: [],

    pendingCommands: new Map(),
    commandResults: [],
  };
}

/**
 * Game State Manager
 *
 * Manages the game state store with thread-safe updates and event notifications.
 */
export class GameStateManager {
  private store: GameStateStore;
  private listeners: Map<string, Set<(data: unknown) => void>>;

  constructor() {
    this.store = createGameStateStore();
    this.listeners = new Map();
  }

  // ===========================================================================
  // Core State Methods
  // ===========================================================================

  /**
   * Update the core game state
   */
  updateGameState(state: GameState): void {
    this.store.gameState = state;
    this.store.player = state.player;
    this.store.lastUpdate = Date.now();
    this.emit('gameState', state);
  }

  /**
   * Get the current game state
   */
  getGameState(): GameState | null {
    return this.store.gameState;
  }

  /**
   * Check if the game connection is active (received update within timeout)
   */
  isConnected(timeoutMs: number = 30000): boolean {
    return Date.now() - this.store.lastUpdate < timeoutMs;
  }

  // ===========================================================================
  // Player Methods
  // ===========================================================================

  updatePlayer(player: PlayerInfo): void {
    this.store.player = player;
    this.emit('player', player);
  }

  getPlayer(): PlayerInfo | null {
    return this.store.player;
  }

  updateInventory(inventory: PlayerInventory): void {
    this.store.inventory = inventory;
    this.emit('inventory', inventory);
  }

  getInventory(): PlayerInventory | null {
    return this.store.inventory;
  }

  // ===========================================================================
  // Faction Methods
  // ===========================================================================

  updateFaction(faction: Faction): void {
    this.store.factions.set(faction.id, faction);
    this.emit('faction', faction);
  }

  updateFactions(factions: Faction[]): void {
    for (const faction of factions) {
      this.store.factions.set(faction.id, faction);
    }
    this.emit('factions', factions);
  }

  getFaction(id: EntityId): Faction | undefined {
    return this.store.factions.get(id);
  }

  getAllFactions(): Faction[] {
    return Array.from(this.store.factions.values());
  }

  updateFactionRelations(relations: FactionRelation[]): void {
    this.store.factionRelations = relations;
    this.emit('factionRelations', relations);
  }

  getFactionRelations(): FactionRelation[] {
    return this.store.factionRelations;
  }

  // ===========================================================================
  // Sector Methods
  // ===========================================================================

  updateSector(sector: Sector): void {
    this.store.sectors.set(sector.id, sector);
    this.emit('sector', sector);
  }

  updateSectors(sectors: Sector[]): void {
    for (const sector of sectors) {
      this.store.sectors.set(sector.id, sector);
    }
    this.emit('sectors', sectors);
  }

  getSector(id: EntityId): Sector | undefined {
    return this.store.sectors.get(id);
  }

  getAllSectors(): Sector[] {
    return Array.from(this.store.sectors.values());
  }

  // ===========================================================================
  // Station Methods
  // ===========================================================================

  updateStation(station: Station): void {
    this.store.stations.set(station.id, station);
    this.emit('station', station);
  }

  updateStations(stations: Station[]): void {
    for (const station of stations) {
      this.store.stations.set(station.id, station);
    }
    this.emit('stations', stations);
  }

  getStation(id: EntityId): Station | undefined {
    return this.store.stations.get(id);
  }

  getAllStations(): Station[] {
    return Array.from(this.store.stations.values());
  }

  getPlayerStations(): Station[] {
    return Array.from(this.store.stations.values()).filter(
      (s) => s.isPlayerOwned
    );
  }

  getStationsInSector(sectorId: EntityId): Station[] {
    return Array.from(this.store.stations.values()).filter(
      (s) => s.sector.id === sectorId
    );
  }

  // ===========================================================================
  // Ship Methods
  // ===========================================================================

  updateShip(ship: Ship): void {
    this.store.ships.set(ship.id, ship);
    this.emit('ship', ship);
  }

  updateShips(ships: Ship[]): void {
    for (const ship of ships) {
      this.store.ships.set(ship.id, ship);
    }
    this.emit('ships', ships);
  }

  getShip(id: EntityId): Ship | undefined {
    return this.store.ships.get(id);
  }

  getAllShips(): Ship[] {
    return Array.from(this.store.ships.values());
  }

  getPlayerShips(): Ship[] {
    return Array.from(this.store.ships.values()).filter((s) => s.isPlayerOwned);
  }

  getShipsInSector(sectorId: EntityId): Ship[] {
    return Array.from(this.store.ships.values()).filter(
      (s) => s.sector.id === sectorId
    );
  }

  // ===========================================================================
  // Trade Methods
  // ===========================================================================

  updateWare(ware: Ware): void {
    this.store.wares.set(ware.id, ware);
    this.emit('ware', ware);
  }

  updateWares(wares: Ware[]): void {
    for (const ware of wares) {
      this.store.wares.set(ware.id, ware);
    }
    this.emit('wares', wares);
  }

  getWare(id: string): Ware | undefined {
    return this.store.wares.get(id);
  }

  getAllWares(): Ware[] {
    return Array.from(this.store.wares.values());
  }

  updateTradeOffers(offers: TradeOffer[]): void {
    this.store.tradeOffers = offers;
    this.emit('tradeOffers', offers);
  }

  getTradeOffers(): TradeOffer[] {
    return this.store.tradeOffers;
  }

  getTradeOffersForWare(wareId: string): TradeOffer[] {
    return this.store.tradeOffers.filter((o) => o.ware.id === wareId);
  }

  updateTradeOrder(order: TradeOrder): void {
    this.store.tradeOrders.set(order.id, order);
    this.emit('tradeOrder', order);
  }

  updateTradeOrders(orders: TradeOrder[]): void {
    for (const order of orders) {
      this.store.tradeOrders.set(order.id, order);
    }
    this.emit('tradeOrders', orders);
  }

  getTradeOrder(id: EntityId): TradeOrder | undefined {
    return this.store.tradeOrders.get(id);
  }

  getAllTradeOrders(): TradeOrder[] {
    return Array.from(this.store.tradeOrders.values());
  }

  // ===========================================================================
  // Mission Methods
  // ===========================================================================

  updateMissionOffers(missions: Mission[]): void {
    this.store.missionOffers = missions;
    this.emit('missionOffers', missions);
  }

  getMissionOffers(): Mission[] {
    return this.store.missionOffers;
  }

  updateActiveMissions(missions: Mission[]): void {
    this.store.activeMissions = missions;
    this.emit('activeMissions', missions);
  }

  getActiveMissions(): Mission[] {
    return this.store.activeMissions;
  }

  // ===========================================================================
  // Logbook Methods
  // ===========================================================================

  addLogbookEntry(entry: LogbookEntry): void {
    this.store.logbook.unshift(entry);
    // Keep only the last 1000 entries
    if (this.store.logbook.length > 1000) {
      this.store.logbook = this.store.logbook.slice(0, 1000);
    }
    this.emit('logbook', entry);
  }

  updateLogbook(entries: LogbookEntry[]): void {
    this.store.logbook = entries;
    this.emit('logbookFull', entries);
  }

  getLogbook(limit?: number): LogbookEntry[] {
    if (limit) {
      return this.store.logbook.slice(0, limit);
    }
    return this.store.logbook;
  }

  // ===========================================================================
  // Command Methods
  // ===========================================================================

  addCommand(command: Command): void {
    this.store.pendingCommands.set(command.id, command);
    this.emit('commandAdded', command);
  }

  getPendingCommands(): Command[] {
    return Array.from(this.store.pendingCommands.values());
  }

  clearPendingCommands(): void {
    this.store.pendingCommands.clear();
  }

  addCommandResult(result: CommandResult): void {
    this.store.pendingCommands.delete(result.commandId);
    this.store.commandResults.unshift(result);
    // Keep only the last 100 results
    if (this.store.commandResults.length > 100) {
      this.store.commandResults = this.store.commandResults.slice(0, 100);
    }
    this.emit('commandResult', result);
  }

  getCommandResults(limit?: number): CommandResult[] {
    if (limit) {
      return this.store.commandResults.slice(0, limit);
    }
    return this.store.commandResults;
  }

  // ===========================================================================
  // Event Methods
  // ===========================================================================

  /**
   * Subscribe to state change events
   */
  on(event: string, listener: (data: unknown) => void): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.add(listener);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.get(event)?.delete(listener);
    };
  }

  /**
   * Emit an event to all listeners
   */
  private emit(event: string, data: unknown): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      for (const listener of eventListeners) {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      }
    }
  }

  // ===========================================================================
  // Utility Methods
  // ===========================================================================

  /**
   * Get a summary of the current store state
   */
  getSummary(): {
    connected: boolean;
    lastUpdate: number;
    counts: Record<string, number>;
  } {
    return {
      connected: this.isConnected(),
      lastUpdate: this.store.lastUpdate,
      counts: {
        factions: this.store.factions.size,
        sectors: this.store.sectors.size,
        stations: this.store.stations.size,
        ships: this.store.ships.size,
        wares: this.store.wares.size,
        tradeOffers: this.store.tradeOffers.length,
        tradeOrders: this.store.tradeOrders.size,
        missionOffers: this.store.missionOffers.length,
        activeMissions: this.store.activeMissions.length,
        logbookEntries: this.store.logbook.length,
        pendingCommands: this.store.pendingCommands.size,
      },
    };
  }

  /**
   * Reset all store data
   */
  reset(): void {
    this.store = createGameStateStore();
    this.emit('reset', null);
  }
}

// Export singleton instance
export const gameStateManager = new GameStateManager();
