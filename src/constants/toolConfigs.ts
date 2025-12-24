import type { Tool } from "@/engine/store"

/**
 * Configuración de comportamiento de herramientas
 */
export interface ToolConfig {
  /** Muestra el tile overlay al hacer hover (útil para debug) */
  showTileHover: boolean
  /** La herramienta interactúa con tiles directamente (hoe, wateringCan) */
  interactsWithTiles: boolean
  /** La herramienta interactúa con entidades (axe, pickaxe) */
  interactsWithEntities: boolean
}

/**
 * Configuraciones por herramienta
 */
export const TOOL_CONFIGS: Record<Tool, ToolConfig> = {
  axe: {
    showTileHover: false, // No muestra tile - interactúa con entidades
    interactsWithTiles: false,
    interactsWithEntities: true,
  },
  pickaxe: {
    showTileHover: true, // Muestra tile cuando hay tierra arada
    interactsWithTiles: true, // Puede quitar tierra arada
    interactsWithEntities: true, // También rompe rocas
  },
  hoe: {
    showTileHover: true,
    interactsWithTiles: true,
    interactsWithEntities: false,
  },
  wateringCan: {
    showTileHover: true, // Muestra tile cuando hay tierra arada
    interactsWithTiles: true, // Riega tierra arada
    interactsWithEntities: false,
  },
  scythe: {
    showTileHover: false, // No muestra tile - cosecha cultivos (entidades)
    interactsWithTiles: false,
    interactsWithEntities: true,
  },
}

/**
 * Helper para obtener configuración de una herramienta
 */
export const getToolConfig = (tool: Tool): ToolConfig => {
  return TOOL_CONFIGS[tool]
}
