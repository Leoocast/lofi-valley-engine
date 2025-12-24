import { useStore } from "zustand"

import type { ToolsState } from "@/engine/toolsStore"

import { toolsStore } from "@/engine/toolsStore"

/**
 * Hook de React para acceder al toolsStore
 */
export function useTools<T>(selector: (state: ToolsState) => T): T {
  return useStore(toolsStore, selector)
}
