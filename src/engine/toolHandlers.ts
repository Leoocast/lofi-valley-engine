import {
  type EntityAnimation,
  ANIMATIONS,
  ANIMATION_DURATIONS,
  playEntityAnimation,
} from "./animationEngine"
import type { Entity } from "./interfaces/entity"
import type { Tool } from "./store"

import { worldStore } from "./store"

/**
 * Programa la remoción de una entidad después de que termine su animación
 * Reutilizable para todas las herramientas que destruyen entidades
 */
const scheduleEntityRemoval = (
  entityId: string,
  animation: EntityAnimation,
): void => {
  const duration = ANIMATION_DURATIONS[animation]

  setTimeout(() => {
    worldStore.setState((s) => ({
      entities: s.entities.filter((e) => e.id !== entityId),
    }))
  }, duration)
}

/**
 * Resultado de usar una herramienta
 */
interface ToolResult {
  success: boolean
  message?: string
  drops?: Array<{ itemId: string; quantity: number }>
  entityUpdates?: Partial<Entity>
  removeEntity?: boolean
}

/**
 * Tool Handler - Función que ejecuta la lógica de una herramienta
 */
type ToolHandler = (entity: Entity) => ToolResult

/**
 * TOOL HANDLERS - Lógica de cada herramienta
 */
const TOOL_HANDLERS: Record<Tool, ToolHandler> = {
  /**
   * HACHA - Cortar árboles
   * Hace 1 de daño por golpe
   */
  axe: (entity: Entity): ToolResult => {
    // Solo funciona en árboles
    if (entity.sprite.id !== "tree") {
      return {
        success: false,
        message: "El hacha solo funciona en árboles",
      }
    }

    // Verificar si es destructible
    if (entity.isDestructible === false) {
      return {
        success: false,
        message: "Esta entidad no puede ser destruida",
      }
    }

    // Verificar que sea un árbol
    if (entity.sprite.id !== "tree") {
      return {
        success: false,
        message: "❌ El hacha solo funciona en árboles",
      }
    }

    // Si no tiene HP, asignar HP por defecto
    const currentHp = entity.hp ?? 5
    const maxHp = entity.maxHp ?? 5

    // Hacer daño
    const damage = 1
    const newHp = currentHp - damage

    // Si llegó a 0 o menos, reproducir animación de muerte y luego destruir
    if (newHp <= 0) {
      // Reproducir animación de muerte y programar remoción
      playEntityAnimation(entity.id, ANIMATIONS.DIE)
      scheduleEntityRemoval(entity.id, ANIMATIONS.DIE)

      return {
        success: true,
        drops: [{ itemId: "wood", quantity: 3 }],
        // NO remover inmediatamente - se hace después de la animación
      }
    }

    // Si aún tiene HP, solo actualizar + animar
    playEntityAnimation(entity.id, ANIMATIONS.CHOP)

    return {
      success: true,
      entityUpdates: { hp: newHp },
    }
  },

  pickaxe: (entity) => {
    // Verificar que sea una roca
    if (entity.sprite.id !== "rock") {
      return {
        success: false,
        message: "❌ El pico solo funciona en rocas",
      }
    }

    // Verificar que la entidad sea destructible
    if (!entity.isDestructible) {
      return {
        success: false,
        message: "❌ Esta entidad no se puede destruir con el pico",
      }
    }

    // Aplicar daño (piedras tienen 1 HP)
    const newHp = (entity.hp ?? 0) - 1

    if (newHp <= 0) {
      // Roca destruida - reproducir animación de muerte
      playEntityAnimation(entity.id, ANIMATIONS.DIE)
      scheduleEntityRemoval(entity.id, ANIMATIONS.DIE)

      return {
        success: true,
        message: "🪨 ¡Roca destruida!",
        drops: [{ itemId: "stone", quantity: 2 }],
        removeEntity: false,
      }
    }

    // Roca sobrevive - reproducir animación de impacto
    playEntityAnimation(entity.id, ANIMATIONS.IMPACT)

    return {
      success: true,
      entityUpdates: { hp: newHp },
    }
  },

  hoe: (): ToolResult => {
    return { success: false, message: "Azada no implementada aún" }
  },

  /**
   * REGADERA - Regar tierra (placeholder)
   */
  wateringCan: (): ToolResult => {
    return { success: false, message: "Regadera no implementada aún" }
  },

  /**
   * GUADAÑA - Cosechar cultivos (placeholder)
   */
  scythe: (): ToolResult => {
    return { success: false, message: "Guadaña no implementada aún" }
  },
}

/**
 * Usar herramienta en una entidad
 */
export const useToolOnEntity = (toolId: Tool, entityId: string): void => {
  const state = worldStore.getState()
  const entity = state.entities.find((e) => e.id === entityId)

  if (!entity) {
    console.warn(`Entity ${entityId} not found`)
    return
  }

  // Obtener handler de la herramienta
  const handler = TOOL_HANDLERS[toolId]
  if (!handler) {
    console.warn(`No handler for tool ${toolId}`)
    return
  }

  // Ejecutar handler
  const result = handler(entity)

  if (!result.success) {
    if (result.message) console.log(result.message)
    return
  }

  // Aplicar cambios a la entidad
  if (result.entityUpdates) {
    worldStore.setState((s) => ({
      entities: s.entities.map((e) =>
        e.id === entityId ? { ...e, ...result.entityUpdates } : e,
      ),
    }))
  }

  // Remover entidad si es necesario
  if (result.removeEntity) {
    worldStore.setState((s) => ({
      entities: s.entities.filter((e) => e.id !== entityId),
    }))
  }

  // Agregar drops al inventario
  if (result.drops) {
    result.drops.forEach((drop) => {
      // Items are added to inventory via harvestCrop() in cropHelpers
      // This is just for non-crop drops (trees, rocks)
    })
  }
}
