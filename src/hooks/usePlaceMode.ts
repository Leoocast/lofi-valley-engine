import { useState } from "react"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { Entity } from "@/engine/interfaces/entity"
import type { Sprite } from "@/engine/interfaces/sprites"

import {
  CABIN_SPRITE,
  CRAFTABLE_SPRITE,
  GROUND_SPRITE,
} from "@/engine/interfaces/sprites"
import { getCollisionSize as getSheetCollisionSize } from "@/engine/rendering/sheetSpriteUtils"
import { getLogicalSize } from "@/engine/rendering/visualBoundsAndOffset"

interface UsePlaceModeProps {
  entities: Entity[]
  farmWidth: number
  farmHeight: number
}

interface UsePlaceModeReturn {
  selectedSprite: number
  setSelectedSprite: (sprite: number) => void
  selectedItemType: "cabin" | "craftable" | "ground"
  setSelectedItemType: (type: "cabin" | "craftable" | "ground") => void
  hoveredEntity: number | null
  setHoveredEntity: (entity: number | null) => void
  placingDef: Sprite
  canPlaceAt: (
    tx: number,
    ty: number,
    options?: { ignoreId?: number; sprite?: Sprite; entity?: Entity },
  ) => boolean
}

// Helper to get collision size for any entity
function getEntityCollisionSize(ent: Entity): { w: number; h: number } {
  const sheetSprite = (ent as Entity & { sheetSprite?: SheetSprite })
    .sheetSprite
  if (sheetSprite) {
    return getSheetCollisionSize(sheetSprite)
  }
  return getLogicalSize(ent.sprite)
}

export function usePlaceMode({
  entities,
  farmWidth,
  farmHeight,
}: UsePlaceModeProps): UsePlaceModeReturn {
  const [selectedSprite, setSelectedSprite] = useState(0)
  const [selectedItemType, setSelectedItemType] = useState<
    "cabin" | "craftable" | "ground"
  >("cabin")
  const [hoveredEntity, setHoveredEntity] = useState<number | null>(null)

  const placingDef =
    selectedItemType === "cabin"
      ? CABIN_SPRITE
      : selectedItemType === "craftable"
        ? CRAFTABLE_SPRITE
        : GROUND_SPRITE

  const canPlaceAt = (
    tx: number,
    ty: number,
    options?: { ignoreId?: number; sprite?: Sprite; entity?: Entity },
  ) => {
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
    } else {
      const sprite = options?.sprite ?? placingDef
      const size = getLogicalSize(sprite)
      w = size.w
      h = size.h
      movingOffsetX = 0
    }

    // Validar que la base completa esté dentro del grid (with offset)
    if (
      tx + movingOffsetX < 0 ||
      ty < 0 ||
      tx + movingOffsetX + w > farmWidth ||
      ty + h > farmHeight
    )
      return false

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

  return {
    canPlaceAt,
    hoveredEntity,
    placingDef,
    selectedItemType,
    selectedSprite,
    setHoveredEntity,
    setSelectedItemType,
    setSelectedSprite,
  }
}
