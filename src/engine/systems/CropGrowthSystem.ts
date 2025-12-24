import { getCropConfig } from "@/engine/rendering/cropRenderer"
import type { ISystem } from "../GameLoop"
import type { CropEntity } from "../interfaces/crops"
import { worldStore } from "../store"

/**
 * CropGrowthSystem: Manages crop growth, water dependency, and death
 *
 * Now uses crop's own isWatered state instead of tilledSoil
 *
 * Updates:
 * - Growth stages (if watered) - incremental, not checkpoint-based
 * - Death by dehydration
 * - Death by over-maturity
 * - Water consumption after growth checks
 *
 * NOTE: Sprite rendering is handled at render time using cropId + currentStage,
 * NOT by setting spriteIndex here.
 */
export class CropGrowthSystem implements ISystem {
  update(): void {
    const state = worldStore.getState()

    // IMPORTANT: Check if game is paused - don't process crops if paused
    if (state.isPaused) return

    const currentTime = state.gameTime.totalMinutes
    const entities = state.entities

    const crops = entities.filter((e): e is CropEntity => e.type === "crop")
    let hasChanges = false

    for (const crop of crops) {
      if (crop.isDead) continue

      const config = getCropConfig(crop.cropId)

      // Max stage is growthStages - 1 (0-indexed)
      // e.g. if growthStages = 5, stages are 0,1,2,3,4 and max is 4
      const maxStage = config.growthStages - 1

      // === CHECK DEATH CONDITIONS ===

      // Death by dehydration (check if crop is watered)
      const isWatered = crop.isWatered

      if (!isWatered) {
        // Not watered - check for death
        const timeSinceLastWater = currentTime - crop.lastWateredAt
        if (timeSinceLastWater >= config.deathTimeWithoutWater) {
          crop.isDead = true
          crop.diedAt = currentTime
          hasChanges = true
          continue
        }
        // Not watered but not dead yet - don't grow
        continue
      }

      // Death by over-maturity
      if (crop.canHarvest && crop.matureAt) {
        const timeSinceMature = currentTime - crop.matureAt
        if (timeSinceMature >= config.deathTimeWithoutHarvest) {
          crop.isDead = true
          crop.diedAt = currentTime
          hasChanges = true
          continue
        }
      }

      // === GROWTH ===

      // Crop is watered - grow by 1 minute per tick
      const GROWTH_INCREMENT = 1 // 1 minute of growth per tick
      crop.totalGrowthMinutes += GROWTH_INCREMENT
      hasChanges = true

      // Calculate current stage based on accumulated growth time
      const minutesPerStage = config.growthTimePerStage
      const newStage = Math.min(
        maxStage, // Use maxStage (growthStages - 1), not growthStages
        Math.floor(crop.totalGrowthMinutes / minutesPerStage),
      )

      if (newStage !== crop.currentStage) {
        crop.currentStage = newStage
      }

      // Check if reached maturity (at max stage)
      if (crop.currentStage >= maxStage && !crop.canHarvest) {
        crop.canHarvest = true
        crop.matureAt = currentTime
      }

      // Check water consumption based on waterCheckInterval
      const minutesSinceLastWater = currentTime - crop.wateredAt!
      if (minutesSinceLastWater >= config.waterCheckInterval) {
        // Consume water after waterCheckInterval
        crop.isWatered = false
        crop.wateredAt = null
      }
    }

    // Update store if needed
    if (hasChanges) {
      const updatedEntities = entities.map((e) =>
        e.type === "crop" && crops.some((c) => c.id === e.id) ? { ...e } : e,
      )
      worldStore.setState({ entities: updatedEntities })
    }
  }
}
