import { paintBlobTile } from "@/engine/autotiling/blobAutotiling"
import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { Entity } from "@/engine/interfaces/entity"
import {
  getBasePosition,
  getLogicalSize,
} from "@/engine/rendering/visualBoundsAndOffset"

/**
 * Hoe Tool Handler - Paints dirt tiles on the ground
 *
 * Now uses the ground tiles system (layer 1) with dirt tiles (type 400)
 * instead of the old separate tilled soil system.
 */
export function handleHoeTool(
  x: number,
  y: number,
  entities: Entity[],
  tilledSoil: Map<string, any>, // Kept for compatibility but not used
  FARM_WIDTH: number,
  FARM_HEIGHT: number,
  groundTiles?: Map<string, GroundTile>,
  setGroundTiles?: (tiles: Map<string, GroundTile>) => void,
) {
  // Validar que está dentro del grid
  if (x < 0 || x >= FARM_WIDTH || y < 0 || y >= FARM_HEIGHT) {
    return // Fuera del grid
  }

  // Si no se proporcionaron tiles/setter, salir silenciosamente
  if (!groundTiles || !setGroundTiles) {
    return
  }

  // Validar que no hay entidad BLOQUEANTE en ese tile
  // Para la hoe, solo verificamos el FOOTPRINT (logicalSize), no el hitbox visual

  // 1. Verificar crops (usan x, y directamente)
  const cropAtTile = entities.find(
    (e) => e.type === "crop" && e.x === x && e.y === y,
  )
  if (cropAtTile) {
    return
  }

  // 2. Verificar si el FOOTPRINT de un árbol/roca cubre este tile
  const treeRockAtTile = entities.find((e) => {
    if (e.sprite.id !== "tree" && e.sprite.id !== "rock") return false

    // Obtener posición real del footprint (con baseOffset si existe)
    const basePos = getBasePosition(e)
    const footprint = getLogicalSize(e.sprite)

    return (
      x >= basePos.x &&
      x < basePos.x + footprint.w &&
      y >= basePos.y &&
      y < basePos.y + footprint.h
    )
  })

  if (treeRockAtTile) {
    return
  }

  // Validar que no hay ya dirt tile en este tile (layer 1)
  const tileKey = `${x}-${y}`
  const existingTile = groundTiles.get(tileKey)

  // Si ya tiene dirt en layer 1, no hacer nada
  if (
    existingTile?.layers[1]?.type === 400 ||
    existingTile?.layers[1]?.type === 401
  ) {
    return
  }

  // Pintar dirt tile (tipo 401 = DIRT_WIDER) en layer 1
  const DIRT_TILE_TYPE = 401 // Dirt.DIRT_WIDER
  const LAYER_1 = 1 // Ground layer

  const updatedTiles = paintBlobTile(
    x,
    y,
    DIRT_TILE_TYPE,
    LAYER_1,
    groundTiles,
    FARM_WIDTH,
    FARM_HEIGHT,
  )

  // Actualizar el store de ground tiles
  setGroundTiles(updatedTiles)
}
