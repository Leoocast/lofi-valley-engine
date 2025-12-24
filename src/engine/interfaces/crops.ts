import type { Entity } from "./entity"

/**
 * Configuración estática de un crop
 */
export interface CropConfig {
  // Identidad
  id: string
  name: string

  // Spritesheet
  row: number
  cropIndex: 0 | 1
  baseIndex: number

  // UI
  inventoryIconIndex: number

  // Ciclo de vida
  growthStages: number
  growthTimePerStage: number

  // Agua
  needsWater: true
  waterCheckInterval: number

  // Muerte
  deathTimeWithoutWater: number
  deathTimeWithoutHarvest: number

  /** Si el crop es perenne (puede cosecharse múltiples veces) */
  isPerennial: boolean
  /** Máximo de cosechas (0 = infinito) */
  maxHarvests: number
  /** Si usa el sprite permanente (stage 7) vs seed reset */
  usePermanentStage: boolean
  /** Stage al que resetea el perennial después de cosecha (si !usePermanentStage). Ej: 2 para resetear a stage 2 en lugar de 0 */
  perennialResetStage?: number
  /** Tiempo de crecimiento por stage después de la primera cosecha (para perennials). Si no se especifica, usa growthTimePerStage */
  regrowthTimePerStage?: number

  /** Item que dropea al cosechar */
  harvestItem: string
  /** Cantidad del item que dropea */
  harvestQuantity: number
  /** Minimum number of items to drop */
  minDrops?: number
  /** Maximum number of items to drop */
  maxDrops?: number
}

/**
 * Entity de un crop plantado en el mundo
 */
export interface CropEntity extends Entity {
  type: "crop"
  cropId: string

  // Estado de crecimiento
  currentStage: number
  plantedAt: number
  lastWateredAt: number
  totalGrowthMinutes: number // Minutos acumulados de crecimiento (solo mientras estuvo regado)

  // Riego (NEW: migrated from tilledSoil)
  isWatered: boolean
  wateredAt: number | null

  // Cosecha
  matureAt: number | null
  timesHarvested: number
  canHarvest: boolean

  // Muerte
  isDead: boolean
  diedAt: number | null

  // Tile
  tileX: number
  tileY: number
}
