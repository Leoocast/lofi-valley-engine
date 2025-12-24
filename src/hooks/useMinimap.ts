import { useRef, useState } from "react"

import { TILE_SIZE } from "@/engine/rendering/config"

export interface MinimapProps {
  ref: React.RefObject<HTMLDivElement | null>
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseDown: (e: React.MouseEvent) => void
  onMouseMove: (e: React.MouseEvent) => void
  onMouseUp: () => void
  onClick: (e: React.MouseEvent) => void
  onWheel: (e: React.WheelEvent) => void
  style: React.CSSProperties
  children: React.ReactNode
}

export interface MinimapState {
  minimapRef: React.RefObject<HTMLDivElement | null>
  minimapHovered: boolean
  minimapDragging: boolean
  divProps: Omit<MinimapProps, "style" | "children">
}

export const useMinimap = (
  farmWidth: number,
  farmHeight: number,
  viewportZoom: number,
  viewportOffset: { x: number; y: number },
  viewportRef: React.RefObject<HTMLDivElement>,
  setOffset: (offset: { x: number; y: number }) => void,
  setZoom: (zoom: number) => void,
  clampOffset: (x: number, y: number, z: number) => { x: number; y: number },
): MinimapState => {
  const minimapRef = useRef<HTMLDivElement>(null)
  const [minimapHovered, setMinimapHovered] = useState(false)
  const [minimapDragging, setMinimapDragging] = useState(false)
  const minimapHasMoved = useRef(false)

  const minimapScale = 200 / (farmWidth * TILE_SIZE)

  const divProps: Omit<MinimapProps, "style" | "children"> = {
    ref: minimapRef,
    onMouseEnter: () => setMinimapHovered(true),
    onMouseLeave: () => setMinimapHovered(false),
    onMouseDown: (e) => {
      if (e.button === 0) {
        setMinimapDragging(true)
        minimapHasMoved.current = false
        e.preventDefault()
      }
    },
    onMouseMove: (e) => {
      if (minimapDragging) {
        minimapHasMoved.current = true
        const rect = minimapRef.current?.getBoundingClientRect()
        if (!rect || !viewportRef.current) return

        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top

        const worldX = mouseX / minimapScale
        const worldY = mouseY / minimapScale

        const viewportWidth = viewportRef.current.clientWidth
        const viewportHeight = viewportRef.current.clientHeight

        const newOffsetX = viewportWidth / 2 - worldX * viewportZoom
        const newOffsetY = viewportHeight / 2 - worldY * viewportZoom

        const clamped = clampOffset(newOffsetX, newOffsetY, viewportZoom)
        setOffset(clamped)
      }
    },
    onMouseUp: () => {
      setMinimapDragging(false)
    },
    onClick: (e) => {
      if (minimapHasMoved.current) {
        minimapHasMoved.current = false
        return
      }

      const rect = minimapRef.current?.getBoundingClientRect()
      if (!rect || !viewportRef.current) return

      const clickX = e.clientX - rect.left
      const clickY = e.clientY - rect.top

      const worldClickX = clickX / minimapScale
      const worldClickY = clickY / minimapScale

      const viewportWidth = viewportRef.current.clientWidth
      const viewportHeight = viewportRef.current.clientHeight

      const newOffsetX = viewportWidth / 2 - worldClickX * viewportZoom
      const newOffsetY = viewportHeight / 2 - worldClickY * viewportZoom

      const clamped = clampOffset(newOffsetX, newOffsetY, viewportZoom)
      setOffset(clamped)
    },
    onWheel: (e) => {
      const amount = e.deltaY > 0 ? -0.2 : 0.2
      const newZoom = Math.min(4, Math.max(0.5, viewportZoom + amount))
      setZoom(newZoom)
    },
  }

  return {
    minimapRef,
    minimapHovered,
    minimapDragging,
    divProps,
  }
}
