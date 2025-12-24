import {
  defaultBitmask,
  defaultMeta,
  defaultVariations,
} from "./autotilingData"
import { type AutotilingData, createTileRegistry } from "./createTileRegistry"

// Type for ground data
export type GroundData = AutotilingData

// Ground IDs - use these instead of magic strings
export const Ground = {
  GRASS_1: "grass_1",
  GRASS_2: "grass_2",
  DARKER_GRASS_1: "darker_grass_1",
  DARKER_GRASS_2: "darker_grass_2",
  SNOW_1: "snow_1",
  SNOW_2: "snow_2",
} as const

export type GroundId = (typeof Ground)[keyof typeof Ground]

// Numeric tile types for paint system (used in GroundTile storage)
// Layer 1 starts at 100 to avoid collision with Layer 0 terrains (0-99)
const TileTypes: Record<GroundId, number> = {
  [Ground.GRASS_1]: 100,
  [Ground.GRASS_2]: 101,
  [Ground.DARKER_GRASS_1]: 102,
  [Ground.DARKER_GRASS_2]: 103,
  [Ground.SNOW_1]: 104,
  [Ground.SNOW_2]: 105,
}

// All ground definitions
const GROUNDS: Record<GroundId, GroundData> = {
  [Ground.GRASS_1]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/ground/grass_ground_1.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.GRASS_1,
      name: "Grass 1",
      layers: [1, 2, 3],
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
  [Ground.GRASS_2]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/ground/grass_ground_2.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.GRASS_2,
      name: "Grass 2",
      layers: [1, 2, 3],
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
  [Ground.DARKER_GRASS_1]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/ground/darker_grass_ground_1.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.DARKER_GRASS_1,
      name: "Darker Grass 1",
      layers: [1, 2, 3],
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
  [Ground.DARKER_GRASS_2]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/ground/darker_grass_ground_2.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.DARKER_GRASS_2,
      name: "Darker Grass 2",
      layers: [1, 2, 3],
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
  [Ground.SNOW_1]: {
    meta: {
      ...defaultMeta,
      width: 176,
      height: 272, //Tall
      src: "autotiling/ground/snow_ground_1.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.SNOW_1,
      name: "Snow 1",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
        0: {
          cords: [
            [0, 17],
            [1, 17],
            [2, 17],
            [3, 17],
            [0, 18],
            [1, 18],
            [2, 18],
            [3, 18],
          ],
          percentage: 0.9,
        },
        255: {
          cords: [
            ...defaultVariations[255].cords,
            [5, 5],
            [6, 5],
            [7, 5],
            [8, 5],
            [9, 5],
            [5, 6],
            [6, 6],
            [7, 6],
            [8, 6],
            [9, 6],
            [0, 7],
            [1, 7],
            [2, 7],
            [3, 7],
            [4, 7],
            [5, 7],
            [6, 7],
            [7, 7],
            [8, 7],
            [9, 7],
            [0, 8],
            [1, 8],
            [2, 8],
            [3, 8],
            [4, 8],
            [5, 8],
            [6, 8],
            [7, 8],
            [8, 8],
            [9, 8],
            [0, 9],
            [1, 9],
            [2, 9],
            [3, 9],
            [4, 9],
            [5, 9],
            [6, 9],
            [7, 9],
            [8, 9],
            [9, 9],
            [0, 10],
            [1, 10],
            [2, 10],
            [3, 10],
            [4, 10],
            [5, 10],
            [6, 10],
            [7, 10],
            [8, 10],
            [9, 10],
            [0, 11],
            [1, 11],

            [4, 11],
            [5, 11],

            [8, 11],
            [9, 11],
            [0, 12],
            [1, 12],

            [4, 12],
            [5, 12],

            [8, 12],
            [9, 12],
            [0, 13],
            [1, 13],

            [4, 13],
            [5, 13],

            [8, 13],
            [9, 13],
            [0, 14],
            [1, 14],

            [4, 14],
            [5, 14],

            [8, 14],
            [9, 14],
            [0, 15],
            [1, 15],

            [4, 15],
            [5, 15],

            [8, 15],
            [9, 15],
            [0, 16],
            [1, 16],

            [4, 16],
            [5, 16],

            [8, 16],
            [9, 16],
          ],
          percentage: 0.1,
        },
      },
    },
  },
  [Ground.SNOW_2]: {
    meta: {
      ...defaultMeta,
      width: 176,
      height: 272, //Tall
      src: "autotiling/ground/snow_ground_2.png",
      category: "Tiles",
    },
    autotiling: {
      id: Ground.SNOW_2,
      name: "Snow 2",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
        0: {
          cords: [
            [0, 17],
            [1, 17],
            [2, 17],
            [3, 17],
            [0, 18],
            [1, 18],
            [2, 18],
            [3, 18],
          ],
          percentage: 0.9,
        },
        255: {
          cords: [
            ...defaultVariations[255].cords,
            [5, 5],
            [6, 5],
            [7, 5],
            [8, 5],
            [9, 5],
            [5, 6],
            [6, 6],
            [7, 6],
            [8, 6],
            [9, 6],
            [0, 7],
            [1, 7],
            [2, 7],
            [3, 7],
            [4, 7],
            [5, 7],
            [6, 7],
            [7, 7],
            [8, 7],
            [9, 7],
            [0, 8],
            [1, 8],
            [2, 8],
            [3, 8],
            [4, 8],
            [5, 8],
            [6, 8],
            [7, 8],
            [8, 8],
            [9, 8],
            [0, 9],
            [1, 9],
            [2, 9],
            [3, 9],
            [4, 9],
            [5, 9],
            [6, 9],
            [7, 9],
            [8, 9],
            [9, 9],
            [0, 10],
            [1, 10],
            [2, 10],
            [3, 10],
            [4, 10],
            [5, 10],
            [6, 10],
            [7, 10],
            [8, 10],
            [9, 10],
            [0, 11],
            [1, 11],

            [4, 11],
            [5, 11],

            [8, 11],
            [9, 11],
            [0, 12],
            [1, 12],

            [4, 12],
            [5, 12],

            [8, 12],
            [9, 12],
            [0, 13],
            [1, 13],

            [4, 13],
            [5, 13],

            [8, 13],
            [9, 13],
            [0, 14],
            [1, 14],

            [4, 14],
            [5, 14],

            [8, 14],
            [9, 14],
            [0, 15],
            [1, 15],

            [4, 15],
            [5, 15],

            [8, 15],
            [9, 15],
            [0, 16],
            [1, 16],

            [4, 16],
            [5, 16],

            [8, 16],
            [9, 16],
          ],
          percentage: 0.1,
        },
      },
    },
  },
}

// Create the registry with all helper functions
export const groundRegistry = createTileRegistry(GROUNDS, TileTypes)
