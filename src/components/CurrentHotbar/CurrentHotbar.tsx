import type { ReactElement } from "react"

import { useHotbar } from "@/hooks/useHotbar"

import { CustomHotbar } from "../CustomHotbar/CustomHotbar"
import { HotbarSelector } from "../HotbarSelector/HotbarSelector"
import { MainHotbar } from "../MainHotbar/MainHotbar"

/**
 * CurrentHotbar - Wrapper que muestra la hotbar activa
 * Ahora solo Main, Custom1, Custom2
 */
export const CurrentHotbar = (): ReactElement => {
  const activeHotbar = useHotbar((s) => s.activeHotbar)

  return (
    <div className="fixed bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4">
      {/* Hotbar activa */}
      <div className="flex items-center gap-2">
        {activeHotbar === "main" && <MainHotbar />}
        {activeHotbar === "custom1" && <CustomHotbar hotbarType="custom1" />}
        {activeHotbar === "custom2" && <CustomHotbar hotbarType="custom2" />}
      </div>

      {/* Selector */}
      <HotbarSelector />
    </div>
  )
}
