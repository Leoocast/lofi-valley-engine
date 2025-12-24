import type { ReactElement } from "react"

import "./DecorationMenu.css"

import { type DecorationMode, hotbarActions } from "@/engine/hotbarStore"
import { useHotbar } from "@/hooks/useHotbar"

interface DecorationOption {
  mode: DecorationMode
  emoji: string
  name: string
}

const DECORATION_OPTIONS: DecorationOption[] = [
  { mode: "cursor", emoji: "🖱️", name: "Cursor" },
  { mode: "move", emoji: "↔️", name: "Move" },
  { mode: "delete", emoji: "🗑️", name: "Delete" },
  { mode: "recycle", emoji: "♻️", name: "Recycle" },
]

/**
 * DecorationMenu - 2x2 grid popup above selector
 */
export const DecorationMenu = (): ReactElement | null => {
  const isOpen = useHotbar((s) => s.decorationMenuOpen)
  const selectedMode = useHotbar((s) => s.selectedDecorationMode)

  if (!isOpen) return null

  const handleSelectMode = (mode: DecorationMode) => {
    hotbarActions.setDecorationMode(mode)
  }

  return (
    <div className="decorationMenu">
      <div className="decorationMenu__container">
        <div className="decorationMenu__grid">
          {DECORATION_OPTIONS.map((option) => (
            <button
              key={option.mode}
              type="button"
              onClick={() => handleSelectMode(option.mode)}
              className={`decorationMenu__button ${selectedMode === option.mode ? "decorationMenu__button--active" : ""}`}
              title={option.name}
            >
              <span className="decorationMenu__emoji">{option.emoji}</span>
              <span className="decorationMenu__label">{option.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
