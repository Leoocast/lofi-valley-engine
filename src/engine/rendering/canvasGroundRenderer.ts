/**
 * Canvas Ground Renderer
 * Draws ground tiles on canvas instead of DOM
 */

import type { GroundTile } from "../autotiling/groundAutotiling"
import { dirtRegistry } from "../data/autotiling/dirtData"
import { groundRegistry } from "../data/autotiling/groundData"
import { hillsRegistry } from "../data/autotiling/hillsData"
import { terrainRegistry } from "../data/autotiling/terrainData"

import { TILE_SIZE } from "./config"
import { getCachedImage } from "./spritesheetLoader"

/**
 * Get spritesheet config by tile type
 * Checks terrainRegistry (0-99), groundRegistry (100-199), hillsRegistry (200-299), dirtRegistry (400+)
 */
function getSpritesheetForType(type: number) {
  // Layer 0: Terrains (0-99)
  const terrainId = terrainRegistry.tileTypeToId[type]
  if (terrainId) {
    return terrainRegistry.getCachedSpritesheet(terrainId)
  }

  // Grounds (100-199)
  const groundId = groundRegistry.tileTypeToId[type]
  if (groundId) {
    return groundRegistry.getCachedSpritesheet(groundId)
  }

  // Hills (200-299)
  const hillId = hillsRegistry.tileTypeToId[type]
  if (hillId) {
    return hillsRegistry.getCachedSpritesheet(hillId)
  }

  // Dirt (400+)
  const dirtId = dirtRegistry.tileTypeToId[type]
  if (dirtId) {
    return dirtRegistry.getCachedSpritesheet(dirtId)
  }

  return null
}

/**
 * Draw a single tile on canvas
 */
export function drawTile(
  ctx: CanvasRenderingContext2D,
  tileType: number,
  spriteIndex: number,
  tileX: number,
  tileY: number,
): void {
  const sheet = getSpritesheetForType(tileType)
  if (!sheet) return

  const image = getCachedImage(sheet.src)
  if (!image) return

  const cols = sheet.sheetWidth / sheet.width
  const srcX = (spriteIndex % cols) * sheet.width
  const srcY = Math.floor(spriteIndex / cols) * sheet.height

  ctx.drawImage(
    image,
    srcX,
    srcY,
    sheet.width,
    sheet.height,
    tileX * TILE_SIZE,
    tileY * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
  )
}

/**
 * Clear a single tile position
 */
export function clearTile(
  ctx: CanvasRenderingContext2D,
  tileX: number,
  tileY: number,
): void {
  ctx.clearRect(tileX * TILE_SIZE, tileY * TILE_SIZE, TILE_SIZE, TILE_SIZE)
}

/**
 * Draw entire layer from groundTiles
 */
export function drawLayer(
  ctx: CanvasRenderingContext2D,
  groundTiles: Map<string, GroundTile>,
  layer: number,
): void {
  // Clear entire canvas first
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw all tiles in this layer
  for (const [key, tile] of groundTiles) {
    const layerTile = tile.layers[layer]
    if (!layerTile) continue

    const [xStr, yStr] = key.split("-")
    const x = parseInt(xStr)
    const y = parseInt(yStr)

    drawTile(ctx, layerTile.type, layerTile.spriteIndex, x, y)
  }
}

/**
 * Update only specific tiles (incremental update)
 */
export function updateTiles(
  ctx: CanvasRenderingContext2D,
  changedKeys: Set<string>,
  groundTiles: Map<string, GroundTile>,
  layer: number,
): void {
  for (const key of changedKeys) {
    const [xStr, yStr] = key.split("-")
    const x = parseInt(xStr)
    const y = parseInt(yStr)

    // Clear the tile position
    clearTile(ctx, x, y)

    // Draw new tile if exists
    const tile = groundTiles.get(key)
    const layerTile = tile?.layers[layer]
    if (layerTile) {
      drawTile(ctx, layerTile.type, layerTile.spriteIndex, x, y)
    }
  }
}

/**
 * Find keys that changed between two groundTiles maps
 */
export function findChangedKeys(
  prev: Map<string, GroundTile>,
  next: Map<string, GroundTile>,
): Set<string> {
  const changed = new Set<string>()

  // Check all keys in next
  for (const [key, tile] of next) {
    const prevTile = prev.get(key)
    if (!prevTile || !tilesEqual(prevTile, tile)) {
      changed.add(key)
    }
  }

  // Check removed keys
  for (const key of prev.keys()) {
    if (!next.has(key)) {
      changed.add(key)
    }
  }

  return changed
}

/**
 * Compare two GroundTiles for equality
 */
function tilesEqual(a: GroundTile, b: GroundTile): boolean {
  for (let i = 0; i < 4; i++) {
    const aLayer = a.layers[i]
    const bLayer = b.layers[i]
    if (aLayer === null && bLayer === null) continue
    if (aLayer === null || bLayer === null) return false
    if (
      aLayer.type !== bLayer.type ||
      aLayer.spriteIndex !== bLayer.spriteIndex
    ) {
      return false
    }
  }
  return true
}
/**
 * Get all spritesheet sources for preloading
 */
export function getSpritesheetSources(): string[] {
  // Get all terrain spritesheets (Layer 0)
  const terrainSources = terrainRegistry
    .getAllIds()
    .map((terrainId) => terrainRegistry.getCachedSpritesheet(terrainId).src)

  // Get all ground spritesheets
  const groundSources = groundRegistry
    .getAllIds()
    .map((groundId) => groundRegistry.getCachedSpritesheet(groundId).src)

  // Get all hills spritesheets
  const hillsSources = hillsRegistry
    .getAllIds()
    .map((hillId) => hillsRegistry.getCachedSpritesheet(hillId).src)

  // Get all dirt spritesheets
  const dirtSources = dirtRegistry
    .getAllIds()
    .map((dirtId) => dirtRegistry.getCachedSpritesheet(dirtId).src)

  return [...terrainSources, ...groundSources, ...hillsSources, ...dirtSources]
}
