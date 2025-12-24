/**
 * Ground Autotiling System
 *
 * Implements 16-direction autotiling for ground tiles using bitmask.
 * Each ground tile decides its sprite variant based on neighboring tiles of the same type.
 *
 * Bitmask layout: N | E | S | W
 * - Bit 0 (North): 0001
 * - Bit 1 (East):  0010
 * - Bit 2 (South): 0100
 * - Bit 3 (West):  1000
 *
 * Layer system: 3 capas para evitar huecos de PNG transparente
 * - Layer 0: Base (ej: grass)
 * - Layer 1: Detalles (ej: dirt/tierra)
 * - Layer 2: Top (ej: grass otra vez)
 */

export type LayersArray = [
  LayerTile | null,
  LayerTile | null,
  LayerTile | null,
  LayerTile | null,
]

export interface LayerTile {
  type: number // 0=grass, 1=dirt, -1=empty
  spriteIndex: number // 0-15 based on bitmask variant
}

export interface GroundTile {
  layers: LayersArray
}

/**
 * Bitmask to sprite index mapping
 * Maps each of the 16 bitmask combinations to the correct sprite variant
 */
const BITMASK_TO_SPRITE: Record<number, number> = {
  0b0110: 0,
  0b1110: 1,
  0b1100: 2,
  0b0100: 3,
  0b0111: 4,
  0b1111: 5,
  0b1101: 6,
  0b0101: 7,
  0b0011: 8,
  0b1011: 9,
  0b1001: 10,
  0b0001: 11,
  0b0010: 12,
  0b1010: 13,
  0b1000: 14,
  0b0000: 15,
}

// const BITMASK_TO_SPRITE: Record<number, number> = {
//   0b0000: 0, // Sprite sin vecinos iguales
//   0b0110: 1, // Esquina superior izquierda
//   0b1110: 2, // Borde mid top
//   0b1100: 3, // Esquina superior derecha
//   0b0100: 4, // Isolated top vertical
//   0b0111: 5, // Borde mid left
//   0b1111: 6, // center (all neighbors)
//   0b1101: 7, // Borde mid right
//   0b0101: 8, // Isolated mid vertical
//   0b0011: 9, // Esquina inferior izquierda
//   0b1011: 10, // Borde mid bottom
//   0b1001: 11, // Esquina inferior derecha
//   0b0001: 12, // Isolated bottom vertical
//   0b0010: 13, // Isolated left horizontal
//   0b1010: 14, // Isolated mid horizontal
//   0b1000: 15, // Isolated right horizontal
// }

/**
 * calculateBitmask: Calcula el bitmask de un tile según sus vecinos EN UNA CAPA ESPECÍFICA
 *
 * Comprueba los 4 vecinos (N, E, S, W) en la capa indicada.
 * Solo cuenta como vecino si tiene el mismo tipo en esa capa.
 *
 * @param x - Posición X del tile
 * @param y - Posición Y del tile
 * @param tileType - Tipo de tile (0=grass, 1=dirt)
 * @param layer - Número de capa (0, 1, 2)
 * @param groundTiles - Mapa actual de tiles
 * @param worldWidth - Ancho del mundo
 * @param worldHeight - Alto del mundo
 * @returns Bitmask 0-15
 */
export function calculateBitmask(
  x: number,
  y: number,
  tileType: number,
  layer: number,
  groundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): number {
  let mask = 0

  // Check North (y - 1)
  if (y > 0) {
    const northKey = `${x}-${y - 1}`
    const northTile = groundTiles.get(northKey)
    if (northTile?.layers[layer]?.type === tileType) {
      mask |= 0b0001 // eslint-disable-line no-bitwise
    }
  }

  // Check East (x + 1)
  if (x < worldWidth - 1) {
    const eastKey = `${x + 1}-${y}`
    const eastTile = groundTiles.get(eastKey)
    if (eastTile?.layers[layer]?.type === tileType) {
      mask |= 0b0010 // eslint-disable-line no-bitwise
    }
  }

  // Check South (y + 1)
  if (y < worldHeight - 1) {
    const southKey = `${x}-${y + 1}`
    const southTile = groundTiles.get(southKey)
    if (southTile?.layers[layer]?.type === tileType) {
      mask |= 0b0100 // eslint-disable-line no-bitwise
    }
  }

  // Check West (x - 1)
  if (x > 0) {
    const westKey = `${x - 1}-${y}`
    const westTile = groundTiles.get(westKey)
    if (westTile?.layers[layer]?.type === tileType) {
      mask |= 0b1000 // eslint-disable-line no-bitwise
    }
  }

  return mask
}

