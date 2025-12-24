import { ITEM_DEFINITIONS } from "@/constants/items"
import { dropsStore } from "@/engine/dropsStore"
import { TILE_SIZE } from "@/engine/rendering/config"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import type { ReactElement } from "react"
import { useStore } from "zustand"
import "./DroppedItems.css"

/**
 * DroppedItems - Renders dropped items with animation
 * Subscribes ONLY to dropsStore → no performance issues
 */
export const DroppedItems = (): ReactElement => {
  const items = useStore(dropsStore, (state) => state.items)

  return (
    <>
      {items.map((drop) => {
        const startPixelX = drop.x * TILE_SIZE
        const startPixelY = drop.y * TILE_SIZE - 16

        const targetPixelX = drop.targetX * TILE_SIZE
        const targetPixelY = drop.targetY * TILE_SIZE

        const offsetX = targetPixelX - startPixelX
        const offsetY = targetPixelY - startPixelY

        // Get item definition and sprite style
        const itemDef = ITEM_DEFINITIONS[drop.itemId]
        const spriteStyle = itemDef ? getItemSpriteStyle(itemDef) : null

        return (
          <div
            key={drop.id}
            className="droppedItem"
            style={{
              left: startPixelX,
              top: startPixelY,
              zIndex: 10000,
              ["--offset-x" as string]: `${offsetX}px`,
              ["--offset-y" as string]: `${offsetY}px`,
            }}
          >
            {spriteStyle ? (
              <div className="droppedItem__sprite" style={spriteStyle} />
            ) : (
              <span style={{ fontSize: "12px" }}>{itemDef?.emoji || "📦"}</span>
            )}
          </div>
        )
      })}
    </>
  )
}
