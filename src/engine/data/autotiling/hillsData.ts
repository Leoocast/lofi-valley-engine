import {
  defaultBitmask,
  defaultMeta,
  defaultVariations,
} from "./autotilingData"
import { type AutotilingData, createTileRegistry } from "./createTileRegistry"

export type HillsData = AutotilingData

// Hills IDs - use these instead of magic strings
export const Hills = {
  GRASS_HILL: "grass_hill",
  DARKER_GRASS_HILL: "darker_grass_hill",
  SOIL_HILL: "soil_hill",
  DARKER_SOIL_HILL: "darker_soil_hill",
  STONE_HILL: "stone_hill",
  SNOW_HILL_1: "snow_hill_1",
  SNOW_HILL_2: "snow_hill_2",
} as const

export type HillsId = (typeof Hills)[keyof typeof Hills]

// Numeric tile types for paint system (used in GroundTile storage)
// Hills start at 200 to avoid collision with Grounds (100-105)
const TileTypes: Record<HillsId, number> = {
  [Hills.GRASS_HILL]: 200,
  [Hills.DARKER_GRASS_HILL]: 201,
  [Hills.SOIL_HILL]: 202,
  [Hills.DARKER_SOIL_HILL]: 203,
  [Hills.STONE_HILL]: 204,
  [Hills.SNOW_HILL_1]: 205,
  [Hills.SNOW_HILL_2]: 206,
}

// All ground definitions
const HILLS: Record<HillsId, HillsData> = {
  [Hills.GRASS_HILL]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/hills/grass_hills.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.GRASS_HILL,
      name: "Grass Hill",
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
  [Hills.DARKER_GRASS_HILL]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/hills/darker_grass_hills.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.DARKER_GRASS_HILL,
      name: "Darker Grass Hill",
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
  [Hills.SOIL_HILL]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/hills/soil_hills.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.SOIL_HILL,
      name: "Soil Hill",
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
  [Hills.DARKER_SOIL_HILL]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/hills/darker_soil_hills.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.DARKER_SOIL_HILL,
      name: "Darker Soil Hill",
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
  [Hills.STONE_HILL]: {
    meta: {
      ...defaultMeta,
      src: "autotiling/hills/stone_hills.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.STONE_HILL,
      name: "Stone Hill",
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
  [Hills.SNOW_HILL_1]: {
    meta: {
      ...defaultMeta,
      width: 176,
      height: 272, //Tall
      src: "autotiling/hills/snow_hills_1.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.SNOW_HILL_1,
      name: "Snow Hill 1",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
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
  [Hills.SNOW_HILL_2]: {
    meta: {
      ...defaultMeta,
      width: 176,
      height: 272, //Tall
      src: "autotiling/hills/snow_hills_2.png",
      category: "Tiles",
    },
    autotiling: {
      id: Hills.SNOW_HILL_2,
      name: "Snow Hill 2",
      layers: [1, 2, 3],
      bitmask: [...defaultBitmask],
      variations: {
        ...defaultVariations,
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
export const hillsRegistry = createTileRegistry(HILLS, TileTypes)
