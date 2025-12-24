import { useEffect, useMemo, useRef, useState } from "react"

import type { MinimapState } from "./useMinimap"

import { TILE_SIZE } from "@/engine/rendering/config"
import {
  getVisibleBounds,
  type ViewportBounds,
} from "@/engine/rendering/viewportCulling"

import { useMinimap } from "./useMinimap"

/**
 * useViewport: Hook completo y reutilizable para manejar viewport, cámara y panning
 *
 * Gestiona:
 * - Zoom (1.5 a 6.0)
 * - Offset (posición de la cámara)
 * - Panning con botón central del mouse
 * - Zoom con rueda del mouse (mantiene el punto bajo el cursor)
 * - Movimiento con teclado (WASD / Arrow Keys)
 * - Centrado automático del grid al montar
 * - Minimap integrado
 *
 * El hook es completamente independiente y reutilizable en cualquier página.
 */

export interface ViewportState {
  // Estado
  zoom: number
  offset: { x: number; y: number }
  isDragging: boolean

  // Culling
  visibleBounds: ViewportBounds

  // Refs
  viewportRef: React.RefObject<HTMLDivElement>
  worldRef: React.RefObject<HTMLDivElement>

  // Handlers
  handleMouseDown: (e: React.MouseEvent) => void
  handleMouseUp: (e: React.MouseEvent) => void
  handleMouseMove: (e: React.MouseEvent) => void
  handleMouseLeave: () => void
  handleWheel: (e: React.WheelEvent) => void

  // Getters
  getTileFromMouseEvent: (
    e: React.MouseEvent,
  ) => { x: number; y: number } | null

  // Minimap
  minimap: MinimapState
}

