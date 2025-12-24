/**
 * Collision Detection Utility for Entity Placement
 *
 * Provides canPlaceAt function for checking if an entity can be placed
 * at a given grid position without colliding with existing entities.
 */

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { Entity } from "@/engine/interfaces/entity"
import type { Sprite } from "@/engine/interfaces/sprites"

import { getCollisionSize as getSheetCollisionSize } from "@/engine/rendering/sheetSpriteUtils"
import { getLogicalSize } from "@/engine/rendering/visualBoundsAndOffset"

// Helper to get collision size for any entity
function getEntityCollisionSize(ent: Entity): { w: number; h: number } {
  const sheetSprite = (ent as Entity & { sheetSprite?: SheetSprite })
    .sheetSprite
  if (sheetSprite) {
    return getSheetCollisionSize(sheetSprite)
  }
  return getLogicalSize(ent.sprite)
}

export interface CanPlaceAtOptions {
  ignoreId?: number
  sprite?: Sprite
  entity?: Entity
}

/**
 * Creates a collision checker function for entity placement
 */
export function createCanPlaceAt(
  entities: Entity[],
  farmWidth: number,
  farmHeight: number,
) {
  return (tx: number, ty: number, options?: CanPlaceAtOptions): boolean => {
    // Check if the entity being placed has sheetSprite
    let w: number, h: number, movingOffsetX: number
    const movingEntity = options?.entity
    const movingSheet = movingEntity
      ? (movingEntity as Entity & { sheetSprite?: SheetSprite }).sheetSprite
      : undefined

    if (movingSheet) {
      const size = getSheetCollisionSize(movingSheet)
      w = size.w
      h = size.h
      movingOffsetX = movingSheet.collision?.offsetX ?? 0
    } else if (options?.sprite) {
      const size = getLogicalSize(options.sprite)
      w = size.w
      h = size.h
      movingOffsetX = 0
    } else {
      // Default to 1x1 if no sprite info
      w = 1
      h = 1
      movingOffsetX = 0
    }

    // Validate the entire base is within the grid (with offset)
    if (
      tx + movingOffsetX < 0 ||
      ty < 0 ||
      tx + movingOffsetX + w > farmWidth ||
      ty + h > farmHeight
    ) {
      return false
    }

    for (let yy = 0; yy < h; yy++) {
      for (let xx = 0; xx < w; xx++) {
        const gx = tx + movingOffsetX + xx
        const gy = ty + yy

        for (let i = 0; i < entities.length; i++) {
          if (options?.ignoreId != null && i === options.ignoreId) continue

          const ent = entities[i]
          // Use SheetSprite-aware collision size
          const esize = getEntityCollisionSize(ent)
          const entSheet = (ent as Entity & { sheetSprite?: SheetSprite })
            .sheetSprite
          const entOffsetX = entSheet?.collision?.offsetX ?? 0

          for (let ey = 0; ey < esize.h; ey++) {
            for (let ex = 0; ex < esize.w; ex++) {
              if (gx === ent.x + entOffsetX + ex && gy === ent.y + ey) {
                return false
              }
            }
          }
        }
      }
    }

    return true
  }
}
