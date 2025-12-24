import {
  defaultBitmask,
  defaultMeta,
  defaultVariations,
} from "./autotilingData"
import { type AutotilingData, createTileRegistry } from "./createTileRegistry"

// Type for terrain data
export type TerrainData = AutotilingData

// Terrain IDs - use these instead of magic strings
export const Terrain = {
  GRASS: "grass-terrain",
  DARKER_GRASS: "darker-grass-terrain",
  SOIL_GROUND: "soil-ground-terrain",
  DARKER_SOIL_GROUND: "darker-soil-ground-terrain",
  STONE_GROUND: "stone-ground-terrain",
} as const

export type TerrainId = (typeof Terrain)[keyof typeof Terrain]

// Numeric tile types for paint system (used in GroundTile storage)
const TileTypes: Record<TerrainId, number> = {
  [Terrain.GRASS]: 0,
  [Terrain.DARKER_GRASS]: 1,
  [Terrain.SOIL_GROUND]: 2,
  [Terrain.DARKER_SOIL_GROUND]: 3,
  [Terrain.STONE_GROUND]: 4,
}

// All terrain definitions
const TERRAINS: Record<TerrainId, TerrainData> = {
  [Terrain.GRASS]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/terrain/grass_terrain.png",
      category: "Tiles",
    },
    autotiling: {
      id: Terrain.GRASS,
      name: "Grass Terrain",
      layers: [0],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
        255: {
          cords: [...defaultVariations[255].cords, [5, 6], [5, 5]],
          percentage: 0.1,
        },
      },
    },
  },

  [Terrain.DARKER_GRASS]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/terrain/darker_grass_terrain.png",
      category: "Tiles",
    },
    autotiling: {
      id: Terrain.DARKER_GRASS,
      name: "Darker Grass Terrain",
      layers: [0],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
        255: {
          cords: [...defaultVariations[255].cords, [5, 6], [5, 5]],
          percentage: 0.1,
        },
      },
    },
  },

  [Terrain.SOIL_GROUND]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/terrain/soil_ground_terrain.png",
      category: "Tiles",
    },
    autotiling: {
      id: Terrain.SOIL_GROUND,
      name: "Soil Ground Terrain",
      layers: [0],
      bitmask: [...defaultBitmask],
      variations: { ...defaultVariations },
    },
  },

  [Terrain.DARKER_SOIL_GROUND]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/terrain/darker_soil_ground_terrain.png",
      category: "Tiles",
    },
    autotiling: {
      id: Terrain.DARKER_SOIL_GROUND,
      name: "Darker Soil Ground Terrain",
      layers: [0],
      bitmask: [...defaultBitmask],
      variations: { ...defaultVariations },
    },
  },

  [Terrain.STONE_GROUND]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/terrain/stone_ground_terrain.png",
      category: "Tiles",
    },
    autotiling: {
      id: Terrain.STONE_GROUND,
      name: "Stone Ground Terrain",
      layers: [0],
      bitmask: [...defaultBitmask],
      variations: { ...defaultVariations },
    },
  },
}

// Create the registry with all helper functions
export const terrainRegistry = createTileRegistry(TERRAINS, TileTypes)
