/**
 * Tile Registry Factory
 *
 * Creates a registry with all common helper functions for tile-based data.
 * Eliminates code duplication between terrainData, groundData, and future tile types.
 */

import type { Spritesheet } from "@/engine/interfaces/spritesheets"
import type { SpriteSheetData } from "../spritesheetData"
import { toSpritesheet } from "../spritesheetData"
import type { AutotilingSpritesheet } from "./autotilingData"

// Base type for any autotiling tile data
export type AutotilingData = SpriteSheetData<{
  autotiling: AutotilingSpritesheet
}>

/**
 * Creates a tile registry with all common helper functions.
 *
 * @param items - Record of all tile data items (e.g., TERRAINS, GROUNDS)
 * @param tileTypes - Record mapping tile IDs to numeric tile types
 * @returns Registry object with all helper functions
 */
export function createTileRegistry<
  TId extends string,
  TData extends AutotilingData,
>(items: Record<TId, TData>, tileTypes: Record<TId, number>) {
  // Create reverse lookup: tile type number -> tile id
  const tileTypeToId: Record<number, TId> = Object.entries(tileTypes).reduce(
    (acc, [id, type]) => {
      acc[type as number] = id as TId
      return acc
    },
    {} as Record<number, TId>,
  )

  // Spritesheet cache for performance
  const spritesheetCache = new Map<TId, Spritesheet>()

  return {
    /** All items in the registry */
    items,

    /** Mapping of tile IDs to numeric tile types */
    tileTypes,

    /** Reverse lookup: tile type number -> tile id */
    tileTypeToId,

    /**
     * Get tile data by ID
     */
    get(id: TId): TData {
      return items[id]
    },

    /**
     * Get tile data by numeric tile type
     */
    getByTileType(tileType: number): TData | null {
      const id = tileTypeToId[tileType]
      return id ? items[id] : null
    },

    /**
     * Get spritesheet for a tile ID
     */
    getSpritesheet(id: TId): Spritesheet {
      return toSpritesheet(items[id])
    },

    /**
     * Get cached spritesheet for a tile ID (performance optimization)
     */
    getCachedSpritesheet(id: TId): Spritesheet {
      if (!spritesheetCache.has(id)) {
        spritesheetCache.set(id, toSpritesheet(items[id]))
      }
      return spritesheetCache.get(id)!
    },

    /**
     * Get all tile data for a specific layer
     */
    getForLayer(layer: number): TData[] {
      return (Object.values(items) as TData[]).filter((item) =>
        item.autotiling.layers.includes(layer),
      )
    },

    /**
     * Get all tile IDs for a specific layer
     */
    getIdsForLayer(layer: number): TId[] {
      return (Object.entries(items) as [TId, TData][])
        .filter(([, item]) => item.autotiling.layers.includes(layer))
        .map(([id]) => id)
    },

    /**
     * Get all tile IDs
     */
    getAllIds(): TId[] {
      return Object.keys(items) as TId[]
    },

    /**
     * Get all tile data
     */
    getAll(): TData[] {
      return Object.values(items)
    },
  }
}

/** Type for a registry created by createTileRegistry */
export type TileRegistry<
  TId extends string,
  TData extends AutotilingData,
> = ReturnType<typeof createTileRegistry<TId, TData>>
