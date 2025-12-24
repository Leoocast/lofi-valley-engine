import { createStore } from "zustand/vanilla"

/**
 * DroppedItem - Temporary item entity from harvesting
 */
export interface DroppedItem {
  id: string
  itemId: string // Item ID - used for both inventory and sprite rendering
  x: number
  y: number
  targetX: number
  targetY: number
  spawnedAt: number
}

/**
 * DropsState - Isolated store for dropped items
 */
interface DropsState {
  items: DroppedItem[]
}

const PICKUP_DELAY_MS = 350

export const dropsStore = createStore<DropsState>(() => ({
  items: [],
}))

/**
 * Actions for drop store
 */
export const dropsActions = {
  /**
   * Spawn a dropped item
   */
  spawnDrop(itemId: string, x: number, y: number): void {
    const angle = Math.random() * Math.PI * 2
    const distance = 0.3 + Math.random() * 0.4
    const targetX = x + Math.cos(angle) * distance
    const targetY = y + Math.sin(angle) * distance

    const drop: DroppedItem = {
      id: crypto.randomUUID(),
      itemId,
      x,
      y,
      targetX,
      targetY,
      spawnedAt: Date.now(),
    }

    dropsStore.setState((state) => ({
      items: [...state.items, drop],
    }))
  },

  /**
   * Remove a dropped item (after pickup)
   */
  removeDrop(id: string): void {
    dropsStore.setState((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },

  /**
   * Tick function - removes drops after animation completes
   */
  tick(): void {
    const now = Date.now()
    const state = dropsStore.getState()
    const itemsToRemove: string[] = []

    for (const drop of state.items) {
      const age = now - drop.spawnedAt
      if (age >= PICKUP_DELAY_MS) {
        itemsToRemove.push(drop.id)
      }
    }

    if (itemsToRemove.length > 0) {
      dropsStore.setState((state) => ({
        items: state.items.filter((item) => !itemsToRemove.includes(item.id)),
      }))
    }
  },
}
