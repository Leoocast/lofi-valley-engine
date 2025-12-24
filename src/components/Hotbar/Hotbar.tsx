import type { ReactElement } from "react"

import { InventorySlot } from "@/components/InventorySlot/InventorySlot"
import {
  HOTBAR1_END,
  HOTBAR1_START,
  HOTBAR2_END,
  HOTBAR2_START,
} from "@/constants/items"
import { getAllSlots, inventoryActions } from "@/engine/inventoryStore"
import { useInventory } from "@/hooks/useInventory"

/**
 * Hotbar 1 - Herramientas (shortcuts 1-5)
 * Solo renderiza - lógica en inventoryStore
 */
export const Hotbar1 = (): ReactElement => {
  // Selector estable: todo el array
  const allSlots = useInventory(getAllSlots)
  const activeIndex = useInventory((s) => s.activeSlotIndex)

  // Slice local (no causa re-renders)
  const hotbar1Slots = allSlots.slice(HOTBAR1_START, HOTBAR1_END + 1)

  return (
    <div
      className="fixed bottom-30 left-1/2 -translate-x-1/2 z-20"
      style={{ willChange: "transform" }}
    >
      <div className="flex gap-2 rounded-xl border border-white/20 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md">
        {hotbar1Slots.map((slot, index) => {
          const globalIndex = HOTBAR1_START + index
          return (
            <InventorySlot
              key={globalIndex}
              item={slot.item}
              quantity={slot.quantity}
              isActive={activeIndex === globalIndex}
              shortcut={index + 1}
              onClick={() => inventoryActions.setActiveSlot(globalIndex)}
            />
          )
        })}
      </div>
    </div>
  )
}

/**
 * Hotbar 2 - Items (shortcuts 6-0 + 5 sin shortcut)
 * Solo renderiza - lógica en inventoryStore
 */
export const Hotbar2 = (): ReactElement => {
  // Selector estable: todo el array
  const allSlots = useInventory(getAllSlots)
  const activeIndex = useInventory((s) => s.activeSlotIndex)

  // Slice local (no causa re-renders)
  const hotbar2Slots = allSlots.slice(HOTBAR2_START, HOTBAR2_END + 1)

  const SHORTCUTS = ["6", "7", "8", "9", "0"]

  return (
    <div
      className="fixed bottom-6 left-1/2 z-10 -translate-x-1/2"
      style={{ willChange: "transform" }}
    >
      <div className="flex gap-2 rounded-xl border border-white/20 bg-black/80 px-4 py-3 shadow-2xl backdrop-blur-md">
        {/* Primeros 5 con shortcuts (slots 5-9) */}
        {hotbar2Slots.slice(0, 5).map((slot, index) => {
          const globalIndex = HOTBAR2_START + index
          return (
            <InventorySlot
              key={globalIndex}
              item={slot.item}
              quantity={slot.quantity}
              isActive={activeIndex === globalIndex}
              shortcut={SHORTCUTS[index]}
              onClick={() => inventoryActions.setActiveSlot(globalIndex)}
            />
          )
        })}

        {/* Separador visual */}
        <div className="mx-1 w-px bg-white/20" />

        {/* Últimos 5 sin shortcuts (slots 10-14) */}
        {hotbar2Slots.slice(5, 10).map((slot, index) => {
          const globalIndex = HOTBAR2_START + 5 + index
          return (
            <InventorySlot
              key={globalIndex}
              item={slot.item}
              quantity={slot.quantity}
              isActive={activeIndex === globalIndex}
              onClick={() => inventoryActions.setActiveSlot(globalIndex)}
            />
          )
        })}
      </div>
    </div>
  )
}
