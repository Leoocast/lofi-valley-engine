/**
 * Blob Autotiling System (8-direction, 47 tiles)
 *
 * Uses data-driven approach from terrainData.ts
 * Bitmask bits: N=1, NE=2, E=4, SE=8, S=16, SW=32, W=64, NW=128
 */

import { dirtRegistry } from "../data/autotiling/dirtData"
import { groundRegistry } from "../data/autotiling/groundData"
import { hillsRegistry } from "../data/autotiling/hillsData"
import { Terrain, terrainRegistry } from "../data/autotiling/terrainData"
import type { GroundTile, LayerTile } from "./groundAutotiling"

// Lookup table: bitmask -> { col, row } in spritesheet
type BitmaskLookup = Record<number, { col: number; row: number }>

/**
 * Generate lookup table from 2D bitmask array
 */
function generateBitmaskLookup(bitmask: (number | null)[][]): BitmaskLookup {
  const lookup: BitmaskLookup = {}

  for (let row = 0; row < bitmask.length; row++) {
    for (let col = 0; col < bitmask[row].length; col++) {
      const value = bitmask[row][col]
      if (value !== null) {
        lookup[value] = { col, row }
      }
    }
  }

  return lookup
}

// Get the default terrain data (Grass)
const defaultTerrain = terrainRegistry.get(Terrain.GRASS)

// Pre-generate lookup tables from data
const BITMASK_LOOKUP = generateBitmaskLookup(defaultTerrain.autotiling.bitmask)

// Spritesheet dimensions
const TILE_WIDTH = defaultTerrain.meta.tileWidth ?? 16
const SHEET_COLS = Math.floor(defaultTerrain.meta.width / TILE_WIDTH)

/**
 * Calculate 8-direction bitmask for a tile
 */
export function calculateBlobBitmask(
  x: number,
  y: number,
  tileType: number,
  layer: number,
  groundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): number {
  let mask = 0

  const directions = [
    { dx: 0, dy: -1, bit: 0 }, // N
    { dx: 1, dy: -1, bit: 1 }, // NE
    { dx: 1, dy: 0, bit: 2 }, // E
    { dx: 1, dy: 1, bit: 3 }, // SE
    { dx: 0, dy: 1, bit: 4 }, // S
    { dx: -1, dy: 1, bit: 5 }, // SW
    { dx: -1, dy: 0, bit: 6 }, // W
    { dx: -1, dy: -1, bit: 7 }, // NW
  ]

  for (const dir of directions) {
    const nx = x + dir.dx
    const ny = y + dir.dy

    if (nx < 0 || nx >= worldWidth || ny < 0 || ny >= worldHeight) {
      continue
    }

    const neighborKey = `${nx}-${ny}`
    const neighborTile = groundTiles.get(neighborKey)

    if (neighborTile?.layers[layer]?.type === tileType) {
      mask |= 1 << dir.bit // eslint-disable-line no-bitwise
    }
  }

  return refineBitmask(mask)
}

/**
 * Refine bitmask by removing diagonal bits when cardinal neighbors aren't present
 */
function refineBitmask(mask: number): number {
  const N = 1,
    NE = 2,
    E = 4,
    SE = 8
  const S = 16,
    SW = 32,
    W = 64,
    NW = 128

  if (!(mask & N && mask & E)) {
    mask &= ~NE // eslint-disable-line no-bitwise
  }
  if (!(mask & S && mask & E)) {
    mask &= ~SE // eslint-disable-line no-bitwise
  }
  if (!(mask & S && mask & W)) {
    mask &= ~SW // eslint-disable-line no-bitwise
  }
  if (!(mask & N && mask & W)) {
    mask &= ~NW // eslint-disable-line no-bitwise
  }

  return mask
}

/**
 * Get sprite coordinates from bitmask
 * Uses tile position (x, y) as seed for deterministic variations
 */
