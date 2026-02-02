/**
 * X4 Foundations Game API - Type Definitions
 *
 * Comprehensive TypeScript types for X4 game data structures.
 * Based on X4-External-App, X4 REST Server, and X4 modding documentation.
 */

// =============================================================================
// Core Game Types
// =============================================================================

/** Unique identifier for game entities */
export type EntityId = string;

/** Timestamp in game time (seconds since game start) */
export type GameTime = number;

/** Real-world timestamp (Unix timestamp in milliseconds) */
export type RealTime = number;

/** Credits (in-game currency) */
export type Credits = number;

/** Quantity of items */
export type Quantity = number;

// =============================================================================
// Player Types
// =============================================================================

export interface PlayerInfo {
  /** Player's unique identifier */
  id: EntityId;
  /** Player's name */
  name: string;
  /** Current credits */
  money: Credits;
  /** Current game time */
  gameTime: GameTime;
  /** Current sector location */
  currentSector: SectorReference;
  /** Current ship (if piloting) */
  currentShip?: ShipReference;
  /** Player's faction */
  faction: FactionReference;
}

export interface PlayerInventory {
  /** Player's inventory items */
  items: InventoryItem[];
  /** Total inventory value */
  totalValue: Credits;
}

export interface InventoryItem {
  /** Ware type */
  ware: WareReference;
  /** Quantity owned */
  amount: Quantity;
  /** Average purchase price */
  avgPrice?: Credits;
}

// =============================================================================
// Faction Types
// =============================================================================

export interface FactionReference {
  id: EntityId;
  name: string;
}

export interface Faction extends FactionReference {
  /** Full faction name */
  fullName: string;
  /** Faction description */
  description?: string;
  /** Primary race */
  race: string;
  /** Faction color (hex) */
  color?: string;
}

export interface FactionRelation {
  /** The faction */
  faction: FactionReference;
  /** Relation value (-30 to +30 typically) */
  relation: number;
  /** Relation level name (e.g., "Friendly", "Neutral", "Enemy") */
  relationLevel: string;
  /** Has military license */
  hasMilitaryLicense: boolean;
  /** Has capital ship license */
  hasCapitalLicense: boolean;
  /** Recent relation change */
  recentChange?: number;
}

// =============================================================================
// Location Types
// =============================================================================

export interface SectorReference {
  id: EntityId;
  name: string;
}

export interface Sector extends SectorReference {
  /** Owner faction */
  owner?: FactionReference;
  /** Position in galaxy */
  position: Position3D;
  /** Connected sectors (via gates/highways) */
  connections: SectorReference[];
  /** Stations in this sector */
  stations: StationReference[];
  /** Security level */
  securityLevel: 'low' | 'medium' | 'high';
}

export interface Position3D {
  x: number;
  y: number;
  z: number;
}

export interface ZoneReference {
  id: EntityId;
  name: string;
  sector: SectorReference;
}

// =============================================================================
// Station Types
// =============================================================================

export interface StationReference {
  id: EntityId;
  name: string;
}

export interface Station extends StationReference {
  /** Owner faction */
  owner: FactionReference;
  /** Station type (e.g., "trading", "factory", "shipyard") */
  type: StationType;
  /** Location */
  sector: SectorReference;
  zone?: ZoneReference;
  position: Position3D;
  /** Hull percentage */
  hull: number;
  /** Is player-owned */
  isPlayerOwned: boolean;
  /** Station modules */
  modules?: StationModule[];
  /** Production status */
  production?: ProductionInfo[];
  /** Storage capacity */
  storage?: StorageInfo;
}

export type StationType =
  | 'trading'
  | 'factory'
  | 'shipyard'
  | 'wharf'
  | 'defence'
  | 'headquarters'
  | 'other';

export interface StationModule {
  id: EntityId;
  type: string;
  name: string;
  operational: boolean;
}

export interface ProductionInfo {
  /** Ware being produced */
  ware: WareReference;
  /** Production rate per hour */
  rate: number;
  /** Current cycle progress (0-1) */
  progress: number;
  /** Is production active */
  active: boolean;
}

export interface StorageInfo {
  /** Storage capacity by ware type */
  capacity: Record<string, Quantity>;
  /** Current stock levels */
  stock: StockLevel[];
}

