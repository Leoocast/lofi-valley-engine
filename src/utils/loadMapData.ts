/**
 * Map Loader Utility
 *
 * Loads custom map data from JSON files for different game levels.
 * Map files are stored in /src/engine/data/maps/
 */

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"

export interface MapData {
  id: string
  name: string
  createdAt: number
  updatedAt: number
  version: number
  data: {
    groundTiles: [string, GroundTile][]
    entities: any[] // Entity[] but avoiding circular dependency
    width: number
    height: number
  }
}

/**
 * Load a map from JSON file
 * @param mapName - Name of the map file (e.g., "map_1")
 * @returns Promise with the loaded ground tiles Map
 */
export async function loadMapData(
  mapName: string,
): Promise<Map<string, GroundTile>> {
  try {
    // Dynamic import of the JSON file
    const mapModule = await import(`@/engine/data/maps/${mapName}.json`)
    const mapData: MapData = mapModule.default

    // Convert entries array back to Map
    const groundTiles = new Map<string, GroundTile>(mapData.data.groundTiles)

    return groundTiles
  } catch (error) {
    console.error(`[MapLoader] Failed to load map "${mapName}":`, error)
    // Return empty map on error
    return new Map()
  }
}

/**
 * Synchronous version - loads map data immediately
 * Use this when you've already imported the map JSON
 */
export function loadMapDataSync(mapData: MapData): Map<string, GroundTile> {
  const groundTiles = new Map<string, GroundTile>(mapData.data.groundTiles)
  return groundTiles
}
