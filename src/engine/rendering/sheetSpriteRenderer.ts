/**
 * sheetSpriteRenderer.ts - Rendering utilities for SheetSprite format
 *
 * Generates CSS styles and renders entities using the new SheetSprite format.
 */

import type { CSSProperties } from "react"

import type { SheetSprite } from "@/engine/data/sprites/winterSprites"
import type { SpriteSheetData } from "@/engine/data/spritesheetData"

/**
 * Get CSS styles to render a SheetSprite
 */
export function getSheetSpriteStyle(
  sprite: SheetSprite,
  sheetData: SpriteSheetData<{ sprites: SheetSprite[] }>,
): CSSProperties {
  const { meta } = sheetData
  const tileSize = meta.tileWidth ?? 16

  const bgX = sprite.region.x * tileSize
  const bgY = sprite.region.y * tileSize
  const width = sprite.region.width * tileSize
  const height = sprite.region.height * tileSize

  return {
    width,
    height,
    backgroundImage: `url(/spritesheets/${meta.src})`,
    backgroundPosition: `-${bgX}px -${bgY}px`,
    backgroundSize: `${meta.width}px ${meta.height}px`,
    backgroundRepeat: "no-repeat",
    imageRendering: "pixelated",
  }
}

/**
 * Get CSS styles for a sprite preview (scaled down)
 */
export function getSheetSpritePreviewStyle(
  sprite: SheetSprite,
  sheetData: SpriteSheetData<{ sprites: SheetSprite[] }>,
  maxSize: number = 48,
): CSSProperties {
  const { meta } = sheetData
  const tileSize = meta.tileWidth ?? 16

  const width = sprite.region.width * tileSize
  const height = sprite.region.height * tileSize
  const scale = Math.min(maxSize / width, maxSize / height, 1)

  const bgX = sprite.region.x * tileSize
  const bgY = sprite.region.y * tileSize

  return {
    width: width * scale,
    height: height * scale,
    backgroundImage: `url(/spritesheets/${meta.src})`,
    backgroundPosition: `-${bgX * scale}px -${bgY * scale}px`,
    backgroundSize: `${meta.width * scale}px ${meta.height * scale}px`,
    backgroundRepeat: "no-repeat",
    imageRendering: "pixelated",
  }
}