export function getBlobTileCoords(
  bitmask: number,
  x: number,
  y: number,
  tileType: number,
): {
  col: number
  row: number
} {
  // Get tile-specific variations from the appropriate registry
  const terrainId = terrainRegistry.tileTypeToId[tileType]
  const groundId = groundRegistry.tileTypeToId[tileType]
  const hillId = hillsRegistry.tileTypeToId[tileType]
  const dirtId = dirtRegistry.tileTypeToId[tileType]

  const tileData = terrainId
    ? terrainRegistry.get(terrainId)
    : groundId
      ? groundRegistry.get(groundId)
      : hillId
        ? hillsRegistry.get(hillId)
        : dirtId
          ? dirtRegistry.get(dirtId)
          : null
  const variations = tileData?.autotiling.variations ?? {}

  // Check for variations - use position-based seed
  const variation = variations[bitmask]
  if (variation) {
    // Better hash using XOR and bit shifting for uniform distribution
    // eslint-disable-next-line no-bitwise
    let hash = x ^ (y * 0x9e3779b9)
    // eslint-disable-next-line no-bitwise
    hash = ((hash >>> 16) ^ hash) * 0x45d9f3b
    // eslint-disable-next-line no-bitwise
    hash = ((hash >>> 16) ^ hash) * 0x45d9f3b
    // eslint-disable-next-line no-bitwise
    hash = (hash >>> 16) ^ hash

    const normalizedHash = Math.abs(hash % 1000) / 1000
    if (normalizedHash < variation.percentage) {
      // Pick variation index based on the same hash
      const variationIndex = Math.abs(hash % variation.cords.length)
      const [col, row] = variation.cords[variationIndex]
      return { col, row }
    }
    // Otherwise fall through to use original tile from lookup
  }

  // Exact match from bitmask array
  if (BITMASK_LOOKUP[bitmask]) {
    return BITMASK_LOOKUP[bitmask]
  }

  // Fallback: find closest match
  let bestMatch = { col: 0, row: 0 }
  let bestScore = -1

  for (const [maskStr, coords] of Object.entries(BITMASK_LOOKUP)) {
    const tileMask = parseInt(maskStr)
    const matchingBits = ~(bitmask ^ tileMask) // eslint-disable-line no-bitwise
    const score = countBits(matchingBits & 0xff) // eslint-disable-line no-bitwise

    if (score > bestScore) {
      bestScore = score
      bestMatch = coords
    }
  }

  return bestMatch
}

/**
 * Get sprite index (linear) from bitmask
 * For backward compatibility with existing render code
 */
export function getBlobTileIndex(
  bitmask: number,
  x: number,
  y: number,
  tileType: number,
): number {
  const { col, row } = getBlobTileCoords(bitmask, x, y, tileType)
  return row * SHEET_COLS + col
}

function countBits(n: number): number {
  let count = 0
  while (n) {
    count += n & 1 // eslint-disable-line no-bitwise
    n >>= 1 // eslint-disable-line no-bitwise
  }
  return count
}

/**
 * Paint tile using blob autotiling system
 */
