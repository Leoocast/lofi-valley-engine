import type { ReactElement } from "react"
import { useEffect, useState } from "react"

import type { Item } from "@/constants/items"
import { ItemType } from "@/constants/items"
import { TILE_SIZE } from "@/engine/rendering/config"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import { useInventory } from "@/hooks/useInventory"

interface SeedCursorGhostProps {
  activeItem: Item | null
}

/**
 * Ghost cursor that follows the mouse when a seed is selected
 */
export const SeedCursorGhost = ({
  activeItem,
}: SeedCursorGhostProps): ReactElement | null => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const slots = useInventory((s) => s.slots)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Only show for seeds that still exist in inventory
  if (!activeItem || activeItem.type !== ItemType.SEED) return null

  // Check if item still exists in inventory
  const itemExists = slots.some((slot) => slot?.id === activeItem.id)
  if (!itemExists) return null

  // Render the seed sprite
  const renderIcon = () => {
    const spriteStyle = getItemSpriteStyle(activeItem)
    if (!spriteStyle) return <span className="text-2xl">🌱</span>

    return (
      <div
        style={{
          ...spriteStyle,
          width: TILE_SIZE,
          height: TILE_SIZE,
        }}
      />
    )
  }

  return (
    <div
      style={{
        position: "fixed",
        left: mousePos.x + 16,
        top: mousePos.y + 16,
        pointerEvents: "none",
        zIndex: 99999,
        opacity: 0.8,
      }}
    >
      <div
        className="pointer-events-none"
        style={{
          transform: "scale(3)",
          transformOrigin: "center",
        }}
      >
        {renderIcon()}
      </div>
    </div>
  )
}
