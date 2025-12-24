import type { ReactElement } from "react"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import "./Inventory.css"

import { Tooltip } from "@/components/Tooltip/Tooltip"
import { ITEM_DEFINITIONS } from "@/constants/items"
import { TOOLS } from "@/constants/tools"
import { hotbarActions } from "@/engine/hotbarStore"
import { inventoryActions } from "@/engine/inventoryStore"
import { getItemSpriteStyle } from "@/engine/rendering/cropRenderer"
import { toolsActions } from "@/engine/toolsStore"
import { useHotbar } from "@/hooks/useHotbar"
import { useInventory } from "@/hooks/useInventory"
import { useTools } from "@/hooks/useTools"

/**
 * Inventory - Drag & drop manual (mouse events + zustand)
 */
export const Inventory = (): ReactElement => {
  const { t } = useTranslation("crops")
  const isOpen = useInventory((s) => s.isInventoryOpen)
  const slots = useInventory((s) => s.slots)
  const toolOrder = useTools((s) => s.toolHotbarOrder)
  const mouseDrag = useHotbar((s) => s.mouseDrag)

  const [activeTab, setActiveTab] = useState<"items" | "tools">("items")
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const dragStateRef = useRef({
    isWindowDragging: false,
    startX: 0,
    startY: 0,
    windowStartX: 0,
    windowStartY: 0,
  })

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const dragState = dragStateRef.current

      if (dragState.isWindowDragging) {
        const dx = e.clientX - dragState.startX
        const dy = e.clientY - dragState.startY
        setPosition({
          x: dragState.windowStartX + dx,
          y: dragState.windowStartY + dy,
        })
      }

      if (mouseDrag) {
        hotbarActions.updateMouseDrag(e.clientX, e.clientY)
      }
    }

    const handleGlobalMouseUp = () => {
      dragStateRef.current.isWindowDragging = false
    }

    window.addEventListener("mousemove", handleGlobalMouseMove)
    window.addEventListener("mouseup", handleGlobalMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove)
      window.removeEventListener("mouseup", handleGlobalMouseUp)
    }
  }, [mouseDrag])

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLButtonElement) return
    e.preventDefault()

    dragStateRef.current = {
      isWindowDragging: true,
      startX: e.clientX,
      startY: e.clientY,
      windowStartX: position.x,
      windowStartY: position.y,
    }
  }

  const handleMouseDown = (
    e: React.MouseEvent,
    type: "tool" | "item",
    id: string,
    index: number,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    hotbarActions.startMouseDrag({
      source: "inventory",
      sourceIndex: index,
      ...(type === "tool" ? { toolId: id as any } : { itemId: id }),
      mouseX: e.clientX,
      mouseY: e.clientY,
    })
  }

  const handleDropOnSlot = (type: "tool" | "item", toIndex: number) => {
    if (!mouseDrag) return

    if (mouseDrag.source === "inventory") {
      if (mouseDrag.toolId && type === "tool") {
        toolsActions.reorderTools(mouseDrag.sourceIndex, toIndex)
      } else if (mouseDrag.itemId && type === "item") {
        inventoryActions.moveItem(mouseDrag.sourceIndex, toIndex)
      }
      hotbarActions.markDropHandled()
      hotbarActions.endMouseDrag()
    } else if (
      mouseDrag.source === "main" ||
      mouseDrag.source === "custom1" ||
      mouseDrag.source === "custom2"
    ) {
      if (mouseDrag.itemId && type === "item") {
        hotbarActions.transferToInventory(
          mouseDrag.source,
          mouseDrag.sourceIndex,
          toIndex,
        )
        hotbarActions.markDropHandled()
        hotbarActions.endMouseDrag()
      }
    }
  }

  const renderToolSlot = (toolId: string, index: number) => {
    const tool = TOOLS.find((t) => t.id === toolId)
    const isDragging =
      mouseDrag?.source === "inventory" &&
      mouseDrag.sourceIndex === index &&
      mouseDrag.toolId === toolId

    return (
      <Tooltip key={toolId} content={tool?.name}>
        <div
          onMouseDown={(e) => handleMouseDown(e, "tool", toolId, index)}
          onMouseUp={() => handleDropOnSlot("tool", index)}
          className={`inventory__slot ${isDragging ? "opacity-30" : ""}`}
        >
          <div className="pointer-events-none text-2xl">
            {tool?.emoji || "🔧"}
          </div>
          <div className="inventory__toolBadge">{tool?.name || "TOOL"}</div>
        </div>
      </Tooltip>
    )
  }

  const renderItemSlot = (
    item: { id: string; quantity: number } | null,
    index: number,
  ) => {
    const isDragging =
      mouseDrag?.source === "inventory" &&
      mouseDrag.sourceIndex === index &&
      mouseDrag.itemId === item?.id

    if (!item) {
      return (
        <div
          key={index}
          onMouseUp={() => handleDropOnSlot("item", index)}
          className="inventory__slot inventory__slot--empty"
        />
      )
    }

    const itemDef = ITEM_DEFINITIONS[item.id]
    if (!itemDef) return null

    const renderIcon = () => {
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
      return <span className="text-2xl">{itemDef.emoji}</span>
    }

    return (
      <Tooltip key={`${item.id}-${index}`} content={itemDef.name}>
        <div
          onMouseDown={(e) => handleMouseDown(e, "item", item.id, index)}
          onMouseUp={() => handleDropOnSlot("item", index)}
          className={`inventory__slot ${isDragging ? "opacity-30" : ""}`}
        >
          {renderIcon()}
          {item.quantity >= 1 && (
            <div className="inventory__slotBadge">{item.quantity}</div>
          )}
          <div className="inventory__toolBadge">{itemDef.name}</div>
        </div>
      </Tooltip>
    )
  }

  if (!isOpen) return <></>

  return (
    <>
      <div
        className="inventory"
        style={{
          top: `calc(50% + ${position.y}px)`,
          left: `calc(50% + ${position.x}px)`,
        }}
      >
        <div className="inventory__header" onMouseDown={handleHeaderMouseDown}>
          <h2 className="inventory__title">{t("inventory.title")}</h2>
          <button
            type="button"
            onClick={inventoryActions.toggleInventory}
            className="inventory__closeButton"
          >
            ✕
          </button>
        </div>

        <div className="inventory__tabs">
          <button
            onClick={() => setActiveTab("items")}
            className={`inventory__tab ${activeTab === "items" ? "inventory__tab--active" : ""}`}
          >
            {t("inventory.items")}
          </button>
          <button
            onClick={() => setActiveTab("tools")}
            className={`inventory__tab ${activeTab === "tools" ? "inventory__tab--active" : ""}`}
          >
            {t("inventory.tools")}
          </button>
        </div>

        <div className="space-y-6">
          {activeTab === "tools" && (
            <div className="inventory__content">
              <div className="inventory__grid">
                {toolOrder.map((toolId, index) =>
                  renderToolSlot(toolId, index),
                )}
              </div>
            </div>
          )}

          {activeTab === "items" && (
            <div className="inventory__content">
              <div className="inventory__grid">
                {Array.from({ length: 30 }, (_, i) => {
                  const item = slots[i] || null
                  return renderItemSlot(item, i)
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
