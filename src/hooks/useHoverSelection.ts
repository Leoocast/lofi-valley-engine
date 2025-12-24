import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { Entity } from "@/engine/interfaces/entity"
import type { EditorMode } from "@/views/laboratory/farm/farm_config"

import {
  getCollisionSize as getSheetCollisionSize,
  getVisualHoverBounds as getSheetVisualHoverBounds,
} from "@/engine/rendering/sheetSpriteUtils"
import {
  getLogicalSize,
  getVisualHoverBounds,
} from "@/engine/rendering/visualBoundsAndOffset"

interface UseHoverSelectionProps {
  entities: Entity[]
  mode: EditorMode
  tileX: number
  tileY: number
  setHoveredEntity: (idx: number | null) => void
  setHoveredEntityMove: (idx: number | null) => void
  setHoveredEntityDelete: (idx: number | null) => void
}

/**
 * @deprecated This hook is part of the old mode-based system.
 * Will be replaced with useEntitySelection for a unified selection UX.
 */
export function useHoverSelection() {
  function updateHoverSelection({
    entities,
    mode,
    tileX,
    tileY,
    setHoveredEntity,
    setHoveredEntityMove,
    setHoveredEntityDelete,
  }: UseHoverSelectionProps) {
    if (
      (mode !== "place" && mode !== "move" && mode !== "delete") ||
      tileX < 0 ||
      tileY < 0
    ) {
      setHoveredEntity(null)
      setHoveredEntityMove(null)
      setHoveredEntityDelete(null)
      return
    }

    let found: number | null = null
    let foundEnt: Entity | null = null

    for (let i = 0; i < entities.length; i++) {
      const eEntity = entities[i]

      // Check for SheetSprite
      const sheetSprite = (eEntity as Entity & { sheetSprite?: SheetSprite })
        .sheetSprite
      const b = sheetSprite
        ? getSheetVisualHoverBounds(eEntity.x, eEntity.y, sheetSprite)
        : getVisualHoverBounds(eEntity)

      if (
        tileX >= b.minX &&
        tileX <= b.maxX &&
        tileY >= b.minY &&
        tileY <= b.maxY
      ) {
        if (found === null) {
          found = i
          foundEnt = eEntity
        } else if (foundEnt) {
          // Check for SheetSprite on both entities
          const foundSheet = (
            foundEnt as Entity & { sheetSprite?: SheetSprite }
          ).sheetSprite
          const currentSheet = sheetSprite

          const foundSize = foundSheet
            ? getSheetCollisionSize(foundSheet)
            : getLogicalSize(foundEnt.sprite)
          const currentSize = currentSheet
            ? getSheetCollisionSize(currentSheet)
            : getLogicalSize(eEntity.sprite)
          const foundDepth = foundEnt.y + foundSize.h
          const currentDepth = eEntity.y + currentSize.h

          if (currentDepth > foundDepth) {
            found = i
            foundEnt = eEntity
          } else if (currentDepth === foundDepth && i > found) {
            found = i
            foundEnt = eEntity
          }
        }
      }
    }

    if (mode === "place") {
      setHoveredEntity(found)
    } else if (mode === "move") {
      setHoveredEntityMove(found)
    } else if (mode === "delete") {
      setHoveredEntityDelete(found)
    }
  }

  return { updateHoverSelection }
}