export const useViewport = (
  farmWidth: number,
  farmHeight: number,
): ViewportState => {
  // ========== ESTADO ==========
  const [zoom, setZoom] = useState(2.5)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  // ========== REFS ==========
  const viewportRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>
  const worldRef = useRef<HTMLDivElement>(
    null,
  ) as React.RefObject<HTMLDivElement>
  const draggingCamera = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })

  // ========== FUNCIONES AUXILIARES ==========

  /**
   * clampOffset: Limita el offset del viewport para mantener el mundo visible.
   *
   * Usa un margen dinámico basado en el zoom:
   * - Zoom bajo (1.5): 100% de margen = libertad para mover
   * - Zoom medio (2.5): 60% de margen = balance
   * - Zoom alto (6.0): 25% de margen = más restrictivo
   *
   * Esto permite explorar más libremente cuando estás alejado,
   * pero mantiene el mundo en pantalla cuando haces zoom in.
   */
  const clampOffset = (
    offsetX: number,
    offsetY: number,
    currentZoom: number,
  ): { x: number; y: number } => {
    if (!viewportRef.current) return { x: offsetX, y: offsetY }

    const viewportWidth = viewportRef.current.clientWidth
    const viewportHeight = viewportRef.current.clientHeight
    const worldWidth = farmWidth * TILE_SIZE * currentZoom
    const worldHeight = farmHeight * TILE_SIZE * currentZoom

    // More restricted movement - tighter bounds
    // At zoom 0.5: 100% margin (moderate freedom)
    // At zoom 1.5: 67% margin (tighter)
    // At zoom 4: 50% margin (very tight)
    const zoomFactor = Math.max(0.5, Math.min(1.0, 1.0 / currentZoom))

    // Apply margins regardless of world size
    const marginX = viewportWidth * zoomFactor
    const minOffsetX = viewportWidth - worldWidth - marginX
    const maxOffsetX = marginX
    const newOffsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX))

    const marginY = viewportHeight * zoomFactor
    const minOffsetY = viewportHeight - worldHeight - marginY
    const maxOffsetY = marginY
    const newOffsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY))

    return { x: newOffsetX, y: newOffsetY }
  }

  // ========== EFECTOS: INICIALIZACIÓN Y KEYBOARD ==========
  /**
   * Center grid on mount
   */
  useEffect(() => {
    if (viewportRef.current) {
      const viewportWidth = viewportRef.current.clientWidth
      const viewportHeight = viewportRef.current.clientHeight
      const worldWidth = farmWidth * TILE_SIZE * zoom
      const worldHeight = farmHeight * TILE_SIZE * zoom

      const centerX = (viewportWidth - worldWidth) / 2
      const centerY = (viewportHeight - worldHeight) / 2

      setOffset({ x: centerX, y: centerY })
    }
  }, [])

  /**
   * Keyboard navigation (WASD / Arrow Keys)
   * Smooth animation loop for camera movement
   */
  useEffect(() => {
    const pressedKeys = new Set<string>()

    function handleKeyDown(e: KeyboardEvent) {
      // Ignore if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return
      }

      const key = e.key.toLowerCase()
      if (["w", "a", "s", "d"].includes(key)) {
        e.preventDefault()
        pressedKeys.add(key)
      }
    }

    function handleKeyUp(e: KeyboardEvent) {
      const key = e.key.toLowerCase()
      pressedKeys.delete(key)
    }

    // Animation loop for smooth movement
    let animationId: number
    function updateCamera() {
      const panSpeed = 10 // pixels per frame
      let deltaX = 0
      let deltaY = 0

      if (pressedKeys.has("w") || pressedKeys.has("arrowup")) deltaY += panSpeed
      if (pressedKeys.has("s") || pressedKeys.has("arrowdown"))
        deltaY -= panSpeed
      if (pressedKeys.has("a") || pressedKeys.has("arrowleft"))
        deltaX += panSpeed
      if (pressedKeys.has("d") || pressedKeys.has("arrowright"))
        deltaX -= panSpeed

      if (deltaX !== 0 || deltaY !== 0) {
        setOffset((prev) => {
          const newX = prev.x + deltaX
          const newY = prev.y + deltaY
          return clampOffset(newX, newY, zoom)
        })
      }

      animationId = requestAnimationFrame(updateCamera)
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    animationId = requestAnimationFrame(updateCamera)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationId)
    }
  }, [zoom])

  // ========== MANEJADORES DE EVENTOS ==========

  /**
   * handleMouseDown: Inicia panning con botón central del mouse
   */
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 1) {
      // Botón central
      draggingCamera.current = true
      setIsDragging(true)
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
  }

  /**
   * handleMouseUp: Termina panning
   */
  const handleMouseUp = (e: React.MouseEvent) => {
    if (e.button === 1) {
      draggingCamera.current = false
      setIsDragging(false)
    }
  }

  /**
   * handleMouseLeave: Termina panning si se sale del viewport
   */
  const handleMouseLeave = () => {
    draggingCamera.current = false
    setIsDragging(false)
  }

  /**
   * handleMouseMove: Aplica panning cuando se arrastra con botón central
   */
  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCamera.current) {
      const dx = e.clientX - lastPos.current.x
      const dy = e.clientY - lastPos.current.y
      setOffset((o) => {
        const newX = o.x + dx
        const newY = o.y + dy
        return clampOffset(newX, newY, zoom)
      })
      lastPos.current = { x: e.clientX, y: e.clientY }
    }
  }

  /**
   * handleWheel: Maneja el zoom con la rueda del mouse.
   *
   * Implementa "zoom hacia el cursor" manteniendo el punto del mundo
   * bajo el mouse en la misma posición de pantalla después del zoom.
   *
   * 1. Obtiene posición del mouse en viewport
   * 2. Convierte a coordenadas del mundo (antes del zoom)
   * 3. Calcula nuevo offset para que ese punto siga bajo el mouse
   * 4. Aplica clampOffset para mantener bounds
   */
  const handleWheel = (e: React.WheelEvent) => {
    if (!viewportRef.current) return

    const amount = e.deltaY > 0 ? -0.2 : 0.2
    const newZoom = Math.min(6, Math.max(1.5, zoom + amount))

    // Get mouse position relative to viewport
    const rect = viewportRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Calculate mouse position in world coordinates before zoom
    const worldX = (mouseX - offset.x) / zoom
    const worldY = (mouseY - offset.y) / zoom

    // Calculate new offset to keep the same world point under the mouse
    const newOffsetX = mouseX - worldX * newZoom
    const newOffsetY = mouseY - worldY * newZoom

    const clamped = clampOffset(newOffsetX, newOffsetY, newZoom)
    setZoom(newZoom)
    setOffset(clamped)
  }

  /**
   * getTileFromMouseEvent: Convierte coordenadas del mouse a tile en el mundo
   */
  const getTileFromMouseEvent = (
    e: React.MouseEvent,
  ): { x: number; y: number } | null => {
    if (!worldRef.current) return null

    const rect = worldRef.current.getBoundingClientRect()
    const localX = (e.clientX - rect.left) / zoom
    const localY = (e.clientY - rect.top) / zoom

    const tileX = Math.floor(localX / TILE_SIZE)
    const tileY = Math.floor(localY / TILE_SIZE)

    if (tileX >= 0 && tileX < farmWidth && tileY >= 0 && tileY < farmHeight) {
      return { x: tileX, y: tileY }
    }

    return null
  }
  // ========== VIEWPORT CULLING ==========
  // Track viewport dimensions for culling calculations
  const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 })

  // Update viewport size on mount and resize
  useEffect(() => {
    const updateSize = () => {
      if (viewportRef.current) {
        setViewportSize({
          width: viewportRef.current.clientWidth,
          height: viewportRef.current.clientHeight,
        })
      }
    }

    updateSize()
    window.addEventListener("resize", updateSize)
    return () => window.removeEventListener("resize", updateSize)
  }, [])

  // Calculate visible bounds (memoized to avoid recalc on every render)
  const visibleBounds = useMemo(
    () =>
      getVisibleBounds(
        viewportSize.width,
        viewportSize.height,
        offset.x,
        offset.y,
        zoom,
        farmWidth,
        farmHeight,
        3, // margin of 3 tiles to prevent pop-in
      ),
    [
      viewportSize.width,
      viewportSize.height,
      offset.x,
      offset.y,
      zoom,
      farmWidth,
      farmHeight,
    ],
  )

  // ========== MINIMAP ==========
  const minimap = useMinimap(
    farmWidth,
    farmHeight,
    zoom,
    offset,
    viewportRef,
    setOffset,
    setZoom,
    clampOffset,
  )

  return {
    // Estado
    zoom,
    offset,
    isDragging,

    // Culling
    visibleBounds,

    // Refs
    viewportRef,
    worldRef,

    // Handlers
    handleMouseDown,
    handleMouseUp,
    handleMouseMove,
    handleMouseLeave,
    handleWheel,

    // Getters
    getTileFromMouseEvent,

    // Minimap
    minimap,
  }
}
