import type { ReactElement } from "react"

import "./MainHotbar.css"

import { ITEM_DEFINITIONS } from "@/constants/items"
import { TOOLS } from "@/constants/tools"
import { hotbarActions } from "@/engine/hotbarStore"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import { useHotbar } from "@/hooks/useHotbar"
import { useItemQuantity } from "@/hooks/useItemQuantity"

import { HotbarSlot } from "../HotbarSlot/HotbarSlot"

/**
 * MainHotbar - 10 slots customizables con backdrop mejorado
 */
export const MainHotbar = (): ReactElement => {
  const mainHotbar = useHotbar((s) => s.mainHotbar)
  const activeSlotIndex = useHotbar((s) => s.activeSlotIndex)
  const activeHotbar = useHotbar((s) => s.activeHotbar)
  const mouseDrag = useHotbar((s) => s.mouseDrag)

  const isActiveHotbar = activeHotbar === "main"

  const handleSlotClick = (index: number) => {
    hotbarActions.selectSlot(index)
  }

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    const slot = mainHotbar[index]
    if (slot && slot.itemId) {
      const tool = TOOLS.find((t) => t.id === slot.itemId)
      hotbarActions.startMouseDrag({
        source: "main",
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
          "main",
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
        "main",
        index,
      )
      hotbarActions.markDropHandled()
      hotbarActions.endMouseDrag()
    }
  }

  const q0 = useItemQuantity(mainHotbar[0]?.itemId)
  const q1 = useItemQuantity(mainHotbar[1]?.itemId)
  const q2 = useItemQuantity(mainHotbar[2]?.itemId)
  const q3 = useItemQuantity(mainHotbar[3]?.itemId)
  const q4 = useItemQuantity(mainHotbar[4]?.itemId)
  const q5 = useItemQuantity(mainHotbar[5]?.itemId)
  const q6 = useItemQuantity(mainHotbar[6]?.itemId)
  const q7 = useItemQuantity(mainHotbar[7]?.itemId)
  const q8 = useItemQuantity(mainHotbar[8]?.itemId)
  const q9 = useItemQuantity(mainHotbar[9]?.itemId)

  const quantities = [q0, q1, q2, q3, q4, q5, q6, q7, q8, q9]

  const renderSlotContent = (slotIndex: number) => {
    const slot = mainHotbar[slotIndex]
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
    const slot = mainHotbar[index]
    if (!slot || !slot.itemId) return undefined

    const tool = TOOLS.find((t) => t.id === slot.itemId)
    if (tool) return tool.name

    const itemDef = ITEM_DEFINITIONS[slot.itemId]
    return itemDef?.name
  }

  return (
    <div className="mainHotbar">
      <div className="mainHotbar__slots">
        {mainHotbar.map((_, index) => (
          <HotbarSlot
            key={index}
            isActive={isActiveHotbar && activeSlotIndex === index}
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
