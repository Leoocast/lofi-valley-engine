/**
 * sheetSpriteUtils.ts - Utility functions for SheetSprite format
 *
 * Replaces the old getLogicalSize/getVisualOffset functions from visualBoundsAndOffset.ts
 * for entities using the new SheetSprite format.
 */

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"

import { TILE_SIZE } from "./config"

/**
 * Get collision footprint size (equivalent to old getLogicalSize)
 * Returns the base/footprint dimensions for collision detection.
 */
export function getCollisionSize(sprite: SheetSprite): {
  w: number
  h: number
} {
  return {
    w: sprite.collision?.width ?? 1,
    h: sprite.collision?.height ?? 1,
  }
}

/**
 * Get visual dimensions of the sprite
 * Returns the full sprite size from the region.
 */
export function getVisualSize(sprite: SheetSprite): { w: number; h: number } {
  return {
    w: sprite.region.width,
    h: sprite.region.height,
  }
}

/**
 * Get visual offset for rendering (sprite extends upward from base)
 * Calculates how much to offset the sprite so its collision base
 * aligns with the grid position.
 */
export function getVisualOffset(sprite: SheetSprite): { x: number; y: number } {
  const collisionH = sprite.collision?.height ?? sprite.region.height
  const visualH = sprite.region.height
  const extraTiles = visualH - collisionH
  return {
    x: 0,
    y: -extraTiles * TILE_SIZE,
  }
}

/**
 * Get collision offset within the sprite visual bounds
 * For sprites where the collision box isn't at the left edge.
 */
export function getCollisionOffset(sprite: SheetSprite): {
  x: number
  y: number
} {
  return {
    x: sprite.collision?.offsetX ?? 0,
    y: 0,
  }
}

/**
 * Get base position considering collision offset
 * For entities where the footprint isn't at sprite origin.
 */
export function getBasePosition(
  entityX: number,
  entityY: number,
  sprite: SheetSprite,
): { x: number; y: number } {
  const offset = getCollisionOffset(sprite)
  return {
    x: entityX + offset.x,
    y: entityY + offset.y,
  }
}

/**
 * Get visual hover bounds for click/hover detection
 * Returns the full clickable area based on visual dimensions.
 */
export function getVisualHoverBounds(
  entityX: number,
  entityY: number,
  sprite: SheetSprite,
): { minX: number; minY: number; maxX: number; maxY: number } {
  const visualOffset = getVisualOffset(sprite)
  const visualSize = getVisualSize(sprite)

  const minX = entityX + Math.floor(visualOffset.x / TILE_SIZE)
  const minY = entityY + Math.floor(visualOffset.y / TILE_SIZE)
  const maxX = minX + visualSize.w - 1
  const maxY = minY + visualSize.h - 1

  return { minX, minY, maxX, maxY }
}

/**
 * Check if a point is within sprite's hitboxes or visual bounds
 */
export function isPointInHitbox(
  entityX: number,
  entityY: number,
  sprite: SheetSprite,
  pointTile: { x: number; y: number },
): boolean {
  // Custom hitboxes
  if (sprite.hitboxes && sprite.hitboxes.length > 0) {
    const visualOffset = getVisualOffset(sprite)
    const visualBaseX = entityX + Math.floor(visualOffset.x / TILE_SIZE)
    const visualBaseY = entityY + Math.floor(visualOffset.y / TILE_SIZE)

    return sprite.hitboxes.some((box) => {
      const boxMinX = visualBaseX + box.x
      const boxMaxX = visualBaseX + box.x + box.w - 1
      const boxMinY = visualBaseY + box.y
      const boxMaxY = visualBaseY + box.y + box.h - 1

      return (
        pointTile.x >= boxMinX &&
        pointTile.x <= boxMaxX &&
        pointTile.y >= boxMinY &&
        pointTile.y <= boxMaxY
      )
    })
  }

  // Fallback to visual bounds
  const bounds = getVisualHoverBounds(entityX, entityY, sprite)
  return (
    pointTile.x >= bounds.minX &&
    pointTile.x <= bounds.maxX &&
    pointTile.y >= bounds.minY &&
    pointTile.y <= bounds.maxY
  )
}