export function paintBlobTile(
  x: number,
  y: number,
  tileType: number,
  layer: number,
  currentGroundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): Map<string, GroundTile> {
  // Deep copy: create new Map with NEW GroundTile objects
  const next = new Map<string, GroundTile>()
  for (const [k, tile] of currentGroundTiles) {
    next.set(k, {
      layers: [...tile.layers] as [
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
      ],
    })
  }

  const key = `${x}-${y}`
  const existingTile = next.get(key)
  // Create a NEW object with copied layers to avoid mutation
  const newLayers = existingTile
    ? ([...existingTile.layers] as [
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
      ])
    : ([null, null, null, null] as [
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
      ])

  if (tileType === -1) {
    newLayers[layer] = null
  } else {
    const bitmask = calculateBlobBitmask(
      x,
      y,
      tileType,
      layer,
      next,
      worldWidth,
      worldHeight,
    )
    const spriteIndex = getBlobTileIndex(bitmask, x, y, tileType)
    newLayers[layer] = { type: tileType, spriteIndex }
  }

  if (newLayers.some((l) => l !== null)) {
    next.set(key, { layers: newLayers })
  } else {
    next.delete(key)
  }

  // Recalculate 8 neighbors
  const neighbors = [
    { dx: 0, dy: -1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
    { dx: 0, dy: 1 },
    { dx: -1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: -1 },
  ]

  for (const neighbor of neighbors) {
    const nx = x + neighbor.dx
    const ny = y + neighbor.dy

    if (nx < 0 || nx >= worldWidth || ny < 0 || ny >= worldHeight) continue

    const neighborKey = `${nx}-${ny}`
    const neighborTile = next.get(neighborKey)
    if (!neighborTile) continue

    const updatedLayers = [...neighborTile.layers] as [
      LayerTile | null,
      LayerTile | null,
      LayerTile | null,
      LayerTile | null,
    ]

    for (let l = 0; l < 4; l++) {
      if (updatedLayers[l]) {
        const newBitmask = calculateBlobBitmask(
          nx,
          ny,
          updatedLayers[l]!.type,
          l,
          next,
          worldWidth,
          worldHeight,
        )
        const newSpriteIndex = getBlobTileIndex(
          newBitmask,
          nx,
          ny,
          updatedLayers[l]!.type,
        )
        updatedLayers[l] = {
          type: updatedLayers[l]!.type,
          spriteIndex: newSpriteIndex,
        }
      }
    }

    next.set(neighborKey, { layers: updatedLayers })
  }

  // Recalculate center tile
  if (tileType !== -1) {
    const centerTile = next.get(key)
    if (centerTile) {
      const updatedLayers = [...centerTile.layers] as [
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
        LayerTile | null,
      ]

      for (let l = 0; l < 4; l++) {
        if (updatedLayers[l]) {
          const finalBitmask = calculateBlobBitmask(
            x,
            y,
            updatedLayers[l]!.type,
            l,
            next,
            worldWidth,
            worldHeight,
          )
          const finalSpriteIndex = getBlobTileIndex(
            finalBitmask,
            x,
            y,
            updatedLayers[l]!.type,
          )
          updatedLayers[l] = {
            type: updatedLayers[l]!.type,
            spriteIndex: finalSpriteIndex,
          }
        }
      }

      next.set(key, { layers: updatedLayers })
    }
  }

  return next
}

/**
 * Paint area using blob autotiling (brush support)
 */
export function paintBlobArea(
  centerX: number,
  centerY: number,
  radius: number,
  tileType: number,
  layer: number,
  currentGroundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): Map<string, GroundTile> {
  const next = new Map(currentGroundTiles)
  const affectedTiles = new Set<string>()

  // Paint all tiles in brush area
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tx = centerX + dx
      const ty = centerY + dy

      if (tx < 0 || tx >= worldWidth || ty < 0 || ty >= worldHeight) continue

      const key = `${tx}-${ty}`
      affectedTiles.add(key)

      const groundTile = next.get(key) || { layers: [null, null, null, null] }

      if (tileType === -1) {
        groundTile.layers[layer] = null
      } else {
        groundTile.layers[layer] = { type: tileType, spriteIndex: 0 }
      }

      if (groundTile.layers.some((l) => l !== null)) {
        next.set(key, groundTile)
      } else {
        next.delete(key)
      }
    }
  }

  // Add neighbors to recalculation set
  const tilesToRecalculate = new Set(affectedTiles)
  for (const key of affectedTiles) {
    const [x, y] = key.split("-").map(Number)
    const neighbors = [
      `${x}-${y - 1}`,
      `${x + 1}-${y - 1}`,
      `${x + 1}-${y}`,
      `${x + 1}-${y + 1}`,
      `${x}-${y + 1}`,
      `${x - 1}-${y + 1}`,
      `${x - 1}-${y}`,
      `${x - 1}-${y - 1}`,
    ]
    neighbors.forEach((nkey) => tilesToRecalculate.add(nkey))
  }

  // Recalculate all affected tiles
  for (const key of tilesToRecalculate) {
    const tile = next.get(key)
    if (!tile) continue

    const [x, y] = key.split("-").map(Number)
    const updatedLayers = [...tile.layers] as [
      LayerTile | null,
      LayerTile | null,
      LayerTile | null,
      LayerTile | null,
    ]

    for (let l = 0; l < 4; l++) {
      if (updatedLayers[l]) {
        const bitmask = calculateBlobBitmask(
          x,
          y,
          updatedLayers[l]!.type,
          l,
          next,
          worldWidth,
          worldHeight,
        )
        const spriteIndex = getBlobTileIndex(
          bitmask,
          x,
          y,
          updatedLayers[l]!.type,
        )
        updatedLayers[l] = { type: updatedLayers[l]!.type, spriteIndex }
      }
    }

    next.set(key, { layers: updatedLayers })
  }

  return next
}
