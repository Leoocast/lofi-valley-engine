import { useState } from "react"

import { TILE_SIZE } from "@/engine/rendering/config"

/**
 * Hook para trackear la posición del mouse en coordenadas de tiles.
 * Permite tiles negativos para soportar entidades que se extienden fuera del grid.
 */
export const useMouseTilePosition = (
  worldRef: React.RefObject<HTMLDivElement>, // Changed RefObject to React.RefObject
  zoom: number,
  gridWidth: number, // Renamed from farmWidth
  gridHeight: number, // Renamed from farmHeight
) => {
  const [mouseTile, setMouseTile] = useState<{ x: number; y: number } | null>(
    null,
  )

  const handleMouseMove = (e: React.MouseEvent) => {
    // Removed useCallback
    if (!worldRef.current) return

    const rect = worldRef.current.getBoundingClientRect()

    // Mouse position relative to world container
    const mouseX = (e.clientX - rect.left) / zoom // Renamed localX to mouseX
    const mouseY = (e.clientY - rect.top) / zoom // Renamed localY to mouseY

    // Convert to tile coordinates (permitir negativos)
    const tileX = Math.floor(mouseX / TILE_SIZE)
    const tileY = Math.floor(mouseY / TILE_SIZE)

    setMouseTile({ x: tileX, y: tileY }) // Removed the if/else bounds check
  }

  return { mouseTile, handleMouseMove }
}
