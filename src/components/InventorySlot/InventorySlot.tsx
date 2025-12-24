import type { FC } from "react"

import type { Item } from "@/constants/items"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"

interface InventorySlotProps {
  item: Item | null
  quantity: number
  isActive?: boolean
  shortcut?: string | number
  onClick?: () => void
}

/**
 * Componente de slot individual
 * Solo renderiza - no contiene lógica de negocio
 */
export const InventorySlot: FC<InventorySlotProps> = ({
  item,
  quantity,
  isActive = false,
  shortcut,
  onClick,
}) => {
  const renderItemIcon = () => {
    if (!item) return null

    // Try crop sprite first
    const spriteStyle = getItemSpriteStyle(item)
    if (spriteStyle) {
      return (
        <div
          style={{
            ...spriteStyle,
            transform: "scale(1.5)",
            transformOrigin: "center",
          }}
        />
      )
    }

    // Fallback to emoji
    return <span className="text-3xl leading-none">{item.emoji}</span>
  }

  return (
    <div
      onClick={onClick}
      className={`
        relative flex h-14 w-14 cursor-pointer items-center justify-center
        rounded-lg border-2 transition-all
        ${
          isActive
            ? "bg-white/20 ring-2 ring-white/50"
            : "border-white/20 hover:bg-white/10"
        }
        ${!item && "border-dashed"}
      `}
    >
      {renderItemIcon()}

      {item && quantity > 1 && (
        <div className="absolute -right-1 -top-1 rounded bg-white px-1 text-xs font-bold text-black">
          {quantity}
        </div>
      )}

      {shortcut !== undefined && (
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded bg-white/20 px-1 text-xs text-white">
          {shortcut}
        </div>
      )}
    </div>
  )
}
