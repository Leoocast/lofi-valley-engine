/**
 * Inventory Store Factory
 *
 * Creates inventory store instances with shared logic.
 * Allows creating separate inventories for different contexts (game, crops, etc.)
 */

import { createStore, type StoreApi } from "zustand/vanilla"

import type { Item } from "@/constants/items"
import { ITEM_DEFINITIONS } from "@/constants/items"

/**
 * Item en el inventario
 */
export interface InventoryItem {
  id: string
  quantity: number
}

/**
 * Estado del inventario
 */
export interface InventoryState {
  slots: (InventoryItem | null)[]
  itemsMap: Map<string, InventoryItem>
  isInventoryOpen: boolean
}

/**
 * Construir Map de items para lookup O(1)
 */
export const buildItemsMap = (
  slots: (InventoryItem | null)[],
): Map<string, InventoryItem> => {
  const map = new Map<string, InventoryItem>()
  for (const item of slots) {
    if (item) {
      map.set(item.id, item)
    }
  }
  return map
}

/**
 * Crear slots vacíos
 */
export const createEmptySlots = (count = 30): (InventoryItem | null)[] => {
  return Array(count).fill(null)
}

/**
 * Factory para crear un inventory store
 */
export const createInventoryStore = (
  initialSlots: (InventoryItem | null)[] = createEmptySlots(),
): StoreApi<InventoryState> => {
  return createStore<InventoryState>(() => ({
    slots: initialSlots,
    itemsMap: buildItemsMap(initialSlots),
    isInventoryOpen: false,
  }))
}

/**
 * Factory para crear acciones del inventario dado un store
 */
export const createInventoryActions = (store: StoreApi<InventoryState>) => ({
  addItem: (itemId: string, quantity: number) => {
    store.setState((state) => {
      const existingItem = state.itemsMap.get(itemId)
      if (existingItem) {
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId
            ? { ...slot, quantity: slot.quantity + quantity }
            : slot,
        )
        return { slots: newSlots, itemsMap: buildItemsMap(newSlots) }
      } else {
        const newSlots = [...state.slots]
        const emptyIndex = newSlots.findIndex((slot) => slot === null)
        if (emptyIndex !== -1) {
          newSlots[emptyIndex] = { id: itemId, quantity }
        }
        return { slots: newSlots, itemsMap: buildItemsMap(newSlots) }
      }
    })
  },

  removeItem: (itemId: string, quantity: number) => {
    store.setState((state) => {
      const existingItem = state.itemsMap.get(itemId)
      if (!existingItem) return state

      const newQuantity = existingItem.quantity - quantity
      if (newQuantity <= 0) {
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId ? null : slot,
        )
        return { slots: newSlots, itemsMap: buildItemsMap(newSlots) }
      } else {
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId
            ? { ...slot, quantity: newQuantity }
            : slot,
        )
        return { slots: newSlots, itemsMap: buildItemsMap(newSlots) }
      }
    })
  },

  moveItem: (fromIndex: number, toIndex: number) => {
    store.setState((state) => {
      const newSlots = [...state.slots]
      const temp = newSlots[fromIndex]
      newSlots[fromIndex] = newSlots[toIndex]
      newSlots[toIndex] = temp
      return { slots: newSlots, itemsMap: buildItemsMap(newSlots) }
    })
  },

  getItem: (itemId: string): InventoryItem | undefined => {
    return store.getState().itemsMap.get(itemId)
  },

  getItemDefinition: (itemId: string): Item | undefined => {
    return ITEM_DEFINITIONS[itemId]
  },

  hasItem: (itemId: string, quantity: number): boolean => {
    const item = store.getState().itemsMap.get(itemId)
    return item ? item.quantity >= quantity : false
  },

  toggleInventory: () => {
    store.setState((s) => ({ isInventoryOpen: !s.isInventoryOpen }))
  },

  openInventory: () => {
    store.setState({ isInventoryOpen: true })
  },

  closeInventory: () => {
    store.setState({ isInventoryOpen: false })
  },
})
