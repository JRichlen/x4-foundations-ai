/**
 * X4 Game API - Zod Validation Schemas
 *
 * Runtime validation schemas for data received from the X4 game extension.
 */

import { z } from 'zod';

// =============================================================================
// Core Schemas
// =============================================================================

export const EntityIdSchema = z.string().min(1);
export const GameTimeSchema = z.number().nonnegative();
export const RealTimeSchema = z.number().positive();
export const CreditsSchema = z.number();
export const QuantitySchema = z.number().int().nonnegative();

// =============================================================================
// Reference Schemas
// =============================================================================

export const FactionReferenceSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
});

export const SectorReferenceSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
});

export const StationReferenceSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
});

export const ShipReferenceSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
});

export const WareReferenceSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const ZoneReferenceSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
  sector: SectorReferenceSchema,
});

// =============================================================================
// Position Schema
// =============================================================================

export const Position3DSchema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

// =============================================================================
// Player Schemas
// =============================================================================

export const PlayerInfoSchema = z.object({
  id: EntityIdSchema,
  name: z.string(),
  money: CreditsSchema,
  gameTime: GameTimeSchema,
  currentSector: SectorReferenceSchema,
  currentShip: ShipReferenceSchema.optional(),
  faction: FactionReferenceSchema,
});

export const InventoryItemSchema = z.object({
  ware: WareReferenceSchema,
  amount: QuantitySchema,
  avgPrice: CreditsSchema.optional(),
});

export const PlayerInventorySchema = z.object({
  items: z.array(InventoryItemSchema),
  totalValue: CreditsSchema,
});

// =============================================================================
// Faction Schemas
// =============================================================================

export const FactionSchema = FactionReferenceSchema.extend({
  fullName: z.string(),
  description: z.string().optional(),
  race: z.string(),
  color: z.string().optional(),
});

export const FactionRelationSchema = z.object({
  faction: FactionReferenceSchema,
  relation: z.number(),
  relationLevel: z.string(),
  hasMilitaryLicense: z.boolean(),
  hasCapitalLicense: z.boolean(),
  recentChange: z.number().optional(),
});

// =============================================================================
// Station Schemas
// =============================================================================

export const StationTypeSchema = z.enum([
  'trading',
  'factory',
  'shipyard',
  'wharf',
  'defence',
  'headquarters',
  'other',
]);

export const StationModuleSchema = z.object({
  id: EntityIdSchema,
  type: z.string(),
  name: z.string(),
  operational: z.boolean(),
});

export const ProductionInfoSchema = z.object({
  ware: WareReferenceSchema,
  rate: z.number(),
  progress: z.number().min(0).max(1),
  active: z.boolean(),
});

export const StockLevelSchema = z.object({
  ware: WareReferenceSchema,
  amount: QuantitySchema,
  capacity: QuantitySchema,
  percentage: z.number().min(0).max(100),
});

export const StorageInfoSchema = z.object({
  capacity: z.record(z.string(), QuantitySchema),
  stock: z.array(StockLevelSchema),
});

export const StationSchema = StationReferenceSchema.extend({
  owner: FactionReferenceSchema,
  type: StationTypeSchema,
  sector: SectorReferenceSchema,
  zone: ZoneReferenceSchema.optional(),
  position: Position3DSchema,
  hull: z.number().min(0).max(100),
  isPlayerOwned: z.boolean(),
  modules: z.array(StationModuleSchema).optional(),
  production: z.array(ProductionInfoSchema).optional(),
  storage: StorageInfoSchema.optional(),
});

// =============================================================================
// Trade Schemas
// =============================================================================

export const WareCategorySchema = z.enum([
  'resources',
  'intermediate',
  'refined',
  'hightech',
  'food',
  'medical',
  'weapons',
  'shields',
  'engines',
  'turrets',
  'drones',
  'software',
  'inventory',
  'other',
]);

export const WareSchema = WareReferenceSchema.extend({
  category: WareCategorySchema,
  description: z.string().optional(),
  volume: z.number().positive(),
  basePrice: CreditsSchema,
  minPrice: CreditsSchema,
  maxPrice: CreditsSchema,
  isIllegal: z.boolean(),
  transportType: z.enum(['solid', 'liquid', 'container']),
});

export const TradeOfferSchema = z.object({
  station: StationReferenceSchema,
  ware: WareReferenceSchema,
  type: z.enum(['buy', 'sell']),
  price: CreditsSchema,
  amount: QuantitySchema,
  volume: z.number(),
});

export const TradeOrderSchema = z.object({
  id: EntityIdSchema,
  station: StationReferenceSchema,
  ware: WareReferenceSchema,
  type: z.enum(['buy', 'sell']),
  price: CreditsSchema,
  amount: QuantitySchema,
  restrictToFaction: z.boolean(),
  active: z.boolean(),
});

// =============================================================================
// Ship Schemas
// =============================================================================

export const ShipClassSchema = z.enum([
  'ship_xs',
  'ship_s',
  'ship_m',
  'ship_l',
  'ship_xl',
  'station',
]);

export const PilotInfoSchema = z.object({
  name: z.string(),
  skill: z.number().min(0).max(15),
  morale: z.number().min(0).max(100),
});

