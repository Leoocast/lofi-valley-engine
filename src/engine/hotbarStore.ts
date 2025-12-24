import { createStore } from "zustand/vanilla"

import type { Tool } from "@/engine/store"

/**
 * Tipos de hotbars disponibles (removido "decoration")
 */
export type HotbarType = "main" | "custom1" | "custom2"

/**
 * Modos de decoración (ahora para popup menu)
 */
export type DecorationMode = "cursor" | "move" | "delete" | "recycle"

/**
 * Slot de CustomHotbar (referencia a item por ID)
 * Ahora MainHotbar también usa esto
 */
export interface CustomSlot {
  itemId: string | null // null = slot vacío, puede ser tool ID o item ID
}

/**
 * Estado del sistema de hotbars
 */
export interface HotbarState {
  // Hotbar actualmente visible
  activeHotbar: HotbarType

  // Slot seleccionado en la hotbar activa (0-indexed)
  activeSlotIndex: number

  // Configuración de hotbars (todas customizables ahora)
  mainHotbar: CustomSlot[] // 10 slots (5 tools por defecto + 5 vacíos)
  customHotbar1: CustomSlot[] // 10 slots
  customHotbar2: CustomSlot[] // 10 slots

  // Decoration menu (popup)
  decorationMenuOpen: boolean
  selectedDecorationMode: DecorationMode | null

  // Mouse drag state (for manual drag system)
  mouseDrag: {
    active: boolean
    isDragging: boolean // true only after threshold exceeded
    dropHandled: boolean // true if drop was handled by a valid target
    dragStartPosition: { x: number; y: number } // initial mouse position
    source: HotbarType | "inventory"
    sourceIndex: number
    itemId?: string
    toolId?: Tool
    mouseX: number
    mouseY: number
  } | null
}

const DRAG_THRESHOLD = 5 // pixels

/**
 * Crear slots vacíos para hotbars
 */
const createEmptyCustomSlots = (): CustomSlot[] => {
  return Array.from({ length: 10 }, () => ({ itemId: null }))
}

/**
 * Store de hotbars
 */
export const hotbarStore = createStore<HotbarState>(() => ({
  activeHotbar: "main",
  activeSlotIndex: 0,

  // Inicializar hotbars
  mainHotbar: createEmptyCustomSlots(), // Se poblará con tools desde toolsStore
  customHotbar1: createEmptyCustomSlots(),
  customHotbar2: createEmptyCustomSlots(),

  // Decoration menu
  decorationMenuOpen: false,
  selectedDecorationMode: null,

  mouseDrag: null,
}))

/**
 * Acciones del sistema de hotbars
 */
