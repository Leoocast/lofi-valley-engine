import { createStore } from "zustand/vanilla"

import type { Tool } from "@/engine/store"

/**
 * Tools State
 * Tools are permanent and separate from inventory
 */
export interface ToolsState {
  // Available tools (permanent, cannot be deleted)
  availableTools: readonly Tool[]

  // Tool order in ToolHotbar (user can reorder)
  toolHotbarOrder: Tool[]
}

/**
 * Store vanilla de Zustand para herramientas
 * Las herramientas son permanentes y están separadas del inventario
 */
export const toolsStore = createStore<ToolsState>(() => ({
  availableTools: ["axe", "pickaxe", "hoe", "wateringCan", "scythe"] as const,
  toolHotbarOrder: ["axe", "pickaxe", "hoe", "wateringCan", "scythe"],
}))

/**
 * Acciones para manipular herramientas
 */
export const toolsActions = {
  /**
   * Reordenar herramientas en el ToolHotbar (drag & drop)
   */
  reorderTools: (fromIndex: number, toIndex: number) => {
    toolsStore.setState((state) => {
      const newOrder = [...state.toolHotbarOrder]
      const [movedTool] = newOrder.splice(fromIndex, 1)
      newOrder.splice(toIndex, 0, movedTool)
      return { toolHotbarOrder: newOrder }
    })
  },

  /**
   * Obtener herramienta en un slot específico
   */
  getToolAtSlot: (index: number): Tool | null => {
    const { toolHotbarOrder } = toolsStore.getState()
    return toolHotbarOrder[index] ?? null
  },

  /**
   * Resetear orden a default
   */
  resetToolOrder: () => {
    const { availableTools } = toolsStore.getState()
    toolsStore.setState({ toolHotbarOrder: [...availableTools] })
  },
}
