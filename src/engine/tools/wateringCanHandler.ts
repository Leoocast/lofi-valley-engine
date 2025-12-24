import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { CropEntity } from "@/engine/interfaces/crops"
import { worldStore } from "@/engine/store"
import { hasDirtTile } from "@/utils/cropHelpers"

/**
 * Watering Can Handler - Waters crops directly
 *
 * Now waters the crop entity itself instead of tilledSoil
 */
export function handleWateringCan(
  x: number,
  y: number,
  tilledSoil: Map<string, any>, // Kept for compatibility but not used
  groundTiles?: Map<string, GroundTile>,
) {
  // Check if there's a dirt tile
  if (!hasDirtTile(x, y, groundTiles)) {
    return // No dirt tile
  }

  // Find crop at this position
  const entities = worldStore.getState().entities
  const crop = entities.find(
    (e) => e.type === "crop" && e.x === x && e.y === y,
  ) as CropEntity | undefined

  if (!crop) {
    return
  }

  if (crop.isWatered) {
    return
  }

  // Water the crop
  const currentGameTime = worldStore.getState().gameTime.totalMinutes
  crop.isWatered = true
  crop.wateredAt = currentGameTime
  crop.lastWateredAt = currentGameTime

  // Trigger re-render
  worldStore.setState({ entities: [...entities] })
}
