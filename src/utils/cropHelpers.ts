import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import { dropsActions } from "@/engine/dropsStore"
import { useGroundTilesStore } from "@/engine/groundTilesStore"
import type { CropEntity } from "@/engine/interfaces/crops"
import { Entity } from "@/engine/interfaces/entity"
import { CROPS_SPRITE } from "@/engine/interfaces/sprites"
import { inventoryActions } from "@/engine/inventoryStore"
import { getCropConfig, getCropIndex } from "@/engine/rendering/cropRenderer"
import { worldStore } from "@/engine/store"

/**
 * Get random drop count based on config
 */
function getDropCount(config: ReturnType<typeof getCropConfig>): number {
  const min = config.minDrops ?? 1
  const max = config.maxDrops ?? 1
  if (min === max) return min
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Check if a tile has dirt (tilled) - checks groundTiles layer 1 for dirt types
 * @param groundTilesOverride - Optional groundTiles map (for crops view)
 */
export function hasDirtTile(
  tileX: number,
  tileY: number,
  groundTilesOverride?: Map<string, GroundTile>,
): boolean {
  const groundTiles =
    groundTilesOverride ?? useGroundTilesStore.getState().groundTiles
  const tileKey = `${tileX}-${tileY}`
  const tile = groundTiles.get(tileKey)

  // Check if layer 1 has a dirt tile (400 or 401)
  const layer1 = tile?.layers[1]
  return layer1?.type === 400 || layer1?.type === 401
}

/**
 * Plant a crop on dirt tile (NEW: uses groundTiles instead of tilledSoil)
 * @param groundTilesOverride - Optional groundTiles map (for crops view)
 */
export function plantCrop(
  tileX: number,
  tileY: number,
  cropId: string,
  groundTilesOverride?: Map<string, GroundTile>,
): boolean {
  const state = worldStore.getState()
  const entities = state.entities
  const currentTime = state.gameTime.totalMinutes

  // Validate dirt tile exists (layer 1 = dirt)
  if (!hasDirtTile(tileX, tileY, groundTilesOverride)) {
    return false // Not tilled
  }

  // Validate no existing crop at this position
  const existingCrop = entities.find(
    (e) => e.type === "crop" && e.x === tileX && e.y === tileY,
  )
  if (existingCrop) return false // Already has crop

  // Validate crop exists
  const cropIndex = getCropIndex(cropId)
  if (cropIndex === -1) return false

  const crop: CropEntity = {
    id: crypto.randomUUID(),
    type: "crop",
    x: tileX,
    y: tileY,
    sprite: CROPS_SPRITE,
    spriteIndex: 0, // Not used for crops - sprite calculated from cropId + currentStage at render time
    depth: tileY * 100 + tileX,

    cropId,
    currentStage: 0,
    plantedAt: currentTime,
    lastWateredAt: 0,
    totalGrowthMinutes: 0,
    isWatered: false,
    wateredAt: null,
    matureAt: null,
    canHarvest: false,
    timesHarvested: 0,
    isDead: false,
    diedAt: null,
    tileX,
    tileY,
  }

  const updatedEntities = [...entities, crop]

  worldStore.setState({
    entities: updatedEntities,
  })

  return true
}

/**
 * Harvest a mature crop
 */
export function harvestCrop(cropEntity: CropEntity): boolean {
  if (!cropEntity.canHarvest || cropEntity.isDead) return false

  const config = getCropConfig(cropEntity.cropId)
  const currentTime = worldStore.getState().gameTime.totalMinutes

  cropEntity.timesHarvested++

  // Add to inventory INSTANTLY
  const dropCount = getDropCount(config)
  inventoryActions.addItem(config.harvestItem, dropCount)

  // Spawn visual drops
  for (let i = 0; i < dropCount; i++) {
    dropsActions.spawnDrop(
      config.harvestItem,
      cropEntity.tileX,
      cropEntity.tileY,
    )
  }

  if (config.isPerennial) {
    // Perennial crop - reset to stage 0
    cropEntity.currentStage = 0
    cropEntity.plantedAt = currentTime
    cropEntity.lastWateredAt = currentTime
    cropEntity.totalGrowthMinutes = 0
    cropEntity.canHarvest = false
    cropEntity.matureAt = null

    // Check max harvests
    if (
      config.maxHarvests > 0 &&
      cropEntity.timesHarvested >= config.maxHarvests
    ) {
      removeCrop(cropEntity)
    } else {
      worldStore.setState({ entities: [...worldStore.getState().entities] })
    }
  } else {
    // One-time crop
    removeCrop(cropEntity)
  }

  return true
}

/**
 * Remove a crop entity (dead or harvested)
 */
export function removeCrop(crop: CropEntity): void {
  const state = worldStore.getState()
  const entities = state.entities

  const updatedEntities = entities.filter((e) => e.id !== crop.id)

  worldStore.setState({ entities: updatedEntities })
}

/**
 * Find a dead crop at a specific tile
 */
export function findDeadCropAtTile(
  x: number,
  y: number,
  entities: Entity[],
): CropEntity | null {
  const crop = entities.find(
    (e) => e.type === "crop" && e.x === x && e.y === y,
  ) as CropEntity | undefined
  return crop?.isDead ? crop : null
}
