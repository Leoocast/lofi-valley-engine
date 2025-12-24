/**
 * useEntitySelection - Unified entity selection hook for IDLE mode
 *
 * Handles:
 * - Hover detection (mouseTile vs entity visual bounds)
 * - Click to select (shows popup)
 * - Click+drag to move (5px threshold)
 * - Inline delete
 */
import { useCallback, useRef, useState } from "react"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { Entity } from "@/engine/interfaces/entity"

import {
  getCollisionSize as getSheetCollisionSize,
  getVisualHoverBounds as getSheetVisualHoverBounds,
} from "@/engine/rendering/sheetSpriteUtils"
import {
  getLogicalSize,
  getVisualHoverBounds,
} from "@/engine/rendering/visualBoundsAndOffset"

const DRAG_THRESHOLD = 5 // pixels before drag starts

interface UseEntitySelectionProps {
  entities: Entity[]
  canPlaceAt: (
    tx: number,
    ty: number,
    options?: { ignoreId?: number; entity?: Entity },
  ) => boolean
  onMoveEntity: (entityIndex: number, newX: number, newY: number) => void
  onDeleteEntity: (entityIndex: number) => void
}

interface UseEntitySelectionReturn {
  // State for rendering
  hoveredEntityIndex: number | null
  selectedEntityIndex: number | null
  isDragging: boolean
  draggingEntityIndex: number | null // For ghost preview
  previewPosition: { x: number; y: number } | null
  canDropAtPreview: boolean

  // Handlers to call from farm_laboratory_view
  handleMouseMove: (
    mouseTile: { x: number; y: number },
    mousePixel: { x: number; y: number },
  ) => void
  handleMouseDown: (mousePixel: { x: number; y: number }) => void
  handleMouseUp: (mouseTile: { x: number; y: number }) => void
  handleDeleteSelected: () => void
  startDragFromSelection: () => void // For popup move button
}

// Helper: Get visual hover bounds for any entity (SheetSprite or old Sprite)
function getEntityVisualBounds(entity: Entity): {
  minX: number
  minY: number
  maxX: number
  maxY: number
} {
  const sheet = (entity as Entity & { sheetSprite?: SheetSprite }).sheetSprite
  if (sheet) {
    return getSheetVisualHoverBounds(entity.x, entity.y, sheet)
  }
  return getVisualHoverBounds(entity)
}

// Helper: Get collision size for any entity
function getEntityCollisionSize(entity: Entity): { w: number; h: number } {
  const sheet = (entity as Entity & { sheetSprite?: SheetSprite }).sheetSprite
  if (sheet) {
    return getSheetCollisionSize(sheet)
  }
  return getLogicalSize(entity.sprite)
}

