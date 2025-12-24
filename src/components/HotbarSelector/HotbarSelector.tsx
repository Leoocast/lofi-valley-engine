import type { ReactElement } from "react"

import "./HotbarSelector.css"

import {
  type HotbarType,
  hotbarActions,
  hotbarStore,
} from "@/engine/hotbarStore"
import { useHotbar } from "@/hooks/useHotbar"

/**
 * HotbarSelector - Grid 2x2 with Main, C1, C2 and Decoration
 * Position: [Main, Deco]
 *           [C1, C2]
 */
export const HotbarSelector = (): ReactElement => {
  const activeHotbar = useHotbar((s) => s.activeHotbar)
  const decorationMenuOpen = useHotbar((s) => s.decorationMenuOpen)

  const handleHotbarClick = (hotbar: HotbarType) => {
    hotbarStore.setState({ activeHotbar: hotbar, activeSlotIndex: -1 })
  }

  const handleDecorationClick = () => {
    hotbarActions.toggleDecorationMenu()
  }

  return (
    <div className="hotbarSelector">
      <div className="hotbarSelector__grid">
        {/* Top row: Main, Deco */}
        <button
          type="button"
          onClick={() => handleHotbarClick("main")}
          className={`hotbarSelector__button ${activeHotbar === "main" ? "hotbarSelector__button--active" : ""}`}
          title="Main Hotbar"
        >
          <span className="hotbarSelector__emoji">🔧</span>
        </button>

        <button
          type="button"
          disabled
          onClick={() => {
            console.log("Not implemented yet")
          }}
          className={`hotbarSelector__button hotbarSelector__button--decoration ${decorationMenuOpen ? "hotbarSelector__button--active" : ""}`}
          title="Decoration Mode (D)"
        >
          <span className="hotbarSelector__emoji">🎨</span>
        </button>

        {/* Bottom row: C1, C2 */}
        <button
          type="button"
          onClick={() => handleHotbarClick("custom1")}
          className={`hotbarSelector__button ${activeHotbar === "custom1" ? "hotbarSelector__button--active" : ""}`}
          title="Custom Hotbar 1"
        >
          C1
        </button>

        <button
          type="button"
          onClick={() => handleHotbarClick("custom2")}
          className={`hotbarSelector__button ${activeHotbar === "custom2" ? "hotbarSelector__button--active" : ""}`}
          title="Custom Hotbar 2"
        >
          C2
        </button>
      </div>
    </div>
  )
}
