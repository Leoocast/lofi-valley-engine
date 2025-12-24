import { useCallback, useState } from "react"

import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { ViewportState } from "@/hooks/useViewport"

import { paintBlobArea } from "@/engine/autotiling/blobAutotiling"

interface UsePaintModeProps {
  mouseTile: { x: number; y: number } | null
  farmWidth: number
  farmHeight: number
  mode: string
  viewport: ViewportState
  onPaint: (
    paintFn: (tiles: Map<string, GroundTile>) => Map<string, GroundTile>,
  ) => void
}

interface UsePaintModeReturn {
  isPainting: boolean
  selectedGroundTile: number
  setSelectedGroundTile: (tile: number) => void
  activeLayer: number
  setActiveLayer: (layer: number) => void
  brushSize: number
  setBrushSize: (size: number) => void
  paintTile: (
    tiles: Map<string, GroundTile>,
    tilePos?: { x: number; y: number },
  ) => Map<string, GroundTile>
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
}

export function usePaintMode({
  mouseTile,
  farmWidth,
  farmHeight,
  mode,
  viewport,
  onPaint,
}: UsePaintModeProps): UsePaintModeReturn {
  const [isPainting, setIsPainting] = useState(false)
  const [selectedGroundTile, setSelectedGroundTile] = useState(0)
  const [activeLayer, setActiveLayer] = useState(0) // 0 = base, 1 = detail
  const [brushSize, setBrushSize] = useState(1)

  const paintTile = (
    tiles: Map<string, GroundTile>,
    tilePos?: { x: number; y: number },
  ) => {
    const pos = tilePos ?? mouseTile
    if (pos) {
      const radius = Math.floor(brushSize / 2)

      // Use blob autotiling for all terrain types (0-4) and eraser (-1)
      if (selectedGroundTile >= 0 || selectedGroundTile === -1) {
        return paintBlobArea(
          pos.x,
          pos.y,
          radius,
          selectedGroundTile,
          activeLayer,
          tiles,
          farmWidth,
          farmHeight,
        )
      }
    }
    return tiles
  }

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0 && mode === "paint") {
        setIsPainting(true)
        // Paint immediately on click
        if (mouseTile) {
          onPaint((prev) => paintTile(prev, mouseTile))
        }
      }
    },
    [mode, mouseTile, onPaint, paintTile],
  )

  const handleMouseUp = useCallback(
    (e: React.MouseEvent) => {
      if (e.button === 0 && mode === "paint") {
        setIsPainting(false)
      }
    },
    [mode],
  )

  const handleMouseLeave = useCallback(() => {
    setIsPainting(false)
  }, [])

  return {
    activeLayer,
    brushSize,
    handleMouseDown,
    handleMouseLeave,
    handleMouseUp,
    isPainting,
    paintTile,
    selectedGroundTile,
    setActiveLayer,
    setBrushSize,
    setSelectedGroundTile,
  }
}