export function useEntitySelection({
  entities,
  canPlaceAt,
  onMoveEntity,
  onDeleteEntity,
}: UseEntitySelectionProps): UseEntitySelectionReturn {
  // Visual state
  const [hoveredEntityIndex, setHoveredEntityIndex] = useState<number | null>(
    null,
  )
  const [selectedEntityIndex, setSelectedEntityIndex] = useState<number | null>(
    null,
  )
  const [isDragging, setIsDragging] = useState(false)
  const [previewPosition, setPreviewPosition] = useState<{
    x: number
    y: number
  } | null>(null)
  const [canDropAtPreview, setCanDropAtPreview] = useState(false)

  // Drag tracking ref (persists between renders without causing re-renders)
  const dragRef = useRef<{
    entityIndex: number
    startPixel: { x: number; y: number }
    dragOffset: { x: number; y: number }
    hasDragged: boolean
  } | null>(null)

  // Find entity under mouse (topmost by depth)
  const findEntityAtTile = useCallback(
    (tileX: number, tileY: number): number | null => {
      let foundIdx: number | null = null
      let foundDepth = -Infinity

      for (let i = 0; i < entities.length; i++) {
        const ent = entities[i]
        const bounds = getEntityVisualBounds(ent)

        if (
          tileX >= bounds.minX &&
          tileX <= bounds.maxX &&
          tileY >= bounds.minY &&
          tileY <= bounds.maxY
        ) {
          const size = getEntityCollisionSize(ent)
          const depth = ent.y + size.h
          if (depth > foundDepth) {
            foundDepth = depth
            foundIdx = i
          }
        }
      }
      return foundIdx
    },
    [entities],
  )

  // Mouse Move: Update hover and drag preview
  const handleMouseMove = useCallback(
    (
      mouseTile: { x: number; y: number },
      mousePixel: { x: number; y: number },
    ) => {
      const drag = dragRef.current as typeof dragRef.current & {
        needsOffsetCalc?: boolean
        entityOriginalPos?: { x: number; y: number }
      }

      // If dragging, update preview
      if (drag && drag.hasDragged) {
        // Check if we need to calculate offset (first move after popup drag start)
        if (drag.needsOffsetCalc && drag.entityOriginalPos) {
          // Calculate offset so entity stays at original position relative to mouse
          drag.dragOffset = {
            x: mouseTile.x - drag.entityOriginalPos.x,
            y: mouseTile.y - drag.entityOriginalPos.y,
          }
          drag.needsOffsetCalc = false // Clear flag
        }

        const previewX = mouseTile.x - drag.dragOffset.x
        const previewY = mouseTile.y - drag.dragOffset.y
        setPreviewPosition({ x: previewX, y: previewY })

        const entity = entities[drag.entityIndex]
        if (entity) {
          setCanDropAtPreview(
            canPlaceAt(previewX, previewY, {
              ignoreId: drag.entityIndex,
              entity,
            }),
          )
        }
        return
      }

      // If mouse is down but not yet dragging, check threshold
      if (drag && !drag.hasDragged) {
        const dx = mousePixel.x - drag.startPixel.x
        const dy = mousePixel.y - drag.startPixel.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance >= DRAG_THRESHOLD) {
          // Start dragging
          drag.hasDragged = true
          setIsDragging(true)
          setSelectedEntityIndex(null) // Close popup if open

          // Calculate offset
          const entity = entities[drag.entityIndex]
          if (entity) {
            drag.dragOffset = {
              x: mouseTile.x - entity.x,
              y: mouseTile.y - entity.y,
            }
          }
        }
        return
      }

      // Normal hover detection
      if (!isDragging) {
        const hovered = findEntityAtTile(mouseTile.x, mouseTile.y)
        setHoveredEntityIndex(hovered)
      }
    },
    [entities, canPlaceAt, findEntityAtTile, isDragging],
  )

  // Mouse Down: Start potential drag tracking
  const handleMouseDown = useCallback(
    (mousePixel: { x: number; y: number }) => {
      // Only track if hovering an entity
      if (hoveredEntityIndex !== null) {
        dragRef.current = {
          entityIndex: hoveredEntityIndex,
          startPixel: mousePixel,
          dragOffset: { x: 0, y: 0 },
          hasDragged: false,
        }
      } else {
        // Clicked empty space - deselect
        setSelectedEntityIndex(null)
      }
    },
    [hoveredEntityIndex],
  )

  // Mouse Up: Either drop entity or select it
  const handleMouseUp = useCallback(
    (mouseTile: { x: number; y: number }) => {
      const drag = dragRef.current
      dragRef.current = null

      if (!drag) return

      if (drag.hasDragged && isDragging) {
        // Finishing drag - try to drop
        const previewX = mouseTile.x - drag.dragOffset.x
        const previewY = mouseTile.y - drag.dragOffset.y
        const entity = entities[drag.entityIndex]

        if (
          entity &&
          canPlaceAt(previewX, previewY, { ignoreId: drag.entityIndex, entity })
        ) {
          onMoveEntity(drag.entityIndex, previewX, previewY)
        }

        setIsDragging(false)
        setPreviewPosition(null)
      } else {
        // Was a click (no drag) - select the entity
        setSelectedEntityIndex(drag.entityIndex)
      }
    },
    [isDragging, entities, canPlaceAt, onMoveEntity],
  )

  // Delete selected entity
  const handleDeleteSelected = useCallback(() => {
    if (selectedEntityIndex !== null) {
      onDeleteEntity(selectedEntityIndex)
      setSelectedEntityIndex(null)
    }
  }, [selectedEntityIndex, onDeleteEntity])

  // Start drag from popup Move button
  const startDragFromSelection = useCallback(() => {
    if (selectedEntityIndex !== null) {
      const entity = entities[selectedEntityIndex]
      if (entity) {
        // Set up drag state - mark that offset needs to be calculated on first mouse move
        // This prevents the sprite from jumping to the mouse position
        dragRef.current = {
          entityIndex: selectedEntityIndex,
          startPixel: { x: 0, y: 0 },
          dragOffset: { x: 0, y: 0 },
          hasDragged: true,
          needsOffsetCalc: true, // Flag to calculate offset on first move
          entityOriginalPos: { x: entity.x, y: entity.y }, // Store original position
        } as typeof dragRef.current & {
          needsOffsetCalc?: boolean
          entityOriginalPos?: { x: number; y: number }
        }
        setIsDragging(true)
        setSelectedEntityIndex(null) // Close popup
        setPreviewPosition({ x: entity.x, y: entity.y })
      }
    }
  }, [selectedEntityIndex, entities])

  // Get current dragging entity index from ref
  const draggingEntityIndex =
    isDragging && dragRef.current ? dragRef.current.entityIndex : null

  return {
    hoveredEntityIndex,
    selectedEntityIndex,
    isDragging,
    draggingEntityIndex,
    previewPosition,
    canDropAtPreview,
    handleMouseMove,
    handleMouseDown,
    handleMouseUp,
    handleDeleteSelected,
    startDragFromSelection,
  }
}
