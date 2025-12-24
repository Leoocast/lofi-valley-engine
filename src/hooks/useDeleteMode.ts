import { useState } from "react"

import type { Entity } from "@/engine/interfaces/entity"

import {
  getLogicalSize,
  getVisualHoverBounds,
} from "@/engine/rendering/visualBoundsAndOffset"

interface UseDeleteModeProps {
  entities: Entity[]
}

interface UseDeleteModeReturn {
  hoveredEntityDelete: number | null
  setHoveredEntityDelete: (id: number | null) => void
  handleDelete: (
    mouseTile: { x: number; y: number },
    onDeleteEntity: (id: number) => void,
  ) => void
}

/**
 * @deprecated This hook is part of the old mode-based system.
 * Will be replaced with useEntitySelection for a unified selection UX.
 */
export function useDeleteMode({
  entities,
}: UseDeleteModeProps): UseDeleteModeReturn {
  const [hoveredEntityDelete, setHoveredEntityDelete] = useState<number | null>(
    null,
  )

  const handleDelete = (
    mouseTile: { x: number; y: number },
    onDeleteEntity: (id: number) => void,
  ) => {
    // Buscar la entidad bajo el mouse que esté más visible (última renderizada = más adelante)
    let selectedIdx: number | null = null
    let selectedEnt: Entity | null = null

    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i]
      const b = getVisualHoverBounds(ent)

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
          const selectedSize = getLogicalSize(selectedEnt.sprite)
          const currentSize = getLogicalSize(ent.sprite)
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

    if (selectedIdx !== null) {
      // Borrar la entidad más visible
      onDeleteEntity(selectedIdx)
      setHoveredEntityDelete(null)
    }
  }

  return {
    handleDelete,
    hoveredEntityDelete,
    setHoveredEntityDelete,
  }
}
