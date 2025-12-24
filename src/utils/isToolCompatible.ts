import type { Tool } from "@/engine/store"

/**
 * Verifica si una herramienta es compatible con un tipo de sprite
 */
export const isToolCompatible = (
  tool: Tool | null,
  spriteId: string,
): boolean => {
  if (!tool) return true // Sin herramienta = sin incompatibilidad

  // Mapeo de herramientas a tipos de sprites compatibles
  const compatibility: Record<Tool, string[]> = {
    axe: ["tree"],
    pickaxe: ["rock"],
    hoe: [], // TODO: tiles de tierra
    scythe: [], // TODO: pasto/maleza
    wateringCan: [], // TODO: tierra seca
  }

  const compatibleSprites = compatibility[tool]
  if (!compatibleSprites) return true // Tool sin restricciones

  return compatibleSprites.includes(spriteId)
}