export const ShipOrderTypeSchema = z.enum([
  'trade',
  'mine',
  'patrol',
  'escort',
  'attack',
  'explore',
  'resupply',
  'wait',
  'flyto',
  'dock',
  'other',
]);

export const ShipOrderSchema = z.object({
  type: ShipOrderTypeSchema,
  target: EntityIdSchema.optional(),
  params: z.record(z.unknown()).optional(),
});

export const CargoItemSchema = z.object({
  ware: WareReferenceSchema,
  amount: QuantitySchema,
  volume: z.number(),
});

export const CargoHoldSchema = z.object({
  capacity: z.number().positive(),
  used: z.number().nonnegative(),
  items: z.array(CargoItemSchema),
});

export const ShipSchema = ShipReferenceSchema.extend({
  class: ShipClassSchema,
  macro: z.string(),
  owner: FactionReferenceSchema,
  isPlayerOwned: z.boolean(),
  pilot: PilotInfoSchema.optional(),
  hull: z.number().min(0).max(100),
  shield: z.number().min(0).max(100),
  sector: SectorReferenceSchema,
  position: Position3DSchema,
  currentOrder: ShipOrderSchema.optional(),
  cargo: CargoHoldSchema.optional(),
  commander: z.union([StationReferenceSchema, ShipReferenceSchema]).optional(),
});

// =============================================================================
// Mission Schemas
// =============================================================================

export const MissionTypeSchema = z.enum([
  'delivery',
  'trade',
  'mining',
  'combat',
  'exploration',
  'rescue',
  'assassination',
  'sabotage',
  'build',
  'guild',
  'plot',
  'other',
]);

export const MissionDifficultySchema = z.enum([
  'trivial',
  'easy',
  'medium',
  'hard',
  'very_hard',
]);

export const MissionObjectiveSchema = z.object({
  id: z.string(),
  text: z.string(),
  completed: z.boolean(),
  progress: z.number().optional(),
  target: z.number().optional(),
});

export const MissionSchema = z.object({
  id: EntityIdSchema,
  title: z.string(),
  description: z.string(),
  faction: FactionReferenceSchema.optional(),
  type: MissionTypeSchema,
  difficulty: MissionDifficultySchema,
  reward: CreditsSchema,
  timeLimit: GameTimeSchema.optional(),
  timeRemaining: GameTimeSchema.optional(),
  objectives: z.array(MissionObjectiveSchema).optional(),
  isActive: z.boolean(),
  location: SectorReferenceSchema.optional(),
});

// =============================================================================
// Logbook Schemas
// =============================================================================

export const LogbookCategorySchema = z.enum([
  'general',
  'missions',
  'alerts',
  'tips',
  'upkeep',
  'news',
  'other',
]);

export const LogbookImportanceSchema = z.enum([
  'low',
  'medium',
  'high',
  'critical',
]);

export const LogbookEntrySchema = z.object({
  id: EntityIdSchema,
  time: GameTimeSchema,
  category: LogbookCategorySchema,
  title: z.string(),
  text: z.string(),
  faction: FactionReferenceSchema.optional(),
  importance: LogbookImportanceSchema,
  isRead: z.boolean(),
});

// =============================================================================
// Game State Schema
// =============================================================================

export const GameStateSchema = z.object({
  timestamp: RealTimeSchema,
  gameTime: GameTimeSchema,
  player: PlayerInfoSchema,
  isPaused: z.boolean(),
  gameVersion: z.string().optional(),
});

// =============================================================================
// Command Schemas
// =============================================================================

export const CommandTypeSchema = z.enum([
  'create_trade_order',
  'modify_trade_order',
  'cancel_trade_order',
  'assign_ship',
  'set_trade_rule',
  'transfer_credits',
  'custom',
]);

export const CommandSchema = z.object({
  id: z.string(),
  type: CommandTypeSchema,
  params: z.record(z.unknown()),
  timestamp: RealTimeSchema,
});

export const CommandResultSchema = z.object({
  commandId: z.string(),
  success: z.boolean(),
  error: z.string().optional(),
  data: z.record(z.unknown()).optional(),
  timestamp: RealTimeSchema,
});

// =============================================================================
// Command Parameter Schemas
// =============================================================================

export const CreateTradeOrderParamsSchema = z.object({
  stationId: EntityIdSchema,
  wareId: z.string(),
  type: z.enum(['buy', 'sell']),
  price: CreditsSchema,
  amount: QuantitySchema,
  restrictToFaction: z.boolean().optional(),
});

export const ModifyTradeOrderParamsSchema = z.object({
  orderId: EntityIdSchema,
  price: CreditsSchema.optional(),
  amount: QuantitySchema.optional(),
  active: z.boolean().optional(),
});

export const AssignShipParamsSchema = z.object({
  shipId: EntityIdSchema,
  commanderId: EntityIdSchema,
  role: z.enum(['trader', 'miner', 'defender']).optional(),
});

export const SetTradeRuleParamsSchema = z.object({
  stationId: EntityIdSchema,
  wareId: z.string(),
  minStock: QuantitySchema.optional(),
  maxStock: QuantitySchema.optional(),
  buyPrice: CreditsSchema.optional(),
  sellPrice: CreditsSchema.optional(),
});

// =============================================================================
// Data Update Schema
// =============================================================================

export const DataUpdateSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    type: z.string(),
    timestamp: RealTimeSchema,
    data: dataSchema,
  });
