/**
 * Viewport Culling Utilities
 *
 * Pure functions to calculate which tiles/entities are visible in the viewport.
 * This is part of the Engine layer - no React dependencies.
 */

import { TILE_SIZE } from "./config"

/**
 * Represents the visible tile bounds in the viewport
 */
export interface ViewportBounds {
  /** Minimum visible tile X (inclusive) */
  minTileX: number
  /** Maximum visible tile X (inclusive) */
  maxTileX: number
  /** Minimum visible tile Y (inclusive) */
  minTileY: number
  /** Maximum visible tile Y (inclusive) */
  maxTileY: number
}

/**
 * Calculate which tiles are visible in the viewport.
 *
 * @param viewportWidth - Width of the viewport in pixels
 * @param viewportHeight - Height of the viewport in pixels
 * @param offsetX - Current X offset (pan position)
 * @param offsetY - Current Y offset (pan position)
 * @param zoom - Current zoom level
 * @param farmWidth - Total farm width in tiles
 * @param farmHeight - Total farm height in tiles
 * @param margin - Extra tiles to include beyond visible area (default: 2)
 * @returns ViewportBounds with min/max tile coordinates
 */
export function getVisibleBounds(
  viewportWidth: number,
  viewportHeight: number,
  offsetX: number,
  offsetY: number,
  zoom: number,
  farmWidth: number,
  farmHeight: number,
  margin: number = 2,
): ViewportBounds {
  // Convert viewport coordinates to world coordinates
  // The world is rendered at: translate(offsetX, offsetY) scale(zoom)
  // So world position = (viewport position - offset) / zoom

  // Top-left corner of viewport in world coordinates
  const worldLeft = -offsetX / zoom
  const worldTop = -offsetY / zoom

  // Bottom-right corner of viewport in world coordinates
  const worldRight = (viewportWidth - offsetX) / zoom
  const worldBottom = (viewportHeight - offsetY) / zoom

  // Convert to tile coordinates (floor for min, ceil for max)
  const minTileX = Math.floor(worldLeft / TILE_SIZE) - margin
  const minTileY = Math.floor(worldTop / TILE_SIZE) - margin
  const maxTileX = Math.ceil(worldRight / TILE_SIZE) + margin
  const maxTileY = Math.ceil(worldBottom / TILE_SIZE) + margin

  // Clamp to farm bounds
  return {
    minTileX: Math.max(0, minTileX),
    maxTileX: Math.min(farmWidth - 1, maxTileX),
    minTileY: Math.max(0, minTileY),
    maxTileY: Math.min(farmHeight - 1, maxTileY),
  }
}

/**
 * Check if a tile position is within the visible bounds
 */
export function isTileVisible(
  x: number,
  y: number,
  bounds: ViewportBounds,
): boolean {
  return (
    x >= bounds.minTileX &&
    x <= bounds.maxTileX &&
    y >= bounds.minTileY &&
    y <= bounds.maxTileY
  )
}

/**
 * Check if an entity is within the visible bounds.
 * Takes into account entity size for proper culling of multi-tile entities.
 *
 * @param entityX - Entity X position in tiles
 * @param entityY - Entity Y position in tiles
 * @param entityWidth - Entity width in tiles (default: 1)
 * @param entityHeight - Entity height in tiles (default: 1)
 * @param bounds - Current viewport bounds
 */
export function isEntityVisible(
  entityX: number,
  entityY: number,
  entityWidth: number,
  entityHeight: number,
  bounds: ViewportBounds,
): boolean {
  // Entity is visible if any part of it overlaps with the viewport
  // Entity occupies from (entityX, entityY) to (entityX + width - 1, entityY + height - 1)
  const entityRight = entityX + entityWidth - 1
  const entityBottom = entityY + entityHeight - 1

  // Check for overlap (not completely outside)
  return (
    entityRight >= bounds.minTileX &&
    entityX <= bounds.maxTileX &&
    entityBottom >= bounds.minTileY &&
    entityY <= bounds.maxTileY
  )
}
