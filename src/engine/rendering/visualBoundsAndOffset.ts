/**
 * visualBoundsAndOffset: Funciones para calcular dimensiones, offsets y bounds
 * de sprites en el sistema de coordenadas del juego.
 *
 * Maneja la conversión entre:
 * - Footprint físico (colisión en el grid)
 * - Dimensiones visuales (lo que se ve en pantalla)
 * - Offset de renderizado (para alinear sprites con su base)
 * - Bounds de hover (para detección de clicks/mouse)
 */

import type { Entity } from "../interfaces/entity"
import type { Sprite } from "../interfaces/sprites"

import { TILE_SIZE } from "./config"

/**
 * getLogicalSize: Obtiene el footprint de colisión de un sprite.
 *
 * Retorna las dimensiones de la "base" del sprite - el área que ocupa
 * físicamente en el grid para propósitos de colisión. Esta es la zona
 * donde el sprite "toca el suelo" y no puede ser ocupada por otros sprites.
 *
 * @param sprite - El sprite del cual obtener dimensiones
 * @returns Objeto con ancho (w) y alto (h) en tiles
 *
 * @example
 * const size = getLogicalSize(CABIN_SPRITE)
 * // { w: 5, h: 2 } - la cabaña ocupa 5x2 tiles en el suelo
 */
export function getLogicalSize(sprite: Sprite) {
  return { w: sprite.baseWidth, h: sprite.baseHeight }
}

/**
 * getVisualOffset: Calcula el offset de renderizado para alinear el sprite.
 *
 * Los sprites pueden ser más altos que su footprint (ej: una cabaña de 5x2
 * pero con sprite de 5x7). Para que la "base" del sprite quede alineada con
 * su footprint en el grid, necesitamos moverlo hacia arriba (offset Y negativo).
 *
 * El cálculo:
 * - Altura del footprint en píxeles: baseHeight * TILE_SIZE
 * - Píxeles extra del sprite: spriteSheet.height - altura footprint
 * - Offset Y: negativo para "subir" el sprite esos píxeles extra
 *
 * Esto crea el efecto de que el sprite se extiende "hacia arriba" desde
 * su base, simulando altura/profundidad en un mundo top-down.
 *
 * @param sprite - El sprite del cual calcular offset
 * @returns Offset en píxeles { x: 0, y: número_negativo }
 *
 * @example
 * const offset = getVisualOffset(CABIN_SPRITE)
 * // { x: 0, y: -80 } - sube el sprite 80px para alinearlo
 */
export function getVisualOffset(sprite: Sprite) {
  const logicalHeightPx = sprite.baseHeight * TILE_SIZE
  const extra = (sprite.spriteSheet?.height || 0) - logicalHeightPx
  return { x: 0, y: -extra }
}

/**
 * getBasePosition: Calcula la posición real del footprint de una entidad.
 *
 * Aplica baseOffsetX/Y si están definidos en el sprite, para sprites donde
 * el footprint no está en la esquina superior izquierda (ej: árbol centrado).
 *
 * @param entity - Entidad de la cual calcular posición base
 * @returns Coordenadas del footprint { x, y } en tiles
 *
 * @example
 * // Árbol en (5, 10) con baseOffsetX: 1
 * const pos = getBasePosition(treeEntity)
 * // { x: 6, y: 10 } - footprint en tile central, no en la izquierda
 */
export function getBasePosition(entity: Entity) {
  const offsetX = entity.sprite.baseOffsetX ?? 0
  const offsetY = entity.sprite.baseOffsetY ?? 0
  return {
    x: entity.x + offsetX,
    y: entity.y + offsetY,
  }
}

/**
 * getVisualHoverBounds: Calcula el rectángulo clickeable de una entidad.
 *
 * Retorna el área que el usuario puede clickear para interactuar con la entidad.
 * Usa las dimensiones VISUALES (realWidth x realHeight) en vez del footprint,
 * para que puedas hacer click en cualquier parte visible del sprite, incluyendo
 * la parte que se extiende "arriba" del footprint.
 *
 * El cálculo:
 * - Ancho X: Desde entity.x hasta entity.x + realWidth
 * - Alto Y: Calculado desde la base (bottomY) hacia arriba por realHeight tiles
 *
 * Esto permite clicks precisos en toda el área visible del sprite, no solo
 * en su footprint en el suelo. Esencial para seleccionar edificios altos.
 *
 * @param entity - La entidad de la cual calcular bounds
 * @returns Rectángulo con minX, maxX, minY, maxY en coordenadas de tiles
 *
 * Bounds visuales considerando offset (para hover detection)
 * - Usa visualOffset para posición correcta en pantalla
 * - Usa realWidth/realHeight para tamaño visual
 */
export const getVisualHoverBounds = (entity: Entity) => {
  const sprite = entity.sprite
  const visualOffset = getVisualOffset(sprite)

  // Posición base de la entidad
  const baseX = entity.x
  const baseY = entity.y

  // Bounds visuales
  const minX = baseX + Math.floor(visualOffset.x / TILE_SIZE)
  const minY = baseY + Math.floor(visualOffset.y / TILE_SIZE)
  const maxX = minX + sprite.realWidth - 1
  const maxY = minY + sprite.realHeight - 1

  return { minX, minY, maxX, maxY }
}

/**
 * Verifica si un punto (en tiles) colisiona con una entidad
 * Usa hitboxes custom si están definidas, sino usa bounds visuales completas
 *
 * @param entity - Entidad a verificar
 * @param pointTile - Punto en coordenadas de tiles {x, y}
 * @returns true si el punto está dentro de la entidad
 */
export const isPointInEntityHitbox = (
  entity: Entity,
  pointTile: { x: number; y: number },
): boolean => {
  const sprite = entity.sprite

  // Si tiene hitboxes custom, verificar contra cada una
  if (sprite.hitboxes && sprite.hitboxes.length > 0) {
    // Calcular posición visual del sprite (incluyendo offset)
    const visualOffset = getVisualOffset(sprite)
    const visualBaseX = entity.x + Math.floor(visualOffset.x / TILE_SIZE)
    const visualBaseY = entity.y + Math.floor(visualOffset.y / TILE_SIZE)

    return sprite.hitboxes.some((box) => {
      // Hitboxes son relativos a la posición VISUAL del sprite
      const boxMinX = visualBaseX + box.x
      const boxMaxX = visualBaseX + box.x + box.w - 1
      const boxMinY = visualBaseY + box.y
      const boxMaxY = visualBaseY + box.y + box.h - 1

      return (
        pointTile.x >= boxMinX &&
        pointTile.x <= boxMaxX &&
        pointTile.y >= boxMinY &&
        pointTile.y <= boxMaxY
      )
    })
  }

  // Fallback: usar bounds visuales (comportamiento default)
  const bounds = getVisualHoverBounds(entity)
  return (
    pointTile.x >= bounds.minX &&
    pointTile.x <= bounds.maxX &&
    pointTile.y >= bounds.minY &&
    pointTile.y <= bounds.maxY
  )
}
