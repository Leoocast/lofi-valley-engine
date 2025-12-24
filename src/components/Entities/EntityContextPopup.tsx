/**
 * EntityContextPopup - Compact icons for Move/Delete
 * Two small icons positioned to the right of the selected entity
 */
import React from "react"

import { TILE_SIZE } from "@/engine/rendering/config"

interface EntityContextPopupProps {
  entityX: number
  entityY: number
  entityWidth: number
  entityHeight: number
  onStartDrag: () => void
  onDelete: () => void
}

export const EntityContextPopup: React.FC<EntityContextPopupProps> = ({
  entityX,
  entityY,
  entityWidth,
  onStartDrag,
  onDelete,
}) => {
  // Position: just to the right of entity, vertically centered
  const popupLeft = (entityX + entityWidth) * TILE_SIZE + 4
  const popupTop = entityY * TILE_SIZE + 4

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "row",
        gap: "2px",
        zIndex: 99999,
        left: popupLeft,
        top: popupTop,
      }}
      onMouseDown={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
    >
      {/* Move button */}
      <div
        style={{
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "move",
          borderRadius: "3px",
          backgroundColor: "rgba(60, 120, 255, 0.9)",
          color: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onMouseDown={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onStartDrag()
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(80, 150, 255, 1)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(60, 120, 255, 0.9)"
        }}
        title="Mover (arrastrar)"
      >
        ✥
      </div>

      {/* Delete button */}
      <div
        style={{
          width: "16px",
          height: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "12px",
          fontWeight: "bold",
          cursor: "pointer",
          borderRadius: "3px",
          backgroundColor: "rgba(255, 80, 80, 0.9)",
          color: "white",
          boxShadow: "0 1px 3px rgba(0,0,0,0.5)",
          border: "1px solid rgba(255,255,255,0.3)",
        }}
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        onMouseEnter={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(255, 60, 60, 1)"
        }}
        onMouseLeave={(e) => {
          ;(e.currentTarget as HTMLElement).style.backgroundColor =
            "rgba(255, 80, 80, 0.9)"
        }}
        title="Eliminar"
      >
        X
      </div>
    </div>
  )
}
