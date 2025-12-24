import { TILE_SIZE } from "@/engine/rendering/config"
import type { ReactElement } from "react"
import "./WaterBackground.css"

interface WaterBackgroundProps {
  width: number // Farm width in tiles
  height: number // Farm height in tiles
}

export const WaterBackground = ({
  width,
  height,
}: WaterBackgroundProps): ReactElement => {
  // Water base size must scale with grid but have a minimum
  const maxDimension = Math.max(width, height)
  const WATER_SIZE_TILES = Math.max(100, maxDimension * 2) // At least 100 tiles

  const gridWidthPx = width * TILE_SIZE
  const gridHeightPx = height * TILE_SIZE
  const waterSizePx = WATER_SIZE_TILES * TILE_SIZE

  // Actual water dimensions (extend more horizontally)
  const waterWidth = waterSizePx * 2
  const waterHeight = waterSizePx

  // Position grid at center of actual water dimensions
  const gridOffsetX = (waterWidth - gridWidthPx) / 2
  const gridOffsetY = (waterHeight - gridHeightPx) / 2

  return (
    <div
      className="water-background"
      style={{
        width: waterSizePx * 2,
        height: waterSizePx,
        left: -gridOffsetX,
        top: -gridOffsetY,
      }}
    />
  )
}
