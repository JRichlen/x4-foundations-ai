import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { GameStateManager } from '../server/state-manager.js';
import type {
  PlayerInfo,
  Faction,
  Station,
  Ship,
  FactionRelation,
  LogbookEntry,
  Command,
  CommandResult,
} from '../types/game-types.js';

describe('GameStateManager', () => {
  let manager: GameStateManager;

  beforeEach(() => {
    manager = new GameStateManager();
  });

  afterEach(() => {
    manager.reset();
  });

  describe('initialization', () => {
    it('should start with empty state', () => {
      expect(manager.getGameState()).toBeNull();
      expect(manager.getPlayer()).toBeNull();
      expect(manager.getAllFactions()).toEqual([]);
      expect(manager.getAllStations()).toEqual([]);
      expect(manager.getAllShips()).toEqual([]);
    });

    it('should report disconnected when no updates received', () => {
      expect(manager.isConnected()).toBe(false);
    });
  });

  describe('game state', () => {
    it('should update and retrieve game state', () => {
      const gameState = {
        timestamp: Date.now(),
        gameTime: 12345,
        player: createMockPlayer(),
        isPaused: false,
        gameVersion: '7.0',
      };

      manager.updateGameState(gameState);

      const retrieved = manager.getGameState();
      expect(retrieved).toEqual(gameState);
      expect(manager.isConnected()).toBe(true);
    });

    it('should also update player from game state', () => {
      const gameState = {
        timestamp: Date.now(),
        gameTime: 12345,
        player: createMockPlayer(),
        isPaused: false,
      };

      manager.updateGameState(gameState);

      expect(manager.getPlayer()).toEqual(gameState.player);
    });
  });

  describe('player', () => {
    it('should update and retrieve player info', () => {
      const player = createMockPlayer();
      manager.updatePlayer(player);

      expect(manager.getPlayer()).toEqual(player);
    });

    it('should update and retrieve inventory', () => {
      const inventory = {
        items: [
          {
            ware: { id: 'energycells', name: 'Energy Cells' },
            amount: 1000,
            avgPrice: 15,
          },
        ],
        totalValue: 15000,
      };

      manager.updateInventory(inventory);
      expect(manager.getInventory()).toEqual(inventory);
    });
  });

  describe('factions', () => {
    it('should update and retrieve factions', () => {
      const factions = [
        createMockFaction('argon', 'Argon Federation'),
        createMockFaction('paranid', 'Holy Order of the Paranid'),
      ];

      manager.updateFactions(factions);

      expect(manager.getAllFactions()).toHaveLength(2);
      expect(manager.getFaction('argon')).toEqual(factions[0]);
      expect(manager.getFaction('paranid')).toEqual(factions[1]);
    });

    it('should update single faction', () => {
      const faction = createMockFaction('teladi', 'Teladi Company');
      manager.updateFaction(faction);

      expect(manager.getFaction('teladi')).toEqual(faction);
    });

    it('should update faction relations', () => {
      const relations: FactionRelation[] = [
        {
          faction: { id: 'argon', name: 'Argon Federation' },
          relation: 20,
          relationLevel: 'Friendly',
          hasMilitaryLicense: true,
          hasCapitalLicense: false,
        },
      ];

      manager.updateFactionRelations(relations);
      expect(manager.getFactionRelations()).toEqual(relations);
    });
  });

  describe('stations', () => {
    it('should update and retrieve stations', () => {
      const stations = [
        createMockStation('station1', 'Trading Station Alpha', true),
        createMockStation('station2', 'NPC Factory', false),
      ];

      manager.updateStations(stations);

      expect(manager.getAllStations()).toHaveLength(2);
      expect(manager.getStation('station1')).toEqual(stations[0]);
    });

    it('should filter player stations', () => {
      const stations = [
        createMockStation('station1', 'My Station', true),
        createMockStation('station2', 'NPC Station', false),
      ];

      manager.updateStations(stations);

      const playerStations = manager.getPlayerStations();
      expect(playerStations).toHaveLength(1);
      expect(playerStations[0]?.id).toBe('station1');
    });

    it('should filter stations by sector', () => {
      const stations = [
        {
          ...createMockStation('s1', 'S1', true),
          sector: { id: 'sector1', name: 'Argon Prime' },
        },
        {
          ...createMockStation('s2', 'S2', true),
          sector: { id: 'sector2', name: 'Second Contact' },
        },
      ];

      manager.updateStations(stations as Station[]);

      const sectorStations = manager.getStationsInSector('sector1');
      expect(sectorStations).toHaveLength(1);
      expect(sectorStations[0]?.id).toBe('s1');
    });
  });

  describe('ships', () => {
    it('should update and retrieve ships', () => {
      const ships = [
        createMockShip('ship1', 'Player Fighter', true),
        createMockShip('ship2', 'NPC Trader', false),
      ];

      manager.updateShips(ships);

      expect(manager.getAllShips()).toHaveLength(2);
      expect(manager.getShip('ship1')).toEqual(ships[0]);
    });

    it('should filter player ships', () => {
      const ships = [
        createMockShip('ship1', 'My Ship', true),
        createMockShip('ship2', 'Enemy Ship', false),
      ];

      manager.updateShips(ships);

      const playerShips = manager.getPlayerShips();
      expect(playerShips).toHaveLength(1);
      expect(playerShips[0]?.id).toBe('ship1');
    });
  });

  describe('logbook', () => {
    it('should add and retrieve logbook entries', () => {
      const entry: LogbookEntry = {
        id: 'log1',
        time: 12345,
        category: 'general',
        title: 'Test Entry',
        text: 'This is a test',
        importance: 'medium',
        isRead: false,
      };

      manager.addLogbookEntry(entry);

      const logbook = manager.getLogbook();
      expect(logbook).toHaveLength(1);
      expect(logbook[0]).toEqual(entry);
    });

    it('should limit logbook entries to 1000', () => {
      // Add 1005 entries
      for (let i = 0; i < 1005; i++) {
        manager.addLogbookEntry({
          id: `log${i}`,
          time: i,
          category: 'general',
          title: `Entry ${i}`,
          text: 'Test',
          importance: 'low',
          isRead: false,
        });
      }

      expect(manager.getLogbook()).toHaveLength(1000);
    });

    it('should respect limit parameter', () => {
      for (let i = 0; i < 10; i++) {
        manager.addLogbookEntry({
          id: `log${i}`,
          time: i,
          category: 'general',
          title: `Entry ${i}`,
          text: 'Test',
          importance: 'low',
          isRead: false,
        });
      }

      expect(manager.getLogbook(5)).toHaveLength(5);
    });
  });

  describe('commands', () => {
    it('should add and retrieve pending commands', () => {
      const command: Command = {
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

      manager.addCommand(command);

      const pending = manager.getPendingCommands();
      expect(pending).toHaveLength(1);
      expect(pending[0]).toEqual(command);
    });

    it('should clear pending commands', () => {
      manager.addCommand({
        id: 'cmd1',
        type: 'create_trade_order',
        params: {},
        timestamp: Date.now(),
      });

      manager.clearPendingCommands();

      expect(manager.getPendingCommands()).toHaveLength(0);
    });

    it('should add command result and remove from pending', () => {
      const command: Command = {
        id: 'cmd1',
        type: 'create_trade_order',
        params: {},
        timestamp: Date.now(),
      };

      manager.addCommand(command);

      const result: CommandResult = {
        commandId: 'cmd1',
        success: true,
        timestamp: Date.now(),
      };

      manager.addCommandResult(result);

      expect(manager.getPendingCommands()).toHaveLength(0);
      expect(manager.getCommandResults()).toHaveLength(1);
      expect(manager.getCommandResults()[0]).toEqual(result);
    });
  });

  describe('events', () => {
    it('should emit events on updates', () => {
      const listener = vi.fn();
      const unsubscribe = manager.on('player', listener);

      const player = createMockPlayer();
      manager.updatePlayer(player);

      expect(listener).toHaveBeenCalledWith(player);

      unsubscribe();
      manager.updatePlayer(player);

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple listeners', () => {
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      manager.on('factions', listener1);
      manager.on('factions', listener2);

      const factions = [createMockFaction('test', 'Test')];
      manager.updateFactions(factions);

      expect(listener1).toHaveBeenCalledWith(factions);
      expect(listener2).toHaveBeenCalledWith(factions);
    });
  });

  describe('summary', () => {
    it('should return correct summary', () => {
      manager.updateFactions([
        createMockFaction('f1', 'Faction 1'),
        createMockFaction('f2', 'Faction 2'),
      ]);
      manager.updateStations([createMockStation('s1', 'Station 1', true)]);

      const summary = manager.getSummary();

      expect(summary.counts.factions).toBe(2);
      expect(summary.counts.stations).toBe(1);
    });
  });

  describe('reset', () => {
    it('should clear all data', () => {
      manager.updateFactions([createMockFaction('f1', 'F1')]);
      manager.updateStations([createMockStation('s1', 'S1', true)]);
      manager.updateShips([createMockShip('sh1', 'Ship1', true)]);

      manager.reset();

      expect(manager.getAllFactions()).toHaveLength(0);
      expect(manager.getAllStations()).toHaveLength(0);
      expect(manager.getAllShips()).toHaveLength(0);
    });
  });
});

// Helper functions to create mock data
function createMockPlayer(): PlayerInfo {
  return {
    id: 'player1',
    name: 'Test Player',
    money: 1000000,
    gameTime: 12345,
    currentSector: { id: 'sector1', name: 'Argon Prime' },
    faction: { id: 'player', name: 'Player Faction' },
  };
}

function createMockFaction(id: string, name: string): Faction {
  return {
    id,
    name,
    fullName: name,
    race: 'argon',
  };
}

function createMockStation(
  id: string,
  name: string,
  isPlayerOwned: boolean
): Station {
  return {
    id,
    name,
    owner: {
      id: isPlayerOwned ? 'player' : 'npc',
      name: isPlayerOwned ? 'Player' : 'NPC',
    },
    type: 'trading',
    sector: { id: 'sector1', name: 'Argon Prime' },
    position: { x: 0, y: 0, z: 0 },
    hull: 100,
    isPlayerOwned,
  };
}

function createMockShip(
  id: string,
  name: string,
  isPlayerOwned: boolean
): Ship {
  return {
    id,
    name,
    class: 'ship_m',
    macro: 'ship_arg_m_fighter_01_macro',
    owner: {
      id: isPlayerOwned ? 'player' : 'npc',
      name: isPlayerOwned ? 'Player' : 'NPC',
    },
    isPlayerOwned,
    hull: 100,
    shield: 100,
    sector: { id: 'sector1', name: 'Argon Prime' },
    position: { x: 0, y: 0, z: 0 },
  };
}
