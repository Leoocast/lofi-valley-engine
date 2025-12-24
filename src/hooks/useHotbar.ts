import { useStore } from "zustand"

import type { HotbarState } from "@/engine/hotbarStore"

import { hotbarStore } from "@/engine/hotbarStore"

/**
 * Hook de React para acceder al hotbarStore
 */
export function useHotbar<T>(selector: (state: HotbarState) => T): T {
  return useStore(hotbarStore, selector)
}
