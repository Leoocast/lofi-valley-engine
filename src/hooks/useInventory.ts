import { useStore } from "zustand"

import type { InventoryState } from "@/engine/inventoryStore"

import { inventoryStore } from "@/engine/inventoryStore"

/**
 * Hook de React para acceder al inventario
 * Wrapper simple de Zustand - NO contiene lógica de negocio
 */
export function useInventory<T>(selector: (state: InventoryState) => T): T {
  return useStore(inventoryStore, selector)
}
