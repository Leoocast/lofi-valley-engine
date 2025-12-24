import React, { useCallback, useEffect, useRef } from "react"

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"

import {
  drawLayer,
  findChangedKeys,
  getSpritesheetSources,
  updateTiles,
} from "@/engine/rendering/canvasGroundRenderer"
import { TILE_SIZE } from "@/engine/rendering/config"
import { preloadSpritesheets } from "@/engine/rendering/spritesheetLoader"

interface CanvasLayersProps {
  width: number
  height: number
  groundTiles: Map<string, GroundTile>
}

/**
 * CanvasLayers - Memoized canvas rendering
 * Only re-renders when groundTiles changes, NOT on mouse move
 */
const CanvasLayers = React.memo<CanvasLayersProps>(
  ({ width, height, groundTiles }) => {
    const layer0Ref = useRef<HTMLCanvasElement>(null)
    const layer1Ref = useRef<HTMLCanvasElement>(null)
    const layer2Ref = useRef<HTMLCanvasElement>(null)
    const layer3Ref = useRef<HTMLCanvasElement>(null)
    const spritesLoadedRef = useRef(false)
    const prevTilesRef = useRef<Map<string, GroundTile> | null>(null)

    const canvasWidth = width * TILE_SIZE
    const canvasHeight = height * TILE_SIZE

    const renderAllLayers = useCallback(() => {
      if (!spritesLoadedRef.current) return

      const layers = [layer0Ref, layer1Ref, layer2Ref, layer3Ref]
      layers.forEach((ref, index) => {
        const canvas = ref.current
        if (!canvas) return
        const ctx = canvas.getContext("2d")
        if (!ctx) return
        drawLayer(ctx, groundTiles, index)
      })
    }, [groundTiles])

    const renderIncrementally = useCallback(
      (changedKeys: Set<string>) => {
        if (!spritesLoadedRef.current) return

        const layers = [layer0Ref, layer1Ref, layer2Ref, layer3Ref]
        layers.forEach((ref, index) => {
          const canvas = ref.current
          if (!canvas) return
          const ctx = canvas.getContext("2d")
          if (!ctx) return
          updateTiles(ctx, changedKeys, groundTiles, index)
        })
      },
      [groundTiles],
    )

    // Track sprites loaded as state to trigger re-render when ready
    const [spritesReady, setSpritesReady] = React.useState(false)

    // Preload spritesheets once on mount
    useEffect(() => {
      preloadSpritesheets(getSpritesheetSources()).then(() => {
        spritesLoadedRef.current = true
        setSpritesReady(true) // Trigger re-render
      })
    }, [])

    // Render/update when groundTiles changes OR when sprites become ready
    useEffect(() => {
      if (!spritesReady) return

      const prev = prevTilesRef.current
      if (prev) {
        const changedKeys = findChangedKeys(prev, groundTiles)
        if (changedKeys.size > 0 && changedKeys.size < 100) {
          // Incremental update for small changes
          renderIncrementally(changedKeys)
        } else if (changedKeys.size >= 100) {
          // Full redraw for large changes
          renderAllLayers()
        }
        // No changes = no render
      } else {
        // First render after sprites loaded
        renderAllLayers()
      }
      // Deep copy: create new objects for each tile to prevent mutation issues
      const deepCopy = new Map<string, GroundTile>()
      for (const [k, tile] of groundTiles) {
        deepCopy.set(k, { layers: [...tile.layers] })
      }
      prevTilesRef.current = deepCopy
    }, [groundTiles, spritesReady, renderAllLayers, renderIncrementally])

    return (
      <>
        <canvas
          ref={layer0Ref}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            imageRendering: "pixelated",
          }}
        />
        <canvas
          ref={layer1Ref}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            imageRendering: "pixelated",
          }}
        />
        <canvas
          ref={layer2Ref}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            imageRendering: "pixelated",
          }}
        />
        <canvas
          ref={layer3Ref}
          width={canvasWidth}
          height={canvasHeight}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            imageRendering: "pixelated",
          }}
        />
      </>
    )
  },
)

CanvasLayers.displayName = "CanvasLayers"

interface GridProps {
  width: number
  height: number
  groundTiles: Map<string, GroundTile>
  mode: string
  mouseTile: { x: number; y: number } | null
  showGrid: boolean
  brushSize: number
  selectedGroundTile: number
}

/**
 * Grid Component (Canvas-based)
 *
 * Uses HTML5 Canvas for efficient tile rendering.
 * Canvas layers are memoized separately from brush preview.
 */
export const Grid = React.memo<GridProps>(
  ({ width, height, groundTiles, mode, mouseTile, showGrid, brushSize }) => {
    const canvasWidth = width * TILE_SIZE
    const canvasHeight = height * TILE_SIZE

    return (
      <React.Fragment>
        {/* Canvas layers container */}
        <div
          style={{
            position: "absolute",
            width: canvasWidth,
            height: canvasHeight,
            userSelect: "none",
          }}
        >
          {/* Memoized canvas layers - only update on groundTiles change */}
          <CanvasLayers
            width={width}
            height={height}
            groundTiles={groundTiles}
          />

          {/* Brush preview overlay - updates on mouse move */}
          {mode === "paint" &&
            mouseTile &&
            (() => {
              const radius = Math.floor(brushSize / 2)
              const previewTiles = []

              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const tx = mouseTile.x + dx
                  const ty = mouseTile.y + dy

                  if (tx >= 0 && tx < width && ty >= 0 && ty < height) {
                    previewTiles.push({ x: tx, y: ty })
                  }
                }
              }

              return previewTiles.map((tile) => (
                <div
                  key={`brush-${tile.x}-${tile.y}`}
                  style={{
                    position: "absolute",
                    left: tile.x * TILE_SIZE,
                    top: tile.y * TILE_SIZE,
                    width: TILE_SIZE,
                    height: TILE_SIZE,
                    boxShadow: "inset 0 0 0 2px rgba(255, 255, 0, 0.5)",
                    pointerEvents: "none",
                    zIndex: 9999,
                  }}
                />
              ))
            })()}
        </div>

        {/* Grid lines overlay */}
        {showGrid && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `
                linear-gradient(0deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 255, 255, 0.15) 1px, transparent 1px)
              `,
              backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
              pointerEvents: "none",
              zIndex: 100,
            }}
          />
        )}
      </React.Fragment>
    )
  },
)

Grid.displayName = "Grid"
