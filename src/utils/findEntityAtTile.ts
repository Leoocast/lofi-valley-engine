import type { Entity } from "@/engine/interfaces/entity"

import {
  getLogicalSize,
  isPointInEntityHitbox,
} from "@/engine/rendering/visualBoundsAndOffset"

/**
 * Encuentra la entidad más visible bajo el mouse
 * Crops usan hitbox 1x1, otros usan hitboxes custom o bounds visuales
 * Selecciona la entidad que se renderiza ENCIMA (última en render order)
 */
export const findEntityAtTile = (
  mouseTile: { x: number; y: number },
  entities: Entity[],
): Entity | null => {
  // Ordenar como GameEntities: ascendente por depth (los de adelante al final)
  const sortedEntities = [...entities].sort((a, b) => {
    const sizeA = getLogicalSize(a.sprite)
    const sizeB = getLogicalSize(b.sprite)
    const depthA = a.y + sizeA.h
    const depthB = b.y + sizeB.h
    return depthA - depthB // Ascendente
  })

  // Iterar en REVERSA: los últimos se renderizan encima (z-index mayor)
  for (let i = sortedEntities.length - 1; i >= 0; i--) {
    const entity = sortedEntities[i]

    // Crops siempre usan hitbox 1x1 (solo el tile base)
    if (entity.type === "crop") {
      if (entity.x === mouseTile.x && entity.y === mouseTile.y) {
        return entity
      }
      continue
    }

    // Otros usan hitboxes custom o bounds visuales
    if (isPointInEntityHitbox(entity, mouseTile)) {
      return entity // Última que hace hit = la de más arriba visualmente
    }
  }

  return null
}
