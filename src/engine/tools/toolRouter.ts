import type { Item } from "@/constants/items"
import { ItemType } from "@/constants/items"
import { hotbarActions } from "@/engine/hotbarStore"
import type { CropEntity } from "@/engine/interfaces/crops"
import type { Entity } from "@/engine/interfaces/entity"
import { inventoryActions, inventoryStore } from "@/engine/inventoryStore"
import type { TilledTile, Tool } from "@/engine/store"
import { harvestCrop, plantCrop, removeCrop } from "@/utils/cropHelpers"
import { findEntityAtTile } from "@/utils/findEntityAtTile"
import { useToolOnEntity } from "../toolHandlers"
import { handleHoeTool } from "./hoeHandler"
import { handleWateringCan } from "./wateringCanHandler"

import { paintBlobTile } from "@/engine/autotiling/blobAutotiling"
import type { GroundTile } from "@/engine/autotiling/groundAutotiling"

export interface ToolUseParams {
  mouseTile: { x: number; y: number }
  activeTool: Tool | null
  activeItem: Item | null // Item activo desde hotbar (para seeds)
  activeItemQuantity: number // Cantidad del item
  entities: Entity[]
  tilledSoil: Map<string, TilledTile>
  FARM_WIDTH: number
  FARM_HEIGHT: number
  groundTiles?: Map<string, GroundTile>
  setGroundTiles?: (tiles: Map<string, GroundTile>) => void
}

/**
 * Maneja el click del usuario con herramientas o items
 * Router central que delega a handlers específicos
 */
export function handleToolUse(params: ToolUseParams): void {
  const {
    mouseTile,
    activeTool,
    activeItem,
    activeItemQuantity,
    entities,
    tilledSoil,
    FARM_WIDTH,
    FARM_HEIGHT,
    groundTiles,
    setGroundTiles,
  } = params

  // CHECK SEMILLAS PRIMERO (antes del check de activeTool)
  // Para planting, solo nos importan CROPS, no árboles (los árboles no bloquean visualmente)
  // Solo verificamos crops y el footprint de árboles/rocas si aplica
  const clickedCrop = entities.find(
    (e) => e.type === "crop" && findEntityAtTile(mouseTile, [e]) === e,
  )

  // Si click en tierra arada vacía con semilla seleccionada, plantar
  if (!clickedCrop && activeItem?.type === ItemType.SEED) {
    const seedId = activeItem.id
    const cropId = activeItem.relatedCropId

    if (!cropId) {
      return
    }

    const planted = plantCrop(mouseTile.x, mouseTile.y, cropId, groundTiles)

    if (planted) {
      // Consumir semilla del inventario
      inventoryActions.removeItem(seedId, 1)

      // Limpiar de hotbars si ya no queda quantity
      // (setTimeout para asegurar que el estado de inventory esté actualizado)
      setTimeout(() => {
        const invState = inventoryStore.getState()
        const itemStillExists = invState.itemsMap.has(seedId)
        if (!itemStillExists) {
          hotbarActions.clearItemFromAllHotbars(seedId)
        }
      }, 0)
    }
    return
  }

  // ========================================
  // IDLE HARVEST - Click sin herramienta sobre crop listo para cosechar
  // ========================================
  if (!activeTool && !activeItem) {
    const cropAtTile = entities.find(
      (e) => e.type === "crop" && e.x === mouseTile.x && e.y === mouseTile.y,
    ) as CropEntity | undefined

    if (cropAtTile?.canHarvest && !cropAtTile.isDead) {
      harvestCrop(cropAtTile)
      return
    }
  }

  // AHORA check de herramientas
  if (!activeTool) return // Solo si hay herramienta activa

  // ========================================
  // SCYTHE - Harvest crops (antes de tile tools para evitar bloqueo de árboles)
  // ========================================
  if (activeTool === "scythe") {
    const cropAtTile = entities.find(
      (e) => e.type === "crop" && e.x === mouseTile.x && e.y === mouseTile.y,
    )

    if (cropAtTile && (cropAtTile as CropEntity).canHarvest) {
      harvestCrop(cropAtTile as CropEntity)
      return
    }
    // Si no hay crop o no está listo, continuar (puede interactuar con entidades)
  }

  // ========================================
  // TILE TOOLS - Estas herramientas operan en tiles, no en entidades
  // Se ejecutan ANTES de detectar clickedEntity para ignorar hitbox visual de árboles
  // ========================================

  // AZADA - Arar tierra
  if (activeTool === "hoe") {
    handleHoeTool(
      mouseTile.x,
      mouseTile.y,
      entities,
      tilledSoil,
      FARM_WIDTH,
      FARM_HEIGHT,
      groundTiles,
      setGroundTiles,
    )
    return
  }

  // REGADERA - Regar tierra arada (NO interactúa con crops)
  if (activeTool === "wateringCan") {
    handleWateringCan(mouseTile.x, mouseTile.y, tilledSoil, groundTiles)
    return
  }

  // PICO - Quitar crops > quitar dirt tiles > romper rocas
  if (activeTool === "pickaxe") {
    // 1. Primero intentar quitar cualquier crop (vivo o muerto)
    const cropAtTile = entities.find(
      (e) => e.type === "crop" && e.x === mouseTile.x && e.y === mouseTile.y,
    ) as CropEntity | undefined

    if (cropAtTile) {
      removeCrop(cropAtTile)
      return
    }

    // 2. Si no hay crop, intentar quitar dirt tile (layer 1)
    if (groundTiles && setGroundTiles) {
      const tileKey = `${mouseTile.x}-${mouseTile.y}`
      const tile = groundTiles.get(tileKey)
      const layer1 = tile?.layers?.[1]

      // Check if has dirt in layer 1 (types 400, 401)
      if (layer1 && (layer1.type === 400 || layer1.type === 401)) {
        // Use paintBlobTile with -1 to remove and recalculate neighbors
        const updatedTiles = paintBlobTile(
          mouseTile.x,
          mouseTile.y,
          -1, // -1 removes the tile
          1, // layer 1 (dirt)
          groundTiles,
          FARM_WIDTH,
          FARM_HEIGHT,
        )
        setGroundTiles(updatedTiles)
        return
      }
    }

    // 3. Si no hay dirt tile, proceder con entidades (rocas) abajo
  }

  // ========================================
  // ENTITY TOOLS - Detectar entidad clickeada (incluye árboles por hitbox visual)
  // ========================================
  const clickedEntity = findEntityAtTile(mouseTile, entities)

  // COSECHAR CROPS - Solo si NO usas una herramienta específica arriba
  // Si click en crop maduro, cosechar (sin tool específica)
  if (
    clickedEntity?.type === "crop" &&
    (clickedEntity as CropEntity).canHarvest
  ) {
    harvestCrop(clickedEntity as CropEntity)
    return
  }

  // Otras tools - necesitan entidad
  if (clickedEntity) {
    useToolOnEntity(activeTool, clickedEntity.id)
  }
}