export const hotbarActions = {
  /**
   * Ciclar a la siguiente hotbar (tecla Q)
   * Main → Custom1 → Custom2 → Main
   */
  cycleHotbar: () => {
    const { activeHotbar } = hotbarStore.getState()

    const cycle: Record<HotbarType, HotbarType> = {
      main: "custom1",
      custom1: "custom2",
      custom2: "main",
    }

    const nextHotbar = cycle[activeHotbar]

    // Cambiar hotbar, deseleccionar slot
    hotbarStore.setState({
      activeHotbar: nextHotbar,
      activeSlotIndex: -1,
    })
  },

  /**
   * Seleccionar un slot (y aplicar su comportamiento)
   */
  selectSlot: (index: number) => {
    hotbarStore.setState({ activeSlotIndex: index })
    // El sync con worldStore se hace en farm_view a través de useEffect
  },

  /**
   * Toggle decoration menu
   */
  toggleDecorationMenu: () => {
    hotbarStore.setState((state) => ({
      decorationMenuOpen: !state.decorationMenuOpen,
    }))
  },

  /**
   * Set decoration mode (from menu)
   */
  setDecorationMode: (mode: DecorationMode | null) => {
    hotbarStore.setState({
      selectedDecorationMode: mode,
      decorationMenuOpen: false, // Cerrar menú al seleccionar
    })
  },

  /**
   * Initialize MainHotbar with tools from toolsStore
   * (se llama cuando toolsStore está listo)
   */
  initializeMainHotbar: (toolOrder: Tool[]) => {
    hotbarStore.setState((state) => {
      const newMainHotbar = [...state.mainHotbar]
      // Poblar primeros 5 slots con tools
      toolOrder.forEach((toolId, index) => {
        if (index < 5) {
          newMainHotbar[index] = { itemId: toolId }
        }
      })
      return { mainHotbar: newMainHotbar }
    })
  },

  /**
   * Obtener slot activo actual
   */
  getActiveSlot: (): {
    type: "main" | "custom1" | "custom2"
    itemId: string | null
  } | null => {
    const { activeHotbar, activeSlotIndex } = hotbarStore.getState()

    const hotbarKey =
      activeHotbar === "main"
        ? "mainHotbar"
        : activeHotbar === "custom1"
          ? "customHotbar1"
          : "customHotbar2"

    const slot = hotbarStore.getState()[hotbarKey][activeSlotIndex]
    return slot ? { type: activeHotbar, itemId: slot.itemId } : null
  },

  /**
   * Transfer/Swap item from inventory to hotbar
   * Hotbar only stores REFERENCES (itemId) - items stay in inventory
   */
  transferFromInventory: (
    inventoryIndex: number,
    hotbarType: HotbarType,
    hotbarIndex: number,
    draggedItemId?: string,
    draggedToolId?: Tool,
  ) => {
    hotbarStore.setState((state) => {
      const hotbarKey =
        hotbarType === "main"
          ? "mainHotbar"
          : hotbarType === "custom1"
            ? "customHotbar1"
            : "customHotbar2"

      // Determine what's being dragged (item or tool)
      const draggedId = draggedItemId || draggedToolId || null

      // Update hotbar with dragged item/tool REFERENCE
      const newHotbar = [...state[hotbarKey]]
      newHotbar[hotbarIndex] = { itemId: draggedId }

      // DON'T touch inventory - items stay there!
      // Hotbar only stores references

      return { [hotbarKey]: newHotbar }
    })
  },

  /**
   * Clear hotbar slot (items remain in inventory)
   */
  transferToInventory: (
    hotbarType: HotbarType,
    hotbarIndex: number,
    inventoryIndex: number,
  ) => {
    hotbarStore.setState((state) => {
      const hotbarKey =
        hotbarType === "main"
          ? "mainHotbar"
          : hotbarType === "custom1"
            ? "customHotbar1"
            : "customHotbar2"

      // Simply clear the hotbar slot - item stays in inventory
      const newHotbar = [...state[hotbarKey]]
      newHotbar[hotbarIndex] = { itemId: null }

      return { [hotbarKey]: newHotbar }
    })
  },

  /**
   * Mouse-based drag system (para inventory y hotbars)
   */
  startMouseDrag: (data: {
    source: HotbarType | "inventory"
    sourceIndex: number
    itemId?: string
    toolId?: Tool
    mouseX: number
    mouseY: number
  }) => {
    hotbarStore.setState({
      mouseDrag: {
        active: true,
        isDragging: false,
        dropHandled: false,
        dragStartPosition: { x: data.mouseX, y: data.mouseY },
        ...data,
      },
    })
  },

  updateMouseDrag: (mouseX: number, mouseY: number) => {
    const { mouseDrag } = hotbarStore.getState()
    if (!mouseDrag) return

    // Check if drag threshold exceeded
    const dx = mouseX - mouseDrag.dragStartPosition.x
    const dy = mouseY - mouseDrag.dragStartPosition.y
    const distance = Math.sqrt(dx * dx + dy * dy)

    const isDragging = distance > DRAG_THRESHOLD

    hotbarStore.setState({
      mouseDrag: { ...mouseDrag, mouseX, mouseY, isDragging },
    })
  },

  /**
   * Clear an item from all hotbar slots when it runs out in inventory
   */
  clearItemFromAllHotbars: (itemId: string) => {
    hotbarStore.setState((state) => {
      const clearFromHotbar = (hotbar: CustomSlot[]) =>
        hotbar.map((slot) => (slot.itemId === itemId ? { itemId: null } : slot))

      return {
        mainHotbar: clearFromHotbar(state.mainHotbar),
        customHotbar1: clearFromHotbar(state.customHotbar1),
        customHotbar2: clearFromHotbar(state.customHotbar2),
      }
    })
  },

  /**
   * Swap two slots within or between hotbars
   */
  swapHotbarSlots: (
    fromHotbar: HotbarType,
    fromIndex: number,
    toHotbar: HotbarType,
    toIndex: number,
  ) => {
    hotbarStore.setState((state) => {
      const fromKey =
        fromHotbar === "main"
          ? "mainHotbar"
          : fromHotbar === "custom1"
            ? "customHotbar1"
            : "customHotbar2"

      const toKey =
        toHotbar === "main"
          ? "mainHotbar"
          : toHotbar === "custom1"
            ? "customHotbar1"
            : "customHotbar2"

      if (fromKey === toKey) {
        // Swap within same hotbar
        const newHotbar = [...state[fromKey]]
        const temp = newHotbar[fromIndex]
        newHotbar[fromIndex] = newHotbar[toIndex]
        newHotbar[toIndex] = temp
        return { [fromKey]: newHotbar }
      } else {
        // Swap between different hotbars
        const newFromHotbar = [...state[fromKey]]
        const newToHotbar = [...state[toKey]]
        const temp = newFromHotbar[fromIndex]
        newFromHotbar[fromIndex] = newToHotbar[toIndex]
        newToHotbar[toIndex] = temp
        return {
          [fromKey]: newFromHotbar,
          [toKey]: newToHotbar,
        }
      }
    })
  },

  /**
   * Clear a specific hotbar slot (set to null)
   */
  clearHotbarSlot: (hotbarType: HotbarType, index: number) => {
    hotbarStore.setState((state) => {
      const hotbarKey =
        hotbarType === "main"
          ? "mainHotbar"
          : hotbarType === "custom1"
            ? "customHotbar1"
            : "customHotbar2"

      const newHotbar = [...state[hotbarKey]]
      newHotbar[index] = { itemId: null }

      return { [hotbarKey]: newHotbar }
    })
  },

  /**
   * Mark that a drop was handled by a valid target
   */
  markDropHandled: () => {
    hotbarStore.setState((state) => {
      if (!state.mouseDrag) return state
      return {
        mouseDrag: { ...state.mouseDrag, dropHandled: true },
      }
    })
  },

  endMouseDrag: () => {
    hotbarStore.setState({ mouseDrag: null })
  },
}

/**
 * Selectores
 */
export const getActiveHotbar = (state: HotbarState) => state.activeHotbar
export const getActiveSlotIndex = (state: HotbarState) => state.activeSlotIndex
export const getDecorationMenuOpen = (state: HotbarState) =>
  state.decorationMenuOpen
export const getSelectedDecorationMode = (state: HotbarState) =>
  state.selectedDecorationMode