/**
 * getAutoTileSpriteIndex: Obtiene el índice de sprite para un bitmask
 *
 * @param bitmask - Bitmask 0-15
 * @returns Índice de sprite 0-15
 */
export function getAutoTileSpriteIndex(bitmask: number): number {
  return BITMASK_TO_SPRITE[bitmask] ?? 0
}

/**
 * paintAndAutoTile: Pinta un tile en una capa específica y recalcula automáticamente
 * el tile pintado y sus 4 vecinos inmediatos
 *
 * @param x - Posición X
 * @param y - Posición Y
 * @param tileType - Tipo de tile a pintar (0=grass, 1=dirt, -1=eraser/empty)
 * @param layer - Número de capa (0, 1, 2)
 * @param currentGroundTiles - Mapa actual
 * @param worldWidth - Ancho del mundo
 * @param worldHeight - Alto del mundo
 * @returns Nuevo mapa de tiles con autotiling aplicado
 */
export function paintAndAutoTile(
  x: number,
  y: number,
  tileType: number,
  layer: number,
  currentGroundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): Map<string, GroundTile> {
  const next = new Map(currentGroundTiles)

  // 1. Pintar el tile actual en la capa especificada
  const key = `${x}-${y}`
  const groundTile = next.get(key) || { layers: [null, null, null, null] }

  if (tileType === -1) {
    // Eraser: borrar en esa capa
    groundTile.layers[layer] = null
  } else {
    // Pintar: calcular sprite automático
    const bitmask = calculateBitmask(
      x,
      y,
      tileType,
      layer,
      next,
      worldWidth,
      worldHeight,
    )
    const spriteIndex = getAutoTileSpriteIndex(bitmask)
    groundTile.layers[layer] = { type: tileType, spriteIndex }
  }

  // Solo guardar si hay al menos una capa con contenido
  if (groundTile.layers.some((l) => l !== null)) {
    next.set(key, groundTile)
  } else {
    next.delete(key)
  }

  // 2. Recalcular los 4 vecinos inmediatos
  const neighbors = [
    { dx: 0, dy: -1, key: `${x}-${y - 1}` }, // North
    { dx: 1, dy: 0, key: `${x + 1}-${y}` }, // East
    { dx: 0, dy: 1, key: `${x}-${y + 1}` }, // South
    { dx: -1, dy: 0, key: `${x - 1}-${y}` }, // West
  ]

  for (const neighbor of neighbors) {
    const nx = x + neighbor.dx
    const ny = y + neighbor.dy

    // Verificar que está dentro del mundo
    if (nx < 0 || nx >= worldWidth || ny < 0 || ny >= worldHeight) {
      continue
    }

    const neighborTile = next.get(neighbor.key)
    if (!neighborTile) {
      continue
    }

    // Recalcular sprites de todas las capas del vecino
    const updatedLayers = [...neighborTile.layers] as LayersArray
    for (let l = 0; l < 4; l++) {
      if (updatedLayers[l]) {
        const newBitmask = calculateBitmask(
          nx,
          ny,
          updatedLayers[l]!.type,
          l,
          next,
          worldWidth,
          worldHeight,
        )
        const newSpriteIndex = getAutoTileSpriteIndex(newBitmask)
        updatedLayers[l] = {
          type: updatedLayers[l]!.type,
          spriteIndex: newSpriteIndex,
        }
      }
    }

    next.set(neighbor.key, { layers: updatedLayers })
  }

  // 3. Recalcular el tile del centro una última vez
  if (tileType !== -1) {
    const centerTile = next.get(key)
    if (centerTile) {
      const updatedLayers = [...centerTile.layers] as LayersArray
      for (let l = 0; l < 4; l++) {
        if (updatedLayers[l]) {
          const finalBitmask = calculateBitmask(
            x,
            y,
            updatedLayers[l]!.type,
            l,
            next,
            worldWidth,
            worldHeight,
          )
          const finalSpriteIndex = getAutoTileSpriteIndex(finalBitmask)
          updatedLayers[l] = {
            type: updatedLayers[l]!.type,
            spriteIndex: finalSpriteIndex,
          }
        }
      }
      next.set(key, { layers: updatedLayers })
    }
  }

  return next
}

