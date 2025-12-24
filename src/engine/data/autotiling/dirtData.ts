import { defaultBitmask, defaultMeta } from "./autotilingData"
import { type AutotilingData, createTileRegistry } from "./createTileRegistry"

// Type for terrain data
export type DirtData = AutotilingData

// Terrain IDs - use these instead of magic strings
export const Dirt = {
  DIRT: "dirt",
  DIRT_WIDER: "dirt-wider",
} as const

export type DirtId = (typeof Dirt)[keyof typeof Dirt]

// Numeric tile types for paint system (used in GroundTile storage)
const TileTypes: Record<DirtId, number> = {
  [Dirt.DIRT]: 400,
  [Dirt.DIRT_WIDER]: 401,
}

const DIRST: Record<DirtId, DirtData> = {
  [Dirt.DIRT]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/dirt/dirt.png",
      category: "Tiles",
    },
    autotiling: {
      id: Dirt.DIRT,
      name: "Dirt",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: [],
    },
  },

  [Dirt.DIRT_WIDER]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/dirt/dirt_wide.png",
      category: "Tiles",
    },
    autotiling: {
      id: Dirt.DIRT_WIDER,
      name: "Dirt Wider",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: [],
    },
  },
}

// Create the registry with all helper functions
export const dirtRegistry = createTileRegistry(DIRST, TileTypes)
