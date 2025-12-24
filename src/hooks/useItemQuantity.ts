import { useCallback } from "react"

import { useInventory } from "./useInventory"

/**
 * Optimized hook to get item quantity with memoized selector
 * Avoids re-renders when other items in inventory change
 */
export const useItemQuantity = (itemId: string | null | undefined) => {
  return useInventory(
    useCallback(
      (state) => {
        if (!itemId) return undefined
        const item = state.slots.find((slot) => slot?.id === itemId)
        return item?.quantity
      },
      [itemId],
    ),
  )
}