export interface StockLevel {
  ware: WareReference;
  amount: Quantity;
  capacity: Quantity;
  percentage: number;
}

// =============================================================================
// Trade Types
// =============================================================================

export interface WareReference {
  id: string;
  name: string;
}

export interface Ware extends WareReference {
  /** Ware category */
  category: WareCategory;
  /** Description */
  description?: string;
  /** Volume per unit */
  volume: number;
  /** Base price */
  basePrice: Credits;
  /** Minimum price */
  minPrice: Credits;
  /** Maximum price */
  maxPrice: Credits;
  /** Is illegal ware */
  isIllegal: boolean;
  /** Transport type required */
  transportType: 'solid' | 'liquid' | 'container';
}

export type WareCategory =
  | 'resources'
  | 'intermediate'
  | 'refined'
  | 'hightech'
  | 'food'
  | 'medical'
  | 'weapons'
  | 'shields'
  | 'engines'
  | 'turrets'
  | 'drones'
  | 'software'
  | 'inventory'
  | 'other';

export interface TradeOffer {
  /** Station offering the trade */
  station: StationReference;
  /** Ware being traded */
  ware: WareReference;
  /** Is this a buy offer (station buys) or sell offer (station sells) */
  type: 'buy' | 'sell';
  /** Current price */
  price: Credits;
  /** Available quantity */
  amount: Quantity;
  /** Volume available */
  volume: number;
}

export interface TradeOrder {
  id: EntityId;
  /** Station with the order */
  station: StationReference;
  /** Ware to trade */
  ware: WareReference;
  /** Order type */
  type: 'buy' | 'sell';
  /** Target price */
  price: Credits;
  /** Target quantity */
  amount: Quantity;
  /** Restrict to own faction only */
  restrictToFaction: boolean;
  /** Is order active */
  active: boolean;
}

// =============================================================================
// Ship Types
// =============================================================================

export interface ShipReference {
  id: EntityId;
  name: string;
}

export interface Ship extends ShipReference {
  /** Ship class/type */
  class: ShipClass;
  /** Ship macro (blueprint) */
  macro: string;
  /** Owner */
  owner: FactionReference;
  /** Is player-owned */
  isPlayerOwned: boolean;
  /** Current pilot */
  pilot?: PilotInfo;
  /** Hull percentage */
  hull: number;
  /** Shield percentage */
  shield: number;
  /** Current location */
  sector: SectorReference;
  position: Position3D;
  /** Current order */
  currentOrder?: ShipOrder;
  /** Cargo hold */
  cargo?: CargoHold;
  /** Assigned to station (if subordinate) */
  commander?: StationReference | ShipReference;
}

export type ShipClass =
  | 'ship_xs'
  | 'ship_s'
  | 'ship_m'
  | 'ship_l'
  | 'ship_xl'
  | 'station';

export interface PilotInfo {
  name: string;
  skill: number;
  morale: number;
}

export interface ShipOrder {
  /** Order type */
  type: ShipOrderType;
  /** Order target (if applicable) */
  target?: EntityId;
  /** Order parameters */
  params?: Record<string, unknown>;
}

export type ShipOrderType =
  | 'trade'
  | 'mine'
  | 'patrol'
  | 'escort'
  | 'attack'
  | 'explore'
  | 'resupply'
  | 'wait'
  | 'flyto'
  | 'dock'
  | 'other';

export interface CargoHold {
  /** Capacity in m³ */
  capacity: number;
  /** Current usage in m³ */
  used: number;
  /** Cargo contents */
  items: CargoItem[];
}

export interface CargoItem {
  ware: WareReference;
  amount: Quantity;
  volume: number;
}

// =============================================================================
// Mission Types
// =============================================================================

export interface Mission {
  id: EntityId;
  /** Mission title */
  title: string;
  /** Mission description */
  description: string;
  /** Offering faction */
  faction?: FactionReference;
  /** Mission type */
  type: MissionType;
  /** Difficulty rating */
  difficulty: 'trivial' | 'easy' | 'medium' | 'hard' | 'very_hard';
  /** Reward amount */
  reward: Credits;
  /** Time limit (game time) */
  timeLimit?: GameTime;
  /** Time remaining */
  timeRemaining?: GameTime;
  /** Mission objectives */
  objectives?: MissionObjective[];
  /** Is active (accepted) */
  isActive: boolean;
  /** Location */
  location?: SectorReference;
}

