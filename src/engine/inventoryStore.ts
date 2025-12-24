import { createStore } from "zustand/vanilla"

import type { Item } from "@/constants/items"
import { ITEM_DEFINITIONS } from "@/constants/items"
import { CROPS_DATA } from "@/engine/data/cropsData"

/**
 * Item en el inventario (ID-based, no slot-based)
 */
export interface InventoryItem {
  id: string
  quantity: number
}

/**
 * Estado del inventario (sin tools, solo items)
 * 30 slots (6 rows x 5 columns)
 */
export interface InventoryState {
  slots: (InventoryItem | null)[]
  itemsMap: Map<string, InventoryItem>
  isInventoryOpen: boolean
}

/**
 * Crear items iniciales - 4 semillas de cada crop
 */
const createInitialSlots = (): (InventoryItem | null)[] => {
  const items: (InventoryItem | null)[] = []

  // Add 4 seeds of each crop
  for (const crop of CROPS_DATA.crops) {
    items.push({ id: crop.items.seedId, quantity: 9 })
  }

  // Fill remaining slots with null to reach 30
  while (items.length < 30) {
    items.push(null)
  }

  return items
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
 * Store vanilla de Zustand para el inventario
 * Sin herramientas (están en toolsStore)
 */
const initialSlots = createInitialSlots()
export const inventoryStore = createStore<InventoryState>(() => ({
  slots: initialSlots,
  itemsMap: buildItemsMap(initialSlots),
  isInventoryOpen: false,
}))

/**
 * Acciones para manipular el inventario
 */
export const inventoryActions = {
  /**
   * Agregar/stackear item
   */
  addItem: (itemId: string, quantity: number) => {
    inventoryStore.setState((state) => {
      const existingItem = state.itemsMap.get(itemId)

      if (existingItem) {
        // Stack con item existente - actualizar el slot
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId
            ? { ...slot, quantity: slot.quantity + quantity }
            : slot,
        )
        return {
          slots: newSlots,
          itemsMap: buildItemsMap(newSlots),
        }
      } else {
        // Nuevo item - buscar primer slot vacío
        const newSlots = [...state.slots]
        const emptyIndex = newSlots.findIndex((slot) => slot === null)

        if (emptyIndex !== -1) {
          newSlots[emptyIndex] = { id: itemId, quantity }
        }

        return {
          slots: newSlots,
          itemsMap: buildItemsMap(newSlots),
        }
      }
    })
  },

  /**
   * Remover/consumir item
   */
  removeItem: (itemId: string, quantity: number) => {
    inventoryStore.setState((state) => {
      const existingItem = state.itemsMap.get(itemId)

      if (!existingItem) return state

      const newQuantity = existingItem.quantity - quantity

      if (newQuantity <= 0) {
        // Eliminar item completamente - dejar slot como null
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId ? null : slot,
        )

        return {
          slots: newSlots,
          itemsMap: buildItemsMap(newSlots),
        }
      } else {
        // Reducir cantidad
        const newSlots = state.slots.map((slot) =>
          slot && slot.id === itemId
            ? { ...slot, quantity: newQuantity }
            : slot,
        )
        return {
          slots: newSlots,
          itemsMap: buildItemsMap(newSlots),
        }
      }
    })
  },

  /**
   * Swap items at two positions (drag & drop en inventario)
   * Works with a fixed 24-slot array, swapping items or moving to empty slots
   */
  moveItem: (fromIndex: number, toIndex: number) => {
    inventoryStore.setState((state) => {
      const newSlots = [...state.slots]

      // Simple swap
      const temp = newSlots[fromIndex]
      newSlots[fromIndex] = newSlots[toIndex]
      newSlots[toIndex] = temp

      return {
        slots: newSlots,
        itemsMap: buildItemsMap(newSlots),
      }
    })
  },

  /**
   * Obtener item por ID (O(1))
   */
  getItem: (itemId: string): InventoryItem | undefined => {
    return inventoryStore.getState().itemsMap.get(itemId)
  },

  /**
   * Obtener definición de item
   */
  getItemDefinition: (itemId: string): Item | undefined => {
    return ITEM_DEFINITIONS[itemId]
  },

  /**
   * Verificar si hay suficiente cantidad
   */
  hasItem: (itemId: string, quantity: number): boolean => {
    const item = inventoryStore.getState().itemsMap.get(itemId)
    return item ? item.quantity >= quantity : false
  },

  /**
   * Toggle del panel de inventario
   */
  toggleInventory: () => {
    inventoryStore.setState((s) => ({ isInventoryOpen: !s.isInventoryOpen }))
  },

  /**
   * Abrir panel de inventario
   */
  openInventory: () => {
    inventoryStore.setState({ isInventoryOpen: true })
  },

  /**
   * Cerrar panel de inventario
   */
  closeInventory: () => {
    inventoryStore.setState({ isInventoryOpen: false })
  },
}

/**
 * Selectores
 */
export const getAllItems = (state: InventoryState): (InventoryItem | null)[] =>
  state.slots
export const getItemsMap = (
  state: InventoryState,
): Map<string, InventoryItem> => state.itemsMap
export const getIsInventoryOpen = (state: InventoryState): boolean =>
  state.isInventoryOpen
