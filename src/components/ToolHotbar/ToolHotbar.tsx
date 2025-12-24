import type { FC } from "react"

import { HotbarSlot } from "@/components/HotbarSlot/HotbarSlot"
import { hotbarActions } from "@/engine/hotbarStore"
import { useHotbar } from "@/hooks/useHotbar"
import { useTools } from "@/hooks/useTools"

/**
 * ToolHotbar - Herramientas permanentes
 * Solo muestra slots ocupados (5 herramientas)
 */
export const ToolHotbar: FC = () => {
  const toolOrder = useTools((s) => s.toolHotbarOrder)
  const activeIndex = useHotbar((s) => s.activeSlotIndex)
  const activeHotbar = useHotbar((s) => s.activeHotbar)

  const isThisHotbarActive = activeHotbar === "tool"

  return (
    <div className="flex gap-2 rounded-xl border border-white/20 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md">
      {toolOrder.map((toolId, index) => (
        <HotbarSlot
          key={index}
          slotIndex={index}
          content={{ type: "tool", toolId }}
          isActive={isThisHotbarActive && activeIndex === index}
          shortcut={index + 1}
          source="tool"
          onSelect={() => hotbarActions.selectSlot(index)}
        />
      ))}
    </div>
  )
}