export type MissionType =
  | 'delivery'
  | 'trade'
  | 'mining'
  | 'combat'
  | 'exploration'
  | 'rescue'
  | 'assassination'
  | 'sabotage'
  | 'build'
  | 'guild'
  | 'plot'
  | 'other';

export interface MissionObjective {
  id: string;
  text: string;
  completed: boolean;
  progress?: number;
  target?: number;
}

// =============================================================================
// Logbook Types
// =============================================================================

export interface LogbookEntry {
  id: EntityId;
  /** Entry timestamp (game time) */
  time: GameTime;
  /** Entry category */
  category: LogbookCategory;
  /** Entry title */
  title: string;
  /** Entry text */
  text: string;
  /** Related faction */
  faction?: FactionReference;
  /** Entry importance */
  importance: 'low' | 'medium' | 'high' | 'critical';
  /** Has been read */
  isRead: boolean;
}

export type LogbookCategory =
  | 'general'
  | 'missions'
  | 'alerts'
  | 'tips'
  | 'upkeep'
  | 'news'
  | 'other';

// =============================================================================
// Economy Types
// =============================================================================

export interface EconomyStats {
  /** Player's total net worth */
  netWorth: Credits;
  /** Total station value */
  stationValue: Credits;
  /** Total fleet value */
  fleetValue: Credits;
  /** Income per hour */
  incomePerHour: Credits;
  /** Expenses per hour */
  expensesPerHour: Credits;
}

export interface PriceInfo {
  ware: WareReference;
  /** Average price across all stations */
  avgPrice: Credits;
  /** Lowest sell price found */
  lowestSellPrice: Credits;
  /** Highest buy price found */
  highestBuyPrice: Credits;
  /** Best station to buy from */
  bestBuyStation?: StationReference;
  /** Best station to sell to */
  bestSellStation?: StationReference;
}

// =============================================================================
// API Request/Response Types
// =============================================================================

export interface GameState {
  /** Last update timestamp */
  timestamp: RealTime;
  /** Game time */
  gameTime: GameTime;
  /** Player info */
  player: PlayerInfo;
  /** Is game paused */
  isPaused: boolean;
  /** Game version */
  gameVersion?: string;
}

export interface DataUpdate<T> {
  /** Update type */
  type: string;
  /** Update timestamp */
  timestamp: RealTime;
  /** Update data */
  data: T;
}

// =============================================================================
// Command Types (for write operations)
// =============================================================================

export interface Command {
  /** Command ID for tracking */
  id: string;
  /** Command type */
  type: CommandType;
  /** Command parameters */
  params: Record<string, unknown>;
  /** Command timestamp */
  timestamp: RealTime;
}

export type CommandType =
  | 'create_trade_order'
  | 'modify_trade_order'
  | 'cancel_trade_order'
  | 'assign_ship'
  | 'set_trade_rule'
  | 'transfer_credits'
  | 'custom';

export interface CommandResult {
  /** Original command ID */
  commandId: string;
  /** Was command successful */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Result data */
  data?: Record<string, unknown>;
  /** Execution timestamp */
  timestamp: RealTime;
}

// =============================================================================
// Command Parameter Types
// =============================================================================

export interface CreateTradeOrderParams {
  stationId: EntityId;
  wareId: string;
  type: 'buy' | 'sell';
  price: Credits;
  amount: Quantity;
  restrictToFaction?: boolean;
}

export interface ModifyTradeOrderParams {
  orderId: EntityId;
  price?: Credits;
  amount?: Quantity;
  active?: boolean;
}

export interface AssignShipParams {
  shipId: EntityId;
  commanderId: EntityId;
  role?: 'trader' | 'miner' | 'defender';
}

export interface SetTradeRuleParams {
  stationId: EntityId;
  wareId: string;
  minStock?: Quantity;
  maxStock?: Quantity;
  buyPrice?: Credits;
  sellPrice?: Credits;
}
