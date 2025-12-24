import React from "react"

import "./Minimap.css"

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { Entity } from "@/engine/interfaces/entity"
import type { TilledTile } from "@/engine/store"
import type { MinimapState } from "@/hooks/useMinimap"

import { GROUND_SPRITE } from "@/engine/interfaces/sprites"
import { TILE_SIZE } from "@/engine/rendering/config"
import { FARM_HEIGHT, FARM_WIDTH } from "@/views/laboratory/farm/farm_config"

interface MinimapProps {
  entities: Entity[]
  groundTiles: Map<string, GroundTile>
  tilledSoil?: Map<string, TilledTile> // Optional tilled soil (for farm view)
  minimap: MinimapState
  viewport: {
    viewportRef: React.RefObject<HTMLDivElement>
    offset: { x: number; y: number }
    zoom: number
  }
}

export const Minimap = ({
  entities,
  groundTiles,
  tilledSoil,
  minimap,
  viewport,
}: MinimapProps): React.ReactElement => (
  <div
    {...minimap.divProps}
    className="minimap"
    style={{
      opacity: minimap.minimapHovered ? 1 : 0.4,
      transition: "opacity 0.2s ease",
    }}
  >
    {/* Minimap background grid */}
    <div className="minimap__content">
      {/* Ground tiles */}
      {Array.from(groundTiles.entries()).map(([key, groundTile]) => {
        const [x, y] = key.split("-").map(Number)
        const minimapScale = 200 / (FARM_WIDTH * TILE_SIZE)
        const minimapX = x * TILE_SIZE * minimapScale
        const minimapY = y * TILE_SIZE * minimapScale
        const minimapSize = TILE_SIZE * minimapScale

        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left: minimapX,
              top: minimapY,
              width: minimapSize,
              height: minimapSize,
              background: "#4a9c4a", // Green (groundTile default)
            }}
          />
        )
      })}

      {/* Tilled Soil - only in farm view */}
      {tilledSoil &&
        Array.from(tilledSoil.entries()).map(([key, tile]) => {
          const [x, y] = key.split("-").map(Number)
          const minimapScale = 200 / (FARM_WIDTH * TILE_SIZE)
          const minimapX = x * TILE_SIZE * minimapScale
          const minimapY = y * TILE_SIZE * minimapScale
          const minimapSize = TILE_SIZE * minimapScale

          return (
            <div
              key={`tilled-${key}`}
              style={{
                position: "absolute",
                left: minimapX,
                top: minimapY,
                width: minimapSize,
                height: minimapSize,
                background: GROUND_SPRITE.minimapColor || "#8B4513",
                border: "1px solid rgba(0, 0, 0, 0.2)",
              }}
            />
          )
        })}

      {/* Entities */}
      {entities.map((entity) => {
        const minimapScale = 200 / (FARM_WIDTH * TILE_SIZE)
        const minimapX = entity.x * TILE_SIZE * minimapScale
        const minimapY = entity.y * TILE_SIZE * minimapScale

        // Check for SheetSprite (new format)
        const sheetSprite = (
          entity as Entity & {
            sheetSprite?: {
              collision?: { width: number; height: number }
              minimapColor?: string
            }
          }
        ).sheetSprite

        // Use SheetSprite collision if available, otherwise fall back to old sprite format
        let entityWidth = 1
        let entityHeight = 1
        let entityColor = "rgba(255, 200, 100, 0.9)"

        if (sheetSprite) {
          // New SheetSprite format
          entityWidth = sheetSprite.collision?.width ?? 1
          entityHeight = sheetSprite.collision?.height ?? 1
          entityColor = sheetSprite.minimapColor ?? "rgba(255, 200, 100, 0.9)"
        } else if (entity.sprite) {
          // Old Sprite format
          entityWidth = entity.sprite.baseWidth ?? 1
          entityHeight = entity.sprite.baseHeight ?? 1
          entityColor = entity.sprite.minimapColor ?? "rgba(255, 200, 100, 0.9)"
        }

        const minimapW = Math.max(
          entityWidth * TILE_SIZE * minimapScale * 1.5,
          4,
        )
        const minimapH = Math.max(
          entityHeight * TILE_SIZE * minimapScale * 1.5,
          4,
        )

        return (
          <div
            key={entity.id}
            style={{
              position: "absolute",
              left: minimapX,
              top: minimapY,
              width: minimapW,
              height: minimapH,
              background: entityColor,
              border: "1px solid rgba(255, 255, 255, 0.3)",
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.5)",
            }}
          />
        )
      })}

      {/* Viewport indicator */}
      {viewport.viewportRef.current
        ? (() => {
            const minimapScale = 200 / (FARM_WIDTH * TILE_SIZE)
            const viewportWidth = viewport.viewportRef.current.clientWidth
            const viewportHeight = viewport.viewportRef.current.clientHeight

            const viewportWorldWidth = viewportWidth / viewport.zoom
            const viewportWorldHeight = viewportHeight / viewport.zoom

            // Don't show viewport indicator if it covers the entire world
            const worldPixelWidth = FARM_WIDTH * TILE_SIZE
            const worldPixelHeight = FARM_HEIGHT * TILE_SIZE
            if (
              viewportWorldWidth >= worldPixelWidth &&
              viewportWorldHeight >= worldPixelHeight
            ) {
              return null
            }

            const viewportWorldX = -viewport.offset.x / viewport.zoom
            const viewportWorldY = -viewport.offset.y / viewport.zoom

            let minimapViewX = viewportWorldX * minimapScale
            let minimapViewY = viewportWorldY * minimapScale
            let minimapViewW = viewportWorldWidth * minimapScale
            let minimapViewH = viewportWorldHeight * minimapScale

            // Clamp viewport indicator to stay within minimap bounds
            minimapViewX = Math.max(
              0,
              Math.min(minimapViewX, 200 - minimapViewW),
            )
            minimapViewY = Math.max(
              0,
              Math.min(minimapViewY, 200 - minimapViewH),
            )
            minimapViewW = Math.min(minimapViewW, 200)
            minimapViewH = Math.min(minimapViewH, 200)

            return (
              <div
                style={{
                  position: "absolute",
                  left: minimapViewX,
                  top: minimapViewY,
                  width: minimapViewW,
                  height: minimapViewH,
                  border: "2px solid rgba(255, 255, 255, 0.9)",
                  pointerEvents: "none",
                }}
              />
            )
          })()
        : null}
    </div>
  </div>
)
