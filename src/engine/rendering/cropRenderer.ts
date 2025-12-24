/**
 * Crop Renderer
 *
 * Calculates sprite coordinates for crops in cropsV2.png
 *
 * Row layout per crop:
 * | SeedPack | Seeds | S1 | S2 | S3 | S4 | S5 | [S6] | SeedsW | S1W | S2W | S3W | S4W | S5W | [S6W] | HarvestItem |
 *     0         1      2    3    4    5    6    7?      +7       +8   +9   +10  +11  +12   +13?      last
 */

import type React from "react"
import { CROPS_DATA } from "../data/cropsData"

const TILE_W = 16
const TILE_H_NORMAL = 16
const TILE_H_TALL = 32

/**
 * Pre-calculated Y offsets for each crop row
 */
let rowYOffsets: number[] | null = null

function calculateRowOffsets(): number[] {
  const offsets: number[] = []
  let currentY = 0

  for (const crop of CROPS_DATA.crops) {
    offsets.push(currentY)
    // Tall rows are 32px, normal are 16px
    const rowHeight = crop.tallStages.length > 0 ? TILE_H_TALL : TILE_H_NORMAL
    currentY += rowHeight
  }

  return offsets
}

function getRowOffsets(): number[] {
  if (!rowYOffsets) {
    rowYOffsets = calculateRowOffsets()
  }
  return rowYOffsets
}

/**
 * Get crop index by crop ID
 */
export function getCropIndex(cropId: string): number {
  return CROPS_DATA.crops.findIndex((c) => c.id === cropId)
}

/**
 * Get crop data by ID
 */
export function getCropData(cropId: string) {
  return CROPS_DATA.crops.find((c) => c.id === cropId)
}

export type CropSpriteType = "seedPacket" | "planted" | "stage" | "harvestItem"

interface SpriteCoords {
  x: number
  y: number
  w: number
  h: number
}

/**
 * Get sprite coordinates for a crop
 *
 * @param cropId - Crop ID (e.g., "corn-crop")
 * @param type - Type of sprite
 * @param stage - Growth stage (1-6, only for "stage" type)
 * @param watered - Is watered (only for "planted" and "stage" types)
 */
export function getCropSpriteCoords(
  cropId: string,
  type: CropSpriteType,
  stage?: number,
  watered?: boolean,
): SpriteCoords | null {
  const cropIndex = getCropIndex(cropId)
  if (cropIndex === -1) return null

  const crop = CROPS_DATA.crops[cropIndex]
  const offsets = getRowOffsets()
  const rowY = offsets[cropIndex]
  const hasTall = crop.tallStages.length > 0
  const has6Stages = crop.growthStages === 6

  // Calculate X position based on type
  let xIndex = 0
  let isTallSprite = false
  const WATERED_OFFSET = 7 // Watered sprites are always +7 tiles from dry

  switch (type) {
    case "seedPacket":
      xIndex = 0
      break

    case "planted":
      // Seeds = 1, SeedsWatered = Seeds + 7 = 8
      xIndex = watered ? 1 + WATERED_OFFSET : 1
      break

    case "stage":
      if (!stage || stage < 1) return null
      // S1=2, S2=3, S3=4, S4=5, S5=6, S6=7 (if exists)
      // Watered sprites are always +7 tiles from dry sprites
      const baseStageOffset = 2

      // Calculate base sprite position
      const dryXIndex = baseStageOffset + (stage - 1)

      // If watered, add 7 to get watered sprite
      xIndex = watered ? dryXIndex + WATERED_OFFSET : dryXIndex

      // Check if this stage is tall
      isTallSprite = crop.tallStages.includes(stage)
      break

    case "harvestItem":
      // Harvest item is ALWAYS at the last position (index 15)
      // Spritesheet has fixed 16-column layout regardless of growthStages
      // For 5-stage crops there's empty space before harvestItem
      xIndex = 15
      break
  }

  // Calculate actual coordinates
  const x = xIndex * TILE_W
  const h = isTallSprite ? TILE_H_TALL : TILE_H_NORMAL
  // For tall rows, normal sprites are at bottom (y + 16)
  const y = hasTall && !isTallSprite ? rowY + TILE_H_NORMAL : rowY

  return { x, y, w: TILE_W, h }
}

/**
 * Get CSS background style for a crop sprite
 */
export function getCropSpriteStyle(
  cropId: string,
  type: CropSpriteType,
  stage?: number,
  watered?: boolean,
): React.CSSProperties | null {
  const coords = getCropSpriteCoords(cropId, type, stage, watered)
  if (!coords) return null

  return {
    backgroundImage: `url(/spritesheets/${CROPS_DATA.meta.src})`,
    backgroundPosition: `-${coords.x}px -${coords.y}px`,
    backgroundSize: `${CROPS_DATA.meta.width}px ${CROPS_DATA.meta.height}px`,
    width: coords.w,
    height: coords.h,
    imageRendering: "pixelated",
  }
}

/**
 * Get sprite style for an Item (seed or harvest)
 * Use this in UI components instead of checking spritesheet/spriteIndex
 */
export function getItemSpriteStyle(item: {
  relatedCropId?: string
  type?: string
}): React.CSSProperties | null {
  if (!item.relatedCropId) return null

  // Determine sprite type based on item type
  const spriteType: CropSpriteType =
    item.type === "seed" ? "seedPacket" : "harvestItem"

  return getCropSpriteStyle(item.relatedCropId, spriteType)
}

// ============================================================
// LEGACY COMPATIBILITY FUNCTIONS (for migration from cropConfigs)
// ============================================================

/**
 * Wilted crop sprite placeholder
 * TODO: Add wilted sprites to cropsV2.png
 */
const WILTED_SPRITE_OFFSETS = [0, 1, 2, 3]

export function getRandomWiltedSprite(): number {
  return WILTED_SPRITE_OFFSETS[
    Math.floor(Math.random() * WILTED_SPRITE_OFFSETS.length)
  ]
}

/**
 * Legacy-compatible crop config interface
 * Maps new cropsData to old CropConfig format for migration
 */
export interface LegacyCropConfig {
  id: string
  name: string
  growthStages: number
  growthTimePerStage: number
  waterCheckInterval: number
  deathTimeWithoutWater: number
  deathTimeWithoutHarvest: number
  isPerennial: boolean
  maxHarvests: number
  harvestItem: string
  minDrops: number
  maxDrops: number
  tallStages: number[]
}

/**
 * Get crop config by ID (legacy-compatible)
 */
export function getCropConfig(cropId: string): LegacyCropConfig {
  const crop = getCropData(cropId)
  if (!crop) throw new Error(`Crop config not found: ${cropId}`)

  return {
    id: crop.id,
    name: crop.name,
    growthStages: crop.growthStages,
    growthTimePerStage: crop.lifeCycle.growthTimePerStage,
    waterCheckInterval: crop.lifeCycle.waterCheckInterval,
    deathTimeWithoutWater: crop.lifeCycle.deathTimeWithoutWater,
    deathTimeWithoutHarvest: crop.lifeCycle.deathTimeWithoutHarvest,
    isPerennial: crop.lifeCycle.isPerennial,
    maxHarvests: crop.harvest.maxHarvests,
    harvestItem: crop.items.harvestId,
    minDrops: crop.harvest.minDrops,
    maxDrops: crop.harvest.maxDrops,
    tallStages: crop.tallStages,
  }
}
