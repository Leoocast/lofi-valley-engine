import type { ReactElement } from "react"

import type { Item } from "@/constants/items"
import { ItemType } from "@/constants/items"
import type { GroundTile } from "@/engine/autotiling/groundAutotiling"
import type { Tool } from "@/engine/store"
import { hasDirtTile } from "@/utils/cropHelpers"

import { getToolConfig } from "@/constants/toolConfigs"
import { TOOL_COLORS } from "@/constants/tools"
import { TILE_SIZE } from "@/engine/rendering/config"
import { getBasePosition } from "@/engine/rendering/visualBoundsAndOffset"

interface ToolHoverOverlayProps {
  mouseTile: { x: number; y: number } | null
  activeTool: Tool | null
  tilledSoil: Map<string, any> // Kept for compatibility but not used
  activeItem: Item | null
  farmWidth: number
  farmHeight: number
  entities: any[] // Para detectar colisiones con árboles
  groundTiles?: Map<string, GroundTile>
}

/**
 * Overlay de hover para mostrar feedback visual de la herramienta activa o semilla
 * Now uses dirt tiles instead of tilledSoil
 */
export const ToolHoverOverlay = ({
  mouseTile,
  activeTool,
  activeItem,
  farmWidth,
  farmHeight,
  entities,
  groundTiles,
}: ToolHoverOverlayProps): ReactElement | null => {
  if (!mouseTile) return null

  // Verificar que el tile está dentro del grid
  if (
    mouseTile.x < 0 ||
    mouseTile.x >= farmWidth ||
    mouseTile.y < 0 ||
    mouseTile.y >= farmHeight
  ) {
    return null // Fuera de bounds
  }

  const hasDirt = hasDirtTile(mouseTile.x, mouseTile.y, groundTiles)

  // Caso especial: Semilla seleccionada
  if (activeItem?.type === ItemType.SEED) {
    // Verificar si hay un árbol/roca FOOTPRINT bloqueando el tile
    const isBlocked = entities.some((e) => {
      if (e.sprite.id !== "tree" && e.sprite.id !== "rock") return false
      // Verificar si el FOOTPRINT del árbol/roca cubre este tile (con baseOffset)
      const basePos = getBasePosition(e)
      return mouseTile.x === basePos.x && mouseTile.y === basePos.y
    })

    // Verificar si hay un crop ya plantado
    const hasCrop = entities.some(
      (e) => e.type === "crop" && e.x === mouseTile.x && e.y === mouseTile.y,
    )

    // Si hay dirt tile y NO hay crop
    if (hasDirt && !hasCrop) {
      return (
        <div
          style={{
            position: "absolute",
            left: mouseTile.x * TILE_SIZE,
            top: mouseTile.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundColor: isBlocked
              ? "rgba(255, 0, 0, 0.3)"
              : TOOL_COLORS.hoe,
            border: "0.2px dashed rgba(255, 255, 255, 0.3)",
            boxSizing: "border-box",
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )
    }
    return null
  }

  // Lógica normal de herramientas
  if (!activeTool) return null

  const toolConfig = getToolConfig(activeTool)
  if (!toolConfig.showTileHover) return null

  // Para hoe: verificar si está bloqueado por árbol/roca footprint
  if (activeTool === "hoe") {
    const isBlocked = entities.some((e) => {
      if (e.sprite.id !== "tree" && e.sprite.id !== "rock") return false
      // Obtener posición real del footprint (con baseOffset si existe)
      const basePos = getBasePosition(e)
      return mouseTile.x === basePos.x && mouseTile.y === basePos.y
    })

    // Solo mostrar si no tiene dirt tile ya
    if (hasDirt) return null

    return (
      <div
        style={{
          position: "absolute",
          left: mouseTile.x * TILE_SIZE,
          top: mouseTile.y * TILE_SIZE,
          width: TILE_SIZE,
          height: TILE_SIZE,
          backgroundColor: isBlocked
            ? "rgba(255, 0, 0, 0.3)"
            : TOOL_COLORS[activeTool],
          border: "0.2px dashed rgba(255, 255, 255, 0.3)",
          boxSizing: "border-box",
          pointerEvents: "none",
          zIndex: 10,
        }}
      />
    )
  }

  // Para pickaxe y wateringCan: solo mostrar si hay dirt tile CON crop
  if (activeTool === "pickaxe" || activeTool === "wateringCan") {
    if (!hasDirt) {
      return null
    }

    // Para watering can: solo mostrar si hay un crop
    if (activeTool === "wateringCan") {
      const hasCrop = entities.some(
        (e) => e.type === "crop" && e.x === mouseTile.x && e.y === mouseTile.y,
      )
      if (!hasCrop) {
        return null
      }
    }
  }

  return (
    <div
      style={{
        position: "absolute",
        left: mouseTile.x * TILE_SIZE,
        top: mouseTile.y * TILE_SIZE,
        width: TILE_SIZE,
        height: TILE_SIZE,
        backgroundColor: TOOL_COLORS[activeTool] || "#fff",
        border: "0.2px dashed rgba(255, 255, 255, 0.3)",
        boxSizing: "border-box",
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  )
}
