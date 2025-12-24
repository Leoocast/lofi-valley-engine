import type { ReactElement } from "react"

import "./CustomHotbar.css"

import { ITEM_DEFINITIONS } from "@/constants/items"
import { TOOLS } from "@/constants/tools"
import { hotbarActions } from "@/engine/hotbarStore"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import { useHotbar } from "@/hooks/useHotbar"
import { useItemQuantity } from "@/hooks/useItemQuantity"

import { HotbarSlot } from "../HotbarSlot/HotbarSlot"

interface CustomHotbarProps {
  hotbarType: "custom1" | "custom2"
}

/**
 * CustomHotbar - Similar styling to MainHotbar
 */
export const CustomHotbar = ({
  hotbarType,
}: CustomHotbarProps): ReactElement => {
  const customSlots = useHotbar((s) =>
    hotbarType === "custom1" ? s.customHotbar1 : s.customHotbar2,
  )
  const activeIndex = useHotbar((s) => s.activeSlotIndex)
  const activeHotbar = useHotbar((s) => s.activeHotbar)
  const mouseDrag = useHotbar((s) => s.mouseDrag)

  const isThisHotbarActive = activeHotbar === hotbarType

  const handleSlotClick = (index: number) => {
    hotbarActions.selectSlot(index)
  }

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    const slot = customSlots[index]
    if (slot && slot.itemId) {
      const tool = TOOLS.find((t) => t.id === slot.itemId)
      hotbarActions.startMouseDrag({
        source: hotbarType,
        sourceIndex: index,
        itemId: tool ? undefined : slot.itemId,
        toolId: tool?.id,
        mouseX: e.clientX,
        mouseY: e.clientY,
      })
    }
  }

  const handleMouseUp = (index: number) => {
    if (!mouseDrag || !mouseDrag.isDragging) {
      hotbarActions.endMouseDrag()
      return
    }

    if (mouseDrag.source === "inventory") {
      if (mouseDrag.itemId || mouseDrag.toolId) {
        hotbarActions.transferFromInventory(
          mouseDrag.sourceIndex,
          hotbarType,
          index,
          mouseDrag.itemId,
          mouseDrag.toolId,
        )
        hotbarActions.markDropHandled()
        hotbarActions.endMouseDrag()
      }
    } else if (
      mouseDrag.source === "main" ||
      mouseDrag.source === "custom1" ||
      mouseDrag.source === "custom2"
    ) {
      hotbarActions.swapHotbarSlots(
        mouseDrag.source,
        mouseDrag.sourceIndex,
        hotbarType,
        index,
      )
      hotbarActions.markDropHandled()
      hotbarActions.endMouseDrag()
    }
  }

  const q0 = useItemQuantity(customSlots[0]?.itemId)
  const q1 = useItemQuantity(customSlots[1]?.itemId)
  const q2 = useItemQuantity(customSlots[2]?.itemId)
  const q3 = useItemQuantity(customSlots[3]?.itemId)
  const q4 = useItemQuantity(customSlots[4]?.itemId)
  const q5 = useItemQuantity(customSlots[5]?.itemId)
  const q6 = useItemQuantity(customSlots[6]?.itemId)
  const q7 = useItemQuantity(customSlots[7]?.itemId)
  const q8 = useItemQuantity(customSlots[8]?.itemId)
  const q9 = useItemQuantity(customSlots[9]?.itemId)

  const quantities = [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9]

  const renderSlotContent = (slotIndex: number) => {
    const slot = customSlots[slotIndex]
    if (!slot || !slot.itemId) return null

    const tool = TOOLS.find((t) => t.id === slot.itemId)
    if (tool) {
      return <span className="text-2xl leading-none">{tool.emoji}</span>
    }

    const itemDef = ITEM_DEFINITIONS[slot.itemId]
    if (!itemDef) return null

    // Try crop sprite
    const spriteStyle = getItemSpriteStyle(itemDef)
    if (spriteStyle) {
      return (
        <div
          className="pointer-events-none"
          style={{
            ...spriteStyle,
            transform: "scale(3)",
            transformOrigin: "center",
          }}
        />
      )
    }

    return <span className="text-2xl leading-none">{itemDef.emoji}</span>
  }

  const shortcuts = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"] as const

  const getTooltip = (index: number): string | undefined => {
    const slot = customSlots[index]
    if (!slot || !slot.itemId) return undefined

    const tool = TOOLS.find((t) => t.id === slot.itemId)
    if (tool) return tool.name

    const itemDef = ITEM_DEFINITIONS[slot.itemId]
    return itemDef?.name
  }

  return (
    <div className="customHotbar">
      <div className="customHotbar__slots">
        {customSlots.map((_, index) => (
          <HotbarSlot
            key={index}
            isActive={isThisHotbarActive && activeIndex === index}
            emoji={null}
            shortcut={shortcuts[index]}
            onClick={() => handleSlotClick(index)}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseUp={() => handleMouseUp(index)}
            quantity={quantities[index]}
            tooltip={getTooltip(index)}
          >
            {renderSlotContent(index)}
          </HotbarSlot>
        ))}
      </div>
    </div>
  )
}
