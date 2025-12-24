import type { Tool } from "@/engine/store"

/**
 * Configuración de herramientas del juego
 */
export const TOOLS = [
  { id: "axe" as Tool, emoji: "🪓", name: "Axe", shortcut: 1 },
  { id: "pickaxe" as Tool, emoji: "⛏️", name: "Pickaxe", shortcut: 2 },
  { id: "hoe" as Tool, emoji: "🔨", name: "Hoe", shortcut: 3 },
  { id: "wateringCan" as Tool, emoji: "💧", name: "Watering Can", shortcut: 4 },
  { id: "scythe" as Tool, emoji: "✂️", name: "Scythe", shortcut: 5 },
] as const

/**
 * Mapa de herramientas por ID (derivado de TOOLS)
 */
export const TOOL_DEFINITIONS = Object.fromEntries(
  TOOLS.map((tool) => [tool.id, tool]),
) as Record<Tool, (typeof TOOLS)[number]>

/**
 * Mapa de shortcuts a herramientas
 */
export const TOOL_SHORTCUTS = {
  1: "axe" as Tool,
  2: "pickaxe" as Tool,
  3: "hoe" as Tool,
  4: "wateringCan" as Tool,
  5: "scythe" as Tool,
} as const

/**
 * Colores para el hover de herramientas
 */
export const TOOL_COLORS = {
  axe: "rgba(228, 215, 27, 0.25)", // 🪓 Marrón para madera
  pickaxe: "rgba(128, 128, 128, 0.25)", // ⛏️ Gris para piedra
  hoe: "rgba(184, 131, 94, 0.25)", // 🔨 Marrón tierra11
  wateringCan: "rgba(0, 191, 255, 0.25)", // 💧 Azul agua
  scythe: "rgba(144, 238, 144, 0.25)", // ✂️ Verde hierba
} as const
