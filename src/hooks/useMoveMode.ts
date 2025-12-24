import { useState } from "react"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { Entity } from "@/engine/interfaces/entity"
import type { Sprite } from "@/engine/interfaces/sprites"

import {
  getCollisionSize as getSheetCollisionSize,
  getVisualHoverBounds as getSheetVisualHoverBounds,
} from "@/engine/rendering/sheetSpriteUtils"
import {
  getLogicalSize,
  getVisualHoverBounds,
} from "@/engine/rendering/visualBoundsAndOffset"

interface UseMoveModeProps {
  entities: Entity[]
}

/**
 * @deprecated This hook is part of the old mode-based system.
 * Will be replaced with useEntitySelection for a unified selection UX.
 */

interface UseMoveModeReturn {
  movingId: number | null
  setMovingId: (id: number | null) => void
  hoveredEntityMove: number | null
  setHoveredEntityMove: (id: number | null) => void
  dragOffset: { x: number; y: number }
  setDragOffset: (offset: { x: number; y: number }) => void
  handleMoveStart: (mouseTile: { x: number; y: number }) => void
  handleMoveEnd: (
    mouseTile: { x: number; y: number },
    canPlaceAt: (
      tx: number,
      ty: number,
      options?: { ignoreId?: number; sprite?: Sprite; entity?: Entity },
    ) => boolean,
    onMoveEntity: (id: number, x: number, y: number) => void,
  ) => void
}

// Helper to get collision size for any entity
function getEntityCollisionSize(ent: Entity): { w: number; h: number } {
  const sheetSprite = (ent as Entity & { sheetSprite?: SheetSprite })
    .sheetSprite
  return sheetSprite
    ? getSheetCollisionSize(sheetSprite)
    : getLogicalSize(ent.sprite)
}

// Helper to get visual hover bounds for any entity
function getEntityVisualHoverBounds(ent: Entity): {
  minX: number
  maxX: number
  minY: number
  maxY: number
} {
  const sheetSprite = (ent as Entity & { sheetSprite?: SheetSprite })
    .sheetSprite
  return sheetSprite
    ? getSheetVisualHoverBounds(ent.x, ent.y, sheetSprite)
    : getVisualHoverBounds(ent)
}

export function useMoveMode({ entities }: UseMoveModeProps): UseMoveModeReturn {
  const [movingId, setMovingId] = useState<number | null>(null)
  const [hoveredEntityMove, setHoveredEntityMove] = useState<number | null>(
    null,
  )
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })

  const handleMoveStart = (mouseTile: { x: number; y: number }) => {
    if (movingId !== null) return

    // Buscar la entidad bajo el mouse que esté más visible (última renderizada = más adelante)
    let selectedIdx: number | null = null
    let selectedEnt: Entity | null = null

    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i]
      const b = getEntityVisualHoverBounds(ent)

      if (
        mouseTile.x >= b.minX &&
        mouseTile.x <= b.maxX &&
        mouseTile.y >= b.minY &&
        mouseTile.y <= b.maxY
      ) {
        // Si aún no tenemos selección, o esta entidad está más profunda, actualizar
        if (selectedIdx === null) {
          selectedIdx = i
          selectedEnt = ent
        } else if (selectedEnt) {
          const selectedSize = getEntityCollisionSize(selectedEnt)
          const currentSize = getEntityCollisionSize(ent)
          const selectedDepth = selectedEnt.y + selectedSize.h
          const currentDepth = ent.y + currentSize.h

          // Si la entidad actual está más adelante (mayor profundidad)
          if (currentDepth > selectedDepth) {
            selectedIdx = i
            selectedEnt = ent
          }
          // Si tienen la misma profundidad, la más reciente (mayor índice) está adelante
          else if (currentDepth === selectedDepth && i > selectedIdx) {
            selectedIdx = i
            selectedEnt = ent
          }
        }
      }
    }

    if (selectedIdx !== null && selectedEnt) {
      const i = selectedIdx
      const ent = selectedEnt
      setMovingId(i)
      // Calculate offset from entity origin to where user clicked
      // No clamping - allows grabbing from anywhere on the visual sprite
      const offsetX = mouseTile.x - ent.x
      const offsetY = mouseTile.y - ent.y
      setDragOffset({
        x: offsetX,
        y: offsetY,
      })
    }
  }

  const handleMoveEnd = (
    mouseTile: { x: number; y: number },
    canPlaceAt: (
      tx: number,
      ty: number,
      options?: { ignoreId?: number; sprite?: Sprite; entity?: Entity },
    ) => boolean,
    onMoveEntity: (id: number, x: number, y: number) => void,
  ) => {
    if (movingId === null) return

    const current = entities[movingId]
    const targetX = mouseTile.x - dragOffset.x
    const targetY = mouseTile.y - dragOffset.y
    const can = canPlaceAt(targetX, targetY, {
      ignoreId: movingId,
      sprite: current.sprite,
      entity: current,
    })

    if (!can) {
      // no se puede: cancelar solo el move actual
      setMovingId(null)
      return
    }

    // commit del movimiento
    onMoveEntity(movingId, targetX, targetY)
    setMovingId(null)
    setDragOffset({ x: 0, y: 0 })
  }

  return {
    dragOffset,
    handleMoveEnd,
    handleMoveStart,
    hoveredEntityMove,
    movingId,
    setDragOffset,
    setHoveredEntityMove,
    setMovingId,
  }
}
