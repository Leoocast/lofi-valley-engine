/**
 * Paint utilities for the laboratory view
 * Contains tile type mappings and layer option generators
 */

import { dirtRegistry } from "@/engine/data/autotiling/dirtData"
import { groundRegistry } from "@/engine/data/autotiling/groundData"
import { hillsRegistry } from "@/engine/data/autotiling/hillsData"
import { terrainRegistry } from "@/engine/data/autotiling/terrainData"

export interface TileOption {
  value: number
  label: string
}

/**
 * Dynamically builds tile type to preview sprite ID mapping from registries
 */
function buildTileTypeToPreview(): Record<number, string> {
  const mapping: Record<number, string> = {}

  // Terrains (Layer 0)
  for (const id of terrainRegistry.getAllIds()) {
    const tileType = terrainRegistry.tileTypes[id]
    mapping[tileType] = `${id}-preview`
  }

  // Grounds (Layers 1-3)
  for (const id of groundRegistry.getAllIds()) {
    const tileType = groundRegistry.tileTypes[id]
    // Preview ID: insert "_ground" before the number suffix
    // e.g., "grass_1" -> "grass_ground_1", "darker_grass_1" -> "darker_grass_ground_1"
    mapping[tileType] = id.replace(/_(\d)$/, "_ground_$1")
  }

  // Hills (Layers 1-3)
  for (const id of hillsRegistry.getAllIds()) {
    const tileType = hillsRegistry.tileTypes[id]
    mapping[tileType] = id.replace("_hill", "_hills")
  }

  // Dirt tiles (Layers 1-3)
  for (const id of dirtRegistry.getAllIds()) {
    const tileType = dirtRegistry.tileTypes[id]
    // Convert "dirt" -> "dirt", "dirt-wider" -> "dirt_wider"
    mapping[tileType] = id.replace("-", "_")
  }

  return mapping
}

export const TILE_TYPE_TO_PREVIEW = buildTileTypeToPreview()

/**
 * Get tile options based on layer
 */
export function getTileOptionsForLayer(layer: number): TileOption[] {
  const options: TileOption[] = []

  // Layer 0: Terrains only
  if (layer === 0) {
    const terrainTiles = terrainRegistry.getForLayer(0)
    for (const terrain of terrainTiles) {
      const tileType =
        terrainRegistry.tileTypes[
          terrain.autotiling.id as keyof typeof terrainRegistry.tileTypes
        ]
      if (tileType !== undefined && tileType < 100) {
        options.push({
          value: tileType,
          label: `🌿 ${terrain.autotiling.name}`,
        })
      }
    }
  }

  // Layers 1, 2, 3: Grounds + Hills
  if (layer >= 1 && layer <= 3) {
    // Grounds
    const groundTiles = groundRegistry.getForLayer(layer)
    for (const ground of groundTiles) {
      const tileType =
        groundRegistry.tileTypes[
          ground.autotiling.id as keyof typeof groundRegistry.tileTypes
        ]
      options.push({ value: tileType, label: `🌱 ${ground.autotiling.name}` })
    }

    // Hills
    const hillTiles = hillsRegistry.getForLayer(layer)
    for (const hill of hillTiles) {
      const tileType =
        hillsRegistry.tileTypes[
          hill.autotiling.id as keyof typeof hillsRegistry.tileTypes
        ]
      options.push({ value: tileType, label: `⛰️ ${hill.autotiling.name}` })
    }

    // Dirt tiles
    const dirtTiles = dirtRegistry.getForLayer(layer)
    for (const dirt of dirtTiles) {
      const tileType =
        dirtRegistry.tileTypes[
          dirt.autotiling.id as keyof typeof dirtRegistry.tileTypes
        ]
      options.push({ value: tileType, label: `🟤 ${dirt.autotiling.name}` })
    }
  }

  // Always add eraser option
  options.push({ value: -1, label: "❌ Eraser" })

  return options
}
