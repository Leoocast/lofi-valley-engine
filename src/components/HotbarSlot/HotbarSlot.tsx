import type { ReactElement, ReactNode } from "react"

import { Tooltip } from "@/components/Tooltip/Tooltip"
import "./HotbarSlot.css"

interface HotbarSlotProps {
  isActive: boolean
  emoji: string | null
  shortcut?: string
  onClick?: () => void
  onMouseDown?: (e: React.MouseEvent) => void
  onMouseUp?: () => void
  quantity?: number
  children?: ReactNode
  tooltip?: string
}

/**
 * HotbarSlot - Slot individual simplificado
 * Acepta children para renderizar contenido custom
 */
export const HotbarSlot = ({
  isActive,
  emoji,
  shortcut,
  onClick,
  onMouseDown,
  onMouseUp,
  quantity,
  children,
  tooltip,
}: HotbarSlotProps): ReactElement => {
  return (
    <Tooltip content={tooltip}>
      <button
        type="button"
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        className={`hotbarSlot ${isActive ? "hotbarSlot--active" : ""}`}
      >
        {/* Content */}
        {children ||
          (emoji && <span className="text-2xl leading-none">{emoji}</span>)}

        {/* Quantity badge */}
        {quantity !== undefined && quantity > 0 && (
          <div className="hotbarSlot__quantityBadge">{quantity}</div>
        )}

        {/* Shortcut badge */}
        {shortcut && (
          <div className="hotbarSlot__shortcutBadge">{shortcut}</div>
        )}
      </button>
    </Tooltip>
  )
}