/**
 * paintAreaAndAutoTile: Pinta múltiples tiles en una capa (p.ej. con brush 3x3 o 5x5)
 * y recalcula automáticamente todos los afectados
 *
 * @param centerX - Centro X del brush
 * @param centerY - Centro Y del brush
 * @param radius - Radio del brush (1 = 1x1, 2 = 3x3, etc)
 * @param tileType - Tipo de tile a pintar
 * @param layer - Número de capa (0, 1, 2)
 * @param currentGroundTiles - Mapa actual
 * @param worldWidth - Ancho del mundo
 * @param worldHeight - Alto del mundo
 * @returns Nuevo mapa de tiles con autotiling aplicado
 */
export function paintAreaAndAutoTile(
  centerX: number,
  centerY: number,
  radius: number,
  tileType: number,
  layer: number,
  currentGroundTiles: Map<string, GroundTile>,
  worldWidth: number,
  worldHeight: number,
): Map<string, GroundTile> {
  const next = new Map(currentGroundTiles)
  const affectedTiles = new Set<string>()

  // 1. Pintar todos los tiles del área en la capa especificada
  for (let dy = -radius; dy <= radius; dy++) {
    for (let dx = -radius; dx <= radius; dx++) {
      const tx = centerX + dx
      const ty = centerY + dy

      if (tx < 0 || tx >= worldWidth || ty < 0 || ty >= worldHeight) {
        continue
      }

      const key = `${tx}-${ty}`
      affectedTiles.add(key)

      const groundTile = next.get(key) || { layers: [null, null, null, null] }

      if (tileType === -1) {
        groundTile.layers[layer] = null
      } else {
        groundTile.layers[layer] = { type: tileType, spriteIndex: 0 } // spriteIndex temporal
      }

      // Solo guardar si hay al menos una capa con contenido
      if (groundTile.layers.some((l) => l !== null)) {
        next.set(key, groundTile)
      } else {
        next.delete(key)
      }
    }
  }

  // 2. Recalcular sprites de todos los tiles afectados
  // (incluyendo los pintados y sus vecinos)
  const tilesToRecalculate = new Set(affectedTiles)

  // Agregar vecinos de tiles afectados
  for (const key of affectedTiles) {
    const [x, y] = key.split("-").map(Number)
    const neighbors = [
      `${x}-${y - 1}`,
      `${x + 1}-${y}`,
      `${x}-${y + 1}`,
      `${x - 1}-${y}`,
    ]
    neighbors.forEach((nkey) => tilesToRecalculate.add(nkey))
  }

  // Recalcular sprites
  for (const key of tilesToRecalculate) {
    const tile = next.get(key)
    if (!tile) continue

    const [x, y] = key.split("-").map(Number)
    const updatedLayers = [...tile.layers] as LayersArray
    for (let l = 0; l < 4; l++) {
      if (updatedLayers[l]) {
        const bitmask = calculateBitmask(
          x,
          y,
          updatedLayers[l]!.type,
          l,
          next,
          worldWidth,
          worldHeight,
        )
        const spriteIndex = getAutoTileSpriteIndex(bitmask)
        updatedLayers[l] = {
          type: updatedLayers[l]!.type,
          spriteIndex,
        }
      }
    }
    next.set(key, { layers: updatedLayers })
  }

  return next
}
